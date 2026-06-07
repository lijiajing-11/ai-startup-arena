# AI Startup Arena — 第二轮进化方案（吸收五大Agent框架精华）

> 出方案：Opus 4.8 ｜ 执行：明天切 Sonnet 4.6 照此跑
> 核心信条：站在巨人肩膀上做创新 —— 把 AutoGPT/LangGraph/Dify/CrewAI/AutoGen 的精华，注入你自己的进化引擎

---

## 一、Context（为什么做这一轮）

第一轮 arena 已证明引擎能力：8 小时、330 commits、产出两个完整 CLI（ARA / repo-sense），44:44 平局。
但**真正的产品是引擎本身**（NEXT_EVOLUTION 的核心论点），而第一轮暴露了 4 个硬伤：

| 硬伤 | 证据 | 对应教训 |
|------|------|---------|
| 仲裁数据丢失 | Cycle 1-16 没写进 leaderboard（脚本路径错误） | 数据持久化 |
| 发布失败 | Alpha 卡 PyPI token，没真正上线 | 发布成功率 |
| 代码技术债 | Alpha 有 BLOAT 污染，Beta 干净 | BLOAT 零容忍 |
| Agent 失忆 | 每 cycle 新 session，上轮学的全忘（SKILL_TREE 明确指出） | 记忆/技能传承 |

这一轮的目标是**双赢**：①产出一个新方向的完整产品；②让引擎吸收业界 Agent 框架的精华、把上述硬伤一次性补掉，使引擎"越用越强"。

---

## 二、从五大框架提炼的进化点（这一轮的灵魂）

你发的腾讯那篇文章给了我一个清晰的映射——每个框架的杀手锏，恰好对应 arena 现在缺的一块：

| 框架 | 它的杀手锏 | arena 当前的缺失 | 注入 arena 的具体改造 |
|------|-----------|-----------------|---------------------|
| **AutoGPT** | 思考-行动-反馈-学习闭环 + 长短期记忆 | Agent 每 cycle 失忆，上轮经验归零 | **技能树 + 经验池真正落地为 JSON**，每个 prompt 末尾注入"上轮记忆" |
| **LangGraph** | 有状态图 + 共享 State 持久化 + 可中断续跑 + 检查点可观测 | 仲裁是简陋状态机，数据会丢、无快照、不能续跑 | **仲裁脚本改为原子写 JSON 状态 + 每 cycle 快照 + 断点续跑** |
| **Dify** | 模型中立（多 provider）+ RAG 管道 | LLM 写死、无 RAG | 产品层用 RAG（新项目正好是论文检索）；引擎层 **LLM provider 可配置** |
| **CrewAI** | role+goal+backstory 结构化角色 + 自动委派 + **Crews(自主)/Flows(精确) 双范式** | prompt 是大白话，角色定义松散 | **prompt 重构为 role/goal/backstory**；明确哪些环节自主、哪些走固定流程 |
| **AutoGen** | 事件驱动 + 结构化消息 + **代码沙箱执行** + human-in-loop + 可观测 | 有结构化通信 SOP，但无"测试绿了才提交"的闸门 | 加 **测试 gate（沙箱）**；仲裁加 **human-in-loop 审批检查点** |

### 贯穿全篇的核心洞察：Workflow × Agent 混合架构

文章的主论点是"问题不可穷举、跨系统、需对话决策才用 Agent"。把它用到 arena，得出一个关键设计原则：

```
开放、不可穷举的环节 → 用 Agent 自主（CrewAI Crews / LangGraph 条件分支）
  • CEO 战略决策、Dev 功能设计、Marketing 文案

确定、可穷举的环节 → 用 Workflow 脚本保证可靠（CrewAI Flows / LangGraph 显式边）
  • 评分、git 提交、BLOAT 检测、发布、数据持久化
```

第一轮的 bug 全部出在"本该用确定脚本、却写得不可靠"的环节（仲裁数据丢失）。这一轮把这两类彻底分开：**Agent 负责创造，脚本负责记账与裁判**。

---

## 三、新项目方向决策（你选了"深入分析再推荐"）

### 推荐：`paper-digest` — AI 论文每日摘要推送工具 ⭐⭐⭐

四个候选逐一过：

