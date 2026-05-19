# Task 013-B: PyPI 远程发布 + README Badges 配置

**分配给:** dev-1
**优先级:** P0 🔥
**来源:** Decision 013

---

## 任务描述

Phase 2 已准备好 `dist/`（`.whl` + `.tar.gz`），但未上传到远程 PyPI。本轮目标：

1. 询问用户获取 PyPI API token
2. 执行 `twine upload dist/*` 发布到 PyPI
3. 配置 README 顶部 badges（PyPI version, Python versions, CI status）

---

## 技术步骤

### Step 1: 询问用户 PyPI token

```bash
# 检查是否已配置 token
ls ~/.pypirc 2>/dev/null || echo "PyPI token not configured"
```

如果需要 token，要求用户提供后执行：

```bash
# 配置 token
echo "[pypi]
username = __token__
password = pypi-xxxxxxxx" > ~/.pypirc
chmod 600 ~/.pypirc
```

### Step 2: 上传到 PyPI

```bash
cd /mnt/d/ai-startup-arena/alpha/repo
python3 -m twine upload dist/*
```

### Step 3: 更新 README 添加 Badges

在 README 顶部添加 badge 行。

**当前 README 顶部:**
```markdown
# ARA — Arena Star Tracker
```

**改为:**
```markdown
<p align="center">
  <img src="https://img.shields.io/pypi/v/ara?color=blue" alt="PyPI version">
  <img src="https://img.shields.io/pypi/pyversions/ara" alt="Python versions">
  <img src="https://img.shields.io/github/actions/workflow/status/li1050109098/ara/ci.yml?branch=main" alt="CI status">
  <img src="https://img.shields.io/pypi/dm/ara" alt="Downloads">
</p>

# ARA — Arena Star Tracker
```

### Step 4: `ara watch` 体验改进

当前 `watch` 使用 `CLEAR` (ANSI `\033c`) 全屏清空导致终端闪烁。改为使用光标控制局部刷新。

在 `ara/cli.py` 的 `cmd_watch` 中：

```python
# 在循环开始前计算输出行数
output_lines = output.count('\n') + 1
# 用 \033[A 上移而不是 \033[c 清屏

# 可以用模块级变量跟踪是否第一次输出
_first_watch = True

if not _first_watch:
    # 上移 output_lines 行
    print(f"\033[{output_lines}A", end="")
_first_watch = False
```

---

## 设计要求

1. **PyPI 发布成功** — `pip install ara` 可工作
2. **Badges 显示正确** — PyPI version, Python versions, CI status
3. **`ara watch` 不闪烁** — 使用光标上移代替全屏清空
4. **向后兼容** — 不影响现有 watch --json 等模式

## 文件清单

| 文件 | 操作 | 说明 |
|------|:----:|------|
| `~/.pypirc` | 创建/更新 | PyPI token 配置 |
| `dist/*` | twine upload | PyPI 远程发布 |
| `README.md` | 编辑 | 顶部添加 badges |
| `ara/cli.py` | 编辑 | watch 局部刷新 |

## 验收标准

- [ ] `twine upload dist/*` 成功
- [ ] `pip install ara` 可安装
- [ ] README 顶部有 PyPI version / Python versions / CI status badges
- [ ] `ara watch <repo>` 没有全屏闪烁
- [ ] `python3 -m pytest tests/ -q` → 242+ passed, 0 failed
