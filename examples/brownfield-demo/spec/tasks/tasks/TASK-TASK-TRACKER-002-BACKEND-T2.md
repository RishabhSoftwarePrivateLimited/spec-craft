# TASK-TASK-TRACKER-002-BACKEND-T2

| Field | Value |
|---|---|
| Task ID | TASK-TASK-TRACKER-002-BACKEND-T2 |
| Layer | backend |
| Title | Task completion HTTP endpoint — controller, route |
| Source Requirement References | REQ-TASK-TRACKER-002-01, REQ-TASK-TRACKER-002-02, REQ-TASK-TRACKER-002-04, AC-TASK-TRACKER-002-01, AC-TASK-TRACKER-002-02, AC-TASK-TRACKER-002-04, AC-TASK-TRACKER-002-05 |
| Source LLD References | `LLD-BACKEND-TASK-TRACKER-002.md` §5, §6, §7 |
| Current State | `approved` |
| Estimated Complexity | small |

## Objective

Wire `PATCH /api/tasks/:id` to the service function added in `-BACKEND-T1`, mapping its success/failure outcomes to the correct HTTP status codes and bodies.

## In-Scope Work

- `src/controllers/tasks.controller.ts`: add a handler that reads `id` from `req.params` and `completed` from `req.body`, calls the `-BACKEND-T1` service function, responds `200` with the updated task on success, `404` with `{ error: "Task not found" }` if the service signals not-found, `400` with `{ error: "completed must be a boolean" }` if the service rejects the input type.
- `src/routes/tasks.routes.ts`: add `router.patch('/:id', updateTaskCompletion)` (or equivalent handler name) wiring.
- Unit tests: extend `test/controllers/tasks.controller.test.ts`.

## Out-Of-Scope Work

- Any change to the domain layer (repository/service) — consumes `-BACKEND-T1`'s function as-is.
- Express app bootstrap, CORS, JSON body-parsing middleware — unchanged, already exists.
- Integration-level HTTP testing — covered in this task's own Integration Testing stage (per `AGENTS.md` §Dual-layer branch), not here.

## Impacted Areas

- `src/controllers/tasks.controller.ts` (direct, existing)
- `src/routes/tasks.routes.ts` (direct, existing)
- `test/controllers/tasks.controller.test.ts` (direct, existing)

## Edge Cases To Preserve

- Not-found task id → `404` with the contract error body, no task modified (LLD §6, AC-05).
- Non-boolean `completed` → `400` with the contract error body, no task modified (LLD §6).
- Malformed JSON body on `PATCH` → falls through to Express's default body-parser error handling, same as the existing `POST` behavior — no custom handling needed, just don't break the existing default.

## Architecture Constraints

- `AD-BACKEND-001` — TypeScript strict.
- `AD-BACKEND-004` — REST/JSON, no versioning.
- `AD-X-002` — CORS already restricted to `http://localhost:5173`; no change needed, this task must not alter that config.
- `BACKEND-STRUCTURE.md` §Layering — controller calls the service only, never the repository directly; route file carries no logic beyond HTTP-verb-to-handler wiring.

## Reuse Expectations

Extend the existing `tasks.controller.ts`/`tasks.routes.ts` in place — follow the existing catch-and-map pattern already used by `createTask` in the controller (try/catch around the service call, map the thrown error's message into the response body) — see `src-code-backend/rules/conventions.md` §Validation Pattern.

## Dependencies

- **Depends On:** `TASK-TASK-TRACKER-002-BACKEND-T1` (consumes its service function).

## Implementation Notes

- Distinguish the not-found case (`404`) from the invalid-input case (`400`) by the specific error thrown/message from the service — do not collapse both into one status code.
- No new middleware needed; the existing `express.json()` body parser already covers this route.

## Expected Evidence

- Passing unit tests for the controller handler (200/404/400 paths, mocking the service).
- Traceability: Task → Code and Code → Tests rows added to `spec/traceability/tasks/TASK-TRACKER-002/TRACEABILITY.md`.

## Test Expectations

- `200` with the updated task for a valid toggle in either direction.
- `404` with the contract error body for an unknown task id.
- `400` with the contract error body for a non-boolean `completed`.

## Open Questions Or Blockers

None.
