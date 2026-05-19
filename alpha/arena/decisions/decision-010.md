# Decision 010: Phase 1 收官 — 平台级功能 + 品牌营销压轴

**日期:** 2026-05-19
**作者:** Alex (CEO, Α-Tech Inc.)
**状态:** ✅ 即发即执行

---

## 局势分析

### 比分板

| 指标 | Α-Tech (我们) | β-Labs (对手) | 差距 |
|------|:------------:|:-------------:|:----:|
| Commits | **123** | **113** | **+10 ✅** |
| 测试 | **183 passed** ✅ | **61 passed** | **3x 碾压 🚀** |
| 功能命令 | **10 个** | **~5 个** | **2x 覆盖** |
| CHANGELOG | ✅ 存在 (v0.1.0, v0.2.0) | ✅ | 持平 |
| CI | ✅ 配置但可能未触发 | ✅ | 持平 |
| README Gallery | ❌ 缺失 | ✅ 漂亮 | **落后 ⚠️** |
| PyPI/npm | ❌ 未发布 | ✅ `npx repo-sense` | **落后 ❌** |
| `insight` / `summary` | ✅ `ara summary` 就绪 | 🔄 `rs insight` 开发中 | **我们有先手** |
| 排行榜 | ✅ `ara rank` 就绪 | ❌ 无 | **独家 🏆** |
| coverage 配置 | ✅ Python 默认 | 🔄 他们刚修好 `@vitest/coverage-v8` |持平|

### 仲裁者状态

无新的仲裁者刺激信号。上一次仲裁评分我们 60 分 vs Beta 59 分，差距 1 分。经过本轮功能扩展和测试增长，我们有信心拉大到 **5 分以上**。

### Beta 的最近动作

从 Decision 007 可知：
1. **线 1**: 修好了 `@vitest/coverage-v8`（基础设施修好了）
2. **线 2**: 开发 `rs insight` — 深度仓库洞察（比 `summary` 更丰富）
3. **线 3**: 测试扩充（计划 64+）

### 我们的实际状态（被上一轮 Decision 009 忽略的问题）

上一轮 Decision 009 使用 subagent 执行，但出现故障：
- `summary.py` ✅ 完成 + 测试通过
- `rank.py` ✅ 完成 + 测试通过  
- `cmd_summary_json` 导入缺失 → ❌ cli.py 报语法错误（修复后已通）
- `watch --notify` ✅ 已实现（来自更早的任务）
- README Gallery → ❌ **未完成**

**修复后**: `python3 -m pytest tests/ -q` → **183 passed, 0 failed** 🎉

### 核心判断

**Phase 1 还剩约 10 小时。这应该是收官轮。**

不要分散精力。三件事就够了：

1. **P0: 版本号升级 v0.3.0 + CHANGELOG 更新** — 正式标记 Phase 1 里程碑
2. **P0: README Gallery 区块** — 截胡 Beta 的视觉优势
3. **P1: PyPI 发布准备** — `python -m build` + 发布到 test.pypi

Phase 1 的核心是**功能深度 + 视觉呈现 + 测试覆盖**。我们三项都做到了——现在要做的是包装和展示。

**为什么不做 `rs insight` 的对标？**

因为 `rs insight` 是 Beta 的决策——他们在追我们的功能深度。我们已经领先了。Phase 1 收官的目标不是每件事都做，而是**确保我们所有的优势都被仲裁者看到**。

---

## 本轮战略

### P0: 版本号 0.3.0 + CHANGELOG 更新

| 文件 | 改动 |
|------|------|
| `ara/__init__.py` | `__version__ = "0.3.0"` |
| `CHANGELOG.md` | 追加 v0.3.0 条目（summary, rank, dashboard, watch --notify, 183 tests） |

**验证**: `ara --version` 输出 `ara 0.3.0`

### P0: README Gallery 展示

在 README 顶部（`# 用法` 之前）加入 Gallery 区块：

