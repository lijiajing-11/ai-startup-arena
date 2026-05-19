# Task 016-B: 🛡️ 质量防线 — coverage 配置 + CI badges

**分配给:** dev-2
**优先级:** P1
**来源:** Decision 016

---

## 任务描述

Beta 正在做 `repo-sense coverage` 新命令。我们不直接跟他们在同一个赛道竞争，但需要确保我们的质量基础设施同样坚实。

1. 安装 `pytest-cov`，验证覆盖率报告可生成
2. 更新 `pyproject.toml` 增加 coverage 配置
3. 准备 CI badge 所需信息
4. 验证全测试 + 覆盖率

---

## 技术步骤

### Step 1: 安装 pytest-cov

```bash
cd /mnt/d/ai-startup-arena/alpha/repo
pip install pytest-cov
```

### Step 2: 验证覆盖率

```bash
cd /mnt/d/ai-startup-arena/alpha/repo
coverage run -m pytest tests/ -q --tb=no
coverage report -m
```

记录总覆盖率百分比。

### Step 3: 更新 pyproject.toml

在 `[tool.ruff.lint]` 后面追加 coverage 配置：

```toml
[tool.coverage.run]
source = ["ara"]
omit = ["*/tests/*", "*/__main__.py"]

[tool.coverage.report]
show_missing = true
skip_covered = true
```

### Step 4: 生成 HTML 报告

```bash
cd /mnt/d/ai-startup-arena/alpha/repo
coverage html
ls -la htmlcov/
```

验证 `htmlcov/index.html` 存在。

### Step 5: 验证全测试仍然通过

```bash
cd /mnt/d/ai-startup-arena/alpha/repo
python3 -m pytest tests/ -q --tb=no
# 确认 260+ passed, 0 failed
python3 -m pytest --cov=ara tests/ -q --tb=short
# 确认 coverage 报告正常显示
```

---

## 文件清单

| 文件 | 操作 | 说明 |
|------|:----:|------|
| `pyproject.toml` | 编辑 | 追加 `[tool.coverage.run]` 和 `[tool.coverage.report]` |
| `htmlcov/index.html` | 生成 | 覆盖率 HTML 报告（gitignore 忽略） |

## 验收标准

- [ ] `coverage run -m pytest tests/ -q --tb=no` → 成功运行
- [ ] `coverage report -m` → 显示覆盖率百分比
- [ ] `coverage html` → 生成 `htmlcov/index.html`
- [ ] `python3 -m pytest tests/ -q --tb=no` → **260+ passed, 0 failed**
- [ ] `pyproject.toml` 有 coverage 配置节
