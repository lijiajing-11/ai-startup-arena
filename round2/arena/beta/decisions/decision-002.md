# Decision 002: Cycle 2 — 守住先发，订阅功能上线 + npm 发布 🚀

**日期:** 2026-06-09 08:37
**决策者:** Blake (CEO, β-Labs Corp.)
**周期:** Cycle 2
**比分:** Beta 17测试全绿 / Alpha 刚完成digest MVP

---

## 1️⃣ 情报收集 (Scouting)

### 对手状态 (Alpha)
| 维度 | 状态 |
|:----|:-----|
| 进度 | `feat(cli): implement digest/subscribe/read commands (#020-A)` — 刚提交 |
| CLI | `digest` 可用带 `--topic/--top/--output`，`subscribe` 和 `read` 是 placeholder |
| arXiv | `arxiv_client.py` 带 retry + 缓存（文件缓存，同我们的方案） |
| 测试 | 有 test 文件但未在 commit 范围？待查 |
| 技术债 | subscribe/read 还是 placeholder，显示他们优先做 digest |

### 我们的状态 (Beta)
| 维度 | 状态 |
|:----|:-----|
| 代码 | 🔴 所有核心代码未提交（17测试，满分）— 风险！ |
| CLI | `digest` + `read` 完整实现 |
| 测试 | 17/17 全绿 ✅ |
| Build | tsup build 成功 ✅ |
| README | 已写完整的 npm 发布描述，含对比表 |
| 缺失 | ❌ `subscribe` 命令未实现；❌ npm 未发布 |

### 差距分析
| 维度 | Alpha | Beta | 差距 |
|:----|:-----|:----:|:----:|
| CLI命令 | digest ✅ / subscribe ⚠️ / read ⚠️ | digest ✅ / read ✅ / subscribe ❌ | ⚠️ 持平（都有 placeholder） |
| 测试覆盖 | 未知 | 17测试 ✅ | 🟢 优势 |
| 发布 | 未开始 | README 已写，未 push | ⚖️ 持平 |
| UI体验 | rich 格式 | chalk 彩色卡片 + 进度条 + 评分 | 🟢 同级别优势 |
| 代码干净度 | 未爆篇幅 | 总代码 910 行，需拆分提交 | 🟢 好 |

---

## 2️⃣ 策略制定 (Strategy)

### 核心策略：「commit → subscribe → publish」三段式 ⚡

Alpha 刚提交了他们的 MVP commit。我们代码已经就绪但未 commit — 这是风险。三阶段执行：

**Phase 1 (P0): 分段提交基线代码**
- 目标：≤80行/commit，干净提交基线，消除"代码没提交"风险
- 5个提交：core/arxiv + cache → rank + sort → summary + summarize → display + output → cli + index + tests
- 总计 ~910行，按 80 行上限分 ~12 个 commit

**Phase 2 (P1): 实现 subscribe 命令**
- Alpha 的 subscribe 是 placeholder — 正好在我们画赛道的订阅 UX 上加速
- 本地 JSON 订阅存储 + CRUD 命令 (subscribe/list/unsubscribe)
- Telegram 推送 + Email SMTP 推送 基础设施
- 彩色卡片展示订阅列表

**Phase 3 (P2): npm 发布**
- `npm pack` 验证 → 配 token → `npm publish`
- 确保 `paper-digest-beta` 可全局安装
- 更新 README badge + 发布检视

### 为什么不
- ❌ 不追 LLM 增强 — 规则摘要已经够好，不拖慢发布
- ❌ 不跟 alpha 比谁 digest 先跑起来 — 我们已经有，直接跳到订阅体验
- ❌ 不动 display.css 或前端 — CLI 工具，聚焦核心

---

## 3️⃣ 任务分配

| 成员 | 任务 | 优先级 | 预估 |
|:----:|:----:|:------:|:----:|
| **dev-1** 🔥 | Phase 1: 分段提交基线代码 (≤80行/commit) | **P0** | 15m |
| **dev-1** 🔥 | Phase 2: subscribe 命令 + 推送基建 | **P0** | 30m |
| **mkt** 📝 | Phase 3: npm 发布 + README 更新 | **P1** | 10m |

### Task 004 (P0): 分段提交基线
- 按功能模块拆分 4-5 个 commit，每个 ≤80 行新增
- commit 1: core/arxiv + cache (arXiv fetch + retry + cache)
- commit 2: rank + sort (关键词排序)
- commit 3: summary + summarize (规则摘要引擎)
- commit 4: display + output (chalk 卡片渲染 + Markdown 导出)
- commit 5: cli + index + tests (CLI 入口 + 测试全绿)

### Task 005 (P0): subscribe 订阅命令
- `~/.config/paper-digest/subs.json` 本地订阅存储
- `paper-digest subscribe --topic X --channel telegram` — 添加订阅
- `paper-digest subscribe --list` — 列出订阅（chalk 卡片）
- `paper-digest subscribe --topic X --unsubscribe` — 删除订阅
- Telegram Bot API 推送模块（placeholder 实现，存 URL 即可）
- Email SMTP 推送模块（placeholder 实现，存 smtp 配置即可）

### Task 006 (P1): npm 发布
- `npm pack` 验证
- `npm publish --access public`
- README 更新：发布 badge、安装命令、使用示例

---

## 4️⃣ 风险监控

| 风险 | 影响 | 概率 | 应对 |
|:----|:----:|:----:|:-----|
| npm token 未配置 | 发布卡住 | 🟡 中 | 检查 `npm whoami` / token env var |
| package name 被占 | 无法用 paper-digest | 🟢 低 | 已用 scoped paper-digest-beta |
| 订阅功能未测试 | 仲裁扣分 | 🟡 中 | 测试优先，写 vitest 测试 |
| Alpha 也在做 subscribe | 功能重叠 | 🟡 中 | 我们 UI 更好 + npm 先发 = 碾压 |

---

## 5️⃣ 一句话总结

> "Cycle 2，三段推进：先扫地（commit 基线代码消除风险），再建房（subscribe 订阅 UX），最后挂招牌（npm 发布）。Alpha 刚交完 digest MVP，我们的 digest 已经跑通 — 现在跳到订阅功能和 npm 先发，在他们变成真功能前占领发布高地。订阅的 UX 是我们的主场：彩色卡片订阅列表 + 多渠道推送，Alpha 的 subscribe 还是个 print('coming soon')。🚀"

---

*Blake, CEO @ β-Labs Corp.*
*"Commit clean. Ship fast. Publish first."*
