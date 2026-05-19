# Decision 010: 修复 2 个失败测试 + 加固 CI 管道

**时间**: 2026-05-19 10:59
**作者**: Blake (CEO, β-Labs Corp.)
**周期**: Cycle 10 (测试修复 Phase)

---

## 当前局势分析

### 🏟️ Leaderboard (Cycle 17)

| 排名 | 团队 | 分数 | Commits | 状态 |
|:----:|------|:----:|:-------:|:----:|
| 🥇 | Beta (β-Labs Corp.) | **59** | **125** | ✅ 干净 |
| 🥈 | Alpha (Α-Tech Inc.) | **54** | 141 | ⚠️ BLOAT 污染 |

**我们领先 5 分。** 🎉

### Cycle 9 执行回顾

| 线 | 功能 | 状态 | 说明 |
|:--:|------|:----:|------|
| 1 | 🚀 `rs battle 3+` 三方混战 | ✅ **完成** | watch.ts 新增 battleMultiRepos + renderBattleMulti，index.ts 已注册 `<repos...>` 可变参数 |
| 2 | 🧪 history 命令测试 | ✅ **完成** | 3 个 history 测试已追加（导出检查 + 渲染 + 新 repo 边缘） |
| 2 | version bump 0.2.0 → 0.2.1 | ✅ **完成** | 已核对 package.json 版本 |
| 3 | 📝 README 更新 | ✅ **完成** | market-beta-update-16 确认更新完毕，含 battle 3+/history 文档 |

### 但... 2 个测试失败

```
FAIL  src/__tests__/commands.test.ts > battleMultiRepos > 3 repos calls getRepos (not battleRepos)
TypeError: Cannot destructure property 'data' of 'repoResponse' as it is undefined.

FAIL  src/__tests__/commands.test.ts > battleMultiRepos > renderBattleMulti renders without throwing
TypeError: table.push is not a function
```

**总测试**: 81 total, 79 passed, **2 failed**

### 根因分析

#### 失败 1: `3 repos calls getRepos`

`battleMultiRepos(['a/a', 'b/b', 'c/c'])` → 调用 `getRepos()` → 调用 `getRepo()` for each → `getRepo()` 做:
```typescript
const { data } = repoResponse;  // 崩溃点
```

测试的 mock Octokit 返回了 `{ full_name: 'test/mock' }` 但 `getRepo()` 期望 `{ data: { full_name, description, language, license: { spdx_id }, ... } }`。测试中 `mockOctokit.prototype.rest.repos.get` 被设置了，但这个原型修改不被 `new Octokit()` 构造函数捕获 — 因为 mock constructor 返回的是硬编码对象而非调用 prototype。

**实际:** 测试在 beforeEach 里试图修改 prototype，但顶层 `vi.mock('@octokit/rest')` 的 mock constructor 直接返回静态对象，不读取 prototype。

#### 失败 2: `renderBattleMulti renders without throwing

`renderBattleMulti` 创建 `new Table(...)` 后调用 `table.push(starRow, forkRow, issueRow, langRow, licRow, ageRow)` — 多参形式。但 `cli-table3` 的 `vi.mock('cli-table3', () => ({ default: vi.fn().mockImplementation(...) }))` 对某些 vitest hoisting 行为下可能不解析为预期的 Table constructor。也可能是 chalk 链式调用的 `hex()` 方法在 mock 中没有被 Proxy 捕获。

---

### Alpha 最新动态

Alpha Cycle 13 (10:33): 
- Phase 3 代码质量革命
- BLOAT 清理中 (history.py → chart.py)
- PyPI 发布缺 token
- CI badges + README 装修

**策略判断**: Alpha 还在修代码质量。我们多轮欠账已基本补完。现在唯一的问题就是 **2 个失败的测试让仲裁者看到"不绿"状态**。如果 Alpha 在这轮 BLOAT 清理完、分数回升，而我们测试还红着，就是送分。

---

## 本轮战略: 所有资源压测试修复

### 原则
1. **测试全绿优先于一切** — 79/81 绿看起来很接近满分，但仲裁者只看是不是全绿
2. **不要写新功能** — 所有功能已在 Cycle 9 完成了
3. **不触碰正常工作代码** — 只改测试文件，不改 src/ 里的生产代码
4. **写一次，修好就锁死** — 写完后 CI 再跑确认

### 任务分配

| 角色 | 任务 | 优先级 | 预计 | 说明 |
|------|------|:------:|:----:|------|
| **dev-1** 🧪 | 修复 `renderBattleMulti renders without throwing` | **P0** | 10m | cli-table3 mock 或 chalk hex() mock 问题 |
| **dev-2** 🚀 | 修复 `3 repos calls getRepos (not battleRepos)` | **P0** | 10m | Octokit mock 响应结构不匹配 |
| **mkt** 📝 | 测试全绿后确认/更新 README badges | P2 | 5m | 等 dev 修复完 |

---

## 验收标准

1. ✅ `npm test` → 81 passed, 0 failed
2. ✅ `npm run build` → 通过
3. ✅ `npm run coverage` → 成功输出覆盖率报告

---

## 风险登记

| 风险 | 影响 | 概率 | 应对 |
|------|:----:|:----:|------|
| mock 修复后有连锁失败的测试 | 🟡 中 | 🟢 低 | 全量跑 `npm test` 确认 |
| cli-table3 mock 在 vitest hoisting 下行为不一致 | 🟡 中 | 🟡 中 | 改用 `vi.importActual('cli-table3')` fallback |
| Octokit mock 需要完整的 15+ 字段响应 | 🟢 低 | 🟢 低 | 用 `makeApiResponse` 辅助函数（参考 github.test.ts） |
| Alpha 在这轮修复 BLOAT 把分数推平 | 🔴 高 | 🟡 中 | 我们有 5 分缓冲，但不能再拖了 |

---

*β-Labs Corp. — 59 分领先，所有功能就绪，就剩 2 个测试钉子。敲进去就完事了。🚀*
