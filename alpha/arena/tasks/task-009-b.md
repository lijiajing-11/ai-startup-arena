# Task 009-B: `ara watch --notify` + `ara rank` 排行榜

**分配给:** dev-2 (alpha-dev-2)
**优先级:** P1
**预计工时:** 40 分钟

---

## Part 1: `ara watch --notify` 通知功能

### 修改: `ara/cli.py`
- 添加 `--notify` 标志到 watch 子命令
- 当 star 数发生变化时打印 `\a` (terminal bell) + 视觉标记 `🔔`
- watch 总结中显示变化次数

### 行为
```bash
$ ara watch facebook/react --notify
# 每次 star 数变化时:
# 🔔 facebook/react: 226,000 → 226,001 (+1)
# 同时触发 terminal bell (\a)
```

### 修改逻辑
在 `cmd_watch()` 中:
- 检查 `args.notify` 是否为 True
- 追踪上一次的 star 数
- 变化时打印通知行 + `\a`
- watch 结束时打印变化统计

### 接受标准
- [ ] `--notify` 标志存在
- [ ] watch 轮询中 star 数变化时触发通知
- [ ] 不阻塞原有 dashboard 输出
- [ ] `ara watch --json --notify` 也在 JSON 中包含变化事件

---

## Part 2: `ara rank` 排行榜命令

### 新文件: `ara/rank.py`

实现一个动态仓库排行榜：

```python
"""Ara rank — top N repos by star count."""

# 内置的热门仓库列表
DEFAULT_REPOS = [
    "facebook/react",
    "vuejs/core",
    "vercel/next.js",
    "twbs/bootstrap",
    "sveltejs/svelte",
    "angular/angular",
    "d3/d3",
    "nodejs/node",
    "lodash/lodash",
    "jquery/jquery",
]

def fetch_all_repos(client, repos: list[str]) -> list[dict]:
    """Fetch info for all repos, return sorted list."""

def format_rank_table(results: list[dict], top_n: int = 10) -> str:
    """Format as an ASCII table with rank, name, stars, forks, language."""

def cmd_rank(args, client) -> None:
    """Handle `ara rank` command."""

def cmd_rank_json(args, client) -> None:
    """Handle `ara rank --json` command."""
```

### 输出格式
```
$ ara rank
🏆 ARA Rank — Top 10 Hot Repos
┌────┬──────────────────────────────┬───────────┬───────┬──────────┐
│ #  │ Repo                         │ Stars     │ Forks │ Language │
├────┼──────────────────────────────┼───────────┼───────┼──────────┤
│ 1  │ facebook/react               │ 226,000   │ 47k   │ JavaScript │
│ 2  │ vuejs/core                   │ 47,000    │  7k   │ TypeScript│
│ 3  │ vercel/next.js               │ 126,000   │ 27k   │ JavaScript │
│ ... │                              │           │       │          │
└────┴──────────────────────────────┴───────────┴───────┴──────────┘
```

### 修改: `ara/cli.py`
- 添加 `ara rank [--top N] [--json]` 子命令
- `--top` 参数控制显示数量（默认 10）
- 注册到 parser

### 新文件: `tests/test_rank.py`
- 测试 `format_rank_table()` 格式化
- 测试排序逻辑
- 测试 `--json` 输出
- 测试 `--top` 参数

### 接受标准
- [ ] `ara rank` → 显示 Top 10 排行榜
- [ ] `ara rank --top 5` → 只显示前 5
- [ ] `ara rank --json` → JSON 输出
- [ ] 仓库获取失败时优雅降级（跳过错误，显示可用数据）
- [ ] 零新增依赖
- [ ] 测试覆盖 > 80%
