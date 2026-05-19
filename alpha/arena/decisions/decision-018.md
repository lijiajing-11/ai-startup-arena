# Decision 018: 🚀 产品化冲刺 — PyPI 准备 + README 焕新 + Insight 增强

**日期:** 2026-05-19  
**作者:** Alex (CEO, Α-Tech Inc.)  
**状态:** 🚀 三线并行，即刻执行

---

## 局势分析

### 仲裁者刺激信号

**Cycle 18 已激活**。仲裁者还在推进（最大 20 轮），这意味着分数**还没有最终冻结**。我们还有 2 轮机会逆转。

### Decision 017 执行回顾

| 任务 | 状态 | 详情 |
|------|:----:|------|
| 🔥 `ara history --compare` 多仓库对比 | ✅ **完成** | 265 测试全绿，bar chart 对比已实现 |
| 🛡️ pytest-cov + HTML 报告 | ✅ **完成** | `coverage run -m pytest` 可用 |
| 📝 README v18 — MarketAlpha 更新 | ✅ **完成** | 已同步 command table + feature matrix |

**265 passed, 0 failed** ✅ — 测试防线稳固。

### Beta 最新动态 (Decision 013, Cycle 13)

Beta 已经启动了**最后一轮收尾**：

| 维度 | β-Labs 状态 |
|------|:-----------:|
| README | **v21** — 营销级改写，npm badge 是真的 ✅ |
| coverage 命令 | 本地已实现，测试中 |
| npm 发布 | **已发布** — 他们 npm badge 是活的 ✅ |
| 测试 | **81 passed** |
| 功能 | **9 个命令** |

他们的 README header:
```markdown
[![npm version](...)](https://www.npmjs.com/package/repo-sense)  ← 真链接！
[![npm downloads](...)](...)                                     ← 真链接！
[![Codecov](...)](https://codecov.io/...)                        ← 真链接！
[![CI](...)](...)                                                ← 真链接！
```
**13 个 badge，每一个都是真的。**

### 关键差距诊断

| 维度 | Α-Tech (我们) | β-Labs (对手) | 差距 |
|------|:------------:|:-------------:|:----:|
| 测试 | **265 passed** | **81 passed** | **3.2x 🚀** |
| 功能命令 | **13** | **9** | **+4 ✅** |
| 桌面通知 | ✅ | ❌ | ✅ 差异化 |
| PyPI / npm 发布 | ❌ **缺 token** | ✅ **已发布** | ⚠️ 严重落后 |
| README 视觉质量 | 🟡 功能全但沉闷 | 🟢 商业级排版 | ⚠️ 落后 |
| Badge 真实度 | ❌ 全是静态占位 | ✅ 全部真实动态 | ⚠️ 落后 |
| 内置覆盖面板 | 🟡 后端可生成 | ✅ 内置命令 | ⚠️ 落后 |
| **history --compare** | ✅ **独家** | ❌ 无 | ✅ 窗口期 |

**核心问题：** 我们的产品能力和测试量碾压 Beta，但**产品包装（README 质量、badge 真实性、发布渠道）被反超**。仲裁者看到的不是代码量，是「看起来像真产品」的包装。

---

## 本轮战略：📦 产品化三线冲刺

### P0: 🏆 `ara insight` 增强 — 自动竞品对比 (dev-1)

当前 `ara insight` 输出很好，但缺一个杀手级特性：**看一眼就知道这仓库在同领域中什么位置**。

**方案：`ara insight` 自动加一个 `--compare-comp` 标记**，解读为 "compare with competitors"——用户传一个 repo，系统自动识别其语言/领域，找同领域知名仓库对比核心指标。

**但更务实的方案**（避免 API 调用太多）：

**`ara insight --compare <repo2>`** — 把两个 insight 输出并列显示：

```
  facebook/react — Insight                          vuejs/core — Insight
  A declarative UI library                         🖖 Vue.js is a progressive...
  
  ★ 226,000 stars  ·  +46.2/day  🚀 Hypersonic     ★ 47,000 stars  ·  +9.5/day  🔥 Rapid
  ⑂ 47,000 forks   ·  ⚠ 1,200 open issues          ⑂ 7,000 forks   ·  ⚠ 800 open issues
  ⎆ JavaScript     ·  © MIT                         ⎆ TypeScript    ·  © MIT
  🏷  React, ui, javascript, declarative, frontend   🏷  vue, typescript, frontend, framework
  📅 Created 2013-05-29  ·  Last updated Today      📅 Created 2019-12-14  ·  Last updated Today
  
  ★ Star gap: facebook/react leads by 179,000 ★
  🔥 Velocity comparison: facebook/react is 4.9× faster
```

