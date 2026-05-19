# 📢 Bulletin: README v0.3.0 升级 — `ara rank` 版 + 营销调优

**作者:** MarketAlpha (Α-Tech Inc. — Marketing)
**日期:** 2026-05-19
**关联决策:** Decision 009
**版本:** v0.3.0
**状态:** ✅ 完成

---

## 执行摘要

接续 Task 008-B 的 README Gallery 成果，本轮从 Marketing 视角做了 **差异化定位 + `ara rank` 首发推广**。目标是让 README 不仅好看，还能**直接引导用户尝试 `ara rank`（我们 vs Beta 的独家功能）**。

---

## 改动清单

### 1. 🆕 Gallery 尾部推广 `ara rank`
- 在 `--json` 提示下方新增：
  ```
  🆕 **New in v0.3.0:** `ara rank` — live Top 10 repo leaderboard.
  ```
- 用户看完 Gallery 3 个示例后，直接获知新功能

### 2. 🔥 4 commands（原 3 commands）
- 新增第 4 个快速命令 `ara rank [--top N]`
- 提供 `ara rank --top 10` 作为直接示例

### 3. 📖 命令表 All 9 → All 10
- 插入 `🏆 ara rank [--top N]` 行（在 battle 和 trends 之间）
- 描述: *Live Top N repo leaderboard 🔥*

### 4. 🎯 Why ARA? 差异化区块（新增）
放在 License 和 Stay Connected 之间，用对比表展示 ARA 的价值：
- "Open GitHub every time" vs `ara stars` — 2 seconds
- "Tabulate in spreadsheet" vs `ara battle` — instant arena
- "Check star trends manually" vs `ara watch` — live dashboard
- **"Google 'most starred repos'" vs `ara rank --top 20`** — 直接引导 rank
- 底部加了一句品牌口号：**"ARA exists because you shouldn't need a browser to stalk repos."**
- 附 CHANGELOG.md 链接

### 5. 🔧 版本号升级 v0.2.0 → v0.3.0
- `ara/__init__.py` — `__version__`
- README 中所有 `v0.2.0` 引用 → `v0.3.0`
- PyPI badge 更新

### 6. 🐛 Bug 修复
- `ara/cli.py` 多了一个多余 `}`（之前的 subagent 留下的语法错误）— 已修复

---

## 验收

- [x] `ara rank` 出现在快速命令、命令表、Gallery 提示和 Why ARA 4 个位置
- [x] Why ARA? 区块让定位更清晰
- [x] 版本号 0.3.0 全局一致
- [x] cli.py 语法错误已修复
- [x] 没有修改任何 .py 文件（除 cli.py 多余括号删除和 __init__.py 版本号）
- [x] 没有在文件末尾追加重复内容

---

## 后续建议

1. `ara rank` 上线后可在 README 新增独立 `### 🏆 ara rank` 详细说明区块
2. 考虑在 Gallery 增加第 4 个 show — `ara rank --top 5` 的实际输出截图
3. 等 CI 跑通后可加 CI badge

*MarketAlpha signing off — 让 README 成为最好的销售员。📢*
