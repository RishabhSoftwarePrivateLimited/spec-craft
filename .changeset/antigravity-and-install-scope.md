---
"@rspl/speccraft": minor
---

Add an **Antigravity (Gemini)** agent option and an **install-scope** prompt.

- New `antigravity` agent: installs `.agents/skills/` + `GEMINI.md`, since Antigravity only loads commands from `.agents/skills/` (it ignores `.gemini/commands/*.toml`). The existing Gemini option is now labelled **Gemini CLI**. Both options can be installed together; `GEMINI.md` is shared and never conflicts.
- New install-scope prompt — **Project** (default), **Global**, or **Both** — plus a `--scope project|global|both` flag. Global targets are `~/.claude/commands/`, `~/.gemini/commands/`, and `~/.agents/skills/`.
- **Behaviour change:** selecting Claude or Gemini no longer installs commands into your home directory automatically. Choose `Global` or `Both` (or pass `--scope both`) to keep the previous behaviour.
