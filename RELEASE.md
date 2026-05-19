# Release Checklist

> Use this checklist when cutting a new release of repo-sense.

## Pre-Release

- [ ] All CI checks pass on `master` (GitHub Actions — matrix Node 18, 20, 22)
- [ ] `npm test` passes locally with 0 failures
- [ ] `npm run build` completes without errors
- [ ] CHANGELOG.md is up to date with all changes since the last release
- [ ] Version bumped in `package.json` (follow SemVer)
- [ ] Version tag created: `git tag -a vX.Y.Z -m "vX.Y.Z"`
- [ ] Version tag pushed: `git push origin vX.Y.Z`

## Release

- [ ] Create a GitHub Release for the tag
- [ ] Title: `vX.Y.Z` — short description
- [ ] Body: paste the relevant CHANGELOG.md section
- [ ] Attach any build artifacts if applicable

## Post-Release

- [ ] Verify the release is visible on GitHub
- [ ] Confirm `npm publish` (if publishing to npm registry)
- [ ] Update any downstream consumers or documentation
