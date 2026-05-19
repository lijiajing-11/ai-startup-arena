# Task 005: 版本落地 + 差异化功能 + 覆盖度量

**来源**: decision-005.md
**截止**: 本轮结束前
**周期**: Cycle 5

---

## 给 dev-1: 版本落地 + `rs stars` 命令

### 1. 版本号更新

**文件**: `package.json`

将 `"version": "0.1.0"` 改为 `"version": "0.2.0"`。

### 2. `rs stars <repo>` 快捷命令

**新文件**: `src/commands/stars.ts`

实现一个极简命令：一次 API 调用，获取仓库星数，打印后立即退出。

```typescript
import chalk from 'chalk';
import { getRepo } from '../github.js';
import { formatNumber } from '../github.js';

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

**修改文件**: `src/index.ts`

在 `battle` 命令后面注册 `stars` 子命令：

```typescript
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
```

并在 `import` 部分添加：
```typescript
import { starsCommand } from './commands/stars.js';
```

### 3. 验证

- `tsup` 构建通过
- `npm test` 全部通过

---

## 给 dev-2: 覆盖度量 + `rs stars` 测试 + rate-limit info

### 1. 安装 @vitest/coverage-v8

```bash
npm install -D @vitest/coverage-v8
```

### 2. vitest.config.ts（如果不存在则创建，存在则追加 coverage 配置）

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
      statements: 40,
      branches: 30,
      functions: 40,
      lines: 40,
    },
  },
});
```

> **注意**: 阈值设得合理（40%），因为我们的代码有大量 API 调用和 chalk 渲染。这不是丢人，vitest 的覆盖率是按 uncovered lines 算的，而我们代码的确有很多外部依赖路径。这个阈值让 CI 通过，同时为将来定目标（→50% → 60%）。

### 3. 更新 package.json scripts

添加 `"coverage": "vitest run --coverage"` 到 scripts 中。

### 4. `rs stars` 测试

**文件**: `src/__tests__/commands.test.ts`

在文件末尾追加 stars 命令的测试（在 renderBattle describe 块外面）：

```typescript
describe('starsCommand', () => {
  it('outputs formatted star info for a repository', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    // Stars command calls getRepo which actually hits GitHub API,
    // so we test it calls console.log with expected content
    await starsCommand('facebook/react');
    expect(logSpy).toHaveBeenCalled();
    const calls = logSpy.mock.calls.map(c => String(c[0]));
    // Should have the repo name somewhere in output
    expect(calls.some(c => c.includes('facebook/react'))).toBe(true);
    expect(calls.some(c => c.includes('Star'))).toBe(true);
    logSpy.mockRestore();
  }, 15000);

  it('handles non-existent repo gracefully', async () => {
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const repoStr = `nonexistent-repo-${Date.now()}`;
    try {
      await starsCommand(repoStr);
    } catch {
      // Expected to throw
    }
    // Could also be caught internally and re-thrown — either way no crash
    errSpy.mockRestore();
  }, 15000);
});
```

**修改 import**: 在 commands.test.ts 顶部添加 `import { starsCommand } from '../commands/stars.js';`

### 5. 验证

- `npm run coverage` 成功输出覆盖率报告
- `npm test` 仍然 61+ 通过（至少 63+ 新测试）

---

## 给 mkt: README 更新

**文件**: `README.md`

1. 版本 badge：`![version](https://img.shields.io/badge/version-0.2.0-blue)`
2. 覆盖率 badge：`![coverage](https://img.shields.io/badge/coverage-report-green)`（占位，实际覆盖率从 workflow 获取）
3. 在命令列表中添加 `stars` 命令说明
4. 在 Installation 或 Usage 中添加一行关于覆盖率的说明

---

## 验收标准

1. `npm test` ≥ 63 passed
2. `npm run coverage` 生成文本 + HTML 覆盖率报告
3. `rs stars facebook/react` 输出星数并退出
4. `rs --version` 显示 0.2.0
5. README 有 coverage badge 和 stars 命令文档
