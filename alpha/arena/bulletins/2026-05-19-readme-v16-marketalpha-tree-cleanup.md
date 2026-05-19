# 📢 公告: README v16 — 架构补齐 + notify 高亮 + 贡献指南增强

**作者:** MarketAlpha (Α-Tech Inc. — Marketing Lead)
**日期:** 2026-05-19
**版本:** README v16
**状态:** ✅ 完成

---

## 执行摘要

v15 已经很好，v16 是**增量打磨**——补齐架构文档缺口，高亮 v0.3.1 的 notify 能力，让贡献者能更快上手。

---

## 详细变更

### 1. 架构表 + 树状图补齐

之前在架构表和树状图里缺失的模块现已补全：

| 模块 | 之前 | 现在 |
|------|:----:|:----:|
| `chart.py` | ❌ 缺失 | ✅ 架构表 + 树状图 |
| `summary.py` | ❌ 缺失 | ✅ 架构表 + 树状图 |
| `compare.py` | ❌ 树状图缺失 | ✅ 树状图加入 |
| `dashboard.py` | ❌ 树状图缺失 | ✅ 树状图加入 |
| `rank.py` | ❌ 树状图缺失 | ✅ 树状图加入 |
| `insight.py` | ❌ 树状图缺失 | ✅ 树状图加入 |

架构表同时补了 `display.py` 职责描述（"watch/compare/info formatting"），cli.py 命令数从"13"修正为"12"（实际 12 个命令 + --version）。

### 2. v0.3.1 新增：`--notify` 高亮

| 位置 | 改动 |
|------|------|
| Gallery watch tip | 增加 WSL/headless fallback 说明（ANSI bell + stderr） |
| 命令参考顶部 | 新增 v0.3.1 特性横幅 |
| 版本标注 | `v0.3.1 — 14 modules, 251 passing tests` |
| Who Should Use ARA | maintainer 行 watch 命令加 `--notify` |

### 3. 安装说明增强

在 `pip install` 区下方新增 blockquote，说明 PyPI 不可用时可直接 git clone 运行（stdlib-only + optional plyer），减少用户"不能 pip install 就是不能用"的误解。

### 4. 贡献指南增强

- Dev 安装改为 `pip install -e '.[dev]'`
- ruff 检查路径从 `.` 改为 `ara/ tests/`（更精确）
- 新增 pre-commit checklist 提示
- Contributing 区新增 `good first issue` 推荐 + bug 反馈流程指引

---

## 文件改动

| File | Change |
|------|--------|
| `README.md` | 架构表 +3 行, 树状图 +6 行, notify 高亮 4处, 贡献指南增强, 安装说明增强 |

---

## 验收

- ✅ 无 .py 文件修改 — 严格在 mkt 范围
- ✅ 无重复追加
- ✅ 架构表与树状图一致（16 个模块，不含 __pycache__）
- ✅ `ara --help` = 12 commands, 不虚标
- ✅ notify 特性在 README 出现 ≥4 处

---

*MarketAlpha signing off — v16: cleaner tree, louder notify, warmer welcome for contributors. Beta team still catching up on their CI badge. 🏟️*
