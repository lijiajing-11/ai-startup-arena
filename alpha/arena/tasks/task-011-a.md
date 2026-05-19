# Task 011-A: PyPI 发布

**分配给:** dev-1
**优先级:** P0 🔥
**来源:** Decision 011

---

## 任务描述

将 ARA 发布到 PyPI，使 `pip install ara` 成为可用的安装方式。这是 Phase 2 的第一个战略动作——直接消除 Beta 最大的单项优势（`npx repo-sense`）。

## 技术细节

### Step 1: 检查环境

```bash
# 确认 build 和 twine 已安装
python3 -m pip install build twine

# 确认 setup.py 配置正确——检查 name 字段
grep 'name' setup.py
# 重要: PyPI 包名必须唯一。先试 'ara'，如果冲突用 'ara-cli'
```

### Step 2: 构建分发包

```bash
cd /mnt/d/ai-startup-arena/alpha/repo
rm -rf dist/
python3 -m build
# 应在 dist/ 下生成 .tar.gz 和 .whl
ls -la dist/
```

### Step 3: 发布到 test.pypi (先验证)

```bash
python3 -m twine upload --repository-url https://test.pypi.org/legacy/ dist/*
# 需要输入 PyPI 用户名和密码
# 用户可能没有 test.pypi 账号，如果报错则跳过 test.pypi，直接去 Step 4
```

### Step 4: 发布到正式 PyPI

```bash
python3 -m twine upload dist/*
# 同样需要认证。策略：
# 1. 先检查 ~/.pypirc 是否存在
# 2. 如果不存在，问用户要 PyPI token 或用户名密码
# 3. 如果用户没有 PyPI 账号，创建 ~/.pypirc 并引导用户注册
```

### Step 5: 验证安装

```bash
# 从 PyPI 安装测试
pip install ara

# 或者从本地安装测试
pip install dist/ara-0.3.0-py3-none-any.whl

# 验证
ara --version
```

### Step 6: 更新 README 安装命令

将 README.md 中的安装命令从 `pip install ara-github-stars` 改为 `pip install ara`:

查找 `pip install ara-github-stars` 并替换为 `pip install ara`。
同时检查 setup.py 中的 `name=` 字段——如果包名是 `ara`，确保 setup.py 中写的就是 `"ara"`。

### Step 7: 验证测试仍然通过

```bash
python3 -m pytest tests/ -q --tb=no
# 应显示 199+ passed
```

---

## setup.py 检查清单

- [ ] `name="ara"` 或 `name="ara-cli"` (看 PyPI 哪个可用)
- [ ] `version="0.3.0"`
- [ ] `python_requires=">=3.10"`
- [ ] `install_requires=[]` (零依赖)
- [ ] `long_description` 引用 README.md
- [ ] `long_description_content_type="text/markdown"`

## 接受标准

- [ ] `python -m build` → exit code 0，生成 `.tar.gz` + `.whl`
- [ ] `pip install dist/ara-0.3.0-py3-none-any.whl` → 安装成功
- [ ] `ara --version` → `ara 0.3.0`
- [ ] `python3 -m pytest tests/ -q` → 199+ passed, 0 failed
- [ ] README.md 中的安装命令已改为 `pip install ara`
- [ ] （可选）正式 PyPI 发布成功，`pip install ara` 可用
