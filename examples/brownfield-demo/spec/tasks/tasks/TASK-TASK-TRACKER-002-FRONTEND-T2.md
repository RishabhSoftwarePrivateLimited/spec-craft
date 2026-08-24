# TASK-TASK-TRACKER-002-FRONTEND-T2

| Field | Value |
|---|---|
| Task ID | TASK-TASK-TRACKER-002-FRONTEND-T2 |
| Layer | frontend |
| Title | Task completion toggle — list view |
| Source Requirement References | REQ-TASK-TRACKER-002-01, REQ-TASK-TRACKER-002-02, REQ-TASK-TRACKER-002-03, REQ-TASK-TRACKER-002-04, AC-TASK-TRACKER-002-01, AC-TASK-TRACKER-002-02, AC-TASK-TRACKER-002-03, AC-TASK-TRACKER-002-04 |
| Source LLD References | `LLD-FRONTEND-TASK-TRACKER-002.md` §5, §6, §7, §10 |
| Current State | `approved` |
| Estimated Complexity | small |

## Objective

Add a per-task toggle control and a "completed" visual treatment to the existing task list view, wired to the `onToggleComplete` prop added in `-FRONTEND-T1`.

## In-Scope Work

- `src/components/TaskList.tsx`: accept a new `onToggleComplete: (id: string, completed: boolean) => Promise<void>` prop; render a toggle control (checkbox) per row reflecting `task.completed`; on interaction, call `onToggleComplete` with the task's id and the target (opposite) boolean; track per-row in-flight state to disable that row's control while its own request is pending, and show an inline error + revert on failure.
- `src/index.css`: add a `.task-list__item--completed` (or equivalent) class applying a strikethrough (or agreed visual treatment) to a completed task's title.
- Unit tests: extend `src/components/TaskList.test.tsx`.

## Out-Of-Scope Work

- The `onToggleComplete` implementation itself — consumes it as a prop, provided by `-FRONTEND-T1`.
- Any change to `TaskForm.tsx` or the create flow.
- Re-sorting/filtering by completion state — explicitly out of scope per the business spec (REQ-04).

## Impacted Areas

- `src/components/TaskList.tsx` (direct, existing)
- `src/index.css` (direct, existing)
- `src/components/TaskList.test.tsx` (direct, existing)

## Edge Cases To Preserve

- Rapid double-click of the same row's toggle — the control must be disabled while its own request is in flight, preventing a second conflicting request for the same task (LLD §6, business spec Edge Cases).
- A failed toggle (simulated via a rejected `onToggleComplete` call in tests) must revert the row's displayed state and show an inline error, re-enabling the control afterward (LLD §6, §10).
- List order must be visually unchanged after any toggle — this task must not introduce any sort/reorder logic (REQ-04).

## Architecture Constraints

- `AD-FRONTEND-002` — no UI library; plain `<input type="checkbox">` or `<button>`, styled via `index.css` only.
- `AD-FRONTEND-006` — plain CSS, one global stylesheet, `block__element` naming convention (matches existing `task-list__item`, `task-list__empty`).
- `AD-FRONTEND-008` — Vitest + React Testing Library.
- `FRONTEND-STRUCTURE.md` §Module Boundaries — `TaskList` never imports `tasksClient.ts` directly; only calls the `onToggleComplete` prop.

## Reuse Expectations

Extend `TaskList.tsx` in place — no new component file. Follow the existing per-row rendering pattern (`tasks.map(...)`) and the existing `TaskForm`-style callback-prop pattern for triggering an async action from a child component (see `src-code-frontend/rules/conventions.md` §Component Pattern, §Data-Fetching Pattern).

## Dependencies

- **Depends On:** `TASK-TASK-TRACKER-002-FRONTEND-T1` (consumes its `onToggleComplete` prop).

## Implementation Notes

- Per-row in-flight state should be keyed by task `id` (e.g. a `Set<string>` of in-flight ids, or a local `useState` inside a per-row sub-component) — not a single global "is any toggle in flight" flag, since that would incorrectly disable every row's control while only one is pending.
- The visual "completed" treatment (assumed strikethrough per the LLD's §12 assumption) is a CSS class applied conditionally based on `task.completed`, not a structural change to the list markup.

## Expected Evidence

- Passing unit tests for the toggle control (render, click behavior, disabled-while-in-flight, revert-on-failure, order preserved).
- Traceability: Task → Code and Code → Tests rows added to `spec/traceability/tasks/TASK-TRACKER-002/TRACEABILITY.md`.

## Test Expectations

- Renders a completed task with the visual treatment applied, an incomplete task without it.
- Clicking a row's toggle calls `onToggleComplete` with that task's id and the opposite boolean of its current state.
- The control is disabled while its own toggle is in flight, re-enabled after resolution.
- List order is unchanged before/after a toggle.
- A rejected `onToggleComplete` reverts the row's displayed state and shows an inline error.

## Open Questions Or Blockers

None.
