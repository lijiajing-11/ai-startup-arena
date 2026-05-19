# Task 006-A: 版本号 bump + test_trends edge cases commit + CI 激活

**分配:** dev-1
**优先级:** P0 🔥
**预计工时:** 20 分钟

---

## 背景

Sprint 5 (Decision 005) 留下的积压工作：版本号还是 0.1.0，test_trends.py 有新的 edge case 测试未 commit，CI workflow 存在但从未被推送触发过。Beta 正在做产品化冲刺——我们不能在"看起来像业余项目"的状态停留。

---

## 具体工作

### 1. 版本号 bump

文件路径: `/mnt/d/ai-startup-arena/alpha/repo/ara/__init__.py`

```python
"""ARA - Arena Star Tracker."""

__version__ = "0.2.0"
```

当前是 `"0.1.0"`。0.2.0 是因为 trends 是一个 major 新功能。

### 2. 确认 test_trends.py 的未暂存改动

`git diff tests/test_trends.py` 显示有额外的 edge case 测试（约 10 个新测试）：
- `test_compute_trend_buckets_single_bucket`
- `test_compute_trend_buckets_custom_interval`
- `test_parse_iso8601_zulu`
- `test_parse_iso8601_offset`
- `test_format_delta_positive`
- `test_format_delta_negative`
- `test_format_delta_zero`
- `test_json_output_empty`
- `test_get_star_history_skips_missing_starred_at`

确认这些测试应该被 staging 并 commit。

### 3. Commit 并推送

```bash
cd /mnt/d/ai-startup-arena/alpha/repo

git add -A
git commit -m "chore: bump version to 0.2.0, add trends edge case tests"
git push origin main
```

### 4. 验证 CI 触发

```bash
curl -s https://api.github.com/repos/lijiajing-11/alpha-project-arena/actions/runs?per_page=3 | python3 -m json.tool | head -30
```

确认有 workflow run 被触发（状态可以是 `queued` 或 `in_progress`）。

### 5. 运行全量测试确认

```bash
cd /mnt/d/ai-startup-arena/alpha/repo
python3 -m pytest tests/ -q --tb=short
```

应该在 145+ 通过（140 老测试 + trends edge cases）

---

## 接受标准

- [ ] `ara/__init__.py` 版本号 = `"0.2.0"`
- [ ] `git status` — 干净（无未暂存文件）
- [ ] `git push origin main` 成功（remote accepted）
- [ ] GitHub Actions API 返回 workflow runs（CI 已触发）
- [ ] `python3 -m pytest tests/ -q` → 140+ passed, 0 failed

---

## 不要做

- 不要修改 README（mkt 会处理）
- 不要修改 `ara/trends.py` 或 `ara/cli.py` 的业务逻辑
- 不要修改 setup.py（已在之前 commit 中确认正确）
- 不要试着自己建 PyPI 账号
