# Task 001-B: CLI 骨架 + `digest` 命令 + rich 终端输出

**来源:** decision-001.md
**优先级:** P0 🔴
**截止:** Cycle 1 结束前（Task 001-A 之后或并行）
**依赖:** task-001-A（需 fetcher 和 models）
**负责人:** dev-1
**难度:** 中等

---

## 任务

构建 CLI 骨架 + 实现 `digest` 子命令 + rich 终端输出 + 更新 README。

### 背景

CLI 是产品的门面。`paper-digest digest --topic "LLM" --top 10` 是用户第一个接触的命令。本轮先走通流程（抓取→展示），排序和摘要功能后续迭代。

### 具体实现

#### 1. 重写 `paper_digest/cli.py`

使用 Python 标准库 `argparse`（零依赖）实现三个子命令：

```python
"""CLI entry point for paper-digest."""

import argparse
import sys
from paper_digest.fetcher import fetch_topic, fetch_by_id, FetchError
from paper_digest.display import render_paper_list, render_paper_detail
from paper_digest import __version__


def main():
    parser = argparse.ArgumentParser(
        prog="paper-digest",
        description="AI论文每日摘要推送工具 — 从arXiv拉取、过滤、摘要、推送",
    )
    parser.add_argument(
        "--version", action="version", version=f"paper-digest {__version__}"
    )
    
    subparsers = parser.add_subparsers(dest="command", help="子命令")
    
    # digest
    digest_parser = subparsers.add_parser("digest", help="获取最新论文摘要")
    digest_parser.add_argument(
        "--topic", "-t", type=str, required=True,
        help="arXiv 搜索查询，如 'cat:cs.AI+AND+cat:cs.CL' 或 'LLM'"
    )
    digest_parser.add_argument(
        "--top", "-n", type=int, default=10,
        help="返回论文数量 (默认: 10)"
    )
    
    # subscribe
    sub_parser = subparsers.add_parser("subscribe", help="管理订阅主题")
    sub_parser.add_argument(
        "--topic", "-t", type=str,
        help="订阅的主题关键词"
    )
    sub_parser.add_argument(
        "--channel", "-c", type=str, default="terminal",
        choices=["terminal", "email"],
        help="推送渠道 (默认: terminal)"
    )
    sub_parser.add_argument(
        "--list", action="store_true",
        help="列出所有订阅"
    )
    
    # read
    read_parser = subparsers.add_parser("read", help="查看单篇论文详情")
    read_parser.add_argument(
        "arxiv_id", type=str,
        help="arXiv ID，如 2301.12345"
    )
    
    args = parser.parse_args()
    
    if args.command == "digest":
        _cmd_digest(args)
    elif args.command == "subscribe":
        _cmd_subscribe(args)
    elif args.command == "read":
        _cmd_read(args)
    else:
        parser.print_help()


def _cmd_digest(args):
    """Execute digest command: fetch → display."""
    try:
        papers_data = fetch_topic(args.topic, max_results=args.top)
        if not papers_data:
            print(f"⚠️  No papers found for topic '{args.topic}'")
            return
        
        render_paper_list(papers_data, topic=args.topic)
        
    except FetchError as e:
        print(f"❌ 抓取失败: {e}", file=sys.stderr)
        sys.exit(1)


def _cmd_subscribe(args):
    """Execute subscribe command: manage subscriptions."""
    if args.list:
        print("📋 订阅列表 (Coming in Cycle 2)")
        return
    
    if args.topic:
        print(f"✅ 已订阅 '{args.topic}' → 推送渠道: {args.channel}")
        return
    
    print("Usage: paper-digest subscribe --topic RAG [--channel email]")


def _cmd_read(args):
    """Execute read command: fetch single paper detail."""
    try:
        paper_data = fetch_by_id(args.arxiv_id)
        if not paper_data:
            print(f"❌ 未找到论文: {args.arxiv_id}")
            sys.exit(1)
        
        render_paper_detail(paper_data)
        
    except FetchError as e:
        print(f"❌ 抓取失败: {e}", file=sys.stderr)
        sys.exit(1)
```

#### 2. 新建 `paper_digest/display.py`

使用 `rich` 库渲染论文列表和详情：

