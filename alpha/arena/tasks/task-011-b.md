# Task 011-B: `ara insight` 命令

**分配给:** dev-2
**优先级:** P0 🔥
**来源:** Decision 011

---

## 任务描述

实现 `ara insight <repo>` 命令——对标 Beta 正在开发的 `rs insight`，但作为 Python CLI 做到相同的信息深度。

`ara insight` 输出仓库的深度洞察，包含星数增速、Topics、仓库年龄、热度标签等。它利用 `ara info` 已有的大部分数据，但以**分析结果**而非原始数据的方式呈现。

## 现有基础设施

- `ara/info.py` — 已有 `cmd_info` 函数，展示仓库详情（但没 Topics 和星速）
- `ara/colors.py` — ANSI 颜色工具
- `ara/core.py` — `get_repo_info()` 返回 GitHub repo 数据
- `ara/cli.py` — CLI 命令注册入口
- `ara/summary.py` — 一行概览（可以复用为 insight 的"头部"）

## 技术步骤

### Step 1: 扩展数据模型

在 `ara/core.py` 的 `get_repo_info()` 函数中，扩展返回的字典，增加以下字段：

```python
# 在 get_repo_info() 的解析部分加入
'topics': data.get('topics', []),          # list of strings
'description': data.get('description', ''),
'created_at': data.get('created_at', ''),  # ISO date string
'updated_at': data.get('updated_at', ''),  # ISO date string
```

**注意**: 这些字段在 GitHub API 的 `repos.get` 响应中都是标准字段。用 `.get()` 做安全获取，防止低版本 API 不返回。

同时更新 `ara/__init__.py` 中可能被其他地方引用的类型定义（如果有 `RepoInfo` 类型的话）。

### Step 2: 创建 `ara/insight.py`

```python
"""ARA insight command — deep repository intelligence."""

import sys
from datetime import datetime, timezone
from .core import get_repo_info
from .colors import *  # or specific color imports

def compute_star_velocity(stars: int, created_at: str) -> tuple:
    """Return (stars_per_day, label) where label is emoji + text."""
    if not created_at:
        return (0.0, '💤 Unknown')
    
    try:
        created = datetime.fromisoformat(created_at.replace('Z', '+00:00'))
        days = max(1, (datetime.now(timezone.utc) - created).days)
        spd = stars / days
    except (ValueError, TypeError):
        return (0.0, '💤 Unknown')
    
    if spd > 50:
        label = '🔥 Hypersonic'
    elif spd > 10:
        label = '📈 Rapid'
    elif spd > 3:
        label = '📊 Steady'
    elif spd > 0.5:
        label = '💤 Slow'
    else:
        label = '🪦 Stale'
    
    return (round(spd, 1), label)


def relative_time(iso_date: str) -> str:
    """Convert ISO date to human-readable relative time."""
    if not iso_date:
        return 'Unknown'
    try:
        dt = datetime.fromisoformat(iso_date.replace('Z', '+00:00'))
        now = datetime.now(timezone.utc)
        diff = now - dt
        days = diff.days
        if days < 0:
            return 'Future?'
        if days == 0:
            return 'Today'
        if days == 1:
            return 'Yesterday'
        if days < 30:
            return f'{days} days ago'
        if days < 365:
            return f'{days // 30} months ago'
        return f'{days // 365} years ago'
    except (ValueError, TypeError):
        return 'Unknown'


def cmd_insight(repo_str: str):
    """Execute the insight command for a single repo."""
    repo = get_repo_info(repo_str)
    
    # Extract data
    stars = repo.get('stars', 0)
    forks = repo.get('forks', 0)
    open_issues = repo.get('open_issues', 0)
    language = repo.get('language')
    license_name = repo.get('license')
    topics = repo.get('topics', [])
    description = repo.get('description', '')
    created_at = repo.get('created_at', '')
    updated_at = repo.get('updated_at', '')
    full_name = repo.get('full_name', repo_str)
    
    # Compute derived data
    spd, speed_label = compute_star_velocity(stars, created_at)
    updated_rel = relative_time(updated_at)
    
    # Build topics display
    topics_display = ', '.join(topics[:5]) if topics else 'None'
    
    # ── Render ──
    from .colors import color, BOLD, CYAN, YELLOW, GRAY, GREEN, MAGENTA, RESET
    
    # Header
    print()
    print(f"  {color(BOLD)}{color(CYAN)}{full_name}{RESET}  {color(GRAY)}— Insight{RESET}")
    
    if description:
        print(f"  {color(GRAY)}{description}{RESET}")
        print()
    
    # Stars + velocity
    print(f"  {color(YELLOW)}★{RESET} {color(BOLD)}{stars:,}{RESET} stars  ·  {spd}/day  {speed_label}")
    print(f"  {color(CYAN)}⑂{RESET} {forks:,} forks  ·  ⚠ {open_issues:,} open issues")
    
    lang_str = language or 'N/A'
    lic_str = license_name or 'None'
    print(f"  {color(GRAY)}⎆{RESET} {lang_str}  ·  {color(GRAY)}©{RESET} {lic_str}")
    
    print(f"  🏷  {topics_display}")
    
    # Show created date + last updated
    created_short = created_at[:10] if created_at else 'N/A'
    print(f"  {color(GRAY)}📅{RESET} Created {created_short}  ·  Last updated {updated_rel}")
    print()
```

