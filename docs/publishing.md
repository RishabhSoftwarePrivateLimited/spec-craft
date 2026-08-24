# Publishing

The full planning doc (`PUBLISHING-PLAN.md`) is a maintainer-only working note kept out of the public repo — this page is the summary that ships alongside the source for maintainers.

## First-time manual publish

1. `npm login` (Rishabh Software Private Limited npm org account, 2FA required).
2. `npm publish --dry-run` — inspect exactly what tarball would ship (respects the `files` field in `package.json`), catch accidental inclusions.
3. `npm publish`. `package.json`'s `publishConfig.access: "public"` already covers the scoped-package access flag, and provenance is intentionally left off for local publishes — it can only be generated when publishing from a supported CI/CD environment.
4. Verify: `npm view @rspl/speccraft` and a real `npx @rspl/speccraft@latest` smoke test in a scratch directory.

## CI-driven automated releases

Not set up yet by choice — the full Changesets + `release.yml` flow, `NPM_TOKEN` setup/rotation, and
how `provenance: true` is satisfied automatically once publishing runs through that workflow instead
of manually, are documented in `ci-automation.md`, a maintainer-only working note kept out of the
public repo. Ask a maintainer for it if you're picking up this work.

> The GitHub org/repo is `RishabhSoftwarePrivateLimited/spec-craft`; `package.json` already points at it. `release.yml` doesn't exist yet (see CI-driven automated releases above) — point it at the same org/repo once it's added.
