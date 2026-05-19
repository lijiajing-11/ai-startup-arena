# Task 016-A: 🔥 `ara history --compare` 多仓库折线图

**分配给:** dev-1
**优先级:** P0 🔥
**来源:** Decision 016

---

## 任务描述

当前 `ara history <repo>` 只展示单个仓库的星史折线图。增加 `--compare` 选项实现多仓库对比折线图。

**目标行为：**
- `ara history --compare facebook/react vuejs/core` → 两个仓库的叠加快照折线图
- `ara history --compare --json facebook/react vuejs/core` → JSON 输出
- `ara history --compare --since 2024 facebook/react vuejs/core` → 仅 2024 后的数据
- 每种仓库用不同 ANSI 颜色，同一个时间轴

---

## 技术步骤

### Step 1: 阅读当前 history 实现

```bash
cd /mnt/d/ai-startup-arena/alpha/repo
head -100 ara/history.py
```

理解 `fetch_star_history()`, `cmd_history()`, `_render_history_chart()` 的签名和数据结构。

### Step 2: 添加 `--compare` 和 `--since` argparse 参数

```bash
cd /mnt/d/ai-startup-arena/alpha/repo
grep -n "history_parser" ara/cli.py
```

在 `history_parser` 中增加：
```python
history_parser.add_argument(
    "--compare", action="store_true",
    help="Compare star history across multiple repos",
)
history_parser.add_argument(
    "--since", type=str, default=None,
    help="Only show data since this date (YYYY-MM-DD)",
)
```

### Step 3: 实现 `cmd_history_compare`

在 `ara/history.py` 中新增函数。

**核心逻辑：**

```python
COLORS = ['\033[92m', '\033[94m', '\033[93m', '\033[95m', '\033[96m']  # green, blue, yellow, magenta, cyan
RESET = '\033[0m'

def cmd_history_compare(
    repos: list[str],
    client: GitHubClient,
    since: str | None = None,
    as_json: bool = False,
) -> None:
    """Render multi-repo star history comparison."""
    # 1. Fetch all histories
    all_histories = {}
    max_stars = 0
    for repo in repos:
        data = fetch_star_history(repo, client, since=since)
        all_histories[repo] = data
        max_stars = max(max_stars, max(s for _, s in data) if data else 0)

    if as_json:
        import json
        print(json.dumps(all_histories, indent=2))
        return

    # 2. Render header
    print(f"  ╔══════════════════════════════════════════╗")
    print(f"  ║     ⭐ Star History Comparison (all-time) ║")
    print(f"  ╚══════════════════════════════════════════╝")
    print()

    # 3. For each repo, render a horizontal bar + star count
    #    Bar width proportional to max_stars among all repos
    BAR_WIDTH = 50
    for i, repo in enumerate(repos):
        data = all_histories.get(repo, [])
        current_stars = data[-1][1] if data else 0
        ratio = current_stars / max_stars if max_stars > 0 else 0
        filled = int(ratio * BAR_WIDTH)
        bar = "█" * filled + "░" * (BAR_WIDTH - filled)
        color = COLORS[i % len(COLORS)]
        print(f"  {color}{repo:<25}{RESET} {color}{bar}{RESET} {current_stars:>7,} ★")

    # 4. Show timeline info
    print()
    dates = []
    for data in all_histories.values():
        if data:
            dates.append(data[0][0])  # first date
            dates.append(data[-1][0])  # last date
    if dates:
        print(f"  📅 Timeline: {min(dates).strftime('%Y-%m-%d')} — {max(dates).strftime('%Y-%m-%d')}")
```

### Step 4: 在 cli.py 中绑定

找到 `cmd_history` 的调度点，在 `_cmd_history_wrapper` 或类似函数中增加分支：

```python
def _cmd_history_wrapper(args: argparse.Namespace, client: GitHubClient) -> None:
    if getattr(args, "compare", False):
        cmd_history_compare(
            args.repos,
            client=client,
            since=getattr(args, "since", None),
            as_json=getattr(args, "json", False),
        )
    else:
        cmd_history(args.repo, client=client, as_json=getattr(args, "json", False))
```

注意 `history` 命令的参数名是 `repo` (单数) vs `compare` 需要 `repos`。可能需要调整 argparse 配置。

**关键设计决策：** 当 `--compare` 使用时，把所有 `args.repos` 作为列表传入。当不使用时，只取第一个 repo。

### Step 5: 添加测试

在 `tests/test_history.py` 中增加：

```python
def test_history_compare_basic():
    """--compare should render multiple repos."""
    ...

def test_history_compare_json():
    """--compare --json should output valid JSON."""
    ...

def test_history_compare_since_filter():
    """--since should filter data points."""
    ...
```

### Step 6: 验证

```bash
cd /mnt/d/ai-startup-arena/alpha/repo
python3 -m pytest tests/ -q --tb=no
# 应该 263+ passed, 0 failed
```

---

## 文件清单

| 文件 | 操作 | 说明 |
|------|:----:|------|
| `ara/history.py` | 编辑 | 新增 `cmd_history_compare()` 函数 |
| `ara/cli.py` | 编辑 | 添加 `--compare`/`--since` 参数 + 调度分支 |
| `tests/test_history.py` | 编辑 | 新增 compare 模式测试 (3+ tests) |

## 验收标准

- [ ] `ara history --compare facebook/react vuejs/core` → 彩色双折线图
- [ ] `ara history --compare --json facebook/react vuejs/core` → JSON 输出
- [ ] `ara history --compare --since 2024 facebook/react vuejs/core` → 时间过滤
- [ ] `ara history facebook/react` (无 flag) → 行为不变，只查单个
- [ ] `python3 -m pytest tests/ -q --tb=no` → **260+ passed, 0 failed**
- [ ] git commit 含清晰的消息