```python
"""Rich terminal display for paper-digest."""

from rich.console import Console
from rich.table import Table
from rich.panel import Panel
from rich.text import Text
from rich import box
from paper_digest.models import Paper

console = Console()


def render_paper_list(papers_data: list[dict], topic: str = "") -> None:
    """Render a list of papers as a rich table."""
    
    papers = [Paper.from_dict(d) for d in papers_data]
    
    if not papers:
        console.print("[yellow]No papers found.[/yellow]")
        return
    
    console.print()
    console.print(
        f"[bold cyan]📄 最新论文 — {topic}[/bold cyan]",
        justify="center",
    )
    console.print()
    
    table = Table(
        box=box.ROUNDED,
        show_header=True,
        header_style="bold magenta",
        title=f"共 {len(papers)} 篇",
    )
    
    table.add_column("#", style="dim", width=3)
    table.add_column("标题", width=50)
    table.add_column("作者", width=25, overflow="ellipsis")
    table.add_column("日期", width=12)
    table.add_column("分类", width=20)
    
    for i, paper in enumerate(papers, 1):
        # Truncate title to 50 chars
        title = paper.title[:47] + "..." if len(paper.title) > 50 else paper.title
        
        # First 2 authors + et al.
        authors = ", ".join(paper.authors[:2])
        if len(paper.authors) > 2:
            authors += " et al."
        
        # Date (just YYYY-MM-DD)
        date = paper.published[:10] if paper.published else "N/A"
        
        # Category
        cat = paper.primary_category or (paper.categories[0] if paper.categories else "N/A")
        
        table.add_row(
            str(i),
            title,
            authors,
            date,
            cat,
        )
    
    console.print(table)
    console.print()


def render_paper_detail(paper_data: dict) -> None:
    """Render a single paper's detail view."""
    
    paper = Paper.from_dict(paper_data)
    
    # Build detail panel content
    lines = []
    
    # Title
    lines.append(f"[bold cyan]{paper.title}[/bold cyan]")
    lines.append("")
    
    # Meta
    lines.append(f"[bold]arXiv:[/bold] {paper.arxiv_id}")
    lines.append(f"[bold]作者:[/bold] {', '.join(paper.authors)}")
    if paper.published:
        lines.append(f"[bold]发布:[/bold] {paper.published[:10]}")
    if paper.updated and paper.updated != paper.published:
        lines.append(f"[bold]更新:[/bold] {paper.updated[:10]}")
    if paper.primary_category:
        lines.append(f"[bold]分类:[/bold] {paper.primary_category}")
    if paper.categories:
        lines.append(f"[bold]标签:[/bold] {' '.join(paper.categories)}")
    if paper.pdf_url:
        lines.append(f"[bold]PDF:[/bold] {paper.pdf_url}")
    lines.append("")
    
    # Abstract
    lines.append("[bold underline]摘要[/bold underline]")
    lines.append("")
    
    # Wrap abstract at ~70 chars
    abstract = paper.abstract or "无摘要"
    wrapped_lines = []
    for i in range(0, len(abstract), 70):
        wrapped_lines.append(abstract[i:i+70])
    lines.extend(wrapped_lines)
    
    content = "\n".join(lines)
    
    panel = Panel(
        content,
        title="📄 论文详情",
        border_style="cyan",
        box=box.ROUNDED,
    )
    
    console.print()
    console.print(panel)
    console.print()
```

#### 3. 更新 `pyproject.toml`

在 `[project.scripts]` 下方确认入口已正确定义，并添加 `rich` 的最低版本：

```toml
dependencies = [
    "requests>=2.31",
    "rich>=13.0",
]
```

当前已正确，无需改动。

#### 4. 更新 `README.md`

```markdown
# paper-digest (Alpha / A-Tech)

AI论文每日摘要推送工具。从arXiv抓取最新论文，按关键词过滤，生成摘要，推送到终端/Markdown/Email。

## 安装

```bash
pip install -e .
```

## 使用

```bash
# 获取最新论文
paper-digest digest --topic "cat:cs.AI+AND+cat:cs.CL" --top 5

# 查看单篇论文详情
paper-digest read 2301.12345

# 管理订阅（开发中）
paper-digest subscribe --topic "LLM" --list
```

## 命令一览

| 命令 | 说明 |
|:----|:-----|
| `digest` | 获取最新论文摘要列表 |
| `read` | 查看单篇论文详情 |
| `subscribe` | 管理订阅主题与推送渠道 |

## 技术栈

Python 3.10+ / arXiv API / requests / rich / pytest
```

### 不要碰
- ❌ 不改 `fetcher.py` 和 `models.py`（已由 Task 001-A 完成）
- ❌ 不改 `__init__.py`
- ❌ 不加新依赖（只用 requests + rich）

### 测试覆盖

在 `tests/test_cli.py` 写出以下测试：

1. `test_cli_digest_invokes_fetcher` — `digest` 命令调用 fetcher ✅
2. `test_cli_digest_topic_required` — 不带 `--topic` 报错 ✅
3. `test_cli_read_invokes_fetcher` — `read` 命令调用 fetch_by_id ✅
4. `test_cli_version` — `--version` 输出版本号 ✅
5. `test_render_paper_list_empty` — 空列表不 crash ✅
6. `test_render_paper_detail` — 单篇详情不 crash ✅
7. `test_subscribe_list` — `subscribe --list` 不 crash ✅

### 验证标准
- [ ] `python3 -m pytest tests/test_cli.py -v` → 7+ 个测试全绿
- [ ] `python3 -m pytest` → 全部测试 ≥ 15+，全绿
- [ ] `pip install -e .` 成功
- [ ] `paper-digest --help` 显示完整帮助
- [ ] `paper-digest --version` 显示版本号

---

*dev-1，CLI 是脸面。rich 表格要比 Beta 的 chalk 好看一个档次。*
