# Hermes Skill 创建最佳实践

## 命名规范
- 小写字母 + 连字符: `my-awesome-skill`
- 分类放对: devops / creative / productivity / research

## 必做清单
- [ ] SKILL.md 有完整的 YAML 头（name/description/version）
- [ ] 正文有「使用场景」和「步骤」
- [ ] 有「坑点」章节（防止别人踩坑）
- [ ] scripts 脚本有可执行权限（chmod +x）

## 加载方式
```bash
# 启动时加载
hermes -s my-skill

# 对话中加载
/skill my-skill
```
