# 🧬 repo-sense

<div align="center">

**Beautiful GitHub repo intelligence from your terminal**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![npm version](https://img.shields.io/badge/npm-v0.1.0-red?style=flat-square&logo=npm)](https://www.npmjs.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![GitHub Stars](https://img.shields.io/github/stars/li1050109098/beta-project-arena?style=flat-square&logo=github)](https://github.com/li1050109098/beta-project-arena)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

</div>

---

`repo-sense` (of `rs`) is a **beautiful, interactive CLI** for exploring and monitoring GitHub repositories. Track star counts in real-time, compare repos head-to-head, and get rich repository intelligence — all from your terminal.

Built with **TypeScript** for speed, reliability, and gorgeous terminal output. Runs wherever Node.js does.

---

## ✨ Features

| Command | Description |
|---------|-------------|
| `rs watch <repo>` | Live-updating dashboard — stars, forks, issues, and more (auto-refresh every 30s) |
| `rs battle <repo1> <repo2>` | Head-to-head repo comparison with a declared winner |
| `rs --help` | All commands and options |

### Coming Soon
- [ ] Star history charts
- [ ] Multi-repo tournament mode
- [ ] Export to SVG/PNG
- [ ] Trending repos explorer
- [ ] GitHub Actions badge generator

---

## 📦 Installation

### Via npx (no install required)
```bash
npx repo-sense watch facebook/react
```

### Via npm (global install)
```bash
npm install -g repo-sense
rs --help
```

### From source
```bash
git clone https://github.com/li1050109098/beta-project-arena.git
cd beta-project-arena
npm install
npm run build
node dist/index.js --help
```

---

## 🚀 Quick Start

### Watch a repository
```bash
rs watch facebook/react
```
This opens a live dashboard that updates every 30 seconds. Press `Ctrl+C` to stop.

### Battle two repositories
```bash
rs battle facebook/react vercel/next.js
```
See a side-by-side comparison with a clear winner!

### Authentication (optional)
Set `GITHUB_TOKEN` in your environment for higher API rate limits (5,000/hr vs 60/hr):
```bash
export GITHUB_TOKEN=ghp_your_token_here
rs watch microsoft/vscode
```

You can also create a `.env` file in the repo root (see `.env.example`).

---

## 📊 Example Output

```
  ╔══════════════════════════════════════════════════════════╗
  ║            ⚔️   REPO BATTLE  ⚔️                        ║
  ╚══════════════════════════════════════════════════════════╝

┌──────────────┬──────────────────────┬──────────────────────┬──────────────────────┐
│ Metric       │ facebook/react       │ vercel/next.js       │ Victor               │
├──────────────┼──────────────────────┼──────────────────────┼──────────────────────┤
│ ⭐ Stars     │ 245.1K               │ 139.5K               │ 🏆                   │
├──────────────┼──────────────────────┼──────────────────────┼──────────────────────┤
│ ⑂ Forks      │ 51.1K                │ 31.1K                │ 🏆                   │
├──────────────┼──────────────────────┼──────────────────────┼──────────────────────┤
│ ⚠ Issues     │ 1.3K                 │ 4.0K                 │ 🏆 (fewer)           │
├──────────────┼──────────────────────┼──────────────────────┼──────────────────────┤
│ 🔤 Language  │ JavaScript           │ JavaScript           │ ✓ Same               │
├──────────────┼──────────────────────┼──────────────────────┼──────────────────────┤
│ 📜 License   │ MIT                  │ MIT                  │ ✓ Same               │
└──────────────┴──────────────────────┴──────────────────────┴──────────────────────┘

  🏆 facebook/react WINS!
     Leads by 105.6K stars over vercel/next.js
```

---

## 🛠 Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Development (watch mode)
npx tsup --watch

# Run directly
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

## Updates
- Arena running


## Updates
- Arena running


## Updates
- Arena running


## Updates
- Arena running


## Updates
- Arena running


## Updates
- Arena running


## Updates
- Arena running


## Updates
- Arena running


## Updates
- Arena running


## Updates
- Arena running


## Updates
- Arena running


## Updates
- Arena running


## Updates
- Arena running


## Updates
- Arena running


## Updates
- Arena running


## Updates
- Arena running


## Updates
- Arena running


## Updates
- Arena running


## Updates
- Arena running


## Updates
- Arena running


## Updates
- Arena running


## Updates
- Arena running


## Updates
- Arena running

