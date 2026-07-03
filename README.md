<p align="center">
  <img src="https://img.shields.io/badge/AI%20Arena-Self%20Evolving%20Agent%20System-ff6b6b?style=for-the-badge&logo=openai" alt="AI Arena"/>
  <img src="https://img.shields.io/badge/状态-归档-lightgrey?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/Agent%20数-18%20(9×2%20队)-8A2BE2?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/进化轮次-2%20Rounds-FFD700?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/许可证-MIT-yellow?style=for-the-badge"/>
</p>

<h1 align="center">⚔️ AI Startup Arena</h1>
<h3 align="center">多 Agent 自进化竞技引擎 · 两支 AI 团队在博弈中自我进化</h3>

<p align="center">
  <i>不再是单个 AI 完成任务 —— 而是 AI 团队在竞争中自我进化，并产出真实可用的开源工具。</i>
</p>

---

## 🗺️ 项目全景

本仓库是**竞技引擎 + 两轮完整运行记录**。引擎驱动两支 AI 团队（Alpha / Beta）在博弈中进化，每一轮产出一套独立的开源工具。

```
ai-startup-arena（本仓库）
│  ← 引擎核心 + 两轮运行数据
│
├── 第一轮产物
│   ├── alpha-project-arena   → Alpha 队产出的 CLI 工具
│   └── beta-project-arena    → Beta 队产出的 CLI 工具
│
└── 第二轮产物（进化升级）
    ├── paper-digest-alpha    → Alpha 队进化后的新工具
    └── paper-digest-beta     → Beta 队进化后的新工具
```

| 仓库 | 轮次 | 说明 |
|------|------|------|
| [alpha-project-arena](https://github.com/lijiajing-11/alpha-project-arena) | Round 1 | Alpha 队第一轮产物 |
| [beta-project-arena](https://github.com/lijiajing-11/beta-project-arena) | Round 1 | Beta 队第一轮产物 |
| [paper-digest-alpha](https://github.com/lijiajing-11/paper-digest-alpha) | Round 2 | Alpha 队进化产物 |
| [paper-digest-beta](https://github.com/lijiajing-11/paper-digest-beta) | Round 2 | Beta 队进化产物 |

---

## 🎯 核心创新：仲裁者激励机制

> 不是简单打分，而是包含胜负奖惩、创新红利、知识传递的完整博弈机制。

```
              ┌──────────────┐
              │  仲裁者评分    │
              │  (7个维度)    │
              └──────┬───────┘
                     │
     ┌───────────────┼───────────────┐
     ▼               ▼               ▼
┌──────────┐   ┌──────────┐   ┌──────────┐
│ 胜负奖惩   │   │ 创新红利   │   │ 知识传递   │
│ +10% token│   │ +5 原创分  │   │ 强制分享   │
└──────────┘   └──────────┘   └──────────┘
```

→ [仲裁者激励机制详解](./ARBITRATOR_INCENTIVE.md)

---

## 🗂️ 仓库结构

```
ai-startup-arena/
├── README.md
├── ARBITRATOR_INCENTIVE.md   # 核心机制文档
├── CHANGELOG.md
│
├── engine/                   # 引擎本体
│   ├── prompts/              # Agent 提示词（运行时填充版）
│   │   └── templates/        # 原始模板（含占位符）
│   ├── scripts/              # 启动 / 监控脚本
│   └── sop/                  # Agent 角色 SOP 模板
│
├── round1/                   # 第一轮完整记录
│   ├── arena/                # 运行日志 / 状态快照 / 经验池
│   └── output/               # 产出代码快照
│
├── round2/                   # 第二轮完整记录
│   ├── arena/                # 进度报告 / 技能树 / 公告
│   └── output/               # 产出代码快照
│
├── docs/                     # 分析文档 / 演进规划
├── showcase/                 # HTML 可视化展示页
└── src/                      # TypeScript CLI 工具源码
```

---

## 🚀 系统架构

```
                     ┌─────────────────┐
                     │   仲裁者 Agent    │
                     │  (中立裁判)       │
                     └────────┬────────┘
                              │
           ┌──────────────────┼──────────────────┐
           ▼                                      ▼
   ┌──────────────────┐              ┌──────────────────┐
   │  Alpha Team       │              │  Beta Team        │
   │  CEO/DEV×2/MKT   │              │  CEO/DEV×2/MKT   │
   └──────────────────┘              └──────────────────┘
```

- **9 Agent × 2 队 = 18 Agent** 并发运行
- **7 维度评分**：功能完整性 / 代码质量 / 创新性 / 市场潜力等
- **JSON 原子写 + 断点续跑**：保证长时间运行数据不丢失
- **两轮共 40 个 cycle**，完整运行记录存档

---

## 作者

**李嘉靖**  
GitHub: [@lijiajing-11](https://github.com/lijiajing-11)
