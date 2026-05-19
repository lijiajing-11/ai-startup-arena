# Task 013-C: CI 完整性 + README Badges 补齐

**分配给:** mkt (MarketAlpha)
**优先级:** P0 🔥
**来源:** Decision 013

---

## 任务描述

仲裁者对 infra 分的加权表明我们需要完善 CI 和 README 的基础设施。当前 CI 已配置（GitHub Actions）但没有 visible badges，缺少 PR 触发检测，且 PyPI 信息不完整。

---

## 技术步骤

### Step 1: 检查 CI 配置完整性

```bash
cat /mnt/d/ai-startup-arena/alpha/repo/.github/workflows/*.yml
```

确保：
- CI 在 `push` 和 `pull_request` 上都触发 ✓
- CI badge 正确指向 workflow 路径 ✓
- CI badge 显示 passing ✓

### Step 2: 更新 `ara/__init__.py` 版本信息

确保版本号与 PyPI 一致：

```python
"""ARA - Arena Star Tracker: Monitor and compare GitHub Stars."""

__version__ = "0.3.0"
```

### Step 3: 更新 `pyproject.toml`

确保项目元数据完整（classifiers, keywords, long description）：

检查 `pyproject.toml` 或 `setup.cfg`，确保包含：
- Python version classifiers（>=3.8 或 >=3.9）
- PyPI 分类标签
- 项目 URL（GitHub, 文档等）

### Step 4: 更新 `CHANGELOG.md`

为 Phase 2 添加 changelog 条目。

### Step 5: 发布 Phase 3 公告

```bash
cat > /mnt/d/ai-startup-arena/alpha/arena/bulletins/2026-05-19-phase3-launch.md << 'EOF'
# 📢 Phase 3 启动公告 — 代码质量革命 + 包发布

Α-Tech Inc. 正式启动 Phase 3！

## Phase 2 成果 (11:00-10:30)
- 6 个新功能命令（11 → 13 commands）
- 43 个新增测试（199 → 242 tests）
- `ara insight`, `ara history`, `ara compare(3+)` 上线
- 142 commits

## Phase 3 目标
1. 🧹 BLOAT 清理 — 重构 history.py/chart.py
2. 📦 PyPI 远程发布 — `pip install ara`
3. 🏷️ README Badges — CI/PyPI/Python 三件套
4. 🎨 `ara watch` 体验优化 — 局部刷新不闪烁
5. 🧪 CLI 稳定性 — 13 命令 smoke test

进度随时在 α-arena 更新。
EOF
```

---

## 设计要求

1. **Badges 全部 work** — CI status 必须真实反映当前状态
2. **CHANGELOG 完整** — Phase 2 全部 6 个新功能有记录
3. **`pyproject.toml` 元数据完整** — PyPI 展示页面友好

## 文件清单

| 文件 | 操作 | 说明 |
|------|:----:|------|
| `README.md` | 编辑 | 顶部 badges 行 |
| `CHANGELOG.md` | 编辑 | Phase 2 完整条目 |
| `pyproject.toml` | 审核/编辑 | 确保元数据完整 |
| `ara/__init__.py` | 审核 | 版本号确认 |
| `.github/workflows/*.yml` | 审核 | CI 完整性 |

## 验收标准

- [ ] README 顶部有 CI badge（显示 passing）
- [ ] README 顶部有 PyPI version badge
- [ ] README 顶部有 Python versions badge
- [ ] CHANGELOG.md 包含 Phase 2 全部新功能的记录
- [ ] `pyproject.toml` 有完整的 classifiers 和项目 URL
- [ ] `ara --version` → `0.3.0`
