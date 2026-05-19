# Task 006: 源文件修复 + Cycle 5 落地

**来源**: decision-006.md
**截止**: 本轮结束前
**周期**: Cycle 6

---

## 给 dev-1: 源文件修复 + 新功能 + 版本落地

### 1. 修复 `src/index.ts`

**前提**: `dist/index.js` 第 245-281 行包含了 `src/index.ts` 的 bundle 版本，可以作为反编译参考。

**要求**: 在 `src/index.ts` 中重建完整的 CLI 入口，包含：

- `run()` 函数导出（测试要 `import { run }` ）
- 三个命令：`watch` + `battle` + `stars`
- `watch` 命令支持 `-i/--interval` 选项
- 所有命令的 AbortSignal + process.on('SIGINT') 处理
- VITEST 环境检查守卫（避免测试引入时自动执行）

参考 `dist/index.js` 第 245-281 行的 CLI 结构：

```typescript
import { Command } from 'commander';
import { watchRepo, renderDashboard, battleRepos, renderBattle } from './commands/watch.js';
import { starsCommand } from './commands/stars.js';

export async function run(): Promise<void> {
  const program = new Command();

  program
    .name('rs')
    .description('🧬 repo-sense — Beautiful GitHub repo intelligence from your terminal')
    .version('0.2.0');  // ← 注意 0.2.0，不是 0.1.0

  // watch 命令（从 dist 反编译）
  program
    .command('watch <repo>')
    .description('Watch a repository with live-updating metrics dashboard')
    .option('-i, --interval <seconds>', 'Polling interval in seconds', '30')
    .action(async (repo: string, options: { interval: string }) => {
      const interval = parseInt(options.interval, 10) || 30;
      const abortController = new AbortController();
      process.on('SIGINT', () => abortController.abort());
      try {
        await watchRepo(repo, (snapshot, previous) => renderDashboard(snapshot, previous), interval, abortController.signal);
      } catch (err: any) {
        console.error(`✗ Error: ${err.message}`);
        process.exit(1);
      }
    });

  // battle 命令（从 dist 反编译）
  program
    .command('battle <repo1> <repo2>')
    .description('Compare two repositories head-to-head')
    .action(async (repo1: string, repo2: string) => {
      try {
        const result = await battleRepos(repo1, repo2);
        renderBattle(result);
      } catch (err: any) {
        console.error(`✗ Error: ${err.message}`);
        process.exit(1);
      }
    });

  // stars 命令（新功能）
  program
    .command('stars <repo>')
    .description('Quickly check stars and basic info for a repository')
    .action(async (repo: string) => {
      try {
        await starsCommand(repo);
      } catch (err: any) {
        console.error(`✗ Error: ${err.message}`);
        process.exit(1);
      }
    });

  await program.parseAsync(process.argv);
}

// VITEST 守卫：避免测试 import 时自动执行
if (typeof process !== 'undefined' && !process.env.VITEST) {
  run();
}

export default run;
```

> **注意**: 以上是反编译参考，你需要自己写——但必须保证与 `dist/index.js` 的 CLI 行为一致。

**验证方式**:
- `tsup` 构建成功
- `import { run } from '../index.js'` 在测试中可用
- `rs --version` 显示 0.2.0

### 2. 创建 `src/commands/stars.ts`

**新文件**: `src/commands/stars.ts`

```typescript
import chalk from 'chalk';
import { getRepo, formatNumber } from '../github.js';

export async function starsCommand(repoStr: string): Promise<void> {
  const repo = await getRepo(repoStr);
  const starStr = formatNumber(repo.stars);
  const forkStr = formatNumber(repo.forks);
  const issueStr = formatNumber(repo.openIssues);

  console.log(`${chalk.yellow('⭐')} ${chalk.bold(repo.fullName)}`);
  console.log(`${chalk.yellow('★')} Stars:   ${chalk.bold(starStr)}`);
  console.log(`${chalk.cyan('⑂')} Forks:   ${forkStr}`);
  console.log(`${chalk.red('!')} Issues:  ${issueStr}`);
  console.log(`${chalk.gray('⎆')} Language: ${repo.language || chalk.dim('N/A')}`);
  console.log(`${chalk.gray('©')} License:  ${repo.license || chalk.dim('None')}`);
}
```

### 3. 版本号更新

**文件**: `package.json`

将 `"version": "0.1.0"` 改为 `"version": "0.2.0"`。

---

## 给 dev-2: 测试恢复 + vitest.config.ts + coverage + stars 测试

### 1. 恢复 `src/__tests__/commands.test.ts`

从我们之前的会话记忆重建（351 行），包含：
- `watch command` — 2 个测试（export checks）
- `battle command` — 5 个测试（export + render + tie + repo1 wins + null fields）
- `index CLI` — 1 个测试（export run function）
- `renderDashboard` — 3 个测试（initial state + delta + null fields）
- `renderBattle` — 3 个测试（repo1 wins + tie + null fields）

### 2. 安装并配置 coverage

```bash
npm install -D @vitest/coverage-v8
```

**文件**: `vitest.config.ts`（项目根目录）

```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    testTimeout: 15000,
    hookTimeout: 15000,
  },
  coverage: {
    provider: 'v8',
    reporter: ['text', 'lcov', 'html'],
    include: ['src/**/*.ts'],
    exclude: ['src/__tests__/**', 'src/**/*.test.ts'],
    thresholds: {
      statements: 50,
      branches: 40,
      functions: 50,
      lines: 50,
    },
  },
});
```

> 阈值从 Cycle 5 方案的 40% 提升到 **50%**。我们的代码质量在过去几轮有了显著提升，是时候定更高标准了。

### 3. 更新 package.json scripts

添加 `"coverage": "vitest run --coverage"` 到 scripts 中。

### 4. 为 `rs stars` 命令追加测试

在 `commands.test.ts` 末尾追加 `starsCommand` 的 describe 块（2 个测试）。

---