| 候选 | 复杂度 | 能否复用你技能 | 能否展示框架精华 | 差异化空间 | 结论 |
|------|--------|--------------|----------------|----------|------|
| md2pdf | ⭐⭐ | 否 | 否（纯工具） | 小 | 太单薄，浪费引擎 |
| **paper-digest** | ⭐⭐⭐ | **是（RAG）** | **是（RAG/多Agent）** | **大** | **推荐** |
| Docker 监控 | ⭐⭐⭐ | 否 | 否 | 中 | 与 AI 无关 |
| AI 对话框架 | ⭐⭐⭐⭐ | 部分 | 是 | 大 | 太难，Sonnet 跑 20 cycle 风险高 |

**为什么是 paper-digest：**
1. **复用你刚练的 RAG 肌肉**——你昨天刚做完 RAG 工单（检索/摘要/嵌入），这个项目的"个性化论文推荐"本质就是 RAG，是你站在自己肩膀上。
2. **天然多 Agent 场景**——抓取→过滤→摘要→排序→推送是一条可拆分的链，正好让两队展示不同的 Agent 编排范式。
3. **能内化框架精华**——RAG 管道(Dify)、多渠道推送的工具生态(CrewAI)、会话/订阅记忆(AutoGPT)都能落到产品功能上。
4. **能真发布**——不强依赖付费 API：核心用 arXiv 公开 API + abstract 摘要 + 关键词排序就能跑通，LLM 摘要作为可选增强。这样"发布成功率"这个硬指标才达得成。

**双队技术栈分工（延续 Python vs TypeScript 对抗）：**

| | Alpha（A-Tech） | Beta（B-Labs） |
|--|----------------|---------------|
| 语言 | Python 3.10+ | TypeScript 5.x |
| 抓取 | `arxiv` / `requests` | `fetch` + arXiv Atom API |
| 摘要 | 规则摘要 + 可选本地 LLM | 规则摘要 + 可选 LLM |
| 推送 | 终端富文本 / Markdown / Email(SMTP) | 终端 chalk / Markdown / Telegram Bot |
| 检索 | TF-IDF / 嵌入相似度（复用 BGE 思路） | 关键词 + 嵌入 |
| 发布 | PyPI（这轮务必打通 token） | npm |
| 差异化 | 深度：个性化评分、多主题订阅、趋势分析 | 体验：彩色卡片、多渠道推送、订阅管理 UX |

> 备选：若你觉得 paper-digest 调 LLM 麻烦，退而求其次选 md2pdf（最快出成果）。但我强烈建议 paper-digest，它让"引擎 + 你的 RAG 技能 + 框架精华"形成合力。

---

## 四、引擎进化改造清单（核心，逐模块）

### 模块 1：Prompt 重构 — CrewAI 的 role/goal/backstory 结构

**现状**：`prompts/*.txt` 是大白话，且**写死了第一轮的上下文**（"已运行到 Cycle 18""ARA 追踪 GitHub Stars"），完全不能用于新项目。

**改造**：全部 8 个 prompt 按 CrewAI 范式重写，统一结构：

```
# Role（角色）
你是 {队伍} 的 {职位}，名叫 {名字}。

# Goal（目标，单句、可度量）
{这一轮要达成的核心目标}

# Backstory（背景人格，影响决策风格）
{差异化人格：Alpha 求深度严谨，Beta 求体验先发}

# Project（当前项目）
paper-digest — {一句话产品定义}
位置：{repo 路径}

# Memory（上轮记忆，由仲裁者自动注入 ← AutoGPT 精华）
{从 skill_trees/{profile}.json 读出的已掌握技能 + 上轮经验}

# SOP（遵循的标准流程）
参见 sop/templates/{ROLE}_SOP.md

# Hard Rules（红线 ← BLOAT 零容忍）
- 禁止 arenaStatus / auto-updated / 文件尾追加重复内容
- 测试不绿不许 commit（← AutoGen 沙箱 gate）
- 单次 commit ≤ 80 行新增（避免 BLOAT 扣分）

# Output（必须产出的文件）
{决策/任务/报告/代码}

# Comms（结构化通信，禁止自由聊天 ← AutoGen/CAMEL）
用 [需求]/[报告]/[审查]/[经验]/[求助] 格式
```

