# TASK-TRACKER-001 — Create And List Tasks

## 1. Summary

Delivers goals G1 and G2 from `spec/business/tasks/BRD.md`: a user can record a new task with a
short title, and see every task recorded so far, most-recently-created first.

## 2. Scope

**In scope:**
- A form to create a task with a single required `title` field.
- A list showing every task created so far, newest first.
- The list reflects a newly created task without a manual page reload.

**Out of scope:**
- Editing or deleting a task.
- Marking a task complete.
- Any authentication, per-user ownership, or persistence beyond the running server process.

## 3. Requirements

| REQ-ID | Description | Notes |
|---|---|---|
| REQ-TASK-TRACKER-001-01 | A user can submit a non-empty title to create a new task. | Whitespace-only titles are not valid — see AC-03. |
| REQ-TASK-TRACKER-001-02 | A newly created task is assigned a unique identifier and a creation timestamp. | Server-assigned, not user-supplied. |
| REQ-TASK-TRACKER-001-03 | A user can view every task created so far. | Ordered most-recently-created first. |
| REQ-TASK-TRACKER-001-04 | The task list reflects a newly created task immediately, without a manual page reload. | Frontend re-fetches or appends after a successful create. |

## 4. Acceptance Criteria

| AC-ID | REQ-ID | Given / When / Then | Notes |
|---|---|---|---|
| AC-TASK-TRACKER-001-01 | REQ-TASK-TRACKER-001-01 | Given the task form, When the user enters a title and submits, Then a new task is created with that title. | |
| AC-TASK-TRACKER-001-02 | REQ-TASK-TRACKER-001-02 | Given a task was just created, When the create response returns, Then it includes a unique `id` and a `createdAt` timestamp. | |
| AC-TASK-TRACKER-001-03 | REQ-TASK-TRACKER-001-03 | Given one or more tasks exist, When the task list loads, Then every task is shown, ordered most-recently-created first. | |
| AC-TASK-TRACKER-001-04 | REQ-TASK-TRACKER-001-04 | Given the task list is visible, When a new task is created successfully, Then it appears at the top of the list without the user reloading the page. | |
| AC-TASK-TRACKER-001-05 | REQ-TASK-TRACKER-001-01 | Given the task form, When the user submits an empty or whitespace-only title, Then no task is created and a validation message is shown. | |

## 5. Edge Cases

- Submitting an empty or whitespace-only title (see AC-05) — rejected client-side and
  server-side (server is the source of truth; client validation is a convenience, not the only
  gate).
- No tasks exist yet — the list shows an empty state, not an error.
- Rapid double-submit of the create form — must not create two tasks from one user action
  (implementation detail: disable the submit control while the request is in flight).

## 6. Dependencies

- **Depends On:** `None`
- **External systems / data / APIs this story relies on:** none — self-contained, in-memory
  backend per `AD-BACKEND-002` in `spec/architecture/ARCH-DECISIONS.md`.

## 7. Non-Functional Notes (optional)

Not specified — this demo has no NFR gate (`spec/architecture/NFR-SUMMARY.md` is not populated
for this project).

## 8. Open Questions

- None at intake time.
