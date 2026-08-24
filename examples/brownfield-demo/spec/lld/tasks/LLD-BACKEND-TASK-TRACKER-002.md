# LLD-BACKEND-TASK-TRACKER-002

## 1. Metadata

| Field | Value |
|---|---|
| LLD ID | LLD-BACKEND-TASK-TRACKER-002 |
| Business Spec Reference | `spec/business/tasks/TASK-TRACKER-002.md` |
| Work Item Reference | TASK-TRACKER-002 |
| Status | `approved` |
| Last Updated | 2026-08-14 |
| API Spec Reference | Not yet created — `contracts/tasks/tasks.yaml` does not exist for this project; this story's backend `/speccraft.implement` will write it to match §5 below, covering all three `tasks` operations (the two pre-existing ones plus this story's new one) since it is a per-module file, not per-story |
| Design Reference | None provided at intake |
| Depends On | None (extends pre-existing, onboarded code — see `spec/business/tasks/BRD.md` "Already Delivered") |

## 2. Purpose And Scope

**In scope:** extending the existing `tasks` HTTP API with a completion-toggle operation — REQ-TASK-TRACKER-002-01 through -04. Update a task's `completed` field to an explicit target state (server is authoritative on whether the task exists), leave all other fields unchanged.

**Out of scope:** deleting a task, editing a task's title, auth/session, persistence beyond the running process (unchanged — in-memory only, `AD-BACKEND-002`).

## 3. Source Requirements

- REQ-TASK-TRACKER-002-01, REQ-TASK-TRACKER-002-02, REQ-TASK-TRACKER-002-03, REQ-TASK-TRACKER-002-04
- AC-TASK-TRACKER-002-01, AC-TASK-TRACKER-002-02, AC-TASK-TRACKER-002-03, AC-TASK-TRACKER-002-04, AC-TASK-TRACKER-002-05

Same IDs cited by `LLD-FRONTEND-TASK-TRACKER-002.md` — one shared intake pass, no per-layer fork.

## 4. Functional Understanding

No roles/permissions — no auth, unchanged (`AD-BACKEND-003`). Behavior path:

1. `PATCH /api/tasks/:id` receives `{ completed: boolean }`. Controller passes `id` and `completed` to the service.
2. Service asks the repository to find the task by `id`. If not found, the service signals a not-found failure (surfaces as `404`) — this is the authoritative existence check (AC-05).
3. If `completed` is not a strict boolean, the service rejects before touching the repository (surfaces as `400`) — mirrors the existing title-validation pattern's shape (reject before storage, one clear field/rule/message).
4. On a valid request against an existing task, the repository sets that task's `completed` field to the exact value sent (not a flip) and returns the updated task object. All other fields (`id`, `title`, `createdAt`) are untouched.
5. The task's position in the repository's underlying array is unchanged by this operation — only `POST` (create) affects ordering (existing behavior, untouched); this story's toggle is a same-index mutation.
6. `GET /api/tasks` (existing, unchanged) now returns tasks that include the `completed` field, since the shared `Task` type gained it — no change to the `GET` handler itself.

## 5. Backend Design Decisions

**Route/endpoint impact:** one new route, `PATCH /api/tasks/:id`, per `AD-BACKEND-004` (REST/JSON). Chosen over a bare "toggle" endpoint (e.g. `POST /api/tasks/:id/toggle`) specifically because a target-state `PATCH` is idempotent — sending the same `{ completed: true }` twice (e.g. from a double-click) leaves the task in the same state both times, whereas a bare toggle would flip it twice and silently desync from what the UI showed the user. This directly addresses the business spec's "rapid double-toggle" edge case at the API-design level, not just the client.

**Module/service ownership:** extends the existing layering, no new files. Follows the fixed layering discovered by `/speccraft.onboard`: `routes/` → `controllers/` → `services/` → `repositories/`, one direction only (`BACKEND-STRUCTURE.md` §Layering).

**Data ownership and persistence strategy:** `tasks.repository.ts` remains the sole owner of the in-memory array (`AD-BACKEND-002`, unchanged). No other module touches the array directly. No persistence across restarts (unchanged).

**Transaction boundaries:** none needed — single in-process array, single-threaded event loop, same as the existing operations (`BACKEND-STRUCTURE.md` §Data / Integration Strategy).

**Mutation decision (one decision per surface):** the repository's new method finds the task by `id` (linear scan — consistent with the existing small in-memory array, no index structure needed at this scale) and replaces its `completed` field in place, preserving the array's existing order and every other field. This is the single place this mutation is decided — no other layer re-derives or re-applies it.

**Validation strategy:**

| Field | Rule | Error Message / Contract |
|---|---|---|
| `id` (URL param) | must reference an existing task | `404` with body `{ error: "Task not found" }` |
| `completed` | required; must be a strict boolean (`true`/`false`, not a truthy/falsy string or number) | `400` with body `{ error: "completed must be a boolean" }` |

**External integration / API touchpoints:** none external — unchanged (`BACKEND-STRUCTURE.md` §Integration Strategy).

