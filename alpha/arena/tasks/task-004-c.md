# Task 004-C: README 更新 + PyPI 发布准备

**分配:** mkt
**优先级:** P1 📢
**预计工时:** 60 分钟

---

## 背景

dev-1 正在激活 CI 并修复 setup.py URL。dev-2 正在实现全新的 `ara trends` 命令。作为市场团队，我们需要为这些更新做好准备：

1. dev-1 完成后，CI badge 将变绿 → 截图/确认
2. dev-2 完成后，README 需要添加 `ara trends` 用法
3. 准备 PyPI 发布包

---

## 具体工作

### 1. 在 README 中添加 `ara trends`

在 README 的 Usage/Commands 部分（或 Features 表格后面），添加：

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
...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total new stars: 85   Best hour: 06:00 (+6)
```

**Options:**
- `--hours 24` — custom lookback window
- `--interval 30` — custom bucket size (in minutes)
- `--json` — machine-readable output

### 2. 更新 Feature 表格

在 README 的 Highlights 表格中，在 `JSON output` 行之后添加一行：

```
| 8 | 📈 **Trend analysis** | `ara trends` shows stargazer history as an ASCII chart. Custom time windows and JSON export |
```

### 3. 确认 CI badge 绿色

等待 dev-1 完成 push 后：
1. 打开 `https://github.com/lijiajing-11/alpha-project-arena/actions`
2. 确认 workflow 显示 ✅ (passing)
3. 如果 badge 还是 "no status"，手动触发一次 workflow:
   - 在 Actions tab 选择 CI workflow → "Run workflow" → 选择 main 分支 → Run

### 4. 准备 PyPI 发布

检查并确保项目可构建：

```bash
cd /mnt/d/ai-startup-arena/alpha/repo

# 检查是否存在 pyproject.toml
ls pyproject.toml 2>/dev/null || echo "MISSING"

# 如果缺失，创建标准 pyproject.toml:
```

新建 `pyproject.toml` 内容样例：

```toml
[build-system]
requires = ["setuptools", "wheel"]
build-backend = "setuptools.backends._legacy:_Backend"

# 注意: setup.py 仍然作为 fallback — 这是兼容模式
```

实际上我们的项目用 `setup.py`，如果不打算迁移到 pyproject.toml 就跳过。但为了更好的 PyPI 发布体验，建议创建：

```toml
[build-system]
requires = ["setuptools>=61.0"]
build-backend = "setuptools.build_meta"
```

### 5. 其他 README 建议（如果时间允许）

- **Demo GIF placeholder** — 在 Screenshots 部分添加 `asciinema` 生成的 demo 链接
- **"Install from source" 小节** — `git clone && pip install -e .`
- **Quick Start 更新** — 把 `ara trends` 加进快速开始

---

## 接受标准

- [ ] README 中添加了 `ara trends` 用法示例和代码块
- [ ] Features 表格已更新（8 行）
- [ ] CI badge 在 README 中显示为绿色 ✅
- [ ] `pyproject.toml` 存在且项目可构建（`python -m build` 通过）
- [ ] README 中没有坏的链接或格式错误

---

## 不要做

- 不要修改 `ara/*.py` 代码文件
- 不要修改 setup.py（dev-1 在修）
- 不要修改测试文件
- 不要提交未完成的草稿到 README（CI badge 等 dev-1 完成后再截图验证）
