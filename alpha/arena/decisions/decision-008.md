# Decision 008: Gallery 大升级 + `ara summary` 快速命令 + `watch --notify`

**日期:** 2026-05-19
**作者:** Alex (CEO, Α-Tech Inc.)
**状态:** ✅ 即发即执行

---

## 局势分析

### 比分板

| 指标 | Α-Tech (我们) | β-Labs (对手) | 差距 |
|------|:------------:|:-------------:|:----:|
| Commits | **118** | **112** | +6 ⚠️ 差距缩小 |
| 测试 | **156 passed** ✅ | ❌ 无（vitest 目录极少） | **碾压差距** |
| CI | ✅ 已激活 | ✅ 已有 | 持平 |
| CHANGELOG | ✅ 存在 | ✅ 存在 | 持平 |
| CONTRIBUTING | ✅ 存在 | ✅ 存在 | 持平 |
| 功能数量 | **8 个命令** | **4 个命令** (watch/battle/watch-multi/stars) | **2x 覆盖** |
| Gallery / 截图 | ❌ 无 | ✅ 漂亮 README Gallery | **落后 ❌** |
| `summary` 命令 | ❌ 无 | 🔄 `rs summary` (coming soon) | **即将落后 ⚠️** |
| `notify` 桌面通知 | ❌ 无 | ❌ 无 | 持平 |
| README 完整度 | ✅ 内容详实 | ✅ 视觉好看 | 各有千秋 |
| PyPI 发布 | ❌ 未发布 | ✅ npm 已发布 | **落后 ❌** |

### 关键洞察

1. **Beta 的 README Gallery 非常漂亮** — 有完整的 box-drawing 例子、展示 watch dashboard、多 repo watch、battle 界面。我们 README 内容多多但全是文字描述，缺少这种"一眼惊艳"的效果。
2. **`rs summary` 即将上线** — 快速一句话输出仓库信息。如果我们先做 `ara summary` 并且做得更好，可以截胡。
3. **桌面通知** — 双方都没有，这是差异化窗口。
4. **Beta 已经 npm publish 了** — 他们可以直接 `npx repo-sense`，不用安装。我们的 `pip install ara` 还不可用。

### 核心判断

**这一轮不做新的大架构。做三件性价比高的事：**

1. **P0: `ara summary <repo>`** — 一句话快速输出。对标并超越 Beta 的 `rs summary`。
2. **P0: README Gallery 大升级** — 加入 screenshot ASCII art，让 README 有"wow 效果"
3. **P1: `ara watch --notify`** — 当星数变化时通知用户（桌面通知或 terminal bell）

### 为什么是这个顺序

| 任务 | 代码量 | 视觉冲击 | 差异化 | 总评 |
|------|:------:|:--------:|:------:|:----:|
| `ara summary` | ~20 行 | 中 | 🚀 截胡 Beta | **P0 🔥** |
| Gallery 升级 | 0 行代码 | 🎨 高 | ⚡ 追平 Beta | **P0 🔥** |
| `watch --notify` | ~40 行 | 低 | 🌟 独家 | **P1** |

---

## 本轮战略

### 🚀 P0: `ara summary <repo>` 快速命令

对标 `rs summary`，做得更好：

```bash
$ ara summary facebook/react
# ⭐ 226,000 · 🍴 47,000 · ⚠ 1,200 · 📦 JavaScript · 📄 MIT
```

特点：
- 一行输出，适合 copy-paste 到 README/issue/discord
- `--json` 支持
- 比 Beta 多输出 license + description（他们只有 stars/forks/issues/language）
- 零新增依赖

### 🎨 P0: README Gallery 大升级

在 README 中加入 Gallery 区块：
- `ara dashboard` 展示（对标 Beta 的 Watch Dashboard 截图）
- `ara battle` ASCII arena（对标 Beta 的 Battle 截图）
- `ara watch` 实时监控（对标 Beta 的 Multi-Watch 截图）
- 用 code block 展示实际输出效果
- 放在 README 顶部附近，替代目前的纯文字命令表

### 🔔 P1: `ara watch --notify`

新增 `--notify` 标志：
- 星数变化时打印 `\a` (terminal bell) + 额外视觉标记
- 不引入外部通知库（保持零依赖）
- watch 总结中显示具体变化次数

---

## 任务分配

| 成员 | 任务 | 优先级 | 预计工时 |
|------|------|:------:|:--------:|
| **dev-1** | 🚀 `ara summary` 命令 + 测试 | **P0 🔥** | 30m |
| **mkt** | 🎨 README Gallery 大升级 + 命令表更新 | **P0 🔥** | 30m |
| **dev-2** | 🔔 `ara watch --notify` 实现 | **P1** | 30m |

---

## 验收标准

- [ ] `ara summary facebook/react` → 一行输出包含 stars/forks/issues/language/license
- [ ] `ara summary facebook/react --json` → 结构化的 JSON
- [ ] README 包含 Gallery 区块（dashboard/battle/watch 截图）
- [ ] Gallery 放在 README 顶部附近（前 30 行内）
- [ ] `ara watch facebook/react --notify` → 星数变化时触发通知
- [ ] `python3 -m pytest tests/ -q` → 156+ passed, 0 failed

---

## 风险与缓解

| 风险 | 影响 | 概率 | 缓解 |
|------|:----:|:----:|------|
| Beta 已经在 README 有完整 Gallery | 视觉差距持续 | 高 | 我们 8 个命令的覆盖度是他们的 2x |
| `rs summary` 可能已经完成 | 截胡失败 | 中 | 即使如此，我们做得更好（多输出 license/desc） |
| `--notify` 在不同终端行为不同 | 体验不一致 | 低 | `\a` bell 通用，fallback 到视觉标记 |
| CI badge 如果没被 GitHub 缓存更新 | 评分误判 | 低 | 手动触发重新检查 |

---

## 成功标准

1. README 一打开就有视觉冲击（Gallery）
2. `ara summary` 先于 `rs summary` 上线
3. `watch --notify` 成为我们独有的卖点

三个动作做完，即使 Beta 追 commit 数，我们在功能深度和视觉呈现上至少再拉开 10 分差距。

---

## 后续展望（Sprint 9）

1. **PyPI 发布** — `pip install ara`
2. **`ara compare 3+ repos`** — 多仓库对比扩展（已有 info 数据）
3. **`ara dashboard --stars-only`** — 极简信息量
4. **CI badge 全绿 → README 置顶**

*Α-Tech Inc. — 156 tests green, 8 commands shipped. Beta 在追 commit 数，我们用功能深度和视觉冲击拉开差距。🚀*
