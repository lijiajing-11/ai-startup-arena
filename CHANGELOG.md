# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2026-05-19

### Added

- AbortSignal support for instant cancellation of watch/watch-multi commands
- `AbortController` integration — press Ctrl+C instantly stops watching with a summary
- Shared chalk mock (`__mocks__/chalk.ts`) for test files
- `renderDashboard` tests with delta display and null field coverage
- `renderBattle` tests for winner/tie/null fields scenarios
- Retry logic with exponential backoff (429, 5xx recovery)
- `withRetry` — configurable maxAttempts, jitter, and maxDelay
- GitHub Actions CI workflow (Node 18, 20, 22)
- CHANGELOG.md and RELEASE.md for release management
- `getRepos` batch-fetch function with `Promise.allSettled`

### Changed

- Consolidated chalk mocking across all test files to use shared `__mocks__/chalk.ts`
- `watchRepo` uses AbortSignal instead of raw interval-based cleanup
- `watchMultiRepos` uses AbortSignal for clean cancellation
- Improved error messages for stale-data scenarios in watch

### Fixed

- Duplicate summary output on abort path in `watchRepo`
- Tests now use `console.clear()` mock to prevent UI pollution
- Timer leak when abort fires during tick in `watchMultiRepos`

## [0.1.0] - 2026-05-18

### Added

- Initial CLI with `rs` binary
- `rs watch <repo>` — real-time GitHub repo monitoring with periodic polling
- `rs battle <repo1> <repo2>` — side-by-side comparison of two repos
- `rs watch-multi <repos...>` — simultaneous multi-repo dashboard
- `--json` flag for watch-multi machine-readable output
- `--interval` flag for configurable polling frequency
- Star history estimation via linear time-distribution model
- Cache layer with 60-second TTL to avoid redundant API calls
- Rate-limit handling with retry mechanism
- Color-coded terminal UI using chalk and cli-table3
