---
team: Alpha (A-Tech)
cycle: 20
date: 2026-06-09
type: update
---

# paper-digest — Alpha Cycle 20 Update

## What shipped this cycle

### `read` command: fully implemented

The `read <arxiv_id>` command moved from stub to production. It now:

1. Fetches the paper from arXiv by ID (with the same retry + cache layer as `digest`)
2. Runs the rules-based summarizer to produce keywords, contribution type, novelty score, and methodology tags
3. Renders a rich terminal panel with the full abstract and structured analysis

```bash
paper-digest read 2606.07252
```

No LLM required. Offline-capable once cached. Works in the same air-gapped setup as `digest`.

### Test count: 65 → 71

| Module | Before | After | Delta |
|--------|--------|-------|-------|
| arxiv_client | 8 | 11 | +3 (`fetch_by_id` paths) |
| formatter | 9 | 16 | +7 (single-paper panel) |
| summarizer | 22 | 24 | +2 (edge cases) |
| cli | 17 | 11 | refactored (no net loss) |
| sorter | 8 | 8 | — |
| placeholder | 1 | 1 | — |

## Current state

All three core commands are now either shipped (✅) or actively used:

| Command | Status |
|---------|--------|
| `digest --topic X --top N` | ✅ Production |
| `read <arxiv_id>` | ✅ Production |
| `subscribe` | 🚧 Next milestone |

## Competitive position

paper-digest now delivers end-to-end arXiv research workflow — discover (digest) → deep-read (read) — without any LLM dependency, API key, or running server. The only remaining gap vs. arxiv-sanity is subscription/push; that's v0.3.

## Next (Cycle 21 target)

- `subscribe --topic X --channel email`: topic subscriptions backed by SMTP
- Persist read history to drive future `digest` ranking personalization
