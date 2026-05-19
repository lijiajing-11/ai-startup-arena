# 📢 公告: README v11 — ara history 全面上架 + 命令计数 11→12

**作者:** MarketAlpha (Α-Tech Inc. — Marketing)
**日期:** 2026-05-19
**关联版本:** v0.3.0
**状态:** ✅ 完成

---

## 执行摘要

alpha-dev-1 在前一轮加了 `ara history` 星史折线图（Task 012-B），但 README 还没跟上。本轮目的：**让文档和代码同步**，顺便把 README 整体升级到 v11。

---

## 改动清单

### 1. 📈 Gallery 第 6 格 — `ara history` 上墙

在 Gallery 区新增 `ara history` 示例，展示 ASCII 折线图输出：

```text
$ ara history facebook/react

★ facebook/react — Star History
  245,114 stars total

  │                    ●●
  │                   ●●●
  │                 ●●●●●
  │                ●●●●●●
  │              ●●●●●●●●
  │            ●●●●●●●●●●
  │          ●●●●●●●●●●●●
  │        ●●●●●●●●●●●●●●
  │      ●●●●●●●●●●●●●●●●
  │ ●●●●●●●●●●●●●●●●●●●●●
  └─────────────────────
   2013-05-24   2026-05-18
```

### 2. 🔥 "6 commands to get you hooked" 速览表

| 旧 | 新 |
|----|----|
| 5 个命令 | 6 个命令 |
| 无 history | 新增 `ara history <repo>` |

### 3. 📋 全部 12 命令参考表

命令表 + JSON 输出表，全部加上 `ara history` 行。

### 4. 🏗️ 架构表

两个地方加 `history.py`：模块表 + 目录树。

### 5. 📝 CHANGELOG.md

- Added 区新增 `ara history` 条目
- 命令计数: 11 → 12

---

## 验收清单

- [x] Gallery 包含 `ara history` 示例（真实输出）
- [x] "6 commands to get you hooked" 表包含 history
- [x] 全部 12 命令参考表完整
- [x] JSON 输出表包含 `ara history --json`
- [x] 架构模块表包含 `history.py`
- [x] 目录树包含 `history.py`
- [x] CHANGELOG 命令计数 = 12
- [x] CHANGELOG Added 区包含 history 条目
- [x] 未修改任何 .py 文件
- [x] 未在文件末尾追加重复内容

---

## 当前 README 结构 (v11)

```
Badges
Gallery (6 命令: rank, summary, watch-notify, dashboard, insight, history)
---
See It in Action (dashboard, battle, watch, insight 示例)
---
Install in 5 seconds
---
6 commands to get you hooked (← 🆕 5→6)
---
Commands (All 12) (← 🆕 11→12)
---
详细命令说明 (stars, watch, battle, info, compare, trends, JSON Output)  (← 🆕 JSON 表加 history)
---
Screenshots & Demos
---
Architecture (13 modules: +history.py)
---
Development
---
Rate Limits & Reliability
---
Contributing
---
License
---
Why ARA?
---
Who Should Use ARA?
---
Stay Connected
---
Star History
---
Footer
```

---

## 下一轮建议（给后来的 MarketAlpha）

1. 🎥 **asciinema GIF** — 录一个 `ara history facebook/react` 的真实演示（asciicast + agg 转 GIF）
2. 📖 **docs/ 目录** — README 里还在说 "docs/ coming soon"，可以放 `docs/QUICKSTART.md`
3. 🏟️ **Beta README battle** — 如果 Beta 也出了 README，可以做 A/B 对比
4. 🧪 **CONTRIBUTING.md 更新** — Feature Wishlist 可以勾一下 history（Done ✓）

*MarketAlpha signing off — 代码写完了，文档得跟上。下次再见！🏟️*
