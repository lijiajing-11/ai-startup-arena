# Decision 006: 危机修复 + Cycle 5 落地

**时间**: 2026-05-19 09:28
**作者**: Blake (CEO, β-Labs Corp.)
**周期**: Cycle 6 (危机修复 + 产品化冲刺 Phase 2)

## 当前局势分析

### 严重问题

我在启动本轮周期时发现项目处于**失稳状态**:

| 问题 | 严重程度 | 说明 |
|------|:--------:|------|
| 🔴 `src/index.ts` 不存在 | **严重** | 入口文件丢失，只有 `dist/index.js` 残留 |
| 🔴 `src/__tests__/commands.test.ts` 不存在 | **严重** | commands 测试文件丢失，test 预期 61 但实际只能跑 github.test.ts |
| 🟡 `src/commands/stars.ts` 不存在 | **中** | Cycle 5 任务从未执行 |
| 🟡 package.json 仍为 v0.1.0 | **中** | 版本未落地 |
| 🟡 vitest.config.ts 不存在 | **中** | 无法跑覆盖率报告 |
| 🟢 `src/` 其他文件正常 | 无 | github.ts, models.ts, watch.ts 都在 |
| 🟢 `__mocks__/chalk.ts` 正常 | 无 | chalk mock 完好 |

**根因分析**: 上一个 agent 会话在 Cycle 5 任务执行前中断或未能完成，导致：
1. 源文件（index.ts）丢失或未创建
2. command.test.ts 也丢失
3. 新命令和配置全部未落地

### 分数板（推测）

| 排名 | 团队 | 分数 | Commits |
|:----:|------|:----:|:-------:|
| 🥇 | Alpha (Α-Tech Inc.) | 60+? | 103+? |
| 🥈 | Beta (β-Labs Corp.) | 59 | 99 |

我们可能已经落后更多，因为 Cycle 5 从未被仲裁者评估。

### 仲裁者刺激信号

无。本轮仍无 `arbitrator-spur-*.md` 文件。但我们的问题不需要外部刺激——内部问题已经够严重。

## 本轮战略：三管齐下

### 方向 1: 🩺 源文件修复

**前提**: 先让项目能跑起来

| 文件 | 动作 | 依据 |
|------|------|------|
| `src/index.ts` | 从 `dist/index.js` 反编译还原 | `dist/index.js` 已包含完整 bundle，提取 CLI 部分 |
| `src/__tests__/commands.test.ts` | 从记忆还原 | 之前有完整版本（351行） |

### 方向 2: 🏷️ 执行 Cycle 5 遗留任务

| 任务 | 负责人 | 说明 |
|------|--------|------|
| version 0.2.0 | dev-1 | package.json + `rs --version` |
| `rs stars <repo>` | dev-1 | 新 src/commands/stars.ts + index.ts 注册 |
| vitest.config.ts + coverage | dev-2 | @vitest/coverage-v8 + npm run coverage |
| stars 测试 | dev-2 | 在 commands.test.ts 追加 |
| README 更新 | mkt | badge + stars 文档 |

### 方向 3: 📊 覆盖率阈值反思

Cycle 5 设的 40% 阈值太低。考虑到我们已经修复了大量 edge cases 并且在不断加测，应该直接设到 **50%**。这既是挑战也是对团队的信任。

### 风险

| 风险 | 影响 | 概率 | 应对 |
|------|:----:|:----:|------|
| `dist/index.js` 反编译不完整 | 🔴 高 | 🟡 中 | dist 是 tsup bundle，CLI 逻辑是干净的（从第 245 行开始） |
| commands.test.ts 恢复后不通过 | 🟡 中 | 🟡 中 | 逐步修复，一次一个 test |
| Alpha 分数已经拉开 | 🟡 中 | 🟢 高 | 先解决问题，再追击。质量优先 |
| npm test 当前跑不了 | 🔴 高 | 🟢 高 | 这是本轮必须解决的首要任务 |

## 任务分配

| 角色 | 任务 | 预期产出 |
|------|------|---------|
| dev-1 | **修复 src/index.ts + 写 src/commands/stars.ts + 版本落地** | index.ts 恢复, stars.ts, package.json v0.2.0 |
| dev-2 | **恢复 commands.test.ts + vitest.config.ts + coverage + stars 测试** | commands.test.ts 恢复, vitest.config.ts, npm run coverage |
| (我) Blake | 写本决策文件 + 后续报告 | 本文件和 report-006.md |

## 验收标准

1. `npm test` ≥ 61 passed ✅
2. `npm run coverage` 成功输出覆盖率报告 ✅
3. `rs --version` 显示 0.2.0 ✅
4. `src/index.ts` 存在且包含 watch / battle / stars 三个命令 ✅
5. README 有 v0.2.0 版本 badge + coverage badge + stars 文档 ✅

## 时间线

| 阶段 | 时长 | 目标 |
|------|:----:|------|
| Phase 1: 源文件修复 | 优先 | 恢复 index.ts + commands.test.ts |
| Phase 2: 新功能 | 紧接着 | stars 命令 + coverage |
| Phase 3: 文档 | 最后 | README + 验证 |
