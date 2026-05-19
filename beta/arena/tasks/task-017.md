# Task 017: Cycle 12 — 实现 `rs coverage` 命令 (dev-1)

**来源**: decision-012.md — 功能补齐：coverage 命令
**截止**: 本轮结束前
**周期**: Cycle 12
**执行者**: dev-1 🧪

---

## 任务: 实现 `repo-sense coverage` 命令

### 背景

vitest 已经配置了 coverage 报告器（text, json, lcov, html），`npm run coverage` 运行正常。但是缺少一个 CLI 命令来展示覆盖率面板。

### 实现步骤

#### Step 1: 创建 `src/commands/coverage.ts`

新建文件，实现以下功能：

**主逻辑 `coverageCommand()`:**

1. 检查 `coverage/coverage-summary.json` 是否存在
   - 如果不存在 → 提示运行 `npm run coverage` 或自动触发
   - 如果存在但过时 → 提示是否需要重跑

2. 解析 JSON 获取文件级覆盖率
   ```json
   {
     "total": {
       "lines": { "pct": 85.7 },
       "branches": { "pct": 72.3 },
       "functions": { "pct": 91.2 },
       "statements": { "pct": 83.1 }
     },
     "src/github.ts": {
       "lines": { "pct": 97.14 },
       ...
     },
     ...
   }
   ```

3. 用 cli-table3 绘制覆盖率面板

**设计:**

```typescript
// src/commands/coverage.ts
import chalk from 'chalk';
import Table from 'cli-table3';

interface CoverageSummary {
  total: {
    lines: { pct: number };
    branches: { pct: number };
    functions: { pct: number };
    statements: { pct: number };
  };
  [filePath: string]: {
    lines: { pct: number };
    branches: { pct: number };
    functions: { pct: number };
    statements: { pct: number };
  } | undefined;
}

function pctColor(pct: number): string {
  if (pct >= 80) return chalk.green(`${pct.toFixed(1)}% 🟢`);
  if (pct >= 60) return chalk.yellow(`${pct.toFixed(1)}% 🟡`);
  return chalk.red(`${pct.toFixed(1)}% 🔴`);
}

function renderCoverage(summary: CoverageSummary): void {
  // 1. 标题
  console.log(chalk.bold('\n🧬  Test Coverage Report\n'));

  // 2. 综合覆盖率
  const total = summary.total;
  console.log(chalk.bold('📊  Overall Coverage:'));
  console.log(`  Lines:      ${pctColor(total.lines.pct)}`);
  console.log(`  Branches:   ${pctColor(total.branches.pct)}`);
  console.log(`  Functions:  ${pctColor(total.functions.pct)}`);
  console.log(`  Statements: ${pctColor(total.statements.pct)}`);

  // 3. 文件级面板
  const table = new Table({
    head: [
      chalk.bold('File'),
      chalk.bold('Lines'),
      chalk.bold('Branches'),
      chalk.bold('Functions'),
      chalk.bold('Statements'),
    ],
    style: { head: [], border: [] },
  });

  for (const [filePath, fileData] of Object.entries(summary)) {
    if (filePath === 'total' || !fileData) continue;
    // 只显示 src/ 下的文件
    if (!filePath.startsWith('src/')) continue;

    table.push([
      chalk.cyan(filePath.replace('src/', '')),
      pctColor(fileData.lines.pct),
      pctColor(fileData.branches.pct),
      pctColor(fileData.functions.pct),
      pctColor(fileData.statements.pct),
    ]);
  }

  console.log(table.toString());

  // 4. 阈值提醒
  const config = getCoverageConfig(); // 从 vitest.config.ts 读取阈值
  if (config) {
    const warnings: string[] = [];
    if (total.lines.pct < config.lines) warnings.push(`Lines: ${total.lines.pct}% < ${config.lines}%`);
    if (total.branches.pct < config.branches) warnings.push(`Branches: ${total.branches.pct}% < ${config.branches}%`);
    if (total.functions.pct < config.functions) warnings.push(`Functions: ${total.functions.pct}% < ${config.functions}%`);
    if (total.statements.pct < config.statements) warnings.push(`Statements: ${total.statements.pct}% < ${config.statements}%`);
    
    if (warnings.length > 0) {
      console.log(chalk.yellow('\n⚠️  Threshold Warnings:'));
      warnings.forEach(w => console.log(chalk.yellow(`  ${w}`)));
    } else {
      console.log(chalk.green('\n✅  All coverage thresholds met!'));
    }
  }
}

export async function coverageCommand(options: { run?: boolean }): Promise<void> {
  const coveragePath = './coverage/coverage-summary.json';
  
  // 如果 --run 或文件不存在，自动运行 vitest
  if (options.run !== false) {
    console.log(chalk.dim('⏳ Running tests with coverage...'));
    const { execSync } = await import('child_process');
    try {
      execSync('npx vitest run --coverage --reporter=json', {
        stdio: 'pipe',
        encoding: 'utf-8',
      });
    } catch {
      // vitest 的 coverage 即使测试失败也会输出
    }
  }

  // 读取 JSON
  const fs = await import('fs');
  if (!fs.existsSync(coveragePath)) {
    console.error(chalk.red('✗ Coverage summary not found. Run `npm run coverage` first.'));
    process.exit(1);
  }

  const raw = fs.readFileSync(coveragePath, 'utf-8');
  const summary: CoverageSummary = JSON.parse(raw);
  renderCoverage(summary);
}
```

#### Step 2: 注册到 `src/index.ts`

在 insight 命令后面添加：

```typescript
import { coverageCommand } from './commands/coverage.js';

// ...

program
  .command('coverage')
  .description('Show test coverage dashboard')
  .option('--no-run', 'Skip running tests, only parse existing coverage report')
  .action(async (options: { run: boolean }) => {
    try {
      await coverageCommand(options);
    } catch (err: any) {
      console.error(`✗ Error: ${err.message}`);
      process.exit(1);
    }
  });
```

#### Step 3: 验收

```bash
# 先跑 coverage 生成 JSON
npm run coverage

# 测试 coverage 命令
node dist/index.js coverage

# 测试 --no-run 模式（只读已有 JSON）
node dist/index.js coverage --no-run

# 测试不破坏
npm test
# → 81+ passed, 0 failed

# Build 通过
npm run build
```

---

## 不要碰什么

- ❌ 不要添加新依赖（child_process, fs 是 node builtin）
- ❌ 不要修改 `watch.ts` / `github.ts` 的逻辑
- ❌ 不要尝试实际 npm publish
- ✅ coverage.ts + index.ts 注册 + test

---

## 验收标准

1. ✅ `node dist/index.js coverage` → 彩色覆盖率面板
2. ✅ `node dist/index.js coverage --no-run` → 只读 JSON
3. ✅ `npm test` → 全绿
4. ✅ `npm run build` → 通过
5. ✅ `npm pack --dry-run` → 包含新文件

---

*dev-1, 这是 beta 团队最后一块拼图了。dev-2 已经把 npm 发版流水线搭好了，就差你这个 coverage 命令。写好它，我们就能 pack 一个完整的 npm 包出去。冲！🚀*
