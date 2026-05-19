# Task 017-A: 🔥 `ara history` 支持多仓库对比 — `--compare` 模式

**分配给:** dev-1  
**优先级:** P0 🔥  
**预计工时:** 25m  
**依赖:** 无

---

## 目标

当前 `ara history` 只接受单个 repo 参数。改造为支持多仓库，自动检测：1个 repo 走原单折线图，2+ 个 repo 自动进入对比模式。

## 设计细节

### 1. CLI 改造 (`ara/cli.py`)

**当前 (line 505-512):**
```python
history_parser = subparsers.add_parser(
    "history",
    help="Show star growth history as an ASCII chart",
)
history_parser.add_argument("repo", help="Repository (owner/repo)")
history_parser.add_argument("--json", action="store_true", help="Output as JSON")
history_parser.set_defaults(func=_cmd_history_wrapper)
```

**修改为:**
```python
history_parser = subparsers.add_parser(
    "history",
    help="Show star growth history as an ASCII chart",
)
history_parser.add_argument("repos", nargs="+", help="Repository(es) (owner/repo), 2+ for comparison mode")
history_parser.add_argument("--json", action="store_true", help="Output as JSON")
history_parser.set_defaults(func=_cmd_history_wrapper)
```

**Wrapper 改造 (line 68-70):**
```python
def _cmd_history_wrapper(args: argparse.Namespace, client: GitHubClient) -> None:
    repos = args.repos
    if len(repos) == 1:
        cmd_history(repos[0], client=client, as_json=getattr(args, "json", False))
    else:
        from ara.history import cmd_history_compare
        cmd_history_compare(repos, client=client, as_json=getattr(args, "json", False))
```

### 2. 新函数 `cmd_history_compare` (`ara/history.py`)

```python
def cmd_history_compare(
    repos: list[str],
    client: GitHubClient | None = None,
    as_json: bool = False,
) -> None:
    """Render multi-repo star history comparison."""
```

**逻辑：**
1. 对每个 repo 调用 `_build_timeline_from_repo()` 获取时间线
2. 计算每个 repo 的最终星数（用于归一化百分比）
3. 找出最早的创建时间和最晚的当前时间作为时间轴跨度
4. 用水平条图（horizontal bar chart）渲染

### 3. 输出格式

**文本模式（非 JSON）：**
```
╔══════════════════════════════════════════════════════════════╗
║            ⭐ Star History Comparison (all-time)             ║
╚══════════════════════════════════════════════════════════════╝

  facebook/react    ████████████████████████████████████████████ 226,000 ★  (100%)
  vuejs/core        ██████████████████████░░░░░░░░░░░░░░░░░░░░  47,000 ★  (21%)
  sveltejs/svelte   ████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░  30,000 ★  (13%)

  Timeline: 2013-05-29 ───────────────────────────────────── 2026-05-19
```

- 每个 repo 一行
- 仓库名左对齐，用 repo 的短名（如 `facebook/react`）
- 条图宽度：固定的 column 数（如 50 chars）
- 每个 repo 用不同的 ANSI 颜色
  - 颜色循环: GREEN, YELLOW, CYAN, GOLD, GRAY（从 `colors.py` 导入）
  - 实际上因为在 `BOLD` 模式下用不同颜色即可区分
- 右侧显示星数和百分比
- 底部时间轴行

**JSON 模式：**
```json
{
  "command": "history",
  "mode": "compare",
  "repos": [
    {
      "repo": "facebook/react",
      "current_stars": 226000,
      "created_at": "2013-05-29",
      "timeline": [...]
    },
    ...
  ]
}
```

### 4. 颜色分配方案

```python
from .colors import GREEN, YELLOW, CYAN, GOLD, GRAY, RESET, BOLD

_COMPARE_COLORS = [GREEN, YELLOW, CYAN, GOLD, GRAY]

def _get_compare_color(index: int) -> str:
    return _COMPARE_COLORS[index % len(_COMPARE_COLORS)]
```

### 5. 边缘情况

- 1 个 repo → 走原 `cmd_history`，不进入 compare
- 2+ repos → 进入 compare
- 某个 repo 无历史数据 → 跳过该 repo 并显示 warning
- 所有 repo 都无数据 → 显示 error 信息
- JSON 模式下跳过 ASCII 渲染，直接输出结构化的 dict

## 文件清单

| 文件 | 操作 | 说明 |
|------|:----:|------|
| `ara/history.py` | 编辑 | 新增 `cmd_history_compare()`, `_render_compare_ascii()`, `_render_compare_json()` |
| `ara/cli.py` | 编辑 | `repo` → `repos nargs="+"`, wrapper 改造 |
| `tests/test_history.py` | 编辑 | 新增 compare 模式测试 |

## 验收标准

- [ ] `ara history facebook/react vuejs/core` → 多色对比条状图
- [ ] `ara history facebook/react` → 保持原有单仓库折线图
- [ ] `ara history --json facebook/react vuejs/core` → JSON 多仓库输出
- [ ] `ara history facebook/react vuejs/core sveltejs/svelte` → 三仓库对比
- [ ] 所有历史测试仍然通过
- [ ] 新测试覆盖：1 repo（保持不变）、2 repos（compare mode）、3 repos、zero-data repo、JSON mode
- [ ] `python3 -m pytest tests/ -q --tb=no` → **260+ passed**
- [ ] `git commit` 提交