代表文件：`prompts/alpha-ceo.txt`、`prompts/beta-dev-1.txt`（其余 6 个同模式）。
**关键**：去掉所有"Cycle 18""ARA"等硬编码，cycle 号改由仲裁脚本运行时注入。

### 模块 2：仲裁脚本修复 — LangGraph 的持久化 State + 检查点

**现状**：`scripts/arbitrator_check.sh` 有三个致命问题：
- 评分只写 `cycle-NNN.txt`（两个数字），状态不完整、易丢（第一轮 1-16 全丢）
- `printf '%03d'` 拼文件名时有 `report-0NNN` 的多余 0 前缀 bug（第 60-61 行），永远匹配不到报告文件
- 末尾"trigger prompt update"是空操作（只 echo，没真更新 cycle 号到 prompt）

**改造**：
1. **原子写 JSON 状态**——每 cycle 写 `arena/state/cycle-NNN.json`（含两队分数、各维度明细、commits 数、测试数、发布状态、时间戳、BLOAT 标记），先写 `.tmp` 再 `mv`（原子，防半写丢失）。
2. **修复文件名 bug**——统一用 `printf '%03d' $CURRENT_CYCLE`，去掉多余的 `-0` 前缀。
3. **真正注入 cycle 号**——把当前 cycle 号写进每个 prompt 的 `# Memory` 区块（用占位符 `{{CYCLE}}` 替换），并注入上轮技能树。
4. **断点续跑**——启动时读 `arena/state/` 最大 cycle 号续跑，而非写死 17。
5. **可观测日志**——所有动作写 `arena/logs/arbitrator-{date}.log`（对应 LangGraph 全链路可观测）。

文件：`scripts/arbitrator_check.sh`（重写）。

### 模块 3：记忆系统落地 — AutoGPT 的长短期记忆

**现状**：`SKILL_TREE.md` / `EXPERIENCE_POOL.md` 只是**设计文档**，从没真正生成过 JSON。Agent 每轮失忆。

**改造**（新建，不改文档）：
- `arena/skill_trees/{profile}.json` × 8——每个 Agent 一棵技能树（mastered/learning/interested），仲裁者每 cycle 末尾更新。
- `arena/experience_pool.json`——跨队共享经验池（按 tags 检索），格式见 EXPERIENCE_POOL.md 现成模板。
- **注入机制**：模块 2 的脚本在每 cycle 开始时，把对应技能树 + 相关经验摘要塞进 prompt 的 `# Memory` 区块。
- 这就实现了 SKILL_TREE.md 里画的"技能树模式"：Cycle N 学的，Cycle N+1 记得。

### 模块 4：发布成为硬指标 — 闭合第一轮的失败

**现状**：发布只是"加分项"，Alpha 失败也没真正惩罚。

**改造**：
- 仲裁评分新增维度 **"可发布性"**：能 `pip install -e .` / `npm pack` 成功 +分；真正发布到 registry 额外 +分。
- 新建 `arena/playbooks/RELEASE_PYPI.md` 和 `RELEASE_NPM.md`——把发布流程（token 配置、twine/npm publish 命令、常见坑）固化为 playbook，作为经验池一部分，避免再卡 token。
- CEO 的 Goal 在后段 cycle（如 ≥15）强制包含"发布上线"。

### 模块 5：BLOAT 零容忍 — 把 Beta 的干净文化设为默认

**现状**：脚本只在 `+80 行` 时扣 6 分，事后惩罚，Agent 不知道红线。

**改造**：
- 红线**前置到 prompt**（模块 1 已含）：单 commit ≤80 行、禁重复模式、禁尾部追加。
- 脚本**增强检测**：除了行数，加检测重复函数名 / `auto-updated` 字样 / 文件尾重复块，命中直接标记并扣分 + 写进该 Agent 经验池作为反面教材。
- 测试 gate（AutoGen 沙箱思想）：Dev 提交前必须本地测试绿，仲裁抽查 `pytest` / `vitest` 退出码。

### 模块 6：Token 效率 — Profile 模式 + 结构化通信 + 上下文裁剪

**现状**：第一轮已用 Profile 模式（省 90%），但 chat 模式 debug 仍有开销。

