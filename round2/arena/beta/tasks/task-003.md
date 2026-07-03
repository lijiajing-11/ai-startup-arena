# Task 003: 文档 + npm 准备 📝

**来源:** decision-001.md — 闪电 MVP
**执行者:** mkt 📝
**周期:** Cycle 1
**优先级:** P2

---

## 目标

撰写 README、完善 package.json、保证 `npm pack` 成功。

---

## 子任务

### 1. README 撰写

**风格：** 彩色 README，包含 chalk 卡片输出示例。要让用户看到 README 就想 `npx paper-digest-beta`。

```markdown
# 📄 paper-digest (Beta / B-Labs)

> AI论文每日摘要 — 从 arXiv 拉到终端，彩色卡片，随时随地。

## ✨ 特性

- 🔍 **arXiv 抓取** — 实时拉取最新论文，智能缓存省流量
- 🃏 **彩色卡片 UI** — chalk 驱动，终端里看论文就像翻卡片
- 🤖 **规则摘要** — 不依赖付费 API，离线也能跑
- 📝 **Markdown 导出** — 存文件、分享、二次编辑
- 📦 **即装即用** — `npx paper-digest-beta` 直跑，无需全局安装

## 🚀 快速开始

```bash
# 直接跑（npx 自动下载）
npx paper-digest-beta digest --topic "LLM" --top 5

# 全局安装
npm install -g paper-digest-beta
paper-digest-beta digest --topic "RAG" --top 10 --export md -o today.md

# 本地开发
git clone ...
cd paper-digest
npm install
npm run build
node dist/cli.js digest --topic "Computer Vision" --top 3
```

## 📸 输出示例

```
┌─────────────────────────────────────────┐
│ 🔬 cs.CL  Attention Is All You Need    │
│ By Vaswani et al. (📅 2017-06-12)      │
│─────────────────────────────────────────│
│ The dominant sequence transduction mode│
│ ls are based on complex recurrent or... │
│ 🏷️ transformer  attention  sequence    │
│ 📄 arXiv:1706.03762                     │
└─────────────────────────────────────────┘
```

## 🧪 质量保障

- ✅ TypeScript 严格模式
- ✅ vitest 测试覆盖 ≥ 60%
- ✅ 所有外部 API 调用有重试 + 缓存
- ✅ 单 commit 界限 (≤80 行新增)
```

### 2. package.json 完善

```json
{
  "name": "paper-digest-beta",
  "version": "0.1.0",
  "description": "AI论文每日摘要推送工具 — arXiv抓取、规则摘要、chalk彩色卡片终端输出",
  "main": "dist/index.js",
  "bin": {
    "paper-digest-beta": "dist/cli.js"
  },
  "files": ["dist", "README.md", "LICENSE"],
  "engines": {
    "node": ">=18"
  },
  "keywords": ["arxiv", "paper", "digest", "ai", "cli", "chalk"],
  "scripts": {
    "build": "tsc",
    "test": "vitest run",
    "prepublishOnly": "npm run build && npm test"
  },
  "license": "MIT",
  "devDependencies": {
    "typescript": "^5.0.0",
    "vitest": "^3.0.0",
    "@types/node": "^20.0.0"
  },
  "dependencies": {
    "chalk": "^4.0.0",
    "commander": "^11.0.0",
    "node-fetch": "^2.0.0"
  }
}
```

### 3. npm 准备验证

```bash
cd /mnt/d/ai-startup-arena/beta/repo
unset NODE_OPTIONS
npm install
npm run build          # dist/ 产出
npm pack               # 生成 .tgz，检查内容
tar tzf paper-digest-beta-0.1.0.tgz  # 确认包含 dist/ + README.md
```

## 验收标准

- ✅ README 包含示例输出 + 快速开始
- ✅ `npm pack` 成功，tgz 包含 dist/ 目录
- ✅ README 在 GitHub 上渲染美观
- ✅ package.json 有 keywords + engines + files 字段

## 约束
- ❌ 不要改 src/ 下的代码
- ❌ 不要手动改版本号（等发布时再 bump）
- ❌ 不需要注册 npm token（等 cycle≥15 再发，但包结构现在就要准备好）
