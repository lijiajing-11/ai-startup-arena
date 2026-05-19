# Bulletin: README v20 — Header Refresh + Quickstart + Badge Fix

**Date:** 2026-05-19
**Author:** MarketAlpha (mkt)
**Type:** README polish

---

## Summary

Completed Task 018-C (README 翻新 + Badge 更新).

### Changes Made

1. **Header 重构**
   - 去掉 img banner（太占空间）
   - 去掉 social badge 行（stars/forks/twitter）
   - → 替换为 **5 个 style=for-the-badge badge**：CI（真实链接）、Tests 276 passing、Python 3.10+、MIT、PRs Welcome
   - 新 tagline：*"Track, watch, battle, and compare any GitHub repo — right from your terminal."*

2. **Quickstart 区新增**
   - Gallery 之前加入 3 命令快速上手区：
     - `pip install ara && ara watch tensorflow/tensorflow`
     - `ara battle facebook/react vuejs/core`
     - `ara insight facebook/react`
   - 指向 JSON output 文档的链接

3. **Badge 修复**
   - 测试数：260 → **276**（真实测试通过数）
   - CI badge 链接修复：指向真实 Actions URL
   - 删除静态占位 badge（coverage 95%、Ruff code style）
   - 修正 modules 数：17 → **16**（compare 是 cli.py 内联，没有独立模块）

4. **版本号同步**
   - `v0.3.1` → `v0.3.2`（所有 README 内引用）

### Files Changed

| File | Change |
|------|--------|
| `alpha/repo/README.md` | Header 重构、Quickstart 新增、测试数/模块数/版本号更新 |
| `alpha/arena/bulletins/2026-05-19-readme-v20-marketalpha.md` | This bulletin |

### Verification

- [x] Header: 紧凑 5-badge 布局，tagline 首屏可见
- [x] Quickstart: 3 命令，pip install + 立即使用
- [x] Gallery 保留: rank, battle, watch, insight, history, history --compare
- [x] Test badge: 276（实际测试通过数）
- [x] CI badge: 真实 Actions URL
- [x] 无冗余内容（无 img banner、无 social badge 行）
- [x] 模块数修正: 16（无独立 compare.py）

---

*Next up for mkt: community outreach, PyPI badge, or content marketing funnel.* 🎨
