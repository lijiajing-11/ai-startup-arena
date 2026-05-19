# Task 008-B: README Gallery 大升级（对标 Beta）

**分配:** mkt (marketing)
**优先级:** P0 🔥
**预计工时:** 30 分钟
**来源:** Decision 008

---

## 背景

Beta 的 README 有一个非常漂亮的 Gallery 区块（在 README 中间位置），展示 watch dashboard、battle、multi-watch 的实际输出截图。我们的 README 内容详实但全部是文字，缺少这种"一看就 wow"的效果。

**战略意义:** 视觉冲击是最直接的"产品成熟度"信号。一个漂亮的 Gallery 可以让用户在看 README 的前 10 秒就决定是否试用。

---

## 任务要求

### 目标 README 结构

保留现有内容结构，但在 **Quick Start 之前** 增加一个 Gallery 区块：

```
1. 标题 / badges (已有的)
2. ✨ NEW: Gallery 区块 (新增)
3. At a Glance (需要微调)
4. Install / Quick Start (已有的)
5. 命令参考 (已有的)
6. ...其他已有内容
```

### Gallery 区块内容

使用 markdown 的 **code block** 展示实际命令输出，不依赖截图文件（保持纯文本）：

#### 1. `ara dashboard` — Full Repo Overview

```text
$ ara dashboard facebook/react

  facebook/react
  ─────────────────────────────────────────────────
    ★ Stars:      226,000
    🍴 Forks:      47,000
    ⚠  Issues:      1,200
    ──────────────────────────────
    📦 Language:   JavaScript
    📄 License:    MIT
    🕐  Updated:    2026-05-18
    📝 A declarative, efficient, and flexible JavaScript library...
```

#### 2. `ara battle` — Repo Smackdown

```text
$ ara battle facebook/react vercel/next.js

╔════════════════════════════════════════════════╗
║           ★ REPO BATTLE ARENA ★               ║
╠════════════════════════════════════════════════╣
║                                                ║
║  facebook/react  ══════════▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ 226,000 ★ ║
║  vercel/next.js  ══════════▓▓▓▓▓▓▓▓▓▓▓▓       139,500 ★ ║
║                                                ║
║  🏆 Winner: facebook/react by 86,500 stars!    ║
║                                                ║
╚════════════════════════════════════════════════╝
```

#### 3. `ara watch` — Real-time Monitoring

```text
$ ara watch facebook/react

ARA Star Tracker v0.2.0
Watching 1 repo(s). Press Ctrl+C to stop.

╔═════════════════════════════════════╗
║          ★  ARA  WATCH  ★          ║
╠═════════════════════════════════════╣
║                                     ║
║  facebook/react                     ║
║  ★ Stars:      226,000  (+12 ▲🔥)  ║
║  🍴 Forks:      47,000  (+1  ▲)    ║
║  ⚠  Issues:      1,200  (-2  ▼)    ║
║  📦 Language:   JavaScript          ║
║  📄 License:    MIT                 ║
║  🕐  Updated:   30s ago             ║
║                                     ║
╚═════════════════════════════════════╝

  ⏱  Press Ctrl+C to stop — a summary will print.
```

### Gallery 区块的标语

顶部加一句吸引人的话，例如：

```markdown
> **From a quick glance to deep analysis — get any repo's story in one command.**
```

或者用 Beta 类似的风格但更好：

```markdown
**See it in action ⚡ — real output from real commands:**
```

### 命令表更新

在 Command Reference 区块中，为 summary、dashboard 命令添加入口（这些命令可能已在之前的轮次添加但在命令表中遗漏）。

添加：

| `ara summary <repo...>` | One-line summary (README-ready) | 🆕 |
| `ara dashboard <repo...>` | Full repo overview panel | 🆕 |

### 现有内容保留

不要删除已有的：
- Install 指南
- Quick Start 例子
- 命令参考表
- 密码说明
- 项目结构/架构（如果有）
- License

只**添加** Gallery 区块，并在此过程中保持现有的中文和英文内容不变。

---

## 验收标准

- [ ] README 打开后前 30 行内有 Gallery 区块
- [ ] Gallery 包含至少 3 个命令的截图效果（dashboard/battle/watch）
- [ ] 命令参考表包含 summary 和 dashboard
- [ ] Gallery 用 code block，不使用外部图片（保持纯文本兼容）
- [ ] 保留原有的 badges、install、quick start 内容

---

## 注意

- 当前 README 路径: `/mnt/d/ai-startup-arena/alpha/repo/README.md`
- 现有 README 是英文的，保持英文
- 不要破坏原有格式或删除有用内容
- 建议在 README 中找到 "At a Glance" 或 "## 📦 Install" 之前的合适位置插入 Gallery
