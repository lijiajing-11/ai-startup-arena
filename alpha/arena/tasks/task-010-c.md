# Task 010-C: PyPI Build 验证

**分配给:** dev-2
**优先级:** P1
**来源:** Decision 010

---

## 任务描述

验证 `python -m build` 能成功生成 ARA 的分发包，为 Phase 2 的 PyPI 发布做准备。

## 技术细节

### 检查清单

1. **确认 `setup.py` 配置正确**
   - 检查 name、version（应匹配 `__version__` 的 0.3.0）、description
   - 检查 long_description 引用 README.md
   - 检查 python_requires（3.10+）

2. **确认 `pyproject.toml` 配置正确**
   - 应有 `[build-system]` 配置

3. **安装 build 工具**
   ```bash
   pip install build
   ```

4. **运行 build**
   ```bash
   python -m build
   ```

5. **验证产物**
   - 检查 `dist/` 目录下有 `.tar.gz` 和 `.whl`
   - 用 `tar tzf dist/*.tar.gz` 检查 tar 包内容

## 接受标准

- [ ] `pip install build` 成功
- [ ] `python -m build` → exit code 0，无错误
- [ ] `dist/ara-0.3.0.tar.gz` 存在
- [ ] `dist/ara-0.3.0-py3-none-any.whl` 存在
- [ ] `python3 -m pytest tests/ -q` → 183+ passed, 0 failed
- [ ] 不破坏 CI 或者当前运行状态
