# Release Checklist

> **Current status**: This package is published on npm as `repo-sense`.  
> Use `npx repo-sense` (zero-install) or `npm install -g repo-sense`.

---

## ⚡ Quick Release (pull requests)

For minor fixes and documentation changes, merge the PR and let CI handle verification.
No manual release steps needed for PR-only changes.

---

## 📦 Full Release Checklist

Run these steps in order. Each step depends on the previous one passing.

### 1. Version Bump

```bash
# Pick one:
npm version patch   # bug fixes (0.0.x)
npm version minor   # new features (0.x.0)
npm version major   # breaking changes (x.0.0)
```

This updates `package.json` and creates a git tag automatically.

### 2. Build

```bash
npm run build
```

Verify `dist/` contains the compiled JavaScript and the CLI starts:

```bash
node dist/index.js --version
node dist/index.js --help
```

### 3. Run Tests

```bash
npm test
```

All tests **must** pass (green). If tests fail, fix before proceeding.

### 4. Review Changelog

- Open `CHANGELOG.md`
- Confirm the new version entry is accurate
- Add any missing entries from the commit log

### 5. Commit & Tag

If you used `npm version`, the tag is already created:

```bash
git push --follow-tags
```

If you bumped manually:

```bash
git add package.json CHANGELOG.md
git commit -m "chore: release vX.Y.Z"
git tag vX.Y.Z
git push && git push --tags
```

### 6. Create GitHub Release

- Go to https://github.com/li1050109098/beta-project-arena/releases/new
- Select the tag you just pushed
- Title: `vX.Y.Z`
- Description: Copy the relevant section from `CHANGELOG.md`
- Click "Publish release"

This triggers the CI workflow automatically (if it runs on tags).

### 7. Publish to npm

```bash
npm publish
```

> ⚠️ **npm publish** requires:
> - `npm login` (authenticated as the package owner)
> - Write access to the `repo-sense` package on npm
>
> If you get `403 Forbidden`, you may not have publish permissions.
> Run `npm whoami` to check your logged-in user.

### 8. Verify

- [ ] CI badge on README shows green
- [ ] `npx repo-sense --version` shows the new version
- [ ] GitHub Release page shows the new release

---

## 🧪 Dry Run (pre-flight)

To test the publish step without actually publishing:

```bash
npm pack --dry-run
```

This shows what files would be included in the npm tarball.
Verify the `files` field in `package.json` includes `dist/` and `bin/`.

---

## 🚑 Emergency Release (hotfix)

```bash
git checkout -b hotfix/vX.Y.Z master
# Fix the issue
git commit -m "fix: critical bug description"
npm version patch
npm run build && npm test
git push --follow-tags
# Create PR, merge, then follow steps 6-8
```

---

## 🔐 Access & Permissions

| Resource | URL / Command | Required Access |
|----------|---------------|-----------------|
| GitHub repo | https://github.com/li1050109098/beta-project-arena | Write |
| npm package | https://www.npmjs.com/package/repo-sense | Publish |
| CI (GitHub Actions) | Auto from `master` | — |

Managed by β-Labs Corp. For access requests, contact the team lead.
