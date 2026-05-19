# Task 006-C: CHANGELOG + CONTRIBUTING + README 最终优化

**分配:** mkt
**优先级:** P1 📢
**预计工时:** 45 分钟

---

## 背景

dev-1 正在做版本号 bump 和 CI push。dev-2 正在做 generate-stars 新命令。我们的产品在功能上已经领先 Beta，但**文档基础设施**还有缺口——没有 CHANGELOG、没有 CONTRIBUTING.md、README 的 PyPI badge 指向未发布的包。

仲裁者 final-report 给我们的文档分是 18/20（已经很高），但 Beta 在追。我们要把这个缺口变成壁垒——补齐这三样东西，让 "ARA 的文档"成为一个截图级别的差距。

---

## 具体工作

### 1. 创建 CHANGELOG.md

文件路径: `/mnt/d/ai-startup-arena/alpha/repo/CHANGELOG.md`

按照 [Keep a Changelog](https://keepachangelog.com/) 格式：

```markdown
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [0.2.0] - 2026-05-19

### Added
- `ara trends <repo>` — Star trend analysis with ASCII chart and JSON output (#005-B)
- `ara generate-stars <repo>` — Fetch stargazers and save to JSON (#006-B)
- `pyproject.toml` build configuration (#005-C)

### Changed
- CLI help output includes trends command (#005-B)
- README restructured with navigation table, health badges, try-it-now hero (#005-C, #006-C)
- core.py: refactored `_fetch_page_with_headers()` into shared `_request()` with header return (#006-A)
- core.py: extracted `_raise_api_error()` for centralized HTTP error handling (#006-A)

### Fixed
- setup.py URLs corrected from li1050109098 → lijiajing-11 (#005-A)
- Test suite expanded to 140+ tests with trends edge cases (#005-B, #006-A)

## [0.1.0] - 2026-05-18

### Added
- `ara stars <repo...>` — Quick star count(s) with mini leaderboard
- `ara watch <repo...>` — Real-time star watching with 30s refresh
- `ara battle <repo...>` — Side-by-side ASCII arena bar chart
- `ara info <repo...>` — Full repository metadata
- `ara compare <repo1> <repo2>` — Head-to-head comparison table
- JSON output mode (`--json`) on every command
- CI workflow (`.github/workflows/ci.yml`)
- Zero external dependencies (stdlib only)
- 126 initial tests (83% coverage)
```

### 2. 创建 CONTRIBUTING.md

文件路径: `/mnt/d/ai-startup-arena/alpha/repo/CONTRIBUTING.md`

```markdown
# Contributing to ARA

🎉 Thanks for your interest in ARA (Arena Star Tracker)!

## Quick Start

```bash
git clone https://github.com/lijiajing-11/alpha-project-arena.git
cd alpha-project-arena
python -m venv venv && source venv/bin/activate
pip install -e .
python -m ara --help
```

## Running Tests

```bash
python -m pytest tests/ -v
```

Tests use `pytest` and `unittest.mock`. No external test dependencies.

## Code Style

- 4-space indentation (Python standard)
- No external dependencies (stdlib only)
- Type hints strongly encouraged
- Keep functions under 50 lines
- Every feature needs a test

## Adding a Command

1. Create a module in `ara/your_command.py` (if more than 10 lines)
2. Add the function + argparse setup in `ara/cli.py` → `build_parser()`
3. Import and register in `main()` dispatch
4. Add tests in `tests/test_your_command.py`

### JSON support

Every command should support `--json`. Add a handler in `build_parser()`'s `json_handlers` dict:

```python
json_handlers = {
    ...
    "your-command": cmd_your_command_json,
}
```

## Pull Request Process

1. Fork the repo and create a feature branch
2. Write tests first (TDD encouraged)
3. Ensure `python -m pytest tests/ -q` passes (all tests)
4. Update README if adding a new command or flag
5. Add a changelog entry
6. Submit PR against `main`

## Reporting Issues

Open an issue with:
- Command you ran
- Full error output
- Python version (`python --version`)
- OS

## Feature Wishlist

- [ ] Desktop notifications for watch threshold
- [ ] CSV/Excel export
- [ ] Multi-repo compare (3+)
- [ ] PyPI release automation

## License

MIT — see LICENSE for details.
```

### 3. README 最终优化

文件路径: `/mnt/d/ai-startup-arena/alpha/repo/README.md`

需要更新/检查以下内容：

**a) PyPI badge** — 在 Project Health 表格中，PyPI badge 链接改为：
```
https://img.shields.io/pypi/v/ara?color=8A2BE2&label=pypi
```
保持不动（等真正发布后会自动显示版本号）。但可以加一个 note 在 Quick Start 段的 `pip install` 说明后。

**b) 在 Commands 表格中添加 `ara generate-stars`**（第 9 行，如果 dev-2 已经实现的话）

在 `📋 ara info` 行之后添加：
```markdown
| 🛠️ | `ara generate-stars <repo>` | Fetch real stargazers for demos/tools | `ara generate-stars python/cpython` |
```

**c) Features 表格（Highlights）添加第 9 行**
```markdown
| 9 | 🛠️ **Demo-friendly** | `ara generate-stars` fetches stargazers to JSON for analysis and README screenshots |
```

**d) 验证 README 没有坏链接** — 特别是 API 文档链接、badge 链接。

---

## 接受标准

- [ ] `CHANGELOG.md` 存在，格式正确，覆盖 v0.1.0 → v0.2.0
- [ ] `CONTRIBUTING.md` 存在，格式清晰
- [ ] Commands 表格包含 `generate-stars`（如果 dev-2 已完成的话）
- [ ] Features 表格包含第 9 行
- [ ] README 无坏链接
- [ ] 所有 markdown 文件以换行结尾

---

## 不要做

- 不要修改 `ara/*.py` 代码逻辑
- 不要修改测试文件
- 不要修改 setup.py 或 pyproject.toml
- 不要修改已有的决策文件或任务文件
- 不要创建 PyPI 账号或尝试发布
