# Command Reference

The same 12 SDD workflow commands ship in 4 formats — one per agent. Selecting an agent in the install prompt installs its column below (project-level, plus the global copy for Claude/Gemini — see [usage.md](usage.md#global-user-level-install)).

| Command | Contract (always installed, `spec/commands/`) | Claude (`.claude/commands/`) | Gemini (`.gemini/commands/`) | Copilot (`.github/prompts/`) |
|---|---|---|---|---|
| `/speccraft.tech-design` | `speccraft.tech-design.md` | `speccraft.tech-design.md` | `speccraft.tech-design.toml` | `speccraft.tech-design.prompt.md` |
| `/speccraft.decompose` | `speccraft.decompose.md` | `speccraft.decompose.md` | `speccraft.decompose.toml` | `speccraft.decompose.prompt.md` |
| `/speccraft.scaffold` | `speccraft.scaffold.md` | `speccraft.scaffold.md` | `speccraft.scaffold.toml` | `speccraft.scaffold.prompt.md` |
| `/speccraft.implement` | `speccraft.implement.md` | `speccraft.implement.md` | `speccraft.implement.toml` | `speccraft.implement.prompt.md` |
| `/speccraft.unit-test` | `speccraft.unit-test.md` | `speccraft.unit-test.md` | `speccraft.unit-test.toml` | `speccraft.unit-test.prompt.md` |
| `/speccraft.integration-test` | `speccraft.integration-test.md` | `speccraft.integration-test.md` | `speccraft.integration-test.toml` | `speccraft.integration-test.prompt.md` |
| `/speccraft.validate` | `speccraft.validate.md` | `speccraft.validate.md` | `speccraft.validate.toml` | `speccraft.validate.prompt.md` |
| `/speccraft.change` | `speccraft.change.md` | `speccraft.change.md` | `speccraft.change.toml` | `speccraft.change.prompt.md` |
| `/speccraft.sync-swagger` | `speccraft.sync-swagger.md` | `speccraft.sync-swagger.md` | `speccraft.sync-swagger.toml` | `speccraft.sync-swagger.prompt.md` |
| `/speccraft.orchestrate` | `speccraft.orchestrate.md` | `speccraft.orchestrate.md` | `speccraft.orchestrate.toml` | `speccraft.orchestrate.prompt.md` |
| `/speccraft.onboard` | `speccraft.onboard.md` | `speccraft.onboard.md` | `speccraft.onboard.toml` | `speccraft.onboard.prompt.md` |
| `/speccraft.tech-debt` | `speccraft.tech-debt.md` | `speccraft.tech-debt.md` | `speccraft.tech-debt.toml` | `speccraft.tech-debt.prompt.md` |

`spec/commands/*.md` is the agent-agnostic contract — the authoritative description of what each command does. The per-agent files are thin wrappers around it in that agent's native format; see each project's own `spec/AGENTS.md` for the read order.

The **Agent-agnostic** option (`.agents/skills/`) ships the same 12 as reusable skill definitions, one subfolder per command, for any agent tooling without a dedicated column above.

`/speccraft.orchestrate` also supports an unattended **auto mode** — `/speccraft.orchestrate auto <business-spec-file>` runs the full 13-stage workflow with no human-approval pauses at any gate; the agent reviews its own work at every stage and logs every decision (including how it resolved any `blocked` conflict) for after-the-fact audit. See `spec/commands/speccraft.orchestrate.md` § Auto Mode for exactly how review, revision, and blocked handling work without a human in the loop.