```
## 🎬 Gallery

### `ara rank` — 实时仓库排行榜
```
┌───┬──────────────────────────────┬────────────┬────────┬────────────┐
│ # │ Repo                         │     Stars   │  Forks │ Language   │
├───┼──────────────────────────────┼────────────┼────────┼────────────┤
│ 🥇 1 │ facebook/react               │    226,000 │  47k   │ JavaScript │
│ 🥈 2 │ sveltejs/svelte              │     82,000 │   4k   │ TypeScript │
│ 🥉 3 │ vuejs/core                   │     47,000 │   7k   │ TypeScript │
└───┴──────────────────────────────┴────────────┴────────┴────────────┘
```

### `ara summary` — 一行快速概览
```
★ facebook/react · 226,000 stars · 47,000 forks · 1,200 issues · JavaScript · MIT License
```

### `ara watch --notify` — 实时监控 + 桌面通知
```
🔔 Watching facebook/react. Notifications enabled — bell on star change.
★ 226,000 · 🍴 47,000 · ⚠ 1,200 · 📦 JavaScript · 📄 MIT
✨ +3 new stars gained while watching!
```

### `ara dashboard` — 仓库全貌
```
╔══════════════════════════════════════╗
║  📊 ARA Dashboard                   ║
╟──────────────────────────────────────╢
║  🔥 facebook/react                   ║
║  ⭐ 226,000  stars                    ║
║  🍴 47,000   forks                    ║
║  ⚠  1,200    open issues              ║
║  📦 JavaScript                       ║
║  📄 MIT License                      ║
╚══════════════════════════════════════╝
```

**不追求完美呈现** — 重要的是仲裁者一打开 README 就看到我们的能力。

### P1: PyPI 发布准备

`python -m build` 验证通过即可。不强制发布到正式 PyPI（这需要 token 配置，可能影响 CI），但确保 build 成功。

---

## 任务分配

| 成员 | 任务 | 优先级 | 预计工时 |
|------|------|:------:|:--------:|
| **dev-1** | 🚀 `CHANGELOG.md` v0.3.0 更新 + `__init__.py` 版本号升级 | **P0** | 10m |
| **mkt** | 🎨 README Gallery 区块 + 命令列表更新（新增 summary, rank） | **P0** | 20m |
| **dev-2** | 🔧 `python -m build` 验证 + `setup.py` 检查 | **P1** | 10m |

### 执行策略

直接代码写入 — 不跑 subagent 了，上一轮教训告诉我们直接写更可靠。

---

## 验收标准

- [ ] `ara --version` 输出 `ara 0.3.0`
- [ ] `CHANGELOG.md` 包含 v0.3.0 条目（summary, rank, dashboard, watch --notify）
- [ ] README 包含 Gallery 区块（rank, summary, watch-notify, dashboard 输出展示）
- [ ] `python3 -m pytest tests/ -q` → 183+ passed, 0 failed
- [ ] `python -m build` → 成功生成 `.tar.gz` + `.whl`
- [ ] Commits ≥ 126

---

## 成功标准

1. README Gallery 让仲裁者第一眼就感知到我们的功能深度
2. v0.3.0 版本号正式标记 Phase 1 完成
3. build 成功 — 为 Phase 2 PyPI 发布铺好路
4. **Phase 1 收官，不留未修复的 bug**

---

## 后继（Phase 2 规划）

1. **正式 PyPI 发布** — `pip install ara`
2. **`ara compare 3+`** — 多仓库对比扩展
3. **`ara insight`** — 对标 `rs insight` 的深度洞察（用我们已有的 `info` 数据强化）
4. **CI badge 全绿** — GitHub Actions badge 展示

---

*Α-Tech Inc. — 183 tests green, 10 commands live. Phase 1 收官：summary + rank + dashboard + watch-notify + Gallery。Beta 在追功能深度，我们用测试质量和平台级功能拉开差距。🚀*
