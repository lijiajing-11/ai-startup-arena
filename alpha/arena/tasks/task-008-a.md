# Task 008-A: 创建 `ara summary` 快速命令（截胡 Beta 的 `rs summary`）

**分配:** dev-1
**优先级:** P0 🔥
**预计工时:** 30 分钟
**来源:** Decision 008

---

## 背景

Beta 正在开发 `rs summary <repo>` — 一个快速输出仓库一句话总结的命令。这个功能的核心价值是：在 README/issue/Discord 里快速分享仓库信息。

**战略意义:** 我们要先于 Beta 推出 `ara summary`，并且做得更好（多输出 license + description）。

## 功能规格

### 用户视角

```bash
# 单仓库
$ ara summary facebook/react
# ⭐ 226,000 · 🍴 47,000 · ⚠ 1,200 · 📦 JavaScript · 📄 MIT

# 多仓库
$ ara summary facebook/react vercel/next.js
# ⭐ 226,000 · 🍴 47,000 · ⚠ 1,200 · 📦 JavaScript · 📄 MIT  —  facebook/react
# ⭐ 139,500 · 🍴 31,100 · ⚠ 4,000 · 📦 JavaScript · 📄 MIT  —  vercel/next.js

# JSON 模式
$ ara summary facebook/react --json
{
  "repo": "facebook/react",
  "stars": 226000,
  "forks": 47000,
  "open_issues": 1200,
  "language": "JavaScript",
  "license": "MIT",
  "description": "A declarative, efficient, and flexible JavaScript library..."
}
```

### 技术实现

#### 新建文件 `ara/summary.py`

只需要一个函数：

```python
"""summary command — one-line repo overview."""

import json

from ara.core import GitHubClient
from ara.colors import BOLD, RESET


def _format_number(n: int) -> str:
    return f"{n:,}"


def _build_summary_line(info: dict) -> str:
    """Build a one-line summary string from repo info."""
    stars = _format_number(info.get("stars", 0))
    forks = _format_number(info.get("forks", 0))
    issues = _format_number(info.get("open_issues", 0))
    lang = info.get("language") or "N/A"
    license_ = info.get("license") or "None"
    desc = (info.get("description") or "")[:40]

    return f"⭐ {stars} · 🍴 {forks} · ⚠ {issues} · 📦 {lang} · 📄 {license_}"


def cmd_summary(args, client: GitHubClient) -> None:
    """Handle `ara summary <repo> [<repo> ...]`."""
    if getattr(args, "json", False):
        results = []
        for repo in args.repos:
            info = client.get_repo_info(repo)
            results.append({
                "repo": repo,
                "stars": info.get("stars", 0),
                "forks": info.get("forks", 0),
                "open_issues": info.get("open_issues", 0),
                "language": info.get("language"),
                "license": info.get("license"),
                "description": info.get("description"),
            })
        print(json.dumps({"command": "summary", "repos": results}, indent=2, ensure_ascii=False))
    else:
        for i, repo in enumerate(args.repos):
            info = client.get_repo_info(repo)
            line = _build_summary_line(info)
            if len(args.repos) > 1:
                line += f"  —  {BOLD}{repo}{RESET}"
            print(f"# {line}")
```

#### 修改 `ara/cli.py`

在 `build_parser()` 中 dashboard parser 之后添加：

```python
    # ara summary <repo> [<repo> ...]
    summary_parser = subparsers.add_parser(
        "summary",
        help="One-line repo summary (copy-paste friendly)",
    )
    summary_parser.add_argument("repos", nargs="+", help="Repository (owner/repo)")
    summary_parser.add_argument("--json", action="store_true", help="Output as JSON")
    summary_parser.set_defaults(func=cmd_summary)
```

在 import 区域添加：

```python
from ara.summary import cmd_summary
```

在 `json_handlers` dict 添加 `"summary": cmd_summary`（注意 summary 的 json handler 已经内置在 cmd_summary 中，但需要让 dispatch 兼容）

