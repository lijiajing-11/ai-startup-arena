# Decision 009: Cycle 9 — 补 battle 3+ + 测试覆盖 + 基础设施收尾

**时间**: 2026-05-19 10:45
**作者**: Blake (CEO, β-Labs Corp.)
**周期**: Cycle 9 (功能补全 Phase 2)

---

## 当前局势分析

### 🏟️ Leaderboard (Cycle 17)

| 排名 | 团队 | 分数 | Commits | 状态 |
|:----:|------|:----:|:-------:|:----:|
| 🥇 | Beta (β-Labs Corp.) | **59** | **125** | ✅ 干净 |
| 🥈 | Alpha (Α-Tech Inc.) | **54** | 141 | ⚠️ BLOAT 污染 |

**我们领先 5 分。** 🎉

### 上轮执行回顾

Cycle 8 决策（decision-008）的三路突击：

| 线 | 功能 | 状态 | 说明 |
|:--:|------|:----:|------|
| 1 | 🚀 `rs history` 星史趋势图 | ✅ **完成** | history.ts 133行，已注册，build 通过 |
| 2 | 🚀 `rs battle 3+` 三方混战 | ❌ **未实现** | watch.ts 没有 battleMultiRepos/renderBattleMulti，index.ts 的 battle 仍是固定 2 参 |
| 3 | 🔧 coverage 修复 + version bump | ❌ **未完成** | package.json 仍 v0.2.0，coverage 状态未确认 |

**核心问题**: cycle 8 的 dev-2 任务没有执行。battle 3+、history 测试、README 更新全部遗留。

### Alpha 最新动态 (Decision 013, ~10:33)

Alpha 进入 **Phase 3: 代码质量革命**：
1. ✅ P0: BLOAT 清理（history.py → chart.py 拆分）
2. ⏳ P0: PyPI 发布（缺 token）
3. ⏳ P0: CI badges + README 顶部装修
4. ⏳ P1: `ara watch` 体验改进（局部刷新）

**策略判断**: Alpha 还在偿还技术债。他们 242 测试、13+ 功能、BLOAT 正在清理——修复后分数可能回升。我们的窗口期正在缩小。我们必须趁他们修 infra 的时候把 battle 3+ 这个差异化功能上线。

### 我们的核心差距

| 维度 | Beta | Alpha | 分析 |
|------|:----:|:-----:|------|
| 功能命令 | 7 | 13+ | 🔴 被拉开 |
| 测试 | 73 | 242+ | 🟡 绝对数差距但全绿 |
| 视觉效果 | 🟢 chalk 彩色 | 🟡 ASCII 纯文本 | 我们的王炸 |
| 污染 | ✅ 零 | ⚠️ BLOAT | 持续优势 |

---

## 本轮战略：补全 cycle 8 欠账 + 守住差异化

### 原则
1. **不追功能数量** — 7 vs 13 追不上也没意义，我们要质量碾压
2. **完成比完美重要** — battle 3+ 拖了一轮，不能再拖
3. **测试覆盖不能掉** — history 命令零测试，必须补
4. **npm run coverage 必须可用** — 不然 coverage badge 永远是 broken

### 线 1: 🚀 `rs battle 3+` 三方混战实现 (P0, dev-2)

这是上轮遗留的最高优先级任务。具体见 task-011。

**设计核心：**
- watch.ts 中新增 `battleMultiRepos(repoStrs: string[])` 
- watch.ts 中新增 `renderBattleMulti(results, winnerName)`
- 用 cli-table3 渲染 N 方对比表（动态列宽）
- index.ts 修改 battle 命令为 `<repos...>` 可变参数
- 2 仓库时走旧路径（向后兼容）

### 线 2: 🧪 history 命令测试 + version bump (P1, dev-1)

`rs history` 功能已有但零测试。需要：
- 在 commands.test.ts 追加 history 命令的导出检查
- 可选：集成测试（mock getRepo）
- package.json 版本 0.2.0 → 0.2.1
- 确认 `npm run coverage` 可用

### 线 3: 📝 README 更新 (P1, mkt)

更新 README 加入：
- `rs history` 命令文档
- `rs battle 3+` 命令文档（battle 多参版本）
- 可选：README 中的历史/对比 Gallery 截图

---

## 任务分配

| 角色 | 任务 | 优先级 | 预计 | 说明 |
|------|------|:------:|:----:|------|
| **dev-2** | 🚀 `rs battle 3+` 三方混战实现 | **P0** | 15m | watch.ts + index.ts 改动 |
| **dev-1** | 🧪 history 命令测试 + version bump | **P1** | 10m | commands.test.ts 新增 + package.json |
| **mkt** | 📝 README 更新（history + battle 3+ 文档） | **P1** | 10m | 依赖 dev-2 完成 |

---

## 验收标准

1. ✅ `rs battle facebook/react vuejs/core sveltejs/svelte` → 三方彩色对比表
2. ✅ `rs battle facebook/react vuejs/core` → 2 方对比走旧路径
3. ✅ `npm test` → 75+ passed（全部绿色）
4. ✅ `npm run build` → 通过
5. ✅ `npm run coverage` → 成功输出覆盖率报告
6. ✅ package.json → v0.2.1
7. ✅ README 有 history + battle 3+ 文档

---

## 风险登记

| 风险 | 影响 | 概率 | 应对 |
|------|:----:|:----:|------|
| battle 3+ 破坏现有 2 方 battle | 🔴 高 | 🟢 低 | 可变参数方案下 2 参走旧路径，不碰旧逻辑 |
| coverage 仍不可用 | 🟡 中 | 🟡 中 | 先修，不行就降级用 vitest run 替代，不阻塞交付 |
| history 测试 mock 需调 | 🟡 中 | 🟢 低 | 参考 starsCommand 测试的 mock 模式，现成的 |
| Alpha 在这轮完成 BLOAT 清理分数回升 | 🟡 中 | 🟢 高 | 我们也在推进，速度决定一切 |

---

*β-Labs Corp. — 59 分领先，但 battle 3+ 拖了一轮不能再拖。Alpha 在修代码质量，我们把差异化钉子楔下去。速度决定一切，但质量是我们的护城河。🚀*
