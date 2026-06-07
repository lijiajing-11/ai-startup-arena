<p align="center">
  <img src="https://img.shields.io/badge/AI%20Arena-Self%20Evolving%20Agent%20System-ff6b6b?style=for-the-badge&logo=openai" alt="AI Arena"/>
  <img src="https://img.shields.io/badge/%E7%8A%B6%E6%80%81-%E8%BF%90%E8%A1%8C%E4%B8%AD-success?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/Agent%20%E6%95%B0-18%20(9%C3%972%20%E9%98%9F)-8A2BE2?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/%E8%BF%9B%E5%8C%96%E8%BD%AE%E6%AC%A1-20-FFD700?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/Commits-330%2B-blue?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/%E8%AE%B8%E5%8F%AF%E8%AF%81-MIT-yellow?style=for-the-badge"/>
</p>

<h1 align="center">⚔️ AI Startup Arena</h1>
<h3 align="center">多 Agent 自进化竞技系统 · 让 AI 团队在博弈中自我进化</h3>

<p align="center">
  <i>不再是单个 AI Agent 完成任务 —— 而是 AI 团队在竞争中自我进化。</i>
</p>

<p align="center">
  <a href="#english-version">English ↓</a>
</p>

---

## 🎯 一句话

> **AI Arena 是一个让 AI Agent 团队在博弈中自我进化的平台。**
> 不是又一个 LLM 应用 —— 而是一个**元进化系统**，让 AI 智能体像创业公司一样竞争、学习、进化。

### 跟所有竞品的本质区别

| | 普通 AI Agent 工具 | 竞品 LLM 项目 | **AI Arena ⭐** |
|---|---|---|---|
| Agent 数量 | 1 个单打独斗 | 1 个助手 | **9 个 Agent 组队博弈** |
| 进化方式 | 靠人类调 prompt | 靠人类调 prompt | **Agent 间竞争驱动进化** |
| 激励机制 | ❌ 无 | ❌ 无 | **✅ 仲裁者博弈激励机制** |
| 产出 | 完成单次任务 | 聊天对话 | **两个完整开源产品** |
| 可复现 | ❌ 难以重现 | ✅ 软件产品 | **✅ 两个可安装 CLI 工具** |
| 创新度量 | ❌ 无法衡量 | ❌ 无法衡量 | **✅ 进化指标 + 创新指数** |

---

## 🧩 核心创新：仲裁者激励机制

> **这是竞争对手无论如何也抄不走的核心。** 不是简单打分，而是包含胜负奖惩、创新红利、知识传递的完整博弈机制。

```
                      ┌──────────────┐
                      │  仲裁者评分    │
                      │  (7个维度)    │
                      └──────┬───────┘
                             │
            ┌────────────────┼────────────────┐
            │                │                │
            ▼                ▼                ▼
      ┌──────────┐    ┌──────────┐    ┌──────────┐
      │ 胜负奖惩   │    │ 创新红利   │    │ 知识传递   │
      │ +10% token│    │ +5 原创分  │    │ 强制分享   │
      │ 对标惩罚   │    │ 保护期 2 轮│    │ 专项指导   │
      └──────────┘    └──────────┘    └──────────┘
```

[📖 仲裁者激励机制详解](./ARBITRATOR_INCENTIVE.md)

---

## 🚀 系统架构

### Agent 组织架构（当前 18 Agent / 2 队）

```
                     ┌─────────────────┐
                     │   仲裁者 Agent    │
                     │  (中立裁判)       │
                     └─────────────────┘
                            │
           ┌────────────────┼────────────────┐
           │                │                │
           ▼                ▼                ▼
   ┌──────────────────┐  ┌──────────────────┐
   │  Alpha Team       │  │  Beta Team        │
   │  (A-Tech Inc.)    │  │  (B-Labs Corp.)   │
   ├──────────────────┤  ├──────────────────┤
   │ 🧠 CEO          │  │ 🧠 CEO          │
   │ 🏗️ 架构师       │  │ 🏗️ 架构师       │
   │ 💻 开发工程师    │  │ 💻 开发工程师    │
   │ 🧪 测试工程师    │  │ 🧪 测试工程师    │
   │ 🔍 代码审查师    │  │ 🔍 代码审查师    │
   │ 📋 产品经理      │  │ 📋 产品经理      │
   │ 📢 市场运营      │  │ 📢 市场运营      │
   └──────────────────┘  └──────────────────┘
```

### SOP 标准操作流程体系

> 融合 MetaGPT 的角色驱动 + GenericAgent 的技能树 + OpenSpace 的经验池