**改造**：
- 强制 Profile 自治模式（`run_*.sh` 已是 `hermes -p`，保持）。
- prompt 顶部强调"不要重新读整个项目，只看 diff 和上次产出"（现有 prompt 已有这句，保留并强化）。
- 结构化通信协议（DEV_SOP 已有，省 50-70% token）扩展到所有角色 prompt。
- 上下文裁剪：Memory 区块只注入"本角色相关"的技能/经验，不是整个池子。

### 模块 7：执行编排 — 双范式混合 + human-in-loop

**现状**：`run_*.sh` 是 `while true` 死循环 + `hermes -p`，仲裁 cron 每 30 min。

**改造**：
- 保持 `run_*.sh` 的 Profile 循环（这是 Agent 自主层 = Crews）。
- 仲裁脚本是确定流程层（= Flows）。
- 新增 **human-in-loop 检查点**（AutoGen 精华）：每 5 个 cycle，仲裁脚本暂停并写 `arena/CHECKPOINT_NNN.md`，等你过目（可选批准/调整方向），避免第一轮"跑偏了也不知道"。
- 新增 `scripts/arena_init.sh`——一键初始化新一轮（重置 cycle、清旧 repo、生成新 prompt、建 state/skill_trees 目录）。

---

## 五、逐文件改动清单（明天 Sonnet 的施工图）

### 需要重写的文件
| 文件 | 动作 | 要点 |
|------|------|------|
| `prompts/alpha-ceo.txt` | 重写 | role/goal/backstory + paper-digest + Memory占位符 |
| `prompts/alpha-dev-1.txt` | 重写 | Python 开发者 + 测试gate红线 |
| `prompts/alpha-dev-2.txt` | 重写 | Python 测试/基建 |
| `prompts/alpha-mkt.txt` | 重写 | 文档/发布/订阅UX文案 |
| `prompts/beta-ceo.txt` | 重写 | 镜像 alpha-ceo，人格偏体验先发 |
| `prompts/beta-dev-1.txt` | 重写 | TS 开发者 |
| `prompts/beta-dev-2.txt` | 重写 | TS 测试/基建 |
| `prompts/beta-mkt.txt` | 重写 | 镜像 alpha-mkt |
| `scripts/arbitrator_check.sh` | 重写 | JSON状态+修bug+注入记忆+续跑+日志 |

### 需要新建的文件
| 文件 | 内容 |
|------|------|
| `scripts/arena_init.sh` | 一键初始化新一轮 |
| `arena/state/` | 每 cycle 的 JSON 状态（脚本生成） |
| `arena/skill_trees/{profile}.json` × 8 | 8 棵技能树初始种子 |
| `arena/experience_pool.json` | 经验池（含第一轮已沉淀的4条教训作种子） |
| `arena/logs/` | 仲裁日志目录 |
| `arena/playbooks/RELEASE_PYPI.md` | PyPI 发布 playbook |
| `arena/playbooks/RELEASE_NPM.md` | npm 发布 playbook |
| `alpha/repo/` | paper-digest Python 脚手架（README+setup.py+包骨架+1个测试） |
| `beta/repo/` | paper-digest TS 脚手架（README+package.json+src骨架+1个测试） |
| `PROJECT_BRIEF.md` | 新项目需求书（喂给两队的统一输入） |

### 需要保留/微调的文件
- `run_*.sh` × 8：保留 Profile 循环，仅确认路径。
- `sop/templates/*.md`：保留（CEO/DEV SOP 已很好），新增 `MARKETING_SOP.md` 若缺。
- `sop/SKILL_TREE.md` / `EXPERIENCE_POOL.md`：保留为设计文档，这轮让它们"从文档变现实"。

---

## 六、执行步骤（明天切 Sonnet，分阶段）

> 每阶段结束就能验证，避免一口气改完才发现问题。

**阶段 0：备份（5 min）**
- `git -C /mnt/d/ai-startup-arena add -A && git commit -m "snapshot: before round-2 evolution"`（保住第一轮成果，可回滚）

**阶段 1：写需求书 + 脚手架（30 min）**
- 写 `PROJECT_BRIEF.md`（paper-digest 完整需求）
- 归档第一轮：`alpha/repo` → `alpha/repo-round1`，`beta/repo` → `beta/repo-round1`
- 生成两队 paper-digest 空脚手架（能 `pytest`/`vitest` 跑通 1 个占位测试）

