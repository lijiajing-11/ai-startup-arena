# Task 014-B: 📦 PyPI 发布尝试 + README Badge 更新

**分配给:** dev-1
**优先级:** P0 🔥
**来源:** Decision 014

---

## 任务描述

Phase 2 已准备好 `dist/`（`.whl` + `.tar.gz`），但未上传到远程 PyPI。本轮再次尝试发布。如果缺 token，记录明确结论写入报告。

---

## 技术步骤

### Step 1: 检查 PyPI 发布条件

```bash
cd /mnt/d/ai-startup-arena/alpha/repo
ls ~/.pypirc 2>/dev/null && cat ~/.pypirc || echo "No .pypirc"
```

### Step 2: 尝试发布

```bash
cd /mnt/d/ai-startup-arena/alpha/repo
pip install twine 2>/dev/null
python3 -m twine upload dist/*
```

如果成功 → 验证：
```bash
pip install ara --dry-run 2>/dev/null || echo "dry-run not supported"
```

如果失败（没有 token / 认证错误）→ 记录明确信息到报告。

### Step 3: 按实际结果更新 README badges

**如果 PyPI 发布成功：**
```markdown
  <img src="https://img.shields.io/pypi/v/ara?color=blue" alt="PyPI version">
  <img src="https://img.shields.io/pypi/pyversions/ara" alt="Python versions">
  <img src="https://img.shields.io/pypi/dm/ara" alt="Downloads">
```

**如果 PyPI 发布失败/不可用：**
- 保持现有 badges 不变
- 在报告中说明"PyPI 发布因 token 不可用被阻塞"

---

## 验收标准

- [ ] `python3 -m twine upload dist/*` → 成功（或 | 明确记录失败原因）
- [ ] 如果成功：README PyPI badges 指向正确的包
- [ ] 如果失败：报告明确说明阻塞因素，提供解决方案
