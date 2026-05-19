# Release Checklist

This document describes the steps required to publish a new release of `repo-sense`.

> **Current status**: This project is not yet published to npm. The instructions below document the intended release process for when publishing begins.

---

## Prerequisites

- [ ] Node.js >= 18 installed
- [ ] npm account with access to the `@li1050109098/repo-sense` (or to-be-registered `repo-sense` package)
- [ ] `npm login` completed
- [ ] Write access to `li1050109098/beta-project-arena` on GitHub

---

## Release Steps

### 1. Update version

```bash
# Major: npm version major
# Minor: npm version minor
# Patch: npm version patch
npm version minor -m "chore: release v%s"
```

This updates `package.json` and creates a git tag automatically.

### 2. Build

```bash
npm run build
```

Verify the `dist/` directory is up to date and contains all expected files.

### 3. Run tests

```bash
npm test
```

All tests must pass (see package.json — `vitest run`).

### 4. Review CHANGELOG

- [ ] Open `CHANGELOG.md`
- [ ] Add the new version entry under the `[Unreleased]` section
- [ ] Move released items from `[Unreleased]` to the new version
- [ ] Update the release date

### 5. Commit and tag

```bash
git add package.json CHANGELOG.md
git commit -m "chore: release v<version>"
git push --follow-tags
```

### 6. Create GitHub Release (optional)

- Go to https://github.com/li1050109098/beta-project-arena/releases/new
- Select the tag created by `npm version`
- Title: `v<version>`
- Paste the relevant CHANGELOG entries as release notes

### 7. Publish to npm

```bash
# First-time publish (if package name is available):
npm publish

# Scoped package publish (if using @scope):
npm publish --access public
```

> ⚠️ Note: npm publish will fail if the package name `repo-sense` is already taken. If that happens, either rename the package in `package.json` or restrict to a scoped name.
