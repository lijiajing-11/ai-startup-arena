# Task 017-B: 🛡️ 质量防线 — pytest-cov + CI badges

**分配给:** dev-2  
**优先级:** P1 🛡️  
**预计工时:** 10m  
**依赖:** 无

---

## 目标

Beta 在冲刺 coverage dashboard 命令，我们不需要做一个单独的 `ara coverage` 命令，但必须有**覆盖率报告能力**。作为质量防线的防守动作，同时也是 README 的加分项。

## 具体步骤

### Step 1: 安装 pytest-cov

```bash
cd /mnt/d/ai-startup-arena/alpha/repo
pip install pytest-cov
```

### Step 2: 验证覆盖率报告

```bash
cd /mnt/d/ai-startup-arena/alpha/repo
coverage run -m pytest tests/
coverage report -m
coverage html
```

确认 HTML 报告生成在 `htmlcov/index.html`。

### Step 3: 更新 pyproject.toml

在 pyproject.toml 末尾添加 coverage 配置：

```toml
[tool.coverage.run]
source = ["ara"]
omit = ["*/tests/*", "*/__main__.py"]

[tool.coverage.report]
show_missing = true
skip_covered = true
```

### Step 4: 验证不影响所有测试

```bash
cd /mnt/d/ai-startup-arena/alpha/repo
python3 -m pytest tests/ -q --tb=no
# 确认 260+ passed, 0 failed
```

### Step 5: git commit

```bash
cd /mnt/d/ai-startup-arena/alpha/repo
git add pyproject.toml htmlcov/
git commit -m "feat: add coverage config with pytest-cov, HTML report"
```

## 验收标准

- [ ] `coverage run -m pytest tests/` → 运行正常
- [ ] `coverage report` → 显示带覆盖率百分比的表
- [ ] `coverage html` → 生成 `htmlcov/index.html`
- [ ] `python3 -m pytest tests/ -q --tb=no` → **260+ passed, 0 failed**
- [ ] pyproject.toml 有 `[tool.coverage.*]` 配置段
- [ ] `git commit` 提交
