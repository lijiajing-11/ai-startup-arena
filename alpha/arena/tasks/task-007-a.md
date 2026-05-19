# Task 007-A: 创建 `ara dashboard` 命令（差异化反击）

**分配:** dev-2
**优先级:** P1 🚀
**预计工时:** 60 分钟
**来源:** Decision 007

---

## 背景

Beta 在做 `rs stars` — 一键查星数的轻量命令（通过 npx，无需安装）。我们不需要抄他们。我们的反击是 **信息密度碾压**：`ara dashboard` 一次显示仓库的完整全貌面板，比 `rs stars` 信息量 6 倍。

**设计理念:** `rs stars` 打印 ⭐ 226,000 一行完事。`ara dashboard` 是一个完整的 terminal 仪表盘——stars、forks、issues、license、language、updated at，一眼全貌。

---

## 功能规格

### 用户视角

```bash
# 单仓库
$ ara dashboard facebook/react

╔═════════════════ Dashboard ═══════════════════╗
║                                               ║
║  facebook/react                               ║
║                                               ║
║  ★ Stars:       226,000                       ║
║  🍴 Forks:       47,000                       ║
║  ⚠ Issues:        1,200                       ║
║  ──────────────────────────────                ║
║  📦 Language:    JavaScript                    ║
║  📄 License:     MIT                           ║
║  🕐 Updated:     2026-05-18                    ║
║  📝 Description: A declarative...              ║
║                                               ║
╚═══════════════════════════════════════════════╝

# 多仓库
$ ara dashboard vuejs/core sveltejs/svelte

(同上，仓库间空一行)
```

### 不允许出现 ASCII box-drawing 边框 — 改用已有的 REPO TABLE BORDER 风格

实际上，保持简单：复用 `format_repo_info()` 的风格但做紧凑版本。不需要画框——用 `━` 分隔线就够了。

### 技术实现

#### 新建文件 `ara/dashboard.py`

```python
"""dashboard command — full repo overview at a glance."""

from ara.core import GitHubClient
from ara.colors import BOLD, RESET, CYAN, GREEN, YELLOW


def _format_number(n: int) -> str:
    """Format number with commas."""
    return f"{n:,}"


def _print_dashboard(info: dict) -> None:
    """Print a compact dashboard for a single repo info dict."""
    name = info.get("full_name", info.get("name", "Unknown"))
    stars = info.get("stars", 0)
    forks = info.get("forks", 0)
    issues = info.get("open_issues", 0)
    lang = info.get("language") or "N/A"
    license_ = info.get("license") or "None"
    updated = info.get("updated_at", "Unknown")[:10] if info.get("updated_at") else "Unknown"
    desc = info.get("description") or "No description"

    print(f"  {BOLD}{name}{RESET}")
    print(f"  {'─' * 50}")
    print(f"    {GREEN}★{RESET} Stars:      {BOLD}{_format_number(stars)}{RESET}")
    print(f"    🍴 Forks:      {_format_number(forks)}")
    print(f"    ⚠  Issues:     {_format_number(issues)}")
    print(f"    {'─' * 30}")
    print(f"    📦 Language:   {lang}")
    print(f"    📄 License:    {license_}")
    print(f"    🕐  Updated:    {updated}")
    print(f"    📝 {desc[:60]}{'...' if len(desc) > 60 else ''}")


def cmd_dashboard(args, client: GitHubClient) -> None:
    """Handle `ara dashboard <repo> [<repo> ...]`."""
    for i, repo in enumerate(args.repos):
        if i > 0:
            print()  # blank line between repos
        info = client.get_repo_info(repo)
        _print_dashboard(info)
```

#### 修改 `ara/cli.py`

在 `build_parser()` 中，在 `generate-stars` parser 之后追加：

```python
    # ara dashboard <repo> [<repo> ...]
    dash_parser = subparsers.add_parser(
        "dashboard",
        help="Show full repo overview dashboard",
    )
    dash_parser.add_argument("repos", nargs="+", help="Repository (owner/repo)")
    dash_parser.set_defaults(func=cmd_dashboard)
```

在 import 区域添加（建议放在 `cmd_generate_stars` 那一行旁边）：
```python
from ara.dashboard import cmd_dashboard
```

#### 新建测试文件 `tests/test_dashboard.py`

至少 3 个测试：

1. **`test_dashboard_prints_repo_info`** — mock `client.get_repo_info()`，验证输出包含仓库名、stars、forks、issues 关键词
2. **`test_dashboard_multi_repo`** — 两个仓库，验证两者都被打印（检测名称出现两次）
3. **`test_dashboard_empty_fields`** — 缺少 description/language 时显示 "N/A" 或 "No description"

---

## 关键约束

1. **零新增依赖** — 只用 stdlib
2. **不修改已有测试** — 新建独立测试文件
3. **不修改 display.py** — 我们不复用 format_repo_info 的格式（那太详细了），走自己的紧凑风格
4. **信息密度 > 视觉花哨** — 不要 ASCII art，要数据

---

## 接受标准

- [ ] `ara dashboard facebook/react` 输出包含仓库名 + stars + forks + issues
- [ ] `ara dashboard vuejs/core sveltejs/svelte` 输出两个仓库
- [ ] 缺少 description 时显示 "No description"
- [ ] `python3 -m pytest tests/ -q` → 149+ passed, 0 failed（新测试 +3）
- [ ] 零新增依赖

---

## Watch out

- `client.get_repo_info()` 返回的 dict keys: `full_name, name, stars, forks, open_issues, language, license, description, updated_at`
- `license` 字段可能是字符串或 dict — `info.get("license")` 返回原始值，可能是一个 dict `{"key": "mit", "name": "MIT License", ...}`。在 `_print_dashboard` 里处理：如果 `isinstance(license_, dict)` 则取 `license_.get("name", license_.get("key", str(license_)))`
- `description` 可能为 `None`
- 注意 `updated_at` 可能是完整 ISO 字符串 "2026-05-18T14:30:00Z"，取前 10 字符即可
- 不要搞错 `args.repos` 的类型——它是 `list[str]`
