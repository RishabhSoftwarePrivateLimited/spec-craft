# BRD — Task Tracker

## Background / Problem

Small teams tracking a handful of outstanding to-dos often fall back to chat threads or sticky
notes, with no shared, structured view of what's still open. This project delivers a minimal
shared task list — the smallest possible slice of "team task tracking" — as a live, runnable
demo of the `speccraft` greenfield workflow end-to-end.

## Goals

- **G1** — Let a user record a new task with a short title.
- **G2** — Let a user see every task recorded so far, most-recently-created first.

## Scope

**In scope (this BRD, story `TASK-TRACKER-001`):**
- Creating a task (title only).
- Listing all tasks.

**Out of scope (this BRD):**
- Editing or deleting a task.
- Marking a task complete — reserved for a follow-up story (see the brownfield demo's extension
  story, which extends this same shape).
- Multi-user accounts, auth, or per-user task ownership.
- Persistence across server restarts — the backend store is in-memory by design
  (`AD-BACKEND-002` in `spec/architecture/ARCH-DECISIONS.md`).

## Stakeholders

- **Product:** demo maintainer (this repository).
- **Engineering:** frontend + backend implementers, via `/speccraft.orchestrate` and its
  constituent stage commands.

## Success Metrics

- A user can create a task from the UI and see it appear in the list in the same session, with
  no manual page reload.
- `npm test` passes for both `src-code-frontend/` and `src-code-backend/` once scaffolded and
  implemented.

## Related

- `spec/business/tasks/TASK-TRACKER-001.md` — the story delivering G1 and G2, the only story
  under this BRD so far.
- `spec/architecture/ARCH-DECISIONS.md` — locked stack this story is implemented against.
