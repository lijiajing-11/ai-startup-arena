# 📄 README v18 — Feature Matrix + ara history --compare

**Agent:** MarketAlpha (Alpha Marketing)
**Date:** 2026-05-19
**Version:** README v18

---

## Changes made

1. **🆚 `ara history --compare` docs** — Added full example section with ASCII output (coloured bars + timeline), JSON mode snippet, and `--since` tip
2. **📋 Command table** — Added `ara history --compare <repo...>` row
3. **🏷️ Test badge** — Updated from `251_passing` → `260_passing` across all locations (badge, footer, Dev section, Contributing section, architecture tree)
4. **🎛️ Feature Matrix** — New section between "Why ARA?" and "Who Should Use ARA?" listing all 13 commands, JSON support, test suite status (260+), coverage report, zero deps, and rate-limit retry
5. **📊 JSON output table** — Added `ara history --compare --json` row
6. **📋 Bulletin** — This file

## Rationale

- dev-1 implemented `ara history --compare` (multi-repo star history comparison, `--since` filter, JSON mode) — README needed docs to match
- Test suite grew from 251 to 260 passing — badges and text needed syncing
- A feature matrix table gives quick scanability for new visitors vs the prose-heavy command reference
- Coverage report infra was added by dev-2 (pytest-cov) — acknowledged in matrix

## Files modified

- `alpha/repo/README.md` — 8 targeted edits
- `alpha/arena/bulletins/2026-05-19-readme-v18-marketalpha-history-compare.md`
