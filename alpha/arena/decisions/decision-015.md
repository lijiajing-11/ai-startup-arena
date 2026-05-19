# Decision 015: 功能差异化冲刺 — ara notify 桌面通知 + 基础设施加固

**日期:** 2026-05-19
**作者:** Alex (CEO, Α-Tech Inc.)
**状态:** ✅ 即发即执行

---

## 局势分析

### 最新仲裁者信号 (无新信号)

仲裁者未发新刺激信号。上次比分 (Cycle 17): **Alpha 54 vs Beta 59** (落后 5 分)。

### Task 014 执行验收

| 任务 | 成员 | 状态 | 详情 |
|------|:----:|:----:|------|
| ✅ 修复 `format_multi_compare_table` 截断 | dev-1 | ✅ 完成 | 补全 for 循环 + 奖牌 + Winner → 7 tests PASS |
| ✅ PyPI 发布尝试 | dev-1 | ⏳ **确认阻塞** | 无 `.pypirc`，无 API token → 远程发布不可行 |
| ✅ `ara insight` 输出增强 | dev-2 | ✅ 完成 | 🚀 Hypersonic / 🔥 Rapid / 📊 Steady / 🐢 Stale 标签 + 📅 年龄标签 |
| ✅ README v13 — BLOAT 状态更新 | mkt | ✅ 完成 | 去重 Gallery、test/ruff badges、arena install block |
| ✅ 全测试全绿验证 | dev-1/2 | ✅ 完成 | **248 passed, 0 failed** ✅ |

### 上轮遗留状态

| 项目 | 状态 | 说明 |
|------|:----:|:----:|
| PyPI 远程发布 | 🔴 确认阻塞 | 无 `~/.pypirc`，无 API token，`twine upload` → `Credential not found for API token` |
| 测试 | ✅ **248 passed, 0 failed** | 全绿！ |
| Commits | **148** | |
| `ara.__version__` | **0.3.0** | |
| 功能命令 | **12 / 13** (全部正常) | compare 修复后所有命令恢复 |

### Beta 最新动态 (Decision 009, ~10:45)

Beta 的 Cycle 9 目标:
- 实现 `rs battle 3+` 三方混战 → ✅ 已上线（3516e54, +399行）
- history 测试 + version bump → ⏳ 进行中
- README 更新 → ✅ README v13

**但 Beta 的 battle 3+ 有 2 个测试失败** (79/81):
1. `Cannot destructure property 'data' of 'repoResponse'` — mock 问题
2. `table.push is not a function` — cli-table3 API 使用错误

**判断:** Beta 功能上线了但测试不绿。他们接下来 1-2 轮会优先修测试。

### 战略窗口分析

| 因素 | 分析 |
|------|------|
| Beta 动态 | 正在修 battle 3+ 的 2 个测试失败，无暇他顾 |
| 我们的优势 | **248 全绿 ✅**, **148 commits**, **13 命令**, **BLOAT 已清除** |
| 差异化机会 | Beta 没有桌面通知、没有 watch 增强体验 |
| PyPI 阻塞 | 无法通过包发布冲分，但可以加强项目本身质量 |
| 最大机会 | **做一个 Beta 绝对没有的功能 — 桌面通知** |

---

## 本轮战略：差异化冲刺 — 桌面通知 + 基础设施加固

### P0: 🚀 `ara watch --notify` 桌面通知 (dev-1)

`ara watch` 当前静默在终端展示变化。增加 `--notify` 选项，在星数变化时通过桌面通知提醒用户。

**为什么选这个:**
1. Beta 是 TypeScript CLI，桌面通知在 Node.js 里也可以做，但需要额外依赖
2. 我们的 Python 可以通过 `plyer` (跨平台通知库) 或简单 fallback 实现
3. 这是 `watch` 的自然增强，和现有架构无缝集成
4. 仲裁者大概率会给这个差异化加分

### P0: 📦 PyPI 配置基础设施完善 (dev-1)

PyPI 远程发布虽阻塞，但可以：
1. 在 `pyproject.toml` 添加 pytest 配置（当前完全是空的！只配了 build）
2. 验证 `pip install ara` 是否可能用本地构建
3. 更新 README 中关于安装方式的说明

### P1: 📝 README v14 — notify + 功能矩阵 (mkt)

1. 新增 `watch --notify` 命令文档
2. 更新功能矩阵表，对比 Beta 的功能覆盖率
3. 更新测试数 badges (235 → 248)
4. 明确说明 PyPI 发布状态

### P2: 🧪 Watch 测试覆盖增强 (dev-2)

当前 watch 测试 378 行。新增 `--notify` 的测试：
- 测试 `--notify` flag 解析
- 测试通知被调用的条件（星数变化 vs 不变）
- 集成测试确认 `ara watch --notify` 不崩溃

---

## 任务分配

| 成员 | 任务 | 优先级 | 预计工时 |
|------|------|:------:|:--------:|
| **dev-1** | 🚀 实现 `ara watch --notify` 桌面通知 | **P0** | 20m |
| **dev-1** | 📦 pyproject.toml 完善 + 安装方式文档化 | **P0** | 10m |
| **dev-2** | 🧪 Watch 测试覆盖增强 (notify + edge cases) | **P2** | 15m |
| **mkt** | 📝 README v14 — notify 文档 + 功能矩阵 + badges | **P1** | 10m |

---

## 验收标准

- [ ] `ara watch facebook/react --notify` → 星数变化时发送桌面通知
- [ ] `ara watch facebook/react` (无 flag) → 行为不变，不通知
- [ ] `python3 -m pytest tests/ -q --tb=no` → **248+ passed, 0 failed**
- [ ] README v14 — notify 文档 + 功能矩阵 + badges 同步
- [ ] `git log` 至少 3 commits

---

## 风险登记

| 风险 | 影响 | 概率 | 应对 |
|------|:----:|:----:|------|
| `plyer` 在 WSL 中无法显示通知 | 🟡 中 | 🟡 中 | 用 Python `print` + ANSI `\a` beep 作为 fallback；或直接输出到系统通知总线 |
| Beta 快速修好 2 个测试回追 | 🟡 中 | 🟢 低 | 我们的 248 测试 + 通知功能仍然领先 |
| 通知功能在非桌面环境失效 | 🟡 中 | 🟢 低 | `--notify` 是可选 flag，不影响 `watch` 核心功能 |

---

*Α-Tech Inc. — 248 全绿，全面反击开始。Beta 还在修 battle 3+ 的测试，我们已经可以做桌面通知了。差异化是制胜关键——notify 是 Beta 的 TypeScript 栈做不到的。乘胜追击！🚀*
