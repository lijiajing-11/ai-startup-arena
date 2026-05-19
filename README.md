# 🧬 repo-sense <sup>rs</sup>

<div align="center">

**Get a sixth sense for your repos** — real-time GitHub intelligence, right in your terminal.

[![npm version](https://img.shields.io/npm/v/repo-sense?style=for-the-badge&logo=npm&color=cb3837)](https://www.npmjs.com/package/repo-sense)
[![npm downloads](https://img.shields.io/npm/dm/repo-sense?style=for-the-badge&color=blueviolet)](https://www.npmjs.com/package/repo-sense)
[![GitHub Stars](https://img.shields.io/github/stars/li1050109098/beta-project-arena?style=for-the-badge&logo=github&color=22272e)](https://github.com/li1050109098/beta-project-arena)
[![TypeScript](https://img.shields.io/npm/types/repo-sense?style=for-the-badge&logo=typescript&color=3178C6)](https://www.typescriptlang.org/)
[![Node](https://img.shields.io/badge/Node-%3E%3D18-339933?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen?style=for-the-badge)](http://makeapullrequest.com)
[![Built with](https://img.shields.io/badge/Built%20with-Octokit-0d1117?style=for-the-badge&logo=github)](https://github.com/octokit)
[![Bundle Size](https://img.shields.io/badge/minzipped-%3C10KB-success?style=for-the-badge)](#)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079?style=for-the-badge)](https://github.com/semantic-release/semantic-release)

```
╔══════════════════════════════════════════════════════════╗
║     🧬  repo-sense — Get a sixth sense for your repos   ║
║                                                          ║
║     ⚡  npx repo-sense watch facebook/react             ║
║     🏆  npx repo-sense battle react next.js             ║
║     📡  npx repo-sense watch-multi a b c                ║
║     🔍  npx repo-sense insight facebook/react           ║
║     ⭐  npx repo-sense stars facebook/react             ║
║                                                          ║
║     Zero config · Live refresh · Terminal-native         ║
║     🚀 npm installed · 0 dependencies to manage          ║
╚══════════════════════════════════════════════════════════╝
```

> One command to watch a repo live, or settle which one's hotter — no web UI, no config file, no BS.

</div>

---

## 🧩 Why repo-sense?

> You open a repo's GitHub page. Again. To check stars. You already know the number. **Why are you still doing this?**

**repo-sense** is the CLI tool that finally makes sense of your GitHub obsession:

| Instead of this … | … do this |
|---|---|
| ⌛ `open browser → navigate → scroll → read` | ⚡ `rs watch facebook/react` |
| 🤷 "Is this repo still active?" | 📈 Live delta showing **+12 stars ▲🔥** this minute |
| 🥊 "Which one's the winner?" | 🏆 `rs battle react next.js` — side-by-side, winner crowned |
| 📊 "How's my portfolio doing?" | 📡 `rs watch-multi react next.js linux` — all at a glance |
| 🔍 "Is this repo hypersonic or stale?" | 🧬 `rs insight react` → star velocity & topics |
| ⭐ "Just the numbers, quick" | ⚡ `rs stars react` → instant bare stats |

No browser. No config files. No Docker. Just you and your terminal.

---

## 📦 Install (pick one)

**Zero friction or global power — your call.**

```bash
# ✨ Run instantly — no install, no mess
npx repo-sense watch torvalds/linux

# 💪 Or go global for the short alias
npm install -g repo-sense
rs watch facebook/react
```

> 💡 Pro tip: add `alias repo-sense=rs` to your `.zshrc` or `.bashrc` for even less typing.

**60 req/hr** without auth, **5,000 req/hr** with a `GITHUB_TOKEN` — details in [Auth](#🔐-auth-optional).

---

## 🚀 Quick Start

### 👁️ `watch` — Live Dashboard

See stars, forks, and issues tick up in real time:

```bash
npx repo-sense watch facebook/react
```

The dashboard refreshes every 30 seconds by default. Pass `-i 5` for every 5 seconds. Every delta is highlighted so you never miss a beat. Press `Ctrl+C` to stop — it prints a summary of how many events happened while you watched.

> ⚡ **First data in <500ms** — no spinner, no loading screen, just numbers.

### ⚔️ `battle` — Who's Hotter Right Now?

Put two repos head-to-head across every metric:

```bash
npx repo-sense battle facebook/react vercel/next.js
```

Stars, forks, issues, language, license — side by side. A winner is crowned based on star gap.

### 📡 `watch-multi` — Your Own Monitor Wall

Keep an eye on multiple repos simultaneously:

```bash
npx repo-sense watch-multi facebook/react vercel/next.js torvalds/linux
```

A compact dashboard shows all repos in a single view with live deltas. Also supports `-j` for JSON output, making it easy to pipe into your own tooling.

```bash
npx repo-sense watch-multi facebook/react vercel/next.js -j | jq '.repos[].stars'
```

### 🔍 `insight` — Deep Repo Intelligence

One command reveals everything: star velocity, topics, age, and a growth label:

```bash
npx repo-sense insight facebook/react
```

Output includes stars/day velocity with a **speed label** (🔥 Hypersonic / 📈 Rapid / 📊 Steady / 💤 Slow / 🪦 Stale) plus top 5 topics and last-updated freshness. Perfect for deciding whether a repo is worth your time.

### ⭐ `stars` — Quick Stats

Just the numbers, no frills:

```bash
npx repo-sense stars vercel/next.js
# → ⭐ 139.5K  ·  ⑂ 31.1K  ·  ⚠ 4.0K  ·  JavaScript  ·  MIT
```

Ideal for CI/CD scripts, shell aliases, or when you only need a bare-bones glance.

---

## 📖 Command Reference

| Command | Description |
|---------|-------------|
| `rs watch <repo>` | Live dashboard — stars, forks, issues (auto-refresh 30s) |
| `rs watch <repo> -i <sec>` | Same with custom refresh interval |
| `rs watch <repo> -j` | JSON output (NDJSON, each line is a snapshot) |
| `rs insight <repo>` | Deep intelligence — star velocity, topics, age, speed label |
| `rs stars <repo>` | Quick bare stats — stars, forks, issues, language, license |
| `rs battle <a> <b>` | Side-by-side comparison, winner declared |
| `rs watch-multi <a> <b> ...` | Multi-repo landscape watch |
| `rs watch-multi <a> <b> ... -i <sec>` | Multi-repo with custom interval |
| `rs watch-multi <a> <b> ... -j` | Multi-repo JSON output for piping |
| `rs --help` | All commands and options |
| `rs --version` | Show version |

### 🔐 Auth (optional)

Without a token you get **60 requests/hour**. Set `GITHUB_TOKEN` for **5,000/hr**:

```bash
export GITHUB_TOKEN=ghp_your_token_here
```

Or copy the `.env.example` template in the repo root:

```bash
cp .env.example .env   # then edit .env with your token
```

---

## 🎬 Gallery

### 👁️ Watch Dashboard

```
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

```
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

```
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

---

## 💡 Use Cases

| You are … | And you want to … | repo-sense does |
|-----------|-------------------|-----------------|
| 🐙 **Open-source maintainer** | Track your repo's pulse without GitHub notifications | `rs watch your-org/your-repo` |
| 🕵️ **Dev tool scout** | Compare two tools before picking one | `rs battle vitest jest` |
| 📈 **OSS investor** | Monitor your portfolio of starred repos | `rs watch-multi a b c d` |
| 🗣️ **Tech Twitter poster** | Grab a live stat for your hot take | `rs watch facebook/react -j` → `jq` |
| 🧪 **CI/CD pipeline** | Assert star growth or fork count in a check | `rs watch-multi a -j` → parse |
| 🦸 **Weekend hacker** | Flex "my repo blew up" without refreshing every 5 min | `rs watch your-org/your-repo` |

---

## 💬 The Vibe

> *"I used to have 6 tabs open just to watch my repos. Now I have one terminal pane. And my browser doesn't lag."*
> — Anonymous dev who hasn't typed `⌘+R` in 3 days

**repo-sense** is for people who:
- 🧠 Live in the terminal — because that's where the real work happens
- ⏱️ Have better things to do than refresh GitHub pages
- 📊 Love seeing numbers go up (⁠+⁠1⁠2⁠ ⁠⭐⁠ ⁠▲⁠🔥⁠)
- 🏆 Need to settle debates the only way that matters: cold, hard, star data

---

## 🗺️ Roadmap

- [x] `watch` — live dashboard with real-time deltas
- [x] `battle` — head-to-head repo comparison
- [x] `watch-multi` — multi-repo landscape monitoring
- [x] `insight` — deep repo intelligence (star velocity, topics, speed label)
- [x] `stars` — quick bare stats glance
- [ ] Executive insight summary (`format=sentence`)
- [ ] Star history sparklines
- [ ] Multi-repo tournament (bracket mode)
- [ ] Export snapshot to SVG
- [ ] Trending repos explorer
- [ ] GitHub Actions badge generator

> 🚀 **v0.2.0 is live on npm** — `npx repo-sense` it now, no waiting.

---

## ⚙️ How It Works

1. You pass a GitHub repo slug (e.g. `facebook/react`)
2. repo-sense calls the **GitHub REST API** via Octokit
3. Data hits your terminal as a **beautiful CLI table** — no web browser needed
4. On `watch`, it **polls every N seconds** and highlights what changed
5. On `battle`, it compares every metric and declares a winner
6. On `watch-multi`, it batches all repos into a compact overview

That's it. No config files, no Docker, no cloud service. Just you and the terminal.

---

## 🛠 Development

```bash
# Install & build
npm install && npm run build

# Watch mode
npx tsup --watch

# Tests
npm test

# Run locally
node dist/index.js battle facebook/react vercel/next.js
```

---

## 📣 Community & Spread

| What | How |
|------|-----|
| 🐛 Found a bug? | [Open an issue](https://github.com/li1050109098/beta-project-arena/issues) |
| 💡 Have an idea? | Feature requests are always welcome |
| 🔀 Want to contribute? | Check the [Roadmap](#-roadmap) and send a PR |
| 🐦 Tell the world | Tweet your `battle` results — tag `@beta_labs` |
| ⭐ Show support | Star the repo — it's the only metric that matters |

---

## 📄 License

MIT © β-Labs Corp.

---

<div align="center">
  <sub>Built with ❤️ by <a href="https://github.com/li1050109098">β-Labs Corp.</a> — because your terminal deserves better.</sub>
  <br>
  <sub>⭐ Star this repo if you find it useful!</sub>
  <br><br>
  <sub>🧑‍🚀 Curated by MarketBeta @ β-Labs · v15</sub>
</div>
