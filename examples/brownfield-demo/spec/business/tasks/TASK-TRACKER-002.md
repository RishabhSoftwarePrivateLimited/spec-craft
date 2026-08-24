# TASK-TRACKER-002 — Mark A Task Complete

## 1. Summary

Delivers goal G3 from `spec/business/tasks/BRD.md`: a user can mark an existing task complete, and back to incomplete, and completed tasks are visually distinguished in the existing list view. Extends the pre-existing, onboarded `tasks` feature (create/list) rather than replacing any part of it.

## 2. Scope

**In scope:**
- Toggling a single task's completion state: incomplete → complete, and complete → incomplete.
- The existing task list visually distinguishes completed tasks from incomplete ones.

**Out of scope:**
- Deleting a task, editing a task's title.
- Re-sorting or filtering by completion state — list order is unaffected by this story (stays newest-first, per the existing G2 behavior).
- Any authentication, per-user ownership, or persistence beyond the running server process (unchanged from the existing app).

## 3. Requirements

| REQ-ID | Description | Notes |
|---|---|---|
| REQ-TASK-TRACKER-002-01 | A user can mark an existing incomplete task as complete. | |
| REQ-TASK-TRACKER-002-02 | A user can mark an existing completed task back as incomplete. | Toggle, not one-way. |
| REQ-TASK-TRACKER-002-03 | The task list visually distinguishes completed tasks from incomplete tasks. | Display-only concern; no new screen. |
| REQ-TASK-TRACKER-002-04 | Toggling a task's completion state does not change its position in the list. | List order remains exactly as delivered by G2 (newest-first) — this story must not introduce a re-sort. |

## 4. Acceptance Criteria

| AC-ID | REQ-ID | Given / When / Then | Notes |
|---|---|---|---|
| AC-TASK-TRACKER-002-01 | REQ-TASK-TRACKER-002-01 | Given an incomplete task in the list, When the user marks it complete, Then it is shown as completed, with no manual page reload. | |
| AC-TASK-TRACKER-002-02 | REQ-TASK-TRACKER-002-02 | Given a completed task in the list, When the user marks it incomplete, Then it is shown as incomplete, with no manual page reload. | |
| AC-TASK-TRACKER-002-03 | REQ-TASK-TRACKER-002-03 | Given tasks with mixed completion states, When the list renders, Then completed tasks are visually distinguished from incomplete ones. | Exact visual treatment (e.g. strikethrough) is a frontend design decision, not prescribed here. |
| AC-TASK-TRACKER-002-04 | REQ-TASK-TRACKER-002-04 | Given a task is toggled complete or incomplete, When the list re-renders, Then the task's position in the list is unchanged. | |
| AC-TASK-TRACKER-002-05 | REQ-TASK-TRACKER-002-01 | Given a request to toggle a task id that does not exist, When submitted, Then no task is modified and an error is shown/returned. | |

## 5. Edge Cases

- Toggling a task id that does not exist (e.g. already deleted, or a stale/invalid id) — must not modify any other task or crash; must surface an error (see AC-05).
- Rapid double-toggle of the same task (double-click) — must not desync from the server's actual state; the toggle control should not allow two conflicting in-flight requests for the same task to leave it in a state the UI didn't show the user.
- List currently empty — the toggle control has nothing to act on; not a special case beyond G2's existing empty-state handling.

## 6. Dependencies

- **Depends On:** `None` — extends pre-existing, onboarded code (`src-code-frontend/`, `src-code-backend/`), not a prior story delivered through this workflow. See `spec/business/tasks/BRD.md` "Already Delivered."
- **External systems / data / APIs this story relies on:** none — self-contained, in-memory backend per `AD-BACKEND-002` in `spec/architecture/ARCH-DECISIONS.md`; extends the existing `Task` resource, does not introduce a new one.

## 7. Non-Functional Notes (optional)

Not specified — this project has no NFR gate (`spec/architecture/NFR-SUMMARY.md` is not populated).

## 8. Open Questions

- None blocking at intake time. The exact visual treatment for "completed" (strikethrough vs. a badge vs. dimmed text) is left to frontend LLD design, not a business-level open question.
