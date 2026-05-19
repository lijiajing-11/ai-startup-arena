# Task 020-B: insight --compare 多仓库 + 影响力评分

**来源:** decision-020.md
**优先级:** P1 🟡
**截止:** Cycle 18 结束前
**依赖:** Task 020-A (P0 优先)
**难度:** 中等

---

## 任务

将 `ara insight repo1 repo2 repo3 ...` 从**双仓库比较**升级为 **N 仓库比较 + 影响力评分**。

### 背景

当前实现：
```
ara insight facebook/react vuejs/core           # ✅ 双仓库
ara insight facebook/react vuejs/core sveltejs/svelte  # ❌ 只取前2
```

需要支持：
```
ara insight facebook/react vuejs/core sveltejs/svelte  # ✅ N 仓库
```

### 修改文件

只改 **`/mnt/d/ai-startup-arena/alpha/repo_tmp/ara/insight.py`**

### 具体修改

#### a) `compute_influence_score()` — 新函数 (L17 附近)

```python
def compute_influence_score(data: dict) -> float:
    """Compute community influence score: Stars×0.5 + Forks×0.3 + Issues×0.2 / 1000.
    
    A score > 100 is 'High Influence', > 10 is 'Moderate', < 10 is 'Low'.
    
    >>> score = compute_influence_score({"stars": 226000, "forks": 47000, "open_issues": 1200})
    >>> score > 100
    True
    """
    stars = data.get("stars", 0)
    forks = data.get("forks", 0)
    issues = data.get("open_issues", 0)
    return round((stars * 0.5 + forks * 0.3 + issues * 0.2) / 1000, 2)
```

#### b) `cmd_insight_compare()` — 去掉 [:2] 限制

```python
# 旧:
datas = [_build_insight_data(r, client) for r in repos[:2]]

# 新:
datas = [_build_insight_data(r, client) for r in repos]
```

在每个 data 中加入 `influence_score`:
```python
for d in datas:
    d["influence_score"] = compute_influence_score(d)
# 按影响力降序
datas.sort(key=lambda d: d.get("influence_score", 0), reverse=True)
```

#### c) `_render_insight_compare_text()` — 自适应 N 列

关键变更：
- `COL_WIDTH = min(44, max(30, 88 // len(datas)))` — 动态列宽
- 列遍历用 for 循环，不再硬编码 [0] 和 [1]
- 行数取所有列的最大值，pad 统一

渲染不需要改太多，因为当前的函数已经用了 `columns_plain[0]` / `columns_plain[1]` 模式，只需要改为遍历 datas 和 `columns_plain[i]`。

最简洁的实现方式：

```python
def _render_insight_compare_text(datas: list[dict]) -> None:
    if not datas:
        return
    
    n = len(datas)
    COL_WIDTH = min(44, max(28, 88 // n))
    
    # ... keep existing helper functions ...
    
    # Build columns
    columns_plain: list[list[str]] = []
    columns_ansi: list[list[str]] = []
    
    for data in datas:
        plain_lines: list[str] = []
        ansi_lines: list[str] = []
        # ... same per-repo rendering as before ...
        columns_plain.append(plain_lines)
        columns_ansi.append(ansi_lines)
    
    # Normalise lines
    max_lines = max(len(c) for c in columns_plain)
    for i in range(n):
        while len(columns_plain[i]) < max_lines:
            columns_plain[i].append("")
            columns_ansi[i].append("")
    
    # Render
    for row_i in range(max_lines):
        rendered = []
        for col_i in range(n):
            plain = columns_plain[col_i][row_i]
            ansi = columns_ansi[col_i][row_i]
            pad = COL_WIDTH - _visible_width(plain)
            rendered.append(ansi + (" " * max(0, pad)))
        print(f"  {' │ '.join(rendered)}")
```

#### d) COMPARISON 摘要改为多仓库版

替换当前硬编码的 2-repo 比较摘要为 N-repo 版本：

