# Task 012-A: `ara compare` 扩展为 3+ repos 多仓库对比

**分配给:** dev-1
**优先级:** P0 🔥
**来源:** Decision 012

---

## 任务描述

将现有的 `ara compare <repo1> <repo2>` 扩展为支持 3+ 仓库的 N 方对比。当前 `compare` 命令只接受恰好 2 个仓库（`nargs=2`），扩展后应自动检测输入数量：
- 2 个仓库 → 保持现有行为不变（表格对比）
- 3+ 个仓库 → 展示多仓库对比模式（紧凑对比条/排行表）

## 现有代码

### `ara/cli.py` —— 当前 compare 注册

```python
compare_parser = subparsers.add_parser(
    "compare", help="Compare two repositories side-by-side"
)
compare_parser.add_argument(
    "repos", nargs=2, help="Two repositories to compare (owner/name format)"
)
```

需要改为 `nargs="+"`（1 个以上）。

### `ara/cli.py` —— 当前 `cmd_compare`

```python
def cmd_compare(args: argparse.Namespace, client: GitHubClient) -> None:
    \"\"\"Handle `ara compare <repo1> <repo2>`.\"\"\"
    repo1, repo2 = args.repos[0], args.repos[1]
    info1 = client.get_repo_info(repo1)
    info2 = client.get_repo_info(repo2)
    print(format_compare_table(info1, info2))
```

### `ara/display.py` —— 当前 `format_compare_table`

已有 `format_compare_table` 函数，用于 2 仓库表格对比。需要新增 `format_multi_compare_table` 函数。

## 技术步骤

### Step 1: 修改 `cli.py` compare 注册

```python
compare_parser = subparsers.add_parser(
    "compare", help="Compare repositories side-by-side (2+)"
)
compare_parser.add_argument(
    "repos", nargs="+", help="Repos to compare (owner/name format, 2+)"
)
```

### Step 2: 修改 `cmd_compare` 函数

```python
def cmd_compare(args: argparse.Namespace, client: GitHubClient) -> None:
    \"\"\"Handle `ara compare <repo1> <repo2> [<repo3> ...]`.\"\"\"
    repos = args.repos
    infos = [client.get_repo_info(r) for r in repos]
    
    if len(infos) == 2:
        # 保持现有 2 仓库行为
        print(format_compare_table(infos[0], infos[1]))
    else:
        # 多仓库对比
        print(format_multi_compare_table(infos))
```

### Step 3: 创建 `format_multi_compare_table` 函数

在 `ara/display.py` 中新增：

```python
def format_multi_compare_table(infos: list[dict]) -> str:
    \"\"\"Format 3+ repos into a compact multi-repo comparison table.\"\"\"
    lines = []
    lines.append(f"  {BOLD}{CYAN}Multi-Repo Comparison{RESET}")
    lines.append(f"  {GRAY}─" * 50 + RESET)
    
    # Sort by stars descending
    sorted_infos = sorted(infos, key=lambda x: x.get('stars', 0), reverse=True)
    
    for i, info in enumerate(sorted_infos):
        name = info.get('full_name', 'unknown')
        stars = info.get('stars', 0)
        forks = info.get('forks', 0)
        lang = info.get('language') or 'N/A'
        topics = info.get('topics', [])
        topics_str = ', '.join(topics[:3]) if topics else ''
        
        medal = {0: GOLD + f"🥇 {BOLD}", 1: "🥈 ", 2: "🥉 "}.get(i, f"  {i+1}. ")
        rank_str = medal
        
        line = f"  {rank_str}{name:<25} {stars:>8,} ★  {forks:>5,} ⑂  {lang:<12}"
        if topics_str:
            line += f"  {GRAY}{topics_str}{RESET}"
        lines.append(line)
    
    # Show winner
    winner = sorted_infos[0]
    lines.append("")
    lines.append(f"  🏆 Winner: {BOLD}{winner.get('full_name')}{RESET} ({winner.get('stars'):,} ★)")
    lines.append("")
    
    return '\n'.join(lines)
```

需要引入 `GOLD` 常量——在 `ara/colors.py` 中追加：
```python
GOLD = "\033[93m"
```

### Step 4: 更新 `cmd_compare_json`

