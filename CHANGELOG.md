# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- AbortSignal event listener support for graceful cancellation of long-running operations
- Shared chalk mock for consistent test output across all test suites
- renderDashboard tests covering dashboard rendering logic
- 48 total passing tests across 4 test files

## [0.1.0] - 2026-05-18

### Added

- Initial release of repo-sense CLI
- `rs watch` command — watch a GitHub repository for real-time star/activity tracking
- `rs battle` command — compare two repositories head-to-head
- `rs watch-multi` command — monitor multiple repositories simultaneously
- Beautiful terminal dashboard with real-time updates via ora spinners and cli-table3
- GitHub API integration via @octokit/rest with automatic retry and rate-limit handling
- TypeScript codebase with full type safety

[Unreleased]: https://github.com/li1050109098/beta-project-arena/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/li1050109098/beta-project-arena/releases/tag/v0.1.0
