# Decision 011: 质量锁死 + 功能矩阵超越 — npm 发布准备

**时间**: 2026-05-19 11:10
**作者**: Blake (CEO, β-Labs Corp.)
**周期**: Cycle 11 （质量锁定Phase）

---

## 当前局势分析

### 🏟️ Leaderboard (Cycle 17 — 无更新)

| 排名 | 团队 | 分数 | Commits | 状态 |
|:----:|------|:----:|:-------:|:----:|
| 🥇 | Beta (β-Labs Corp.) | **59** | **125** | ✅ 干净 |
| 🥈 | Alpha (Α-Tech Inc.) | **54** | 141 | ⚠️ BLOAT 污染 |

**我们领先 5 分。仲裁者仍停在 Cycle 17，无新刺激信号。**

### Cycle 10 执行回顾

| 线 | 任务 | 状态 | 说明 |
|:--:|------|:----:|------|
| 1 | 🔧 修复 `renderBattleMulti renders without throwing` | ✅ **完成** | dev-1: cli-table3 mock 修复 + chalk Proxy 链修正 |
| 2 | 🔧 修复 `3 repos calls getRepos` 测试 | ✅ **完成** | dev-2: Octokit mock 响应结构改为 mockImplementation 注入 |
| 3 | ✅ `npm test` 全量验证 | ✅ **81 passed, 0 failed** | 全绿！ |

**Cycle 10 是纯修复轮，2/2 全完成。** 之前欠的 2 个测试钉子彻底拔掉了。

### Alpha 最新动态 (Decision 015, ~10:48)

Alpha 进入"差异化冲刺":
- 🔴 **`ara watch --notify`** 桌面通知 (P0, dev-1) — 较有新意
- 🔴 PyPI 基础设施完善 (P0, dev-1) — 但缺 token 发不了
- 🟡 Watch 测试增强 (P2, dev-2)
- 🟡 README v14 通知功能文档 (P1, mkt)

**策略判断**: Alpha 在做桌面通知这个有差异化的功能。我们的 8 个命令虽然质量好，但功能数量上 (8 vs 13) 还是有差距。Alpha 的 13 个命令里有不少是琐碎的，但有差异化亮点（notify）。我们需要找一个我们能碾压的差异化方向。

### 我们的差异化机会

| 维度 | Alpha | Beta | 判断 |
|------|:-----:|:----:|:----:|
| 功能命令 | 13 | 8 | 🔴 数量劣势 |
| 测试 | 248 ✅ | 81 ✅ | 🟡 Alpha 更多但不影响分数 |
| 视觉效果 | 🟡 ASCII | 🟢 **chalk 彩色** | ✅ 持续王牌 |
| 桌面通知 | 🚀 在做 | ❌ 无 | ⚠️ 差异化点 |
| npm/PyPI | PyPI (缺 token) | npm (未准备) | 🟢 持平 |
| **覆盖率报告** | ❌ 无 | 🟢 **vitest coverage 可用** | ✅ 我们有 |

---

## 本轮战略：功能矩阵超越 — coverage report + npm 发布准备

两个方向的思考：

### 方向 A: 追桌面通知
Alpha 在做 notify。我们也能用 Node.js 的 `node-notifier` 实现通知。但这是追，不是超。

### 方向 B: 质量碾压 — coverage report 集成
我们的 `npm run coverage` 已经可用了（vitest + @vitest/coverage-v8）。但：
1. 每次跑完只看终端输出
2. 没有自动化的 HTML 报告
3. 没有 CI 集成自动生成覆盖报告

**如果我们在 `npm run coverage` 上做两件事：**
1. 生成漂亮的 HTML 覆盖率报告（lcov + html 报告器）
2. 在 `repo-sense insight` 中加入 `--coverage` 选项输出当前测试健康度
3. 写一个 `repo-sense coverage` 命令，展示覆盖率面板

**这比桌面通知更核心** — 桌面通知是锦上添花，测试覆盖报告直接提升开发体验。而且 vitest 的 lcov 报告天然可集成 CI。

### 方向 C: npm 发布准备
Alpha 在折腾 PyPI 发布（缺 token 发不出去）。我们可以准备 npm 发布：
1. 检查 npm 账号状态
2. 确保 prepublishOnly 脚本正确
3. 生成 npm ignore / README preview

### 最终决策：方向 B + C 并行

**为什么？**
1. Alpha 桌面通知估计要 20 分钟才能实现，而且 WSL 下桌面通知大概率有问题（他们自己也列了风险）
2. 我们的 coverage report 是开发工具链的自然升级，复用已有的 vitest 配置
3. npm 发布准备比 PyPI 简单 (npm publish直接走token)
4. 同时做 B+C 能让仲裁者看到"功能数量增加 + 发布管线就绪"

---

## 任务分配

| 角色 | 任务 | 优先级 | 预计 | 说明 |
|------|------|:------:|:----:|------|
| **dev-1** 🧪 | 🚀 `repo-sense coverage` 全新命令 | **P0** | 20m | 新文件 src/commands/coverage.ts + index.ts 注册 |
| **dev-2** 🚀 | 📦 npm 发布准备工作 + coverage HTML 报告器 | **P0** | 15m | vitest config + lcov/html + npm token 检查 |
| **mkt** 📝 | 📝 README 更新: coverage 命令文档 + npm install 指南 + 功能矩阵表 | P1 | 10m | 依赖 dev-2 完成npm检查 |

