# 📊 Cycle 1 启动报告 — Atlas (CEO, Alpha Team)

**日期:** 2026-06-09
**报告人:** Atlas (CEO, A-Tech Inc.)
**周期:** 1/10
**项目:** paper-digest (全新启动)

---

## 执行摘要

Cycle 1 是项目的**地基工程**。双方都在同一起跑线（init scaffold），我们没有追对手的功能——我们建地基。

本轮核心目标：
1. **arXiv 抓取 + 缓存** (P0) — 所有功能的数据基石
2. **CLI 骨架 + rich 终端输出** (P0) — 产品的门面
3. **subscribe/read 命令骨架** (P1) — MVP 三命令齐全

---

## 情报分析

### 对手状态
- Beta 从 TypeScript scaffold 起步，使用 chalk（纯颜色，无表格/面板）
- 双方当前都是 1 个 placeholder 测试
- Beta 的 npm 发布比我们的 PyPI 简单，但前几轮没有发布压力

### 差距分析

| 维度 | 我们 (Alpha) | 对手 (Beta) | 差距 |
|:-----|:-----------:|:-----------:|:----|
| 终端 UI | rich (表格/面板/进度条) | chalk (颜色) | ✅ 领先 |
| 抓取 | requests + retry + 缓存 | fetch (无 retry/缓存) | ✅ 领先 |
| 测试基础 | pytest (结构化) | vitest | 持平 |
| 可发布性 | pip install -e . | npm link | 持平 |
| 个性化排序 | ❌ 未实现 | ❌ 未实现 | 持平 |

### 核心洞察
Beta 的 TypeScript 栈在 UI（chalk）和发布（npm）上有天生优势。但我们的 Python 栈在**数据处理深度**上有结构性优势——numpy、scikit-learn 的 TF-IDF、sentence-transformers 的嵌入，这些都是 Beta 需要额外找库的。**这正是我们"深度碾压"策略的技术基础。**

---

## 本轮决策

**Decision 001** — 地基工程：arXiv 抓取 + CLI 骨架

### 策略：70% 地基 + 30% 展望

本轮不做花哨功能。三件地基级工作：

1. **`fetcher.py`** — arXiv API 封装，带指数退避 retry (3次) + 1h TTL 缓存
2. **`display.py`** — rich 表格/面板渲染，比 chalk 更专业的终端输出
3. **`cli.py`** — 三个子命令骨架（digest / subscribe / read）

### 为什么不做排序和摘要？
- 排序依赖抓取（先有数据才能排序）
- 摘要依赖展示框架（先有 CLI 路径才能显示摘要结果）
- 地基不稳，上层建筑会层层塌方

---

## 资源分配

| 任务 | 优先级 | 负责人 |
|:----|:------:|:------|
| Task 001-A: arXiv 抓取 + 缓存 | 🔴 P0 | dev-1 |
| Task 001-B: CLI 骨架 + rich + digest | 🔴 P0 | dev-1 |
| Task 001-C: subscribe/read 骨架 | 🟡 P1 | dev-1 |

---

## 预期交付

| 交付物 | 状态 | 说明 |
|:------|:----:|:-----|
| `paper_digest/fetcher.py` | 📋 已规划 | retry + 缓存 + 解析 |
| `paper_digest/models.py` | 📋 已规划 | Paper dataclass |
| `paper_digest/display.py` | 📋 已规划 | rich 表格/面板 |
| `paper_digest/cli.py` 重写 | 📋 已规划 | argparse 三命令 |
| README 更新 | 📋 已规划 | 安装 + 使用示例 |
| 测试 ≥ 15 个 | 📋 已规划 | fetcher 8 + cli 7+ |

---

## 风险监控

| 风险 | 概率 | 影响 | 缓解 |
|:----|:----:|:----:|:-----|
| arXiv API 限流/不可用 | 🟡 中 | 🔴 高 | 缓存 + retry + 测试用 mock |
| rich 在 WSL 终端渲染异常 | 🟢 低 | 🟡 中 | 本地测试确认 |
| commit 超 80 行 (BLOAT) | 🟡 中 | 🟡 中 | fetcher/display/cli 各拆独立 commit |
| Beta 快速迭代 UI | 🟢 低 | 🟢 低 | chalk 上限不如 rich，不追 |

---

## Cycle 2 预告

下轮要干的事：

1. **TF-IDF 排序** 🔥 — 个性化排序是 MVP 第二大块，也是我们比 Beta 有深度优势的地方
2. **规则摘要** — 基于 abstract 的结构化摘要（不依赖 LLM）
3. **Markdown 导出** — 第二个输出渠道

---

## 一句话总结

> *"地基不牢，后面全倒。这一轮不追酷，只追稳。"*

*Atlas @ A-Tech Inc. — Cycle 1*
