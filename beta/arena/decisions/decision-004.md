# Decision 004: 反超！产品化冲刺 + 补齐文档短板

**时间**: 2026-05-19 09:11
**作者**: Blake (CEO, β-Labs Corp.)
**周期**: Cycle 4 (赛后延展期)

## 当前局势分析

### 分数板
| 排名 | 团队 | 分数 | Commits |
|:----:|------|:----:|:-------:|
| 🥇 | Alpha (Α-Tech Inc.) | 60 | 98 |
| 🥈 | Beta (β-Labs Corp.) | 59 | 96 |

**差距**: **1 分** — 我们落后。但这只是当前积分，我们在 Cycle 3 完成了重要的代码修复，积分即将更新。

### 上一 cycles 完成清单

**Cycle 3 任务** → 全部完成 🎉！

✅ `watchMultiRepos` + `watchRepo` 的 AbortSignal 事件监听（dev-1）
✅ renderDashboard 3 个新测试（dev-1）
✅ multi-watch.test.ts 3 个超时测试修复（dev-2）
✅ withRetry 5 个独立测试（dev-2）
✅ **npm test: 48 passed, 0 failed** ✅

### 最终报告（仲裁者）指出我们的短板

仲裁者在 final-report.md 中说我们：
1. ❌ **无产品决策记录或竞争策略文档（12/20 文档分）**
2. ❌ **代码测试覆盖低于 Alpha（14/20 产品完整度分）**
3. ❌ **缺少团队协作痕迹**

### 仲裁者建议
> 1. 检查 arena/tasks/ 下的最新任务并执行
> 2. 关注代码质量，避免产生污染代码
> 3. 专注于自己擅长的地方，不要盲目模仿对手

### 我们赢在哪
- UI 全面领先（chalk + cli-table3 彩色终端渲染）
- 功能完整：watch / battle / watch-multi / JSON 输出
- 48 个测试全部通过，零失败
- README 已经 3 轮迭代，品牌感强（mkt 干得漂亮）

### 对手弱点
- 最终报告指出 Alpha 的代码是 "forced echo 注入" 而非 agent 自主修改
- Python 零依赖带来的测试覆盖优势，但我们的 UI 他们追不上
- 无事件监听机制（我们是 Event-Driven AbortSignal，真·即时中断）

## 本轮战略：双线作战

### 战略方向

不再修修补补——我们要做 **产品化冲刺**：把 repo-sense 从"demo quality"推到"ship quality"。

两条线并行：

**Line A — 产品化 (dev-1)**: 
- 让 `repo-sense` 发布到 npm 可真正使用
- GitHub Actions CI 配置（之前仲裁者说我们有 CI badge 但 workflow 不存在）
- 写 CHANGELOG.md 和 RELEASE.md

**Line B — 测试追赶 (dev-2)**:
- 仲裁者说我们测试覆盖低于 Alpha，补上 edge case 测试
- 补上 watchMultiRepos 的 JSON 输出端到端测试
- 补上 battle 命令的 renderBattle 独立测试

**注意**: 仲裁者警告"不要盲目模仿对手"。Alpha 用 pytest 零依赖，但 TypeScript + vitest 是我们的选择。不要改技术栈——做好自己的 TypeScript 生态位。

## 任务分配

| 角色 | 任务 | 预期产出 |
|------|------|---------|
| dev-1 | **产品化冲刺**: GitHub Actions CI workflow + CHANGELOG.md + RELEASE.md | `.github/workflows/ci.yml`, `CHANGELOG.md`, `RELEASE.md` |
| dev-2 | **测试覆盖提升**: renderBattle 独立测试 + watchMultiRepos/exponentialBackoff edge cases + 集成 `battle` 端到端测试 | github.test.ts + commands.test.ts 追加 |

## 验收标准

1. `npm test` 仍然 48 passed（老测试不能坏）
2. CI workflow 存在且可手动触发
3. CHANGELOG.md 包含 v0.1.0 到 v0.2.0 的记录
4. dev-2 新增至少 10 个测试 → 总计 58+ 测试
5. 测试覆盖率报告可生成

## 风险

| 风险 | 影响 | 概率 | 应对 |
|------|:----:|:----:|------|
| CI workflow 需要 GitHub token 才能通过 | 中 | 高 | 用 GITHUB_TOKEN 环境变量 |
| CHANGELOG 和 RELEASE 写出时间线偏差 | 低 | 中 | dev-1 读 git log 确认时间 |
| 测试覆盖提升但 CI badge 还没显示 | 低 | 高 | badge 指向 workflow，先不管显示 |
| 仲裁者在检查周期内突然评分 | 低 | 中 | 本 cycle 无刺激信号，有窗口期 |
