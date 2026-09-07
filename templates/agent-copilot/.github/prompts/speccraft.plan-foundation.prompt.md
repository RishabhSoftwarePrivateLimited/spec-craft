---
description: Bootstrap a greenfield project's architecture foundation from a business spec and a stated tech stack.
mode: agent
---
Read `spec/commands/speccraft.plan-foundation.md`, `spec/AGENTS.md`, and `spec/architecture/README.md` in full, then bootstrap this greenfield project's architecture foundation from the input.

Input: ${input:arguments:business spec file path, then a quoted tech stack description, e.g. spec/business/checkout/STORY-042.md "React + Vite frontend, Node/Express backend, Postgres via Prisma, REST API"}

Rules before starting:
- confirm no real application code already exists for the layer(s) this BRD likely touches — if it does, stop and point to `/speccraft.onboard [path]` instead
- confirm `spec/architecture/ARCH-DECISIONS.md` does not already have real `AD-FRONTEND-*`/`AD-BACKEND-*` content — if it does, stop and point to a manual edit; this command does not re-lock an already-populated file
- confirm both arguments are present — do not draft from the BRD alone if the stack description is missing
- read the business spec and draft a Layer Scope recommendation (`frontend`/`backend`/`both`) with one line of rationale — never silently apply it, present for confirmation
- draft Tier 1 rows (`AD-FRONTEND-*`/`AD-BACKEND-*`/`AD-X-*`) with a `Source` column (`BRD` / `stated-stack` / `stack-convention`), Tier 2 `rules`/`skills` seed content staged under `spec/architecture/rules-seed/<layer>/`, Tier 3 fill-in of `spec/commands/speccraft.scaffold.md`'s placeholder sections, and Tier 4 supporting architecture spec files (only where the stated stack/Tier 1 decisions actually imply structure worth documenting)
- for a required Tier 1 field the stack description never names, always draft a value (never skip it) per the Unstated-Field Rule: use the sibling layer's stated value for the same field if this is a full-stack description, else the stack's paired idiomatic default, else the minimal/no-dependency peer, else the most widely-adopted peer — tag it `stack-convention` either way so it's flagged for review; reserve `blocked: [reason]` for genuine self-contradiction only (the description asserts two mutually exclusive values for the same field), never for a field it simply didn't mention
- present Layer Scope + all four tiers together for one combined review; only write on `approved` — respond `approved` / `revise: [reason]` / `blocked: [reason]`
- report the minimal handoff block from `spec/commands/speccraft.plan-foundation.md`, then STOP — do not chain into `/speccraft.scaffold` or any planning stage; no traceability/progress file is written by this command

The canonical contract documents the full `/speccraft.plan-foundation <business-spec-file> "<tech stack description>"` signature and the exact `Source` column and staging-folder conventions.
