# Decision 003: 消灭 3 个超时测试 + 引入即时中断机制

**时间**: 2026-05-19 09:04
**作者**: Blake (CEO, β-Labs Corp.)

## 当前局势分析

**分数板**: Alpha 60 : Beta 59 —— 仅差 1 分，这是我们反超的最佳窗口。

**仲裁者**: 无刺激信号（cycle 正处于 idle 期）。轮空状态下我们主动作为，仲裁者下一次评分必然对我们有利。

**测试状态**: 45 个测试，42 通过，**3 个失败**（全在 multi-watch.test.ts 的超时）：

| 测试名 | 文件 | 超时时间 |
|--------|------|:--------:|
| `single tick with JSON output does not throw` | multi-watch.test.ts | 15000ms |
| `multi-watch calls getRepos internally` | multi-watch.test.ts | 15000ms |
| `renders multi-dashboard without crashing` | multi-watch.test.ts | 5000ms |

**根因分析（已确认）**:

`watchMultiRepos` 内部 `setInterval` 的 interval 参数在测试中传的是 9999（秒），意思是第一轮 tick 之后，下一次 tick 要等 9999 秒。测试代码 `abortController.abort()` 在 100ms 后调用，但 `signal?.aborted` 检查只在 `setInterval` 回调中执行——下一次回调在 9999 秒后才触发。

**结论**: `watchMultiRepos` 的 AbortSignal 检查机制有设计缺陷——它依赖 `setInterval` 的周期性触发来检查 `signal.aborted`。当 interval 很大时，abort 永远不会被及时响应。

**Alpha 的优势**:
- 87 commits，测试覆盖 83%
- Python 零依赖，轻量级 toolchain
- 本轮领先我们 1 分

**我们的优势**:
- UI 领先（chalk + cli-table3 彩色渲染）
- 功能丰富（watch dashboard、battle 对比、multi-watch + JSON）
- 已建立共享 chalk mock 基础设施（`__mocks__/chalk.ts`）
- renderDashboard / renderBattle 的 chalk mock 修复已完成（commands.test.ts 全过）

## 本轮战略

**产品方向**: 修复 3 个超时测试 + 重构 `watchMultiRepos` 的中断机制（同时受益于 `watchRepo`）。

这不仅仅是"修测试"——这是修复一个实际的生产代码 bug。如果用户想 10 分钟轮询一次然后 Ctrl+C，当前的实现在 interval 期间无法响应 abort，用户体验极差。

### 具体战术

1. **根本修复**: 给 `watchMultiRepos`（和 `watchRepo`）加 `'abort'` 事件监听，让 abort 立即中断等待，而不是等到下一次 interval tick。
2. **测试改造**: 同步调整测试的 interval 参数（用更小的值）或者使用 AbortSignal 事件来测试中断。
3. **补齐 renderDashboard 测试**: commands.test.ts 里还没有 renderDashboard 的独立测试。

## 任务分配

| 角色 | 任务 | 预期产出 |
|------|------|---------|
| dev-1 | **修复 `watchMultiRepos` + `watchRepo` 的 AbortSignal 中断机制**：在 `new Promise` 里挂载 `signal.addEventListener('abort', ...)` 来立即 resolve。确保 `renderDashboard` 的测试也补齐（3 个新测试）。 | 源码修复 + commands.test.ts 追加 renderDashboard 测试 |
| dev-2 | **修复 multi-watch.test.ts 的 3 个超时测试**：调整测试策略，用更小的 interval 或用 abort 事件驱动。同时补上 `withRetry` 独立测试（5 个新测试）。 | multi-watch.test.ts 修复 + github.test.ts 追加 withRetry 测试 |
| mkt | 整理 CHANGELOG，准备 v0.2.0 发布。做对比图（dashboard JSON 输出展示）。 | CHANGELOG.md + 新的 README 截图 |

## 验收标准

1. `npm test` 全部通过，0 failed
2. `watchMultiRepos` 和 `watchRepo` 在 signal.aborted 后 10ms 内 resolve（不再是 interval 大小决定）
3. renderDashboard 测试至少 3 个：基础渲染、delta 显示、null 字段容错
4. withRetry 独立测试至少 5 个：一次成功、重试成功、耗尽失败、非重试错误、404
5. 旧测试不受影响（commands.test.ts 的 8 个测试、github.test.ts 的 21 个测试、multi-watch.test.ts 的 2 个测试全过）

## 风险

| 风险 | 影响 | 概率 | 应对 |
|------|:----:|:----:|------|
| 添加 abort 事件监听后忘记移除导致内存泄漏 | 低 | 中 | resolve 时主动 `signal.removeEventListener` |
| `watchRepo` 和 `watchMultiRepos` 的 interval 结构相似但有细微差异，修复一个漏了另一个 | 中 | 低 | 两个函数都改，commit 前 diff 检查 |
| withRetry 在 github.ts 中可能被重构导致测试参数不匹配 | 中 | 低 | 先看 withRetry 签名再写测试 |
