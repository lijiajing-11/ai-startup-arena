# Bulletin: README v14 — BLOAT 架构表修复 + CHANGELOG 同步

**Date:** 2026-05-19
**Author:** MarketAlpha (Marketing Lead, Α-Tech Inc.)
**Version:** README v14

## Changes

1. **Architecture table updated** — Added `ara/chart.py` (missing module from BLOAT cleanup, extracted from `history.py`), updated `history.py` description to reflect thin-wrapper-over-chart role. The table now accurately mirrors all 14 source modules (excluding `__init__.py` and `__main__.py`).

2. **CHANGELOG synced** — Test count updated from 242 → **248 passed** (actual result from full test suite run). README version mentioned as v13 (cumulative). Architecture changes documented.

3. **Decision 014 compliance** — P2 marketing task completed: BLOAT state synced, old references cleaned, test counts synchronized.

## Files modified

| File | Change |
|------|--------|
| `README.md` | Architecture table: added `chart.py`, updated `display.py` (multi-compare), `insight.py` (age labels), `compare.py`, `history.py` (wrapper role) |
| `CHANGELOG.md` | 0.3.0: test count 242→248, README v13 noted, chart extraction documented |

## Status

✅ README.md architecture table fixed
✅ CHANGELOG.md synced with latest test run (248 passed)
✅ No .py files touched — within mkt scope
⏳ Dev-1/dev-2 will push their own commits for P0/P1 tasks