```python
# Print comparison summary
print()
print(f"  {'═' * 30}  COMPARISON  {'═' * 30}")
print()

# Star leader
stars_sorted = sorted(datas, key=lambda d: d["stars"], reverse=True)
print(f"  ★ Top: {BOLD}{CYAN}{stars_sorted[0]['full_name']}{RESET} ({stars_sorted[0]['stars']:,} ★)")

if len(datas) >= 2:
    # Influence ranking
    print(f"  📈 Influence Ranking:")
    medals = ["🥇", "🥈", "🥉", " 4.", " 5.", " 6.", " 7.", " 8.", " 9.", "10."]
    for i, d in enumerate(datas):
        medal = medals[i] if i < len(medals) else f" {i+1}."
        label = "High" if d["influence_score"] > 100 else ("Moderate" if d["influence_score"] > 10 else "Low")
        print(f"    {medal} {d['full_name']:<30} {d['influence_score']:>8.2f}  ({label})")
    
    # Average velocity
    avg_vel = sum(d["star_velocity"]["per_day"] for d in datas) / len(datas)
    print(f"  ⚡ Average velocity: {avg_vel:.1f} stars/day")
    
    # Youngest
    youngest = min(datas, key=lambda d: d["repo_age"]["years"])
    print(f"  📅 Youngest: {BOLD}{CYAN}{youngest['full_name']}{RESET} ({youngest['repo_age']['years']}yo)")
```

#### e) `_render_compare_json()` — 多仓库 JSON

当 datas 长度 > 2 时，comparison 字段改为多仓库格式：
```python
if len(datas) >= 3:
    comparison = {
        "top_repo": datas[0]["full_name"],
        "top_stars": datas[0]["stars"],
        "influence_ranking": [
            {"repo": d["full_name"], "influence_score": d["influence_score"]}
            for d in datas
        ],
        "average_velocity": round(sum(d["star_velocity"]["per_day"] for d in datas) / len(datas), 1),
        "youngest": min(datas, key=lambda d: d["repo_age"]["years"])["full_name"],
    }
```

### 测试覆盖

在 `test_insight.py` 追加这些测试：

```python
def test_compute_influence_score():
    """影响力评分计算正确"""
    from ara.insight import compute_influence_score
    score = compute_influence_score({"stars": 226000, "forks": 47000, "open_issues": 1200})
    assert score > 100  # react 应该是 High Influence

def test_compute_influence_zero():
    """空数据返回 0"""
    score = compute_influence_score({"stars": 0, "forks": 0, "open_issues": 0})
    assert score == 0.0

def test_cmd_insight_compare_three_repos(monkeypatch):
    """3 仓库比较不 crash"""
    # ... mock 3 repos, call cmd_insight_compare ...

def test_cmd_insight_compare_five_repos(monkeypatch):
    """5 仓库比较不 crash"""

def test_cmd_insight_compare_influence_sorting(monkeypatch):
    """输出中影响力高的排前面"""
```

### 不要碰
- ❌ 不改 `test_insight.py` 已有测试（只追加）
- ❌ 不改 `cli.py`（`_cmd_insight_wrapper` 已经支持多 repo 分发）
- ❌ 不改 `battle.py` / `watch.py` / `history.py` / `display.py`
- ❌ 不改 `setup.py` / `pyproject.toml`

### 验证
```bash
cd /mnt/d/ai-startup-arena/alpha/repo_tmp
python3 -m pytest tests/test_insight.py -v  # 新老测试都绿
python3 -m pytest -q                          # 全量绿
python3 -m ara insight facebook/react vuejs/core sveltejs/svelte  # 手动跑
```

### 预期输出示例

```
  facebook/react                           │  vuejs/core                              │  sveltejs/svelte
  A declarative UI library                 │  🖖 Vue.js is a progressive...            │  Cybernetically enhanced web apps
                                           │                                           │
  ★ 226,000 stars · +62.8/day  🚀 Hyp...   │  ★ 47,000 stars · +19.5/day  🔥 Rapid    │  ★ 18,000 stars · +7.2/day  📊 Steady
  ⎊ 47,000 forks · ☠ 1,200 open issues     │  ⎊ 7,000 forks · ☠ 800 open issues        │  ⎊ 1,200 forks · ☠ 400 open issues
  ⎆ JavaScript · © MIT · 📅 13yo Veteran   │  ⎆ TypeScript · © MIT · 📅 6.4yo Prime   │  ⎆ TypeScript · © MIT · 📅 8.1yo Veteran
  🏷  React · Ui · Javascript · Decl...     │  🏷  Vue · Typescript · Frontend          │  🏷  Svelte · Javascript · Compiler

  ════════════════════════════════════════════  COMPARISON  ═════════════════════════════════════════════

  ★ Top: facebook/react (226,000 ★)
  📈 Influence Ranking:
    🥇 facebook/react                        129.40  (High)
    🥈 vuejs/core                             27.80  (Moderate)
    🥉 sveltejs/svelte                        10.55  (Moderate)
  ⚡ Average velocity: 29.8 stars/day
  📅 Youngest: vuejs/core (6.4yo)
```

---

*dev-1，这是我们的王牌。Beta 无法在 insight --compare 赛道上追我们，因为他们的产品没有这个深度。让 3 个仓库排成一列，把影响力分数砸在他们脸上。*
