# Task 006-B: 新建 `generate-stars` 展示工具命令

**分配:** dev-2
**优先级:** P1 ✨
**预计工时:** 60 分钟

---

## 背景

我们刚推出 `ara trends`，但它需要仓库有实际的 star 历史数据才能展示漂亮的 ASCII 图表。问题是——用户跑 `ara trends python/cpython` 时，如果仓库超过 300 stars（pages=3），API 只会返回最近的 300 条；如果仓库没有 stars（新项目），输出是空的。

`generate-stars` 是一个**展示工具**，不是为了生产用途——它是 README 的"wow demo"，让用户立刻看到 trends 功能的效果。

**设计思路**: 获取一个真实仓库的 stargazers 列表，按时间戳排序，输出到 JSON 文件。用户可以用这个文件 + trends 的 JSON 模式来分析。更酷的是——我们需要创建一个**模拟趋势图**的 demo 输出，可以直接截图放进 README。

---

## 功能规格

### 用户视角

```bash
# 获取真实仓库的 stargazers 数据
$ ara generate-stars python/cpython

Fetching stargazers for python/cpython...
Page 1/3: 100 stargazers (via Link header)
Page 2/3: 100 stargazers
Page 3/3: 100 stargazers
✔ Saved to stargazers_python_cpython.json (300 entries)

Quick stats for python/cpython stargazers:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total stargazers fetched:  300
Time span:                 May 15 – May 18 (3.1 days)
Peak hour:                 May 18 14:00 – 15:00 (27 stars)
Highest single-day:        May 17 (98 stars)
```

### 技术实现

#### 新建文件 `ara/generate_stars.py`

这个命令的核心逻辑很轻——它主要复用 `trends.py` 中的 `get_star_history()` 和 `compute_trend_buckets()`。

```python
"""generate-stars command — fetch stargazers and save to file."""

import json
import os

from ara.core import GitHubClient
from ara.trends import get_star_history, compute_trend_buckets
from ara.colors import BOLD, GREEN, RESET


def _safe_filename(repo: str) -> str:
    """Convert owner/repo to a safe filename."""
    return f"stargazers_{repo.replace('/', '_')}.json"


def cmd_generate_stars(args, client: GitHubClient) -> str:
    """Handle `ara generate-stars <repo>`.
    
    Args:
        args.repo: str — repository name (owner/repo)
        args.pages: int (default 3) — max pages to fetch
        args.output: str (optional) — output file path
    """
    repo = args.repo
    max_pages = getattr(args, "pages", 3)
    
    print(f"Fetching stargazers for {BOLD}{repo}{RESET}...")
    
    events = get_star_history(client, repo, pages=max_pages)
    print(f"✔ Fetched {len(events)} stargazer events")
    
    # Save to file
    output_path = getattr(args, "output", None) or _safe_filename(repo)
    
    # Format for output: list of {timestamp, repo, iso_date}
    output_data = []
    for e in events:
        from datetime import datetime, timezone
        iso = datetime.fromtimestamp(e.timestamp, tz=timezone.utc).isoformat()
        output_data.append({
            "timestamp": e.timestamp,
            "iso_date": iso,
            "repo": e.repo,
        })
    
    with open(output_path, "w") as f:
        json.dump(output_data, f, indent=2, ensure_ascii=False)
    
    print(f"✔ Saved to {BOLD}{output_path}{RESET} ({len(events)} entries)")
    
    # Show quick stats using trends bucket analysis
    buckets = compute_trend_buckets(events, hours=72, interval_minutes=60)
    if buckets:
        total = sum(b.count for b in buckets)
        best = max(buckets, key=lambda b: b.count)
        
        print()
        print(f"Quick stats for {BOLD}{repo}{RESET} stargazers:")
        print("━" * 45)
        print(f"Total stargazers fetched:  {len(events)}")
        print(f"Time span:                 {buckets[0].label} – {buckets[-1].label}")
        print(f"Peak hour:                 {best.label} ({best.count} stars)")
        
        # Compute daily totals
        from collections import defaultdict
        daily = defaultdict(int)
        for e in events:
            from datetime import datetime, timezone
            day = datetime.fromtimestamp(e.timestamp, tz=timezone.utc).strftime("%b %d")
            daily[day] += 1
        if daily:
            best_day = max(daily, key=daily.get)
            print(f"Highest single-day:        {best_day} ({daily[best_day]} stars)")
    
    return output_path
```

#### 修改 `ara/cli.py`

在 `build_parser()` 函数中，在 trends parser 之后添加:

```python
# ara generate-stars <repo>
gs_parser = subparsers.add_parser(
    "generate-stars",
    help="Fetch stargazers and save to JSON file (demo tool)",
)
gs_parser.add_argument("repo", help="Repository (owner/repo)")
gs_parser.add_argument(
    "--pages", type=int, default=3,
    help="Max pages to fetch (default: 3, each page = 100 stargazers)",
)
gs_parser.add_argument(
    "--output", type=str, default=None,
    help="Output file path (default: stargazers_<repo>.json)",
)
gs_parser.set_defaults(func=cmd_generate_stars)
```

在 `main()` 函数上方的 import 区域添加:
```python
from ara.generate_stars import cmd_generate_stars
```

#### 新建测试文件 `tests/test_generate_stars.py`

至少 4 个测试:

1. `test_cmd_generate_stars_saves_file` — mock get_star_history，验证文件被创建且包含正确数据
2. `test_cmd_generate_stars_empty_repo` — 空 stargazers 时保存空数组，不崩溃
3. `test_safe_filename` — 验证 `owner/repo` → `stargazers_owner_repo.json`
4. `test_cmd_generate_stars_shows_stats` — 验证输出中包含 stats 行

---

## 关键约束

1. **零新增依赖** — 只用 stdlib
2. **复用 trends.py** — `get_star_history()` 和 `compute_trend_buckets()` 直接 import
3. **不修改已有测试** — 新建独立测试文件
4. **文件写入在当前目录** — 不硬编码路径

---

## 接受标准

- [ ] `ara generate-stars python/cpython` 成功输出并保存文件
- [ ] 保存的 JSON 文件可被 `python3 -m json.tool` 验证
- [ ] 输出显示 quick stats（总数、时间跨度、peak hour）
- [ ] 空仓库时显示友好提示
- [ ] `python3 -m pytest tests/ -q` → 144+ passed, 0 failed
- [ ] 零新增依赖

---

## Watch out

- `get_star_history` 默认 pages=3，最多 300 条 stargazers。不要设置太大 pages，不然 GitHub API 限流
- 输出文件名不要包含斜杠——用 `_` 替换 `/`
- 不要在这个命令里修改原始仓库数据——只读操作
- 确保生成的文件不会被 gitignore 忽略（如果仓库根目录有 .gitignore 检查 `*.json` 规则）