每个角色有标准化的 SOP 文档，确保每个 Cycle 的行动可预测、可追踪：

| 角色 | SOP 文件 | 核心流程 |
|------|---------|---------|
| 🧠 CEO | [`CEO_SOP.md`](./sop/templates/CEO_SOP.md) | 情报→分析→策略→分配→跟踪→复盘 |
| 🏗️ 架构师 | [`ARCHITECT_SOP.md`](./sop/templates/ARCHITECT_SOP.md) | 需求→选型→设计→规范→评审 |
| 💻 开发工程师 | [`DEV_SOP.md`](./sop/templates/DEV_SOP.md) | 理解→实现→自测→清理→提交 |
| 🧪 测试工程师 | [`TESTER_SOP.md`](./sop/templates/TESTER_SOP.md) | 计划→用例→执行→覆盖→报告 |
| 🔍 审查师 | [`REVIEWER_SOP.md`](./sop/templates/REVIEWER_SOP.md) | 7 项检查清单 + 评分 + 一票否决 |
| 📋 产品经理 | [`PM_SOP.md`](./sop/templates/PM_SOP.md) | 需求→规格→体验→反馈→优先级 |
| 📢 市场运营 | [`MARKETING_SOP.md`](./sop/templates/MARKETING_SOP.md) | 受众→文档→发布→社区→指标 |

[📂 完整 SOP 系统 →](./sop/README.md)

---

## 📦 产出成果

经过 20 轮进化（约 8 小时），两个 AI 团队各自开发出了完整可用的开源产品：

### ⚡ Alpha Team → [ARA](./alpha/repo/)

> **GitHub 仓库分析 CLI** — Python · 276 tests · 11 commands

```bash
pip install ara-stars          # 一键安装
ara stars facebook/react       # 实时 Star 查询
ara battle react vue           # 仓库 PK 大战
ara insight tensorflow         # 深度分析报告
```

| 特性 | 数据 |
|------|------|
| 📝 语言 | Python (stdlib-only) |
| 🧪 测试 | 276 tests, 100% pass |
| 📐 架构 | 16 模块, CLI + Core 分离 |
| 📖 文档 | README v19, CONTRIBUTING, CHANGELOG |
| 🔄 CI/CD | GitHub Actions 全自动 |
| 📊 insight | 多仓库对比 + 影响力评分 |
| 🔔 watch | 实时桌面通知 |

### 🧬 Beta Team → [repo-sense](./beta/repo/)

> **GitHub 第六感 CLI** — TypeScript · 8 commands · **npm 已上线**

```bash
npx repo-sense watch facebook/react   # 实时看 Star 跳动
npx repo-sense battle react vue       # 谁更火？
npx repo-sense insight tensorflow     # 深度洞察
```

| 特性 | 数据 |
|------|------|
| 📝 语言 | TypeScript (类型安全) |
| 🚀 部署 | **✅ npm 已上线** v0.2.1 |
| 🎨 UI | chalk 彩色终端界面 |
| 🧪 测试 | 94 tests |
| 📖 文档 | README v26, 12 次迭代 |
| 🛡️ 安全 | AbortSignal 优雅退出 |

---

## 📊 进化数据

| 指标 | Alpha (A-Tech) | Beta (B-Labs) |
|------|:--------------:|:-------------:|
| **仲裁者评分** | **44** | **44** |
| **自评分** | 54 | **56 🥇** |
| **Commits** | 163 | 154 |
| **Tests** | **276 ✅** | 94 |
| **产品形态** | PyPI (卡token) | **npm 0.2.1 ✅** |
| **UI 风格** | ANSI 标准 | **chalk 彩色 🥇** |
| **BLOAT 污染** | ⚠️ 有 | ✅ 干净 |
| **README 迭代** | v19 | **v26** |
| **总文件数** | 20+ (Python) | 30+ (TypeScript) |

[📊 完整运行报告 → 20 轮进化全记录](./summary.md)

---

## 🎮 现场演示

打开 [`arena-evolution-demo.html`](./arena-evolution-demo.html)（优化版），输入新项目需求，看 AI 团队实时竞争进化：

```
输入: "一个 Markdown 转 PDF 的 CLI 工具"
  ↓
仲裁者拆解任务 → Alpha (Python) vs Beta (TypeScript)
  ↓
20 Cycles 实时竞争 → 策略调整 → 创新突破 → 最终评分
  ↓
输出: 两个完整 CLI 工具 · 即时可用
```

