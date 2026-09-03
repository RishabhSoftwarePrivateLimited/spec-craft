---
"@rspl/speccraft": minor
---

Add an `auto` mode to `/speccraft.orchestrate` (`/speccraft.orchestrate auto <business-spec-file>`) that runs the full 13-stage workflow unattended: the agent reviews its own work at every stage gate, revises within a bounded retry count, and resolves `blocked` outcomes itself (logged with `Decided By = auto-mode-ai`) instead of pausing for a human — with a final consolidated handoff for after-the-fact audit. Updated across the canonical command contract, `SHARED-POLICIES.md`, all four per-agent command wrappers, `docs/command-reference.md`, and `README.md`.