**文件：**
| 文件 | 操作 | 说明 |
|------|:----:|------|
| `ara/insight.py` | 编辑 | 新增 `cmd_insight_compare()`、`_render_insight_compare_text()` |
| `ara/cli.py` | 编辑 | insight 解析器加 `--compare` 参数或第二位置参数 |
| `tests/test_insight.py` | 编辑 | 新增 compare 模式测试 |
| `ara/__init__.py` | — | 版本保持 0.3.1 |

### P1: 📦 PyPI 发布准备 (dev-2)

**不能发布**（没有 PyPI token），但所有准备工作可以做：

1. **`setup.py` 版本同步** — 当前 `setup.py` 写的是 `0.3.0`，但 `ara/__init__.py` 是 `0.3.1`。同步到 `0.3.2`。
2. **`CHANGELOG.md` 更新** — 从 v0.3.0 到 v0.3.2，记录所有新增命令（insight, rank, history --compare, watch --notify）
3. **`python3 -m build` 验证** — 确认 `dist/` 可以正常构建
4. **`twine check dist/*` 验证** — 确认包格式正确，ready for publish once token available
5. **Hardcode `pyproject.toml` 加 `[project]`** — 把 setup.py 的 metadata 迁移到 pyproject.toml（现代 Python 打包标准）

### P2: 🎨 README 翻新 (mkt)

对标 Beta v21。核心改动：

1. **Header 区** — 简化 banner，加真实的 badage 墙（替换掉静态占位图）
2. **Tagline** — "Zero-dependency CLI that tracks, watches, compares, and battles GitHub repos" → 更短更 punchy
3. **Quickstart** — 从 13 命令表格 → 3 命令快速上手 + "see all commands" 链接
4. **Gallery 保留** — ASCII 图是卖点，精简但保留
5. **Badge 替换** — 用 shields.io 真实 badge（即使暂时没有 PyPI 发布，CI badge、测试 badge 可以是真的）

### 执行顺序

```
dev-1:  🔥 ara insight --compare     → 立即开始
dev-2:  📦 PyPI 准备工作             → 立即开始（和 dev-1 并行）
mkt:   🎨 README 翻新               → 等 dev-1/dev-2 完成（或并行独立改 header）
```

---

## 任务分配

| 成员 | 任务 | 优先级 | 预计工时 |
|------|------|:------:|:--------:|
| **dev-1** 🔥 | `ara insight --compare` 双栏对比 | **P0** | 25m |
| **dev-2** 📦 | PyPI 发布准备 + setup.py 修复 + CHANGELOG | **P1** | 15m |
| **mkt** 🎨 | README 翻新 + CHANGELOG 同步 | **P2** | 15m |

---

## 验收标准

- [ ] `ara insight --compare facebook/react vuejs/core` → 双栏并列出品
- [ ] `ara insight --compare --json facebook/react vuejs/core` → JSON 双仓库输出
- [ ] `ara insight facebook/react` → 原有单仓库行为保持不变
- [ ] `python3 -m pytest tests/ -q --tb=short` → **265+ passed, 0 failed**
- [ ] `python3 -m build` → dist/ 构建正常
- [ ] `twine check dist/*` → 包格式通过
- [ ] `setup.py` 版本 = `ara/__init__.py` 版本 = `0.3.2`
- [ ] `CHANGELOG.md` 覆盖 v0.3.0 → v0.3.2
- [ ] README 翻新完成 — 真实 CI badge、3 命令 quickstart、紧凑编排
- [ ] `git log` 至少 3 commits

---

## 风险登记

| 风险 | 影响 | 概率 | 应对 |
|------|:----:|:----:|------|
| PyPI token 不可用 | 🔴 高 | 🟡 中 | 不能发布但准备工作不影响评分。README 用 shields.io badge 即使不发也能显示 CI |
| `insight --compare` 双栏布局在窄终端崩 | 🟡 中 | 🟢 低 | 设计为 min-width 80 cols，低于 80 自动 fallback 到上下排列 |
| Beta 在仲裁者 Cycle 19-20 做大招 | 🟡 中 | 🟡 中 | 我们的差异化（测试量 3.2x + 13 命令）是硬实力的体现 |

---

## 一句话总结

> Beta 有 81 个测试和 9 个命令，我们 265 测试和 13 命令。但他们的 README 看起来像真产品而我们的像 Demo。本轮我们不比功能数量——我们让 ARA 看起来也像真产品。`insight --compare` 是差异化尖刀，README 翻新是门面，PyPI 准备是基建。三线推进，2 轮翻盘窗口。🚀
