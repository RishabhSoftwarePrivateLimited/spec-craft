# Setting Up a Brownfield Project

How to use the scaffolded SDD workflow on an existing codebase — one where real application code already exists (in `src-code-frontend/`/`src-code-backend/`, or at some other existing path). This is a summary; the full flow and command contracts ship with the scaffolded project itself at `README.md` → [Brownfield / Existing Codebase Path](../templates/core/README.md#brownfield--existing-codebase-path).

Starting from scratch instead? See [docs/greenfield-setup.md](greenfield-setup.md).

## Before the first workflow run

The greenfield "answer Layer Scope, lock the stack" steps are replaced, not skipped:

1. **Run onboarding** against the existing code:
   ```
   /speccraft.onboard [path]
   ```
   It asks Layer Scope interactively, scans the existing code, and proposes `ARCH-DECISIONS.md` content plus `rules/`/`skills/` content for your review. Nothing is locked until you respond `approved`.
2. **(Optional)** run a read-only health report on the existing code:
   ```
   /speccraft.tech-debt frontend
   /speccraft.tech-debt backend
   ```
   Reports outdated dependencies, deprecated patterns, and test gaps. Informational only — it doesn't block anything downstream.
3. **Drop in the first business spec** at `spec/business/<module>/<STORY-ID>.md`, same as the greenfield path.

`/speccraft.scaffold` will (correctly) refuse to run for a layer whose code root already exists — onboarding does not hand off into scaffolding.

## Running the workflow

Once onboarding is approved, the rest is identical to a greenfield project:

```
/speccraft.orchestrate spec/business/<module>/<STORY-ID>.md
```

See the scaffolded project's own `README.md` for the full command reference, stage-by-stage walkthrough, and workflow diagram.
