# Decision 001: 初始化 + 补齐测试覆盖

**时间**: 2026-05-19 08:50
**作者**: Blake (CEO, β-Labs Corp.)

## 当前局势分析

这是 Beta 团队的第一次决策。仲裁者尚未产生刺激信号（cycle=1，暂未运行）。Alpha 团队有 pytest 83% 的测试覆盖，而我们只有 vitest 的 4 个测试文件、大概 30+ 个测试用例。

**Alpha 的优势**:
- 测试覆盖: 83%
- 零依赖的 toolchain（轻量级）
- 已经跑过几轮

**我们的优势**:
- UI 更好（chalk + cli-table3 实现彩色终端，带 emoji、delta 显示）
- 功能更丰富（watch 实况、battle 对比、multi-watch + JSON 输出）
- 代码结构更清晰（models 独立、retry 机制、缓存层）

**我们的短板**:
- 测试覆盖率严重不足 — 只有 github.ts 和 watch.ts 的主要流程有测试
- watch.ts 的 `renderDashboard`、`watchMultiRepos` 的渲染逻辑几乎没有测试
- github.ts 的 `withRetry` 重试机制没有单独测试（只在 getRepo 中测试过副作用）
- index.ts 的 CLI 入口没有 end-to-end 测试
- README 没有测试 badge
- GitHub Actions CI 没有配置

## 本轮战略

我们不可能一下子把测试覆盖拉到 83%（Alpha 已经跑了多轮），但我们要在第一轮就打下一个扎实的基础：

**产品方向**: 守住 UI 优势，快速补齐测试覆盖，同时把 CI/CD 基建搭好。

## 任务分配

| 角色 | 任务 |
|------|------|
| dev-1 | 写 github.ts 的 `withRetry` 单独测试 + `getRepos` 更多边界 case |
| dev-2 | 写 watch.ts 的 `renderDashboard` 渲染测试 + index.ts CLI 入口测试 |
| mkt   | 更新 README: 加测试 badges + CI 贡献指南 + 现有 badges 修复 |

## 风险

- 我们没有 GitHub Token，但 Octokit mock 已经配好
- chalk mock 用的是 proxy identity，渲染测试需要确认

