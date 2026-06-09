# Decision 001: Cycle 1 — 闪电 MVP 启动，先发制人 🚀

**日期:** 2026-05-19 15:48
**决策者:** Blake (CEO, β-Labs Corp.)
**周期:** Cycle 1 (起跑轮)
**比分:** 0-0 (尚未开赛)

---

## 1️⃣ 情报收集 (Scouting)

### 对手状态
| 维度 | Alpha (A-Tech) | Beta (我们) |
|:----|:------------:|:----------:|
| 语言 | Python 3.10+ | TypeScript 5.x |
| Scaffold | init commit (cli.py + __init__.py + pyproject.toml) | init commit (cli.ts + index.ts + package.json) |
| 依赖 | requests, rich, pytest | typescript (only) |
| 当前进度 | 0 — 只有 hello world | 0 — 只有 hello world |
| 发布时间 | 未开始 | 未开始 |

### 关键情报
- **双方完全平齐** — 都是单个 init commit，CLI 只打印"work in progress"
- Alpha 的 Python 栈 (requests + rich) 天然有依赖优势 — pip install 就带齐
- 我们用 TypeScript，目前只有 TypeScript devDep，需要自己装 chalk、node-fetch 等

### 经验池参考
| EXP-ID | 内容 | 适用性 |
|:------|:-----|:-------|
| EXP-002 | npm 发布需提前配 token | Cycle 1 就要配好，等 cycle≥15 太晚 |
| EXP-005 | 测试绿才提交 | 每个 commit 前 vitest 全绿 |
| EXP-006 | 外部 API 加 retry+缓存 | arXiv Atom API 必须指数退避 retry |

---

## 2️⃣ 差距分析 (Gap Analysis)

两家站在同一起跑线。我们的机会：

| 维度 | 差距 | 优先级 |
|:----|:-----|:------:|
| **MVP 功能** | 功能数 0，对手也是 0 | 🟢 持平 |
| **npm 市场** | 未发布，对手也未发布 | 🟢 可以抢先 |
| **UI 体验** | 未开始，计划用 chalk 卡片 | 🟢 从零 build |
| **测试** | placeholder test only | 🔴 必须立刻建 |
| **arXiv 抓取** | 未实现 | 🔴 MVP 核心 |

**结论：** 这是最好的抢占窗口。双方功能为 0，谁先构建可用版本 + 发布 npm，谁就先拿下一轮压倒性优势。

---

## 3️⃣ 策略制定 (Strategy)

### 核心策略：「闪电 MVP 先发」⚡

70% 自己节奏：快速构建 MVP 核心管线（arXiv → 摘要 → 卡片UI → 导出）
30% 防御：不留测试空白，vitest 架构先搭好

| 策略 | 说明 | 投入 |
|:----|:------|:----:|
| 🚀 **进攻** | 构建 arXiv fetch → 规则摘要 → chalk 卡片 CLI 管线 | 60% 精力 |
| 🛡️ **防守** | vitest 配置 + 测试骨架 + 60% 覆盖目标 | 20% |
| 🔧 **基建** | npm 包配置 (bin, build, files) + 发布就绪 | 10% |
| 📝 **市场** | README + 体验描述先行 | 10% |

### 为什么不追 Alpha 的功能
Cycle 1 双方都是 0。不要被拖入"他们做 X 我们也做 X"的节奏——我们自己画赛道：彩色卡片 UI、先发 npm、订阅 UX。等他们做出 rich table 时，我们已经 npm 上线 + chalk 卡片碾压了。

---

## 4️⃣ 任务分配 (Task Delegation)

| 成员 | 任务 | 优先级 | 预估 |
|:----:|:----:|:------:|:----:|
| **dev-1** 🔥 | 核心抓取 + 摘要管线 + CLI | **P0** | 60m |
| **dev-2** 🧪 | 测试基建 + 架构 + vitest 就绪 | **P1** | 30m |
| **mkt** 📝 | README 撰写 + npm 准备 | P2 | 15m |

### Task 001 (P0): dev-1 — arXiv 抓取 + 规则摘要 + chalk CLI
**目标**：可运行的 `paper-digest digest --topic LLM --top 5`
- arXiv Atom API fetch 模块 (retry + 缓存)
- 规则摘要生成器 (从 abstract 提炼标题、作者、摘要 snippet、日期、分类)
- chalk 卡片渲染
- Markdown 导出

### Task 002 (P1): dev-2 — 测试基建
**目标**：vitest 可跑、测试骨架覆盖核心模块
- vitest 安装配置
- cache.test.ts (测试缓存逻辑)
- fetch.test.ts (mock arXiv API)
- summarizer.test.ts (测试规则摘要)
- 确保 `npm test` 全绿

### Task 003 (P2): mkt — 文档 + npm 准备
**目标**：README + npm 发布就绪
- 撰写彩色 README（示例输出截图）
- package.json 完善（bin, files, engines, keywords）
- 验证 `npm pack` 成功

---

## 5️⃣ 风险监控

| 风险 | 影响 | 概率 | 应对 |
|:----|:----:|:----:|:-----|
| arXiv API 限流 | 测试/开发卡住 | 🟡 中 | 指数退避 retry + 本地缓存 (EXP-006) |
| chalk 颜色在 CI 乱码 | 测试对比失败 | 🟡 中 | chalk level check + --no-color flag |
| npm 包名被占 | 发布延迟 | 🟢 低 | 准备 scoped 名 @blabs/paper-digest |
| Alpha 快速出 MVP | 先发优势缩窄 | 🟡 中 | 我们更快——TypeScript + tsc build 比 pip install 快 |

---

## 6️⃣ 一句话总结

> "Cycle 1，闪电起跑。两边都是零——谁先跑出可用的 `paper-digest digest` + chalk 卡片 + npm 发布，谁就拿到第一波压倒性优势。dev-1 做核心管线，dev-2 搭测试骨架防止仲裁扣分，mkt 让 README 一上来就展示彩色体验。我们不是跟 Alpha 比赛谁先写 hello world——我们直接跳到 MVP，用 npm 先发和卡片 UI 画自己的赛道。🚀"

---

*Blake, CEO @ β-Labs Corp.*
*"First to ship wins. Then make it better."*
