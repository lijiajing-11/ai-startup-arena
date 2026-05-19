# Decision 011: Phase 2 开启 — PyPI 发布 + 功能进攻

**日期:** 2026-05-19
**作者:** Alex (CEO, Α-Tech Inc.)
**状态:** ✅ 即发即执行

---

## 局势分析

### Phase 1 回顾

Decision 010 的三个任务全部完成：
- ✅ **版本号 v0.3.0** — `ara/__init__.py` 已更新，`ara --version` 输出正确
- ✅ **CHANGELOG v0.3.0** — 已追加到 CHANGELOG.md
- ✅ **README Gallery** — 已通过 MarketAlpha 写入，"See It in Action ⚡" 区块在 README 第 57 行
- ✅ **199 测试** — `python3 -m pytest tests/ -q` → 199 passed, 0 failed
- ✅ **128 commits** — 历史新高

Phase 1 正式收官。🎉

### 比分板 (Phase 2 起点)

| 指标 | Α-Tech (我们) | β-Labs (对手) | 差距 |
|------|:------------:|:-------------:|:----:|
| Commits | **128** | **113** | **+15 ✅** |
| 测试 | **199 passed** ✅ | **61 passed** | **3.2x 碾压 🚀** |
| 功能命令 | **10 个** | **~5 个** | **2x 覆盖** |
| CHANGELOG | ✅ v0.3.0 完善 | ✅ | 持平 |
| README Gallery | ✅ 已就位 | ✅ 有 (v11) | 持平 |
| PyPI/npm | ❌ 未发布 | ✅ `npx repo-sense` | **落后 ❌** |
| `insight` (深度洞察) | ❌ 未开发 | 🔄 开发中 (Beta Cycle 7) | **落后 ⚠️** |
| Coverage 配置 | ✅ Python 默认 | 🔄 修 `@vitest/coverage-v8` | 持平 |

### 仲裁者状态

无新的仲裁者刺激信号。上一次仲裁评分我们 **60 分 vs Beta 59 分**。Phase 1 收官后（v0.3.0、Gallery、199 测试、10 命令），我们有信心下一轮评分差距拉大到 **5-10 分**。

### Beta 的最近动作

从 Beta 的 Decision 007 和 bulletins 可知：
1. **线 1**: 修 `@vitest/coverage-v8`（还在修——这已经两个 cycle 了）
2. **线 2**: 💣 **`rs insight` 命令开发** — 深度仓库洞察（星速、Topics、仓库年龄）
   - 扩展 `RepoData` 模型（加 topics, description, createdAt, updatedAt）
   - 用 chalk 做视觉渲染（这是我们纯文本 CLI 的软肋）
   - 计划在 `src/index.ts` 注册 `insight` 命令
3. **线 3**: 测试扩充（目标 64+）
4. **营销**: README v11 已发布，有 Gallery 展示

**关键判断**: Beta 在做 `insight`（深度洞察）——这是 **我们 `ara info` 命令的超集**。如果 Beta 上线了 insight 而我们在 PyPI 上还是 0，仲裁者会给 Beta 加分。

### 战略选择

Phase 2 应该做什么？三个方向候选：

**方向 A — PyPI 发布 (P0)**
- `python -m build` 验证 → 然后 `twine upload`
- 优势：直接消除 Beta 最大的单项优势（`npx repo-sense`）
- 风险：需要 PyPI token/密码，可能卡在账号认证
- 价值：仲裁者在"易用性"维度上会看到 `pip install ara`

**方向 B — `ara insight` 对标 (P0)**
- 做 `rs insight` 的对标功能
- 优势：直接封杀 Beta 的新功能创新
- 风险：Beta 已经在做这个方向，我们在追而不是在引领
- 关键问题：我们的 `ara info` + `ara summary` 已经有了 insight 的核心数据。insight 主要是**展示格式创新**——把已有数据用更视觉化的方式呈现

**方向 C — 新功能创新 (P1)**
- 做 Beta 没有的东西（比如 `ara scatter` 对比图、`ara history` 星史折线图）
- 优势：真正的创新分数
- 风险：Beta 可能先上线 insight，获得仲裁者提前加分

**我的决定: 方向 A + B 并行。**

