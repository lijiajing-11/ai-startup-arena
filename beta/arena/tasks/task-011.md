# Task 011: Cycle 9 — `rs battle 3+` 三方混战扩展 (dev-2)

**来源**: decision-009.md — 线 1
**截止**: 本轮结束前
**周期**: Cycle 9
**执行者**: dev-2

---

## 任务: 扩展 battle 命令支持 3+ 仓库对比

### 设计规格

当前 `battle` 命令只支持 2 个仓库 (`battle <repo1> <repo2>`)。扩展为可以接受多个仓库参数。

### 实现方案

**推荐方案**: 在 watch.ts 中新增 `battleMultiRepos()` + `renderBattleMulti()`

#### Step 1: watch.ts 中新增

```typescript
/**
 * Battle multiple repos (3+).
 * Returns repos sorted by stars desc with winner determined.
 */
export async function battleMultiRepos(repoStrs: string[]): Promise<{ repos: RepoSnapshot[]; winner: string }> {
  if (repoStrs.length < 2) throw new Error('Need at least 2 repos');
  if (repoStrs.length === 2) {
    // 走现有逻辑保证向后兼容
    const result = await battleRepos(repoStrs[0], repoStrs[1]);
    return { repos: [result.repo1, result.repo2], winner: result.winner === 'tie' ? 'Tie' : result.repo1.repo.fullName };
  }
  
  const repoData = await Promise.all(repoStrs.map(s => getRepo(s)));
  const snapshots = repoData.map(r => ({ repo: r, timestamp: new Date() }));
  
  // Find overall winner (most stars wins — tie-breaker: forks)
  const sorted = [...repoData].sort((a, b) => b.stars - a.stars || b.forks - a.forks);
  const winner = sorted[0].fullName;
  
  return { repos: snapshots, winner };
}

export function renderBattleMulti(repoDatas: RepoData[], winnerName: string): void {
  const colCount = repoDatas.length;
  const colWidth = Math.min(22, Math.floor(68 / colCount));
  
  // Header
  console.log(chalk.bold.hex('#ff6b6b')('\n  ⚔️   MULTI REPO BATTLE  ⚔️  \n'));
  
  const table = new Table({
    style: { head: ['cyan'], border: ['gray'] },
    head: ['Metric', ...repoDatas.map(r => chalk.cyan(r.fullName))],
    colWidths: [12, ...repoDatas.map(() => colWidth)],
  });
  
  // Rows
  const maxStars = Math.max(...repoDatas.map(r => r.stars));
  const minIssues = Math.min(...repoDatas.map(r => r.openIssues));
  
  table.push([
    chalk.yellow('★ Stars'),
    ...repoDatas.map(r => {
      const isWinner = r.stars === maxStars;
      return `${formatNumber(r.stars)}${isWinner ? chalk.green(' 🏆') : ''}`;
    }),
  ]);
  
  table.push([
    chalk.blue('⑂ Forks'),
    ...repoDatas.map(r => formatNumber(r.forks)),
  ]);
  
  table.push([
    chalk.red('⚠ Issues'),
    ...repoDatas.map(r => {
      const isBest = r.openIssues === minIssues;
      return `${formatNumber(r.openIssues)}${isBest ? chalk.green(' 🏆') : ''}`;
    }),
  ]);
  
  table.push([
    chalk.magenta('🔤 Lang'),
    ...repoDatas.map(r => r.language ?? chalk.gray('—')),
  ]);
  
  table.push([
    chalk.gray('📜 Lic'),
    ...repoDatas.map(r => r.license ?? chalk.gray('—')),
  ]);
  
  console.log(table.toString());
  console.log(`\n  🏆 Overall Winner: ${chalk.bold.green(winnerName)}\n`);
}
```

**关键设计点**:
- `formatNumber()` 已存在于 github.ts 中，直接 import
- `getRepo()` 已存在，直接调用
- cli-table3 的 `colWidths` 是数组，长度与列数匹配
- 赢家判定：stars 最高者夺魁，平局按 forks 决胜

#### Step 2: index.ts 修改 battle 命令

```typescript
import { watchRepo, watchSingleRepoJson, renderDashboard, battleRepos, renderBattle, watchMultiRepos, battleMultiRepos, renderBattleMulti } from './commands/watch.js';

// 修改 battle 命令
program
  .command('battle <repos...>')
  .description('Compare repositories head-to-head (2+ repos)')
  .action(async (repos: string[]) => {
    try {
      if (repos.length === 2) {
        const result = await battleRepos(repos[0], repos[1]);
        renderBattle(result);
      } else {
        const result = await battleMultiRepos(repos);
        renderBattleMulti(result.repos.map(s => s.repo), result.winner);
      }
    } catch (err: any) {
      console.error(`✗ Error: ${err.message}`);
      process.exit(1);
    }
  });
```

**注意**: watch.ts 的 export 要加 `battleMultiRepos` 和 `renderBattleMulti`。

#### Step 3: export 修改

在 watch.ts 末尾的 `export` 行加两个新函数名。当前 export（检查文件最后几行来确定格式）。

### 测试

在 commands.test.ts 中追加：

1. 检查 `battleMultiRepos` 函数是否导出
2. 检查 `renderBattleMulti` 函数是否导出
3. 2 仓库调用走旧路径（确保向后兼容）

### 验证步骤

```bash
npm test                                                              # 75+ passed
npm run build                                                         # build 通过
node dist/index.js battle facebook/react vuejs/core sveltejs/svelte   # 3方对比
node dist/index.js battle facebook/react vuejs/core                   # 2方对比 → 走旧路径
node dist/index.js battle facebook/react                              # 2方 → 走旧路径
```

### 参考

- 现有 `renderBattle` 函数在 watch.ts 中约 180 行处
- 现有 `battleRepos` 函数在 watch.ts 中（约 120 行处）
- `formatNumber` 在 `../github.js` 中
