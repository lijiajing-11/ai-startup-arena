# Decision 021: Cycle 5 深度碾压收官 — 发布闭环 + 个性化核心

**日期:** Cycle 5
**决策者:** Atlas (CEO, A-Tech Inc.)
**周期:** 5/10

---

## 1. 情报收集 (Scouting)

### 我方最近变化
- `c7885d1` docs: sharpen README and release messaging
- `147b990` feat: implement read command with print_single_paper renderer
- `05ebb60` docs: reflect `read` command shipping — 71 tests, roadmap update

最近 diff 说明：我方本轮主要在 `README.md`、`paper_digest/cli.py`、`paper_digest/formatter.py` 以及测试文件推进，已经把 `read` 命令与展示层补齐。

### 对手最近变化
- `efbfb53` docs: upgrade paper-digest README for npm launch and community conversion
- `f260f5a` docs: README v4 — EN subtitle, target users, 94+ tests, CTA upgrade
- `485aac7` test(index): add exports coverage for VERSION and TEAM
- `0f40ceb` chore: remove placeholder test file
- `986ea1e` docs: comprehensive README with hero, commands, comparison table, roadmap

### 对手变化分析
- 新增功能：暂无明显新核心功能，最近重心仍是 README 包装与测试补缀
- 改进点：npm 先发上线、文案转化更积极
- 弱点：工作区很脏，最近 diff 混入 `coverage/`、`dist/`、`node_modules/`；说明工程纪律和可维护性存在明显风险

---

## 2. 差距分析 (Gap Analysis)

### 发现的 4 个关键差距
1. **发布差距**：Beta 已经占到“可安装”心智位，我们还没真正把 Python 包发出去
2. **个性化差距**：需求书里的“按用户兴趣个性化排序”仍是最高价值核心，README 强化不能替代算法深度
3. **测试结构差距**：我方测试更多，但需要把新增排序/订阅能力继续锁死，避免最后几轮回归翻车
4. **工程纪律优势窗口**：Beta 工作区噪音很大，我们可以用“小提交 + 干净发布 + 可验证安装”形成专业感碾压

### 战略判断
- 70% 自己节奏：围绕“检索更准 + 个性化更强 + 真正可发布”推进
- 30% 应对对手：只反制对手的 npm/README 心智，不跟着做文案军备竞赛

---

## 3. 策略制定 (Strategy)

### 战略方向
**发布闭环 + 个性化深挖**

### 核心目标
本 cycle 不追表面新命令，集中打通两件真正决定胜负的事：
1. 让 `paper-digest` 真正可发布到 PyPI / TestPyPI 并可验证安装
2. 把排序推进到“基于用户兴趣画像的个性化排序”，形成 Beta 暂时做不到的深度壁垒

### 为什么现在做
- cycle 5 已经不该继续停留在“命令补齐 + README 优化”层面
- 项目 brief 明确把个性化推荐列为差异化高分项
- 用户在 role 中明确强调：检索更准、个性化更强、可真正发布到 PyPI

### 风险
- PyPI token 不存在，可能只能先走 TestPyPI 或源码 fallback
- 个性化排序若改动过大，容易违反单 commit ≤ 80 行新增
- 排序策略若没有测试护栏，后续多渠道推送接入会回归

### 预期收益
- 形成“能安装、能跑、能个性化”的真实产品闭环
- 把 Alpha 的优势从“测试多”升级为“核心能力深”
- 为后续 digest 命令做出真正可宣传的差异点

---

## 4. 任务分配 (Task Delegation)

本 cycle 只发 3 个任务，全部是实质性任务，且测试明确占一席。

### Task A — 发布闭环 (P0)
目标：确认本地凭证、构建 wheel/sdist、尝试发布到 PyPI；若正式 token 不可用，则完成 TestPyPI 或源码安装 fallback，并同步 README 安装指引。

负责人：Dev-1

### Task B — 个性化排序最小闭环 (P0)
目标：在不引入 bloat 的前提下，为 digest 排序加入用户兴趣画像输入（订阅 topic / 历史兴趣关键词 / 用户偏好权重），让结果不再只是通用 topic 匹配，而是“同 topic 下按用户兴趣再排序”。

负责人：Dev-2

### Task C — 测试与回归护栏 (P1)
目标：围绕个性化排序与发布安装路径补测试；至少覆盖：偏好命中提升、无偏好时回退默认排序、配置读取边界、CLI 入口不回归。

负责人：QA / 审查

---

## 5. 进度跟踪 (Progress Tracking)

### 执行顺序
1. 先查发布凭证与构建路径，避免继续在“可发布性”上空转
2. 并行定义个性化排序最小实现边界，只允许小步改动
3. 测试最后兜底，但必须与排序实现同步设计，不能事后补洞

### 阻塞预案
- 若无 PyPI 凭证：立即切 TestPyPI；若仍无凭证，保底写清源码安装并产出验证记录
- 若排序相关文件耦合过高：只做 scorer 层扩展，不重写 CLI 流程
- 若测试新增过大：拆成多 commit，每个 commit 控制在 ≤ 80 行新增

---

## 6. 复盘与下一步 (Retrospective Preview)

### 本轮必须做对的事
- 不再沉迷 README 表层优化
- 不再为了追对手而追加低价值功能
- 所有动作都要能指向 brief 的核心评分项

### 本轮避免犯的错
- 把“发布”理解成只改文档、不做安装验证
- 把“个性化”做成大而空的架构重构
- 测试缺席，导致最后几轮技术债反扑

### 下轮预告
如果本轮发布闭环 + 个性化排序打通，下一轮就可以顺势推进：
1. digest 输出中的“为什么推荐给你”解释
2. Markdown / email 推送复用个性化摘要文案
3. 趋势分析作为第二层差异化，而不是先做花哨外围

---

*Atlas, CEO @ A-Tech Inc.*
*"深度不是功能数量，是别人抄不走的核心。"*
