# Task 026-028: Cycle 9/10 — CLI 安装闭环、缓存护栏、发布收口

**来源**: decision-017.md
**截止**: 当前 cycle 结束前
**周期**: Cycle 9/10

---

## Task 026 — CLI 真实入口回归护栏

**执行者**: dev-1
**优先级**: P0

[需求] 要什么：验证并跑通 `tests/cli.test.ts`，必要时做最小修补 ｜ 为什么：npm 先发必须有真实 CLI 入口证据链，不是只会 `npm publish` ｜ 优先级：P0

### 范围
- 关注 `tests/cli.test.ts`
- 关注 `dist/cli.js --version`
- 关注 `digest --export md --output <file>` 的可执行性
- 如需改代码，只允许最小修补；禁止大改 CLI 架构

### 验收
- `npx vitest run tests/cli.test.ts` 通过
- 全量 `npx vitest run` 不回归
- 提交 ≤ 80 行新增

### 不要做
- ❌ 不追新命令
- ❌ 不重写 build 流程
- ❌ 不顺手改 unrelated docs

---

## Task 027 — cache 行为测试补强

**执行者**: dev-2
**优先级**: P1

[需求] 要什么：验证并完善 `tests/cache.test.ts`，必要时补 2-4 个小测试 ｜ 为什么：cache 是 fetch 体验和 API 稳定性的底座，属于体验型质量分 ｜ 优先级：P1

### 范围
- 关注 `cacheGet` / `cacheSet`
- 覆盖：miss、hit、过期、payload round-trip
- 测试应贴合现有实现，不要倒逼大改源码

### 验收
- `npx vitest run tests/cache.test.ts` 通过
- 全量 `npx vitest run` 不回归
- 提交 ≤ 80 行新增

### 不要做
- ❌ 不引入新依赖
- ❌ 不重构 cache 模块
- ❌ 不碰无关命令代码

---

## Task 028 — 发布叙事收口 + 工作区去噪

**执行者**: mkt
**优先级**: P1

[需求] 要什么：收口 README 的转化段落，并确保测试产物/临时文件不进入提交 ｜ 为什么：Beta 赢在体验和纪律感，不能让 `results.json` 这类噪音毁掉观感 ｜ 优先级：P1

### 范围
- README 保留最值钱部分：Quick Start、Usage Recipes、npm CTA
- 去除/忽略测试运行产物
- 将本轮对外口径收成：安装即用 / CLI 已验 / cache 已锁

### 验收
- 工作区无测试产物噪音待提交
- README 叙事与真实已验证能力一致
- 提交 ≤ 80 行新增

### 不要做
- ❌ 不写大而空 roadmap
- ❌ 不夸大未验证能力
- ❌ 不把 node_modules、coverage、临时结果文件带进提交

---

## 协同顺序

1. mkt 先去噪，保证工作区干净
2. dev-1 跑 CLI 入口护栏
3. dev-2 跑 cache 测试补强
4. mkt 最后基于实际结果收口 README / 发布话术

---

*结构化通信要求：*
- [报告] 做了什么→结果→阻塞
- [审查] 文件→问题→建议
- [经验] 发现→场景→验证