### dev-1: `repo-sense coverage` 命令 (详细)

**设计思路:**
```typescript
// src/commands/coverage.ts
// 一个极简的 coverage dashboard
// 
// 功能:
// 1. 运行 `npx vitest run --coverage`（或读取已有 .coverage/lcov.info）
// 2. 解析 lcov 文件获取覆盖率数据
// 3. 用 chalk + cli-table3 渲染覆盖率面板：
//    ┌──────────────┬──────────┬──────────┐
//    │ File          │ Lines    │ Branches │
//    ├──────────────┼──────────┼──────────┤
//    │ src/github.ts │ 85.7% 🟢 │ 72.3% 🟡 │
//    │ ...           │          │          │
//    └──────────────┴──────────┴──────────┘
// 4. 顶部显示综合覆盖率（Statements / Lines / Branches / Functions）
// 5. 颜色编码：>80% 🟢, >60% 🟡, <60% 🔴
// 
// 技术选型:
// - 直接用 @vitest/coverage-v8 的 JSON 输出模式
// - vitest.config.ts 中配置 coverage.reporter = ['text', 'json', 'lcovonly']
// - 解析 coverage/coverage-final.json
// - 不需要额外依赖
//
// 注册:
// - src/index.ts: rv.program.command('coverage').description('Show test coverage dashboard')
```

### dev-2: npm 发布准备 + coverage 报告器配置

**Step 1: vitest config 更新**
```typescript
// vitest.config.ts 或 vitest.config 字段
coverage: {
  reporter: ['text', 'json', 'lcovonly', 'html'],
  reportsDirectory: './coverage',
  include: ['src/**/*.ts'],
  exclude: ['src/**/*.test.ts', 'src/**/__tests__/**'],
}
```

**Step 2: npm 发布准备**
- 检查 `npm whoami` 状态（看有没有登录）
- 检查 `.npmrc` 是否存在
- 确认 `prepublishOnly` 脚本在 package.json 中正确配置
- 确认 `files` 字段包含 dist/ 和 bin/
- 准备 `README.md` → npm 包页面的显示预览

---

## 验收标准

1. ✅ `rs coverage` → 彩色覆盖率面板展示（Statements / Lines / Branches / Functions）
2. ✅ `npm run coverage` → 生成 HTML 报告（coverage/index.html）
3. ✅ `npm whoami` 确认登录状态（如果没有就引导用户登录）
4. ✅ `npm test` → **81 passed, 0 failed**（不影响现有测试）
5. ✅ `npm run build` → 通过
6. ✅ README 有 coverage 命令文档 + npm install 指南

---

## 风险登记

| 风险 | 影响 | 概率 | 应对 |
|------|:----:|:----:|------|
| `rs coverage` 命令依赖 `npx vitest run --coverage` 先跑 | 🟢 低 | 🟢 高 | 命令内部自动触发 vitest，或检查已有 coverage JSON |
| npm token 可能不存在 | 🟡 中 | 🟡 中 | 不阻塞 — 至少确认 npm 包结构正确，发布可以后续手动操作 |
| coverage JSON 格式跨版本不一致 | 🟡 中 | 🟢 低 | 用 vitest 内置 reporter，格式稳定 |
| Alpha 桌面通知真的做出来了 | 🟡 中 | 🟡 中 | 我们有 coverage 差异化 + npm 发布准备 — 两条线对冲 |

---

## 与 Alpha 对比预测 (本轮回合后)

| 维度 | Alpha (54分) | Beta (59分) | 预期变化 |
|------|:-----------:|:-----------:|:--------:|
| 分数 | 54 | 59 → **61+** | 🚀 coverage + npm 准备加分 |
| Commits | 141 | 125 → **129+** | +3-4 commits |
| 功能命令 | 13 | 8 → **9** | +1 (coverage) |
| 测试 | 248 ✅ | 81 ✅ | 持平全绿 |
| 视觉效果 | █ ASCII | █ chalk 彩色 | ✅ 持续 |
| 桌面通知 | 🚀 开发中 | ❌ 无 | 我们选择不追 |
| **npm/PyPI 发布** | ❌ 缺 token | **🟢 准备就绪** | ✅ 差异化 |
| **覆盖率报告** | ❌ 无 | **✅ 内置命令** | ✅ 差异化 |

---

## 核心战略备忘

> "Alpha 在做通知，我们在做质量基础设施。桌面通知是锦上添花，覆盖率面板和可发布的 npm 包是雪中送炭。仲裁者给的是谁的项目更像真正的产品，而不是谁的功能列表长。npm publish ready + coverage dashboard = 真正的开源项目。这就是为什么我们从 59 分走到 60+。"

---

*β-Labs Corp. — 59 分领先，全绿锁定。现在是时候把 repo-sense 变成一个真正的、可发布的、质量可量化的开源项目了。不是追 Alpha 的功能，而是重新定义什么是"完成"。🚀*
