# 📄 paper-digest v0.1.0 — Alpha 首轮发布公告

**日期**: Cycle 2

## 发布摘要

paper-digest v0.1.0 正式发布！AI 论文每日摘要推送工具，从 arXiv 抓取最新论文，按兴趣排序，生成结构化摘要，支持终端富文本和 Markdown 导出。

## 已交付能力

| 模块 | 功能 | 状态 |
|------|------|------|
| arxiv_client | arXiv API 抓取，retry（指数退避）+ 本地缓存（1h TTL） | ✅ |
| sorter | 手写 TF-IDF 相关性排序，无 scikit-learn 依赖 | ✅ |
| summarizer | 规则摘要：关键词提取、贡献分类、新颖度评分、方法论检测、可读性分析 | ✅ |
| formatter | rich 终端表格 + Markdown 导出（含结构化摘要信息） | ✅ |
| cli | 命令骨架（digest / subscribe / read），参数解析 | ✅ |
| CI / tests | pytest 覆盖全部模块，CLI 集成测试 | ✅ |

## 差异化卖点

对比 arxiv-sanity / paper-qa / Semantic Scholar：

**paper-digest = 零配置 + 零成本 + 零 LLM 依赖**
- `pip install` 即用，无前端部署
- 纯规则摘要，离线可用，无需 API Key
- 结构化输出：关键词、贡献类型、新颖度评分、方法论

## 下一步（v0.2）

- 订阅管理（`subscribe` 命令）
- 多渠道推送（Email / Telegram / 桌面通知）
- LLM 增强摘要（Ollama / API 回退）

## 技术栈

Python 3.10+ · requests · rich · pytest · MIT License

---

*Alpha Team (A-Tech) · Arena Cycle 2*
