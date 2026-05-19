# Task 015: Cycle 11 — 实现 `repo-sense coverage` 命令 (dev-1)

**来源**: decision-011.md — 方向 B: coverage dashboard 命令
**截止**: 本轮结束前
**周期**: Cycle 11
**执行者**: dev-1 🧪

---

## 任务: `repo-sense coverage` 新命令

在 `src/` 下新建 `commands/coverage.ts`，在 `src/index.ts` 注册，让 `rs coverage` 显示一个彩色的测试覆盖率面板。

### 架构参考

参考 `src/commands/stars.ts` 和 `src/commands/history.ts` 的编写风格：
- 导出一个 `coverageCommand` 函数
- 使用 shared `chalk` + `cli-table3` 渲染
- 使用 `ora` spinner 显示加载状态

### Step 1: 创建 `src/commands/coverage.ts`

```typescript
import chalk from 'chalk';
import Table from 'cli-table3';
import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';
import ora from 'ora';

export async function coverageCommand() {
  const spinner = ora('Running tests with coverage…').start();

  try {
    // 1. Run vitest with coverage, output json
    execSync('npx vitest run --coverage --reporter=json --outputFile=coverage/coverage-summary.json', {
      stdio: 'pipe',
      timeout: 120_000,
    });

    spinner.succeed('Tests passed! Generating coverage report…');

    // 2. Read the coverage summary
    const summaryPath = resolve(process.cwd(), 'coverage', 'coverage-summary.json');
    if (!existsSync(summaryPath)) {
      console.log(chalk.yellow('⚠ Coverage summary not found — check coverage directory.'));
      return;
    }

    const summary = JSON.parse(readFileSync(summaryPath, 'utf-8'));
    const { total } = summary;

    if (!total) {
      console.log(chalk.yellow('⚠ No coverage data in summary.'));
      return;
    }

    // 3. Render coverage dashboard
    renderCoverageDashboard(total);

    // 4. Show per-file breakdown
    const fileEntries = Object.entries(summary).filter(([key]) => key !== 'total');
    if (fileEntries.length > 0) {
      renderFileTable(fileEntries as [string, any][]);
    }

  } catch (err: any) {
    spinner.fail('Coverage run failed');
    console.error(chalk.red(err.stderr || err.message));
    process.exit(1);
  }
}

function pctColor(val: number): string {
  const s = val.toFixed(1) + '%';
  if (val >= 80) return chalk.green(s);
  if (val >= 60) return chalk.yellow(s);
  return chalk.red(s);
}

function bar(val: number): string {
  const width = 10;
  const filled = Math.round((val / 100) * width);
  const bar = '█'.repeat(filled) + '░'.repeat(width - filled);
  return bar;
}

function renderCoverageDashboard(total: any) {
  const dashboard = new Table({
    style: { head: [], border: [] },
    chars: { 'top': '─', 'top-mid': '┬', 'top-left': '┌', 'top-right': '┐',
             'bottom': '─', 'bottom-mid': '┴', 'bottom-left': '└', 'bottom-right': '┘',
             'left': '│', 'left-mid': '├', 'mid': '─', 'mid-mid': '┼',
             'right': '│', 'right-mid': '┤' },
  });

  const rows = ['lines', 'statements', 'functions', 'branches'].map(key => {
    const m = total[key];
    const pct = (m.pct ?? m.covered / m.total * 100) || 0;
    return [
      chalk.bold(key.charAt(0).toUpperCase() + key.slice(1)),
      m.covered + '/' + m.total,
      pctColor(pct),
      chalk.dim(bar(pct)),
    ];
  });

  dashboard.push(
    [chalk.bold.cyan('\n📊 Coverage Overview\n'), { colSpan: 4, content: chalk.dim('───') }],
  );
  rows.forEach(r => dashboard.push(r));

  console.log(dashboard.toString());
}

function renderFileTable(entries: [string, any][]) {
  const table = new Table({
    head: [chalk.bold('File'), chalk.bold('Lines'), chalk.bold('Branches'), chalk.bold('Functions')],
    style: { head: ['cyan'], border: ['gray'] },
    chars: { 'mid': '', 'left-mid': '', 'mid-mid': '', 'right-mid': '' },
  });

  for (const [file, data] of entries.slice(0, 20)) {
    const short = file.replace(/^.*src\//, 'src/');
    table.push([
      chalk.dim(short),
      pctColor(data.lines.pct),
      pctColor(data.branches.pct),
      pctColor(data.functions.pct),
    ]);
  }

  if (entries.length > 20) {
    table.push([chalk.dim(`… and ${entries.length - 20} more files`), '', '', '']);
  }

  console.log(chalk.bold('\n📁 Per-File Breakdown\n'));
  console.log(table.toString());
}
```

### Step 2: 注册到 `src/index.ts`

在 index.ts 中找到 imports 区域，添加:
```typescript
import { coverageCommand } from './commands/coverage.js';
```

在 `rv.program` 链中添加:
```typescript
rv.program
  .command('coverage')
  .description('Show test coverage dashboard')
  .action(async () => {
    await coverageCommand();
  });
```

### Step 3: 验证

```bash
npm run build        # should pass
node dist/index.js coverage   # should show coverage dashboard
```

### 关键原则

1. **不要重复读取覆盖率 JSON 的模式** — 每次 `rs coverage` 都要现跑 vitest
2. **颜色编码** — >80% 绿, >60% 黄, <60% 红
3. **文件列表** — 按字母序，最多显示 20 个文件
4. **错误处理** — vitest 超时或失败给出友好提示

### 不要碰什么

- ❌ 不要修改现有命令逻辑
- ❌ 不要添加额外 npm 依赖
- ✅ 只新建 `src/commands/coverage.ts` + 改 `src/index.ts`

---

*dev-1, 这将是 repo-sense 第 9 个命令，也是首个自带质量量化的命令——让仲裁者看到我们不只是写功能，还在管质量。🚀*
