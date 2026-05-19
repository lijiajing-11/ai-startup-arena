# 🧬 repo-sense

<div align="center">

**Get a sixth sense for your repos**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![npm version](https://img.shields.io/badge/npm-v0.1.0-red?style=flat-square&logo=npm)](https://www.npmjs.com/package/repo-sense)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![GitHub Stars](https://img.shields.io/github/stars/li1050109098/beta-project-arena?style=flat-square&logo=github)](https://github.com/li1050109098/beta-project-arena)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
[![npm downloads](https://img.shields.io/badge/dynamic/json?url=https://api.npmjs.org/downloads/point/last-month/repo-sense&query=downloads&label=downloads&style=flat-square&color=blueviolet)](https://www.npmjs.com/package/repo-sense)

</div>

---

**repo-sense** (`rs`) — a gorgeous CLI that gives you **real-time GitHub repo intelligence** straight from your terminal. Watch stars tick up live, battle repos head-to-head, and never open a browser again to know what's happening.

Built with TypeScript. Powered by the GitHub API. Zero config.

---

## 👁️ At a Glance

```bash
# Watch any repo — live dashboard, refreshes every 30s
npx repo-sense watch facebook/react

# Battle two repos — who wins?
npx repo-sense battle facebook/react vercel/next.js
```

---

## 📦 Installation

### Use directly (no install)
```bash
npx repo-sense watch torvalds/linux
```

### Install globally
```bash
npm install -g repo-sense
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

## 🚀 Quick Start

### `rs watch <repo>` — Live dashboard

Opens an auto-refreshing metrics dashboard that polls every 30 seconds. Press `Ctrl+C` to stop.

```bash
rs watch microsoft/vscode
```

You'll see a real-time view of stars, forks, open issues, language, license, creation date, and last update — with deltas between refreshes. Watch stars grow in real time.

### `rs battle <repo1> <repo2>` — Head-to-head

Compare two repos side by side with a declared winner.

```bash
rs battle facebook/react vercel/next.js
```

The tool fetches both repos in parallel and shows a clean table comparing stars, forks, issues, language, and license — then declares a winner based on stars.

### Authentication (optional)

Set `GITHUB_TOKEN` for 5,000 requests/hour instead of the default 60/hr:

```bash
export GITHUB_TOKEN=ghp_your_token_here
rs watch microsoft/vscode
```

You can also create a `.env` file in the repo root (see `.env.example`).

---

## 📖 Command Reference

| Command | Description |
|---------|-------------|
| `rs watch <repo>` | Live dashboard — stars, forks, issues, and more (auto-refresh every 30s) |
| `rs watch <repo> -i 10` | Same, but refresh every 10 seconds |
| `rs battle <repo1> <repo2>` | Side-by-side comparison with a winner |
| `rs --help` | Show all commands and options |
| `rs --version` | Show version |

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
│ ⑂ Forks            │ 51.1K (+1)                   │
│ ⚠ Issues           │ 1.3K  (-2)                   │
│ 🔤 Language        │ JavaScript                   │
│ 📜 License         │ MIT                          │
│ 🕐 Updated         │ 5/19/2026, 8:30:15 AM        │
│ 📅 Created         │ 5/29/2013                    │
└────────────────────┴──────────────────────────────┘

  Last updated: 8:30:15 AM  |  Press Ctrl+C to stop
```

And the **battle** screen:

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
