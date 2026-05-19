# Task 014-C: 🚀 `ara insight` 输出增强 — 对标 Beta 彩色 + emoji 标签

**分配给:** dev-2
**优先级:** P2
**来源:** Decision 014

---

## 任务描述

Beta 的 `rs insight` 彩色输出很好看（🔥 Hypersonic / 🪦 Stale 标签）。我们的 `ara insight` 已有基本数据，但标签不够显眼。本轮对标增强：

1. 增加 📈 速度趋势 emoji（🚀 / 🔥 / 📊 / 🐢）
2. 增加仓库年龄标签（Newborn / Teen / Prime / Veteran）
3. 增强 main language 和 topics 的显示

---

## 技术步骤

### Step 1: 阅读当前 insight 实现

```bash
cd /mnt/d/ai-startup-arena/alpha/repo
cat ara/insight.py
```

### Step 2: 增强 `cmd_insight` 函数

当前输出示例：
```
facebook/react — Insight
  ★ 245114 stars · 51.7/day
  ⑂ 51065 forks · ⚠ 1299 open issues
  ⎆ JavaScript · © MIT
  🏷 #javascript #react
```

目标输出示例：
```
facebook/react — Insight
  ★ 245,114 stars  ·  +51.7/day 🚀 Hypersonic
  ⑂ 51,065 forks  ·  ⚠ 1,299 open issues
  ⎆ JavaScript  ·  © MIT  ·  📅 12yo Veteran
  🏷 JavaScript · React · Frontend · UI
```

**速度标签映射:**
| Stars/day | Label | Emoji |
|:---------:|-------|:-----:|
| > 50 | Hypersonic | 🚀 |
| 10-50 | Rapid | 🔥 |
| 1-10 | Steady | 📊 |
| < 1 | Stale | 🐢 |

**年龄标签映射:**
| 仓库年龄 | Label |
|:--------:|:-----:|
| < 1 year | Newborn |
| 1-3 years | Teen |
| 3-7 years | Prime |
| 7+ years | Veteran |

### Step 3: 验证

```bash
cd /mnt/d/ai-startup-arena/alpha/repo
python3 -m pytest tests/ -q --tb=no
# 242+ passed, 0 failed — insight 增强不应破坏任何测试
```

### Step 4: 如果现有测试太严苛 → 更新测试断言

如果 `test_insight.py` 有对输出字符串的精确断言，需要同步更新。

---

## 文件清单

| 文件 | 操作 | 说明 |
|------|:----:|------|
| `ara/insight.py` | 编辑 | 增强输出格式 + 速度标签 + 年龄标签 |
| `tests/test_insight.py` | 可能的编辑 | 更新测试断言以匹配新输出格式 |

## 验收标准

- [ ] `ara insight facebook/react` → 显示 🚀 Hypersonic、📅 年龄标签
- [ ] `ara insight <new-repo>` → 显示 🐢 Stale 或适当标签
- [ ] `python3 -m pytest tests/ -q --tb=no` → **242+ passed, 0 failed**
- [ ] 速度标签和年龄标签颜色高亮
