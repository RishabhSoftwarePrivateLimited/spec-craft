# Architecture

For contributors working on the tool itself, not on projects it scaffolds.

## Pieces

```
bin/speccraft.js       shebang entry point → requires src/index
src/index.js           orchestrator: parse argv → prompt → resolve plan → copy → post-steps
src/prompts.js         @clack/prompts question defs + the pre-flight non-empty-dir check
src/manifest.js         declarative map: answer key -> template group -> what gets copied
src/copy.js             copy engine: conflict detection, .gitignore merge, SPEC-VERSION stamping
src/postSteps.js        git core.hooksPath wiring + global (home-dir) command install
templates/              everything under here is copied INTO the target project, unmodified
```

## Manifest-driven copying

`src/manifest.js` is the single source of truth for "what does selecting X copy":

```js
module.exports = {
  core:     { templateGroup: 'core',          dirs: ['spec'], files: ['AGENTS.md', 'README.md'], mergeGitignore: true },
  claude:   { templateGroup: 'agent-claude',   dirs: ['.claude'], files: ['CLAUDE.md'], global: { templateDir: '.claude/commands', targetDir: '.claude/commands' } },
  gemini:   { templateGroup: 'agent-gemini',   dirs: ['.gemini'], files: ['GEMINI.md'], global: { templateDir: '.gemini/commands', targetDir: '.gemini/commands' } },
  copilot:  { templateGroup: 'agent-copilot',  dirs: ['.github'] },
  agentic:  { templateGroup: 'agent-agnostic', dirs: ['.agents'] },
  gitHooks: { templateGroup: 'git-hooks',      dirs: ['.githooks'], postStep: 'configureHooksPath' },
}
```

`src/index.js` always includes `core`; includes `claude`/`gemini`/`copilot`/`agentic` only if the user selected them; includes `gitHooks` only if the hook prompt was confirmed. Nothing else in the codebase branches on agent name — adding a fifth agent means adding one manifest entry and one `templates/agent-<name>/` folder.

## Copy engine rules (`src/copy.js`)

- Plain files/dirs (commands, skills, `CLAUDE.md`, `GEMINI.md`, etc.): copied verbatim. `findConflicts()` runs a pre-flight pass over every path the current selection would touch; if any already exists in the target and `--force` wasn't passed, nothing is written and a `ConflictError` listing every conflict is thrown. This is deliberately separate from `prompts.js`'s coarser `isNonEmptyDir()` check: that one only guards the interactive CLI's `resolveTargetDir` step, so `findConflicts` is what makes `copySelected()` itself safe to call directly — which `test/copy.test.js` and `scripts/build-examples.js` both do, bypassing `prompts.js` entirely.
- `.gitignore` is the one special case: never a conflict, always merged. The template ships with `# --- SDD boilerplate ---` / `# --- end SDD boilerplate ---` sentinel comments around its content. If the target has no `.gitignore`, the template is written as-is. If it does, the sentinel block is appended once — a second run detects the existing sentinel and no-ops, so re-running the tool is idempotent.
- `spec/SPEC-VERSION.md`'s `current:` line is stamped with the tool's own `package.json` version at copy time, so a scaffolded project always knows which template snapshot it got.
- `.githooks/pre-commit` wiring (`git config core.hooksPath .githooks`) happens in `postSteps.configureHooksPath`, called from `index.js` only after the copy succeeds and only if the hook group was selected.

## Global install (`src/postSteps.installGlobal`)

Per-agent, not per-file-group: reads every file in `templates/agent-<name>/.<name>/commands/`, and for each one, copies it to `~/.{name}/commands/<file>` only if nothing already exists there. `os.homedir()` is not injectable, so tests that exercise this function set `process.env.HOME`/`process.env.USERPROFILE` before calling it and restore them after — see `test/copy.test.js`.

## Why no branching copy.js

Earlier drafts of this tool considered a `switch` on agent name inside the copy engine. It was dropped in favor of the manifest because every agent's copy behavior is identical (verbatim dir + file copy, optional global-install sidecar) — the only thing that varies is *which* paths, which is exactly what a declarative map is for. If a future agent needs genuinely different copy behavior (not just different paths), that's the signal to add a per-group hook rather than reintroducing branching.
