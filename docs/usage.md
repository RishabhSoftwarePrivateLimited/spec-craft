# Usage

## Commands

```
npx @rspl/speccraft                                    # fully interactive
npx @rspl/speccraft my-app                             # target dir preset, rest interactive
npx @rspl/speccraft my-app --agents claude,gemini      # skip the agent multi-select prompt
npx @rspl/speccraft my-app --agents claude --no-hooks  # skip the git-hook prompt, decline it
npx @rspl/speccraft my-app --agents claude --yes       # skip only the final write confirmation
npx @rspl/speccraft my-app --force                     # allow a non-empty target dir, overwrite conflicts
npx @rspl/speccraft@latest my-app                      # force-refresh past npx's version cache
```

## Flags

| Flag | Effect |
|---|---|
| `--agents <list>` | Comma-separated subset of `claude`, `gemini`, `copilot`, `agentic`. Skips the multi-select prompt. |
| `--no-hooks` | Declines the git pre-commit hook install without asking. |
| `--yes` / `-y` | Skips only the final "about to write, proceed?" confirmation — the write summary is still printed first. Every other still-unanswered prompt (target dir, agents, hooks) is still asked; combine with the flags above for a fully non-interactive run (needed in CI or scripts, since there's no TTY to prompt against). |
| `--force` | Allows scaffolding into a non-empty target directory, and allows overwriting individual conflicting files/dirs that already exist there. Without it, any such conflict aborts the run before anything is written. |

## What each prompt collects

Mirrors [setup.md](setup.md)'s walkthrough — this is the one page that answers "what will it ask me":

1. **Target directory** — a path, or `.` for the current directory.
2. **Agent tooling** (multi-select) — any of `claude` / `gemini` / `copilot` / `agentic`, independently toggleable.
3. **Git hook** (yes/no) — only asked if the target is already a git repo.
4. **Final confirm** (yes/no) — shows every path about to be written, plus what (if anything) installs globally.

## Global (user-level) install

Selecting `claude` and/or `gemini` in step 2 does two things in the same run, not two separate steps:

- Project-level: `.claude/` + `CLAUDE.md` (or `.gemini/` + `GEMINI.md`) into the target directory.
- Global: the same 12 command files, copied to `~/.claude/commands/` (or `~/.gemini/commands/`) — cross-platform via `os.homedir()`, e.g. `C:\Users\<you>\.claude\commands` on Windows.

The global copy is **merge, never clobber**: a file is only written if nothing with that name already exists at the global path. An existing file — e.g. your own custom `~/.claude/commands/speccraft.scaffold.md` — is left completely untouched, and the tool prints a "skipped, already exists" line for it. Pass `--force` if you deliberately want to overwrite it.

Only `CLAUDE.md`/`GEMINI.md`'s **commands** are ever installed globally — the memory files themselves (`CLAUDE.md`, `GEMINI.md`) are personal and are never written outside the target project. Copilot and the agent-agnostic `.agents/` layer have no equivalent user-level directory, so global install is only ever attempted for Claude/Gemini.

This does **not** create any kind of filesystem cache. Anthropic/Gemini prompt caching (see the target project's own `CLAUDE.md`) is a per-request API concern, unrelated to files on disk — what this step actually gives you is command/skill **availability across every project on your machine**, not caching. The final confirm summary calls this distinction out explicitly so it's never a silent surprise.

## Non-interactive / CI usage

```
npx @rspl/speccraft ./out --agents claude --no-hooks --yes --force
```

is fully non-interactive: no TTY is required, nothing prompts, and the run either succeeds or exits non-zero with a clear error.
