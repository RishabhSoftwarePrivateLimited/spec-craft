# Copilot / Codex Instructions

This file bootstraps GitHub Copilot, Codex, and any model accessed via GitHub Copilot Chat into the AI agentic full-stack delivery workflow.

---

## Repository Purpose

Spec-driven AI agentic full-stack delivery boilerplate. Populate `spec/business/` and `spec/architecture/` with this project's specifics before starting work.

Three root directories that matter:
- `spec/` — all workflow governance, architecture, requirements, LLD (two linked LLDs per story), tasks (Layer-tagged), traceability (source of truth)
- `src-code-frontend/` — deployable frontend project (created by `speccraft.scaffold frontend`, per the frontend stack locked in `spec/architecture/`; may not exist yet)
- `src-code-backend/` — deployable backend project (created by `speccraft.scaffold backend`, per the backend stack locked in `spec/architecture/`; may not exist yet)

These are two independent code roots, not one shared `src-code/`. A task's `Layer: frontend|backend` field determines which root an agent works in.

---

## Cache Version Check

Before any work: read `spec/SPEC-VERSION.md`. Note `current` version.
If version changed since last session → reload all mandatory spec files.
If unchanged → cached spec content still valid.

**Codex / OpenAI / GitHub Copilot:** Prompt caching is automatic for inputs > 1,024 tokens.
No explicit action needed — prefix cache applies automatically. On spec content change,
cache auto-invalidates (new content = new cache key).

---

## Always Read Before Doing Any Work

```
spec/SPEC-VERSION.md
spec/SPEC-FOLDER-STRUCTURE.md
spec/AGENTS.md
spec/WORKFLOW-OVERVIEW.md
spec/workflows/shared/SHARED-POLICIES.md
```

If execution implementation is active, also read `spec/init.md`, then identify the task's `Layer` before reading further arch/rules content.

---

## Command Contracts

Every command has a full contract document. Read the contract before executing.

| Command | Contract Location |
|---------|------------------|
| `speccraft.orchestrate <spec-file>` | `spec/commands/speccraft.orchestrate.md` |
| `speccraft.tech-design <spec-file>` | `spec/commands/speccraft.tech-design.md` — produces `LLD-FRONTEND-<id>.md` + `LLD-BACKEND-<id>.md` |
| `speccraft.decompose <lld-fe-file> <lld-be-file>` | `spec/commands/speccraft.decompose.md` — dual-LLD input, Layer-tagged output |
| `speccraft.scaffold frontend\|backend` | `spec/commands/speccraft.scaffold.md` |
| `speccraft.implement <task-file>` | `spec/commands/speccraft.implement.md` — routed by task `Layer` |
| `speccraft.unit-test <task-file>` | `spec/commands/speccraft.unit-test.md` — routed by task `Layer` |
| `speccraft.integration-test <task-id>` | `spec/commands/speccraft.integration-test.md` — backend-tagged tasks only |
| `speccraft.validate <task-id>` | `spec/commands/speccraft.validate.md` — 4-link (frontend) / 5-link (backend) chain |
| `speccraft.change <CR-file> <story-id>` | `spec/commands/speccraft.change.md` — alternate planning entry, replaces stages 1-5, atomic cascade to forward-reachable dependents |
| `speccraft.sync-swagger <module>` | `spec/commands/speccraft.sync-swagger.md` — optional, human-triggered only; never part of `speccraft.orchestrate` |
| `speccraft.onboard [path]` | `spec/commands/speccraft.onboard.md` — brownfield-only, asks Layer Scope interactively, proposes ARCH-DECISIONS.md (Tier 1) + rules/skills (Tier 2) for review |
| `speccraft.tech-debt frontend\|backend` | `spec/commands/speccraft.tech-debt.md` — optional, human-triggered only; never part of `speccraft.orchestrate` |

---

## Non-Negotiable Rules

### Stop At Every Review Gate

This workflow spans multiple conversation turns. Do not chain stages in one response.

After producing the LLD pair: stop, output handoff, wait for human approval (covers both LLDs).
After producing tasks: stop, output handoff, wait for human approval.
After implementing: stop, output handoff, wait for human approval.
After generating unit tests: stop, output handoff, wait for human approval.
After generating integration tests (backend only): stop, output handoff, wait for human approval.

### No Self-Approval

You cannot approve artifacts you just produced.
`approved` = explicit human text in the next message only.

### Phase Boundaries

execution does not begin until planning is human-approved.
Implementation does not begin until decomposition is approved.

### API Types Are Generated

Never hand-write API request/response types.
Run `openapi-typescript` (or the project's equivalent generator) against `contracts/<module>/<module>.yaml` to generate into `src-code-frontend/src/types/api/` for frontend consumers, and into `src-code-backend/`'s equivalent generated-types location for backend handlers.
`contracts/<module>/<module>.yaml` is populated by backend `/speccraft.implement`, optionally pre-populated or refreshed by hand or via the human-triggered `/speccraft.sync-swagger` command — codegen commands themselves never fetch from a URL directly, only ever read the on-disk YAML file.
See `src-code-frontend/rules/` or `src-code-backend/rules/` for this project's data-fetching/data-access rule, once added (doesn't exist until that layer's `/speccraft.scaffold` runs — see root `README.md` §Before You Start step 5).

### Code Location

All implementation code goes into `src-code-frontend/` or `src-code-backend/`, per the task's `Layer`. Never mix code into `spec/`, and never cross-write one layer's code into the other's root.

---

## Stack (Locked — Do Not Override)

`spec/architecture/` is currently empty. Once each layer's stack is locked, record it in
`spec/architecture/ARCH-DECISIONS.md` (`AD-FRONTEND-*` / `AD-BACKEND-*` / `AD-X-*`) and `CLAUDE.md` — CLAUDE.md overrides architecture spec files on any stack decision.

---

## Progress And Traceability

Update during execution, not at the end:

- `spec/traceability/<module>/<STORY-ID>/TRACEABILITY.md` — one shard per story (not two), holds business-to-LLD, LLD-to-task, task-to-code, code-to-unit-test, and (backend rows only) unit-test-to-integration-test mappings, plus workflow metrics and conflict decisions, with a `Layer` column showing both chains together
- `spec/progress/` — one file per story, `spec/progress/<module>/progress-<STORY-ID>.md`, with a `## <Stage>` section per stage (per-task stages nest under `## Task: TASK-<id>`)

---

## Security Baseline

OWASP ASVS Level 2. India data residency. DPDP compliance.
No PII in localStorage, URL params, logs, or error responses.
Auth/session tokens issued as httpOnly cookies or short-lived signed tokens only.
If this project populated `spec/architecture/NFR-SUMMARY.md` (optional, empty by default), check its Security category too; otherwise rely on `src-code-frontend/rules/` / `src-code-backend/rules/` for full rules.

---

## When In Doubt

`spec/` documents win over this file. `CLAUDE.md` wins on stack decisions.
Escalate to human rather than self-approving a conflict resolution.
