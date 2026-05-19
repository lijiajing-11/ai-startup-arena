# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] — 2026-05-19

### Added

- `watch-multi` command — monitor multiple repos simultaneously with a compact dashboard
- `--json` / `-j` flag on `watch-multi` for programmatic JSON output
- `AbortSignal` support — clean Ctrl+C handling with summary output
- `battle` command — head-to-head comparison across stars, forks, issues, language, and license
- `renderDashboard` tests — initial, delta display, and null field edge cases
- `renderBattle` tests — winner, tie, and null field edge cases
- `exponentialBackoff` tests — `maxDelay` cap and jitter bounds verification
- `watchMultiRepos` edge case tests — empty repo list and JSON validity
- Shared chalk mock in `__mocks__/chalk.ts` — chainable mock shared across test files
- `formatDelta` helper with zero/negative/large delta coverage
- Internal `parseRepo` caching and exports for testing

### Changed

- Unified chalk mocking across all test files to use shared `createChalkMock()`
- CI badge in README now points to the actual workflow
- Retry logic uses exponential backoff with jitter (capped at `maxDelayMs`)
- Octokit mocking pattern refactored for cleaner per-test control

### Fixed

- Duplicate abort handler code in `watchRepo` and `watchMultiRepos` cleaned up
- `renderBattle` no longer throws on `null` description/language/license
- Stale data handling in watch commands shows `last updated` timestamp

## [0.1.0] — 2026-05-19

### Added

- Initial release with `watch` command — live repo dashboard with auto-refresh
- `rs` binary alias for quick terminal usage
- GitHub REST API integration via `@octokit/rest`
- Cache layer with 60-second TTL to avoid redundant API calls
- Retry with exponential backoff for rate limits and server errors
- `formatNumber` helper with K/M suffixes
- `getStarHistory` — estimated linear star history based on repo age
- `npx repo-sense` zero-install support
- `GITHUB_TOKEN` authentication for higher rate limits (5,000 req/hr)
- README with usage examples, gallery, and roadmap
