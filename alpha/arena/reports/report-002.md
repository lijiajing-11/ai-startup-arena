# 📊 Cycle 2 启动报告 — Atlas (CEO, Alpha Team)

**日期:** 2026-06-09
**报告人:** Atlas (CEO, A-Tech Inc.)
**周期:** 2/10
**项目:** paper-digest

---

## 执行摘要

Cycle 1 建了 **6 个模块**（arxiv_client / sorter / summarizer / formatter / cli / tests），Cycle 2 把**核心链路串通**。

**核心策略：深度闭环** — 不追 Beta 的后视镜（他们还在 init scaffold），我们补自己管道的断链。

| 任务 | 优先级 | 目标 | 状态 |
|:----|:------:|:-----|:----:|
| Summarizer 接入 digest + read 命令 | 🔴 P0 | 核心链路闭环 | 📋 已规划 |
| subscribe JSON 存储 | 🔴 P0 | 三大命令地基完成 | 📋 已规划 |
| CLI 输出 + 文档一致性 | 🟡 P1 | 体验提升 | 📋 已规划 |

---

## 情报分析

### 我方状态（Cycle 1 交付后）

```
paper_digest/
├── paper_digest/
│   ├── __init__.py        # 包信息
│   ├── cli.py             # CLI 三命令骨架
│   ├── arxiv_client.py    # arXiv API + retry + 1h 缓存
│   ├── sorter.py          # 手写 TF-IDF 排序
│   ├── summarizer.py      # 规则摘要（6 维度）
│   └── formatter.py       # rich 终端 + Markdown 导出
├── tests/
│   ├── conftest.py
│   ├── test_arxiv_client.py  (7)
│   ├── test_sorter.py        (7)
│   ├── test_summarizer.py    (14)
│   ├── test_formatter.py     (11)
│   ├── test_cli.py           (5)
│   └── test_placeholder.py   (1)
├── pyproject.toml
└── README.md
```

**47 测试全绿 ✅ | 4 commits | 0 未提交**

### 已知缺陷（Cycle 2 要补的）

| 缺陷 | 严重程度 | 影响 |
|:----|:--------:|:----|
| summarizer 在 digest 中未被调用 | 🔴 高 | "已交付但无效果"的评分扣分点 |
| `_summary` 渲染分支是死代码 | 🟡 中 | formatter 检查但从未有数据 |
| `read` 命令是 placeholder | 🔴 高 | 三大命令缺一个 |
| `subscribe` 命令是 placeholder | 🔴 高 | 同上 |
| README 参数名不一致 | 🟢 低 | `--export` vs `--output` |

### 对手状态

- Beta repo: 1 commit (init scaffold)
- 技术栈: TypeScript / chalk / fetch
- 测试: 1 个 placeholder
- 差距: 与我们差距约 6 个模块 + 46 测试

### 差距分析（Cycle 2 目标状态）

| 维度 | 当前（我们） | 目标（Cycle 2 末） | 对手（当前） |
|:-----|:----------:|:----------------:|:-----------:|
| 抓取 | ✅ retry+缓存 | ✅ + fetch_by_id | ❌ |
| 排序 | ✅ TF-IDF | ✅ 维持 | ❌ |
| 摘要 | ⚠️ 模块存在但未接入 | ✅ 管道完整 | ❌ |
| digest CLI | ✅ 基本 | ✅ 含摘要输出 | ❌ |
| read CLI | ❌ placeholder | ✅ 完整详情 | ❌ |
| subscribe CLI | ❌ placeholder | ✅ JSON 存储管理 | ❌ |
| Markdown 导出 | ✅ 基本 | ✅ 维持 | ❌ |
| 测试 | 47 | ≥ 55 (+8) | ~1 |
| 文档 | ✅ README | ✅ 参数同步 | ❌ |

---

## 本轮决策

**Decision 002** — 核心链路闭环 + 订阅存储地基

详见 `alpha/arena/decisions/decision-002.md`

### 战略原则
- **70% 自己节奏**：修自己的漏洞，补管道的断链
- **30% 补短板**：subscribe 和 read 补齐三大命令
- **绝不追对手**：Beta 还在 1 commit，不值得分散注意力

---

## 资源分配

| 角色 | 任务 | 说明 |
|:----|:-----|:-----|
| dev-1 | Task 002-A: summarizer 接入 + read | 核心链路闭环 |
| dev-1 | Task 002-B: subscribe JSON 存储 | 订阅地基 |
| dev-2 | Task 002-C: CLI 输出修复 + 文档 | 体验品控 |
| dev-2 | Task 002-A/B 测试 | 每个 task 都有测试组件 |

---

## 风险监控

| 风险 | 概率 | 影响 | 缓解 |
|:----|:----:|:----:|:-----|
| arXiv API id_list 参数行为不符预期 | 🟡 中 | 🟡 中 | 本地 mock 测试 + 文档确认 |
| subscribe 文件 IO 在 WSL 路径兼容 | 🟢 低 | 🟢 低 | 标准 `Path.home()`，跨平台 |
| commit BL OAT（超 80 行） | 🟡 中 | 🟡 中 | fetch_by_id 拆分单独 commit；print_single_paper 单独 commit |
| Beta 突然跑完核心功能 | 🟢 低 | 🟡 中 | 我们还剩大差距，一个 Cycle 追不平 |

---

## Cycle 3 预告

下轮要干的事（差异化方向，非追对手）：

1. **Email 推送** 🔥 — smtplib，从 subscriptions.json 读取配置，发送每日 digest
2. **订阅定时任务** — cron 模板或内置 scheduler
3. **LLM 增强摘要（可选）** — 检测本地 Ollama，回退规则摘要

---

## 一句话总结

> *"闭环，闭环，闭环。串起来的功能才是功能。孤岛模块一文不值。"*

*Atlas @ A-Tech Inc. — Cycle 2*
