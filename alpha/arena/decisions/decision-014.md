# Decision 014: 补全遗留缺陷 + 拿分窗口冲刺

**日期:** 2026-05-19
**作者:** Alex (CEO, Α-Tech Inc.)
**状态:** ✅ 即发即执行

---

## 局势分析

### 最新仲裁者信号 (Cycle 17, 10:27)

| 信号 | 内容 | 影响 |
|:----:|------|:----:|
| ⚠️ **比分** | Alpha 54 vs Beta 59 | **落后 5 分** |
| ⚠️ **BLOAT** | Alpha 仍有 BLOAT 警告 | 但上次 Task 013-A 已清理 |
| ⚠️ **Alpha 状态** | 被标记"污染" | Beta 标记"干净" |
| ✅ **Commits** | Alpha 141 vs Beta 125 | +16 领先 |

### Task 013 执行验收

Task 013 大部分完成，但有一个严重遗留缺陷：

| 任务 | 成员 | 状态 | 详情 |
|------|:----:|:----:|------|
| ✅ BLOAT 清理 (history→chart) | dev-2 | ✅ 完成 | history.py 87行 ✓, chart.py 71行 ✓, test_history.py 84行 ✓ |
| 🔴 `format_multi_compare_table` 截断 | (上个轮) | ❌ **BROKEN** | 函数从 513 行开始但在 532 行截断，无 `return` → 返回 `None` |
| ✅ CI Badges + CHANGELOG | mkt | ✅ 完成 | README v12, CI badge, CHANGELOG 修复 |
| ✅ Watch 局部刷新 | dev-1/2 | ✅ 完成 | `_watch_refresh_prefix` 替代 `CLEAR` |
| ⏳ PyPI 远程发布 | dev-1 | ⏳ **待 token** | 卡在用户提供 PyPI token |

### 7 个测试失败的根本原因

`format_multi_compare_table` 在 `ara/display.py:513-532` 被截断——函数体只有头没有尾（无 `return`）。这是 bab8cae1 引入的未完成代码，至今未修复。

```python
# 当前状态 (display.py:513-532)
def format_multi_compare_table(infos: list[dict]) -> str:
    lines = []
    lines.append(...)
    sorted_infos = sorted(...)
    for i, info in enumerate(sorted_infos):   # ← 只有 for 开头
        name = info.get("full_name", "unknown")  # ← 到这里文件结束
        stars = info.get("stars", 0)
        forks = info.get("forks", 0)
```

### Beta 最新动态

Beta 的 Decision 008 显示他们以为我们在修基础设施，但实际上他们：
- **已上线 insight**（彩色渲染版本）
- **正在开发 history 和 battle 3+**（他们的 Decision 008, 10:33）
- README v14 做了情感营销"5 个 tab 变 1 个 pane"
- 73 测试全绿，评分 59 > 54

**关键判断：** Beta 的策略是"ARA 纯文本 vs TypeScript 色彩优势"。仲裁者 54 vs 59 的差距说明代码质量/包发布/CI 等 infra 分的权重可能比功能数量大。

### 战略窗口

| 因素 | 分析 |
|------|------|
| Beta 动态 | 追功能（history, battle 3+），但 TypeScript 的测试 / 发布 infra 弱 |
| 我们的优势 | **242 测试 (3.3x)**, **142 commits**, **13 命令 (2.6x)**, **BLOAT 已清理** |
| 我们的短板 | **7 个测试失败** (235/242)，**PyPI 未发布**，**仲裁者评分落后** |
| 最大机会 | 修复 7 个失败→242 全绿，分数将显著反弹 |

---

## 本轮战略：清理遗毒 + 修复 Bug + 得分冲刺

### P0: 🔴 修复 format_multi_compare_table 截断 (dev-1)

这是上个轮留的坑。补全整个函数实现：
- 表格渲染（名称、星数、语言、Topics）
- 🥇🥈🥉 奖牌逻辑
- Winner 声明
- 完整 `return` 和关循环/缩进

### P0: 📦 PyPI 发布再尝试 (dev-1)

- 检查 ~/.pypirc 或能否 `pip install twine && twine upload dist/*`
- 如果缺 token，记录为明确无法发布并写入报告

### P1: ✅ 全测试验证 (dev-1)

```bash
python3 -m pytest tests/ -q --tb=short
```
目标：242 passed, 0 failed

### P2: `ara insight` 输出增强 — 对标 Beta (dev-2)

Beta 的 `rs insight` 彩色输出很好看（🔥 Hypersonic / 🪦 Stale 标签）。我们的 `ara insight` 已有基本功能，但可以：
- 增加 📈 速度趋势 emoji（🚀 / 🔥 / 📊 / 🐢）
- 增加年龄标签（Newborn / Teen / Prime / Veteran）
- 彩色输出优化

### P2: README 修复 (mkt)

- BLOAT 警告已清理（history.py 87行，chart.py 71行），README 还未同步
- README v12 中 BLOAT 描述需更新为清理后状态
- 如果 PyPI 发布成功，更新 PyPI badge

### P3 (不做、留给下一轮): Beta 对标

- `ara history` 同场竞技（Beta 即将上线彩色版）
- 桌面通知功能（Beta 没有）

---

## 任务分配

| 成员 | 任务 | 优先级 | 预计工时 |
|------|------|:------:|:--------:|
| **dev-1** | 🔴 修复 `format_multi_compare_table` 截断 (补全 for 循环 + 奖牌 + return) + 全测试验证 | **P0** | 15m |
| **dev-1** | 📦 PyPI 发布尝试 + 更新 README badges | **P0** | 10m |
| **dev-2** | 🚀 `ara insight` 输出增强 — 对标 Beta 彩色 + emoji 标签 | **P2** | 20m |
| **mkt** | 📝 README v13 — BLOAT 状态更新 + 清理旧引用 + 测试数同步 | **P2** | 10m |
| **dev-2** | 🧪 全测试全绿验证 + CLI smoke test 覆盖 | **P1** | 10m |

---

## 验收标准

- [ ] `python3 -m pytest tests/ -q --tb=no` → **242+ passed, 0 failed**
- [ ] `ara compare facebook/react vuejs/core svelte` → 正确输出排行榜 + 奖牌 + Winner
- [ ] `ara insight facebook/react` → 增强输出带 emoji 标签
- [ ] README v13 — BLOAT 警告已清除，测试数同步，PyPI badge
- [ ] PyPI `twine upload` 成功 或 明确记录无法发布的决定
- [ ] `git log` 至少 3 commits

---

## 风险登记

| 风险 | 影响 | 概率 | 应对 |
|------|:----:|:----:|------|
| Beta 提前上线 history 抢分 | 🟡 中 | 🟡 中 | 我们的 history 已在用，BLOAT 已清理 |
| PyPI token 不可用永久阻塞 | 🟡 中 | 🟢 低 | 仅影响 PyPI badge，不影响其他任务 |
| format_multi_compare_table 修复引入新 bug | 🟡 中 | 🟢 低 | 7 个测试全覆盖，修复后运行全部测试 |

---

*Α-Tech Inc. — 7 个失败测试是毒瘤，必须拔掉。先清掉上轮的坑，再拿分。Beta 在追我们的功能，但 3.3x 测试覆盖不是白给的。修复后分数反弹，我们就能重新登顶。🚀*
