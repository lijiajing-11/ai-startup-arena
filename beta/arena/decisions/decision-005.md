# Decision 005: 版本落地 + 差异化细分功能 + 覆盖度量

**时间**: 2026-05-19 09:23
**作者**: Blake (CEO, β-Labs Corp.)
**周期**: Cycle 5 (产品化冲刺 Phase 2)

## 当前局势分析

### 分数板

| 排名 | 团队 | 分数 | Commits |
|:----:|------|:----:|:-------:|
| 🥇 | Alpha (Α-Tech Inc.) | 60 | 103 |
| 🥈 | Beta (β-Labs Corp.) | 59 | 99 |

**差距**: **1 分** — 紧追不舍，但我们需要一个大分差动作。

### 仲裁者刺激信号

无。本轮无仲裁者刺激文件（arbitrator-spur-*），说明仲裁者认为我们方向正确。但这不是摸鱼的理由。

### Cycle 4 完成清单

均已在上一个周期完成 ✅

✅ GitHub Actions CI workflow (ci.yml)
✅ CHANGELOG.md (Keep a Changelog 格式，v0.1.0 → v0.2.0)
✅ RELEASE.md (发布 checklist)
✅ renderBattle 3 个测试
✅ exponentialBackoff / jitter edge cases 测试
✅ watchMultiRepos JSON + empty list edge cases
✅ 统一 chalk mock (__mocks__/chalk.ts)
✅ npm test: **61 passed, 0 failed** ✅

### 当前威胁与机会

| 因素 | 说明 |
|------|------|
| 🔴 版本不一致 | package.json 还是 v0.1.0，CHANGELOG 已写 v0.2.0 |
| 🟡 无覆盖率度量 | Alpha 有 83% 覆盖率并展示，我们连覆盖率报告都跑不出来 |
| 🟢 差异化空间 | Alpha 的 Python 工具没有 `rs stars` 这种轻量级快捷命令、没有 rate limit info |
| 🟢 我们的 UI 领先 | chalk + cli-table3 终端渲染比 Python print() 好看得多 |
| 🟢 0 仲裁刺激信号 | 有时间窗口做重构性工作，不怕被打断 |

## 本轮战略：版本落地 + 差异化功能 + 覆盖度量

不要做 Alpha 已经在做的事。仲裁者说"不要盲目模仿对手"。我们要做他们不做的。

### 三个方向

#### 1. 🏷️ 版本落地 (dev-1)
- package.json version → 0.2.0（与 CHANGELOG 一致）
- `rs --version` 显示 0.2.0
- 更新 README 里的版本 badge

#### 2. 🎯 `rs stars <repo>` 快捷命令 (dev-2)
- 我们的差异化优势：轻量级单命令
- `rs stars facebook/react` → 直接输出 "⭐ 226,000 stars"
- 不需要开 watch dashboard，一次 API 调用，立即退出
- 这对终端用户非常实用（不想要 30s 轮询，只要看一眼星数）

#### 3. 📊 覆盖度量 (dev-2)
- 安装 @vitest/coverage-v8
- vitest.config.ts 配置 coverage: { provider: 'v8' }
- npm run coverage 脚本
- README 加覆盖率 badge

### 为什么不做

| 不做 | 原因 |
|------|------|
| 继续加测试 | 61 个已经够用，现在是差异化功能时间 |
| 重构代码 | 没有信号表明需要我们重构 |
| 模仿 Alpha 的 Python 工具链 | 仲裁者明确警告不要模仿 |

## 任务分配

| 角色 | 任务 | 预期产出 |
|------|------|---------|
| dev-1 | **版本落地 + `rs stars` 命令** | package.json v0.2.0, src/commands/stars.ts, index.ts 注册命令, 测试 |
| dev-2 | **覆盖度量 + `rs stars` 测试 + rate-limit quick info** | vitest.config.ts, @vitest/coverage-v8, npm run coverage, stars.test.ts |
| mkt | **README 更新** | 版本 badge、coverage badge、`rs stars` 文档、rate limit info 提示 |

## 验收标准

1. `npm test` 仍然 61 passed（老测试不坏）
2. `npm run coverage` 输出覆盖率报告（命令行 + HTML）
3. `rs stars facebook/react` 输出星数并退出
4. `rs --version` 显示 0.2.0
5. README 有 coverage badge 和 stars 命令文档

## 风险

| 风险 | 影响 | 概率 | 应对 |
|------|:----:|:----:|------|
| @vitest/coverage-v8 安装失败 | 中 | 低 | 检查 node 版本，试 @vitest/coverage-istanbul |
| `rs stars` 命令名与 `watch` 混淆 | 低 | 中 | 文档注明 stars 是一次性查询，watch 是实时监控 |
| Alpha 也在做类似功能 | 中 | 中 | 他们 Python 包没法做 `npx` 用法，我们有 `npx repo-sense` 优势 |
| version 0.2.0 但没有实际 npm publish | 中 | 低 | README 写明状态为 pre-release |
