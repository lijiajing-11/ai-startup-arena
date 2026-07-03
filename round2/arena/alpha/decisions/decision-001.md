# Decision 001: Cycle 1 — 地基工程：arXiv 抓取 + CLI 骨架

**日期:** 2026-06-09
**决策者:** Atlas (CEO, A-Tech Inc.)
**周期:** 1/10
**项目:** paper-digest (全新启动)

---

## 情报收集

### 我方状态
- `alpha/repo/` 刚 init scaffold：pyproject.toml + cli.py 骨架 + 1 个 placeholder 测试
- 依赖：requests, rich（已声明）
- 测试：1 个 (test_import)，覆盖率 ~0%
- PyPI：未发布（但已声明 `paper-digest = "paper_digest.cli:main"` 入口）

### 对手状态
- `beta/repo/` 同步 init：TypeScript scaffold + package.json + tsconfig + placeholder test
- 技术栈：chalk + fetch（比我们轻但缺 retry/缓存）
- 发布方式：npm（比我们容易发布）

### 竞品差距分析
| 维度 | Alpha (Python) | Beta (TypeScript) |
|:-----|:--------------:|:-----------------:|
| 语言生态 | ✅ 原生 arXiv API (`arxiv` 库可选) | fetch + Atom API |
| 终端 UI | ✅ rich (表格/面板/进度条) | chalk (纯颜色) |
| 缓存 | ❌ 待实现 | ❌ 待实现 |
| 测试 | 1 | 1 |
| 排序 | ❌ 待实现 | ❌ 待实现 |
| 发布 | pip install -e . 可 | npm link 可 |

### 核心洞察
双方在同一起跑线。第一轮的核心任务是 **建地基**，而不是追功能。谁的地基更稳（缓存策略、错误处理、测试覆盖），后面的轮次谁就能更快迭代。

---

## 战略决策

### 核心策略：深度地基
**70% 自己节奏 + 30% 应对对手**

本轮不做花哨功能。只做三件事，每件都是后续所有功能的地基：

### Task 1 (P0): arXiv 抓取 + 本地缓存模块 🔴
**为什么：** 所有功能（摘要、排序、推送）都依赖论文数据。如果没有带 retry + 缓存的抓取模块，后面每次开发都在等 arXiv API，体验极差。这是整个产品的基石。

**范围：** 
- `paper_digest/fetcher.py` — arXiv API 封装
  - 按 topic 查（`cat:cs.AI+cat:cs.CL`）
  - 按 ID 查单篇
  - 指数退避 retry (3 次)
  - 响应缓存（TTL=1h，防止同一 topic 重复请求）
- 测试：3+ 测试（mock API 响应 + 缓存命中 + retry 触发）

### Task 2 (P0): CLI 骨架 + `digest` 命令 + rich 输出 🔴
**为什么：** 没有 CLI 就没有产品。`digest --topic "LLM" --top 10` 是 MVP 三命令之首。要先做出骨架，下次加排序和摘要才有载体。

**范围：**
- `paper_digest/cli.py` — 用 `argparse` 或 `typer` 实现子命令
- `paper_digest/display.py` — rich 表格/面板渲染论文列表
- 支持 `digest --topic "LLM" --top 10` (先走通，排序逻辑后续迭代)
- `paper_digest/models.py` — Paper dataclass（统一数据模型）
- 测试：5+ 测试

### Task 3 (P1): `subscribe` 和 `read` 命令骨架 🟡
**为什么：** 三命令齐全才有 MVP。这两个是轻量的 CLI 入口，不需要复杂逻辑。

**范围：**
- `subscribe --topic "RAG"` — 订阅管理（先写文件存储，后续加 Email）
- `read <arxiv_id>` — 单篇详情（复用 fetcher）
- 测试：2+ 测试

---

## 资源分配

| 任务 | 负责人 | 优先级 | 预计提交 |
|:----|:------|:------:|:--------|
| arXiv 抓取 + 缓存 | dev-1 | 🔴 P0 | 2-3 commits |
| CLI 骨架 + digest + rich | dev-1 | 🔴 P0 | 2-3 commits |
| subscribe + read 骨架 | dev-1 | 🟡 P1 | 1-2 commits |

## 风险监控

| 风险 | 概率 | 影响 | 缓解 |
|:----|:----:|:----:|:-----|
| arXiv API 限流 | 中 | 高 | 缓存 + retry + 本地 fixture |
| rich 输出在 WSL 乱码 | 低 | 中 | 测试在 WSL 本地运行确认 |
| 对手提前出 rich-style UI | 低 | 低 | 我们在做地基，UI 后面可快速迭代 |
| commit 超 80 行 (BLOAT) | 中 | 中 | 每个模块拆成多个 commit |

---

## Cycle 1 预期交付

1. ✅ `paper-digest digest --topic "cs.AI" --top 5` 能跑通
2. ✅ rich 表格展示论文标题/作者/日期
3. ✅ 本地缓存避免重复请求
4. ✅ `pip install -e .` 后 CLI 可用
5. ✅ 测试 ≥ 10 个，全部绿色
6. ✅ README 安装指南更新

---

*Atlas, CEO @ A-Tech Inc. — Cycle 1*
*"地基不牢，后面全倒。这一轮不追酷，只追稳。"*
