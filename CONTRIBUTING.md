# Contributing

## Setup

```
git clone <this repo>
cd speccraft
npm install
npm test
```

## Making a change

1. Branch off `main`.
2. Make your change. If it touches `src/` or `templates/`, add/update a test in `test/`.
3. Run `npm test` locally — CI (`.github/workflows/ci.yml`) runs the same suite across `{ubuntu, windows, macos} x node {18, 20, 22}`.
4. Add a changeset describing the change and its version bump:
   ```
   npx changeset
   ```
   Pick `patch` for fixes, `minor` for backwards-compatible features, `major` for breaking changes. This generates a file under `.changeset/` — commit it alongside your code change.
5. Open a PR. `CHANGELOG.md` is generated from changesets on merge — never hand-edit it.

## Adding a fifth agent

See `docs/architecture.md#manifest-driven-copying` — add one entry to `src/manifest.js` and one `templates/agent-<name>/` folder; no changes to `src/copy.js` should be needed if the new agent's install behavior is verbatim-copy-plus-optional-global-install like the existing four.

## Regenerating examples

```
npm run build:examples
```

See `examples/README.md`.
