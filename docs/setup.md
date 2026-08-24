# Setup

## Prerequisites

- Node.js ≥ 18 (`node -v`)
- Git — optional, only needed if you want the pre-commit hook step (step 3 below)

## First run

```
npx @rspl/speccraft my-app
```

Walks through, in order:

1. **Target directory** — skipped if `my-app` (or any path) was given as an argument; otherwise you're prompted for one. A non-empty directory no longer requires `--force` to scaffold into — the installer only refuses to overwrite an individual path (e.g. `.claude/`) that's already there, and `--force` is what opts into overwriting it.
2. **Agent tooling select** — pick one of `Claude`, `Gemini`, `Copilot`, `Agent-agnostic` (radio-style: arrow keys move the highlight, Enter confirms it, no Space needed). `Claude` is the default highlight. `spec/`, `AGENTS.md`, `README.md`, and `.gitignore` are never part of this prompt — they always install on a fresh target, since they're the actual product, not optional tooling. Re-running the installer in an already-scaffolded directory detects which agent(s) are installed and offers only the remaining ones — pass `--agents a,b` if you want more than one in a single run.
3. **Git pre-commit hook confirm** — defaults to yes. Skipped entirely if the target directory isn't a git repository yet, or if the hook is already installed.
4. **Spec update check** — on a re-run, if the target's `spec/SPEC-VERSION.md` was stamped from an older package version than the one you're running, you're offered a chance to refresh `spec/*` to the current version (this overwrites `spec/*`, so commit or back up any local edits first). Otherwise `spec/` is left untouched so adding another agent never clobbers it.
5. **Final confirm** — a summary of every path that's about to be written, plus (if you selected Claude and/or Gemini) exactly what lands in your home directory. Nothing is written until you confirm.

Selecting **Claude** or **Gemini** in step 2 also installs that agent's 12 commands to your **home directory** (`~/.claude/commands/` or `~/.gemini/commands/`) in the same run — see [Global (user-level) install](usage.md#global-user-level-install) in the usage doc for exactly what that means and how conflicts are handled.

## What you get

After confirming, the target directory has (at minimum) `spec/`, `AGENTS.md`, `README.md`, and `.gitignore`, plus whichever agent-specific folders you selected. This doc only covers the installer itself.

## One screenshot per step

`docs/screenshots/` is reserved for a terminal capture of each prompt above (see that folder's own README — not yet captured, needs a real interactive session). `examples/` has real (non-screenshot) resulting file trees for a couple of common selections today.
