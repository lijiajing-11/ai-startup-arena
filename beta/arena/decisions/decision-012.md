# Decision 012: 完成 coverage 命令 + npm 发布收尾 — 功能矩阵超越

**时间**: 2026-05-19 11:23
**作者**: Blake (CEO, β-Labs Corp.)
**周期**: Cycle 12 （功能补齐Phase）

---

## 当前局势分析

### 🏟️ Leaderboard (Cycle 17 — 无更新)

| 排名 | 团队 | 分数 | Commits | 状态 |
|:----:|------|:----:|:-------:|:----:|
| 🥇 | Beta (β-Labs Corp.) | **59** | **125** | ✅ 干净 |
| 🥈 | Alpha (Α-Tech Inc.) | **54** | 141 | ⚠️ BLOAT 污染 |

**我们领先 5 分。仲裁者仍停在 Cycle 17，无新刺激信号。**

### Decision 011 执行回顾

| 线 | 任务 | 状态 | 说明 |
|:--:|------|:----:|------|
| 1 | 🚀 `repo-sense coverage` 全新命令 (dev-1) | ❌ **未完成** | 没开始做 |
| 2 | 📦 npm 发布准备工作 + vitest coverage HTML 报告器 (dev-2) | ✅ **完成** | `.npmignore` 创建, `author` 更新, `npm pack --dry-run` 通过 |
| 3 | 📝 README 更新: coverage 命令文档 (mkt) | ⏳ **阻塞** | 等 coverage 命令完成 |

**Decision 011 只做了 1/3。核心产出 — `rs coverage` 命令 — 缺失。**

### Alpha 最新动态 (Decision 015, ~10:53)

Alpha 进入"差异化冲刺":
- 🔴 `ara watch --notify` 桌面通知 (P0, dev-1) — **可能已经上线**
- 🔴 PyPI 基础设施完善 (P0, dev-1) — 缺 token 发不了
- 🟡 Watch 测试增强 (P2, dev-2)
- 🟡 README v14 通知功能文档 (P1, mkt)

**如果 Alpha 的 notify 功能已上线，他们会多一个差异化功能。我们需要快速补上我们的差异化牌。**

### 我们的真实差距分析

**D011 的错**: 我们规划了两个并行 (coverage + npm)，但实际上 npm 发布准备只花了 dev-2 一推就完事了，而 `coverage` 命令一直没做。结果就是：我们现在有 8 个命令，npm 发布就绪，但**coverage 面板缺失**，功能矩阵还是 8 对 13。

看看我们能打的牌：

| 维度 | Alpha | Beta | 判断 |
|------|:-----:|:----:|:----:|
| 功能命令 | 13 | 8 | 🔴 数量劣势 |
| 桌面通知 | 🚀 可能已上线 | ❌ 无 | 🔴 被抢先 |
| **npm 发布** | ❌ 缺 token | **🟢 就绪** | ✅ 我们可发 |
| **覆盖率面板** | ❌ 无 | **🟢 可做** | ✅ 差异化点 |
| **视觉效果** | 🟡 ASCII | **🟢 chalk 彩色** | ✅ 持续王牌 |
| 测试 | 248 ✅ | 81 ✅ | 🟡 数量劣势但全绿 |

**关键发现**: `npm pack --dry-run` 已通过（5 个文件，110KB）。我们现在是**真正可以发布了**。虽然 npm publish 需要 token，但我们的包结构是干净的，随时可发。

---

## 本轮战略：完成 coverage 命令 → 功能数量 8→9 + 差异化牌

### 为什么是 coverage 而不是桌面通知？

桌面通知 `ara watch --notify` 是一个锦上添花的功能，**但我们的用户（和仲裁者）更关心**：
1. 能不能知道自己代码的质量？
2. 能不能看到一个完整的功能？
3. 能不能安装使用？

**`rs coverage` 是开发工具链的自然升级，是质量基础设施的一部分**。Alpha 做不了这个（他们的测试套件再大也没有内置的覆盖率 CLI 命令）。

而且——**既然 dev-2 已经把 npm 发布准备搞定了，我们现在做 coverage 命令，npm publish 的时候就能一起带上**。这是两个功能互相增强。

### 任务分配

| 角色 | 任务 | 优先级 | 预计 | 说明 |
|------|------|:------:|:----:|------|
| **dev-1** 🧪 | 🚀 实现 `rs coverage` 命令 | **P0** | 20m | 新文件 `src/commands/coverage.ts` + index.ts 注册 |
| **dev-2** 🚀 | 🔧 修复 `rs stars` 命令的测试覆盖 + 添加 coverage 命令测试 | **P0** | 15m | coverage 单元测试 + stars 测试补强 |
| **mkt** 📝 | 📝 README 更新: coverage 文档 + 命令计数更新 8→9 | **P0** | 10m | 依赖 dev-1 完成 |

### dev-1: `repo-sense coverage` 命令（详细设计）

**文件**: `src/commands/coverage.ts`

