# Command Reference

The same 13 SDD workflow commands ship in 4 formats — one per agent. Selecting an agent in the install prompt installs its column below (project-level, plus the global copy for Claude/Gemini — see [usage.md](usage.md#global-user-level-install)).

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
| `/speccraft.plan-foundation` | `speccraft.plan-foundation.md` | `speccraft.plan-foundation.md` | `speccraft.plan-foundation.toml` | `speccraft.plan-foundation.prompt.md` |
| `/speccraft.tech-debt` | `speccraft.tech-debt.md` | `speccraft.tech-debt.md` | `speccraft.tech-debt.toml` | `speccraft.tech-debt.prompt.md` |

`spec/commands/*.md` is the agent-agnostic contract — the authoritative description of what each command does. The per-agent files are thin wrappers around it in that agent's native format; see each project's own `spec/AGENTS.md` for the read order.

The **Agent-agnostic** option (`.agents/skills/`) ships the same 13 as reusable skill definitions, one subfolder per command, for any agent tooling without a dedicated column above.

`/speccraft.orchestrate` also supports an unattended **auto mode** — `/speccraft.orchestrate auto <business-spec-file>` runs the full 13-stage workflow with no human-approval pauses at any gate; the agent reviews its own work at every stage and logs every decision (including how it resolved any `blocked` conflict) for after-the-fact audit. See `spec/commands/speccraft.orchestrate.md` § Auto Mode for exactly how review, revision, and blocked handling work without a human in the loop.

`/speccraft.plan-foundation` supports the same idea at its one review gate — `/speccraft.plan-foundation auto <business-spec-file> "<tech stack description>"` drafts and writes the greenfield architecture foundation unattended: the agent clears its own combined review gate, resolves an `unclear` Layer Scope deterministically, and resolves a contradictory stack description by tagging the row `Source: auto-mode-resolved` with a logged reason, instead of pausing for a human. See `spec/commands/speccraft.plan-foundation.md` § Auto Mode.

Every stage command `/speccraft.orchestrate` chains through also supports the same standalone `auto` form, and its own `## Auto Mode` section governs both a direct `auto` invocation and an `/speccraft.orchestrate auto` invocation of that stage — orchestrate's override text no longer needs to (and does not) reach into these commands separately:

- `/speccraft.tech-design auto <business-spec-file>` — see `spec/commands/speccraft.tech-design.md` § Auto Mode
- `/speccraft.decompose auto <lld-fe-file> <lld-be-file>` / `/speccraft.decompose auto <lld-file>` — see `spec/commands/speccraft.decompose.md` § Auto Mode
- `/speccraft.implement auto <task-id>` — see `spec/commands/speccraft.implement.md` § Auto Mode
- `/speccraft.unit-test auto <task-id>` — see `spec/commands/speccraft.unit-test.md` § Auto Mode
- `/speccraft.integration-test auto <task-id>` — see `spec/commands/speccraft.integration-test.md` § Auto Mode
- `/speccraft.validate auto <task-id>` — see `spec/commands/speccraft.validate.md` § Auto Mode (no `revise` outcome; a `blocked` gap is logged and the run continues rather than pausing)

In every case, auto mode only removes the pause at that command's own review gate — it does not chain into the next command. Chaining across commands remains exclusively `/speccraft.orchestrate`'s responsibility, in both interactive and auto mode.