```python
def cmd_compare_json(args: argparse.Namespace, client: GitHubClient) -> None:
    \"\"\"Handle `ara compare --json <repo1> <repo2> ...`.\"\"\"
    repos = args.repos
    results = client.get_multiple_repos_info(repos)
    
    # 直接输出所有结果（不限制 2 个）
    errors = [r for r in results if "error" in r]
    clean = [r for r in results if "error" not in r]
    
    # 胜出者逻辑
    winner = None
    lead_by = None
    if len(clean) >= 2:
        sorted_clean = sorted(clean, key=lambda x: x.get("stars", 0), reverse=True)
        winner = sorted_clean[0].get("full_name")
        if len(sorted_clean) > 1:
            lead_by = sorted_clean[0].get("stars", 0) - sorted_clean[1].get("stars", 0)
    
    print(json_result({
        "command": "compare",
        "repos": clean if clean else results,
        "winner": winner,
        "lead_by": lead_by,
        "total": len(repos),
        "errors": errors or None,
    }))
```

### Step 5: 测试

创建或更新 `tests/test_compare.py`：

```python
\"\"\"Tests for multi-repo compare (3+ repos).\"\"\"

import pytest
from ara.display import format_multi_compare_table


class TestMultiCompare:
    def test_three_repos_formatting(self):
        \"\"\"3 repos should produce a ranked table with winner.\"\"\"
        infos = [
            {"full_name": "repo/a", "stars": 100, "forks": 10, "language": "Python", "topics": ["web"]},
            {"full_name": "repo/b", "stars": 200, "forks": 20, "language": "JS", "topics": ["frontend"]},
            {"full_name": "repo/c", "stars": 50, "forks": 5, "language": "Rust", "topics": ["cli"]},
        ]
        result = format_multi_compare_table(infos)
        assert "Multi-Repo Comparison" in result
        assert "repo/b" in result  # winner
        assert "repo/a" in result
        assert "repo/c" in result
        assert "Winner" in result

    def test_two_repos_fallback(self):
        \"\"\"2 repos should still work via cmd_compare (existing test).\"\"\"
        # This is covered by existing compare tests
    
    def test_single_repo_error(self):
        \"\"\"1 repo should not trigger multi-compare (nargs=+ but we validate).\"\"\"
        with pytest.raises(ValueError, match="at least 2"):
            # cmd_compare should raise if < 2 repos
            pass  # handled by argparse nargs=+ but we should add validation

    def test_tie_handling(self):
        \"\"\"Equal stars should show tie.\"\"\"
        infos = [
            {"full_name": "repo/a", "stars": 100, "forks": 10, "language": "Python", "topics": ["web"]},
            {"full_name": "repo/b", "stars": 100, "forks": 20, "language": "JS", "topics": []},
        ]
        result = format_multi_compare_table(infos)
        assert "Winner" in result
    
    def test_no_topics(self):
        \"\"\"Repos without topics should still display cleanly.\"\"\"
        infos = [
            {"full_name": "minimal/repo", "stars": 50, "forks": 5, "language": "Go", "topics": []},
        ]
        # Should not crash with empty topics
        result = format_multi_compare_table(infos)
        assert "minimal/repo" in result
```

### Step 6: 验证

```bash
python3 -m pytest tests/ -q --tb=no
# 应显示 219+ passed（原有测试 + 新增 compare 扩展测试）
```

---

## 设计要求

1. **向后兼容** — `ara compare repoA repoB` 必须和以前一样工作
2. **排序展示** — 多仓库模式按星数降序排列
3. **视觉区分** — 前三名用 🥇🥈🥉 徽章
4. **优雅降级** — 空 topics 显示整洁，不崩溃
5. **N 方无限制** — 3 个、5 个、10 个仓库都支持

## 输出示例

```
  Multi-Repo Comparison
  ────────────────────────────────────────────────────────
  🥇 facebook/react             226,000 ★  47,000 ⑂  JavaScript    react, ui, javascript
  🥈 vercel/next.js             126,000 ★  26,000 ⑂  JavaScript    react, ssr, framework
  🥉 vuejs/core                  47,000 ★   7,000 ⑂  TypeScript    vue, frontend, reactive
    4  sveltejs/svelte           82,000 ★   4,000 ⑂  TypeScript    svelte, compiler

  🏆 Winner: facebook/react (226,000 ★)
```

---

## 接受标准

- [ ] `ara compare repoA repoB repoC` → 多仓库对比表，前三名有 🥇🥈🥉
- [ ] `ara compare repoA repoB` → 保持现有 2 仓库表格行为
- [ ] `ara compare --json repoA repoB repoC` → JSON 输出包含所有仓库
- [ ] 新增测试 ≥ 5 个
- [ ] `python3 -m pytest tests/ -q` → 219+ passed, 0 failed
- [ ] 不破坏任何现有命令和测试
