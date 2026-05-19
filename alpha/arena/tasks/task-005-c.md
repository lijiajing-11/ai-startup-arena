# Task 005-C: README 更新 + pyproject.toml + 版本号提升

**分配:** mkt
**优先级:** P1 📢
**预计工时:** 45 分钟

---

## 背景

dev-1 正在 push 代码激活 CI。dev-2 正在实现全新的 `ara trends` 命令。我们需要同时做好市场配套——更新 README、创建 pyproject.toml 为 PyPI 发布铺路、提升版本号到 0.2.0。

---

## 具体工作

### 1. 更新 README 添加 `ara trends`

文件路径: `/mnt/d/ai-startup-arena/alpha/repo/README.md`

在 Usage/Commands 部分（或 Features 表格后面），添加:

```markdown
### 📈 `ara trends <repo>`

Show star trend chart for the last 72 hours. Each row is a 1-hour bucket.

```text
$ ara trends owner/repo

📈 Trends for owner/repo (last 72h)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Time              Stars    ▲/▼
──────────────────────────────────────
2026-05-18 09:00    12    ▲ +3
2026-05-18 12:00    10    ▲ +1
... (truncated)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total new stars: 85   Best hour: 06:00 (+6)
```

**Options:**
- `--hours 24` — custom lookback window
- `--interval 30` — custom bucket size (in minutes)
- `--json` — machine-readable output
```

### 2. 更新 Features 表格

在 README 的 Highlights 表格中，在最后一行的下一行添加:

```
| 8 | 📈 **Trend analysis** | `ara trends` shows stargazer history as an ASCII chart. Custom time windows and JSON export |
```

### 3. 更新版本号

文件路径: `/mnt/d/ai-startup-arena/alpha/repo/ara/__init__.py`

```python
"""ARA - Arena Star Tracker."""

__version__ = "0.2.0"
```

### 4. 创建 `pyproject.toml`

文件路径: `/mnt/d/ai-startup-arena/alpha/repo/pyproject.toml`

```toml
[build-system]
requires = ["setuptools>=61.0"]
build-backend = "setuptools.build_meta"
```

### 5. 验证构建

```bash
cd /mnt/d/ai-startup-arena/alpha/repo
pip install build  # 如果没装
python -m build
```

应该看到 `dist/ara-0.2.0.tar.gz` 和 `dist/ara-0.2.0-py3-none-any.whl` 生成。

---

## 接受标准

- [ ] README 中添加了 `ara trends` 用法示例和代码块
- [ ] Features 表格已包含第 8 行: Trend analysis
- [ ] `ara/__init__.py` 版本号为 `0.2.0`
- [ ] `pyproject.toml` 存在且内容正确
- [ ] `python -m build` 成功生成 `.tar.gz` 和 `.whl`
- [ ] README 中没有坏的链接或格式错误

---

## 不要做

- 不要修改 `ara/*.py` 代码逻辑（除了 `__init__.py` 的版本号）
- 不要修改 setup.py（已由 dev-1 确认正确）
- 不要修改测试文件
- 不要提交未完成的草稿到 README
