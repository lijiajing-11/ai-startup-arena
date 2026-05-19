# Task 010-B: README Gallery 区块

**分配给:** mkt
**优先级:** P0 🔥
**来源:** Decision 010

---

## 任务描述

在 README.md 顶部，`<p align="center">` badge 区域下方、`# Usage` 章节上方，插入 **Gallery** 区块，展示 ARA 核心命令的实际输出。

## 设计规格

### 位置

在 `# ⚡ ARA — Arena Star Tracker` 下面的 badge 行之后、`## Table of Contents` 之前。

### Gallery 内容

#### 1. `ara rank` — 排行榜

用 fenced code block 展示：

```
🏆 ARA Rank — Top 10 Hot Repos
┌───┬──────────────────────────────┬────────────┬────────┬────────────┐
│ # │ Repo                         │     Stars   │  Forks │ Language   │
├───┼──────────────────────────────┼────────────┼────────┼────────────┤
│ 🥇 1 │ facebook/react               │    226,000 │  47k   │ JavaScript │
│ 🥈 2 │ sveltejs/svelte              │     82,000 │   4k   │ TypeScript │
│ 🥉 3 │ vuejs/core                   │     47,000 │   7k   │ TypeScript │
│   4 │ vercel/next.js               │    126,000 │  26k   │ JavaScript │
│   5 │ twbs/bootstrap               │    170,000 │  79k   │ CSS        │
│   6 │ angular/angular              │     96,000 │  26k   │ TypeScript │
│   7 │ d3/d3                        │    110,000 │  33k   │ JavaScript │
│   8 │ nodejs/node                  │    108,000 │  30k   │ JavaScript │
│   9 │ lodash/lodash                │     60,000 │   7k   │ JavaScript │
│  10 │ jquery/jquery                │     60,000 │  21k   │ JavaScript │
└───┴──────────────────────────────┴────────────┴────────┴────────────┘
```

#### 2. `ara summary` — 一行概览

```
★ facebook/react · 226,000 stars · 47,000 forks · 1,200 issues · JavaScript · MIT License  —  A declarative UI library
```

#### 3. `ara watch --notify` — 实时监控

```
ARA Star Tracker v0.3.0
Watching 1 repo(s). Press Ctrl+C to stop.
🔔 Notification mode: you'll hear a beep when stars change.

┌ facebook/react ─────────────────────────────────────────────┐
│ ⭐ 226,000 stars                                             │
```

#### 4. `ara dashboard` — 仓库全貌

```
╔══════════════════════════════════════╗
║  📊 ARA Dashboard                   ║
╟──────────────────────────────────────╢
║  🔥 facebook/react                   ║
║  ⭐ 226,000  stars                    ║
║  🍴 47,000   forks                    ║
║  ⚠  1,200    open issues              ║
║  📦 JavaScript                       ║
║  📄 MIT License                      ║
╚══════════════════════════════════════╝
```

#### 5. 标题建议

```
## 🎬 Gallery

Get a feel for ARA in action:
```

## 附加工作

1. 更新 README 底部命令列表，加入 `ara summary` 和 `ara rank`
2. 在 README 的使用示例中添加 summary 和 rank 的示例命令

## 验收标准

- [ ] Gallery 区块在 README 前 50 行内可见
- [ ] 展示了至少 4 个命令的实际输出（rank, summary, watch-notify, dashboard）
- [ ] 命令列表包含 summary 和 rank
- [ ] Gallery 区块格式清晰，使用 code block 标记
- [ ] `python3 -m pytest tests/ -q` → 183+ passed, 0 failed
