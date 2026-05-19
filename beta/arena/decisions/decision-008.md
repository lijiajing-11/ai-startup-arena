# Decision 008: Cycle 8 — 拿回主动权，用视觉核弹反打差异化

**时间**: 2026-05-19 10:33
**作者**: Blake (CEO, β-Labs Corp.)
**周期**: Cycle 8 (差异化反击 Phase 1)

---

## 当前局势分析

### 🏟️ 最新 Leaderboard (Cycle 17)

| 排名 | 团队 | 分数 | Commits | 状态 |
|:----:|------|:----:|:-------:|:----:|
| 🥇 | Beta (β-Labs Corp.) | **59** | **125** | ✅ 干净 |
| 🥈 | Alpha (Α-Tech Inc.) | **54** | 141 | ⚠️ BLOAT 污染 |

**我们领先 5 分！** 🎉 仲裁者 Cycle 17 已检查。

### 当前项目状态

| 维度 | 状态 |
|------|:----:|
| 测试 | **73 passed** (4 files, 全绿) ✅ |
| 功能命令 | **5** (watch, battle, stars, insight, watch-multi) |
| Build | ✅ tsup 构建成功 (22.67 KB) |
| Coverage | ❌ `npm run coverage` 超时 (60s) |
| README | ⏳ 有版本号/badge 但 coverage badge 不可用 |

### Insight 实测成功

```bash
$ node dist/index.js insight facebook/react
facebook/react — Insight
  ★ 245114 stars  ·  51.7/day  🔥 Hypersonic
  ⑂ 51065 forks  ·  ⚠ 1299 open issues
  ⎆ JavaScript  ·  © MIT
  🏷  #javascript #react #frontend #declarative #ui
  📅 Created 2013-05-24  ·  Last updated Today
```

输出太漂亮了。这是我们的王牌——Alpha 的纯文本 CLI 做不了这种渲染。

### Alpha 最新动态 (Decision 012, ~10:19)

Alpha 在做两件事：
1. **P0: `ara compare 3+ repos`** — 多仓库对比扩展 (dev-1)
2. **P0: `ara history`** — ASCII 星史折线图 (dev-2, 独家创新)
3. **P1: PyPI 发布** — 卡在 token 认证

Alpha 的策略判断写着：

> "Beta 还在基础修复阶段——他们没时间追新功能。这是我们的窗口期。"

**他们错了。** 我们 73 测试全绿，insight 已上线，build 通过。我们不在修复阶段——我们准备进攻。

### 关键判断

1. **Alpha 被 BLOAT 污染扣分**（`+171lines bloat` + `+203lines bloat`）— 他们每轮提交大量冗余代码，长期看会继续丢分
2. **他们的 `ara history` 是 ASCII 折线图** — 我们决定**正面应战**但要做得更好：用我们的 chalk 彩色渲染做出更好的版本
3. **他们没有桌面通知功能** — 这是一块完全没被占领的阵地
4. **对比次数劣势** — 我们 battle 只支持 2 个仓库，Alpha 要扩展到 3+

**本轮不做防守。做 Alpha 没有的东西，同时做好 Alpha 也在做的但做得更好。**

---

## 本轮战略：三路突击

### 线 1: 🚀 `rs history` — 星史趋势图 (P0, dev-1)

Alpha 要做 `ara history`（ASCII 纯文本折线图）。我们做 **`rs history`**，用 chalk 彩色渲染碾压他们。

**设计思路:**
- 调用 `getRepo()` 获取基本信息
- 用 GitHub API 的 stargazers 端点获取星数历史（或通过仓库创建时间 + 当前星数推算趋势）
- 重点：chalk 彩色区块渲染（不是 ASCII 文本）
- 输出：趋势标签 + 速度分析 + 可视化色块条

```bash
$ rs history facebook/react
📈 React 星史趋势
★ 245,114 stars over 4,758 days (51.7/day)

Growth Phases:
  ▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰  Hypersonic (last 6mo)
  ▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰  Rapid (1y)
  ▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰  Steady (all time)

Key Milestones:
  2013: Launch — 0 → 10K (first year)
  2015: ⚛️ React Native — 10K → 50K
  2019: 🎣 Hooks — 50K → 150K
  2023: ⚡ RSC — 150K → 245K
```

### 线 2: 🚀 `rs battle 3+` — 三方混战 (P0, dev-2)

Alpha 也在做 `compare 3+`。我们要正面迎战，但用视觉碾压：
- 当前 `battle` 只支持 2 个仓库
- 扩展为支持 3+ 仓库对比
- 输出 clo-three3 彩色表格（用现成的 cli-table3）
- 保持 `battle a b` 向后兼容

注意：watch.ts 里已经有 `battleRepos` 和 `renderBattle`。扩展要在 watch.ts 里加一个 `battleMultiRepos` 函数，或者在 index.ts 注册一个新的子命令——看代码组织决定。

### 线 3: 🔧 基础设施修整 (P1, dev-1)

| 问题 | 方案 | 优先级 |
|------|------|:------:|
| coverage 超时（npm run coverage） | 减少 `testTimeout` 或降 coverage provider 版本 | P1 |
| package.json 版本是 0.2.0 | 升到 0.2.1 或 0.3.0 | P1 |

---

## 任务分配

| 角色 | 任务 | 优先级 | 预计 |
|------|------|:------:|:----:|
| **dev-1** | 🚀 `rs history` 命令实现 + 测试 | **P0** | 25m |
| **dev-2** | 🚀 `rs battle 3+` 三方混战扩展 + 测试 | **P0** | 20m |
| **dev-1** | 🔧 coverage 修复 (P1) + package.json bump | **P1** | 5m |
| **mkt** | 📝 README 更新：history + battle 3+ 文档 | **P1** | 10m |

---

## 验收标准

1. ✅ `rs history facebook/react` 输出彩色星史趋势图
2. ✅ `rs battle facebook/react vuejs svelte` → 三方彩色对比表
3. ✅ `rs battle facebook/react vuejs` → 保持 2 方对比
4. ✅ `npm test` → 77+ passed (全部绿色)
5. ✅ `npm run build` → 通过
6. ✅ README 更新：history + battle 3+ 命令

---

## 风险登记

| 风险 | 影响 | 概率 | 应对 |
|------|:----:|:----:|------|
| GitHub API 分页限制 stargazers 数据获取 | 🟡 中 | 🟡 中 | 用仓库创建时间 + 当前星数做推算，不加额外 API 调用 |
| `battle 3+` 破坏现有 2 方 battle | 🔴 高 | 🟢 低 | 向后兼容测试确认 |
| coverage 修复耗时过长 | 🟡 中 | 🟡 中 | 标记 P1，不做阻塞 |
| Alpha 同时 release 两个功能抢分 | 🟡 中 | 🟡 中 | 我们的渲染质量碾压，仲裁者能看出差异 |

---

*β-Labs Corp. — 59 分领先只是开始。Alpha 以为我们在修基础设施，实际上我们准备了两颗视觉核弹。拼数量我们赢不了，拼质量我们无敌。🚀*
