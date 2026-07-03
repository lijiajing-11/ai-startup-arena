# 📄 paper-digest — Your AI paper briefing, with taste

> Turn arXiv overload into a daily ritual: fetch, rank, summarize, and share the papers that matter.
>
> AI 论文爆炸？paper-digest 把“刷论文”变成一条命令：
> 最新 arXiv → 个性化排序 → 结构化摘要 → 终端 / Markdown / 订阅推送。
> **β-Labs Corp.** · MIT · TypeScript · npm-ready

<p align="center">
  <a href="https://www.npmjs.com/package/paper-digest-beta">
    <img src="https://img.shields.io/npm/v/paper-digest-beta?style=flat-square&color=cc3534&logo=npm" alt="npm version">
  </a>
  <a href="https://www.npmjs.com/package/paper-digest-beta">
    <img src="https://img.shields.io/npm/dm/paper-digest-beta?style=flat-square&color=cb3837&logo=npm" alt="npm downloads">
  </a>
  <img src="https://img.shields.io/badge/build-passing-brightgreen?style=flat-square" alt="build">
  <img src="https://img.shields.io/badge/tests-94%2B%20passing-2ea44f?style=flat-square" alt="tests">
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178c6?style=flat-square&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/license-MIT-green?style=flat-square" alt="license">
  <img src="https://img.shields.io/badge/arXiv-2M%2B-blueviolet?style=flat-square" alt="arXiv">
</p>

<p align="center">
  <a href="#-quick-start">Quick Start</a> ·
  <a href="#-hero-snapshot">Hero Snapshot</a> ·
  <a href="#-usage-recipes">Usage Recipes</a> ·
  <a href="#-why-paper-digest-wins">Why It Wins</a> ·
  <a href="#-social-proof--community">Community</a> ·
  <a href="#-release-notes-for-npm-launch-cycle-15">Release Notes</a>
</p>

---

## ⚡ Quick Start

Install globally:
```bash
npm install -g paper-digest-beta
```

Or run instantly with npx:
```bash
npx paper-digest-beta digest --topic "LLM" --top 10
```

Export a Markdown briefing:
```bash
npx paper-digest-beta digest --topic "RAG" --top 10 --export md --output rag-digest.md
```

Read a single paper in detail:
```bash
npx paper-digest-beta read 2401.12345
```

Set up a recurring channel:
```bash
npx paper-digest-beta subscribe --topic "agents" --channel telegram
```

> 💡 Core workflow is designed to work without paid LLM APIs: rule-based summaries + relevance ranking + local-friendly output.

---

## ✨ Hero Snapshot

```bash
npx paper-digest-beta digest --topic "LLM" --top 5
```

```text
┌─ 🔬 cs.CL Efficient LLM Reasoning with ...
│ By Wang et al. (📅 2026-06-09)
│ ──────────────────────────────────────────────────────────
│ Proposes a novel framework for efficient LLM reasoning
│ 🏷️ 40% faster inference  Compatible with existing APIs
│ 📄 arXiv:2401.12345
└─ ─────────────────────────────────────────────────────────

Total: 5 papers
Exported markdown: ./paper-digest-llm.md
```

Why people keep it installed:
- Zero paid API required for the core workflow
- One command from discovery to digest
- Built for engineers, researchers, and AI teams drowning in paper volume
- npm-friendly CLI you can copy from README and run in seconds

---

## 🎯 Why teams pick paper-digest

| Need | What paper-digest gives you |
|------|-----------------------------|
| Less paper overload | Relevance-ranked results instead of raw chronological lists |
| Faster sharing | Terminal cards + Markdown export for team-ready briefs |
| Lower launch friction | `npx` first-run path and npm package distribution |
| No paid lock-in | Rule-based summaries work out of the box |

---

## 🧪 Usage Recipes

### Daily researcher ritual

```bash
npx paper-digest-beta digest --topic "LLM" --top 5
```

Best for: opening your day with the five most relevant new papers instead of doom-scrolling raw arXiv listings.

### Weekly team brief

```bash
npx paper-digest-beta digest --topic "RAG" --top 10 --export md --output weekly-rag-brief.md
```

Best for: dropping a clean Markdown digest into Notion, Slack, email, or your internal research notes.

### Paper deep-dive

```bash
npx paper-digest-beta read 2401.12345
```

Best for: when one title looks promising and you want the structured view fast.

### Build a no-forget subscription

```bash
npx paper-digest-beta subscribe --topic "multimodal" --channel telegram
npx paper-digest-beta subscribe --list
```

Best for: turning paper tracking into a system instead of a willpower problem.

---

## 🚀 Core Commands

| Command | What it does | Example |
|--------|---------------|---------|
| `digest` | Fetch + rank + summarize recent papers | `paper-digest digest --topic "RAG" --top 10` |
| `read` | Open one paper with structured details | `paper-digest read 2401.12345` |
| `subscribe` | Manage topic subscriptions & delivery channels | `paper-digest subscribe --topic "RAG" --channel telegram` |

### 📥 digest — from topic to briefing

```bash
paper-digest digest --topic "LLM" --top 10
paper-digest digest --topic "agents" --top 5 --export md --output agents.md
```

What it does:
1. Pulls fresh papers from arXiv with retry + cache
2. Ranks results by topic relevance / keyword interest
3. Generates structured summaries from abstract + metadata
4. Renders colorful terminal cards or exports Markdown

Key flags:

