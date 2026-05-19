# Task 014-A: 🔴 修复 format_multi_compare_table 截断缺陷

**分配给:** dev-1
**优先级:** P0 🔥
**来源:** Decision 014

---

## 任务描述

`ara/display.py` 中 `format_multi_compare_table` 函数在上个轮被截断——从 513 行开始但文件在 532 行结束，`for` 循环没有 body，也没有 `return` 语句。这导致 7 个测试全部失败（`TypeError: argument of type 'NoneType' is not iterable`）。

**核心动作：** 补全缺失的函数体。

---

## 技术步骤

### Step 1: 阅读当前文件尾部

```bash
cd /mnt/d/ai-startup-arena/alpha/repo
sed -n '513,532p' ara/display.py
```

当前残缺状态：

```python
def format_multi_compare_table(infos: list[dict]) -> str:
    """..."""
    lines = []
    lines.append(f"  {BOLD}{CYAN}Multi-Repo Comparison{RESET}")
    lines.append(f"  {GRAY}{'─' * 61}{RESET}")

    # Sort by stars descending
    sorted_infos = sorted(infos, key=lambda x: x.get("stars", 0), reverse=True)

    for i, info in enumerate(sorted_infos):
        name = info.get("full_name", "unknown")
        stars = info.get("stars", 0)
        forks = info.get("forks", 0)
    # ← 文件在这里结束！没有循环体，没有 return！
```

### Step 2: 补全函数 (在 ara/display.py 末尾追加)

需要补全的代码（在最后一行 `forks = info.get("forks", 0)` 之后追加）：

```python
        language = info.get("language") or "N/A"
        topics = info.get("topics") or []
        topics_str = ", ".join(str(t) for t in topics[:3])
        if len(topics) > 3:
            topics_str += f", +{len(topics)-3}"

        # Assign medal or rank number
        if i == 0:
            rank = f"  {GOLD}🥇{RESET}"
        elif i == 1:
            rank = f"  {GRAY}🥈{RESET}"
        elif i == 2:
            rank = f"  {GOLD}🥉{RESET}"
        else:
            rank = f"  {GRAY}{i+1}.{RESET}"

        lines.append(
            f"{rank} {BOLD}{name}{RESET}  "
            f"{YELLOW}{stars:,}{RESET} ★  "
            f"{GRAY}{forks:,}⑂{RESET}  "
            f"{language}  "
            f"{topics_str}"
        )

    lines.append("")
    lines.append(f"  {GRAY}{'─' * 61}{RESET}")

    # Winner declaration
    winner = sorted_infos[0]
    w_name = winner.get("full_name", "unknown")
    w_stars = winner.get("stars", 0)
    if len(sorted_infos) > 1:
        runner_up = sorted_infos[1]
        ru_stars = runner_up.get("stars", 0)
        lead = w_stars - ru_stars
        lines.append(
            f"🏆 {BOLD}{GREEN}{w_name}{RESET} WINS "
            f"by {lead:,} stars over {runner_up.get('full_name', 'unknown')}"
        )
    else:
        lines.append(f"🏆 {BOLD}{GREEN}{w_name}{RESET} — {w_stars:,} ★")

    lines.append("")
    return "\n".join(lines)
```

需要导入 colors 中的 `GOLD` 常量。检查 display.py 顶部 imports：

```python
from ara.colors import BOLD, CYAN, GRAY, GREEN, RED, RESET, YELLOW
```

改为：

```python
from ara.colors import BOLD, CYAN, GOLD, GRAY, GREEN, RED, RESET, YELLOW
```

### Step 3: 验证

```bash
python3 -m pytest tests/test_compare.py -v --tb=short
# 应该 7 passed

python3 -m pytest tests/ -q --tb=no
# 应该 242+ passed, 0 failed
```

---

## 文件清单

| 文件 | 操作 | 说明 |
|------|:----:|------|
| `ara/display.py` | 编辑 | 补全 `format_multi_compare_table` + 添加 GOLD import |

## 验收标准

- [ ] `python3 -m pytest tests/test_compare.py::TestMultiCompareTable -q` → **7 passed**
- [ ] `python3 -m pytest tests/ -q --tb=no` → **242+ passed, 0 failed**
- [ ] `ara compare facebook/react vuejs/core svelte` → 输出排行榜 + 🥇🥈🥉 + Winner
- [ ] `ara --help` → 仍显示 `compare` 命令
- [ ] `git diff ara/display.py` 只增加 import 和函数体（不删除任何代码）
