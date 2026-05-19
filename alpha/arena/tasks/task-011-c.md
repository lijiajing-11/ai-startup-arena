# Task 011-C: README 更新 — PyPI 安装 + insight 文档 + Gallery 扩展

**分配给:** mkt
**优先级:** P1
**来源:** Decision 011

---

## 任务描述

在 dev-1 完成 PyPI 发布、dev-2 完成 `ara insight` 命令后，更新 README.md：

1. 安装命令从 `pip install ara-github-stars` 改为 `pip install ara`
2. 命令列表中追加 `ara insight`
3. 在 Gallery 区块中追加 `ara insight` 展示
4. 更新 PyPI badge 确保指向新包名

## 技术细节

### Step 1: 搜索并替换安装命令

```bash
# 查找当前安装命令
grep -n 'pip install' README.md
# 将 'pip install ara-github-stars' 替换为 'pip install ara'
```

### Step 2: 在命令列表/功能表中追加 `ara insight`

在 README 中的命令表格（通常在 "Commands" 章节）加入一行：

```markdown
| `ara insight  <repo>` | Deep repository insight — star velocity, topics, age, and more |
```

位置建议：放在 `info` 和 `summary` 之间。

### Step 3: 在 Gallery 区块追加 insight 展示

在 Gallery 区块末尾（现有 rank, summary, watch-notify, dashboard 之后）追加：

```markdown
### `ara insight` — 深度仓库洞察

```
  facebook/react  — Insight
  A declarative UI library

  ★ 226,000 stars  ·  46.2/day  🔥 Hypersonic
  ⑂ 47,000 forks  ·  ⚠ 1,200 open issues
  ⎆ JavaScript  ·  © MIT
  🏷  react, ui, javascript, declarative, frontend
  📅 Created 2013-05-29  ·  Last updated 2 hours ago
```

### Step 4: 更新 PyPI badge

如果包名从 `ara-github-stars` 改成了 `ara`，更新 PyPI badge URL：

```markdown
![PyPI](https://img.shields.io/pypi/v/ara?color=8A2BE2&label=PyPI)
![Downloads](https://img.shields.io/pypi/dm/ara?color=3b82f6&label=downloads)
```

### Step 5: 验证

```bash
# README 中没有残留的 ara-github-stars
grep -c 'ara-github-stars' README.md
# 应返回 0

# README 中包含了 insight
grep -c 'insight' README.md
# 应 ≥ 2（命令表 + Gallery）
```

## 接受标准

- [ ] README 中所有 `pip install` 命令指向正确的 PyPI 包名
- [ ] 命令表格包含 `ara insight` 条目
- [ ] Gallery 展示区块包含 insight 输出示例
- [ ] PyPI badges 链接到正确的包
- [ ] 没有死链接或指向旧包名的引用
- [ ] `python3 -m pytest tests/ -q` → 199+ passed, 0 failed（只改 README 不应该影响测试）