**API touchpoint table:**

| Operation | Method | Path | Request Shape | Success Shape | Error Codes |
|---|---|---|---|---|---|
| Update task completion | PATCH | `/api/tasks/:id` | `{ completed: boolean }` | `200` → `{ id: string, title: string, createdAt: string, completed: boolean }` | `404` → `{ error: string }` (task id not found); `400` → `{ error: string }` (`completed` not a boolean) |

This table's shape is agreed with `LLD-FRONTEND-TASK-TRACKER-002.md` §5 — see §14. Existing `POST`/`GET /api/tasks` touchpoints are unchanged in shape except their response bodies now also include `completed` (the `Task` type gained the field).

**Permission checks:** none apply — no auth model, unchanged (`AD-BACKEND-003`); not a gap, consistent with the existing app's explicit non-goal.

## 6. Edge Cases

| Error / Condition | Source | Handling Strategy | Caller-Facing Outcome |
|---|---|---|---|
| `id` does not match any existing task | Service, after repository lookup returns nothing | Reject before any mutation | `404` `{ error: "Task not found" }` |
| `completed` missing or not a strict boolean | Service validation | Reject before reaching repository | `400` `{ error: "completed must be a boolean" }` |
| Rapid duplicate `PATCH` requests for the same task with the same target `completed` value (double-submit) | Client behavior | Not deduplicated server-side — each valid request is independently idempotent since it sets an explicit target state, not a flip; two identical requests leave the task in the same final state | Two valid requests, same resulting state — by design, not a server bug (this is the point of the target-state design decision in §5) |
| `PATCH` for a task that exists but with a malformed JSON body | Express body-parser | Express's default JSON parsing error handling applies (no custom body beyond the framework default) — same as the existing `POST /api/tasks` behavior | `400` from Express middleware, before reaching the controller |

## 7. Impacted Areas

| Area | Type | Notes |
|---|---|---|
| `src/types/task.ts` | direct, existing | Add `completed: boolean` to the `Task` interface |
| `src/repositories/tasks.repository.ts` | direct, existing | Add a method to find-by-id and set `completed`; existing `create()` updated to set `completed: false` explicitly on new tasks; existing `list()` unchanged |
| `src/services/tasks.service.ts` | direct, existing | Add a function that validates `completed` and the task's existence, then delegates to the repository |
| `src/controllers/tasks.controller.ts` | direct, existing | Add a handler that parses `id`/`completed`, calls the service, maps `404`/`400`/`200` |
| `src/routes/tasks.routes.ts` | direct, existing | Add `PATCH /:id` wiring to the new controller handler |
| `contracts/tasks/tasks.yaml` | indirect, will be written/updated by this story's implementation | Per `AD-X-001`; covers all three `tasks` operations once written |

No indirect impacted areas beyond the contract file above — this story only extends the existing `tasks` resource, no other resource exists.

## 8. Architecture Application

- **AD-BACKEND-001** (Express 5 + TS) — all changes are `.ts` edits to existing files, no deviation.
- **AD-BACKEND-002** (no ORM, in-memory array repository) — the new repository method is the only code that mutates the array directly; no database, no persistence across restarts, unchanged.
- **AD-BACKEND-003** (no auth) — no middleware/guard layer added; the new route is public, same as the existing two.
- **AD-BACKEND-004** (REST/JSON) — one new REST endpoint, JSON both directions, consistent with the existing two.
- **AD-BACKEND-005** (no messaging) — the mutation is synchronous, no queue/event emission, unchanged.
- **AD-BACKEND-007** (`node:test` + `supertest`) — see §11 Testing Implications.
- **`BACKEND-STRUCTURE.md` layering** — strict one-direction flow preserved: routes → controllers → services → repositories, no layer skipping (the new controller handler never touches the repository directly).
- **AD-X-001** (API contract format) — no contract file exists yet for this project; this LLD's §5 touchpoint table is the binding shape this story's `/speccraft.implement` will write into `contracts/tasks/tasks.yaml`, alongside the two pre-existing operations (first time this file is written for this project, since onboarding does not author it).

## 9. Reuse-Before-Build Decisions

**Reuse table:**

| Existing Artifact | Import Path | Used By |
|---|---|---|
| `Task` type | `src/types/task.ts` | Extended in place (new `completed` field), not duplicated |
| `tasks.repository.ts`'s existing module-scoped array | `src/repositories/tasks.repository.ts` | New method operates on the same array `list()`/`create()` already use — no second store introduced |
| `tasks.service.ts`'s existing validate-then-delegate pattern | `src/services/tasks.service.ts` | New function follows the same shape as the existing `createTask` (validate, throw a plain `Error` with contract text on failure, delegate to repository exactly once on success) |
| `tasks.controller.ts`'s existing catch-and-map pattern | `src/controllers/tasks.controller.ts` | New handler follows the same shape as the existing `createTask` controller function (try/catch around the service call, map thrown error to the right HTTP status) |
| `tasks.routes.ts`'s existing `Router` | `src/routes/tasks.routes.ts` | New route added to the same router instance, not a new router/module |