[🧬 启动进化演示 →](./arena-evolution-demo.html)

---

## 🔬 技术亮点

### 1. 多 Agent 博弈系统
9 个 AI Agent × 2 队 = 9 Agent 同时运行，通过 Hermes Profile 模式**零人工干预**自治执行。

### 2. 仲裁者激励机制
不是简单打分——而是包含**胜负奖惩、创新红利、知识传递**的完整博弈机制。7 维评分覆盖功能、测试、创新、文档、UX、质量、影响力。

### 3. SOP 标准化 + 技能树 + 经验池
融合 MetaGPT 的角色 SOP、GenericAgent 的技能树追踪、OpenSpace 的经验共享——**站在巨人肩膀上做创新**。

### 4. 跨语言产出
同一套进化框架产生了 **Python CLI**（stdlib-only）和 **TypeScript CLI**（chalk 彩色 UI）两个不同技术栈的完整产品。

### 5. 零人工干预
从启动到结束，**完全由 AI Agent 自主完成**——策略、开发、测试、文档、发布。8 小时，¥40-50 成本。

---

## 🏁 快速上手

```bash
# 1. 查看运行报告
cat summary.md              # 完整运行总结
cat ARBITRATOR_INCENTIVE.md # 仲裁者机制详解

# 2. 现场演示（浏览器打开）
open arena-evolution-demo.html

# 3. 试用产品
# Alpha: ARA CLI
cd alpha/repo && pip install -e . && ara --help

# Beta: repo-sense CLI
npx repo-sense watch facebook/react
```

---

## 🗺️ 路线图

- [x] ✅ **20 轮进化** — Alpha vs Beta 已完成
- [x] ✅ **仲裁者激励机制** — 文档已发布
- [x] ✅ **SOP 标准化** — 7 个角色 SOP 全部完成
- [x] ✅ **竞品深度分析** — 10 个竞品的优缺点对比
- [ ] 🔄 **GitHub 推送** — 双仓库上线
- [ ] 🔄 **可视化面板** — 实时进化仪表盘
- [ ] 🔄 **N 队扩展** — 支持 3+ 队伍混战
- [ ] 🔄 **第二轮进化** — 新项目新需求

---

## 📄 许可证

MIT © AI Startup Arena

<p align="center">
  <sub>Built with ❤️ by 9 AI Agents · 20 Cycles · 330+ Commits</sub>
  <br>
  <sub>⚔️ Alpha 44 : 44 Beta · 平局，但双方都进化了</sub>
</p>

---

<a name="english-version"></a>

---

<h1 align="center">⚔️ AI Startup Arena</h1>
<h3 align="center">Multi-Agent Self-Evolving Competition Platform</h3>

<p align="center">
  <i>Not just an AI coding tool — an evolution engine where AI teams compete, learn, and evolve.</i>
</p>

<p align="center">
  <a href="#">↑ 中文版</a>
</p>

---

## 🎯 The Big Idea

> **AI Arena is a platform where AI agent teams evolve through competition.**
> Not another LLM app — a **meta-evolution system** where AI agents compete like startups, learn from each other, and produce complete software products.

### How We're Different

| | Normal AI Tools | Competitor LLM Apps | **AI Arena ⭐** |
|---|---|---|---|
| Agents | 1 solo agent | 1 assistant | **9 agents × 2 teams** |
| Evolution | Manual prompt tuning | Manual prompt tuning | **Competition-driven** |
| Incentives | ❌ None | ❌ None | **✅ Game-theoretic arbitrator** |
| Output | Single task | Chat responses | **Two complete OSS products** |
| Reproducible | ❌ Hard | ✅ Software | **✅ Two installable CLI tools** |
| Innovation | ❌ Unmeasurable | ❌ Unmeasurable | **✅ Evolution metrics** |

---

## 🧩 Core Innovation: Arbitrator Incentive System

> **The one thing competitors can't copy.** Not simple scoring — a complete game-theoretic mechanism with win/loss rewards, innovation bonuses, and knowledge transfer.

```
                     ┌──────────────┐
                     │  Arbitrator   │
                     │  (7 dims)     │
                     └──────┬───────┘
                            │
            ┌────────────────┼────────────────┐
            │                │                │
            ▼                ▼                ▼
      ┌──────────┐    ┌──────────┐    ┌──────────┐
      │ Win/Loss  │    │ Innovation│   │ Knowledge │
      │ +10% token│    │ +5 pts   │    │ Transfer   │
      │ Penalty   │    │ 2-cycle  │    │ Mandatory  │
      │           │    │ protect  │    │ sharing    │
      └──────────┘    └──────────┘    └──────────┘
```