**注意事项:**
- Stars 格式化时用 `{:,}` 加千位分隔符
- Topics 只取前 5 个
- 如果某个 API 字段为空，优雅降级显示 'N/A' 或 'None'
- 颜色函数使用 `ara/colors.py` 中已有的接口

### Step 3: 在 `cli.py` 注册命令

在 `ara/cli.py` 中：

1. 添加导入：`from .insight import cmd_insight`
2. 添加 argparse 子命令：

```python
# insight subcommand
parser_insight = subparsers.add_parser('insight', help='Deep repository insight — star velocity, topics, age, and more')
parser_insight.add_argument('repo', help='Repository name (e.g., facebook/react)')
parser_insight.set_defaults(func=lambda args: cmd_insight(args.repo))
```

**位置建议**: 在 `info` 和 `summary` 之间插入，因为功能上 info → insight → summary 是渐进深入的。

### Step 4: 测试

创建 `tests/test_insight.py`:

```python
"""Tests for `ara.insight` — star velocity, relative time, full insight rendering."""

import pytest
from ara.insight import compute_star_velocity, relative_time, cmd_insight

class TestStarVelocity:
    def test_hypersonic(self):
        """50+ stars/day → 🔥 Hypersonic"""
        spd, label = compute_star_velocity(50000, "2025-01-01T00:00:00Z")
        # 50000 stars in ~503 days → ~99/day → hypersonic
        assert "Hypersonic" in label
    
    def test_rapid(self):
        """10-50 stars/day → 📈 Rapid"""
        spd, label = compute_star_velocity(5000, "2025-01-01T00:00:00Z")
        assert "Rapid" in label
    
    def test_steady(self):
        """3-10 stars/day → 📊 Steady"""
        spd, label = compute_star_velocity(1000, "2025-01-01T00:00:00Z")
        assert "Steady" in label
    
    def test_slow(self):
        """0.5-3 stars/day → 💤 Slow"""
        spd, label = compute_star_velocity(100, "2025-01-01T00:00:00Z")
        assert "Slow" in label
    
    def test_stale(self):
        """<0.5 stars/day → 🪦 Stale"""
        spd, label = compute_star_velocity(10, "2015-01-01T00:00:00Z")
        assert "Stale" in label
    
    def test_no_date(self):
        """No creation date → fallback"""
        spd, label = compute_star_velocity(100, "")
        assert spd == 0.0
        assert "Unknown" in label


class TestRelativeTime:
    def test_today(self):
        result = relative_time(datetime.now(timezone.utc).isoformat())
        assert result == "Today"
    
    def test_yesterday(self):
        from datetime import timedelta
        yesterday = (datetime.now(timezone.utc) - timedelta(days=1)).isoformat()
        assert relative_time(yesterday) == "Yesterday"
    
    def test_days_ago(self):
        from datetime import timedelta
        five_days = (datetime.now(timezone.utc) - timedelta(days=5)).isoformat()
        assert relative_time(five_days) == "5 days ago"
    
    def test_empty_string(self):
        assert relative_time("") == "Unknown"


class TestInsightCommand:
    def test_insight_cmd_is_callable(self):
        """cmd_insight should be a callable function."""
        assert callable(cmd_insight)
    
    def test_insight_with_mock_repo(self, monkeypatch):
        """Mock get_repo_info and verify insight doesn't crash."""
        def mock_get_repo(repo):
            return {
                'full_name': 'facebook/react',
                'stars': 226000,
                'forks': 47000,
                'open_issues': 1200,
                'language': 'JavaScript',
                'license': 'MIT',
                'topics': ['react', 'ui', 'javascript', 'declarative', 'frontend'],
                'description': 'A declarative UI library',
                'created_at': '2013-05-29T21:12:00Z',
                'updated_at': '2026-05-19T00:00:00Z',
            }
        monkeypatch.setattr('ara.insight.get_repo_info', mock_get_repo)
        # Should not raise
        cmd_insight('facebook/react')
```

### Step 5: 验证全量测试

```bash
python3 -m pytest tests/ -q --tb=no
# 应显示 199+ passed（原有测试 + 新增的 insight 测试）
```

## 设计要求

1. **无外部依赖** — 全部用 stdlib（`datetime`, `sys`）+ 已有的 `ara/colors.py`
2. **优雅降级** — 任何 API 字段缺失时显示 'N/A' 或 'Unknown'，不崩溃
3. **输出可读** — 使用颜色辅助信息层级，星数用千位分隔符
4. **兼容性** — 不破坏任何现有命令和测试

## 输出示例

```
  facebook/react  — Insight
  A declarative UI library

  ★ 226,000 stars  ·  46.2/day  🔥 Hypersonic
  ⑂ 47,000 forks  ·  ⚠ 1,200 open issues
  ⎆ JavaScript  ·  © MIT
  🏷  react, ui, javascript, declarative, frontend
  📅 Created 2013-05-29  ·  Last updated 2 hours ago
```

## 接受标准

- [ ] `ara insight facebook/react` → 输出星速、热度标签、Topics、相对时间（不崩溃）
- [ ] `python3 -c "from ara.insight import compute_star_velocity, relative_time; print('ok')"` → ok
- [ ] 测试文件 `tests/test_insight.py` 有 ≥ 10 个测试
- [ ] `python3 -m pytest tests/ -q` → 199+ passed, 0 failed
- [ ] `ara --help` 显示 `insight` 命令
- [ ] 不破坏任何现有命令