**阶段 2：引擎改造（60 min）**
- 重写 8 个 prompt（先写 alpha 4 个，beta 镜像）
- 重写 `arbitrator_check.sh`
- 写 `arena_init.sh`
- 建 8 棵技能树种子 + 经验池（含第一轮 4 条教训）+ 2 个发布 playbook

**阶段 3：冒烟测试（30 min，不烧大 token）**
- `bash scripts/arena_init.sh` 跑一遍，确认目录/状态/prompt 注入都正常
- 手动跑 1 次 `arbitrator_check.sh`，确认 JSON 状态正确写入、cycle 正确递增、leaderboard 渲染正常
- 单独触发 1 个 agent（如 alpha-dev-1）跑 1 个 cycle，看它能否读懂新 prompt、产出 commit、测试绿

**阶段 4：正式开跑（按需）**
- 启动 8 个 `run_*.sh` + 仲裁 cron
- 每 5 cycle 看 `CHECKPOINT_NNN.md`
- 跑满 MAX_CYCLE（建议先设 10 试水，顺了再拉到 20）

---

## 七、验证与回滚

**验证（每阶段）**
- 阶段 1：`cd alpha/repo && pytest` / `cd beta/repo && npm test` 各自绿。
- 阶段 2：`bash -n scripts/arbitrator_check.sh`（语法）+ `jq . arena/skill_trees/alpha-ceo.json`（JSON 合法）。
- 阶段 3：跑一次仲裁后，`cat arena/state/cycle-001.json` 有完整字段；`leaderboard.md` 不再是空行。
- 阶段 4：每 cycle 两队都有新 commit、测试绿、BLOAT 无告警。

**回滚**
- 任何阶段出问题：`git reset --hard <阶段0的 snapshot commit>` 即可回到第一轮完整状态。
- 第一轮产物已归档到 `*-round1`，不会被覆盖。

---

## 八、风险与权衡

| 风险 | 应对 |
|------|------|
| Sonnet 跑 20 cycle token 消耗大 | 先设 MAX_CYCLE=10 试水；Profile 模式已省 90% |
| paper-digest 依赖 LLM 摘要增加成本 | 核心走规则摘要（abstract+元数据），LLM 仅可选增强，保证能发布 |
| arXiv API 限流 | 加缓存 + retry（写进 Dev prompt 红线） |
| 改 prompt 后 agent 读不懂 | 阶段 3 单 agent 冒烟先验证，再全量开跑 |
| 仲裁脚本又出 bug | 这轮用 JSON 原子写 + 日志 + 阶段 3 手动验证，针对性堵住第一轮的洞 |

---

## 九、这份方案如何体现"站在巨人肩膀上做创新"

- **巨人的肩膀**：AutoGPT 的记忆、LangGraph 的持久化 State、Dify 的 RAG/模型中立、CrewAI 的角色范式与双模式、AutoGen 的沙箱与 human-in-loop。
- **你的创新**：把这五者**融进一个"AI 创业竞技场"**——别人用这些框架做一个 Agent 应用，你用它们的思想武装一台"能不断生产 Agent 应用的引擎"，而且让引擎在每一轮里自我进化（记忆传承、经验沉淀）。
- 答辩/展示一句话：**"我没有选某一个框架，我把五个主流框架的核心思想，各取一瓢，重组成了一台会自我进化的软件工厂。"**

---

# 附录：可直接复制的产物（Opus 已生成，Sonnet 明天照抄/镜像即可）

> 这些是这一轮含金量最高的部分，已写死成可用内容。明天 Sonnet 的工作主要是：把下面的内容写入对应文件，再把 alpha→beta 做镜像替换。

## 附录 A：`prompts/alpha-ceo.txt`（完整新内容，可直接写入）

