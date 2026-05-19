# Task 013-A: BLOAT 清理 — 重构 `history.py` 拆分 `chart.py`

**分配给:** dev-2
**优先级:** P0 🔥
**来源:** Decision 013

---

## 任务描述

仲裁者标记了 BLOAT 警告：
- `ara/history.py` — 171 lines (超标)
- `tests/test_history.py` — 203 lines (超标)

**核心动作：** 将通用的 ASCII 图表渲染逻辑从 `history.py` 中拆出到独立的 `ara/chart.py` 模块。`history.py` 只保留业务逻辑（构建 timeline），同时精简测试。

---

## 技术步骤

### Step 1: 创建 `ara/chart.py`

将 `_render_chart` 从 `history.py` 中提取出来，作为通用 ASCII 图表渲染工具。

```python
"""ARA chart module — ASCII chart rendering utilities.

Provides generic ASCII bar/line chart rendering functions
that can be reused across commands (history, trends, etc.).
"""

from .colors import BOLD, CYAN, GRAY, GREEN, RESET, YELLOW


def render_line_chart(
    timeline: list[dict],
    repo_name: str,
    bar_char: str | None = None,
    chart_height: int = 10,
    chart_width: int = 40,
) -> str:
    """Render an ASCII line chart from timeline data.

    Args:
        timeline: List of dicts with 'stars' and 'date' keys,
                  in chronological order.
        repo_name: Repository name for chart title.
        bar_char: Character to use for the chart line (default: green ●).
        chart_height: Height of the chart in rows (default: 10).
        chart_width: Max width of the chart in columns (default: 40).

    Returns:
        A formatted ASCII chart string for terminal display.
    """
    if not timeline:
        return f"  {GRAY}No history data available for {repo_name}{RESET}"

    max_stars = max(p["stars"] for p in timeline) or 1
    min_stars = min(p["stars"] for p in timeline) or 0
    range_stars = max_stars - min_stars or 1

    # Sample to chart_width points if needed
    if len(timeline) > chart_width:
        step = len(timeline) / chart_width
        sampled = [timeline[int(i * step)] for i in range(chart_width)]
    else:
        sampled = timeline

    bar_char = bar_char or f"{GREEN}●{RESET}"
    axis_char = f"{GRAY}│{RESET}"

    lines: list[str] = []
    lines.append(f"  {BOLD}{YELLOW}★ {repo_name} — Star History{RESET}")
    lines.append(f"  {GRAY}{max_stars:,} stars total{RESET}")
    lines.append("")

    # Build chart rows from top to bottom
    for row in range(chart_height):
        threshold = max_stars - (row + 1) * (range_stars / chart_height)
        line = f"  {axis_char} "
        for point in sampled:
            line += bar_char if point["stars"] >= threshold else " "
        lines.append(line)

    # X-axis
    x_axis = f"  └{'─' * len(sampled)}"
    lines.append(x_axis)

    # Labels (first and last date)
    first_date = timeline[0].get("date", "")[:10]
    last_date = timeline[-1].get("date", "")[:10]
    label_pad = " " * (len(sampled) - len(first_date) - len(last_date) + 2)
    lines.append(f"   {GRAY}{first_date}{label_pad}{last_date}{RESET}")
    lines.append("")

    return "\n".join(lines)
```

### Step 2: 精简 `ara/history.py`

移除 `_render_chart` 函数，改为从 `chart.py` 导入。

