# FAQ

**Does this install anything globally without me knowing?**
Only if you select Claude and/or Gemini in the agent prompt — and even then, only that agent's command files, only to `~/.claude/commands/` or `~/.gemini/commands/`, and the final confirm screen lists exactly what will land there before anything is written. See [usage.md](usage.md#global-user-level-install).

**Will it overwrite my existing files?**
No, not by default. Any conflicting path aborts the whole run before anything is written. Pass `--force` if you want it to overwrite.

**What happens to my existing `.gitignore`?**
It's never overwritten. The tool appends a sentinel-delimited boilerplate block to the end of it (creating the file if it doesn't exist yet). Running the tool again against the same target detects the sentinel and skips — it won't duplicate the block.

**Can I run it without answering any prompts (CI, scripts)?**
Yes — `--agents <list> --no-hooks --yes --force` is fully non-interactive. See [usage.md](usage.md#non-interactive--ci-usage).

**Do I need git?**
Only for the pre-commit hook step, which is skipped automatically if the target isn't a git repository yet. Everything else works without git.

**Why isn't Copilot's directory called `.copilot`?**
It mirrors GitHub Copilot's own convention: `.github/copilot-instructions.md` + `.github/prompts/*.prompt.md`. The installer doesn't invent a new location for it.

**What's the `.agents/skills/` (agent-agnostic) option for?**
It's a plain, non-agent-specific set of skill definitions meant to work with any agent tooling, including ones this installer doesn't have a dedicated integration for.

**I ran it twice by accident against the same directory — is that safe?**
Yes. The installer detects `spec/` and already-installed agents and skips re-copying them, so a second run just adds whatever wasn't there yet — and `.gitignore` merges idempotently regardless. Explicitly re-requesting an already-installed agent via `--agents` still aborts on conflict unless you pass `--force`.

**Where do I report a bug or ask a question?**
See `SUPPORT.md` at the repo root — bugs vs. questions go to different places.
