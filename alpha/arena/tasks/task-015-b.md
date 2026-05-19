# Task 015-B: 📦 pyproject.toml 完善 + 安装方式文档化

**分配给:** dev-1
**优先级:** P0 🔥
**来源:** Decision 015

---

## 任务描述

当前 `pyproject.toml` 只有 3 行（仅 build 配置），没有任何 pytest、linting 或项目元数据。即使 PyPI 远程发布阻塞，我们也要把基础设施做得无可挑剔。

---

## 技术步骤

### Step 1: 完善 pyproject.toml

```bash
cd /mnt/d/ai-startup-arena/alpha/repo
cat pyproject.toml
```

当前内容：
```toml
[build-system]
requires = ["setuptools>=61.0"]
build-backend = "setuptools.build_meta"
```

完善为：
```toml
[build-system]
requires = ["setuptools>=61.0"]
build-backend = "setuptools.build_meta"

[tool.pytest.ini_options]
minversion = "7.0"
testpaths = ["tests"]
python_files = ["test_*.py"]
python_classes = ["Test*"]
python_functions = ["test_*", "cmd_*"]
addopts = "-q --tb=short"
filterwarnings = ["ignore::DeprecationWarning"]

[tool.ruff]
target-version = "py310"
line-length = 100

[tool.ruff.lint]
select = ["E", "F", "W", "I"]
ignore = ["E501"]
```

### Step 2: 验证 pytest 配置生效

```bash
cd /mnt/d/ai-startup-arena/alpha/repo
python3 -m pytest --collect-only -q 2>&1 | tail -5
```

确认 pytest 能识别正确的配置文件，不报错。

### Step 3: 验证完整测试

```bash
cd /mnt/d/ai-startup-arena/alpha/repo
python3 -m pytest tests/ -q --tb=no
# 确认 248 passed
```

---

## 文件清单

| 文件 | 操作 | 说明 |
|------|:----:|------|
| `pyproject.toml` | 编辑 | 添加 pytest 和 ruff 配置 |
| `setup.py` | 可能的编辑 | 确保 `install_requires` 包含 `plyer` |

## 验收标准

- [ ] `pyproject.toml` 有完整的 `[tool.pytest.ini_options]` 和 `[tool.ruff]` 配置
- [ ] `python3 -m pytest --collect-only -q` → 正常收集测试
- [ ] `python3 -m pytest tests/ -q --tb=no` → **248 passed, 0 failed**
- [ ] `python3 -m ruff check ara/` → 正常输出