```python
"""ARA history command — star growth over time ASCII chart."""

import math
from datetime import datetime, timezone

from .chart import render_line_chart
from .core import GitHubClient


def cmd_history(
    repo_str: str,
    client: GitHubClient | None = None,
    as_json: bool = False,
) -> None:
    """Execute the history command for a single repo."""
    client = client or GitHubClient()

    timeline = _build_timeline_from_repo(client, repo_str)

    if not timeline:
        from .colors import GRAY, RESET
        output = f"  {GRAY}No history data available for {repo_str}{RESET}"
        if as_json:
            import json as _json
            output = _json.dumps({
                "command": "history",
                "repo": repo_str,
                "error": "No data available",
            }, indent=2)
        print(output)
        return

    if as_json:
        import json as _json
        clean = [
            {"stars": p.get("stars", 0), "date": p.get("date", "")}
            for p in timeline
        ]
        info = client.get_repo_info(repo_str)
        print(_json.dumps({
            "command": "history",
            "repo": repo_str,
            "current_stars": info.get("stars", 0),
            "created_at": info.get("created_at", ""),
            "timeline": clean,
        }, indent=2, ensure_ascii=False))
        return

    chart = render_line_chart(timeline, repo_str)
    print(chart)


def _build_timeline_from_repo(client: GitHubClient, repo: str) -> list[dict]:
    """Build a simulated star growth timeline from repo info."""
    info = client.get_repo_info(repo)
    stars = info.get("stars", 0)
    created_at = info.get("created_at", "")

    if not created_at or stars == 0:
        return []

    try:
        created = datetime.fromisoformat(created_at.replace("Z", "+00:00"))
    except (ValueError, TypeError):
        return []

    now = datetime.now(timezone.utc)
    total_days = max(1, (now - created).days)

    points = []
    for i in range(21):
        frac = i / 20.0
        day = int(frac * total_days)
        growth_factor = frac ** 1.5
        point_stars = min(int(stars * growth_factor), stars)
        point_date = (created + __import__("datetime").timedelta(days=day)).isoformat()[:10]
        points.append({
            "stars": point_stars,
            "date": point_date,
            "day": day,
        })

    return points
```

### Step 3: 创建 `tests/test_chart.py`

将图表的测试从 `test_history.py` 迁移过来。

```python
"""Tests for ara.chart — ASCII chart rendering."""

import pytest
from ara.chart import render_line_chart


class TestRenderChart:
    """Tests for render_line_chart function."""

    def test_empty_timeline(self):
        result = render_line_chart([], "test/repo")
        assert "No history" in result

    def test_single_point(self):
        result = render_line_chart([{"stars": 100, "date": "2025-01-01"}], "test/repo")
        assert "test/repo" in result
        assert "100" in result

    def test_multiple_points(self):
        timeline = [
            {"stars": 0, "date": "2020-01-01"},
            {"stars": 50, "date": "2022-01-01"},
            {"stars": 100, "date": "2024-01-01"},
            {"stars": 200, "date": "2026-01-01"},
        ]
        result = render_line_chart(timeline, "growing/repo")
        assert "growing/repo" in result
        assert "●" in result

    def test_upward_trend_label(self):
        result = render_line_chart(
            [{"stars": 10, "date": "2020-01-01"}, {"stars": 500, "date": "2026-01-01"}],
            "trend/repo",
        )
        assert "Star History" in result

    def test_chart_has_dates(self):
        timeline = [
            {"stars": 10, "date": "2020-01-01"},
            {"stars": 30, "date": "2026-12-31"},
        ]
        result = render_line_chart(timeline, "dated/repo")
        assert "2020-01-01" in result
        assert "2026-12-31" in result

    def test_large_star_count_formatting(self):
        timeline = [{"stars": 0, "date": "2013-01-01"}, {"stars": 226000, "date": "2026-01-01"}]
        result = render_line_chart(timeline, "big/repo")
        assert "226,000" in result

    def test_custom_bar_char(self):
        timeline = [{"stars": 0, "date": "2020-01-01"}, {"stars": 100, "date": "2026-01-01"}]
        result = render_line_chart(timeline, "custom/repo", bar_char="█")
        assert "█" in result
```

### Step 4: 精简 `tests/test_history.py`

保留 `_build_timeline_from_repo` 和 `cmd_history` 相关的测试，移除已经迁移到 `test_chart.py` 的图表渲染测试。

