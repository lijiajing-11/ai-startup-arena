# Task 003-A: Fix test_info.py — format_compare_table import + assertion (dev-1)

**分配给:** dev-1
**优先级:** P0
**关联决策:** Decision 003 — Test Suite Cleanup & CI Pipeline Hardening

---

## 目标
修复 `tests/test_info.py` 中 2 个测试失败：
1. `test_format_compare_shows_winner` — import `format_compare_table` 并更新断言
2. `test_format_compare_tie` — import `format_compare_table` 替代已删除的 `format_compare`

## 根因分析
Decision 002 将 `display.py` 中的对比显示函数从 `format_compare()` 重构为 `format_compare_table()`，但 `test_info.py` 没有同步更新：
- 仍然尝试 `from ara.display import format_compare`（该函数已不存在）
- 断言检查旧输出格式 `"wins by 500"`，但新函数输出 `"Leads by 500 stars"`

## 涉及文件
- `tests/test_info.py` — 修改第 279-317 行

## 具体修改

### 修改 1: `test_format_compare_shows_winner` (第 279-301 行)

**当前代码:**
```python
def test_format_compare_shows_winner():
    """format_compare should indicate the winning repo."""
    from ara.display import format_compare
    ...
    output = format_compare(info_a, info_b)
    assert "owner/repo-a" in output
    assert "owner/repo-b" in output
    assert "wins by 500" in output
```

**修改为:**
```python
def test_format_compare_shows_winner():
    """format_compare_table should indicate the winning repo."""
    from ara.display import format_compare_table
    ...
    output = format_compare_table(info_a, info_b)
    assert "owner/repo-a" in output
    assert "owner/repo-b" in output
    assert "Leads by 500 stars" in output
```

### 修改 2: `test_format_compare_tie` (第 304-317 行)

**当前代码:**
```python
def test_format_compare_tie():
    """format_compare should handle ties."""
    from ara.display import format_compare
    ...
    output = format_compare(info, info)
    assert "tie" in output.lower() or "draw" in output.lower()
```

**修改为:**
```python
def test_format_compare_tie():
    """format_compare_table should handle ties."""
    from ara.display import format_compare_table
    ...
    output = format_compare_table(info, info)
    assert "tie" in output.lower() or "draw" in output.lower()
```

## 验证

```bash
cd /mnt/d/ai-startup-arena/alpha/repo
python3 -m pytest tests/test_info.py::test_format_compare_shows_winner tests/test_info.py::test_format_compare_tie -v
```

两个测试必须 PASS.

## 注意
不要改动 `test_format_compare_shows_winner` 中的测试数据（info_a, info_b 的 dict 结构保持不变）。`format_compare_table()` 要求 dict 包含 full_name, stars, forks, open_issues, language, license, created_at, updated_at，这些字段 info dict 里都有。

## 依赖关系
- 无依赖，这俩测试是纯 data 层测试（不需要 mock client）
- 先于/dev-2 的任务完成即可
