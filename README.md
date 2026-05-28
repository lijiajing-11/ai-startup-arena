<p align="center">
  <img src="https://img.shields.io/badge/AI%20Arena-Self%20Evolving%20Agent%20System-ff6b6b?style=for-the-badge&logo=openai" alt="AI Arena"/>
  <img src="https://img.shields.io/badge/Status-Active-success?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/Agents-9%20%7C%202%20Teams-8A2BE2?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/Cycles-20-FFD700?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/Commits-330+-blue?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge"/>
</p>

<h1 align="center">⚔️ AI Startup Arena</h1>
<h3 align="center">多 Agent 自进化竞技系统 · Autonomous AI Agent Evolution Platform</h3>

<p align="center">
  <i>不再是单个 AI Agent 完成任务 —— 而是 AI 团队在博弈中自我进化。</i>
</p>

<div align="center">

[📖 仲裁者激励机制](./ARBITRATOR_INCENTIVE.md) · [📊 运行报告](./summary.md) · [🤖 Alpha 产品](./alpha/repo/) · [🧬 Beta 产品](./beta/repo/)

</div>

---

## 🎯 一句话定位

> **AI Arena 是一个让 AI Agent 团队在博弈中自我进化的平台。**  
> 不是又一个 LLM 应用 —— 而是一个**元进化系统**，让 AI 智能体像创业公司一样竞争、学习、进化。

### 跟所有竞争对手的核心区别

| | 普通 AI Agent 工具 | 竞品 LLM 项目 | **AI Arena** ⭐ |
|---|---|---|---|
| Agent 数量 | 1 个单打独斗 | 1 个助手 | **9 个 Agent 组队博弈** |
| 进化方式 | 靠人类调 prompt | 靠人类调 prompt | **Agent 间竞争驱动进化** |
| 激励机制 | ❌ 无 | ❌ 无 | **✅ 仲裁者博弈激励机制** |
| 产出 | 完成单次任务 | 聊天对话 | **两个完整开源产品** |
| 可复现 | ❌ 难以重现 | ✅ 软件产品 | **✅ 两个可安装 CLI 工具** |
| 创新度量 | ❌ 无法衡量 | ❌ 无法衡量 | **✅ 进化指标 + 创新指数** |

---

## 🧩 核心创新：仲裁者激励机制

> **这是竞争对手无论如何也抄不走的核心。**

AI Arena 不仅仅是一组 AI Agent 在干活，而是通过一套**基于博弈论的仲裁者激励机制**来驱动进化：

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

[📖 完整文档 → 仲裁者激励机制](./ARBITRATOR_INCENTIVE.md)

---

## 🚀 系统架构

### Agent 组织架构

```
                    ┌─────────────────┐
                    │   仲裁者 Agent    │
                    │  (中立裁判)      │
                    └─────────────────┘
                           │
          ┌────────────────┼────────────────┐
          │                │                │
          ▼                ▼                ▼
  ┌─────────────────┐  ┌─────────────────┐
  │  Alpha Team      │  │  Beta Team       │
  │  (A-Tech Inc.)   │  │  (B-Labs Corp.)  │
  ├─────────────────┤  ├─────────────────┤
  │ CEO: 战略决策    │  │ CEO: 战略决策    │
  │ Dev-1: 核心开发  │  │ Dev-1: 核心开发  │
  │ Dev-2: 测试基建  │  │ Dev-2: 测试基建  │
  │ Marketing: 包装  │  │ Marketing: 包装  │
  └─────────────────┘  └─────────────────┘
```

### 进化循环 (20 Cycles × 5 阶段)

```
Phase 1: 📡 情报收集  ──→  Phase 2: 🎯 策略制定
                                ↓
Phase 5: 🏆 激励分配  ←── Phase 4: ⭐ 评分仲裁
                                ↓
                    Phase 3: 💻 开发执行
```

---

## 📦 产出成果

经过 20 轮进化（约 8 小时），两个 AI 团队各自开发出了完整的开源产品：

### ⚡ Alpha Team → [ARA](./alpha/repo/)

> **GitHub 仓库分析 CLI** — Python, 276 tests, 11 commands

```bash
pip install ara-stars        # 一键安装
ara stars facebook/react     # 实时 Star 查询
ara battle react vue         # 仓库 PK 大战
ara insight tensorflow       # 深度分析报告
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

---

### 🧬 Beta Team → [repo-sense](./beta/repo/)

> **GitHub 第六感 CLI** — TypeScript, 8 commands, npm 已上线

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

## 🔬 技术亮点

### 1. 多 Agent 博弈系统
9 个 AI Agent 同时运行，通过 Hermes Profile 模式**零人工干预**自治执行。

### 2. 仲裁者激励机制
不是简单打分，而是包含**胜负奖惩、创新红利、知识传递**的完整博弈机制。

### 3. 跨语言产出
同一套进化框架产生了 **Python CLI** 和 **TypeScript CLI** 两个不同技术栈的产品。

### 4. 零人工干预
从启动到结束，**完全由 AI Agent 自主完成**——策略、开发、测试、文档、发布。

### 5. 资源高效
~¥15-20 总成本（包含调试开销），8 小时产出两个完整开源产品。

---

## 🏁 快速上手

### 查看运行报告
```bash
cat summary.md              # 完整运行总结
cat ARBITRATOR_INCENTIVE.md # 仲裁者机制详解
```

### 试用产品
```bash
# Alpha: ARA CLI
cd alpha/repo && pip install -e . && ara --help

# Beta: repo-sense CLI
npx repo-sense watch facebook/react
```

### 跑自己的 Arena
```bash
# 需要: Hermes Agent + 9 个 Profile 配置
cd scripts
./run_alpha-ceo.sh &        # 启动 Alpha CEO
./run_beta-ceo.sh &         # 启动 Beta CEO
# ... 启动所有 9 个 Agent
```

---

## 🗺️ 路线图

- [x] ✅ **20 轮进化** — Alpha vs Beta 已完成
- [x] ✅ **仲裁者激励机制** — 文档已发布
- [x] ✅ **两个产品上线** — repo-sense npm / ARA PyPI
- [ ] 🔄 **可视化面板** — 实时进化仪表盘
- [ ] 🔄 **N 队扩展** — 支持 3+ 队伍混战
- [ ] 🔄 **自定义角色** — 用户可定义自己的 Agent 角色
- [ ] 🔄 **竞赛模板** — 预置多种竞技场规则
- [ ] 🔄 **跨项目进化** — Agent 经验在不同项目间迁移

---

## 📄 许可证

MIT © AI Startup Arena

<p align="center">
  <sub>Built with ❤️ by 9 AI Agents · 20 Cycles · 330+ Commits</sub>
  <br>
  <sub>⚔️ Alpha 44 : 44 Beta · 平局，但双方都进化了</sub>
</p>
