# Setting Up a Greenfield Project

How to use the scaffolded SDD workflow on a brand-new project — one where no application code exists yet and the stack hasn't been chosen. This is a summary; the full step-by-step table ships with the scaffolded project itself at `README.md` → [Before You Start — New Project Setup](../templates/core/README.md#before-you-start--new-project-setup).

Onboarding an existing codebase instead? See [docs/brownfield-setup.md](brownfield-setup.md).

## Before the first workflow run

One-time setup, done once per project, before the first `/speccraft.orchestrate` or `/speccraft.tech-design` call:

1. **Answer Layer Scope** — does this project need frontend only, backend only, or both? Recorded in `spec/architecture/ARCH-DECISIONS.md`.
2. **Lock the stack(s)** for the layer(s) in scope (framework, data layer, auth, testing, etc.) in `spec/architecture/ARCH-DECISIONS.md`.
3. **Fill in the scaffold contract** — install commands, folder structure, env vars — in `spec/commands/speccraft.scaffold.md`.
4. **(Optional)** add NFR enforcement in `spec/architecture/NFR-SUMMARY.md` if this project wants a hard perf/security/compliance gate.
5. **Drop in the first business spec** at `spec/business/<module>/<STORY-ID>.md`.

## Running the workflow

```
/speccraft.orchestrate spec/business/<module>/<STORY-ID>.md
```

This chains every stage — LLD creation, review, decomposition, review, scaffold, implementation, tests, validation — for whichever layer(s) are in scope, stopping at every human review gate. `/speccraft.scaffold frontend` and/or `/speccraft.scaffold backend` create the code root(s) the first time they're needed, once the stack is locked.

See the scaffolded project's own `README.md` for the full command reference, stage-by-stage walkthrough, and workflow diagram.