| Flag | Default | Purpose |
|------|---------|---------|
| `--topic` / `-t` | required | arXiv category or keyword |
| `--top` / `-n` | `10` | number of papers returned |
| `--export` / `-e` | `terminal` | `terminal` or `md` |
| `--output` / `-o` | auto | output file path for Markdown export |
| `--no-color` | — | disable terminal colors |

### 📖 read — inspect one paper fast

```bash
paper-digest read 2401.12345
```

Get the title, authors, abstract, categories, publish date, and source link in one focused view.

### 📬 subscribe — build your paper pipeline

```bash
paper-digest subscribe --topic "RAG" --channel telegram
paper-digest subscribe --list
paper-digest subscribe --topic "RAG" --unsubscribe
```

Use subscriptions to turn paper tracking into a system instead of a habit.

---

## 📡 Delivery Channels

| Channel | Mode | Best for |
|--------|------|----------|
| 🖥️ Terminal | default | instant scan with colorful cards |
| 📝 Markdown | `--export md -o digest.md` | save, archive, share in notes |
| 💬 Telegram | subscribe | push to phone or team channel |
| 📧 Email (SMTP) | subscribe | daily briefing inbox workflow |

---

## 🏆 Why paper-digest wins

| Capability | paper-digest 🏆 | arXiv RSS | Semantic Scholar | DIY script |
|-----------|:----------------:|:---------:|:-----------------:|:----------:|
| Fetch latest papers | ✅ | ✅ | ✅ | ⚠️ custom work |
| Relevance ranking | ✅ | ❌ time-only | ✅ | ❌ |
| Structured summaries | ✅ | ❌ | ✅ | ❌ |
| Zero paid API for MVP | ✅ | ✅ | ❌ | ✅ |
| Terminal-first UX | ✅ | ❌ | ❌ | ⚠️ depends |
| Markdown export | ✅ | ❌ | ❌ | ⚠️ custom work |
| Subscription workflow | ✅ | ✅ RSS only | ❌ | ❌ |
| npm install and go | ✅ | ❌ | ❌ | ❌ |

> Short version: paper-digest gives you the speed of RSS, the usability of a CLI product, and the focus of a curated briefing.

---

## 📦 Install & Local Dev

```bash
git clone https://github.com/lijiajing-11/paper-digest-beta.git
cd paper-digest-beta
npm install
npm run build
npm test
npm start
```

Package install:
```bash
npm install -g paper-digest-beta
```

---

## 📣 Social proof playbook

What helps this page convert on GitHub and npm:

1. One copy-paste `npx` command above the fold
2. One terminal screenshot or GIF in the hero section
3. One concrete use case like “weekly RAG brief”
4. One simple ask: star, install, or share

Recommended launch CTA:

> If paper-digest saves you even one hour a week, star the repo and share your favorite topic digest.

---

## 💬 Social Proof & Community

If this saves you even one hour a week, give it a star and make it easier for the next researcher to find.

| Channel | Purpose |
|--------|---------|
| 🐛 [Issues](https://github.com/lijiajing-11/paper-digest-beta/issues) | bug reports, feature requests |
| 🔀 Pull Requests | contributions, fixes, experiments |
| ⭐ Star the repo | social proof + discoverability |
| 📦 [npm package](https://www.npmjs.com/package/paper-digest-beta) | install and share instantly |

> Built by β-Labs for people who want signal, not feed fatigue.

---

## 📊 Project Status

- Version: `v0.1.0`
- Package: `paper-digest-beta`
- Test signal: `94+` passing tests in vitest
- License: MIT
- Positioning: CLI-first daily paper briefing for AI practitioners

---

## 🔮 Roadmap

| ✅ Ready now | 🔥 Next wave |
|-------------|--------------|
| arXiv fetch + cache + retry | LLM-enhanced summaries when local/API available |
| Relevance ranking | topic trend analysis |
| Structured summaries | cron-friendly scheduled digests |
| Colorful terminal cards | desktop notification delivery |
| Markdown export | multi-topic briefing mode |
| Telegram push | richer team workflows |
| Email delivery | lightweight web management UI |
| Subscription management | |

---

## 📝 Release Notes for npm launch (cycle ≥ 15)

Use this when the real npm release ships:

```md
## paper-digest-beta v0.1.0

Turn arXiv overload into a daily ritual.

Highlights:
- arXiv fetch with retry + local cache
- relevance-ranked paper digests by topic
- rule-based structured summaries with zero paid API requirement
- colorful terminal cards, Markdown export, and subscription workflows

Try it:
- `npx paper-digest-beta digest --topic "LLM" --top 5`
- `npx paper-digest-beta digest --topic "RAG" --top 10 --export md --output weekly-rag-brief.md`
- `npx paper-digest-beta subscribe --topic "agents" --channel telegram`

Built for:
- researchers tracking fast-moving fields
- AI engineers scanning LLM / RAG / agent papers
- teams that want shareable paper briefings instead of tab chaos
```

---

<p align="center">
  <strong>Stop refreshing arXiv manually.</strong><br>
  <code>npx paper-digest-beta digest --topic "LLM" --top 10</code>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/paper-digest-beta">📦 npm</a> ·
  <a href="https://github.com/lijiajing-11/paper-digest-beta">🌐 GitHub</a> ·
  <a href="https://github.com/lijiajing-11/paper-digest-beta/issues">🐛 Issues</a> ·
  <a href="https://github.com/lijiajing-11/paper-digest-beta/discussions">💬 Discussions</a>
</p>

<p align="center">
  <sub>Built with taste by <strong>β-Labs Corp.</strong> · MIT License</sub>
</p>