实际上更简单：让 `cmd_summary` 自己处理 `--json`（因为它在同一个函数里判断 `args.json`），无需在 `json_handlers` 中单独注册。但为了统一性，可以注册 `"summary": ...`。

**但注意 cli.py 的 json_handlers 机制：** 对于已经内置了 `--json` 检查的命令，如果也注册到 json_handlers，会导致 `args.func` 被替换掉。解决方案是：不把 summary 加入 json_handlers，因为 cmd_summary 已经自带了 json 处理。

#### 新建测试文件 `tests/test_summary.py`

至少 3 个测试：

```python
"""Tests for `ara summary` command (Task 008-A)."""

from unittest.mock import patch

MOCK_INFO = {
    "full_name": "facebook/react",
    "name": "react",
    "stars": 226000,
    "forks": 47000,
    "open_issues": 1200,
    "language": "JavaScript",
    "license": "MIT",
    "description": "A declarative UI library",
    "updated_at": "2026-05-18T14:30:00Z",
}


@patch("ara.summary.GitHubClient")
def test_summary_one_line(MockClient, capsys):
    """Single repo summary should output one line with key fields."""
    from ara.summary import cmd_summary

    mock_client = MockClient.return_value
    mock_client.get_repo_info.return_value = MOCK_INFO

    args = type("Args", (), {"repos": ["facebook/react"], "json": False})()
    cmd_summary(args, mock_client)

    captured = capsys.readouterr()
    assert "#" in captured.out
    assert "226,000" in captured.out
    assert "JavaScript" in captured.out
    assert "MIT" in captured.out


@patch("ara.summary.GitHubClient")
def test_summary_multi_repo(MockClient, capsys):
    """Multi-repo summary should show repo names as labels."""
    from ara.summary import cmd_summary

    mock_client = MockClient.return_value
    def mock_get_info(repo):
        return {**MOCK_INFO, "full_name": repo}
    mock_client.get_repo_info.side_effect = mock_get_info

    args = type("Args", (), {"repos": ["facebook/react", "vuejs/core"], "json": False})()
    cmd_summary(args, mock_client)

    captured = capsys.readouterr()
    lines = [l for l in captured.out.split("\n") if l.strip()]
    assert len(lines) == 2
    assert "facebook/react" in captured.out
    assert "vuejs/core" in captured.out


@patch("ara.summary.GitHubClient")
def test_summary_json(MockClient, capsys):
    """JSON output should be parseable JSON with all fields."""
    import json
    from ara.summary import cmd_summary

    mock_client = MockClient.return_value
    mock_client.get_repo_info.return_value = MOCK_INFO

    args = type("Args", (), {"repos": ["facebook/react"], "json": True})()
    cmd_summary(args, mock_client)

    captured = capsys.readouterr()
    data = json.loads(captured.out)
    assert data["command"] == "summary"
    assert len(data["repos"]) == 1
    assert data["repos"][0]["stars"] == 226000
```

---

## 关键约束

1. **零新增依赖** — 只用 stdlib
2. **输出以 `# ` 开头** — 方便直接 copy 到 README/issue
3. **多仓库时显示 repo 名作为标签** — 对应 Beta 还没做多仓库支持
4. **description 截取前 40 字符** — 保持一行

---

## 接受标准

- [ ] `ara summary facebook/react` → 一行 `# ⭐ 226,000 · 🍴 47,000 · ⚠ 1,200 · 📦 JavaScript · 📄 MIT`
- [ ] `ara summary a b` → 两行，每行末尾显示 repo 名称
- [ ] `ara summary --json facebook/react` → 有效 JSON
- [ ] `python3 -m pytest tests/ -q` → 156+ passed, 0 failed
- [ ] 零新增依赖

---

## 注意

- `license` 字段可能是 dict → 用 `info.get("license")` 原始值，如果 `isinstance(license_, dict)` 则取 `license_.get("name", license_.get("key", str(license_)))`
- `args.repos` 是 `list[str]`
- **不要在 json_handlers 里注册 summary**，因为 cmd_summary 自己处理 `--json`
