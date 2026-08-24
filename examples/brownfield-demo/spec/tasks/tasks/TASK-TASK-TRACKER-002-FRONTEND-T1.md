# TASK-TASK-TRACKER-002-FRONTEND-T1

| Field | Value |
|---|---|
| Task ID | TASK-TASK-TRACKER-002-FRONTEND-T1 |
| Layer | frontend |
| Title | Task completion — API client, types, composition wiring |
| Source Requirement References | REQ-TASK-TRACKER-002-01, REQ-TASK-TRACKER-002-02, REQ-TASK-TRACKER-002-04, AC-TASK-TRACKER-002-01, AC-TASK-TRACKER-002-02, AC-TASK-TRACKER-002-04 |
| Source LLD References | `LLD-FRONTEND-TASK-TRACKER-002.md` §5, §7, §9 |
| Current State | `approved` |
| Estimated Complexity | small |

## Objective

Extend the existing API client and composition root so a task's completion state can be updated against the backend and the result reflected in local state at the same list position.

## In-Scope Work

- `src/types/task.ts`: add `completed: boolean` to the `Task` interface.
- `src/api/tasksClient.ts`: add `updateTaskCompletion(id: string, completed: boolean): Promise<Task>` — `PATCH /api/tasks/:id` with `{ completed }`, throws on non-2xx surfacing the server's `{ error }` message, same shape as the existing `listTasks`/`createTask`.
- `src/App.tsx`: add `handleToggleComplete(id: string, completed: boolean)` that calls the client and, on success, replaces the matching task object in the existing `tasks` array at its current index (no re-fetch, no re-sort); pass it to `TaskList` as a new `onToggleComplete` prop.
- Unit tests: extend `src/App.test.tsx`.

## Out-Of-Scope Work

- The toggle control's markup and visual "completed" treatment — see `-FRONTEND-T2`.
- Any change to `TaskForm.tsx` — untouched by this story.
- Real network behavior beyond the mocked API-client boundary — covered by `updateTaskCompletion`'s own future coverage if this project ever adds a dedicated `tasksClient` test file; at this project's existing convention, the client is exercised via `App.test.tsx`'s mocks, same as `listTasks`/`createTask` today.

## Impacted Areas

- `src/types/task.ts` (direct, existing)
- `src/api/tasksClient.ts` (direct, existing)
- `src/App.tsx` (direct, existing)
- `src/App.test.tsx` (direct, existing)

## Edge Cases To Preserve

- A failed toggle (404 or network) must not silently leave the UI showing a state the server didn't confirm — `handleToggleComplete` must surface the failure so `-FRONTEND-T2`'s per-row error/reversion behavior has something to react to (LLD §6).
- No re-fetch of the whole list on a successful toggle — only the one affected task object is replaced (REQ-04).

## Architecture Constraints

- `AD-FRONTEND-001` — React 19 + Vite, TypeScript.
- `AD-FRONTEND-003` — hooks only; `tasksClient.ts` remains the one API seam.
- `FRONTEND-STRUCTURE.md` §Module Boundaries — `App.tsx` is the only place that may call `tasksClient.ts`; `TaskList` (see `-FRONTEND-T2`) receives the callback as a prop, never imports the client directly.

## Reuse Expectations

Extend `tasksClient.ts`, `App.tsx`, and `types/task.ts` in place — no new files. Follow the existing typed-`fetch`-wrapper pattern already used by `listTasks`/`createTask` (see `src-code-frontend/rules/conventions.md` §Data-Fetching Pattern).

## Dependencies

- **Depends On:** None.
- Blocks: `TASK-TASK-TRACKER-002-FRONTEND-T2` (needs `onToggleComplete` wired in `App.tsx` before the component can call it).

## Implementation Notes

- `handleToggleComplete` sends the *target* `completed` value it's given — it does not compute a flip itself; the toggle control (`-FRONTEND-T2`) decides the target state and passes it in, matching the backend's idempotent target-state design (LLD §5).
- Replace the task object immutably (new array with one element swapped), not a mutation of the existing array, to stay consistent with React state-update conventions already used elsewhere in `App.tsx` (e.g. the existing `unshift`-style immutable update in `handleCreate`).

## Expected Evidence

- Passing unit tests for the new client function and `App.tsx` handler (mocked success + failure paths).
- Traceability: Task → Code and Code → Tests rows added to `spec/traceability/tasks/TASK-TRACKER-002/TRACEABILITY.md`.

## Test Expectations

- A successful toggle (mocked) updates only the affected task's rendered `completed` state, at the same list position, without an additional `listTasks` call.
- A failed toggle (mocked rejection) does not change the task's state and surfaces an error path `-FRONTEND-T2` can render.

## Open Questions Or Blockers

None.
