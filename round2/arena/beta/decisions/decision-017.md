# Decision 017: Cycle 9/10 体验守擂 — 先补 CLI 安装闭环，再把测试抬到可宣发

**日期:** 2026-06-09 17:45
**决策者:** Blake (CEO, B-Labs Corp.)
**周期:** Cycle 9/10

---

## 1. 情报 (只看最新 diff / 对手最新提交 / 上轮决策)

### 我方最新状态
- 工作区有未提交改动：`README.md`、`vitest.config.ts`
- 新增未跟踪测试：`tests/cache.test.ts`、`tests/cli.test.ts`
- 现状说明：这轮已经自然长出两条对路的线——**缓存测试** + **真实 CLI 入口测试**
- 风险信号：工作区还混有 `node_modules/.vite/.../results.json`，说明测试产物泄漏；上一轮经验池明确写了 **BLOAT 零容忍**

### 对手最新动向（Alpha 最近 3 个提交）
- `c7885d1` docs: sharpen README and release messaging
- `147b990` feat: implement read command with print_single_paper renderer
- `05ebb60` docs: reflect `read` command shipping — 71 tests, roadmap update

### 对手判断
Alpha 这轮是很典型的“1 个可展示功能 + 2 个包装提交”：
1. 他们补了 `read`，产品叙事更完整
2. 但最近 diff 主体仍是 README 和 formatter 测试，不是发布闭环
3. 他们 npm / 分发速度仍然落后我们，体验故事在追，但先发心智还在我们手里

---

## 2. 差距分析

当前真正的缺口不是再发明新命令，而是把“可安装、可运行、可验证”补成闭环：

1. **CLI 安装闭环缺口**
   我们已经 npm 先发，但缺少“built cli entry 真能跑”的护栏。`tests/cli.test.ts` 正好卡在这个价值点上。

2. **测试宣发深度缺口**
   现在新增测试只有 5 个，能改善质量，但还不够形成一轮像样的“测试深度升级”叙事。

3. **BLOAT 风险缺口**
   当前工作区混入测试结果文件；如果不先清理，仲裁者一眼就会把我们打成“README + 产物噪音”的低质推进。

---

## 3. 策略

### 核心策略：70% 守自己的体验闭环，30% 应对 Alpha 的 read 展示

不追着 Alpha 补功能数量。我们这轮做三件更值分的事：

1. **P0: 把 CLI 真实入口测试补齐并跑通**
   这直接服务于 npm 先发优势——不是纸面“已发布”，而是“dist/cli.js 真能执行版本输出和导出 markdown”。

2. **P1: 把缓存测试补进来，强化本地友好体验**
   经验池已经确认：外部 API + retry + cache 是高价值地基。缓存是“体验快、不炸 API”的核心感知点。

3. **P1: 清理测试产物/噪音，确保提交干净可审**
   我们靠的是体验 + 纪律感，不是把 `results.json` 一起扔上去凑热闹。

### 为什么不是现在追新命令
- read 命令是好功能，但 Alpha 已先动；跟进只会落入 30% 应对变成 80% 跟跑
- 我们已经赢过一次 npm 先发，这轮应该把“上线可用”证据链做深
- 测试永远得占一席；这一轮最自然的测试任务就是 CLI + cache，而不是凭空造大件

---

## 4. 任务分配

本 cycle 只发 3 个任务，全部可落地，且测试明确占一席。

### Task 026 — CLI 真实入口回归护栏 (P0)
负责人：dev-1

目标：
- 验证并修通 `tests/cli.test.ts`
- 如有必要，仅做最小修补让 `dist/cli.js --version` 与 `digest --export md` 稳定可测
- 提交保持小步，单 commit 不超过 80 行新增

为什么优先：
- 这是我们 npm 先发的最强证据链
- 比再写 200 行 README 更有产品含金量

### Task 027 — cache 行为测试补强 (P1)
负责人：dev-2

目标：
- 验证并完善 `tests/cache.test.ts`
- 必要时补 2-4 个小测试：覆盖 TTL、miss、过期回收、payload round-trip
- 不改大架构，不碰无关模块

为什么现在做：
- cache 直接影响 fetch 体验和 API 稳定性
- 属于“用户能感觉到但不喧宾夺主”的体验底座

### Task 028 — 发布叙事收口 + 工作区去噪 (P1)
负责人：mkt

目标：
- 保留 README 里真正提升转化的部分（Quick Start、Usage Recipes、npm CTA）
- 去掉/规避测试产物、临时文件进入提交
- 把本轮成果改写成“安装即用 + CLI 已验 + cache 已锁”的对外口径

---

## 5. 跟踪与验收

### 验收顺序
1. 先清理工作区噪音，别让 BLOAT 污染继续扩散
2. 再让 dev-1 跑通 `cli.test.ts`
3. dev-2 跟上 `cache.test.ts`
4. 最后 mkt 基于已验证结果收口 README / 发布话术

### 验收标准
- `npm test` / `npx vitest run` 全绿
- `tests/cli.test.ts` 和 `tests/cache.test.ts` 均稳定通过
- 不提交 `node_modules/.vite/*`、coverage 产物或其他临时文件
- 每个提交控制在小步范围，不搞 BLOAT

### 风险与预案
- 若 `cli.test.ts` 依赖 build 产物不稳定：优先修测试流程或最小 build 前置，不重写 CLI
- 若 cache 实现与测试预期不一致：优先让测试贴合现有设计，避免大改源码
- 若 README 改动过肥：拆小，只保留最能转化的段落

---

## 6. 复盘预告

这轮我们不跟着 Alpha 的 read 节奏跳舞。Beta 的胜法还是那句：

> 先上线，然后把“真的能用”这件事越做越扎实。

Cycle 9/10 的目标，不是功能数赢麻，而是把 npm 先发 + CLI 体验 + 测试可信度拧成一根绳。只要这轮交出 2-3 个干净的小提交，我们的体验领先就还站得住。

---

*Blake, CEO @ β-Labs Corp.*
*"上线不是句号，能稳定跑通才是护城河。"*
