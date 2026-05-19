# Decision 007: Cycle 7 — 反击 Alpha 功能优势 + 修复覆盖率的毒瘤

**时间**: 2026-05-19 09:38
**作者**: Blake (CEO, β-Labs Corp.)
**周期**: Cycle 7 (功能反击 Phase 1)

---

## 当前局势分析

### 比分板

| 维度 | Beta (我们) | Alpha (对手) | 差距 |
|------|:----------:|:-----------:|:----:|
| Commits | 113 | 118 | **-5** ⬇️ (缩小中) |
| 测试数 | **61 passed** (61/61) | **156 passed** | **-95** 🔴 巨大差距 |
| 功能命令 | **4** | **8** | **-4** 🔴 被 2x |
| README Gallery | ✅ 漂亮 | ❌ 但他们本轮要做 | ⏳ 优势窗口缩小 |
| Coverage 配置 | ❌ `@vitest/coverage-v8` 坏了 | ✅ 已配 | 🔴 严重 |
| npm/pypi | ✅ `npx repo-sense` | ❌ 未发布 | ✅ 领先 |
| CI | ✅ | ✅ | 持平 |

### 仲裁者状态

Cycle 3 已检查，Beta 59 分 vs Alpha 60 分，差距 1 分。无刺激信号。但仲裁者显然还没看到我们的新进展（Cycle 6 刚完成），下一轮检查时分数应该上涨。

### Alpha 本轮战略（已知）

从他们的 decision-008 可知：
1. **P0**: `ara summary` 命令（对标我们的 `rs stars` 且做得更多）
2. **P0**: README Gallery 升级（追平我们的视觉优势）
3. **P1**: `ara watch --notify`（桌面通知）

### 我们的核心问题

1. **🔴 `@vitest/coverage-v8` 装不上** — node_modules 状态残了。这个不修好覆盖率和 CI badge 永远出不来
2. **🔴 功能数量只有 4 个** — Alpha 有 8 个命令，我们被 2x
3. **🟡 测试数 61 vs 156** — 虽然绝对数差很远，但我们已经 61/61 全绿。问题是需要的测试场景还没写
4. **🟡 Alpha 正在抄我们的 Gallery** — 窗口期有限

### 关键判断

**不要被 Alpha 牵着鼻子走。** 他们在做 `summary`（对标我们的 `stars`）和 Gallery（抄我们的 README）。这说明我们的方向是对的——他们跟着我们学。

我们要做的不是防守，而是**进攻**：
1. **先把这个毒瘤 coverage 修复了** — 这是基础设施级别的问题，不修好以后所有 CI/coverage 相关的事都卡住
2. **做他们没有的东西** — 而且要做成标志性功能
3. **加测试覆盖** — 但要有策略地加，不能为了加而加

---

## 本轮战略：两线反击

### 线 1: 🔧 基础设施修复 (P0)

**问题**: `@vitest/coverage-v8` 在 package-lock.json 里有但装不上。可能是 package-lock.json 与 package.json 版本不匹配。

**方案**: 修 lockfile，不删 node_modules。具体：
1. 删 lockfile 中 `@vitest/coverage-v8` 的旧 entry
2. `npm install @vitest/coverage-v8@3.2.4 --legacy-peer-deps --save-dev`
3. 验证 `vitest run --coverage` 通

完成后 coverage 阈值设 50%（不退让）。

### 线 2: 🚀 新功能 — `rs insight` (P0)

**这是本轮的核心战略动作。**

Alpha 在做 `ara summary`（一行输出仓库信息）。我们要做的是 **`rs insight`** — 不只是一行总结，而是深入仓库洞察：

```bash
$ rs insight <repo>
# 输出一个 5-10 行的深度概览，包含：
# - ⭐ 星数 + 周增速
# - 🍴 分支数
# - ⚠ Open Issues
# - 📦 主要语言 + 仓库热度指数
# - 🏷 Topics (如果有)
# - 📅 创建时间 + 最近更新
# - 🌟 历史星数趋势（星数/年龄 比率）
```

这东西 Alpha 抄不了——他们是 Python 纯文本 CLI，而我们已经有漂亮的 chalk 渲染能力。

**为什么选 `insight` 而不是 `summary`**:
1. `summary` 是 Alpha 正在做的——谁先上线谁拿分，但双方都会做
2. `insight` 是增量——更深、更有价值、更难抄
3. 我们用了 2 行代码的 `starsCommand` 已经有雏形，扩展成 `insight` 只需要再加几个 API 调用
4. 视觉上我们的 chalk 渲染能碾压 Alpha 的纯文本

### 线 3: 📊 测试扩充 (P1)

加 2-3 个关键的测试用例就够了，不追求追上 156 的数字——那没意义。我们在做有意义的差异化。

| 测试 | 说明 | 优先级 |
|------|------|:------:|
| `insight` 命令测试 | 确保新命令正确导出 | P0 |
| 补充 `models.ts` 测试 | 只有 6 个测试，可以加 parseRepo 的 edge cases | P1 |
| `github.ts` 测试复用 | 已经有 30 个，够用 | - |

---

## 任务分配

| 角色 | 任务 | 优先级 | 预计 |
|------|------|:------:|:----:|
| **dev-1** | 🔧 修 coverage + lockfile 毒瘤 | **P0** | 10m |
| **dev-1** | 🚀 `rs insight` 命令实现 | **P0** | 20m |
| **dev-2** | 🧪 `insight` 命令测试 + `models.ts` 测试扩展 | **P0/P1** | 15m |
| **mkt** | 📝 README 更新：insight 文档 + coverage badge（修好后再做） | **P1** | 10m |

---

## 验收标准

1. ✅ `vitest run --coverage` 成功输出覆盖率报告（阈值 50%）
2. ✅ `rs insight facebook/react` 输出深度概览（星数、周增速、language、topics、repo age）
3. ✅ `rs insight` 有对应的测试用例
4. ✅ `npm test` 全部通过（≥ 64 个测试）
5. ✅ `npm run build` 通过
6. ✅ README 有 `rs insight` 文档

---

## 时间线

| 阶段 | 时长 | 目标 |
|------|:----:|------|
| Phase 1: 修复 coverage | 即时 | coverage 可用 |
| Phase 2: insight 功能 | 紧接着 | 命令 + 测试 |
| Phase 3: 文档 | 最后 | README |

---

## 风险登记

| 风险 | 影响 | 概率 | 应对 |
|------|:----:|:----:|------|
| lockfile 修复失败，需要删 node_modules | 🟡 中 | 🟡 中 | 接受 2 分钟损失，`rm -rf node_modules && npm install` |
| insight 展示 Topics 但 API 可能无数据 | 🟢 低 | 🟡 中 | 优雅降级：没有就写 "None" |
| Alpha 先完成 Gallery 升级 | 🟡 中 | 🟢 高 | 我们有原创优势，不会被超越 |
| dev-1 负载过重（coverage + insight） | 🟡 中 | 🟡 中 | 把 models.test.ts 扩展挪给 dev-2 配 |

*β-Labs Corp. — 59 points is a floor, not a ceiling. Alpha 在学我们，说明我们走对了路。该加速了。🚀*
