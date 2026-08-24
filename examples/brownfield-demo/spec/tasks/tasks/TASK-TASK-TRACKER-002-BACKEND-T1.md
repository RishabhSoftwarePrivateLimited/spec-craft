# TASK-TASK-TRACKER-002-BACKEND-T1

| Field | Value |
|---|---|
| Task ID | TASK-TASK-TRACKER-002-BACKEND-T1 |
| Layer | backend |
| Title | Task completion — repository, service, types, contract |
| Source Requirement References | REQ-TASK-TRACKER-002-01, REQ-TASK-TRACKER-002-02, REQ-TASK-TRACKER-002-04, AC-TASK-TRACKER-002-01, AC-TASK-TRACKER-002-02, AC-TASK-TRACKER-002-04, AC-TASK-TRACKER-002-05 |
| Source LLD References | `LLD-BACKEND-TASK-TRACKER-002.md` §5, §6, §9, §11 |
| Current State | `approved` |
| Estimated Complexity | small |

## Objective

Extend the existing `tasks` domain layer (type, repository, service) so a task's completion state can be looked up by id and set to an explicit target value, and update the API contract file to describe the new operation.

## In-Scope Work

- `src/types/task.ts`: add `completed: boolean` to the `Task` interface.
- `src/repositories/tasks.repository.ts`: add a method that finds a task by `id` and sets its `completed` field to a given boolean, returning the updated task (or an explicit not-found signal if no task matches); update `create()` to set `completed: false` on new tasks. Existing `list()` unchanged.
- `src/services/tasks.service.ts`: add a function that validates `completed` is a strict boolean, resolves the task via the repository, throws a not-found error (message: `"Task not found"`) if no task matches, and otherwise delegates to the repository exactly once.
- `contracts/tasks/tasks.yaml`: create/update to describe all three `tasks` operations (`GET`, `POST`, and this story's `PATCH /api/tasks/:id`), matching `LLD-BACKEND-TASK-TRACKER-002.md` §5's touchpoint table exactly. Per `AD-X-001`, this file does not pre-exist for this project — this task writes it for the first time.
- Unit tests: `test/repositories/tasks.repository.test.ts` (extend) and `test/services/tasks.service.test.ts` (extend).

## Out-Of-Scope Work

- HTTP routing, request parsing, or response shaping (routes/controllers — see `-BACKEND-T2`).
- Express app bootstrap, CORS, JSON body-parsing middleware (unchanged, already exists).
- Any change to the existing `GET`/`POST` behavior beyond their response bodies now including `completed` as a side effect of the type change.

## Impacted Areas

- `src/types/task.ts` (direct, existing)
- `src/repositories/tasks.repository.ts` (direct, existing)
- `src/services/tasks.service.ts` (direct, existing)
- `contracts/tasks/tasks.yaml` (new file, first written by this task)
- `test/repositories/tasks.repository.test.ts`, `test/services/tasks.service.test.ts` (direct, existing)

## Edge Cases To Preserve

- Setting `completed` on an id that doesn't exist — repository/service must signal not-found without mutating anything (LLD §6).
- `completed` not a strict boolean — service must reject before touching the repository (LLD §6).
- The mutation must not change the task's position in the repository's array or touch any other field (REQ-04).

## Architecture Constraints

- `AD-BACKEND-001` — TypeScript strict, `.ts` files only.
- `AD-BACKEND-002` — no ORM; `tasks.repository.ts` remains the sole owner of the in-memory array; no persistence across restarts.
- `AD-X-001` — API contract written to match this LLD's touchpoint table, covering all three operations in one growing per-module file.
- `BACKEND-STRUCTURE.md` §Layering — repository is only imported by the service, never by a controller.

## Reuse Expectations

Extend the existing `tasks.repository.ts`/`tasks.service.ts`/`types/task.ts` in place — no new files beyond the contract file. Follow the existing validate-then-delegate pattern already used by `createTask` in the service (see `src-code-backend/rules/conventions.md` §Validation Pattern).

## Dependencies

- **Depends On:** None.
- Blocks: `TASK-TASK-TRACKER-002-BACKEND-T2` (controller/route needs this task's service function to call).

## Implementation Notes

- Repository lookup is a linear scan (`Array.prototype.find`/`findIndex`) — consistent with the existing small in-memory array; no index structure needed at this scale.
- The service's not-found signal should be a thrown `Error` with a stable message (`"Task not found"`) so `-BACKEND-T2`'s controller can map it to `404` without re-deriving the string — same forward-compatibility approach `-BACKEND-T1` of `TASK-TRACKER-001` used for the title-validation error.
- Existing tasks created before this story gain `completed: false` implicitly once the field exists on the type — no migration mechanism needed or possible for an in-memory-only store.

## Expected Evidence

- Passing unit tests for the new repository method and service function (success + not-found + invalid-type paths).
- `contracts/tasks/tasks.yaml` present and matching the LLD touchpoint table.
- Traceability: Task → Code and Code → Tests rows added to `spec/traceability/tasks/TASK-TRACKER-002/TRACEABILITY.md`.

## Test Expectations

- Repository: setting completion on an existing task updates only that task's `completed` field, leaves array order/other fields untouched, and returns a not-found signal for an unknown id; `create()` still sets `completed: false`.
- Service: rejects a non-boolean `completed` without calling the repository; rejects an unknown task id (via the repository's not-found signal) without a false-positive success; delegates to the repository exactly once per valid call.

## Open Questions Or Blockers

None.
