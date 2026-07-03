---
name: arena-demo-skill
description: "AI Arena 四要素演示 Skill — 教你如何创建一个完整的 Hermes Skill"
version: 1.0.0
author: AI Arena
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [demo, tutorial, skill-structure]
    category: devops
---

# 🧩 Hermes Skill 四要素 — 完整示例

## 要素概览

```
my-skill/
├── 📄 SKILL.md        ← ① 主定义文件（必须）
├── 🖥️  scripts/       ← ② 可执行脚本
│    └── check.sh
├── 📝 templates/      ← ③ 模板文件
│    └── report.md
└── 📚 references/     ← ④ 参考文档
     └── tips.md
```

---

## ① SKILL.md — 主文件

这是 Skill 的入口，包含：
- **YAML 头**: 名称、描述、版本、标签
- **Markdown 正文**: 用法说明、步骤、坑点

```yaml
---
name: my-skill
description: "一句话描述"
version: 1.0.0
author: 你
---
```

## ② scripts/ — 脚本

可执行的 bash/python 脚本，放在 `scripts/` 目录下。

```bash
#!/bin/bash
# scripts/check.sh
echo "Docker 状态检查:"
docker system df
```

Skill 的 SKILL.md 里可以用相对路径引用它。

## ③ templates/ — 模板

可复用的模板文件，比如报告模板、配置模板。

```markdown
<!-- templates/report.md -->
# 进化报告 - Cycle {{cycle}}
- Alpha 得分: {{alpha_score}}
- Beta 得分: {{beta_score}}
```

## ④ references/ — 参考资料

最佳实践、架构说明、细节点记录，可以有很多个文件。

## 安装路径

所有 Skill 放在这里：
```
~/.hermes/skills/<category>/<skill-name>/
```

例如：
```
~/.hermes/skills/devops/docker-management/SKILL.md
```
