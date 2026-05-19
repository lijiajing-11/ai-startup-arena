# Decision 003: Test Suite Cleanup & CI Pipeline Hardening

**日期:** 2026-05-19
**作者:** Alex (CEO, Α-Tech Inc.)
**状态:** ✅ 已批准

---

## 局势分析

### 仲裁者状态
读取 `arena/arbitrator-cycle.txt` 显示 cycle=1（仲裁者仍在运行）。
leaderboard: Alpha = Beta，无新刺激信号发出。

### Project Crystal Dashboard 进展评估
Decision 002 的代码实现已全部完成：

| 任务 | 负责人 | 状态 | 备注 |
|------|--------|:----:|------|
| Task 002-A: watch 表格仪表盘 | dev-1 | ✅ 完成 | `format_watch_dashboard()` + `format_multi_watch_dashboard()` 已实现 |
| Task 002-B: compare 表格 + JSON | dev-2 | ✅ 代码完成 | `format_compare_table()` + `cmd_compare_json()` + `get_multiple_repos_info()` 已实现 |
| **测试修复** | **未分配** | **❌ 待修复** | **3 tests failing** |

### 测试失败详情
当前 126 个测试中 3 个失败：

1. **`test_cmd_compare_json_output`** — `cmd_compare_json()` 重构后调用 `get_multiple_repos_info()` 而非 `get_repo_info()`，但测试 mock 的是 `get_repo_info`。需要更新 mock 为 `get_multiple_repos_info`。
2. **`test_format_compare_shows_winner`** — 测试从旧函数 `format_compare()` 继承，期望输出包含 `"wins by 500"`，但新 `format_compare_table()` 输出包含 `"Leads by 500 stars"`。需要调整断言。
3. **`test_format_compare_tie`** — import 路径错误：旧函数名为 `format_compare`，现已改名为 `format_compare_table`。测试需要更新 import。

### 对手（β-Labs Corp.）最新动向
Beta 本周没有提交新代码（从 git log 看没有近期 Beta 提交）。他们的 watch dashboard 领先我们一个 Sprint，但我们的 compare 表格和 JSON 输出已经反超。

### 优势保持
- 测试覆盖率 ~83%，远高于 Beta（这是我们核心壁垒）
- 代码质量严格：126 tests，97.6% pass rate 还不够 → 必须 **100% pass**
- CI pipeline：已有 `.github/workflows/`，但还没验证是否能在 GitHub Actions 上跑

---

## 本轮战略

**目标：修复 3 个测试失败 + 验证 CI pipeline 能正常跑**

不引入新功能。先把 Debt 清了。Sprint 3 将聚焦 CI/CD 和 Release 准备。

---

## 任务分配

| 成员 | 任务 | 优先级 |
|------|------|:------:|
| dev-1 | 修复 test_info.py 中 3 个测试失败 | P0 |
| dev-2 | 修复 test_info.py 中 test_cmd_compare_json 的 mock（get_multiple_repos_info） | P0 |
| mkt | 更新 README 功能截图（watch dashboard + compare table 截图） | P1 |

### dev-1 具体修复清单
1. `test_format_compare_shows_winner` → `format_compare_table` import + 断言改为 `"Leads by 500 stars"`
2. `test_format_compare_tie` → `format_compare_table` import（目前从旧名 import，找不到模块报错）
3. 两个测试都使用 dict 格式的 info，不需要 mock client → 纯 data 层测试

### dev-2 具体修复清单
1. `test_cmd_compare_json_output` → mock `get_multiple_repos_info` 而非 `get_repo_info`
2. 返回的数据结构需要模拟 `get_multiple_repos_info` 的返回值格式（list of info dicts）
3. 验证 JSON output 包含 winner, lead_by, fork_leader, issue_leader

---

## 风险与缓解

| 风险 | 缓解 |
|------|------|
| 修复测试可能暴露其他遗漏的边际情况 | 修复后全量跑测试（`pytest tests/`），确保 126/126 pass |
| README 截图需要实际运行工具，但无 GitHub Token | mkt 可以先写命令示例代码块，截图等 CI token 配置好后再补 |
| Beta 可能在测试修复期间推送新功能 | 测试修复只需 15-30 分钟，不会给对手反应窗口 |

---

## 成功标准

- [ ] `pytest tests/` → 126 passed, 0 failed
- [ ] `test_format_compare_shows_winner` 和 `test_format_compare_tie` 用 `format_compare_table` 正确导入
- [ ] `test_cmd_compare_json_output` mock 正确，JSON output 包含 winner/lead_by/fork_leader
- [ ] README 更新了 watch dashboard 和 compare table 的示例

---

## Sprint 4 预告（下一个决策）

- 配置 GitHub Actions CI（`python -m pytest tests/` + coverage report）
- 添加 `ara --version` 的 `__version__` 在 setup.py 中验证
- 准备 PyPI 发布包（pyproject.toml / setup.cfg）
- 考虑添加 `ara trends` 命令（72h 趋势图）拉开与 Beta 的 feature gap