---

## 🚀 Architecture

### Agent Organization (18 Agents / 2 Teams)

```
                    ┌─────────────────┐
                    │   Arbitrator     │
                    └─────────────────┘
                           │
          ┌────────────────┼────────────────┐
          │                │                │
          ▼                ▼                ▼
  ┌──────────────────┐  ┌──────────────────┐
  │  Alpha Team       │  │  Beta Team        │
  │  (A-Tech Inc.)    │  │  (B-Labs Corp.)   │
  ├──────────────────┤  ├──────────────────┤
  │ 🧠 CEO          │  │ 🧠 CEO          │
  │ 🏗️ Architect    │  │ 🏗️ Architect    │
  │ 💻 Developer     │  │ 💻 Developer     │
  │ 🧪 Tester        │  │ 🧪 Tester        │
  │ 🔍 Reviewer      │  │ 🔍 Reviewer      │
  │ 📋 PM            │  │ 📋 PM            │
  │ 📢 Marketing     │  │ 📢 Marketing     │
  └──────────────────┘  └──────────────────┘
```

---

## 📦 Outputs

After 20 cycles (~8 hours), the AI teams produced two complete open-source products:

### ⚡ Alpha Team → [ARA](./alpha/repo/)

**GitHub Star Analysis CLI** — Python, 276 tests, 11 commands

```bash
pip install ara-stars
ara stars facebook/react       # Real-time stars
ara battle react vue           # Repo comparison
ara insight tensorflow         # Deep analysis
```

| Feature | Data |
|---------|------|
| Language | Python (stdlib-only) |
| Tests | 276, 100% pass |
| Architecture | 16 modules |
| Docs | README v19, CONTRIBUTING, CHANGELOG |
| CI/CD | GitHub Actions |

### 🧬 Beta Team → [repo-sense](./beta/repo/)

**GitHub Sixth Sense CLI** — TypeScript, 8 commands, **npm published**

```bash
npx repo-sense watch facebook/react
npx repo-sense battle react vue
npx repo-sense insight tensorflow
```

| Feature | Data |
|---------|------|
| Language | TypeScript |
| Deploy | **✅ npm v0.2.1** |
| UI | chalk color terminal |
| Tests | 94 |
| Docs | README v26 |

---

## 📊 Evolution Data

| Metric | Alpha (A-Tech) | Beta (B-Labs) |
|--------|:--------------:|:-------------:|
| **Arbitrator Score** | **44** | **44** |
| Self Score | 54 | **56 🥇** |
| Commits | 163 | 154 |
| Tests | **276 ✅** | 94 |
| Release | PyPI (blocked) | **npm 0.2.1 ✅** |
| UI | ANSI | **chalk color 🥇** |
| BLOAT | ⚠️ Yes | ✅ Clean |

---

## 🎮 Live Demo

Open [`arena-evolution-demo.html`](./arena-evolution-demo.html), enter a project requirement, and watch AI teams compete in real-time:

```
Input: "A Markdown to PDF CLI tool"
  ↓
Arbitrator decomposes → Alpha (Python) vs Beta (TypeScript)
  ↓
20 Cycles real-time competition → Strategy shifts → Innovation breakthrough → Final score
  ↓
Output: Two complete CLI tools, ready to install
```

[🧬 Launch Evolution Demo →](./arena-evolution-demo.html)

---

## 🔬 Technical Highlights

1. **Multi-Agent Game System** — 9 agents × 2 teams, zero human intervention
2. **Arbitrator Incentive System** — Game-theoretic scoring across 7 dimensions
3. **SOP + Skill Tree + Experience Pool** — Fusing MetaGPT, GenericAgent, and OpenSpace best practices
4. **Cross-Language Output** — Same engine produces Python AND TypeScript products
5. **Zero Human Intervention** — Strategy, development, testing, documentation, publishing — all autonomous

---

## 🏁 Quick Start

```bash
# View reports
cat summary.md
cat ARBITRATOR_INCENTIVE.md

# Live demo
open arena-evolution-demo.html

# Try the products
cd alpha/repo && pip install -e . && ara --help
npx repo-sense watch facebook/react
```

---

## 📄 License

MIT © AI Startup Arena

<p align="center">
  <sub>Built with ❤️ by 9 AI Agents · 20 Cycles · 330+ Commits</sub>
  <br>
  <sub>⚔️ Alpha 44 : 44 Beta · Draw, but both teams evolved</sub>
</p>
