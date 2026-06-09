# Decision 002: Cycle 2 — 核心链路闭环 + 订阅存储地基

**日期:** 2026-06-09
**决策者:** Atlas (CEO, A-Tech Inc.)
**周期:** 2/10
**项目:** paper-digest

---

## 1️⃣ 情报收集

### 我方状态 (Cycle 1 交付)
- ✅ `arxiv_client.py` — arXiv 抓取 + 指数退避 retry + 1h TTL 本地缓存
- ✅ `sorter.py` — 手写 TF-IDF 排序（无 scikit-learn 依赖）
- ✅ `summarizer.py` — 规则摘要（关键词/贡献分类/新颖度/方法论/可读性/关键发现）
- ✅ `formatter.py` — rich 终端表格 + Markdown 导出（含 `_summary` 渲染分支）
- ✅ `cli.py` — 三命令骨架（digest / subscribe / read）
- ✅ 测试 47 个，全部绿色
- ❌ `_summary` 从未被写入 digest 流程（formatter 检查但 summarizer 未集成）
- ❌ `subscribe` 和 `read` 是 placeholder
- ❌ CLI `--output` 参数在 README 中写为 `--export`，cmd line 实际是 `--output`

### 对手状态
- Beta 只有 1 个 commit（init scaffold），还在一穷二白阶段
- Beta 技术栈 TypeScript/chalk→ 输出丰富度不如我们 rich
- 差距窗口仍然坚固

### 核心洞察
Cycle 1 建了 6 个模块，但核心管道没通：
1. `digest` 路径：fetch → sort → display ✅，但 **summarizer 从未被调用**。formatter 里的 `_summary` 渲染分支是死代码。
2. `read` 命令：placeholder，连 arXiv ID lookup 都没做。
3. `subscribe` 命令：placeholder，无存储。

这些不是新功能，而是**已交付功能的完整链路闭环**。先把已建模块串起来，比加新功能更值。

---

## 2️⃣ 差距分析

| 维度 | 我们 (Alpha) | 对手 (Beta) | 差距 | 决策 |
|:-----|:-----------:|:-----------:|:----|:-----|
| 抓取 | ✅ retry+缓存 | ❌ 未实现 | 大幅领先 | 维持 |
| 排序 | ✅ 手写 TF-IDF | ❌ 未实现 | 大幅领先 | 维持 |
| 摘要 | ✅ 规则摘要(7维度) | ❌ 未实现 | 大幅领先 | 维持 |
| 终端UI | ✅ rich 表格+面板 | ❌ chalk（未实现）| 大幅领先 | 维持 |
| **digest 管道** | ⚠️ summarizer 未集成 | N/A | 内部缺陷 | **修复** |
| **read 命令** | ❌ placeholder | ❌ placeholder | 持平 | **攻击** |
| **subscribe 命令** | ❌ placeholder | ❌ placeholder | 持平 | **地基** |
| Markdown 导出 | ✅ | ❌ 未实现 | 领先 | 维持 |
| 测试 | 47 (100% pass) | 1 | 大幅领先 | 维持 |

---

## 3️⃣ 策略制定

### 核心策略：核心链路闭环（70% 自己节奏 + 30% 补短板）

**本轮不做新功能。只做三件事，把 Cycle 1 交付的模块真正串起来：**

### Task 1 (P0): 🔴 summarizer 接入 digest 管道 + `read` 命令

**为什么：** digest 是 MVP 头号命令，但 6 个模块中 summarizer 是孤岛——generate_summary() 写了、formatter 里有渲染分支（`_summary`），但中间没有调用链。这是"已交付但没效果"的质量扣分点。必须填补这个断链。

同时 `read` 是三大命令之一，依赖 summarizer + arxiv_client（按 ID 查单篇获取完整 abstract），可以实现完整的论文详情页。

**范围：**
- `cli.py` _cmd_digest：对每篇论文调用 `generate_summary()`，结果写入 `_summary`
- `cli.py` _cmd_read：按 arXiv ID 调 `fetch_by_id()`（新函数）+ 显示摘要详情 + summarizer 输出
- `arxiv_client.py` fetch_by_id() — 按 ID 查单篇（arXiv API 支持 `id_list` 参数）
- `display.py` 或 `cli.py`：print_single_paper() 显示单篇详情面板
- 测试：5+ 新测试

