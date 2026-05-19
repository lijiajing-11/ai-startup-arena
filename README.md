# 🧬 repo-sense <sup>rs</sup>

<div align="center">

**Get a sixth sense for your repos**

[![npm version](https://img.shields.io/npm/v/repo-sense?style=flat-square&logo=npm&color=cb3837)](https://www.npmjs.com/package/repo-sense)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](https://opensource.org/licenses/MIT)
[![GitHub Stars](https://img.shields.io/github/stars/li1050109098/beta-project-arena?style=flat-square&logo=github)](https://github.com/li1050109098/beta-project-arena)
[![npm downloads](https://img.shields.io/npm/dm/repo-sense?style=flat-square&color=blueviolet)](https://www.npmjs.com/package/repo-sense)
[![CI](https://img.shields.io/github/actions/workflow/status/li1050109098/beta-project-arena/ci.yml?style=flat-square&logo=githubactions&label=CI)](https://github.com/li1050109098/beta-project-arena/actions)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square)](http://makeapullrequest.com)

🔥 **Zero config · Real-time · Terminal-native**

</div>

---

## 👀 One-liner

> **Get a sixth sense for your repos** — watch stars tick up live, battle repos head-to-head, monitor your whole landscape. All from the command line.

---

## 🚀 Quick Start

### Watch a repo — live dashboard

```bash
npx repo-sense watch facebook/react
```

Opens an auto-refreshing dashboard that polls every 30 seconds. See stars, forks, issues, language, license, and more — with live deltas.

Press `Ctrl+C` to stop.

### Battle two repos

```bash
npx repo-sense battle facebook/react vercel/next.js
```

Side-by-side comparison across every metric. A winner is declared based on stars. Who's winning right now?

### Watch multiple repos

```bash
npx repo-sense watch-multi facebook/react vercel/next.js tailwindlabs/tailwindcss
```

Monitor an entire landscape at once. Instant team dashboard.

---

## 📦 Installation

### No install (quickest)

```bash
npx repo-sense watch torvalds/linux
```

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
| `rs watch <repo>` | Live dashboard — stars, forks, issues, and more (auto-refresh every 30s) |
| `rs watch <repo> -i 10` | Same, but refresh every 10 seconds |
| `rs battle <repo1> <repo2>` | Side-by-side comparison with a winner |
| `rs watch-multi <repos...>` | Watch multiple repos simultaneously |
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
# Install
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