**Create table:**

| New Artifact | Target Path | Reusable Beyond This Feature | Promotion Target |
|---|---|---|---|
| `contracts/tasks/tasks.yaml` | `contracts/tasks/` | Yes — covers the whole `tasks` module, will keep growing with future `tasks` stories | Already at the correct location per `AD-X-001`; no further promotion needed |

Every reuse candidate above is the pre-existing, discovered code (via `/speccraft.onboard`), not prior workflow output — this is the first delivery story since onboarding.

## 10. State And UX States

Backend has no UI states; this section covers server-side response states instead.

| Scenario | Component/Unit Affected | Expected Behavior |
|---|---|---|
| Valid toggle request, task exists | `tasks.service.ts` / `tasks.repository.ts` | Task's `completed` field updated to the requested value, `200` returned with the full updated task object |
| Toggle request, task id does not exist | `tasks.controller.ts` / `tasks.service.ts` | No repository mutation; `404` returned with error body |
| Toggle request, `completed` not a boolean | `tasks.controller.ts` / `tasks.service.ts` | No repository mutation; `400` returned with error body |
| Existing `GET`/`POST` requests | `tasks.repository.ts` | Unchanged behavior; response bodies now include `completed` since the shared type gained the field |

## 11. Testing Implications

Per `AD-BACKEND-007` (`node:test` + `supertest`), extending the existing test suites rather than starting new ones:

- **Unit tests** (service + repository, no HTTP, extending existing files): `tasks.repository.ts` — the new method updates `completed` on the matching task and returns it, leaves the array's order/other fields untouched, returns a not-found signal (e.g. `undefined`) for an unknown id, and `create()` still assigns `completed: false` on new tasks. `tasks.service.ts` — rejects a non-boolean `completed` without calling the repository; rejects an unknown task id (propagated from the repository's not-found signal) without a false-positive success; delegates to the repository exactly once per valid call.
- **Integration tests** (full HTTP stack via `supertest`, extending the existing integration file): `PATCH /api/tasks/:id` returns `200` with the updated task for a valid toggle in either direction (incomplete→complete and complete→incomplete); returns `404` with an error body for an unknown id; returns `400` with an error body for a non-boolean `completed`; a `GET /api/tasks` after a successful toggle reflects the new `completed` value at the same list position (no re-sort, no duplication).
- Critical flows needing coverage: toggle-to-complete and toggle-to-incomplete (AC-01, AC-02); response shape includes `completed` for existing `GET`/`POST` too, since the type changed (regression check, not a new AC); not-found rejection (AC-05); position/order preserved across a toggle (AC-04, backend's contribution — the array itself is untouched by this mutation).

## 12. Open Questions And Assumptions

**Assumptions:**
- `PATCH` (not `PUT`) is used since only `completed` is updatable by this story — a `PUT` would imply replacing the whole resource, which is broader than this story's scope.
- The repository's find-by-id uses a linear scan (`Array.prototype.find`/`findIndex`) — acceptable at this project's scale (`AD-BACKEND-002`'s existing in-memory-array decision already accepts O(n) operations); no index structure introduced.
- `completed` on the pre-existing tasks (created before this story) is assumed to be `false` once the field is added, consistent with "not yet marked complete" being the sensible default for already-existing data — no migration mechanism exists in this in-memory-only project, so this only matters within one running process's lifetime anyway.

**Open Questions:** none blocking — business spec and discovered architecture are sufficient to design against.

## 13. Traceability Summary

| Requirement/AC | LLD Section | Coverage |
|---|---|---|
| REQ-TASK-TRACKER-002-01, AC-01 | §5 (Mutation decision, API touchpoint table), §6 | Covered |
| REQ-TASK-TRACKER-002-02, AC-02 | §5 (Mutation decision — same path both directions) | Covered |
| REQ-TASK-TRACKER-002-03, AC-03 | §5 (API touchpoint table — `completed` field returned) | Covered (backend's contribution: exposing the field; visual treatment is frontend's) |
| REQ-TASK-TRACKER-002-04, AC-04 | §5 (Mutation decision — same-index mutation, no re-sort) | Covered |
| AC-05 | §5 (Validation strategy — `id` existence check), §6 | Covered |

No uncovered requirements for this layer.

## 14. Companion LLD Reference

Companion: `LLD-FRONTEND-TASK-TRACKER-002.md`.

Cross-layer contract dependency: this LLD's §5 API touchpoint table (`PATCH /api/tasks/:id` request/response shapes, status codes `200`/`400`/`404`) must match the companion's §5 API touchpoint table exactly — field names (`id`, `title`, `createdAt`, `completed`), the target-state (not flip) request semantics owned here and consumed as the request contract by the frontend, and the `404`/`400` error body shapes (`{ error: string }`). Cross-checked against `LLD-FRONTEND-TASK-TRACKER-002.md` §5 in this run; no conflict found.
