# BRD — Task Tracker (Extension)

## Background / Problem

This project's `tasks` feature — create a task, list tasks — already exists as real, running code. It was **not** built through this workflow: it was discovered and documented by `/speccraft.onboard` (see `spec/architecture/ARCH-DECISIONS.md` §Agent Delta — Onboarding Provenance, `spec/architecture/FRONTEND-STRUCTURE.md`, `spec/architecture/BACKEND-STRUCTURE.md`). This BRD is an **extension BRD**: it does not re-specify what already exists — it specifies one new capability to add on top of it, exercising the brownfield path end to end (`/speccraft.onboard` already ran; this is the first feature-delivery story to run afterward).

## Already Delivered (pre-existing, not this workflow's output)

- **G1** — A user can record a new task with a short title. (`src-code-frontend/src/components/TaskForm.tsx`, `src-code-backend/src/services/tasks.service.ts`)
- **G2** — A user can see every task recorded so far, most-recently-created first. (`src-code-frontend/src/components/TaskList.tsx`, `src-code-backend/src/repositories/tasks.repository.ts`)

Do not re-decompose or re-implement G1/G2 — they are existing, working behavior. Any story touching them is a change to existing behavior, not new delivery.

## New Goal (this BRD, story `TASK-TRACKER-002`)

- **G3** — Let a user mark an existing task complete, and back to incomplete, and see which tasks are completed at a glance.

## Scope

**In scope (this BRD, story `TASK-TRACKER-002`):**
- Toggling a task's completion state (incomplete → complete, and complete → incomplete).
- Visually distinguishing completed tasks in the existing list view.

**Out of scope (this BRD):**
- Deleting a task, editing a task's title.
- Re-sorting or filtering the list by completion state — list order stays exactly as G2 already delivers it (newest-first, unaffected by completion state).
- Multi-user accounts, auth, or per-user task ownership (unchanged from the existing app — see `AD-FRONTEND-005`/`AD-BACKEND-003`).
- Persistence across server restarts (unchanged — the backend store is in-memory by design, `AD-BACKEND-002`).

## Stakeholders

- **Product:** demo maintainer (this repository).
- **Engineering:** frontend + backend implementers, via `/speccraft.orchestrate` (or its constituent stage commands), following the conventions discovered by `/speccraft.onboard` in `src-code-frontend/rules/`+`skills/` and `src-code-backend/rules/`+`skills/`.

## Success Metrics

- A user can toggle a task's completion state from the UI and see the change reflected immediately, with no manual page reload.
- The change is consistent with the existing app's conventions — same layering, same testing approach, same styling pattern — not a parallel implementation style.

## Related

- `spec/business/tasks/TASK-TRACKER-002.md` — the story delivering G3, the only story under this BRD so far.
- `spec/architecture/ARCH-DECISIONS.md` — locked (discovered) stack this story is implemented against.
- `spec/architecture/FRONTEND-STRUCTURE.md`, `spec/architecture/BACKEND-STRUCTURE.md` — discovered module boundaries/layering this story must extend, not bypass.
