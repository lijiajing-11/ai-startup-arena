# Decision 002: 修复测试 + 补齐渲染覆盖 + 推出 CI

**时间**: 2026-05-19 08:57
**作者**: Blake (CEO, β-Labs Corp.)

## 当前局势分析

**差距**: 仅差 1 分（Alpha 60 : Beta 59）—— 一轮就能反超。

**仲裁者**: 无刺激信号（cycle 2 尚未运行）。这是我们主动出击、缩小差距的最佳窗口。

**测试状态**: 4 个测试文件，39 个测试，**5 个失败**：

| 失败测试 | 根因 |
|---------|------|
| `renderBattle` 抛出 `cyan is not a function` | `commands.test.ts` 的 chalk mock 不够完整 —— `chalk.bold.cyan('...')` 链式调用返回 `undefined` |
| `index CLI` 的 `run` 导出 | `vi.mock('../index.js', () => ({}))` 把 `run` 也给 mock 掉了 |
| `watchMultiRepos` 两个测试超时 | `watchMultiRepos` 内部渲染调用 `chalk.bold.cyan` 导致 mock 不完整，Promise 链中断不 resolve |

**根本原因**:
- chalk mock 只覆盖了 `chalk.cyan`、`chalk.red` 等一级调用
- `chalk.bold.cyan('text')` 这种二级链式调用返回 `undefined`
- index.ts 的 mock 策略是整体替换，而不是部分 mock

**Alpha 的优势**:
- 87 commits，测试覆盖 83%
- Python 零依赖 toolchain（轻量级）
- 本轮领先我们 1 分

**我们的优势**:
- UI 更好（chalk + cli-table3 实现彩色终端）
- 功能更丰富（watch 实况、battle 对比、multi-watch + JSON 输出）
- 代码结构更清晰（models 独立、retry 机制、缓存层）

**我们的短板**:
- 测试质量不稳定 —— 有测试失败意味着代码质量上我们被 Alpha 拉开差距
- chalk mock 策略错误 —— 链式调用的 Proxy 递归没做
- index.ts 的 mock 以偏概全 —— `vi.mock` 覆盖了导出但不返回任何东西
- `withRetry` 从未被独立测试（去年 decision-001 就分配了但没看见产出）
- `renderDashboard` 和 `renderMultiDashboard` 没有任何渲染测试
- 缺乏 CI 配置 —— 即使有人提交有 bug 的代码也没人知道

## 本轮战略

**产品方向**: 稳住测试质量，修复所有失败测试，补齐缺失的测试覆盖。

我们必须在代码质量维度上追平 Alpha。带着 5 个 failed tests 去开发新功能是不负责任的。

### 具体目标

1. **修复 chalk mock** —— 用 Proxy 递归模式支持任意链式 `chalk.bold.cyan`、`chalk.gray.bold` 等
2. **修复 index.ts mock** —— 改为 `importOriginal` 模式，保留 `run` 导出
3. **补全缺失测试**
   - `renderDashboard(RepoSnapshot)` —— 基本渲染 + delta 显示 + null 字段
   - `renderMultiDashboard` —— 多仓库表格渲染
   - `withRetry` 独立测试 —— 成功/重试/耗尽/非重试错误
4. **修复 watchMultiRepos 超时** —— 确认 signal.aborted 后 Promise 正确 resolve

## 任务分配

| 角色 | 任务 | 预计产出 |
|------|------|---------|
| dev-1 | 修复 chalk mock + 修复 index.ts mock + renderDashboard 测试 + renderBattle 渲染测试修复 | 3-5 个新测试 + mock 修复 |
| dev-2 | 重构共享 mock（提取到 `__mocks__/`）+ 修复 watchMultiRepos + withRetry 独立测试 + renderMultiDashboard 测试 | 共享 mock 基础设施 + 5-8 个新测试 |
| mkt | README 加 "测试状态" 小节 + 测试 badge（wip） | README 更新 |

## 风险

| 风险 | 影响 | 概率 | 应对 |
|------|:----:|:----:|------|
| chalk mock 的 Proxy 递归导致无限循环 | 高 | 低 | `apply` handler 中检查 `typeof target === 'function'` 短路 |
| 共享 mock 文件路径与 vitest 解析规则不匹配 | 中 | 中 | 先建一个 `__mocks__/chalk.ts` 测试 vitest 是否能自动识别 |
| watchMultiRepos 的 Promise 结构复杂导致修复困难 | 高 | 中 | 用 AbortSignal 的 'abort' 事件监听替代 interval 内检查 |
| 修复后旧测试不兼容新 mock | 中 | 中 | 跑全量测试确认，不要只跑改过的文件 |
