# TASK-TASK-TRACKER-001-BACKEND-T2

## Metadata

| Field | Value |
|---|---|
| Task ID | TASK-TASK-TRACKER-001-BACKEND-T2 |
| Layer | backend |
| Title | Tasks HTTP endpoints — bootstrap, routes, controller |
| Task Shape | Endpoint Task |
| Current State | approved |
| Estimated Complexity | small |

## Source Requirement References

REQ-TASK-TRACKER-001-01, REQ-TASK-TRACKER-001-02, REQ-TASK-TRACKER-001-03, REQ-TASK-TRACKER-001-04, AC-TASK-TRACKER-001-01 through AC-TASK-TRACKER-001-05

## Source LLD References

`LLD-BACKEND-TASK-TRACKER-001.md` §5 (Route/endpoint impact, API touchpoint table), §6 (Edge Cases), §8 (Architecture Application), §10 (State And UX States — server response states)

## Objective

Expose the `tasks` domain service over HTTP: bootstrap the Express app (CORS, JSON body parsing), wire `GET /api/tasks` and `POST /api/tasks`, and shape controller responses/status codes per the approved contract.

## In-Scope Work

- `src/index.ts` — Express app bootstrap; `cors` configured to allow `http://localhost:5173` only (`AD-X-002`); JSON body-parsing middleware; route registration; server listen
- `src/routes/tasks.routes.ts` — URL/method shape only: `GET /api/tasks`, `POST /api/tasks`; no business logic
- `src/controllers/tasks.controller.ts` — parses the request, calls `tasks.service.ts` (from `-BACKEND-T1`), shapes the HTTP response: `201` + created task on valid create, `400` + `{ error: "Title is required" }` on invalid create, `200` + `Task[]` on list
- Integration-adjacent unit tests at the controller level (mocking/using the service) for status-code and body-shape mapping

## Out-Of-Scope Work

- Any business rule (title validation, ordering, id/createdAt assignment) — owned entirely by `-BACKEND-T1`'s service, this task only calls it
- Repository or service implementation
- Full-stack `supertest` integration tests — those belong to the Integration Testing stage (backend-tagged tasks only), not this task

## Impacted Areas

| Area | Type |
|---|---|
| `src/index.ts` | new |
| `src/routes/tasks.routes.ts` | new |
| `src/controllers/tasks.controller.ts` | new |

## Edge Cases To Preserve

- Empty/whitespace/missing `title` → controller surfaces the service's rejection as `400` with `{ error: "Title is required" }`
- No tasks exist yet → `GET /api/tasks` returns `200` with `[]`, not an error
- Malformed JSON body on `POST` → Express's default body-parser error handling applies (no custom body beyond the framework default)
- Unexpected server error (not expected to occur given this scope) → falls through to Express's default error handling; no custom error middleware added at this scope

## Architecture Constraints

- `AD-BACKEND-001` — TypeScript strict
- `AD-BACKEND-003` — no auth; every route public, no guard middleware
- `AD-BACKEND-004` — REST/JSON, no versioning, no access tiers
- `AD-BACKEND-006` — `node --test` + `supertest` (unit-level controller tests here; full `supertest` HTTP-stack tests are the Integration Testing stage's responsibility)
- `AD-X-002` — CORS restricted to `http://localhost:5173`
- `BACKEND-STRUCTURE.md` §Layering — controller never touches the repository directly; route file contains no logic

## Reuse Expectations

Feature-local for now (`tasks.controller.ts`, `tasks.routes.ts`) — only one resource exists; promote the route-registration pattern only if a second resource is added later (`LLD-BACKEND-TASK-TRACKER-001.md` §9).

## Dependencies

`TASK-TASK-TRACKER-001-BACKEND-T1` (controller calls `tasks.service.ts`; route registration in `src/index.ts` needs the service/repository module to exist).

## Implementation Notes

- Route registration and CORS/body-parsing middleware attachment are grouped into this task per the Endpoint Task shape's "route registration and middleware attachment if this operation is the terminal step" — no separate Foundation task is warranted since this is the first and only backend flow.
- No cross-layer `Dependencies` entry is recorded against the frontend Feature-Module task: the frontend consumes the companion-checked LLD touchpoint table as an interim mock and does not need this task to land first to begin its own implementation. Real end-to-end wiring naturally depends on this task existing, but that is a runtime/integration concern, not a planning-sequencing one.

## Expected Evidence

- `src/index.ts`, `src/routes/tasks.routes.ts`, `src/controllers/tasks.controller.ts` present
- Controller-level unit tests passing (status codes + body shapes for both operations)
- Task-to-code and code-to-unit-test traceability rows updated

## Test Expectations

- `POST /api/tasks` → `201` with the created task for a valid title; `400` with `{ error: string }` for an empty/whitespace title
- `GET /api/tasks` → `200` with `[]` when empty, `200` with all created tasks (order as returned by the service/repository) after multiple creates
- Success + failure + edge-case paths per LLD §11

## Open Questions Or Blockers

None — LLD is approved and sufficiently specific for safe task derivation.
