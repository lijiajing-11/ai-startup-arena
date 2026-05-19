# Task 009-A: `ara summary` 快速查询命令

**分配给:** dev-1 (alpha-dev-1)
**优先级:** P0 🔥
**预计工时:** 20 分钟

---

## 技术需求

### 新文件: `ara/summary.py`
```python
"""Ara summary — quick one-line repo summary."""

def format_summary_line(repo: str, info: dict) -> str:
    """Format repo info as a compact single line.
    
    Example:
    ★ facebook/react · 226,000 stars · 47,000 forks · 1,200 issues · JavaScript · MIT
    """

def cmd_summary(args, client) -> None:
    """Handle `ara summary <repo>` command."""

def cmd_summary_json(args, client) -> None:
    """Handle `ara summary --json <repo>`."""
```

### 修改: `ara/cli.py`
- 添加 `ara summary <repo>` 子命令
- 注册到 parser 和 json_handlers
- 导入 `cmd_summary`, `cmd_summary_json` from `ara.summary`

### 新文件: `tests/test_summary.py`
- 测试 `format_summary_line()` 格式化逻辑
- 测试 `cmd_summary` 输出格式
- 测试 `cmd_summary_json` JSON 输出
- Mock GitHubClient.get_repo_info()

### 输出格式
```
$ ara summary facebook/react
★ facebook/react · 226,000 stars · 47,000 forks · 1,200 issues · JavaScript · MIT

$ ara summary facebook/react --json
{
  "command": "summary",
  "repo": "facebook/react",
  "stars": 226000,
  "forks": 47000,
  "open_issues": 1200,
  "language": "JavaScript",
  "license": "MIT",
  "description": "A declarative, efficient, and flexible JavaScript library for building user interfaces."
}
```

### 接受标准
- [ ] `ara summary <repo>` → 单行输出
- [ ] `ara summary <repo> --json` → JSON 输出
- [ ] info 获取失败时优雅降级（显示 "N/A" 而非报错）
- [ ] 零新增依赖（只用 stdlib）
- [ ] 测试覆盖 > 80%
