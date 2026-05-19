# Report 015: 差异化冲刺 — ara notify 桌面通知 + 基础设施加固

**发起人:** Alex (CEO, Α-Tech Inc.)
**日期:** 2026-05-19
**阶段:** Phase 3 — 功能差异化 (第 1 轮)
**状态:** 🟢 248 passed, 0 failed — 全绿！

---

## 本轮决策概要

**Decision 015** — 功能差异化冲刺：ara notify 桌面通知 + 基础设施加固

1. **🚀 P0: `ara watch --notify` 桌面通知** (dev-1) — 星数变化时发桌面通知
2. **📦 P0: pyproject.toml 完善** (dev-1) — pytest + ruff 配置标准化
3. **🧪 P2: Watch 测试覆盖增强** (dev-2) — notify + edge cases 测试
4. **📝 P1: README v14** (mkt) — notify 文档 + 功能矩阵 + badges

---

## Task 014 完成情况

| 任务 | 成员 | 状态 | 详情 |
|------|:----:|:----:|------|
| 修复 `format_multi_compare_table` | dev-1 | ✅ | 7 tests PASS，compare 恢复正常 |
| PyPI 发布尝试 | dev-1 | ⏳ **确认阻塞** | 无 `.pypirc`，无 API token → 远程发布不可行 |
| `ara insight` 输出增强 | dev-2 | ✅ | 🚀🔥📊🐢 速度标签 + 📅 年龄标签 + Topics 增强 |
| README v13 | mkt | ✅ | 去重 Gallery、test/ruff badges、arena install 块 |
| 全测试验证 | dev-1/2 | ✅ | **248 passed, 0 failed** 🎉 |

---

## 当前项目状态

### 测试状态

```bash
$ python3 -m pytest tests/ -q --tb=no
248 passed in 13.30s
✅ 全绿 — 零失败！
```

### 功能完整度 (13 命令)

| 命令 | 状态 | 备注 |
|------|:----:|------|
| `ara stars` | ✅ | 单/多星数，--json |
| `ara watch` | ✅ | 局部刷新优化完成，**本轮新增 --notify** |
| `ara battle` | ✅ | ASCII arena 对战 |
| `ara info` | ✅ | 多维仓库详情 |
| `ara compare` (2+ repos) | ✅ | **修复完成** — 奖牌 🥇🥈🥉 + Winner 声明 |
| `ara trends` | ✅ | 趋势分析 + ASCII 图 |
| `ara generate-stars` | ✅ | 获取 stargazers |
| `ara dashboard` | ✅ | 仓库全貌面板 |
| `ara summary` | ✅ | 一行概览 |
| `ara rank` | ✅ 🏆 | Top N 实时排行榜 |
| `ara insight` | ✅ 🚀 | **增强完成** — 速度标签 + 年龄标签 + Topics |
| `ara history` | ✅ 🏆 | 星史 ASCII 折线图 (BLOAT 已清理) |

### PyPI 发布确认

**结论: 🔴 阻塞 — 用户需手动提供 PyPI API token**

尝试结果：
```bash
$ python3 -m twine upload dist/* --repository-url https://test.pypi.org/legacy/
ERROR    NonInteractive: Credential not found for API token.
```

原因：
- 无 `~/.pypirc` 文件
- 无 `TWINE_USERNAME` / `TWINE_PASSWORD` 环境变量
- 无 `PYPI_TOKEN` 环境变量

**解决方案（需用户操作）:**
1. 在 https://pypi.org/manage/account/token/ 创建 API token
2. 执行 `python3 -m twine upload dist/* -u __token__ -p pypi-xxxxx`
3. 或写入 `~/.pypirc`:
   ```
   [pypi]
   username = __token__
   password = pypi-xxxxx
   ```

**替代方案:** 即使 PyPI 不可用，用户仍可通过 `pip install -e .` 本地安装。

### 版本 & 基础设施

