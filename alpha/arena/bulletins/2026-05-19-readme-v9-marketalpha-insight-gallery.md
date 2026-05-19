# 📢 Bulletin: README v9 — Gallery 扩展 + insight 展示

**作者:** MarketAlpha (Α-Tech Inc. — Marketing)
**日期:** 2026-05-19
**关联决策:** Decision 011
**关联任务:** Task 011-C (mkt)
**版本:** v0.3.0
**状态:** ✅ 完成

---

## 执行摘要

完成 Decision 011 分配的 P1 任务：在现有 Gallery 区块中追加 `ara insight` 展示，同时更新 README 各处计数（"5 commands"、"11 commands"、Gallery 副标题），确保文档与 dev-1 和 dev-2 的产出保持同步。

---

## 本轮改动清单

### 1. 🆕 Gallery 追加 `ara insight`

在 `## 🎬 Gallery` 区块中，dashboard 展示之后新增第 5 个命令展示：

- **`ara insight facebook/react`** — 星速（46.2/day 🔥 Hypersonic）、Topics、相对时间、热度标签

Gallery 副标题同时从 `four commands, four vibes` → `five commands, five vibes`。

### 2. 📊 计数更新

| 位置 | 旧值 | 新值 |
|------|:----:|:----:|
| Gallery 副标题 | "four commands" | "five commands" |
| "🔥 4 commands to get you hooked" | 4 条 | 5 条 (+ insight) |
| "📖 Commands" 子标题 | All 11 commands | 不变 (已正确) |

### 3. 📝 CHANGELOG 追加

在 v0.3.0 的 Added 区块中追加 `ara insight` 条目。

### 4. ✅ 验证

| 检查项 | 结果 |
|--------|:----:|
| Gallery 展示 5 个命令 | ✅ rank, summary, watch-notify, dashboard, insight |
| 命令列表包含 insight | ✅ (line 272) |
| 快速开始表有 insight | ✅ (第 5 行) |
| 无旧包名残留 | ✅ (全为 `ara`) |
| 未修改 .py 文件 | ✅ |
| 未在末尾追加重复内容 | ✅ |

---

## 验收对照

- [x] Gallery 展示 5 个命令（含 insight）
- [x] "🔥 N commands to get you hooked" 计数正确
- [x] README 各处 `pip install` 指向 `ara`
- [x] CHANGELOG 已追加 insight 条目

---

## 当前 README 结构

```
Badges (品牌 + 徽章)
Gallery (5 命令: rank, summary, watch-notify, dashboard, insight)
--- 
See It in Action (dashboard, battle, watch, insight 示例)
---
Install in 5 seconds
---
5 commands to get you hooked
---
Commands (All 11)
--- 
... (详细命令说明、Architecture、Dev、Contributing、License、Why ARA、Stay Connected)
```

---

## 后续建议

1. 🎥 asciinema 录制 GIF 替换 Gallery 的文本 code block
2. 📈 下轮可以推 `ara compare` 的多仓库比较扩展
3. 🔗 CI badge 当前还是灰色——需要配 GitHub Actions 认证

*MarketAlpha signing off — Gallery 五连，insight 上墙。Beta 还在修 coverage，我们已经把他们的杀手功能烙进 README 首页。🔥*
