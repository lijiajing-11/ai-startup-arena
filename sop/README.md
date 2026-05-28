# 🏗️ SOP 系统 - 索引

> 融合 MetaGPT 角色驱动 + GenericAgent 技能树 + OpenSpace 经验池

---

## 📂 文件结构

```
sop/
├── README.md              ← 本文件 (索引)
├── templates/
│   ├── CEO_SOP.md         🧠 CEO 标准操作流程
│   ├── ARCHITECT_SOP.md   🏗️ 架构师标准操作流程
│   ├── REVIEWER_SOP.md    🔍 代码审查师标准操作流程
│   └── (更多角色陆续添加)
├── SKILL_TREE.md          🌳 Agent 技能树追踪机制
└── EXPERIENCE_POOL.md     🤝 跨队经验共享池
```

---

## 🔗 与竞品融合对照

| 融合源 | 实现文件 | 核心改进 |
|-------|---------|---------|
| MetaGPT | `templates/*.md` | 每个角色有标准化 SOP，不再凭感觉干活 |
| GenericAgent | `SKILL_TREE.md` | Agent 技能可追踪、跨轮次传承 |
| OpenSpace | `EXPERIENCE_POOL.md` | Agent 间的经验可共享、可复用 |

---

## 🚀 如何使用

### 给下一轮 Arena 使用
1. 每个 Agent 的 Prompt 中引用对应 SOP 模板
2. 仲裁者根据技能树评分
3. Cycle 结束时更新经验池

### 给展示使用
> "我们不仅从 MetaGPT 学到了 SOP 驱动，还融合了 GenericAgent 的技能树和 OpenSpace 的经验池——  
> 这不是抄，这是站在巨人的肩膀上做创新。"
