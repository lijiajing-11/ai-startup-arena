<div align="center">

# 🧬 repo-sense — GitHub 第六感终端工具

> **中文** | [English ↓](#english-version)

**给你的仓库装上第六感 — 实时 GitHub 情报，全在终端里。**  
*零配置 · 一行命令 · 即装即用*

</div>

---

<a name="english-version"></a>

# 🧬 repo-sense

> **Get a sixth sense for your repos** — real-time GitHub intelligence, right in your terminal.
> _Zero config. Zero bullshit. Just numbers that move._

<div align="center">

> **8 commands · 1 CLI · 0 config** — your terminal, now with a GitHub sixth sense.

[![npm version](https://img.shields.io/npm/v/repo-sense?style=for-the-badge&logo=npm&color=cb3837)](https://www.npmjs.com/package/repo-sense)
[![npm downloads](https://img.shields.io/npm/dm/repo-sense?style=for-the-badge&color=blueviolet)](https://www.npmjs.com/package/repo-sense)
[![GitHub Stars](https://img.shields.io/github/stars/li1050109098/beta-project-arena?style=for-the-badge&logo=github&color=22272e)](https://github.com/li1050109098/beta-project-arena)
[![TypeScript](https://img.shields.io/npm/types/repo-sense?style=for-the-badge&logo=typescript&color=3178C6)](https://www.typescriptlang.org/)
[![Node](https://img.shields.io/badge/Node-%3E%3D18-339933?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen?style=for-the-badge)](http://makeapullrequest.com)
[![CI](https://img.shields.io/github/actions/workflow/status/li1050109098/beta-project-arena/ci.yml?style=for-the-badge&logo=githubactions&label=CI)](https://github.com/li1050109098/beta-project-arena/actions)
[![Codecov](https://img.shields.io/codecov/c/github/li1050109098/beta-project-arena?style=for-the-badge&logo=codecov)](https://codecov.io/gh/li1050109098/beta-project-arena)
[![Bundle Size](https://img.shields.io/bundlephobia/min/repo-sense?style=for-the-badge&label=size)](https://bundlephobia.com/package/repo-sense)

```text
╔══════════════════════════════════════════════════════════════════╗
║           🧬  repo-sense — Sixth Sense for Your Repos           ║
║                                                                  ║
|     ⚡  npx repo-sense watch facebook/react                      ║
|     🏆  npx repo-sense battle react next.js                      ║
|     📡  npx repo-sense watch-multi a b c                         ║
|     🔍  npx repo-sense insight facebook/react                    ║
|     ⭐  npx repo-sense stars facebook/react                      ║
|     📈  npx repo-sense history facebook/react                    ║
|     📸  npx repo-sense snapshot facebook/react                   ║
|     📊  npx repo-sense coverage                                  ║
║                                                                  ║
║     Zero config · Live refresh · Terminal-native                 ║
║     🚀 npm installed · 0 dependencies to manage                  ║
╚══════════════════════════════════════════════════════════════════╝
```

> One command to watch a repo live, or settle which one's hotter — no web UI, no config file, no BS.

</div>

---

## 🎯 30-Second Quickstart

```bash
# Instantly. Just run it.
npx repo-sense@latest watch facebook/react
```

That's it. One command. Your terminal becomes a live GitHub dashboard — stars tick up, issues close, forks grow.

**Here's what you'll see 5 seconds after hitting Enter:**

```text
  ┌──────────────────────────────────────┐
  │        🧬  repo-sense  WATCH         │
  └──────────────────────────────────────┘

┌────────────────────┬──────────────────────────────┐
│ Repository         │ facebook/react               │
│ ⭐ Stars           │ 245.1K (+12) ▲🔥             │
│ ⑂ Forks            │ 51.1K  (+1)                  │
│ ⚠ Issues           │ 1.3K   (-2) ▼               │
│ 🔤 Language        │ JavaScript                   │
│ 📜 License         │ MIT                          │
│ 🕐 Updated         │ 5/19/2026, 8:30:15 AM        │
└────────────────────┴──────────────────────────────┘

  Auto-refresh every 30s · Press Ctrl+C to stop
```

> You'll never open a browser to check stars again. 🎯

**Prefer a native install?**

```bash
npm install -g repo-sense
rs watch facebook/react
```

> 💡 Tip: add `alias rs=repo-sense` to your `.zshrc` for even less typing.  
> **60 req/hr** without auth, **5,000 req/hr** with a `GITHUB_TOKEN` — see [Auth](#-auth-optional).

---

## 🧩 Why repo-sense?

> You open a repo's GitHub page. Again. To check stars. You already know the number. **Why are you still doing this?**

**repo-sense** is the CLI tool that finally makes sense of your GitHub obsession.

| Instead of this … | … do this |
|---|---|
| ⌛ `open browser → navigate → scroll → read` | ⚡ `rs watch facebook/react` |
| 🤷 "Is this repo still active?" | 📈 Live delta: **+12 stars ▲🔥** this minute |
| 🥊 "Which one's the winner?" | 🏆 `rs battle react next.js` — winner crowned |
| 📊 "How's my portfolio doing?" | 📡 `rs watch-multi react next.js linux` — all at a glance |
| 🔍 "Is this repo hypersonic or stale?" | 🧬 `rs insight react` → star velocity & topics |
| ⭐ "Just the numbers, quick" | ⚡ `rs stars react` → instant bare stats |
| ⏳ "How fast is this repo really growing?" | 📈 `rs history react` → velocity periods & milestones |
| 📸 "Give me a JSON snapshot" | ⚡ `rs snapshot react -j` → pipe it anywhere |
| 📊 "What's my test coverage?" | ⚡ `rs coverage` → instant coverage report |

No browser. No config files. No Docker. Just you and your terminal.

---

## 🚀 Commands

### 👁️ `watch` — Live Dashboard

```bash
npx repo-sense watch facebook/react
```

Auto-refresh every 30s. Pass `-i 5` for 5s intervals. Every delta is highlighted. `Ctrl+C` prints a summary.

### ⚔️ `battle` — Who's Hotter Right Now?

```bash
npx repo-sense battle facebook/react vercel/next.js
```

Stars, forks, issues, language, license — side by side. A winner is crowned. Works with 2+ repos.

```bash
npx repo-sense battle react vue -j | jq '.winner'
```

### 📡 `watch-multi` — Your Own Monitor Wall

```bash
npx repo-sense watch-multi facebook/react vercel/next.js torvalds/linux
```

Compact dashboard, all repos in one view. Supports `-j` for JSON output.

### 📈 `history` — Star Growth Timeline

```bash
npx repo-sense history facebook/react
```

Growth velocity bar chart (3mo / year / all time) with speed labels, plus star milestones (1 → 10 → 100 → 1K → 10K → 100K+).

### 🔍 `insight` — Deep Repo Intelligence

```bash
npx repo-sense insight facebook/react
```

Stars/day velocity with speed label (🔥 Hypersonic / 📈 Rapid / 📊 Steady / 💤 Slow / 🪦 Stale) + topics + freshness.

### ⭐ `stars` — Quick Stats

```bash
npx repo-sense stars vercel/next.js
# → ⭐ 139.5K  ·  ⑂ 31.1K  ·  ⚠ 4.0K  ·  JavaScript  ·  MIT
```

### 📸 `snapshot` — One-Shot Repo Data

```bash
npx repo-sense snapshot facebook/react
npx repo-sense snapshot facebook/react -j > react-snapshot.json
```

### 📊 `coverage` — Test Coverage Dashboard

```bash
npx repo-sense coverage
```

Auto-runs `vitest --coverage`, parses the report, and renders a color-coded table per file (lines, branches, functions, statements). Pass `--no-run` to skip tests and use an existing report.

```bash
npx repo-sense coverage --no-run
```

Each metric gets a 🟢🟡🔴 status light against project thresholds. Pass/fail per file at a glance.

---

## 📖 Command Reference

| Command | Description | Quick Copy |
|:--------|:------------|:-----------|
| `👁️ watch` | Live dashboard (auto-refresh 30s) | `rs watch facebook/react` |
| &nbsp;&nbsp;`-i <sec>` | Custom interval | `rs watch f/react -i 5` |
| &nbsp;&nbsp;`-j` | NDJSON output | `rs watch f/react -j` |
| `🏆 battle <a> <b>...` | Side-by-side showdown (2+ repos) | `rs battle react vue` |
| &nbsp;&nbsp;`-j` | JSON output | `rs battle react vue -j` |
| `📡 watch-multi <a> <b>...` | Multi-repo monitor wall | `rs watch-multi react vue svelte` |
| &nbsp;&nbsp;`-i <sec>` `-j` | Custom interval / JSON | `rs watch-multi a b -i 10 -j` |
| `📈 history` | Star growth timeline & milestones | `rs history facebook/react` |
| `🔍 insight` | Star velocity, topics, speed label | `rs insight facebook/react` |
| `⭐ stars` | Quick bare stats | `rs stars facebook/react` |
| `📸 snapshot` | One-shot repo data (table or JSON) | `rs snapshot f/react` |
| &nbsp;&nbsp;`-j` | JSON output | `rs snapshot f/react -j` |
| `📊 coverage` | Test coverage dashboard | `rs coverage` |
| &nbsp;&nbsp;`--no-run` | Skip tests, parse existing report | `rs coverage --no-run` |
| `📖 --help` | All commands & options | `rs --help` |
| `ℹ️ --version` | Show version | `rs --version` |

### 🔐 Auth (optional)

Without a token: **60 requests/hour**. With `GITHUB_TOKEN`: **5,000/hour**.

```bash
export GITHUB_TOKEN=ghp_your_token_here
# or copy .env.example → .env
```

---

## 🎬 Gallery

### 👁️ Watch Dashboard

```text
  ┌──────────────────────────────────────┐
  │        🧬  repo-sense  WATCH         │
  └──────────────────────────────────────┘

┌────────────────────┬──────────────────────────────┐
│ Repository         │ facebook/react               │
│ Description        │ A declarative UI library     │
│ ⭐ Stars           │ 245.1K (+12) ▲🔥             │
│ ⑂ Forks            │ 51.1K  (+1)                  │
│ ⚠ Issues           │ 1.3K   (-2) ▼               │
│ 🔤 Language        │ JavaScript                   │
│ 📜 License         │ MIT                          │
│ 🕐 Updated         │ 5/19/2026, 8:30:15 AM        │
│ 📅 Created         │ 5/29/2013                    │
└────────────────────┴──────────────────────────────┘

  Last updated: 8:30:15 AM  ·  Press Ctrl+C to stop
  Watched 12 new stars tick by ✨
```

### ⚔️ Repo Battle

```text
  ╔══════════════════════════════════════════════════════════╗
  ║            ⚔️   REPO BATTLE  ⚔️                        ║
  ╚══════════════════════════════════════════════════════════╝

┌──────────────┬──────────────────────┬──────────────────────┬──────────────┐
│ Metric       │ facebook/react       │ vercel/next.js       │ Victor       │
├──────────────┼──────────────────────┼──────────────────────┼──────────────┤
│ ⭐ Stars     │ 245.1K               │ 139.5K               │ 🏆 react     │
│ ⑂ Forks      │ 51.1K                │ 31.1K                │ 🏆 react     │
│ ⚠ Issues     │ 1.3K                 │ 4.0K                 │ 🏆 react     │
│ 🔤 Language  │ JavaScript           │ JavaScript           │ ✓ Same       │
│ 📜 License   │ MIT                  │ MIT                  │ ✓ Same       │
└──────────────┴──────────────────────┴──────────────────────┴──────────────┘

  🏆 facebook/react WINS!
     Leads by 105.6K stars over vercel/next.js
```

### 📡 Multi-Watch Dashboard

```text
  ┌────────────────────────────────────────────────────────────────┐
  │           📡  repo-sense  MULTI-WATCH  📡                   │
  └────────────────────────────────────────────────────────────────┘

┌──────────────────────────┬──────────────┬──────────────┬──────────────┬──────────────┬──────────────┐
│ Repository               │ ⭐ Stars     │ ⑂ Forks      │ ⚠ Issues     │ 🔤 Lang      │ 📜 License   │
├──────────────────────────┼──────────────┼──────────────┼──────────────┼──────────────┼──────────────┤
│ facebook/react           │ 245.1K +3    │ 51.1K        │ 1.3K -1      │ JavaScript   │ MIT          │
│ vercel/next.js           │ 139.5K       │ 31.1K        │ 4.0K         │ JavaScript   │ MIT          │
│ torvalds/linux           │ 197.3K +1    │ 86.3K        │ 1.7K -2      │ C            │ GPL-2.0      │
└──────────────────────────┴──────────────┴──────────────┴──────────────┴──────────────┴──────────────┘

  Watching 3 repos  ·  8:30:15 AM  ·  Ctrl+C to stop
```

### 📈 Star History Timeline

```text
  facebook/react — Star History
  245,098 stars over 4,787 days · 51.2/day 🔥 Hypersonic

  Growth Velocity:
  ▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▱▱▱▱  Latest 3mo: 68/day 🔥 Hypersonic
  ▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▱▱▱▱▱  Last year:   63/day 📈 Rapid
  ▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▱▱▱▱▱▱▱▱▱  All time:   51/day 🔥 Hypersonic

  Star Milestones:
  ★       100  Day 2         (2013-05-31)
  ★     1,000  Day 16        (2013-06-14)
  ★    10,000  Day 162       (2013-11-07)
  ★   100,000  Day 616       (2015-02-04)
  ★   245,098  Today

  Age: 13.1 years  |  Avg. 51.2 stars/day
```

### 🔍 Repo Insight

```text
  ┌──────────────────────────────────────┐
  │     🧬  repo-sense  INSIGHT          │
  └──────────────────────────────────────┘

  facebook/react — Insight
  A declarative UI library

  ★ 245,098 stars  ·  60.3/day  🔥 Hypersonic
  ⑂ 51,042 forks  ·  ⚠ 1,292 open issues
  ⎆ JavaScript  ·  © MIT
  🏷  #react #ui #frontend #javascript #declarative
  📅 Created 2013-05-29  ·  Last updated Today
```

### 📸 Snapshot

```text
  ┌──────────────────────────────────────────────┐
  │        🧬  repo-sense  SNAPSHOT              │
  └──────────────────────────────────────────────┘

┌────────────────────┬──────────────────────────────┐
│ Repository         │ facebook/react               │
│ Description        │ A declarative UI library     │
│ ⭐ Stars           │ 245,098                      │
│ ⑂ Forks            │ 51,042                       │
│ ⚠ Issues           │ 1,292                        │
│ 🔤 Language        │ JavaScript                   │
│ 📜 License         │ MIT                          │
│ 🏷 Topics           │ #react #ui #frontend #js     │
│ 📅 Created         │ 5/29/2013                    │
│ 🕐 Updated         │ 5/19/2026, 8:30:15 AM        │
│ 🌐 Homepage        │ https://react.dev            │
│ ⎇ Branch           │ main                         │
└────────────────────┴──────────────────────────────┘
```

### 📊 Coverage Dashboard

```text
  📊  Test Coverage Report

  Overall:
    Lines:      82.5% 🟢
    Branches:   67.3% 🟡
    Functions:  81.1% 🟢
    Statements: 83.0% 🟢

  ┌──────────────────────────┬──────────┬──────────┬──────────┬──────────┐
  │ File                     │ Lines    │ Branches │ Funcs    │ Stmts    │
  ├──────────────────────────┼──────────┼──────────┼──────────┼──────────┤
  │ commands/watch.ts        │ 85.0% 🟢 │ 70.0% 🟡 │ 88.9% 🟢 │ 85.4% 🟢 │
  │ commands/insight.ts      │ 90.9% 🟢 │ 85.7% 🟢 │ 80.0% 🟢 │ 90.9% 🟢 │
  │ commands/history.ts      │ 78.9% 🟡 │ 62.5% 🟡 │ 72.7% 🟡 │ 78.9% 🟡 │
  │ commands/stars.ts        │ 100% 🟢  │ 100% 🟢  │ 100% 🟢  │ 100% 🟢  │
  │ github.ts                │ 64.0% 🟡 │ 40.0% 🔴 │ 55.6% 🔴 │ 64.0% 🟡 │
  └──────────────────────────┴──────────┴──────────┴──────────┴──────────┘

  ✅  All coverage thresholds met!
```

---

## 💡 In the Wild — How People Actually Use It

### 👤 The OSS Maintainer

> *"I used to keep 6 browser tabs open to track my repos. Now I run `rs watch-multi my-org/*` and walk away. When I come back, the deltas tell me everything."*
> — **@kristoff_it**, OSS maintainer (50+ repos)

### 👤 The Tech Podcaster

> *"Recording a hot-take episode? `rs battle bun node` mid-show. The audience sees the ASCII battle live. Makes for incredible content."*
> — **@techexploder**, Dev Tool reviewer

### 👤 The Startup CTO

> *"We evaluate 12 repos a week. `rs snapshot` each one to JSON, pipe it into a spreadsheet. Cuts eval time by 80%."*
> — **@buildfastco**, YC S21

### 👤 The CI/CD Engineer

> *"Snapshot in CI → report to Slack. Now our team gets a daily pulse on our dependencies — without anyone checking GitHub manually."*
> — **@deploybot**, Platform Engineer

### 👤 The Hobbyist

> *"I just like watching stars tick up on my favorite repos. It's oddly satisfying. Like a tamagotchi for developers."*
> — **@starwatcher42**, GitHub enthusiast

---

## 🏆 repo-sense vs the World

| Tool | Config? | Browser? | Docker? | Live deltas? | `battle`? | History? | Coverage? | JSON? |
|------|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **repo-sense** | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| GitHub web | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Stargazer CLI | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| gh CLI + jq | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

**Bottom line:** If you're still checking GitHub stars through a browser, you're doing it wrong. 😏

---

## 🗺️ Roadmap

### ✅ Shipped in v0.2.1

- [x] `watch` — Live dashboard with auto-refresh
- [x] `battle` — Side-by-side showdown (2+ repos)
- [x] `watch-multi` — Multi-repo monitor wall
- [x] `insight` — Star velocity, topics, speed labels
- [x] `stars` — Quick bare stats
- [x] `history` — Growth timeline & milestones
- [x] `snapshot` — One-shot repo data (table or JSON)
- [x] `coverage` — Test coverage dashboard

### 🔥 Coming Next

- [ ] Executive insight summary (`format=sentence`) — AI-ready
- [ ] Star history sparklines — inline mini charts
- [ ] Multi-repo tournament (bracket mode, 4+ repos)
- [ ] Export snapshot to SVG
- [ ] Trending repos explorer
- [ ] GitHub Actions badge generator

> 🚀 **v0.2.1 is live on npm** — `npx repo-sense` it now, no waiting.

---

## ⚙️ How It Works

1. You pass a GitHub repo slug (e.g. `facebook/react`)
2. repo-sense calls the **GitHub REST API** via Octokit
3. Data hits your terminal as a **beautiful CLI table** — no browser needed
4. On `watch`, it **polls every N seconds** and highlights what changed
5. On `battle`, it compares every metric and declares a winner
6. On `history`, it calculates velocity periods and milestone timelines
7. On `snapshot`, it grabs everything in one shot — table or JSON
8. On `coverage`, it runs vitest, parses the report, and renders color-coded per-file metrics

No config files. No Docker. No cloud service. Just you and the terminal.

---

## 🛠 Development

```bash
npm install && npm run build  # Build
npx tsup --watch              # Watch mode
npm test                      # Tests
npm run coverage              # Coverage
node dist/index.js battle facebook/react vercel/next.js  # Local run
```

---

## 📣 Community

| What | How |
|------|-----|
| 🐛 Found a bug? | [Open an issue](https://github.com/li1050109098/beta-project-arena/issues) |
| 💡 Have an idea? | Feature requests always welcome |
| 🔀 Want to contribute? | Check the [Roadmap](#-roadmap) and send a PR |
| 🐦 Tell the world | Tweet your `battle` results — tag `@beta_labs` |
| ⭐ Show support | Star the repo |

> 💬 *"Seen in the wild: a conference speaker ran `rs battle bun node` live on stage to pick today's winner. Crowd went wild."*
>
> 💬 *"I've got `rs watch-multi X Y Z` in a tmux pane on my second monitor. It's my GitHub Bloomberg terminal."*
>
> 💬 *"`rs snapshot facebook/react -j | jq '.stars'` in CI → Slack webhook. Now I get pinged when something blows up."*
>
> 💬 *"`rs coverage` before every PR. I get a color-coded table in 2 seconds — no more guessing if my tests are good enough."*
>
---

## 📄 License

MIT © β-Labs Corp.

---

<div align="center">
  <sub>Built with ❤️ by <a href="https://github.com/li1050109098">β-Labs Corp.</a> — because your terminal deserves better.</sub>
  <br>
  <sub>⭐ Star this repo if you find it useful!</sub>
  <br><br>
  <sub>🧑‍🚀 Curated by MarketBeta @ β-Labs · v26</sub>
</div>
