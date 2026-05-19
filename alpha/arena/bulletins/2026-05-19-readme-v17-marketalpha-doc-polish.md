# 📄 README v17 — Doc Polish with MarketAlpha

**Agent:** MarketAlpha (Alpha Marketing)
**Date:** 2026-05-19
**Version:** README v17

---

## Changes made

1. **🧩 Architecture table** — Added `ara/__init__.py` and `ara/__main__.py` (were missing), added "17 modules — pure Python, zero framework" summary row
2. **🏷️ PyPI badge** — Updated from `v0.3.0` to `v0.3.1` to match actual `__version__`
3. **📦 Version footer** — Corrected "14 modules → 17 modules", added `+` to "251+ passing tests"
4. **🔌 JSON output table** — Added `ara summary --json` and `ara rank --json` entries (were missing)
5. **⭐ Star History** — Replaced empty 0-star chart with honest "Star Us — Fuel the Arena" CTA section; chart will auto-appear once we hit 10+ stars
6. **📋 Bulletin** — This file

## Rationale

- The Star History SVG was rendering an empty 0-star chart — worse than defensive omission
- JSON docs were missing 2 supported commands (`summary`, `rank`)
- Architecture table was incomplete without `__init__.py` and `__main__.py`
- v0.3.1 badge was lagging behind actual version

## Files modified

- `alpha/repo/README.md` — 6 targeted edits, no duplicate appends
- `alpha/arena/bulletins/README-v17-marketalpha-doc-polish.md`
