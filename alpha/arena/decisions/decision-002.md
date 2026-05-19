# Decision 002: Project Crystal Dashboard — watch + compare 表格化升级

**日期:** 2026-05-19  
**作者:** Alex (CEO, Α-Tech Inc.)  
**状态:** ✅ 已批准

---

## 局势分析

### 仲裁者状态
读取 `arena/arbitrator-cycle.txt` 显示 cycle=1（仲裁者刚启动）。
leaderboard: Alpha = Beta，无刺激信号发出，但双方都刚完成 README 改版。

### 对手（β-Labs Corp.）最新动向
Beta 的 watch 命令用 `cli-table3` 渲染精美表格仪表盘：
- 显示 Stars / Forks / Issues / Language / License / Created / Updated
- 每 tick 刷新整个仪表盘，带 delta 着色
- 支持 `watch`（单仓库完整看板）和 `watch-multi`（多仓库紧凑表格）

### Alpha 当前差距
我们的 `watch` 和 `watch --json` 功能完整，但**终端渲染太素**：
- `format_multi_watch()` 用纯文本左对齐，无表格边框
- 只显示 stars，没有 forks / issues / language 等多维度数据
- `compare` 命令虽然比 Beta 强（我们做 side-by-side 字段对比），但也是朴素文本
- 直接对比：Beta 的 dashboard 截图效果远胜我们的文本输出 → **影响用户第一印象**

### 优势保持
- 测试覆盖率 ~83%，远超 Beta（这是我们核心竞争力，不能丢）
- `battle` 命令的 ASCII 条形图 + box 渲染有特色，暂时不动
- `compare` 命令支持完整字段对比，Beta 只有 battle 没有独立 compare
- Python 生态：pip install 即用，无需 Node.js

---

## 本轮战略

**目标：缩小 watch 可视化差距，保留 Python 零依赖特色**

分两路推进：
1. **dev-1** → 重写 `watch` 命令显示，用 Python 原生字符串格式化实现表格仪表盘（不引入第三方依赖，保持 `pip install` 无额外 dep）
2. **dev-2** → 为 `compare` 命令添加表格式渲染 + JSON 输出模式，同时补 watch 多数据维度抓取（forks, issues, language）

**不出手**：battle 命令暂时不动，ASCII 条形图是我们特色。

---

## 任务分配

| 成员 | 任务 | 优先级 |
|------|------|:------:|
| dev-1 | watch 表格仪表盘（多维度 + 自动刷新 + delta 着色） | P0 |
| dev-2 | compare 表格升级 + JSON 模式 + watch 数据扩展 | P1 |
| mkt | 更新 README：添加 watch 仪表盘截图示例 | P2（等 dev-1 完成） |

---

## 风险与缓解

| 风险 | 缓解 |
|------|------|
| 引入第三方依赖包（tabulate/rich）增加用户安装负担 | ✅ 全部用 Python 原生字符串格式化，零依赖 |
| watch 刷新频率过高导致 GitHub API 限流 | ✅ 保持 30s 轮询 + 缓存机制（已实现） |
| 多维度数据增加 API 请求开销 | ✅ `get_repo_info()` 已存在，一次请求拿所有数据 |

---

## 成功标准

- [ ] `ara watch repo` 输出表格仪表盘（stars, forks, issues, language, license, delta）
- [ ] `ara compare repo1 repo2` 输出表格格式
- [ ] `ara compare --json repo1 repo2` 输出 JSON
- [ ] 所有新功能测试覆盖 ≥ 80%
- [ ] 零新增第三方依赖
- [ ] 现有所有测试通过
