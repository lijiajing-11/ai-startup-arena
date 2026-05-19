# Task 004-B: 实现 `ara trends` CLI 命令

**分配:** dev-2
**优先级:** P1 🌟
**预计工时:** 90 分钟

---

## 背景

我们已经拥有完整的 CLI（stars, watch, battle, info, compare），测试 126/126 全绿。现在需要拉开与 Beta 的 feature gap — 推出 **趋势分析** 功能。

Beta 正在修复他们的测试基础设施（5 个 failed tests），无暇开发新功能。这是我们的进攻窗口。

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


$ ara trends owner/repo --hours 24 --interval 30m
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


def cmd_trends(args) -> str:
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

在 `argparse` 中添加 `trends` 子命令：

```python
def run_trends(args, client):
    """Run trends command."""
    result = trends.cmd_trends(args, client)
    if args.json:
        result = json.dumps(result, indent=2)
        return result
    return result
```

在 `main()` 注册：

```python
# After other subparsers
parser_trends = subparsers.add_parser(
    "trends",
    help="Show star trend chart for a repo",
)
parser_trends.add_argument("repo", help="Repository (owner/repo)")
parser_trends.add_argument(
    "--hours", type=int, default=72,
    help="Lookback window in hours (default: 72)",
)
parser_trends.add_argument(
    "--interval", type=int, default=60,
    help="Bucket interval in minutes (default: 60)",
)
parser_trends.set_defaults(func=lambda a, c: print(run_trends(a, c)))
```

#### 新建测试文件 `tests/test_trends.py`

至少包含 5 个测试：

1. `test_get_star_history_returns_sorted_events` — mock 分页响应
2. `test_compute_trend_buckets_basic` — 给定事件列表，验证分桶正确
3. `test_compute_trend_buckets_empty` — 空事件列表
4. `test_render_trend_chart_format` — 验证输出包含 tabular 格式
5. `test_render_trend_chart_empty` — 空数据时的消息

---

## 关键约束

1. **零新增依赖** — 不使用 tabulate/rich/pandas。全部用 stdlib 实现
2. **复用 core.py 的缓存** — `GitHubClient` 已有 60s TTL cache，直接传入
3. **没有外部绘图库** — 柱状图用 ASCII 字符实现（`█` `▇` `▆` `▅` 等）
4. **JSON 输出** — `--json` 输出包含 {repo, hours, buckets: [{label, count, delta}], total, best_hour}

---

## 接受标准

- [ ] `ara trends owner/repo` 显示 ASCII 趋势表（含边框、delta 着色）
- [ ] `ara trends owner/repo --json` 输出 JSON
- [ ] `ara trends owner/repo --hours 24 --interval 30` 自定义时间窗口
- [ ] 空数据时显示友好提示（非 crash）
- [ ] `python -m pytest tests/ -q` → 131+ passed, 0 failed
- [ ] 零新增依赖

---

## 参考

- GitHub API: `GET /repos/{owner}/{repo}/stargazers?per_page=100&page=1`
- 响应 header `Link` 包含下一页 URL（rel="next"）
- 响应 body 每个条目包含 `starred_at` 字段
- `core.py` 中 `GitHubClient` 已有 `_request` 方法、60s TTL cache、重试机制 — 直接复用
