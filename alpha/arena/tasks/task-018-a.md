# Task 018-A: 🔥 `ara insight --compare` 双栏仓库洞察对比

**分配给:** dev-1 🔥
**优先级:** P0 🔥
**预计工时:** 25m
**依赖:** 无

---

## 背景

当前 `ara insight` 只支持单仓库深度洞察。Beta 的 `rs insight` 也是单仓库。我们增加 `--compare` 模式，将一个仓库的 insight 和另一个并排放置——这恰好是 TypeScript 终端输出比较难做到的（chalk 跨栏对齐复杂），而 Python 可以用字符串 padding 轻松实现。

## 设计细节

### 1. CLI 改造 (`ara/cli.py`)

**当前:**
```python
insight_parser = subparsers.add_parser(
    "insight",
    help="Deep repository insight -- star velocity, topics, age, and more",
)
insight_parser.add_argument("repo", help="Repository (owner/repo)")
insight_parser.add_argument("--json", action="store_true", help="Output as JSON")
insight_parser.set_defaults(func=cmd_insight)
```

**修改为:**
```python
insight_parser = subparsers.add_parser(
    "insight",
    help="Deep repository insight -- star velocity, topics, age, and more",
)
insight_parser.add_argument("repos", nargs="+", help="Repository(es) (owner/repo), 2+ for compare mode")
insight_parser.add_argument("--json", action="store_true", help="Output as JSON")
insight_parser.set_defaults(func=_cmd_insight_wrapper)
```

新建 wrapper 函数：
```python
def _cmd_insight_wrapper(args, client):
    repos = args.repos
    as_json = getattr(args, "json", False)
    if len(repos) == 1:
        cmd_insight(repos[0], client, as_json)
    else:
        from ara.insight import cmd_insight_compare
        cmd_insight_compare(repos, client, as_json)
```

### 2. 新函数 `_render_insight_compare_text` (`ara/insight.py`)

核心渲染逻辑——双栏并排输出。

```python
def _render_insight_compare_text(datas: list[dict]) -> None:
    """Render two insight data dicts side-by-side.
    
    Args:
        datas: list of dicts from _build_insight_data(), max 2 repos
    """
```

**实现思路：**

1. 对每个 data dict 渲染左列/右列的文本行
2. 测量仓库名长度，取最大宽度对齐
3. 左列和右列之间用 `  │  ` 分隔
4. 底部追加「对比摘要行」

**每列渲染内容（对齐单个 repo insight 输出）：**
```
  facebook/react — Insight                     vuejs/core — Insight
  A declarative UI library                     🖖 Vue.js is a progressive...
  
  ★ 226,000 stars  ·  +46.2/day  🚀 Hypersonic  ★ 47,000 stars  ·  +9.5/day  🔥 Rapid
  ⑂ 47,000 forks  ·  ⚠ 1,200 open issues      ⑂ 7,000 forks  ·  ⚠ 800 open issues
  ⎆ JavaScript  ·  © MIT                       ⎆ TypeScript  ·  © MIT
  🏷 React, ui, javascript, declarative        🏷 vue, typescript, frontend
  📅 Created 2013-05-29  ·  Today              📅 Created 2019-12-14  ·  Today
```

注意：**每行左右两半的总宽度应该相等**。每个半栏宽度 = 44 字符（半栏宽）：
- 仓库名行：`{bold}{cyan}{name:44}{reset}`
- 星数行：`{stars:>7,}  {label:20}` 组合后 padding
- 其余行同理

**底部对比摘要：**
```
  ═══════════════════════  COMPARISON  ═══════════════════════
  
  ★ Star gap: facebook/react leads by 179,000 ★
  🔥 Velocity: facebook/react is 4.9× faster (46.2 vs 9.5/day)
  📅 Age gap: vuejs/core is 6.5 years younger
  🏷 Topic overlap: 0 shared topics
```

### 3. JSON 模式 (`_render_compare_json`)

```python
def _render_compare_json(datas: list[dict]) -> str:
    import json as _json
    return _json.dumps({
        "command": "insight",
        "mode": "compare",
        "repos": datas,
        "comparison": {
            "star_leader": datas[0]["full_name"] if datas[0]["stars"] >= datas[1]["stars"] else datas[1]["full_name"],
            "star_gap": abs(datas[0]["stars"] - datas[1]["stars"]),
            "velocity_leader": datas[0]["full_name"] if datas[0]["star_velocity"]["per_day"] >= datas[1]["star_velocity"]["per_day"] else datas[1]["full_name"],
            "velocity_ratio": round(max(d["star_velocity"]["per_day"] for d in datas) / max(0.1, min(d["star_velocity"]["per_day"] for d in datas)), 1),
        }
    }, indent=2, ensure_ascii=False)
```

### 4. CLI hunk 一览

**Old:**
```python
insight_parser.add_argument("repo", ...)
insight_parser.set_defaults(func=cmd_insight)
```

**New:**
```python
insight_parser.add_argument("repos", nargs="+", ...)
insight_parser.set_defaults(func=_cmd_insight_wrapper)
```

同时把 `cmd_insight` 和 `cmd_insight_json` 改成接收 explicit params 而非 args namespace：

```python
def cmd_insight(repo: str, client: GitHubClient, as_json: bool = False) -> None:
    ...
def cmd_insight_json(...):  # merge into cmd_insight with as_json param
```

### 5. 不兼容处理

- 确保 `cmd_insight` signature 改变不影响其他调用者（是只有 CLI dispatch 在调用）
- 在 cli.py 的 `_cmd_insight_wrapper` 中转发

## 文件清单

| 文件 | 操作 | 说明 |
|------|:----:|------|
| `ara/insight.py` | 编辑 | 新增 `_render_insight_compare_text()`, `_render_compare_json()`, `cmd_insight_compare()`；改造 `cmd_insight()` 签名 |
| `ara/cli.py` | 编辑 | Insight 解析器：`repo` → `repos nargs="+"`, wrapper dispatch |
| `tests/test_insight.py` | 编辑 | 新增 compare 模式测试（2 repos, compare, JSON compare） |

## 验收标准

- [ ] `ara insight --compare facebook/react vuejs/core` → 双栏并排 insight
- [ ] `ara insight facebook/react` → 保持原有单仓库行为
- [ ] `ara insight --compare --json facebook/react vuejs/core` → JSON 双仓库 + comparison 摘要
- [ ] 底部 COMPARISON 行包含 star gap、velocity ratio、age gap、topic overlap
- [ ] 所有已有测试仍然通过
- [ ] `python3 -m pytest tests/ -q --tb=short` → **265+ passed, 0 failed**
- [ ] `git commit` 提交

---

*dev-1, `insight --compare` 是我们的下一个差异化王牌。Beta 的 `rs insight` 只能看一个仓库，我们的能并排比。而且 TypeScript + chalk 做双栏对齐比 Python 难得多——这是我们 Python 的天然优势。25 分钟，两个仓库的 insight 变双栏对决。🚀*

---

> NOTE for dev-1: 当前 `ara insight` 的 `cmd_insight` 接收 argparse.Namespace 作为 `args`。你需要把它改为接收显式参数 `(repo, client, as_json=False)`，然后在 cli.py 的 wrapper 中解包 args。这样可以复用 `_build_insight_data` + `_render_insight_text`。不需要重写现有逻辑，只需要加新函数。
