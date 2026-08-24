# Examples

Two kinds of content live here: static install-selection trees (below) and two fully-built, runnable live demos.

## Live Demos

Real generated `spec/`, real application code, every stage gate actually reviewed by a human — not mockups. See root `README.md` §Live Examples for the short version.

- **[`greenfield-demo/`](greenfield-demo/)** — a brand-new project, stack locked from a blank `ARCH-DECISIONS.md`, one story (a task tracker: create + list tasks) built start to finish through every workflow stage. Start at [`greenfield-demo/WALKTHROUGH.md`](greenfield-demo/WALKTHROUGH.md).
- **[`brownfield-demo/`](brownfield-demo/)** — a synthetic "legacy" app (the same task-tracker shape, pre-existing with no `spec/`) onboarded via `/speccraft.onboard`, then extended with a new story ("mark a task complete") built against the discovered stack and conventions. Start at [`brownfield-demo/WALKTHROUGH.md`](brownfield-demo/WALKTHROUGH.md).

Each demo is a real npm project — `npm install && npm run dev`/`npm test` inside its `src-code-frontend/`/`src-code-backend/` folders. See each demo's own `WALKTHROUGH.md` for known environment gaps before running (`greenfield-demo` has none; `brownfield-demo`'s backend has a deliberately-left tooling gap, documented in its `WALKTHROUGH.md` §5).

## Static Install-Selection Trees

Pre-rendered output trees for two common install selections, for docs/README reference only — not meant to be used as a starting point directly (run `npx @rspl/speccraft` for that).

- `claude-only/` — target dir after selecting only **Claude**, no git hooks.
- `all-agents/` — target dir after selecting all four agent options plus the git pre-commit hook.

Each folder's `TREE.txt` is the rendered file tree at generation time.

### Regenerating

```
npm run build:examples
```

Runs `scripts/build-examples.js`, which calls the same `src/copy.js` engine the CLI uses (not hand-copied), against scratch directories, then copies the result here. Re-run this after any change to `templates/` or `src/manifest.js` so these stay accurate. This script only touches `claude-only/` and `all-agents/` — it does not regenerate or affect `greenfield-demo/`/`brownfield-demo/`, which are hand-built, hand-run live projects, not scripted output.