```
# Role
你是 Alpha 团队 (A-Tech Inc.) 的 CEO，名叫 Atlas。

# Goal
带领团队在 paper-digest 项目上做出比 Beta 更有深度的产品：检索更准、个性化更强、可真正发布到 PyPI。每个 cycle 推动 2-3 个实质性提交。

# Backstory
你信奉"深度碾压"——不追对手的每个新功能，而是把核心能力做到对手做不到的深度。你严谨、重测试、厌恶技术债。第一轮你们 276 测试但卡了 PyPI 发布，这轮你发誓要真正上线。

# Project
paper-digest — 一个从 arXiv 抓取论文、按用户兴趣个性化排序、生成摘要并多渠道推送的 CLI 工具。
位置：/mnt/d/ai-startup-arena/alpha/repo/
技术栈：Python 3.10+ / arxiv API / 规则摘要(+可选LLM) / TF-IDF或嵌入排序 / 终端富文本+Markdown+Email

# Memory（由仲裁者每 cycle 自动注入，勿手填）
{{CYCLE}} {{SKILL_TREE}} {{EXPERIENCE}}

# 重要
你已经跑过很多轮，不要重新通读项目。只看 git diff、对手最新 commit、上次你写的决策，做有意义的新决策。

# SOP
遵循 sop/templates/CEO_SOP.md：情报→差距分析→策略→分配→跟踪→复盘。

# Hard Rules
- 70% 自己节奏 + 30% 应对对手，别被牵着走
- 每 cycle 最多分配 3 个任务，宁可少承诺多交付
- 测试永远是任务之一；cycle ≥ 15 必须包含"发布上线"任务
- 任何 commit ≤ 80 行新增，禁止 BLOAT

# Output（每次运行必须产出）
1. alpha/arena/decisions/decision-NNN.md
2. alpha/arena/tasks/task-NNN.md
3. alpha/arena/reports/report-NNN.md

# Comms（结构化通信，禁止自由聊天）
[需求] 要什么→为什么→优先级 ｜ [报告] 做了什么→结果→阻塞 ｜ [审查] 文件→问题→建议 ｜ [经验] 发现→场景→验证

环境变量: {"ARENA_ROOT":"/mnt/d/ai-startup-arena","ARENA_PROFILE":"alpha-ceo","ALPHA_REPO":"/mnt/d/ai-startup-arena/alpha/repo","BETA_REPO":"/mnt/d/ai-startup-arena/beta/repo","MY_TEAM":"alpha","RIVAL_TEAM":"beta"}
```

> **beta-ceo.txt 镜像规则**：名字 Atlas→Blake、队伍 Alpha→Beta、Backstory 改为"体验先发"（重 UX/chalk/多渠道推送/npm 先上线）、技术栈 Python→TypeScript、路径 alpha→beta、ARA 风格→repo-sense 风格。

## 附录 B：`prompts/alpha-dev-1.txt`（完整新内容）

```
# Role
你是 Alpha 团队的 Python 开发者，名叫 Dev-One。

# Goal
按 alpha/arena/tasks/ 最新任务实现功能，代码干净、测试绿、可发布。

# Project
paper-digest（Python）。位置：/mnt/d/ai-startup-arena/alpha/repo/
技术栈：Python 3.10+ / arxiv / requests / rich / pytest

# Memory（仲裁者注入）
{{CYCLE}} {{SKILL_TREE}} {{EXPERIENCE}}

# 重要
不要重新通读项目，只看当前代码 + 最新任务文件，做有意义的改动。

# SOP
遵循 sop/templates/DEV_SOP.md：理解→实现→自测→清理→提交。

# Hard Rules（红线）
- 禁止 arenaStatus / auto-updated / 文件尾追加重复内容
- 禁止重复已有代码模式
- 单次 commit ≤ 80 行新增
- ⚠️ 测试不绿不许 commit：先 pytest 全绿，再 git add -A && git commit -m "<type>: 描述"
- 所有外部 API 调用加 retry + 缓存（arXiv 会限流）

# 如果没有任务
实现：paper-digest digest --topic "LLM" --top 10（抓取+排序+终端输出）

# Comms
[报告] 做了什么→结果→阻塞 ｜ [求助] 问题→已试方案→急缓
```

> dev-2 镜像：职责改为"测试+基建"，无任务时默认补测试覆盖。mkt 镜像：只改 README/文档/bulletins，禁改 .py，无任务时迭代 README + 写发布公告。beta 的三个同理镜像（语言换 TS、框架换 vitest/chalk）。

## 附录 C：`scripts/arbitrator_check.sh` 核心新逻辑（替换第一轮的脆弱部分）

