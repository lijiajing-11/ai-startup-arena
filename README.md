# 🧬 repo-sense <sup>rs</sup>

<div align="center">

**Get a sixth sense for your repos** — real-time GitHub intelligence, right in your terminal.

[![npm version](https://img.shields.io/npm/v/repo-sense?style=flat-square&logo=npm&color=cb3837)](https://www.npmjs.com/package/repo-sense)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](https://opensource.org/licenses/MIT)
[![GitHub Stars](https://img.shields.io/github/stars/li1050109098/beta-project-arena?style=flat-square&logo=github)](https://github.com/li1050109098/beta-project-arena)
[![npm downloads](https://img.shields.io/npm/dm/repo-sense?style=flat-square&color=blueviolet)](https://www.npmjs.com/package/repo-sense)
[![CI](https://img.shields.io/github/actions/workflow/status/li1050109098/beta-project-arena/ci.yml?style=flat-square&logo=githubactions&label=CI)](https://github.com/li1050109098/beta-project-arena/actions)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square)](http://makeapullrequest.com)

🔥 **Zero config · Real-time · Terminal-native** ⚡

</div>

---

## 🔮 What is repo-sense?

> Watch stars tick up **live**. Battle repos **head-to-head**. Monitor your whole landscape at a glance.

A sleek CLI that turns raw GitHub stats into a living dashboard — no config files, no web UIs, no nonsense. Just you, your terminal, and the pulse of the repos you care about.

```bash
# Watch a repo live — auto-refresh every 30s
npx repo-sense watch facebook/react
```

---

## 🚀 Quick Start

### 👁️ Watch a repo — live dashboard
```bash
npx repo-sense watch facebook/react
```
Opens an auto-refreshing dashboard that polls the GitHub API every 30 seconds. See stars, forks, issues, language, license, and the last update time — with **live deltas** so you never miss a tick.

Press `Ctrl+C` to stop. A summary of how many stars you watched fly by prints on exit.

### ⚔️ Battle two repos
```bash
npx repo-sense battle facebook/react vercel/next.js
```
Side-by-side comparison across every metric. Stars, forks, issues, language — and a **winner is crowned** based on the star gap. Perfect for settling those "which repo is hotter right now?" debates.

### 📡 Watch multiple repos
```bash
npx repo-sense watch-multi facebook/react vercel/next.js tailwindlabs/tailwindcss
```
Monitor your entire competitive landscape at once. One table, all the data, live updates.

```bash
# JSON output for piping into your own tools
npx repo-sense watch-multi facebook/react vercel/next.js -j
```

---

## 📦 Installation

### No install (just run it)
```bash
npx repo-sense watch torvalds/linux
```
`npx` pulls the latest version automatically. That's it.

### Global install
```bash
npm install -g repo-sense

# Use the short alias
rs watch facebook/react
rs --help
```

### From source
```bash
git clone https://github.com/li1050109098/beta-project-arena.git
cd beta-project-arena
npm install && npm run build
node dist/index.js --help
```

---

## 📖 Command Reference

| Command | Description |
|---------|-------------|
| `rs watch <repo>` | Live dashboard — stars, forks, issues and more (auto-refresh every 30s) |
| `rs watch <repo> -i 10` | Same, but refresh every 10 seconds |
| `rs battle <repo1> <repo2>` | Side-by-side comparison with a winner |
| `rs watch-multi <repos...>` | Monitor multiple repos simultaneously |
| `rs watch-multi <repos...> -j` | Multi-watch with JSON output |
| `rs --help` | Show all commands and options |
| `rs --version` | Show version |

### 🔐 Authentication (optional)
Without a token you get **60 requests/hour**. Set `GITHUB_TOKEN` for **5,000/hr**:

```bash
export GITHUB_TOKEN=ghp_your_token_here
```

Or create a `.env` file in the project root (see `.env.example`).

---

## 🎬 What It Looks Like

### 👁️ Watch Dashboard
```
  ┌──────────────────────────────────────┐
  │        🧬  repo-sense  WATCH        │
  └──────────────────────────────────────┘

┌────────────────────┬──────────────────────────────┐
│ Repository         │ facebook/react               │
│ Description        │ A declarative UI library     │
│ ⭐ Stars           │ 245.1K (+12)                 │
│ ⑂ Forks            │ 51.1K  (+1)                  │
│ ⚠ Issues           │ 1.3K   (-2)                  │
│ 🔤 Language        │ JavaScript                   │
│ 📜 License         │ MIT                          │
│ 🕐 Updated         │ 5/19/2026, 8:30:15 AM        │
│ 📅 Created         │ 5/29/2013                    │
└────────────────────┴──────────────────────────────┘

  Last updated: 8:30:15 AM  |  Press Ctrl+C to stop
```

### ⚔️ Repo Battle
```
  ╔══════════════════════════════════════════════════════════╗
  ║            ⚔️   REPO BATTLE  ⚔️                        ║
  ╚══════════════════════════════════════════════════════════╝

┌──────────────┬──────────────────────┬──────────────────────┬──────────────────────┐
│ Metric       │ facebook/react       │ vercel/next.js       │ Victor               │
├──────────────┼──────────────────────┼──────────────────────┼──────────────────────┤
│ ⭐ Stars     │ 245.1K               │ 139.5K               │ 🏆                   │
│ ⑂ Forks      │ 51.1K                │ 31.1K                │ 🏆                   │
│ ⚠ Issues     │ 1.3K                 │ 4.0K                 │ 🏆 (fewer)           │
│ 🔤 Language  │ JavaScript           │ JavaScript           │ ✓ Same               │
│ 📜 License   │ MIT                  │ MIT                  │ ✓ Same               │
└──────────────┴──────────────────────┴──────────────────────┴──────────────────────┘

  🏆 facebook/react WINS!
     Leads by 105.6K stars over vercel/next.js
```

### 📡 Multi-Watch Dashboard
```
  ┌────────────────────────────────────────────────────────────────┐
  │           📡  repo-sense  MULTI-WATCH  📡                     │
  └────────────────────────────────────────────────────────────────┘

┌──────────────────────────┬──────────────┬──────────────┬──────────────┬──────────┬──────────────┐
│ Repository               │ ⭐ Stars     │ ⑂ Forks       │ ⚠ Issues    │ 🔤 Lang   │ 📜 License   │
├──────────────────────────┼──────────────┼──────────────┼──────────────┼──────────┼──────────────┤
│ facebook/react           │ 245.1K +12   │ 51.1K +1     │ 1.3K -2      │ JS       │ MIT          │
│ vercel/next.js           │ 139.5K +5    │ 31.1K +0     │ 4.0K +1      │ JS       │ MIT          │
│ tailwindlabs/tailwindcss │ 87.2K +3     │ 4.5K +0      │ 521 -1       │ CSS      │ MIT          │
└──────────────────────────┴──────────────┴──────────────┴──────────────┴──────────┴──────────────┘

  Watching 3 repos  ·  8:30:15 AM  ·  Ctrl+C to stop
```

---

## 🗺️ Roadmap

- [x] `watch` — live dashboard with deltas
- [x] `battle` — head-to-head comparison
- [x] `watch-multi` — multi-repo monitoring
- [ ] Star history charts
- [ ] Multi-repo tournament mode
- [ ] Export to SVG/PNG
- [ ] Trending repos explorer
- [ ] GitHub Actions badge generator

---

## 🛠 Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Watch mode
npx tsup --watch

# Run tests
npm test

# Run locally
node dist/index.js battle facebook/react vercel/next.js
```

---

## 📄 License

MIT © β-Labs Corp.

---

<div align="center">
  <sub>Built with ❤️ by <a href="https://github.com/li1050109098">β-Labs Corp.</a> — because your terminal deserves better.</sub>
  <br>
  <sub>⭐ Star this repo if you find it useful!</sub>
</div>
