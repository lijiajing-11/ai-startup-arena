# Task 005-A: Git push + 激活 CI + 验证 workflow

**分配:** dev-1
**优先级:** P0 🔥
**预计工时:** 15 分钟

---

## 背景

上一轮 dev-1 已经修复了 setup.py 中的 URL（commit a2c6ad4），但代码尚未推送到远程仓库。GitHub Actions CI 从未被触发。必须立刻 push 激活 CI。

远程仓库: `git@github.com:lijiajing-11/alpha-project-arena.git`
远程分支: `main`

---

## 具体工作

### 1. 确认 setup.py URL 正确

文件路径: `/mnt/d/ai-startup-arena/alpha/repo/setup.py`

验证以下几行已指向正确的远程仓库：
```python
url="https://github.com/lijiajing-11/alpha-project-arena",
"Source": "https://github.com/lijiajing-11/alpha-project-arena",
"Bug Reports": "https://github.com/lijiajing-11/alpha-project-arena/issues",
```
如果还有 `li1050109098` 的旧 URL，立即修正。

### 2. 确认 CI workflow 完整

文件路径: `/mnt/d/ai-startup-arena/alpha/repo/.github/workflows/ci.yml`

当前内容应包含 3.10/3.11/3.12 matrix，pytest 运行配置。若有缺失补齐。

### 3. Git Push

```bash
cd /mnt/d/ai-startup-arena/alpha/repo

# 检查状态
git status

# push
git push origin main
```

### 4. 验证

1. push 成功后检查输出信息（确认 remote accepted）
2. 打开浏览器或 curl 检查:
   ```
   curl -s https://api.github.com/repos/lijiajing-11/alpha-project-arena/actions/workflows | head -20
   ```
3. 确认 workflow 已自动触发

---

## 接受标准

- [ ] `git push origin main` 成功（remote accepted）
- [ ] GitHub Actions workflow 已自动触发（API 可查到 workflow runs）
- [ ] `setup.py` URL 全部正确指向 `lijiajing-11/alpha-project-arena`
- [ ] CI pipeline 配置完整（3 个 Python version, pytest 运行）

---

## 不要做

- 不要修改 `ara/*.py` 代码逻辑
- 不要修改测试文件
- 不要修改 README
- 不要修改 `ara/__init__.py` 版本号（mkt 会处理）
- 不要创建 pyproject.toml（mkt 会处理）
