# Decision 022: Cycle 9 深度碾压 — 个性化排序先落地，发布路径同步收口

**日期:** Cycle 9
**决策者:** Atlas (CEO, A-Tech Inc.)
**周期:** 9/10

---

## 1. 情报收集 (Scouting)

### 我方最近变化
- `c7885d1` docs: sharpen README and release messaging
- `147b990` feat: implement read command with print_single_paper renderer
- `05ebb60` docs: reflect `read` command shipping — 71 tests, roadmap update

### 当前工作区状态
- `README.md` 有未提交改动
- `paper_digest/cli.py` 有未提交改动
- `tests/test_cli.py` 有未提交改动

这说明上一轮仍停留在“文档 + CLI 局部增强”收尾阶段，还没真正进入本轮应打的核心战场。

### 对手最近变化
- `efbfb53` docs: upgrade paper-digest README for npm launch and community conversion
- `f260f5a` docs: README v4 — EN subtitle, target users, 94+ tests, CTA upgrade
- `485aac7` test(index): add exports coverage for VERSION and TEAM
- `0f40ceb` chore: remove placeholder test file
- `986ea1e` docs: comprehensive README with hero, commands, comparison table, roadmap

### 对手变化分析
- 新核心功能：暂无。对手仍以 README 包装、安装转化、测试补缀为主
- 市场动作：npm 已经先发，安装心智比我们更强
- 真实弱点：产品深度不足，尚未形成“个性化推荐/排序解释”壁垒

---

## 2. 差距分析 (Gap Analysis)

### 关键差距
1. **个性化缺口仍在**：当前 `digest` 排序仍只基于 topic 通用相关度，离 brief 里的“按用户兴趣个性化排序”还有明显距离
2. **发布缺口仍在**：README 已强化，但安装方式仍是源码优先；PyPI 真实可安装仍未闭环
3. **订阅命令是空壳**：README 里有入口，但实现仍是 placeholder；这会限制“个性化配置来源”的可信度
4. **测试要继续做护栏**：一旦开始把兴趣画像接入 CLI，最容易在配置读取、回退逻辑、输出兼容性上翻车

### 战略判断
- 70% 自己节奏：先打透排序深度与可发布性，不追对手 README 文案战
- 30% 应对对手：针对对方的 npm 先发优势，收口我们的安装与发布路径，但不在包装层卷到底

---

## 3. 策略制定 (Strategy)

### 战略方向
**先把“更准”做实，再把“可安装”说实。**

### 核心目标
本 cycle 只推动 3 个小而硬的任务：
1. 给 `digest` 接入最小可用的用户兴趣画像输入，让同 topic 下的排序真正体现个人偏好
2. 把 `subscribe` 从 placeholder 提升为可持久化偏好配置的最小实现
3. 用测试和安装验证把上面两件事锁死，并同步收口 README 的安装表述

### 为什么现在做
- 用户目标明确写了：检索更准、个性化更强、真正可发布到 PyPI
- 对手当前没有在核心检索深度上形成突破，是我们扩大差距的窗口
- 订阅功能若仍为空壳，个性化排序就会显得“概念化”，难以形成产品闭环

### 风险
- 如果直接做复杂画像系统，容易超出小提交边界
- 如果先做 PyPI 再做个性化，本轮又会变成包装轮
- `subscribe` 一旦写得过重，会引入配置债

### 预期收益
- 把 Alpha 卖点从“能抓、能读”升级为“懂用户兴趣地筛论文”
- 为后续 Markdown / Email 推送提供稳定的偏好配置来源
- 发布叙事从“未来会上 PyPI”收束到“已准备好安装验证路径”

---

## 4. 任务分配 (Task Delegation)

本 cycle 最多 3 个任务，测试明确占一席。

### Task A — 个性化排序最小闭环 (P0)
目标：在 `digest` 中接入用户兴趣关键词/订阅 topic 偏好，对同一查询主题下的候选论文做二次加权排序。

边界：
- 只做 scorer 层和 CLI 接线，不重写 arXiv 抓取流程
- 无偏好时必须完全回退当前行为
- 输出层先不加花哨文案，只保证排序更准

负责人：Dev-1

### Task B — subscribe 变成真实偏好存储 (P0)
目标：把 `subscribe` 从 placeholder 升级为最小可用配置入口，可记录 topic + channel，供排序层读取偏好。

边界：
- 只做本地配置文件持久化与基础 CLI 反馈
- 不做实际推送，不做复杂子命令矩阵
- 配置结构要为后续个性化和推送复用留口子

负责人：Dev-2

### Task C — 测试 + 安装验证 + README 收口 (P1)
目标：补齐偏好排序、订阅存储、无偏好回退、CLI 基本路径测试；同时验证 `pip install -e .` 入口无回归，并把 README 的安装表述与当前真实能力对齐。

负责人：QA / 审查

---

## 5. 进度跟踪 (Progress Tracking)

### 执行顺序
1. 先读现有未提交 diff，确认它们是否已部分涉及本轮方向
2. Task A/B 并行，但都必须控制在“小步增量”
3. Task C 在实现过程中同步补，不允许最后一次性兜底

### 阻塞预案
- 若 `subscribe` 设计过重：退回单文件 JSON/YAML 配置方案
- 若排序耦合 CLI 过深：把偏好读取封装成独立 helper，CLI 只传参
- 若安装/README 与真实能力不一致：以真实实现为准，宁可保守描述

---

## 6. 复盘与下一步 (Retrospective Preview)

### 本轮必须做对的事
- 不再追加纯文档包装
- 不把“个性化”做成口号，而是变成实际排序行为
- 测试始终伴随实现，不留技术债

### 本轮避免犯的错
- 再把 `subscribe` 停留在空壳
- 为了未来推送场景一次性设计过度
- 文档领先实现，导致仲裁时被抓现行

### 下轮预告
如果本轮打通个性化排序 + 真实偏好入口，下一轮直接冲：
1. 推荐解释文案（为什么这篇排前面）
2. Markdown / Email 输出复用个性化信号
3. PyPI 正式发布或最接近正式发布的验证闭环

---

*Atlas, CEO @ A-Tech Inc.*
*"深度碾压不是功能更多，是排序里真的有你。"*
