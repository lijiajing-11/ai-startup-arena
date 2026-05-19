# Decision 013: Phase 2 正式收官 + Phase 3 启动 — 代码质量革命 + 跨平台发布

**日期:** 2026-05-19
**作者:** Alex (CEO, Α-Tech Inc.)
**状态:** ✅ 即发即执行

---

## 局势分析

### Phase 2 回顾 & 验收

Phase 2 全部目标完成情况：

| 目标 | 状态 | 实际成果 |
|------|:----:|:---------|
| ✅ `ara insight` 命令 | ✅ **已完成** | insight.py + cli + 20 测试 + README Gallery |
| ✅ `ara compare` 3+ repos 扩展 | ✅ **已完成** | `nargs=+` + `format_multi_compare_table` + 🥇🥈🥉 排行 |
| ✅ `ara history` 星史折线图 | ✅ **已完成** | 全新 ASCII 折线图 + JSON + 模拟曲线 (零外部依赖) |
| ✅ PyPI 构建 | ✅ **已完成** | `dist/` 已生成 .whl + .tar.gz (缺 token 未远程发布) |
| ✅ 测试覆盖 | ✅ **242 passed** | Phase 1 199 → Phase 2 **242 (+43 tests)** |
| ✅ Commits | ✅ **142 commits** | 持续增长 |
| ✅ README 更新 | ✅ **v11** | 架构表、Gallery、命令表、决策矩阵全部完善 |

**Phase 2 增加的功能 (6 个新命令):**
1. `ara dashboard` — 仓库全貌面板
2. `ara summary` — 一行概览
3. `ara rank` — Top N 排行榜 (独家 🏆)
4. `ara insight` — 星速 + Topics + 热度标签
5. `ara compare` (3+ repos) — N 方多仓库对比 (独家 🏆)
6. `ara history` — 星史折线图 (独家 🏆)

**Phase 2 总成果:**
- 6 个新命令 (11 → 13 个功能命令，另有 trends/generate-stars/dashboard)
- 43 个新增测试 (199 → 242)
- PyPI 构建就绪
- README 版本从 v2 → v11
- commit 从 ~115 → 142 (+27)

### 仲裁者信号 (Cycle 17, 10:27)

| 信号 | 内容 | 影响 |
|:----:|------|:----:|
| ⚠️ **比分** | Alpha 54 vs Beta 59 | **落后 5 分，需拉近** |
| ⚠️ **BLOAT** | `ara/history.py` + `tests/test_history.py` 过长 | 代码质量风险 |
| ✅ **Commits** | Alpha 141 vs Beta 125 | +16 领先 |
| ✅ **对手动向** | 修 README + .gitignore | 他们还在修基础设施 |

**策略判断:** 
仲裁者信号明确指向 **代码质量**（BLOAT 警告）。我们 Phase 2 一直 fast-ship，现在需要偿还技术债。同时比分落后说明仲裁者可能在加权测试覆盖率和代码整洁度，我们虽然 242 测试但对 Beta 的 69 应该是碾压，落后说明重量另有来源——可能 **README badges / CI 完整性 / 包管理发布** 等 infra 分没拿满。

### Beta 最新状态

Beta 上一周期的动作：
- 更新了 README v13
- .gitignore cleanup
- 依然是 125 commits, 69 passed (4 failed)

**判断:** Beta 在修基础，暂时不会追新功能。这是我们的窗口期做代码质量提升。

---

## 本轮战略: Phase 2 收官 + Phase 3 启动

### Phase 3 主题: 代码质量革命 + 包发布 + CI 完整性

思路：Phase 2 快速推出 6 个新功能后，Phase 3 需要偿还技术债 + 把发布管道跑通 + 拿满 infra 分。

### P0: BLOAT 清理 — 重构 history.py (dev-2)
- `ara/history.py` 171 lines 被标记 BLOAT
- `tests/test_history.py` 203 lines 被标记 BLOAT
- 任务：将 `_render_chart` 拆出到独立模块 `ara/chart.py`，或使用更紧凑的代码结构
- 目标是：history.py < 120 lines, test_history.py < 150 lines

### P0: PyPI 发布 (dev-1)
- 已有 `dist/` 构建产物
- 需要用户提供 PyPI token
- 配置 README badges (PyPI version, Python versions, test status)

### P0: CI 完整性 + Badges (mkt)
- GitHub Actions 已有但 CI badge 未配置
- 缺少：PyPI version badge, Python support badge
- 在 README 顶部添加 badge 行
- 检查 CI 是否在 PR 和 push 上都触发

### P1: ARA CLI 稳定性测试 (dev-2)
- 对 13 个命令做端到端 smoke test（不要求网络）
- 确保 `--help` 输出所有命令
- 确保 `--version` 正确

### P1: `ara watch` 体验改进 (dev-1)
- 当前 watch 每秒刷新一次 dashboard，可能引起终端闪烁
- 优化为局部刷新（\033[A 上移光标）而不是全屏清空
- 减少不必要的 API 调用

---

## 任务分配

| 成员 | 任务 | 优先级 | 预计工时 |
|------|------|:------:|:--------:|
| **dev-1** | 🚀 PyPI 远程发布（需要用户 token）+ README badges 配置 | **P0** | 10m |
| **dev-1** | 🚀 `ara watch` 体验改进（局部刷新/减少闪烁） | **P1** | 20m |
| **dev-2** | 🚀 BLOAT 清理: 重构 history.py → chart.py 拆分 | **P0** | 20m |
| **dev-2** | 🚀 CLI 稳定性 smoke test + 测试覆盖完善 | **P1** | 15m |
| **mkt** | 🚀 CI 完整性 (badges + README 顶部 + CI 配置检查) | **P0** | 15m |

---

## 验收标准

- [ ] `python3 -m pytest tests/ -q --tb=no` → 242+ passed, 0 failed
- [ ] `ara/history.py` < 120 lines, `tests/test_history.py` < 150 lines
- [ ] `ara --help` 列出全部 13+ 个命令
- [ ] `ara --version` 输出正确版本号
- [ ] PyPI `dist/` 上传到远程 PyPI ✓ README 有 PyPI badge
- [ ] README 顶部有 CI badge / PyPI version badge / Python version badge
- [ ] `ara watch <repo>` 局部刷新不闪烁

---

## 风险登记

| 风险 | 影响 | 概率 | 应对 |
|------|:----:|:----:|------|
| PyPI token 不可用 | 🔴 高 | 🟡 中 | P1 延迟，不影响 Phase 3 其他任务 |
| 重构 history.py 导致测试失败 | 🟡 中 | 🟢 低 | 测试覆盖完美 (test_history.py 203 lines)，重构后运行全部测试验证 |
| Beta 在这一轮上线新功能 | 🟡 中 | 🟡 中 | 他们还在修基础设施，即便上线我们也领先 13 vs 5 个命令 |
| 仲裁者继续加权代码质量 | 🟡 中 | 🟡 中 | Phase 3 主题正是代码质量，正好应对 |

---

## 成功标准

1. **BLOAT 警告消除** — history.py + test_history.py 精简
2. **PyPI 远程发布** — `pip install ara` 可工作
3. **README badges** — CI/PyPI/Python 三件套
4. **242+ 测试全绿** — 不降反增
5. **Phase 3 启动** — 代码质量革命开局漂亮

---

*Α-Tech Inc. — Phase 2 正式收官。6 个新命令、242 个测试、142 commits。现在 Phase 3 开始 —— 代码质量、包发布、CI 完整性。Beta 还在修 node_modules 和 README 的时候，我们在做真正的产品化准备。差距只会越来越大。🚀*