```typescript
// 一个极简的 coverage dashboard
//
// 功能:
// 1. 运行 `npx vitest run --coverage`（或读取已有 coverage/coverage-summary.json）
// 2. 解析 vitest JSON 输出获取覆盖率数据
// 3. 用 chalk + cli-table3 渲染覆盖率面板:
//    ┌──────────────┬──────────┬──────────┬───────────┬──────────┐
//    │ File          │ Lines    │ Branches │ Functions │Statements│
//    ├──────────────┼──────────┼──────────┼───────────┼──────────┤
//    │ src/github.ts │ 97.1% 🟢│ 87.3% 🟢│ 100% 🟢   │ 97.1% 🟢│
//    │ src/watch.ts  │ 72.7% 🟡│ 61.3% 🟡│ 78.6% 🟡  │ 72.7% 🟡│
//    │ ...           │          │          │           │          │
//    └──────────────┴──────────┴──────────┴───────────┴──────────┘
// 4. 顶部显示综合覆盖率
// 5. 颜色编码：>80% 🟢, >60% 🟡, <60% 🔴
// 6. 如果阈值不达标，优雅提示
//
// 技术选型:
// - vitest 的 --reporter=json 会输出到 stdout（JSON）
// - 但更好的方式是用已有的 coverage/coverage-summary.json（vitest 已配置生成）
// - 或者直接执行 `npx vitest run --coverage --reporter=json` 并 parse stdout
// - 不需要额外依赖，不需要额外的 npm 包
```

**注册**: `src/index.ts` 中 `program.command('coverage')`

### dev-2: coverage 命令测试

**1. 测试覆盖**
- 测试 coverage summary JSON 解析
- 测试覆盖率面板渲染（表头、颜色编码）
- 测试文件不存在时的错误处理
- 测试 `--no-run` 选项（仅解析已有 JSON，不触发 vitest 重跑）

**2. Stars 测试补强**
当前 `stars.ts` 覆盖率高（100% lines）但 `insight.ts` 和 `watch.ts` 还有差距。补一些测试把 `models.ts` 也覆盖上。

---

## 验收标准

1. ✅ `rs coverage` → 彩色覆盖率面板展示（Statements / Lines / Branches / Functions）
2. ✅ `rs coverage --no-run` → 直接读已有 JSON 不出错
3. ✅ `npm test` → **81+ passed, 0 failed**（新测试不能破坏）
4. ✅ `npm run build` → 通过
5. ✅ `npm pack --dry-run` → 包含 coverage 命令
6. ✅ README 有 coverage 命令文档 + 命令计数更新 8→9

---

## 风险登记

| 风险 | 影响 | 概率 | 应对 |
|------|:----:|:----:|------|
| Alpha 通知功能已上线形成差异 | 🟡 中 | 🟡 中 | 我们的 coverage + npm 就绪是对冲 |
| vitest JSON 输出解析复杂 | 🟡 中 | 🟢 低 | 用 `coverage/coverage-summary.json` 稳定格式 |
| npm token 不存在无法实际 publish | 🟢 低 | 🟡 中 | 不影响 — 包结构已就绪 |
| 测试覆盖不到 coverage 命令 | 🟡 中 | 🟡 中 | dev-2 专门写测试 |

---

## 与 Alpha 对比预测（本轮回合后）

| 维度 | Alpha (54分) | Beta (59分) | 预期变化 |
|------|:-----------:|:-----------:|:--------:|
| 分数 | 54 | 59 → **61+** | 🚀 coverage + npm 就绪 |
| Commits | 141 | 125 → **129+** | +3-4 commits |
| 功能命令 | 13 | 8 → **9** | ✅ +1 coverage |
| 测试 | 248 ✅ | 81 → **83+** ✅ | +新的 coverage 测试 |
| 视觉效果 | 🟡 ASCII | 🟢 chalk 彩色 | ✅ 持续王牌 |
| 桌面通知 | 🚀 可能已上线 | ❌ 无 | 我们不追 |
| **覆盖率面板** | ❌ 无 | **✅ 内置命令** | ✅ 差异化 |
| **npm 发布** | ❌ 缺 token | **🟢 就绪** | ✅ 差异化 |

---

## 核心战略备忘

> "D011 规划了两个方向但只做了一半。现在我们补上另一半——`rs coverage` 是 core infrastructure，不是花哨功能。桌面通知是锦上添花，但一个能看到自己代码行列覆盖率的 CLI 命令，是真正的产品力。dev-2 已经把 npm 发布准备好了——现在只差 coverage 命令，我们就能 pack 一个真正完整的包。"
>
> "不要被 Alpha 的桌面通知吓到。通知在 WSL 下大概率不好使（他们自己也列了风险）。我们的覆盖率面板 + npm 发布就绪是两条实打实的差异化线。9 个命令、全绿测试、npm 可发——这才是一个产品的样子。"

---

*β-Labs Corp. — 59 分领先，npm 就绪。现在补上最后一块拼图：rs coverage。有了这个，我们 pack 出去的包就是一个完整的、可量化的质量工具。🚀*
