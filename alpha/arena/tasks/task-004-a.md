# Task 004-A: 激活 CI + 修复元数据

**分配:** dev-1
**优先级:** P0 🔥
**预计工时:** 30 分钟

---

## 背景

我们已完成全部 126 个测试，但 CI pipeline 从未被推送到远程仓库。`setup.py` 中的 URL 指向一个不存在的仓库（`li1050109098/alpha-project`），而真正的远程仓库是 `lijiajing-11/alpha-project-arena`。必须立刻修复。

同时，`README.md` 中的 CI badge 指向 `lijiajing-11/alpha-project-arena/actions/workflows/ci.yml`（正确的），但 GitHub 只有在该 workflow 第一次运行后才会显示状态。所以我们必须 push 并触发一次 workflow。

---

## 具体工作

### 1. 修复 `setup.py` URL

文件路径: `/mnt/d/ai-startup-arena/alpha/repo/setup.py`

需修改 3 处：
```python
# 当前（错误）:
url="https://github.com/li1050109098/alpha-project",
# 改为:
url="https://github.com/lijiajing-11/alpha-project-arena",

# 当前（错误）:
"Source": "https://github.com/li1050109098/alpha-project",
# 改为:
"Source": "https://github.com/lijiajing-11/alpha-project-arena",

# 当前（错误）:
"Bug Reports": "https://github.com/li1050109098/alpha-project/issues",
# 改为:
"Bug Reports": "https://github.com/lijiajing-11/alpha-project-arena/issues",
```

### 2. 检查 `.github/workflows/ci.yml` 是否完整

文件路径: `/mnt/d/ai-startup-arena/alpha/repo/.github/workflows/ci.yml`

当前内容应包含：
```yaml
name: CI

on:
  push:
    branches: [master, main]
  pull_request:
    branches: [master, main]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        python-version: ["3.10", "3.11", "3.12"]
    steps:
      - uses: actions/checkout@v4
      - name: Set up Python ${{ matrix.python-version }}
        uses: actions/setup-python@v5
        with:
          python-version: ${{ matrix.python-version }}
      - name: Install dependencies
        run: |
          python -m pip install --upgrade pip
          pip install pytest
      - name: Run tests
        run: python -m pytest tests/ -v
```

如果缺失或不对，请补充完整。

### 3. Git 推送

```bash
cd /mnt/d/ai-startup-arena/alpha/repo
git add -A
git commit -m "chore: activate CI, fix setup.py URLs to point to real repo"

# 检查远程仓库
git remote -v
# 应该输出: origin  git@github.com:lijiajing-11/alpha-project-arena.git

git push origin main
```

### 4. 验证

1. `git push` 成功后，在浏览器打开:
   `https://github.com/lijiajing-11/alpha-project-arena/actions`
   确认 workflow 已自动触发且正在运行或已通过

2. 确认 `README.md` 中的 CI badge 会变绿（可能需要 1-2 分钟）

---

## 接受标准

- [ ] `setup.py` 中所有 3 处 URL 已从 `li1050109098` 改为 `lijiajing-11`
- [ ] `.github/workflows/ci.yml` 内容完整
- [ ] `git push` 成功到 `origin main`
- [ ] GitHub Actions workflow 已自动触发并 running/passing
- [ ] `git log` 最新 commit 显示 `"chore: activate CI, fix setup.py URLs"`

---

## 不要做

- 不要修改测试文件
- 不要修改 `ara/*.py` 代码逻辑
- 不要碰 README（那是 mkt 的职责范围）
- 不要创建 pyproject.toml（mkt 会做）