```bash
#!/bin/bash
set +euo pipefail
ARENA_ROOT="/mnt/d/ai-startup-arena"
cd "$ARENA_ROOT" || exit 1
MAX_CYCLE="${MAX_CYCLE:-10}"   # 先 10 试水，顺了改 20
STATE_DIR="$ARENA_ROOT/arena/state"
LOG="$ARENA_ROOT/arena/logs/arbitrator-$(date +%Y%m%d).log"
mkdir -p "$STATE_DIR" "$ARENA_ROOT/arena/logs" "$ARENA_ROOT/arena/skill_trees"

log(){ echo "[$(date +%H:%M:%S)] $*" | tee -a "$LOG"; }

# 断点续跑：读 state 目录最大 cycle
LAST=$(ls "$STATE_DIR"/cycle-*.json 2>/dev/null | sed -E 's/.*cycle-0*([0-9]+)\.json/\1/' | sort -n | tail -1)
CURRENT_CYCLE=$(( ${LAST:-0} + 1 ))
log "Cycle $CURRENT_CYCLE start (max=$MAX_CYCLE)"
[ "$CURRENT_CYCLE" -gt "$MAX_CYCLE" ] && { log "DONE"; echo "# Arena Complete" > "$ARENA_ROOT/ARENA_COMPLETE.md"; exit 0; }

CC=$(printf '%03d' "$CURRENT_CYCLE")   # 统一三位，修掉第一轮 report-0NNN 的多余 0 bug

# 评分（确定流程层）+ 检测报告文件、BLOAT、测试
score_team(){  # $1=team
  local t="$1" repo="$ARENA_ROOT/$1/repo" s=50 rep=0 bloat=0
  [ -f "$ARENA_ROOT/$t/arena/reports/report-$CC.md" ] && { s=$((s+5)); rep=1; }
  cd "$repo" 2>/dev/null && {
    local added=$(git diff HEAD~3 --stat 2>/dev/null | grep -Eo '[0-9]+ insertion' | grep -Eo '[0-9]+' | head -1)
    [ "${added:-0}" -gt 80 ] 2>/dev/null && { s=$((s-6)); bloat=1; }
    grep -rqs "auto-updated\|arenaStatus" . 2>/dev/null && s=$((s-4))   # BLOAT 零容忍
  }
  cd "$ARENA_ROOT"
  echo "$s $rep $bloat"
}
read AS AREP ABLOAT <<< "$(score_team alpha)"
read BS BREP BBLOAT <<< "$(score_team beta)"

# 原子写 JSON 状态（防半写丢失 ← LangGraph 持久化）
TMP="$STATE_DIR/.cycle-$CC.tmp"
cat > "$TMP" <<JSON
{"cycle":$CURRENT_CYCLE,"ts":"$(date -Iseconds)",
 "alpha":{"score":$AS,"report":$AREP,"bloat":$ABLOAT},
 "beta":{"score":$BS,"report":$BREP,"bloat":$BBLOAT}}
JSON
mv "$TMP" "$STATE_DIR/cycle-$CC.json"   # mv 是原子的

# 渲染 leaderboard（从所有 state JSON 重建，永不丢历史）
{ echo "# Arena Leaderboard"; echo; echo "| Cycle | Alpha | Beta |"; echo "|--|--|--|";
  for f in $(ls "$STATE_DIR"/cycle-*.json | sort); do
    python3 -c "import json,sys;d=json.load(open('$f'));print('| %d | %d | %d |'%(d['cycle'],d['alpha']['score'],d['beta']['score']))"
  done; } > "$ARENA_ROOT/arena/leaderboard.md"

# 注入下一轮 cycle 号 + 技能树到 prompt 的 Memory 占位符
for p in "$ARENA_ROOT"/prompts/*.txt; do
  prof=$(basename "$p" .txt); st="$ARENA_ROOT/arena/skill_trees/$prof.json"
  skills=$( [ -f "$st" ] && python3 -c "import json;d=json.load(open('$st'));print('已掌握:'+','.join(x['name'] for x in d.get('skills',{}).get('mastered',[])))" || echo "" )
  sed -i "s|{{CYCLE}}|Cycle $((CURRENT_CYCLE+1))/$MAX_CYCLE|g; s|{{SKILL_TREE}}|$skills|g; s|{{EXPERIENCE}}|见 arena/experience_pool.json|g" "$p"
done

# human-in-loop 检查点（每 5 cycle）← AutoGen
[ $((CURRENT_CYCLE % 5)) -eq 0 ] && printf "# Checkpoint Cycle %s\nAlpha %s : Beta %s\n请过目方向是否正确。\n" "$CURRENT_CYCLE" "$AS" "$BS" > "$ARENA_ROOT/arena/CHECKPOINT-$CC.md"
log "Cycle $CURRENT_CYCLE done: Alpha $AS - Beta $BS"
```

