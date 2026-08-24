# TASK-TASK-TRACKER-001-FRONTEND-T3

## Metadata

| Field | Value |
|---|---|
| Task ID | TASK-TASK-TRACKER-001-FRONTEND-T3 |
| Layer | frontend |
| Title | Task list view |
| Task Shape | Component-Slice Task |
| Current State | approved |
| Estimated Complexity | small |

## Source Requirement References

REQ-TASK-TRACKER-001-03, REQ-TASK-TRACKER-001-04, AC-TASK-TRACKER-001-03, AC-TASK-TRACKER-001-04

## Source LLD References

`LLD-FRONTEND-TASK-TRACKER-001.md` §5 (Rendering strategy), §6 (Edge Cases — no tasks exist yet), §10 (State And UX States), §11 (Testing Implications)

## Objective

Build the task list surface: render the `tasks` array as given (no re-sorting — ordering is a backend concern), and show an explicit empty-state message when there are none.

## In-Scope Work

- `src/components/TaskList.tsx` — renders the `tasks` array received via props, in the order given; renders an explicit empty-state message (e.g. "No tasks yet — create your first one above") when the array is empty; does not re-sort or otherwise reinterpret ordering
- Component-level CSS classes for the list and empty state (added to `src/index.css`)
- Component unit tests (Vitest + RTL)

## Out-Of-Scope Work

- Any network call — `TaskList` never calls `tasksClient.ts` directly; it only receives `tasks` as a prop from `App.tsx`
- Loading-indicator markup while the initial fetch is in flight (owned by `App.tsx` per `-FRONTEND-T1` §10, since it depends on `App.tsx`'s own fetch-in-progress state, not `TaskList`'s own concern)
- Task creation form (see `-FRONTEND-T2`)

## Impacted Areas

| Area | Type |
|---|---|
| `src/components/TaskList.tsx` | new |
| `src/index.css` | new (list/empty-state classes) |

## Edge Cases To Preserve

- No tasks exist yet → render an explicit empty-state message instead of an empty list area, not treated as an error
- Initial load succeeds with N tasks → render all N, newest first, exactly as returned by the server (no client-side re-sort)

## Architecture Constraints

- `AD-FRONTEND-002` / `AD-FRONTEND-006` — plain elements, `src/index.css` styling only, no CSS-in-JS
- `AD-FRONTEND-007` — Vitest + RTL
- `FRONTEND-STRUCTURE.md` §Module Boundaries — components never import `tasksClient.ts` directly; data flows through props from `App.tsx`

## Reuse Expectations

Feature-local for now — only one screen exists; promote to a shared component only if a second screen needs the same list shape (`LLD-FRONTEND-TASK-TRACKER-001.md` §9).

## Dependencies

`TASK-TASK-TRACKER-001-FRONTEND-T1` (consumes the `tasks` array `App.tsx` exposes as a prop).

## Implementation Notes

- This task and `-FRONTEND-T2` are independent Component-Slice tasks and can be implemented in parallel once `-FRONTEND-T1` is complete.
- Ordering correctness is the backend's responsibility (companion LLD §5/§14, insertion-order guarantee); this component must not add its own sort/comparator logic.

## Expected Evidence

- `src/components/TaskList.tsx` present; list/empty-state classes added to `src/index.css`
- Component unit tests passing
- Task-to-code and code-to-unit-test traceability rows updated

## Test Expectations

- Renders empty state with zero tasks
- Renders all items in the order given (does not re-sort)
- Success + edge-case paths per LLD §11

## Open Questions Or Blockers

None — LLD is approved and sufficiently specific for safe task derivation.
