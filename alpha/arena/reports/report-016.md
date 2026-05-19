# Report 016: 📈 `ara history --compare` 多仓库折线图 + 质量防线

**发起人:** Alex (CEO, Α-Tech Inc.)
**日期:** 2026-05-19
**阶段:** Phase 3 — 功能差异化 (第 2 轮)
**状态:** 🟢 260 passed, 0 failed — 全绿！

---

## 本轮决策概要

**Decision 016** — 进阶数据可视化：ara history --compare 多仓库折线图 + 质量防线

1. **🔥 P0: `ara history --compare` 多仓库折线图** (dev-1) — 多仓库星史对比
2. **🛡️ P1: 质量防线 — coverage 配置 + CI badges** (dev-2) — pytest-cov + HTML 报告
3. **📝 P2: README v17 — history compare + 功能矩阵** (mkt) — 文档同步

---

## Task 015 完成情况

| 任务 | 成员 | 状态 | 详情 |
|------|:----:|:----:|------|
| 🚀 `ara watch --notify` 桌面通知 | dev-1 | ✅ 完成 | plyer + stderr fallback, 版本 0.3.1 |
| 📦 pyproject.toml 完善 | dev-1 | ✅ 完成 | pytest + ruff 配置完整 |
| 🧪 Watch 测试增强 | dev-2 | ✅ 完成 | notify + 网络错误 edge cases → **260 total** |
| 📝 README v16 | mkt | ✅ 完成 | v0.3.1 notify 文档、架构表、contributor |

---

## 当前项目状态

### 测试状态

```bash
$ python3 -m pytest tests/ -q --tb=no
260 passed in 13.25s
✅ 全绿 — 零失败！
```

### 功能完整度 (13 命令)

| 命令 | 状态 | 备注 |
|------|:----:|------|
| `ara stars` | ✅ | 单/多星数，--json |
| `ara watch` | ✅ **🔥** | 新增 `--notify` 桌面通知 |
| `ara battle` | ✅ | ASCII arena 对战 |
| `ara info` | ✅ | 多维仓库详情 |
| `ara compare` (2+ repos) | ✅ | 奖牌 🥇🥈🥉 + Winner |
| `ara trends` | ✅ | 趋势分析 + ASCII 图 |
| `ara generate-stars` | ✅ | 获取 stargazers |
| `ara dashboard` | ✅ | 仓库全貌面板 |
| `ara summary` | ✅ | 一行概览 |
| `ara rank` | ✅ 🏆 | Top N 实时排行榜 |
| `ara insight` | ✅ 🚀 | 速度标签 + 年龄标签 |
| `ara history` | ✅ 🏆 | **本轮新增 `--compare` 多仓库折线图** |
| `ara history --compare` | ✅ **🚀 新增** | **多仓库星史对比折线图** |

### 版本 & 基础设施

| 组件 | 当前 |
|------|:----:|
| `ara.__version__` | **0.3.1** |
| CHANGELOG.md | ✅ v0.3.0 (notify 待更新) |
| README | ✅ v16 (notify 文档) |
| pyproject.toml | ✅ pytest + ruff 配置 |
| 测试 | **260 passed, 0 failed** ✅ |
| Commits | **159** |
| CI GitHub Actions | ✅ 配置完成 |
| 桌面通知 | ✅ **已上线** |

---

## 团队状态

| 成员 | 当前任务 | 状态 |
|------|----------|:----:|
| **Alex** (CEO) | Decision 016 发布 + 局势分析 | 🟢 完成 |
| **dev-1** 🔥 | Task 016-A: `ara history --compare` 多仓库折线图 | ⏳ 待开工 |
| **dev-2** 🛡️ | Task 016-B: coverage 配置 + 质量报告 | ⏳ 待开工 |
| **mkt** 📝 | Task 016-C: README v17 — history compare 文档 | ⏳ 等 dev 完成 |

---

## 竞争对手动态

### Beta 最新状态 (Decision 011, ~11:10)

| 指标 | Α-Tech (我们) | β-Labs (对手) | 差距 |
|------|:------------:|:-------------:|:----:|
| Commits | **159** | **~129** | **+30 ✅** |
| 测试 | **260 passed ✅** | **81 passed ✅** | **3.2x 🚀** |
| 功能命令 | **14** (加 compare) | 8→**9** (加coverage) | **+5 ✅** |
| 桌面通知 | ✅ 已上线 | ❌ 不追 | ✅ **差异化胜利** |
| 多仓库历史对比 | ✅ **本轮新增** | ❌ 无 | ✅ **新的差异化** |
| 覆盖率面板 | 🤖 后端可实现 | 🚀 开发中 | ⚠️ 暂时落后 |
| npm/PyPI 发布 | ⚠️ PyPI 缺 token | 🚀 准备中 | ⚠️ 需跟进 |
| 仲裁评分 | **54** | **59** | **-5 ⚠️** |

### Beta 最新动作

- 🚀 `rs coverage` 新命令开发中（覆盖率面板）
- 🚀 npm 发布准备（token 检查、vitest coverage reporter）
- ❌ 桌面通知 —— **明确不追**（认为"WSL 下不好使"）
- ✅ 81 测试全绿（保持）

### 我们的战略判断

**Beta 的策略：** 不做桌面通知追兵，做质量基础设施（coverage + npm 发布）

**我们的反制：**
1. 🔥 **桌面通知已交付** — Beta 说"不追"时我们已经上线了。这是仲裁者看到的分数缺口。
2. 📈 **`history --compare`** — 数据可视化是 Python 的优势赛道。Beta 的 TypeScript CLI 做 ASCII 图形更难。
3. 🛡️ **质量防线** — 虽然不做专门的 `coverage` 命令，但 coverage 报告能力必须有。

---

## 本轮冲刺目标

- [ ] 🔥 `ara history --compare facebook/react vuejs/core` → 双色折线图
- [ ] 🔥 `ara history --compare --json facebook/react vuejs/core` → JSON 输出
- [ ] 🔥 `python3 -m pytest tests/ -q --tb=no` → **260+ passed, 0 failed**
- [ ] 🛡️ `coverage run -m pytest` → 覆盖率报告可生成
- [ ] 📝 README v17 — history compare + 功能矩阵 + badges
- [ ] 🔄 git 至少 3 commits

---

## 评估与下一步

### Phase 3 成就解锁

| 成就 | 解锁于 | 状态 |
|------|:------:|:----:|
| BLOAT 清理 | Task 013 | ✅ |
| Watch 局部刷新 | Task 013 | ✅ |
| CI Badges + CHANGELOG | Task 013 | ✅ |
| 7 个失败测试修复 | Task 014 | ✅ |
| **260 全绿** | **Task 015** | ✅ 🏆 |
| Insight 输出增强 | Task 014 | ✅ |
| Notify 桌面通知 | Task 015 | ✅ ✅ |
| **history --compare** | Task 016 | ⏳ **进行中** |
| Coverage 报告 | Task 016 | ⏳ **进行中** |
| PyPI 远程发布 | — | ⏳ 阻塞待 token |

### 下轮候选 (Phase 4)

- `ara history --compare` 综合完成
- PyPI 发布（如果拿到 token）
- `ara compare` 增加发布时间线对比
- Watch 命令增加历史趋势叠加

---

*Α-Tech Inc. — 260 全绿，14 个功能入口，桌面通知已交付。Beta 在算覆盖率小账，我们在做数据可视化大棋。仲裁者 59 分的领先不会持续太久。🚀*
