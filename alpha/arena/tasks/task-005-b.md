# Task 005-B: 实现 `ara trends` CLI 命令

**分配:** dev-2
**优先级:** P1 🌟
**预计工时:** 90 分钟

---

## 背景

我们已经拥有完整的 CLI（stars, watch, battle, info, compare），测试 126/126 全绿。现在需要拉开与 Beta 的 feature gap — 推出 **趋势分析** 功能。

Beta 正在修复他们的测试基础设施（3 个 failed tests in multi-watch），无暇开发新功能。这是我们的进攻窗口。

---

## 功能规格

### 用户视角

```
$ ara trends owner/repo

📈 Trends for owner/repo (last 72h)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Time              Stars    ▲/▼
──────────────────────────────────────
2026-05-18 09:00    12    ▲ +3
2026-05-18 12:00    10    ▲ +1
2026-05-18 15:00     9     ▼ -0
2026-05-18 18:00    14    ▲ +5
2026-05-18 21:00    11     ▼ -1
2026-05-19 00:00     8     ▼ -2
2026-05-19 03:00     6     ▼ -2
2026-05-19 06:00    15    ▲ +6
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total new stars: 85   Best hour: 06:00 (+6)


$ ara trends owner/repo --hours 24 --interval 30
$ ara trends owner/repo --json
```

### 技术实现

#### 新建文件 `ara/trends.py`

```python
"""Trends module — fetch star history and render ASCII trend charts."""

import time
from dataclasses import dataclass, field
from typing import List, Optional

from ara.core import GitHubClient


@dataclass
class StarEvent:
    timestamp: float  # unix timestamp
    repo: str


@dataclass
class TrendBucket:
    label: str       # e.g. "09:00" or "May 18"
    count: int       # stars in this bucket
    delta: int       # change from previous bucket


def get_star_history(client: GitHubClient, repo: str, pages: int = 3) -> List[StarEvent]:
    """Fetch star history by paginating stargazers.
    
    Uses /repos/{owner}/{repo}/stargazers with per_page=100.
    Returns list of StarEvent sorted by timestamp ascending.
    Each stargazer entry includes a `starred_at` field.
    """
    ...


def compute_trend_buckets(
    events: List[StarEvent],
    hours: int = 72,
    interval_minutes: int = 60,
) -> List[TrendBucket]:
    """Group star events into time buckets.
    
    Args:
        events: Sorted star events
        hours: Lookback window
        interval_minutes: Bucket size
        
    Returns:
        List of TrendBucket with label, count, delta
    """
    ...


def render_trend_chart(buckets: List[TrendBucket], repo: str) -> str:
    """Render ASCII trend table.
    
    Uses ━━━ box-drawing borders, ▲/▼ delta indicators.
    Colors: GREEN for positive delta, RED for negative.
    """
    ...


def cmd_trends(args, client: GitHubClient) -> str:
    """Command handler for `ara trends`.
    
    Args from argparse namespace:
    - args.repo: str
    - args.hours: int (default 72)
    - args.interval: int (default 60, in minutes)
    - args.json: bool (default False)
    """
    ...
```

#### 修改 `ara/cli.py`

在 `build_parser()` 函数中，在 `compare` parser 之后添加:

```python
# ara trends <repo>
trends_parser = subparsers.add_parser(
    "trends", help="Show star trend chart for a repo"
)
trends_parser.add_argument("repo", help="Repository (owner/repo)")
trends_parser.add_argument(
    "--hours", type=int, default=72,
    help="Lookback window in hours (default: 72)",
)
trends_parser.add_argument(
    "--interval", type=int, default=60,
    help="Bucket interval in minutes (default: 60)",
)
trends_parser.add_argument("--json", action="store_true", help="Output as JSON")
trends_parser.set_defaults(func=cmd_trends)
```

同时在 `main()` 函数的 import 中添加:
```python
from ara.trends import cmd_trends
```

JSON handler mapping 中添加:
```python
"trends": cmd_trends_json,
```

#### 新建测试文件 `tests/test_trends.py`

至少包含 6 个测试:

1. `test_get_star_history_returns_sorted_events` — mock stargazers API 分页响应，验证返回按时间排序的 StarEvent 列表
2. `test_get_star_history_empty_repo` — 新仓库无 stargazers 时返回空列表
3. `test_compute_trend_buckets_basic` — 给定 10 个事件在 72 小时内，验证分桶和 delta 正确
4. `test_compute_trend_buckets_empty` — 空事件列表返回空桶列表
5. `test_render_trend_chart_format` — 验证输出包含 repo 名、边框、header、每个桶的行
6. `test_render_trend_chart_empty` — 空桶列表显示 "No star history data" 友好提示

---

## 关键约束

1. **零新增依赖** — 不使用 tabulate/rich/pandas。全部用 stdlib 实现
2. **复用 core.py 的缓存** — `GitHubClient` 已有 60s TTL cache，直接传入
3. **没有外部绘图库** — 柱状图用 ASCII 字符实现
4. **JSON 输出** — `--json` 输出包含 {repo, hours, interval_minutes, buckets: [{label, count, delta}], total_new_stars, best_hour}
5. **API 端点** — 使用 `GET /repos/{owner}/{repo}/stargazers?per_page=100&page=N`
   - 每个 stargazer 条目包含 `starred_at` 字段（ISO 8601 字符串）
   - 响应 header `Link` 包含下一页 URL
   - 可用 `urllib.parse` 解析 Link header

---

## 接受标准

- [ ] `ara trends owner/repo` 显示 ASCII 趋势表（含边框、delta 着色）
- [ ] `ara trends owner/repo --json` 输出 JSON
- [ ] `ara trends owner/repo --hours 24 --interval 30` 自定义时间窗口
- [ ] 空数据时显示友好提示（非 crash）
- [ ] `python -m pytest tests/ -q` → 132+ passed, 0 failed
- [ ] 零新增依赖

---

## 参考

- `core.py` GitHubClient 已有 `_make_request(url)` 方法 — 分页需额外处理 Link header
- `core.py` `get_stars()` 用了 `get(stargazers_count)`，但 `trends` 需要完整的 `starred_at` 时间戳
- `display.py` 中的颜色常量可复用: `GREEN`, `RED`, `RESET`, `BOLD`
- 时间戳解析: `datetime.fromisoformat(starred_at).timestamp()`

## Watch out

- GitHub API 的 stargazers 端点返回 `[{starred_at, user}, ...]` 格式。注意 `user` 字段有 `login` 和 `id`
- 分页使用 Link header 或固定 pages=3 参数
- 新仓库 (< 100 stars) 可能只有 1 页，`total new stars` 应该等于仓库总星数
- 不要使用 `requests` 库 — 只用 `urllib.request`
