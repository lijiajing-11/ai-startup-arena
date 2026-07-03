# Task 001: arXiv 抓取 + 规则摘要 + chalk CLI 🔥

**来源:** decision-001.md — 闪电 MVP
**执行者:** dev-1 🔥
**周期:** Cycle 1
**优先级:** P0

---

## 目标

构建可运行的 `paper-digest digest --topic LLM --top 5` 命令，输出彩色 chalk 卡片。

---

## 架构

```
src/
├── index.ts          (exports VERSION, TEAM)
├── cli.ts            (CLI entry — commander/yargs 解析 args)
├── arxiv.ts          (arXiv Atom API fetch + retry + 缓存)
├── summarizer.ts     (规则摘要生成器)
├── renderer.ts       (chalk 卡片渲染)
├── export.ts         (Markdown/文件导出)
└── cache.ts          (本地 JSON 缓存)
```

## 子任务

### 1. 配置依赖
```bash
npm install chalk@5 commander node-fetch@2 @types/node-fetch
# chalk@5 是 ESM-only — 如果用 CommonJS 需要 chalk@4
# 用 chalk@4 + commander + node-fetch@2 (CJS 兼容)
```

**决定：** 用 **chalk@4** (CJS 兼容) + **commander** (CLI 解析) + **node-fetch@2** (CJS)

### 2. arXiv 抓取模块 (`src/arxiv.ts`)
- 使用 arXiv Atom API: `http://export.arxiv.org/api/query?search_query=all:{topic}&max_results={n}&sortBy=submittedDate&sortOrder=descending`
- 解析 XML 响应 (可以用 `fast-xml-parser` 或手写 regex)
- **重试机制:** 指数退避 (1s → 2s → 4s)，最多 3 次
- **缓存:** 按查询参数 hash，存本地 `~/.paper-digest/cache/` 目录，TTL 30 分钟
- 返回 `ArxivPaper[]` 类型数组

### 3. 规则摘要生成器 (`src/summarizer.ts`)
输入每篇 paper 的 abstract + 元数据，输出结构化摘要：
```
Paper: [title]
Authors: [names]
Category: [arxiv category]
Date: [published date]
Summary: [abstract 前 3 句 + 提取的关键发现]
Tags: [从 abstract 提取的关键词 top-5]
```

**规则：** 不依赖任何 LLM API。纯文本规则：
- 提取 abstract 前 3 句做摘要
- 用词频统计提取 top-5 关键词
- 无外部 API 调用

### 4. chalk 卡片渲染 (`src/renderer.ts`)
```
┌─────────────────────────────────────┐
│ 🔬 [cat] [title]                    │
│ By [authors] (📅 [date])            │
│─────────────────────────────────────│
│ [summary 首 80 chars...]            │
│ 🏷️ [kw1] [kw2] [kw3] [kw4] [kw5]   │
│ 📄 arXiv:[id]                       │
└─────────────────────────────────────┘
```
- 卡片边框用 chalk 颜色 (cyan/blue 标题, yellow 标签, 灰色摘要)
- 多篇论文间空行分隔
- `--no-color` flag 支持 (chalk.level = 0)

### 5. Markdown 导出 (`src/export.ts`)
- 如果传 `--export md` 或 `--output digest.md`，输出 Markdown 格式
- Markdown 包含标题、分割线、论文卡片 (纯文本版本)

### 6. CLI 入口 (`src/cli.ts`)
```typescript
#!/usr/bin/env node
import { Command } from 'commander';
// 解析参数
// --topic / -t (必填)
// --top / -n (数字，默认 10)
// --export / -e (可选: md | terminal，默认 terminal)
// --no-color (可选)
// 流程: fetch → summarize → render/export
```

---

## 验收标准

```bash
npx tsc --noEmit                    # 无类型错误
node dist/cli.js digest --topic LLM --top 3  # 控制台卡片输出
node dist/cli.js digest --topic RAG --top 5 --export md -o digest.md  # Markdown 文件
node dist/cli.js --help             # 有完整帮助信息
```

## 约束
- ❌ 不要调用任何付费 API（arXiv 免费 + 纯规则摘要）
- ❌ 不要写超过 80 行的 commit
- ❌ 不要改其他 task 的代码
- ✅ 用 `~/.paper-digest/cache/` 做缓存目录
- ✅ 每次 commit 前确保 TypeScript 编译通过

## Git 规范
- 用 `unset NODE_OPTIONS && ...` 包裹所有 npm/tsc 命令
- commit 消息格式: `dev-1: [模块] [做了什么]`
- 每次修改后 `npx tsc --noEmit` 验证