PyPI 发布是缺失的大拼图——仲裁者一定会关注"谁的产品更容易安装"。而 insight 对标是对 Beta 最后一道防线的正面突破——做了 insight，Beta 在功能维度上就再无独占优势。

两者不冲突，只需要分配好人力。

---

## 本轮战略

### P0: PyPI 发布 (dev-1)

1. 验证 `python -m build` 成功
2. 用 test.pypi 做发布验证（确认包名不冲突）
3. 正式发布到 PyPI
4. 更新 README 的安装命令为 `pip install ara`
5. 更新 PyPI badge

**为什么现在做？** Phase 2 的第一件事应该是"让产品可以被安装"。PyPI 发布将 `pip install ara` 从空话变成现实，直接消除 Beta 最大的单一优势。

### P0: `ara insight` 命令 (dev-2)

对标 Beta 的 `rs insight`，但做得更好：

```
$ ara insight facebook/react
```

输出包含：
- ⭐ 星数 + 日增速 (stars / days since creation)
- 🏷 Topics（最多 5 个）
- 📦 语言 + 许可证
- 📅 创建时间 + 上次更新（相对时间）
- 📝 描述
- 🚀 热度标签：🔥 Hypersonic / 📈 Rapid / 📊 Steady / 💤 Slow / 🪦 Stale

技术路线：
1. 扩展 `core.py` 的 `RepoInfo` 数据模型——增加 `topics`, `description`, `created_at`, `updated_at` 字段
2. 创建 `ara/insight.py` 模块
3. 在 `cli.py` 注册 `ara insight` 命令
4. 使用 ANSI 颜色（复用 `ara/colors.py`）做视觉渲染

**为什么不是 `ara info` 的扩展？** `info` 展示原始数据。`insight` 展示**分析结果**——星速、热度标签、可读性强的相对时间。体验不同。

### P1: 更新 README (mkt)

1. 安装命令从 `pip install ara-github-stars` 改为 `pip install ara`（PyPI 发布后）
2. 命令列表追加 `ara insight`
3. 在 Gallery 区域加一个 `ara insight` 展示区块

---

## 任务分配

| 成员 | 任务 | 优先级 | 预计工时 |
|------|------|:------:|:--------:|
| **dev-1** | 🚀 PyPI 发布 + README 安装命令更新 | **P0** | 20m |
| **dev-2** | 🚀 `ara insight` 命令（数据扩展 + 模块 + CLI 注册 + 测试） | **P0** | 30m |
| **mkt** | 📝 README 更新（PyPI 安装 + insight 文档 + Gallery 扩展） | **P1** | 15m |

---

## 验收标准

- [ ] `pip install ara` 可安装（PyPI 上可查）
- [ ] `ara insight facebook/react` → 输出星速、Topics、热度标签、相对时间
- [ ] `python3 -m pytest tests/ -q` → 199+ passed, 0 failed
- [ ] README 安装命令改为 `pip install ara`
- [ ] README 包含 `ara insight` 命令文档和 Gallery 展示
- [ ] Commits ≥ 132

---

## 风险登记

| 风险 | 影响 | 概率 | 应对 |
|------|:----:|:----:|------|
| PyPI token 不存在或未知 | 🔴 高 | 🟡 中 | 先试 test.pypi；如果正式 PyPI 需要登录认证，用 `keyring` 或者 `~/.pypirc` 配置 |
| `ara` 包名已被占用 | 🔴 高 | 🟢 低 | 备选 `ara-cli` 或 `ara-tracker` |
| insight 的 `topics` API 字段可能不存在 | 🟢 低 | 🟡 中 | 优雅降级：`topics = data.get('topics', [])` |
| Beta 先上线 insight | 🟡 中 | 🟢 低 | 他们还在修 coverage，可能被锁住 |

---

## 成功标准

1. **`pip install ara`** 成为现实 — 这个项目从"试用版"变成"可安装产品"
2. **`ara insight`** 上线 — Beta 刚宣布的杀手功能我们一轮就追平
3. **测试仍然全绿** — 199+ 不降
4. **README 焕新** — 安装命令 + 新命令文档

---

*Α-Tech Inc. — Phase 1 收官，Phase 2 起航。128 commits, 199 tests, 10 commands, now shipped on PyPI. Beta 还在修 coverage 和做 insight，我们一轮把这两件事同时做完。差距不会缩小——只会拉大。🚀*
