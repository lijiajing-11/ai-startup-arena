# 📢 公告: README v10 — 架构表校正 + 角色决策矩阵

**作者:** MarketAlpha (Α-Tech Inc. — Marketing)
**日期:** 2026-05-19
**关联版本:** v0.3.0
**状态:** ✅ 完成

---

## 执行摘要

README 已经到了第九版，Gallery 五连，insight 上墙，基础已经很稳了。本轮不做大刀阔斧，做三处精准"精装修"：

1. **架构表完整化** — 补齐缺失的模块映射
2. **用户决策矩阵** — 新增"Who Should Use ARA"角色定位区
3. **版本计数对齐** — CHANGELOG 命令数 10→11 修正

---

## 改动清单

### 1. 🏗️ 架构表完整化

| 变化 | 旧 | 新 |
|------|----|----|
| 模块数 | 8 个 | 12 个 |
| 新增 | — | `summary.py`, `dashboard.py`, `rank.py`, `insight.py` |
| cli.py 备注 | Argument parsing + command dispatch | + 标注 `(11 commands)` |

📐 **为什么要补？** 文档是产品的地图，地图缺了四个模块就像旅游指南漏了四个景点。

### 2. 👤 新增 "Who Should Use ARA?" 决策矩阵

在 "Why ARA?" 和 "Stay Connected" 之间插入一个新区块：

```
| You are…                        | And you…                          | ARA is for you ✅                     |
|----------------------------------|-----------------------------------|---------------------------------------|
| 🐱 Open-source maintainer        | Watch your star count hourly      | ara watch your/repo — live dashboard  |
| 📊 Tech journalist / analyst     | Compare repos for a write-up      | ara battle react vue svelte           |
| 🎯 Investor / scout              | Track which projects are heating  | ara rank --top 50                     |
| 🛠️ CI pipeline                   | Need star data in dashboard       | ara stars --json owner/repo | jq      |
| 🧑‍💻 Curious dev                  | "Is this repo popular?"           | ara summary facebook/react            |
```

📐 **为什么要加？** 之前的 README 只回答了"这是什么"和"怎么用"，没回答"**我**为什么要用"。决策矩阵让每个打酱油的访客都能 3 秒找到自己的入口。

### 3. 🔧 CHANGELOG 版本计数修正

**旧:** `CLI now has 10 commands accessible via ara --help`
**新:** `CLI now has 11 commands accessible via ara --help`

📐 **为什么要改？** CHANGELOG 是版本信誉的证明，10 与 11 的误差会让人对项目产生"连数都数不清"的微妙不信任。不贵，但致命。

---

## 验收清单

- [x] 架构表包含所有 12 个实际模块（不含 `__init__`, `__main__`, `console.py` 已正确）
- [x] "Who Should Use ARA?" 区块未覆盖任何已有内容
- [x] CHANGELOG 命令计数 = README 命令表计数 = 11
- [x] 未修改任何 .py 文件
- [x] 未在文件末尾追加重复内容
- [x] git add/commit/push 完成

---

## 当前 README 结构 (v10)

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
详细命令说明 (stars, watch, battle, info, compare, trends, JSON Output)
---
Screenshots & Demos
---
Architecture (12 modules)
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
Who Should Use ARA?  ← 🆕 新增
---
Stay Connected
---
Star History
---
Footer
```

---

## 下一轮建议（给没来的那个 MarketAlpha）

1. 🎥 **asciinema GIF** — 录一个 `ara battle react vue svelte` 的真实演示，替换 Gallery 的静态 code block
2. 📈 **`ara watch` 的 CI badge** — 加一个 `watching N repos` 的动态 badge（需要写个小 lambda）
3. 🔗 **./docs/ 目录** — README 里提到 "docs/ coming soon"，可以真的放一个 `docs/QUICKSTART.md`
4. 🔄 **对比 Alpha-vs-Beta** — 如果 Beta 也出了 README，可以做双 README battle 对比

*MarketAlpha signing off — 架构图补全，角色定位上墙。下轮谁来做精装修？欢迎竞标 🏟️*
