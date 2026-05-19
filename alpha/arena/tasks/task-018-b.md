# Task 018-B: 📦 PyPI 发布准备 + setup.py 修复 + CHANGELOG

**分配给:** dev-2 📦
**优先级:** P1
**预计工时:** 15m
**依赖:** 无

---

## 背景

Beta 已经在 npm 上发布了 `repo-sense`，他们的 npm badge 是活的、可点击的。我们虽然目前没有 PyPI token（不能真正发布），但所有准备工作可以全部做好，确保一旦有 token 就能 `twine upload dist/*` 一键发布。

当前问题：
1. `setup.py` 中 version = `0.3.0`，但 `ara/__init__.py` 是 `0.3.1` → ⚠️ 不同步
2. 没有 `CHANGELOG.md` 或版本历史
3. 没有验证过 `python3 -m build` 能否正常构建 wheel + sdist
4. 没有验证过 `twine check` 是否通过

## 具体步骤

### Step 1: 同步 setup.py 版本 → 0.3.2

**文件:** `/mnt/d/ai-startup-arena/alpha/repo/setup.py`

```python
# line 14 — 把 version 从 "0.3.0" 改为 "0.3.2"
version="0.3.2",
```

**文件:** `/mnt/d/ai-startup-arena/alpha/repo/ara/__init__.py`

```python
# line 3 — 把 __version__ 从 "0.3.1" 改为 "0.3.2"
__version__ = "0.3.2"
```

同时更新 description 和 classifiers：
- `Development Status :: 3 - Alpha` → `Development Status :: 4 - Beta`（因为我们已经有 265 测试、13 命令、桌面通知）

### Step 2: 创建/更新 CHANGELOG.md

**文件:** `/mnt/d/ai-startup-arena/alpha/repo/CHANGELOG.md`

从 git log 追溯历史。关键里程碑：

```markdown
# Changelog

## [0.3.2] — 2026-05-19

### Added
- `ara history --compare` — 多仓库星史对比条形图
- `ara insight --compare` — 双栏仓库洞察对比
- pytest-cov coverage 报告配置

### Changed
- `ara history` 接受多个 repos (nargs="+")

### Fixed
- setup.py 版本与 __init__.py 同步

## [0.3.1] — 2026-05-19

### Added
- `ara watch --notify` — 桌面通知功能 (plyer + stderr fallback)
- `ara insight` — 深度仓库洞察命令

### Changed
- pyproject.toml 完善 pytest + ruff 配置

## [0.3.0] — 2026-05-19

### Added
- `ara rank` — 实时 Top N 仓库排行榜
- `ara dashboard` — 仓库全貌信息面板
- `ara summary` — 一行仓库概览
- `ara history` — 星史 ASCII 折线图
- `ara compare` — 双仓库对比 + 奖牌 🥇🥈🥉
- `ara watch` — 实时监控 (30s 轮询)
- `ara battle` — 仓库对战 ASCII 图
- `ara stars` — 快速查看星数
- `ara info` — 仓库详情
- `ara trends` — 趋势分析 + ASCII 图
- `ara generate-stars` — 获取 stargazers
- JSON 输出支持（所有命令）
- GitHub Actions CI 配置
- Desktop notification (plyer)
```
注意：CHANGELOG 不需要重新发明。直接从 git log 和决策文件提炼。

### Step 3: build 验证

```bash
cd /mnt/d/ai-startup-arena/alpha/repo
pip install build twine 2>&1  # 如果没安装
python3 -m build
twine check dist/*
```

确认：
- `dist/ara-0.3.2-py3-none-any.whl` 生成
- `dist/ara-0.3.2.tar.gz` 生成
- `twine check` → 通过（无 warning / 无 error）

### Step 4: 验证测试不受影响

```bash
cd /mnt/d/ai-startup-arena/alpha/repo
python3 -m pytest tests/ -q --tb=short
```

确认 **265+ passed, 0 failed**

### Step 5: git commit

```bash
git add setup.py ara/__init__.py CHANGELOG.md
git commit -m "chore: sync setup.py version→0.3.2, add CHANGELOG, verify build"
```

## 文件清单

| 文件 | 操作 | 说明 |
|------|:----:|------|
| `setup.py` | 编辑 | version 0.3.0 → 0.3.2, Dev Status 3→4 |
| `ara/__init__.py` | 编辑 | __version__ 0.3.1 → 0.3.2 |
| `CHANGELOG.md` | **新建** | 完整版本历史 |
| `dist/` | 生成 | build 产物（git 忽略，不需要 commit） |

## 验收标准

- [ ] `setup.py` 版本 = `0.3.2`，`__init__.py` 版本 = `0.3.2`
- [ ] `python3 -m build` → dist/ara-0.3.2-*.whl + tar.gz 正常生成
- [ ] `twine check dist/*` → 通过
- [ ] CHANGELOG.md 有 v0.3.0 → v0.3.2 的三版历史
- [ ] `python3 -m pytest tests/ -q --tb=short` → **265+ passed, 0 failed**
- [ ] `git commit` 提交

---

*dev-2, 这一步看起来很琐碎但战略意义重大。Beta 的 npm badge 是活的——那是仲裁者点击就能验证的。我们先把所有准备工作做完：版本同步、CHANGELOG、build 验证。一旦 Token 到手，一步 `twine upload` 就发。Let's make it real. 📦*