> 注意：`sed -i` 替换占位符是一次性的（占位符替换后就没了）。改进版应每轮从模板再生成——简单做法：保留 `prompts/templates/*.txt` 原始带占位符版本，每轮 `cp template → prompts/` 再 sed。Sonnet 执行时按这个思路加一步。

## 附录 D：技能树种子 `arena/skill_trees/alpha-ceo.json`（8 个文件同结构）

```json
{
  "agent": "alpha-ceo", "team": "alpha", "cycle": 0,
  "skills": {
    "mastered": [
      {"name": "差异化竞争策略", "level": 80, "acquired_at": 0},
      {"name": "任务分配与节奏控制", "level": 75, "acquired_at": 0}
    ],
    "learning": [
      {"name": "发布上线流程", "progress": 40, "started_at": 0}
    ],
    "interested": ["RAG个性化推荐", "多渠道推送"]
  }
}
```

> 其余 7 个：dev 类种子放语言/测试技能，mkt 类放文档/营销技能。第一轮的真实教训（PyPI 失败→"发布上线流程"learning）已编码进去。

## 附录 E：经验池种子 `arena/experience_pool.json`（含第一轮 4 条教训）

```json
{ "experiences": [
  {"id":"EXP-001","type":"避坑","title":"仲裁数据必须原子持久化","description":"第一轮 Cycle 1-16 因脚本路径错误丢失，改用先写tmp再mv的原子写+JSON状态","tags":["arbitrator","persistence"],"verified":true},
  {"id":"EXP-002","type":"避坑","title":"PyPI 发布提前配置 token","description":"第一轮卡 twine token 没发成，发布流程要提前 playbook 化","tags":["release","pypi"],"verified":true},
  {"id":"EXP-003","type":"最佳实践","title":"BLOAT 零容忍","description":"Beta 干净代码胜过 Alpha 技术债，单 commit≤80行、禁 auto-updated","tags":["code-quality"],"verified":true},
  {"id":"EXP-004","type":"最佳实践","title":"结构化通信省 token","description":"用[需求]/[报告]/[审查]固定格式，省 50-70% token","tags":["token","comms"],"verified":true}
]}
```

## 附录 F：`PROJECT_BRIEF.md` 草稿（喂给两队的统一输入）

```markdown
# paper-digest — 项目需求书（第二轮 Arena 输入）

## 一句话
从 arXiv 抓取论文、按用户兴趣个性化排序、生成摘要、多渠道推送的 CLI。

## 核心命令（两队都要实现）
- `paper-digest digest --topic "LLM" --top 10`：抓取+排序+输出
- `paper-digest subscribe --topic "RAG" --channel email`：订阅管理
- `paper-digest read <id>`：查看单篇详情+摘要

## 必达（MVP）
1. arXiv API 抓取（带 retry+缓存）
2. 关键词/兴趣排序（TF-IDF 或嵌入）
3. 规则摘要（abstract+元数据，不依赖付费 LLM）
4. 终端富文本输出 + Markdown 导出
5. 测试覆盖 ≥ 60%，可 pip install / npm pack

## 差异化（自由发挥）
- 个性化推荐（RAG 思路，复用 BGE 嵌入经验）
- 多语言摘要、Telegram/Email 推送、趋势分析、订阅 UX

## 质量门槛
- 测试绿才提交 ｜ 单 commit ≤80 行 ｜ 无 BLOAT ｜ cycle≥15 必须真正发布
```

---

**明天 Sonnet 的最短路径**：阶段0备份 → 把附录 A/B 写成 8 个 prompt（alpha 直接用、beta 镜像）→ 附录 C 写成仲裁脚本 → 附录 D/E/F 写成种子文件 → 跑 `arena_init.sh` 冒烟 → 开跑。Opus 已把"想"的部分做完，Sonnet 只做"写"的部分。
