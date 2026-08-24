# Troubleshooting

One entry per known failure mode: symptom → cause → fix.

**"Target directory not empty"**
Ran against an existing non-empty folder without `--force`.
Fix: pick an empty directory, or pass `--force` (this may overwrite conflicting files).

**`EACCES` / permission denied writing to `~/.claude`**
A Windows file lock (another Claude Code session has the file open) or restrictive ACLs.
Fix: close other sessions, or re-run as the file owner. The tool never needs elevation.

**Git hook step silently skipped**
The target isn't a git repository yet, or `git` isn't on `PATH`.
Fix: `git init` first, or install Git and re-run.

**`.githooks/pre-commit` not executing on Windows**
Windows has no POSIX exec bit; `core.hooksPath` still works via Git Bash/WSL's shebang handling, but hooks invoked from cmd.exe-only tooling may silently no-op.
Fix: ensure Git for Windows (not just the `git` binary) is installed.

**`npx` pulls a stale cached version**
`npx` caches by version range.
Fix: `npx @rspl/speccraft@latest` to force-refresh, or `npx clear-npx-cache`.

**Corporate proxy/registry blocks npm install**
`npx` can't reach the public registry.
Fix: point `.npmrc` / `NPM_CONFIG_REGISTRY` at your internal mirror before running.

**Command name collision during global install**
An existing `~/.claude/commands/<name>.md` differs from this tool's template.
Fix: this is by design — the tool skips + warns rather than overwriting (see `docs/usage.md#global-user-level-install`). Use `--force` only if you deliberately want to overwrite it.

**Old `rkit-*` command files left behind after upgrading to `speccraft.*`**
Global install is merge-only/never-clobber (see above) — re-running the installer after upgrading adds the new `speccraft.*` command files alongside any pre-existing `rkit-*` ones instead of replacing them, since they're different filenames.
Fix: manually delete the stale `rkit-*.md`/`.toml` files from `~/.claude/commands/` and/or `~/.gemini/commands/` (and from the project's own `.claude/commands/`/`.gemini/commands/` if re-scaffolding an existing project) once you've confirmed the `speccraft.*` versions are in place.

**`ERR_TTY_INIT_FAILED` / prompt hangs or errors with no TTY**
The tool's interactive prompts (`@clack/prompts`) need a real terminal. Running it from a script, CI job, or piped/redirected context without one will fail on the first unanswered prompt.
Fix: supply every answer as a flag instead of relying on the interactive prompt — `--agents <list> --no-hooks --yes --force` runs fully non-interactively (see `docs/usage.md#non-interactive--ci-usage`).

**Node version too old**
`engines.node >=18` not met.
Fix: upgrade Node — the tool hard-fails with a clear "unsupported Node version" message rather than a cryptic syntax error.

**`npm publish` 402/403 in the release workflow**
`NPM_TOKEN` is missing, expired, or has the wrong scope.
Fix: regenerate an automation token with publish rights, update the repo secret. See `docs/publishing.md`.