```python
"""Tests for `ara.history` — star history data generation."""

import pytest
from ara.history import cmd_history, _build_timeline_from_repo


class TestBuildTimeline:
    """Tests for _build_timeline_from_repo."""

    def test_with_valid_repo_info(self, monkeypatch):
        def mock_get_repo_info(_self, repo):
            return {
                "full_name": "facebook/react",
                "stars": 226000,
                "created_at": "2013-05-29T21:12:00Z",
            }
        from ara.core import GitHubClient
        monkeypatch.setattr("ara.core.GitHubClient.get_repo_info", mock_get_repo_info)
        client = GitHubClient()
        result = _build_timeline_from_repo(client, "facebook/react")
        assert len(result) == 21
        assert result[0]["stars"] == 0
        assert result[-1]["stars"] == 226000

    def test_no_created_at(self, monkeypatch):
        def mock_get_repo_info(_self, repo):
            return {"full_name": "new/repo", "stars": 5, "created_at": ""}
        from ara.core import GitHubClient
        monkeypatch.setattr("ara.core.GitHubClient.get_repo_info", mock_get_repo_info)
        client = GitHubClient()
        assert _build_timeline_from_repo(client, "new/repo") == []

    def test_zero_stars(self, monkeypatch):
        def mock_get_repo_info(_self, repo):
            return {"full_name": "empty/repo", "stars": 0, "created_at": "2024-01-01T00:00:00Z"}
        from ara.core import GitHubClient
        monkeypatch.setattr("ara.core.GitHubClient.get_repo_info", mock_get_repo_info)
        client = GitHubClient()
        assert _build_timeline_from_repo(client, "empty/repo") == []

    def test_timeline_monotonic(self, monkeypatch):
        def mock_get_repo_info(_self, repo):
            return {"full_name": "growing/repo", "stars": 1000, "created_at": "2020-01-01T00:00:00Z"}
        from ara.core import GitHubClient
        monkeypatch.setattr("ara.core.GitHubClient.get_repo_info", mock_get_repo_info)
        client = GitHubClient()
        result = _build_timeline_from_repo(client, "growing/repo")
        stars = [p["stars"] for p in result]
        assert all(stars[i] <= stars[i + 1] for i in range(len(stars) - 1))


class TestCmdHistory:
    """Tests for cmd_history entry point."""

    def test_callable(self):
        assert callable(cmd_history)

    def test_no_crash(self, monkeypatch):
        def mock_get_repo_info(_self, repo):
            return {"full_name": "facebook/react", "stars": 226000, "created_at": "2013-05-29T21:12:00Z"}
        monkeypatch.setattr("ara.core.GitHubClient.get_repo_info", mock_get_repo_info)
        cmd_history("facebook/react")

    def test_json_output(self, monkeypatch):
        import json, io, sys
        def mock_get_repo_info(_self, repo):
            return {"full_name": "facebook/react", "stars": 226000, "created_at": "2013-05-29T21:12:00Z"}
        monkeypatch.setattr("ara.core.GitHubClient.get_repo_info", mock_get_repo_info)
        captured = io.StringIO()
        old_stdout = sys.stdout
        sys.stdout = captured
        try:
            cmd_history("facebook/react", as_json=True)
        finally:
            sys.stdout = old_stdout
        parsed = json.loads(captured.getvalue())
        assert parsed["command"] == "history"
        assert len(parsed["timeline"]) == 21

    def test_minimal_repo(self, monkeypatch):
        def mock_get_repo_info(_self, repo):
            return {"full_name": "empty/repo", "stars": 0, "created_at": ""}
        monkeypatch.setattr("ara.core.GitHubClient.get_repo_info", mock_get_repo_info)
        cmd_history("empty/repo")
```

### Step 5: 验证

```bash
python3 -m pytest tests/ -q --tb=no
# 应显示 242+ passed（全部原有测试 + 新 chart 测试）
```

---

## 设计要求

1. **`history.py` < 100 行** — 大幅精简
2. **`test_history.py` < 150 行** — 大幅精简
3. **`chart.py` 独立可测试** — 通用的图表渲染工具
4. **向后兼容** — 所有现有命令不受影响

## 文件清单

| 文件 | 操作 | 目标行数 |
|------|:----:|:--------:|
| `ara/history.py` | 精简 (删除 `_render_chart`, 改为 import) | < 100 |
| `ara/chart.py` | **新建** (`render_line_chart` 函数) | ~50 |
| `tests/test_chart.py` | **新建** (图表渲染测试，≥ 7 个) | ~90 |
| `tests/test_history.py` | 精简 (删除冗余测试) | < 150 |

## 验收标准

- [ ] `python3 -m pytest tests/ -q` → 242+ passed, 0 failed
- [ ] `ara/history.py` < 100 行 (wc -l)
- [ ] `tests/test_history.py` < 150 行
- [ ] `python3 -c "from ara.chart import render_line_chart; print('ok')"` → ok
- [ ] `ara history facebook/react` → 输出与之前一致的 ASCII 折线图
- [ ] `ara --help` 仍显示 `history` 命令
