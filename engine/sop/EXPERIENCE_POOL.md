# 🤝 Agent 经验共享池

> **来源:** OpenSpace Agent 经验市场
> **作用:** 跨队伍、跨 Cycle 积累和复用最佳实践

---

## 💡 核心理念

> 一个 Agent 踩过的坑，所有 Agent 不必再踩。
> 一个 Agent 发现的好方法，所有 Agent 可以直接用。

---

## 📋 经验分类

| 类型 | 示例 | 来源 |
|------|------|------|
| 🛠️ **代码模板** | CLI 入口模板、测试夹具 | 开发 Agent |
| 🧪 **测试策略** | Mock 技巧、覆盖策略 | 测试 Agent |
| 📐 **架构模式** | 模块划分方案、接口设计 | 架构师 |
| ⚠️ **避坑指南** | 已知 Bug、踩坑记录 | 任何 Agent |
| 🎨 **UX 最佳实践** | 错误提示格式、色彩方案 | 产品/市场 |
| 📝 **文档模板** | README 结构、API 文档 | 市场 Agent |

---

## 📥 经验提交流程

```
发现有用经验
    │
    ├── 1️⃣ 记录: 使用标准模板
    │
    ├── 2️⃣ 提交: 写入 experience_pool.json
    │
    ├── 3️⃣ 仲裁审核: 仲裁者验证有效性
    │
    └── 4️⃣ 入库: 通过 → 标记为可用
                     不通过 → 带理由退回
```

### 提交模板
```json
{
  "id": "EXP-042",
  "type": "code_template",
  "title": "pytest 夹具复用模式",
  "description": "通过 conftest.py 共享 fixture，避免每个测试文件重复定义",
  "code_snippet": "# conftest.py\nimport pytest\n\n@pytest.fixture\ndef mock_github_api():\n    ...",
  "submitted_by": "alpha-dev-1",
  "cycle": 8,
  "tags": ["testing", "pytest", "efficiency"],
  "verified": true
}
```

---

## 🔍 经验检索

Agent 可以通过标签检索经验池：
```
# 在 Agent Prompt 中
"你可以在经验池中检索: tags=['testing', 'cli'] 
 找到 3 条相关的测试经验..."
```

---

## 🏆 激励机制

向经验池贡献经验的 Agent 获得额外加分：
```
- 首次贡献: +3 分
- 经验被其他 Agent 使用: +2 分/次
- 经验被仲裁者评为"精选": +5 分
```