### Task 2 (P0): 🔴 subscribe 命令 — JSON 存储 + 基础管理

**为什么：** subscribe 是三大命令之一，是后续 Push 推送的地基。不做复杂 UI，先做文件级 JSON 存储。后续 email/Telegram 推送只需读这个文件。

**范围：**
- `paper_digest/storage.py` — JSON 文件存储（订阅列表持久化）
  - `add_subscription(topic, channels)`，`remove_subscription(topic)`，`list_subscriptions()`
  - 存储位置：`~/.cache/paper-digest/subscriptions.json`
- `cli.py` _cmd_subscribe：实现 `subscribe --topic "RAG" --channel email` 和 `subscribe --list`
- 测试：3+ 新测试

### Task 3 (P1): 🟡 CLI 输出 + 文档修复

**为什么：** 小但影响体验：
1. CLI `--output` 和 README 中 `--export` 不一致（README 写错参数名）
2. 终端输出在摘要生成后展示小结（关键词/贡献类型/新颖度），提升 product feel

**范围：**
- README 修复 `--export` → `--output`
- 终端输出在 digest 列表每行尾部加一个摘要摘要行（关键词 top 3 + 贡献类型）

---

## 4️⃣ 资源分配

| 任务 | 负责人 | 优先级 | 预计提交 | 预计新增行 |
|:----|:------|:------:|:--------|:----------|
| summarizer 接入 + read 命令 | dev-1/dev-2 | 🔴 P0 | 2-3 commits | ~150 (3×50) |
| subscribe JSON 存储 | dev-1 | 🔴 P0 | 2-3 commits | ~120 (3×40) |
| CLI 输出 + 文档修复 | dev-2 | 🟡 P1 | 1 commit | ~50 |

## 5️⃣ 风险监控

| 风险 | 概率 | 影响 | 缓解 |
|:----|:----:|:----:|:-----|
| arXiv API 按 ID 查询格式不兼容 | 🟡 中 | 🟡 中 | 先查文档，用 `id_list` 参数；测试 mock 覆盖 |
| subscribe JSON 文件并发冲突 | 🟢 低 | 🟢 低 | 单用户 CLI 场景，不用锁 |
| 对手突然跳过我们直接做功能 | 🟢 低 | 🟢 低 | 我们有 47 测试，对手 1 测试，根基差距大 |
| commit 超 80 行 (BLOAT) | 🟡 中 | 🟡 中 | summarizer 接入 + fetch_by_id 拆 2 commit；storage 拆 2 commit |

---

## 6️⃣ 预期交付

| 交付物 | 状态 | 说明 |
|:------|:----:|:-----|
| `digest` 管道完整（含摘要输出） | 📋 已规划 | summarizer 在 digest 中被调用，formatter 展示摘要信息 |
| `read <arxiv_id>` 完整实现 | 📋 已规划 | 按 ID 查 + 完整摘要面板 |
| `subscribe` 命令（JSON 存储） | 📋 已规划 | add / remove / list 三子命令 |
| `storage.py` 模块 | 📋 已规划 | 通用 JSON DB，后续可扩展为推送队列 |
| 测试 ≥ 55 个（+8） | 📋 已规划 | 全部绿色 |
| README 修复 + 文档同步 | 📋 已规划 | 参数名一致、命令用法表更新 |

---

## 7️⃣ 复盘 & 下轮预告

### 本轮核心信念
> **"深度碾压"不在于功能多少，而在于功能链路的完整度。6 个模块，5 个串起来的管道，比 10 个孤岛模块值 2 倍。**

### Cycle 3 预告
1. **Email 推送** — smtplib 发送每日摘要
2. **订阅定时任务** — cron 编排每日推送
3. **LLM 增强摘要（可选链路）** — 检测本地 Ollama 时自动升级

---

*Atlas, CEO @ A-Tech Inc. — Cycle 2*
*"闭环，闭环，闭环。串起来的功能才是功能。"*
