# Task 010: Cycle 8 — `rs battle 3+` 三方混战扩展 (dev-2)

**来源**: decision-008.md — 线 2
**截止**: 本轮结束前
**周期**: Cycle 8
**执行者**: dev-2

---

## 任务: 扩展 battle 命令支持 3+ 仓库对比

### 设计规格

当前 `battle` 命令只支持 2 个仓库 (`battle <repo1> <repo2>`)。扩展为可以接受多个仓库参数。

### 实现方案

有两种方案可选，选择代码改动最小的：

#### 方案 A: 在 watch.ts 中新增 `battleMultiRepos()`

1. **新增函数** `battleMultiRepos(repos: string[])` — 接受 N>=2 个仓库
2. **新增函数** `renderBattleMulti(results: RepoData[])` — 渲染 N 方对比表
3. **向后兼容**: 当 N=2 时走现有的 `battleRepos` + `renderBattle` 路径

#### 方案 B: 修改现有 `battleRepos()` 

接受可变参数，当 args.length > 2 时切换渲染模式。

**推荐方案 A** — 改动最小，不破坏现有测试。

### 渲染设计

对于 N 方对比，使用 cli-table3（已有）渲染：

```
╔══════════════════════════════════════════════════════════╗
║            ⚔️   MULTI REPO BATTLE  ⚔️                  ║
╚══════════════════════════════════════════════════════════╝

┌─────────┬──────────────────┬──────────────────┬──────────────────┐
│ Metric  │ facebook/react   │ vuejs/core       │ sveltejs/svelte  │
├─────────┼──────────────────┼──────────────────┼──────────────────┤
│ ★ Stars │ 245,114 🏆      │ 47,888           │ 82,131           │
│ ⑂ Forks │ 51,065 🏆       │ 8,363            │ 4,769            │
│ ⚠ Issues│ 1,299            │ 607 🏆 (fewest)  │ 859              │
│ 🔤 Lang │ JavaScript       │ TypeScript       │ JavaScript       │
│ 📜 Lic  │ MIT              │ MIT              │ MIT              │
│ 📅 Age  │ 13.0 yrs         │ 11.5 yrs         │ 8.5 yrs          │
└─────────┴──────────────────┴──────────────────┴──────────────────┘

🏆 Overall Winner: facebook/react
```

**注意**: 列宽随仓库数动态调整。3 个仓库时每列约 18-20 字符，4 个时约 14 字符，5 个时约 10 字符。如果仓库数 >5 可以考虑警告提示。

### 具体改动

#### 1. watch.ts 中新增

```typescript
/**
 * Battle multiple repos (3+).
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

export function renderBattleMulti(results: RepoData[], winnerName: string): void {
  // 动态列宽：repoStrs.length 决定
  const colCount = results.length;
  const colWidth = Math.min(22, Math.floor(68 / colCount));
  // ... 渲染逻辑
}
```

#### 2. index.ts 注册命令

**方案: 修改现有 battle 命令**，把 `<repo1> <repo2>` 改成 `<repos...>`（可变参数）：

```typescript
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

**注意**: 需要检查 commander 是否支持 `<repos...>` 语法（应该支持，这是 commander 的可变参数变体）。

### 测试

在 `src/__tests__/commands.test.ts` 中追加：

1. 检查新函数 `battleMultiRepos` 是否导出
2. 检查 `renderBattleMulti` 是否导出
3. 2 仓库调用走旧路径（确保向后兼容）
4. 3 仓库调用不走旧路径

### 验证步骤

```bash
node dist/index.js battle facebook/react vuejs/core sveltejs/svelte   # 3方对比
node dist/index.js battle facebook/react vuejs/core                     # 2方对比 → 走旧路径
node dist/index.js battle facebook/react                                # 2方 → 走旧路径
npm test                                                                # 所有测试通过
npm run build                                                           # build 通过
```
