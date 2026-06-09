# paper-digest — 项目需求书（第二轮 Arena 输入）

> 这是喂给两队的统一输入。两队用不同技术栈（Alpha=Python / Beta=TypeScript）竞争实现同一需求。

## 一句话
从 arXiv 抓取论文、按用户兴趣个性化排序、生成摘要、多渠道推送的命令行工具。

## 核心命令（两队都要实现）
- `paper-digest digest --topic "LLM" --top 10`：抓取最新论文 + 排序 + 输出摘要列表
- `paper-digest subscribe --topic "RAG" --channel email`：管理订阅主题与推送渠道
- `paper-digest read <arxiv_id>`：查看单篇详情 + 摘要

## 必达（MVP，决定基础分）
1. **arXiv API 抓取**：按 topic/分类查询，带 retry + 本地缓存（API 会限流）
2. **排序**：关键词/兴趣相关度排序（TF-IDF 或嵌入相似度）
3. **规则摘要**：基于 abstract + 元数据生成结构化摘要，**不依赖付费 LLM**（保证能发布、能离线跑）
4. **输出**：终端富文本（Alpha=rich / Beta=chalk）+ Markdown 导出
5. **质量**：测试覆盖 ≥ 60%，可 `pip install -e .` / `npm pack` 成功

## 差异化方向（自由发挥，决定创新分）
- **个性化推荐**：用 RAG 思路，根据用户历史兴趣向量化推荐（可复用 BGE 嵌入经验）
- **多渠道推送**：Email(SMTP) / Telegram Bot / 桌面通知
- **LLM 增强摘要**（可选）：检测到本地 Ollama 或 API key 时用 LLM 精炼，否则回退规则摘要
- **趋势分析**：某主题近 N 天论文数量/热度趋势
- **订阅 UX**：彩色卡片、订阅列表管理、定时推送

## 质量门槛（仲裁会查）
- ⚠️ 测试绿才提交（沙箱 gate）
- 单 commit ≤ 80 行新增（BLOAT 零容忍）
- 无 auto-updated / arenaStatus / 文件尾重复块
- 所有外部 API 调用有 retry + 缓存
- **cycle ≥ 15 必须真正发布**（Alpha→PyPI / Beta→npm，见 arena/playbooks/）

## 评分维度（仲裁者）
功能完整度 · 测试覆盖 · 文档质量 · 创新性 · 用户体验 · 可发布性 · 代码质量（BLOAT 反向扣分）

## 双队技术栈
| | Alpha (A-Tech) | Beta (B-Labs) |
|--|----------------|---------------|
| 语言 | Python 3.10+ | TypeScript 5.x |
| 抓取 | arxiv / requests | fetch + arXiv Atom API |
| 排序 | TF-IDF / 嵌入 | 关键词 + 嵌入 |
| UI | rich 终端 | chalk 卡片 |
| 推送 | Email(SMTP) | Telegram Bot |
| 测试 | pytest | vitest |
| 发布 | PyPI | npm |
| 路线 | 深度：个性化、趋势分析 | 体验：UI、多渠道、先发上线 |
