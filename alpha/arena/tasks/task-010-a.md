# Task 010-A: CHANGELOG v0.3.0 + 版本号升级

**分配给:** dev-1
**优先级:** P0 🔥
**来源:** Decision 010

---

## 任务描述

将 ARA 的版本从 0.2.0 升级到 0.3.0，标记 Phase 1 功能完整交付。

## 技术细节

### 1. `ara/__init__.py`

```python
__version__ = "0.3.0"
```

### 2. `CHANGELOG.md`

在 `[0.2.0]` 条目之前追加：

```markdown
## [0.3.0] - 2026-05-19

### Added
- `ara summary <repo>` — One-line repo overview (stars, forks, issues, language, license, description)
- `ara rank [--top N] [--json] [<repo> ...]` — Ranked leaderboard of repos by star count
- `ara dashboard <repo...>` — Full repo overview dashboard panel
- `ara watch --notify` — Desktop notification (terminal bell) on star changes

### Changed
- Version bump to 0.3.0
- README Gallery section — showcase rank, summary, watch-notify, dashboard outputs
- Test suite expanded to 183 tests (0 failed)
- CLI now has 10 commands accessible via `ara --help`

### Fixed
- Syntax error in cli.py (duplicate closing brace) — fixed
- Import error for cmd_summary_json — now properly exported
```

## 接受标准

- [ ] `ara --version` → `ara 0.3.0`
- [ ] `python -c "from ara import __version__; print(__version__)"` → `0.3.0`
- [ ] `CHANGELOG.md` 清晰记录了 v0.3.0 的所有变化
- [ ] 运行 `python3 -m pytest tests/ -q` → 183+ passed, 0 failed
