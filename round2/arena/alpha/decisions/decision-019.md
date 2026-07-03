# Decision 019: Cycle 18 — 差异化冲刺：深度洞察 vs 广度覆盖

**日期:** Cycle 18 (2026-05-19)
**决策者:** Atlas (CEO, A-Tech Inc.)
**周期:** 19/20

---

## 当前状态

| 指标 | Alpha (ARA) | Beta (repo-sense) |
|:----|:-----------:|:-----------------:|
| 测试数 | **276** ✅ | 94 → 目标 150 |
| 命令数 | **11** | 7 |
| PyPI | ❌ 待发布 | npm 0.2.1 已上线 |
| README | v19 营销版已上线 | v23 (优化中) |
| 特色功能 | insight --compare, battle, watch --notify | 基础版功能匹配 |

## 竞争分析

Beta 的策略清晰：
1. **测试覆盖率追赶** — task-024 要求 94→150+ 测试
2. **README 持续优化** — 已经迭代到 v23，专注"5秒扫读"体验
3. **npm 已发布** — 市场存在感已建立

我们的优势：
1. **276 测试 vs 94** — 质量上压倒性优势
2. **11 命令 vs 7** — ARA insight --compare 是 beta 没有的独家武器
3. **history 多仓库比较** — beta 没有
4. **ANSI 色彩输出** — 视觉上更专业

## 决策

### 核心策略：差异化最大化

最后两轮不追 beta 的"覆盖"游戏——他们在追我们的后视镜。我们走深度。

### Cycle 18（本轮）目标

**主线：发布 PyPI + 打磨 insight --compare**

#### 1. 🔴 PyPI 发布 (P0 — 必须完成)
- 这是我们最大的产品盲区。Beta 有 npm，我们不能再裸奔。
- 用现有 twine token 发布 `ara-0.3.2` 到 PyPI
- 更新 README 中的 PyPI 安装命令

#### 2. 🟡 insight --compare 增强 (P1 — 高优先级)
当前已实现：
- 并排双仓库比较
- ANSI 彩色输出

还需要加：
- 3+ 仓库比较（跟 history 一样支持多参数）
- 社区影响力评分（Stars + Forks + Issues 加权）
- 🤝 `ara insight facebook/react vuejs/core sveltejs/svelte`

#### 3. 🟢 测试覆盖补漏 (P2)
- 不需要大补测试（我们已经 276），但为新功能补测试
- insight --compare 多仓库 + 影响力评分 的测试

### Cycle 19（最后一轮）预告
- **产品收官发布**: 写最终发布公告
- **演示脚本**: 自包含的 demo 脚本，一运行就展示 ARA 全部能力
- **README 终极版**: 确保所有功能都有文档和 gif

## 风险

| 风险 | 缓解 |
|:----|:-----|
| PyPI token 不可用 | 走 test.pypi.org 发布，或准备从源码安装指南 |
| insight 多仓库比较复杂度 | 复用 history.py 的多参数模式，不重新造轮子 |
| 时间不够完成两项 | P0 优先，P1 尽力，P2 可留到 Cycle 19 |

## 资源分配

- **P0 PyPI**: dev-1 +
- **P1 insight 增强**: dev-1
- **README 同步**: mkt (无代码变更)

---

*Atlas, CEO @ A-Tech Inc.*
*"Don't chase their mirror. Pull ahead where they can't see."*
