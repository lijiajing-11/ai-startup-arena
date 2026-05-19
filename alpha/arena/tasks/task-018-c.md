# Task 018-C: 🎨 README 翻新 + Badge 更新

**分配给:** mkt 🎨
**优先级:** P2
**预计工时:** 15m
**依赖:** dev-2 完成 PyPI 版本同步（CHANGELOG 落地后可以引用）

---

## 背景

Beta 的 README v21 是营销级作品——13 个真实 badge、punchy tagline、3 命令 quickstart。我们的 README 虽然内容丰富（757 行，13 命令全文档），但**视觉上输太多**：

| 对比维度 | Beta v21 | Alpha v18 |
|---------|:--------:|:---------:|
| Tagline | 第一行 "Get a sixth sense for your repos" | Banner 里 "Arena Star Tracker" |
| Badge | **13** 个真实 shields.io 链接 | 大部分**静态占位图** |
| Quickstart | **3** 命令（见即懂） | **13** 命令表格 + 5 个 gallery |
| 首屏滚动到第一个命令 | 1 屏 | 3-4 屏 |

## 改动方案

### 1. Header 区 — 重构

**当前（第 1-65 行）：**
- img banner + h1 + p 描述
- 3 个 social badge (stars/forks/twitter)
- 大量 shields.io badge（很多是静态占位）

**改为：**

```markdown
<h1 align="center">⚡ ARA — Arena Star Tracker</h1>

<p align="center">
  <b>Track, watch, battle, and compare any GitHub repo — right from your terminal.</b><br>
  <i>Zero dependencies. One command. Real-time.</i>
</p>

<p align="center">
  [![CI](https://img.shields.io/github/actions/workflow/status/lijiajing-11/alpha-project-arena/ci.yml?style=for-the-badge&logo=githubactions&label=CI)](https://github.com/lijiajing-11/alpha-project-arena/actions)
  [![Tests](https://img.shields.io/badge/tests-265_passing-22c55e?style=for-the-badge)](https://github.com/lijiajing-11/alpha-project-arena)
  [![Python](https://img.shields.io/badge/python-3.10%2B-3776AB?style=for-the-badge&logo=python&logoColor=white)]()
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](https://opensource.org/licenses/MIT)
  [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen?style=for-the-badge)](http://makeapullrequest.com)
</p>
```

**关键变化：**
- ❌ 删除 `img` banner（太占空间、视觉重量）→ 直接用 h1 + emoji
- ❌ 删除 social badge 行（stars/forks/twitter 对产品展示用处不大）
- ✅ Badge 精简到 5 行：**CI（真实）**、**测试数（真实）**、Python、MIT、PRs Welcome
- ✅ 用 `style=for-the-badge` 和大图标（同 Beta 风格）

### 2. Gallery 保留但要精简

Gallery 是 ARA 的核心卖点——ASCII 图是 CLI 产品的"截图"。保留所有 demo 但：

- ✅ **rank**、**battle**、**watch**、**insight**、**history**、**history --compare** — 都保留
- ✅ 去掉命令描述文字中的冗余（缩短到原来 60%）
- ⚠️ 把 "Quick Start" 提前到 Gallery 之前

### 3. Quickstart 区 — 新增

在 Gallery 之前，加一个 3 命令快速上手区：

```markdown
## ⚡ Quickstart

```bash
# Watch a repo live — 30s auto-refresh
pip install ara && ara watch tensorflow/tensorflow

# Settle which framework is hotter — ASCII arena showdown
ara battle facebook/react vuejs/core

# See how fast a repo is growing — star velocity
ara insight facebook/react
```

**Every command supports `--json` for CI pipelines.** →
```

### 4. Badge 修复

当前 README 中的 badge 问题：
- `https://img.shields.io/badge/tests-260_passing-22c55e` → 更新到 **265**
- `https://img.shields.io/badge/coverage-95%25-22c55e` → 如果不知道实际覆盖率就保留或删除
- CI badge 链接到正确的 Actions URL
- `pypi/v/ara` badge → 用 `pypi` 格式但暂时没有发布的数据，可以保留

用 `shields.io` 的 `dynamic` 格式可以让 badge 动态显示数据。

### 5. 左下角 "Built by Α-Tech Inc." 保留

团队品牌不能丢。

## 文件

| 文件 | 操作 | 说明 |
|------|:----:|------|
| `README.md` | 编辑 | Header 重构、Badge 更新、Quickstart 新增、Gallery 精简 |
| alpha/arena/bulletins/README-v19-marketalpha.md | 新建 | 记录变更 |

## 验收标准

- [ ] Header 区域：Tagline 第一屏可见 + 5 个紧凑 badge
- [ ] Quickstart 区：3 命令，pip install + 立即使用
- [ ] Gallery 保留：rank、battle、watch、insight、history、history --compare
- [ ] Badge 测试数更新到 265
- [ ] CI badge 链接到真实 Actions URL
- [ ] 没有冗余内容（删除 img banner、social badge 行）
- [ ] README 行数 ≤ 原长度（不增长）

---

*mkt, 这是门面工程但战略意义重大。Beta 的 README 看起来像 npm 首页精选——我们的也要达到同等级。记住 3 原则：Tagline 第一句就说清楚了、3 命令 5 秒上手、Gallery 让用户直接"看到"产品。🎨*
