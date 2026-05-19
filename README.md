# 🧬 repo-sense <sup>rs</sup>

<div align="center">

**Get a sixth sense for your repos** — real-time GitHub intelligence, right in your terminal.

[![npm version](https://img.shields.io/npm/v/repo-sense?style=flat-square&logo=npm&color=cb3837)](https://www.npmjs.com/package/repo-sense)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](https://opensource.org/licenses/MIT)
[![GitHub Stars](https://img.shields.io/github/stars/li1050109098/beta-project-arena?style=flat-square&logo=github)](https://github.com/li1050109098/beta-project-arena)
[![npm downloads](https://img.shields.io/npm/dm/repo-sense?style=flat-square&color=blueviolet)](https://www.npmjs.com/package/repo-sense)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square)](http://makeapullrequest.com)

🔥 **Zero config · Live refresh · Terminal-native** ⚡

> One command to watch a repo live, or settle which one's hotter — no web UI, no config file, no BS.

</div>

---

## 🧩 At a Glance

| You type | You get |
|----------|---------|
| `npx repo-sense watch facebook/react` | Live dashboard that refreshes every 30s |
| `npx repo-sense battle facebook/react vercel/next.js` | Side-by-side smackdown with a winner |
| `rs summary facebook/react` | Markdown-friendly one-liner for your README (coming soon) |

**60 req/hr** without auth, **5,000 req/hr** with a `GITHUB_TOKEN` — details below.

---

## 📦 Install (pick one)

```bash
# Run instantly — no install needed
npx repo-sense watch torvalds/linux

# Or go global for the short alias
npm install -g repo-sense
rs watch facebook/react
```

> 💡 Pro tip: add `alias repo-sense=rs` to your `.zshrc` or `.bashrc` for even less typing.

---

## 🚀 Quick Start

### 👁️ `watch` — Live Dashboard

See stars, forks, and issues tick up in real time:

```bash
npx repo-sense watch facebook/react
```

The dashboard refreshes every 30 seconds by default. Pass `-i 5` for every 5 seconds. Every delta is highlighted so you never miss a beat. Press `Ctrl+C` to stop — it prints a summary of how many events happened while you watched.

### ⚔️ `battle` — Who's Hotter Right Now?

Put two repos head-to-head across every metric:

```bash
npx repo-sense battle facebook/react vercel/next.js
```

Stars, forks, issues, language, license — side by side. A winner is crowned based on star gap. Perfect for settling "which repo is hotter right now?" debates at your desk.

### 📝 `summary` — README One-Liner *(coming soon)*

Drop a living badge into your own project's README:

```bash
npx repo-sense summary vercel/next.js
# → ⭐ 139.5K · ⑂ 31.1K · ⚠ 4.0K · 🔤 JavaScript · 📜 MIT
```

---

## 📖 Command Reference

| Command | Description |
|---------|-------------|
| `rs watch <repo>` | Live dashboard — stars, forks, issues (auto-refresh 30s) |
| `rs watch <repo> -i <sec>` | Same with custom refresh interval |
| `rs battle <a> <b>` | Side-by-side comparison, winner declared |
| `rs summary <repo>` | One-liner badge for your own README *(coming soon)* |
| `rs --help` | All commands and options |
| `rs --version` | Show version |

### 🔐 Auth (optional)

Without a token you get **60 requests/hour**. Set `GITHUB_TOKEN` for **5,000/hr**:

```bash
export GITHUB_TOKEN=ghp_your_token_here
```

Or drop a `.env` file in the project root with `GITHUB_TOKEN=ghp_...`.

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

---

## 🗺️ Roadmap

- [x] `watch` — live dashboard with real-time deltas
- [x] `battle` — head-to-head repo comparison
- [ ] `summary` — one-liner badge for your README
- [ ] `watch-multi` — multi-repo landscape monitoring
- [ ] Star history sparklines
- [ ] Multi-repo tournament (bracket mode)
- [ ] Export snapshot to SVG
- [ ] Trending repos explorer
- [ ] GitHub Actions badge generator

> 👣 Following semantic versioning — `summary` ships as v0.2.0, `watch-multi` as v0.3.0.

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

## ⚙️ How It Works

1. You pass a GitHub repo slug (e.g. `facebook/react`)
2. repo-sense calls the **GitHub REST API** via Octokit
3. Data hits your terminal as a **beautiful CLI table** — no web browser needed
4. On `watch`, it **polls every N seconds** and highlights what changed
5. On `battle`, it compares every metric and declares a winner

That's it. No config files, no Docker, no cloud service. Just you and the terminal.

---

## 📣 Community & Spread

`repo-sense` is open-source and we'd love your help making it better.

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
  <sub>🧑‍🚀 Refined by MarketBeta @ β-Labs · v6</sub>
</div>