| 组件 | 当前 |
|------|:----:|
| `ara.__version__` | **0.3.0** |
| CHANGELOG.md | ✅ v0.3.0 |
| README | ✅ v13 (atest/Ruff badges, dedup Gallery) |
| PyPI 构建 | ✅ dist/ 已生成 |
| 测试 | **248 passed, 0 failed** ✅ |
| Commits | **148** |
| CI GitHub Actions | ✅ 配置完成 |

---

## 团队状态

| 成员 | 当前任务 | 状态 |
|------|----------|:----:|
| **Alex** (CEO) | Decision 015 发布 + 局势分析 | 🟢 完成 |
| **dev-1** 🚀 | Task 015-A: 🚀 watch --notify 桌面通知 | ⏳ 待开工 |
| **dev-1** 🚀 | Task 015-B: 📦 pyproject.toml 完善 | ⏳ 待开工 |
| **dev-2** 🚀 | Task 015-C: 🧪 Watch 测试增强 | ⏳ 待开工 |
| **mkt** 🚀 | README v14 — notify + 功能矩阵 | ⏳ 待开工 |

---

## 竞争对手动态

### Beta 最新状态 (Decision 009, ~10:45)

| 指标 | Α-Tech (我们) | β-Labs (对手) | 差距 |
|------|:------------:|:-------------:|:----:|
| Commits | **153** | **~130** | **+23 ✅** |
| 测试 | **248 passed ✅** | **79/81 (2 failed) ⚠️** | **3.1x 🚀** |
| 功能命令 | **13** | **7~8** | **~1.7x ✅** |
| 仲裁评分 | **54** | **59** | **-5 ⚠️** (落后但差距缩小) |

### Beta 最新动作

- ✅ `rs battle 3+` 三方混战上线（+399 lines in 3516e54）
- ❌ **2 个测试失败**：mock 问题 + cli-table3 API 使用错误
- ⏳ 正在修 battle 3+ 的测试 + 完善 history 测试覆盖
- ⏳ 无桌面通知、无包发布能力

**判断:** Beta 的 battle 3+ 功能上线了但测试红。我们有窗口期做桌面通知这个 Beta 绝对没有的功能。通知功能定位于 `watch` 命令的可选增强，不影响现有行为，仲裁者大概率会加分。

---

## 本轮冲刺目标

- [ ] 🚀 `ara watch facebook/react --notify` → 星数变化时桌面通知
- [ ] ✅ `python3 -m pytest tests/ -q --tb=no` → **248+ passed, 0 failed**
- [ ] 📦 pyproject.toml 完善 (pytest + ruff 配置)
- [ ] 🧪 Watch 测试覆盖 — notify + edge cases
- [ ] 📝 README v14 — notify 文档 + 功能矩阵 + badges 同步
- [ ] 🔄 git 至少 3 commits

---

## 评估与下一步

**Phase 3 成就解锁:**
| 成就 | 解锁于 | 状态 |
|------|:------:|:----:|
| BLOAT 清理 | Task 013 | ✅ |
| Watch 局部刷新 | Task 013 | ✅ |
| CI Badges + CHANGELOG | Task 013 | ✅ |
| 7 个失败测试修复 | Task 014 | ✅ |
| **248 全绿** | **Task 014** | ✅ 🏆 |
| Insight 输出增强 | Task 014 | ✅ |
| README v13 | Task 014 | ✅ |
| **Notify 桌面通知** | Task 015 | ⏳ **进行中** |
| PyPI 远程发布 | — | ⏳ 阻塞待 token |

**下轮展望 (Phase 4 候选):**
- `ara history --compare` 多仓库对比折线图
- `ara browse` 交互式 TUI 浏览
- 性能优化（并行 fetch 多仓库）
- CI 中集成 Ruff linting

---

*Α-Tech Inc. — 248 全绿不是终点，是起点。Beta 在修测试，我们在做桌面通知。差异化就是我们的王炸。等 notify 上线那刻，仲裁者会看到一个完整的 watch 体验。🚀*
