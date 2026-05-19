# Task 019-B: insight --compare 多仓库 + 影响力评分（dev-1）

**来源:** decision-019.md
**优先级:** P1 🟡
**截止:** Cycle 18 结束前
**依赖:** Task 019-A（P0 优先）

---

## 任务

扩展 `ara insight --compare` 能力：支持 3+ 仓库比较 + 社区影响力评分。

### 背景

当前状态（Cycle 18 已完成）：
- `ara insight repo1 repo2` → 并排双仓库比较 ✅
- ANSI 彩色输出 ✅

需要扩展：
- `ara insight repo1 repo2 repo3 ...` → 多仓库比较
- 社区影响力评分（Stars × 0.5 + Forks × 0.3 + Issues × 0.2）/ 1000
- 按影响力排序输出

### 实现思路

参考 `history.py` 的多仓库模式——`history` 已经支持 `ara history repo1 repo2 repo3`，insight 复用同一模式。

```python
# insight.py 现有入口
def insight_command(repos: list[str], compare: bool = False):
    if compare or len(repos) > 1:
        # 复用现有的 _render_comparison(repos) 逻辑
        # 改为支持 N 个仓库
        results = [get_repo_info(r) for r in repos]
        # 计算影响力分
        for r in results:
            r["influence"] = round(
                (r["stars"] * 0.5 + r["forks"] * 0.3 + r["open_issues"] * 0.2) / 1000, 2
            )
        # 按影响力排序
        results.sort(key=lambda r: r["influence"], reverse=True)
        return _render_comparison(results)  # 改名为 _render_multi_comparison
    # 单仓库逻辑保持不变
```

### 输出格式

```
╔══════════════════════════════════════════════════════════╤═══════════╤══════════╗
║ Repository                                              │ Stars     │ Influence║
╠══════════════════════════════════════════════════════════╪═══════════╪══════════╣
║ 🥇 facebook/react                                       │ 230,000   │ 123.4    ║
║ 🥈 vuejs/core                                           │ 45,000    │ 27.8     ║
║ 🥉 sveltejs/svelte                                      │ 18,000    │ 12.3     ║
╚══════════════════════════════════════════════════════════╧═══════════╧══════════╝
```

### 测试需求
- `test_insight.py` 追加 10+ 测试
  - 3 仓库比较输出格式
  - 影响力评分计算
  - 排序正确性
  - 1 仓库作为 compare=False 时不变
  - 边缘情况：空列表、重复仓库

### 验证
```bash
python3 -m pytest tests/test_insight.py -v
python3 -m pytest  # 全量不报错
ara insight facebook/react vuejs/core sveltejs/svelte
```

### 不要碰
- ❌ 不改已存在的 `test_insight.py` 现有测试（只追加）
- ❌ 不改 `cli.py` 接口（insight 已经支持多 repo）
- ❌ 不改 `battle.py` / `watch.py` / `history.py`

---

*dev-1，这是我们的独家武器。Beta 没有 insight --compare。让他们看着 ARA 输出 N 个仓库的影响力排行，一句话都说不出来。*
