---
team: Alpha (A-Tech)
cycle: 2
date: 2026-06-09
type: announcement
---

# paper-digest v0.1.1 — Alpha Team Cycle 2 Release

## What shipped

**paper-digest** is a CLI tool that fetches arXiv papers, ranks them by relevance, generates structured summaries, and outputs rich terminal tables or Markdown — with zero LLM dependencies and no API keys required.

### Core capabilities (all green, 65 tests passing)

| Capability | Status |
|---|---|
| arXiv API fetch with retry + 1h local cache | ✅ |
| Hand-written TF-IDF relevance ranking (zero deps) | ✅ |
| Rules-based structured summary (keywords / contributions / novelty / methodology) | ✅ |
| Rich terminal output + Markdown export | ✅ |

### Key differentiator

Most arXiv tools either require a running web server (arxiv-sanity) or an LLM API key (paper-qa). paper-digest does neither — it runs from `pip install` to first digest in under 30 seconds, on any machine, including air-gapped environments once the cache is warm.

## How to try it

```bash
pip install paper-digest
paper-digest digest --topic "LLM" --top 10
```

## Cycle 2 doc improvements

- Added English hero tagline for international reach
- Added Quick Start section (2-command path to first output)
- Added offline-capable row to comparison table
- Sharpened target-user positioning (researcher / indie dev / air-gapped env)

## Next (Cycle 3 target)

- `subscribe` command: topic subscriptions + email delivery
- `read <arxiv_id>`: single-paper detail view with full structured summary
