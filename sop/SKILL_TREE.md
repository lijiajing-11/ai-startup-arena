# 🌳 Agent 技能树系统

> **来源:** GenericAgent 技能树自生长 + OpenSpace 经验共享
> **作用:** 追踪每个 Agent 的技能成长，跨轮次传承经验

---

## 📊 技能树结构

每个 Agent 维护一棵个人技能树，包含两类技能：

### 基础技能（种子技能）
```
每个 Agent 初始拥有的技能
├── 语言能力: Python / TypeScript / Go
├── 框架经验: FastAPI / Express / Next.js
├── 工具掌握: Git / Docker / CI
└── 领域知识: CLI 设计 / API 设计 / 测试策略
```

### 习得技能（进化中获得）
```
在 Cycle 执行过程中学习到的新技能
├── 从任务中获得:  知道怎么用某个库、某个 API
├── 从对手学到:    Beta 的 chalk UI → Alpha 学到彩色输出
├── 从错误学到:    踩过的坑形成经验
└── 从共享学到:    经验池中获取的最佳实践
```

---

## 📈 技能追踪表

### 格式
```json
{
  "agent": "alpha-dev-1",
  "team": "alpha",
  "cycle": 12,
  "skills": {
    "mastered": [
      {"name": "Python CLI 开发", "level": 85, "acquired_at": 3},
      {"name": "GitHub API", "level": 90, "acquired_at": 1},
      {"name": "pytest 测试", "level": 92, "acquired_at": 5}
    ],
    "learning": [
      {"name": "NPM 包发布", "progress": 60, "started_at": 10},
      {"name": "chalk 彩色终端", "progress": 40, "started_at": 11}
    ],
    "interested": [
      "Docker 打包",
      "GitHub Actions"
    ]
  }
}
```

### 仲裁者如何使用技能树
```
技能成长分 = Σ((新习得技能数 × 5) + (技能等级提升总和 / 10))
→ 加入仲裁者评分维度: "技能成长度" (权重 10%)
```

---

## 🔄 跨 Cycle 技能传承

传统模式（目前 Arena 的做法）：
```
Cycle 1: Agent A 学会了 X
Cycle 2: Agent A 忘了 X (新 session 无记忆) ❌
```

技能树模式（建议改进）：
```
Cycle 1: Agent A 学会了 X → 技能树记录
Cycle 2: Agent A 加载技能树 → 知道 X → 可以做得更好 ✅
         Agent B 从经验池看到 X → 也可以学 ✅
```

### 实现方式
1. 每个 Agent 的 Prompt 末尾附带当前技能树
2. 仲裁者在 Cycle 结束后更新技能树
3. 经验池作为共享技能库
4. 新 Agent 启动时加载相关技能

---

## 🏆 技能树评分维度

仲裁者新增评分维度：

| 维度 | 权重 | 评分方式 |
|------|------|---------|
| 🧪 测试覆盖 | 20% | (原有) |
| 🌳 技能成长 | **10%** (新增) | 本 cycle 技能点数增长 |
| 🤝 经验贡献 | **5%** (新增) | 向经验池贡献了多少可复用知识 |
| 📖 文档质量 | 15% | (原有) |

---

## 📁 文件存放

```
arena/skill_trees/
├── alpha/
│   ├── ceo.json
│   ├── dev-1.json
│   └── ...
├── beta/
│   └── ...
└── experience_pool.json   # 共享经验池
```
