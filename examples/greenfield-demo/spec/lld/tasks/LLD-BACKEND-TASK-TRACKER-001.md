# LLD-BACKEND-TASK-TRACKER-001

## 1. Metadata

| Field | Value |
|---|---|
| LLD ID | LLD-BACKEND-TASK-TRACKER-001 |
| Business Spec Reference | `spec/business/tasks/TASK-TRACKER-001.md` |
| Work Item Reference | TASK-TRACKER-001 |
| Status | `approved` |
| Last Updated | 2026-08-13 |
| API Spec Reference | Not yet created — `contracts/tasks/tasks.yaml` does not pre-exist (per `AD-X-001`); this story's backend `/speccraft.implement` will write it to match §5 below |
| Design Reference | None provided at intake |
| Depends On | None |

## 2. Purpose And Scope

**In scope:** the `tasks` HTTP API — REQ-TASK-TRACKER-001-01 through -04. Create a task from a title (server-assigned `id`/`createdAt`), list all tasks newest-first, enforce non-empty-title validation server-side as the authoritative check.

**Out of scope:** editing/deleting a task, marking complete, auth/session, persistence beyond the running process (in-memory only, by design — `AD-BACKEND-002`).

## 3. Source Requirements

- REQ-TASK-TRACKER-001-01, REQ-TASK-TRACKER-001-02, REQ-TASK-TRACKER-001-03, REQ-TASK-TRACKER-001-04
- AC-TASK-TRACKER-001-01, AC-TASK-TRACKER-001-02, AC-TASK-TRACKER-001-03, AC-TASK-TRACKER-001-04, AC-TASK-TRACKER-001-05

Same IDs cited by `LLD-FRONTEND-TASK-TRACKER-001.md` — one shared intake pass, no per-layer fork.

## 4. Functional Understanding

No roles/permissions — no auth in this demo (`AD-BACKEND-003`). Behavior path:

1. `POST /api/tasks` receives `{ title }`. Controller passes it to the service.
2. Service trims `title`; if empty, returns a validation failure (surfaces as `400`). This is the authoritative check — the client's own check is a convenience only (server-side-first principle).
3. On a valid title, service assigns a unique `id` and a `createdAt` timestamp, then asks the repository to store the task at the front of its collection (so the collection's natural order is always newest-first).
4. `GET /api/tasks` reads the repository's current collection as-is and returns it — no separate sort step needed, since insertion order already satisfies "newest first."
5. No task ever changes after creation in this story's scope — no update/delete path exists yet.

Flat enough that a Capability → Feature → Buildable Unit tree adds no value over the flat REQ list above.

## 5. Backend Design Decisions

**Route/endpoint impact:** two new routes, `GET /api/tasks` and `POST /api/tasks`, per `AD-BACKEND-004` (REST/JSON). No versioning, no access tiers (no auth).

**Module/service ownership:** all new — first backend story, `src-code-backend/` not yet scaffolded. Follows the fixed layering: `routes/` → `controllers/` → `services/` → `repositories/`, one direction only (`BACKEND-STRUCTURE.md` §Layering).

**Data ownership and persistence strategy:** `tasks.repository.ts` is the sole owner of the in-memory array (`AD-BACKEND-002`). No other module touches the array directly. No persistence across restarts — deliberate.

**Transaction boundaries:** none needed — single in-process array, single-threaded event loop, no multi-step writes (`BACKEND-STRUCTURE.md` §Data / Integration Strategy).

**Ordering decision (one decision per surface):** the repository's `create()` method unshifts (inserts at index 0) rather than pushes. This means the array's iteration order is always newest-first by construction, and `GET /api/tasks` (via the service's `list()`, which just returns the repository's current array) never needs a separate sort. This is the single place ordering is decided — no other layer re-orders.

**Validation strategy:**

| Field | Rule | Error Message / Contract |
|---|---|---|
| `title` | required; non-empty after `.trim()` | `400` with body `{ error: "Title is required" }` |

**External integration / API touchpoints:** none external — the only boundary is this service's own HTTP surface (`BACKEND-STRUCTURE.md` §Integration Strategy).

**API touchpoint table:**

| Operation | Method | Path | Request Shape | Success Shape | Error Codes |
|---|---|---|---|---|---|
| Create task | POST | `/api/tasks` | `{ title: string }` | `201` → `{ id: string, title: string, createdAt: string }` | `400` → `{ error: string }` (blank/whitespace title) |
| List tasks | GET | `/api/tasks` | — | `200` → `Task[]` (newest-first, guaranteed by repository insertion order) | — |

This table's shape is agreed with `LLD-FRONTEND-TASK-TRACKER-001.md` §5 — see §14.

**Permission checks:** none apply — no auth model in this demo (`AD-BACKEND-003`); not a gap, an explicit non-goal per `BRD.md`.

## 6. Edge Cases

| Error / Condition | Source | Handling Strategy | Caller-Facing Outcome |
|---|---|---|---|
| Empty or whitespace-only `title` in request body | Service validation | Reject before reaching repository | `400` `{ error: "Title is required" }` |
| Missing `title` field entirely | Controller parsing | Treat as equivalent to empty title, same validation path | `400` `{ error: "Title is required" }` |
| Rapid duplicate `POST /api/tasks` requests (double-submit) | Client behavior | Not deduplicated server-side — the business spec assigns this responsibility to the client (disable-while-in-flight, per BRD Edge Cases); each valid request creates its own task | Two valid requests create two tasks — by design, not a server bug |
| No tasks exist yet | Repository is empty | `GET /api/tasks` returns `200` with `[]`, not an error | Empty array; frontend renders its own empty state |
| Malformed JSON body on `POST` | Express body-parser | Express's default JSON parsing error handling applies (no custom body beyond the framework default) | `400` from Express middleware, before reaching the controller |

## 7. Impacted Areas

All **new** — first backend story, no existing backend code root yet (`src-code-backend/` is created by `/speccraft.scaffold backend`, not yet run).

| Area | Type | Notes |
|---|---|---|
| `src/index.ts` | new | Express bootstrap, `cors` (AD-X-002) + JSON body parsing middleware, route registration |
| `src/routes/tasks.routes.ts` | new | `GET /api/tasks`, `POST /api/tasks` — URL/method shape only |
| `src/controllers/tasks.controller.ts` | new | Parses request, calls service, shapes HTTP response/status |
| `src/services/tasks.service.ts` | new | Title validation, `id`/`createdAt` assignment, delegates storage to repository |
| `src/repositories/tasks.repository.ts` | new | In-memory array, `create()` (unshift), `list()` |
| `src/types/task.ts` | new | Shared `Task` shape |

No indirect impacted areas — first and only backend story so far (per `BRD.md`).

## 8. Architecture Application

- **AD-BACKEND-001** (Express + TS strict) — all new files `.ts` under strict mode, `ts-node` for dev.
- **AD-BACKEND-002** (no ORM, in-memory array repository) — `tasks.repository.ts` is the single array owner; no database, no persistence across restarts, matching the BRD's explicit non-goal.
- **AD-BACKEND-003** (no auth) — no middleware/guard layer for permissions; every route is public.
- **AD-BACKEND-004** (REST/JSON) — two REST endpoints, JSON bodies both directions.
- **AD-BACKEND-005** (no messaging) — creation is synchronous, no queue/event emission.
- **AD-BACKEND-006** (`node --test` + `supertest`) — see §11 Testing Implications.
- **`BACKEND-STRUCTURE.md` layering** — strict one-direction flow honored: routes → controllers → services → repositories, no layer skipping (e.g. controller never touches the repository directly).
- **AD-X-001** (API contract format) — no contract file exists yet; this LLD's §5 touchpoint table is the binding shape this story's `/speccraft.implement` will write into `contracts/tasks/tasks.yaml`.
- **AD-X-002** (CORS) — `src/index.ts` configures `cors` to allow `http://localhost:5173` only.

## 9. Reuse-Before-Build Decisions

**Reuse table:**

| Existing Artifact | Import Path | Used By |
|---|---|---|
| _(none)_ | — | No backend code exists yet for this project — first story, `src-code-backend/` not yet scaffolded |

**Create table:**

| New Artifact | Target Path | Reusable Beyond This Feature | Promotion Target |
|---|---|---|---|
| `tasks.repository.ts` | `src/repositories/` | Yes — any future task-related endpoint reuses this repository | Already at the shared `repositories/` layer |
| `tasks.service.ts` | `src/services/` | Yes — validation/ordering rules apply to any task-creating caller | Already at the shared `services/` layer |
| `tasks.controller.ts`, `tasks.routes.ts` | `src/controllers/`, `src/routes/` | Feature-local for now — only one resource (`tasks`) exists | Promote if a second resource needs the same route-registration pattern |
| `Task` type | `src/types/task.ts` | Yes — shared shape for any task-related module, mirrored by the frontend's own `Task` type | Already at the shared `types/` layer |

## 10. State And UX States

Backend has no UI states; this section covers server-side response states instead.

| Scenario | Component/Unit Affected | Expected Behavior |
|---|---|---|
| Valid create request | `tasks.service.ts` / `tasks.repository.ts` | Task stored, `201` returned with full task object |
| Invalid create request (empty title) | `tasks.controller.ts` / `tasks.service.ts` | No repository write; `400` returned with error body |
| List request, repository empty | `tasks.repository.ts` | `200` with `[]` |
| List request, repository non-empty | `tasks.repository.ts` | `200` with full array, newest-first by construction |
| Unexpected server error (should not occur given this scope, but defensively) | `tasks.controller.ts` | Uncaught errors fall through to Express's default error handling — no custom error middleware added at this scope (no such case is reachable given the simple validation and no external I/O) |

## 11. Testing Implications

Per `AD-BACKEND-006` (`node --test` + `supertest`):

- **Unit tests** (service + repository, no HTTP): `tasks.repository.ts` — `create()` unshifts (new item ends up at index 0); `list()` returns current array reference/contents. `tasks.service.ts` — rejects empty/whitespace title; assigns `id` and `createdAt` on valid input; delegates storage to the repository exactly once per valid call.
- **Integration tests** (full HTTP stack via `supertest`, per `AD-BACKEND-006` / `BACKEND-STRUCTURE.md`): `POST /api/tasks` returns `201` with the created task for a valid title; returns `400` with an error body for an empty/whitespace title; `GET /api/tasks` returns `200` with `[]` when empty and with all created tasks, newest-first, after multiple creates.
- Critical flows needing coverage: create → list ordering (AC-01 through AC-04); validation rejection (AC-05); repeated valid creates producing correctly-ordered results (Edge Cases).

## 12. Open Questions And Assumptions

**Assumptions:**
- `id` generation mechanism (e.g. `crypto.randomUUID()` vs an incrementing counter) is an implementation detail left to `/speccraft.implement`, as long as IDs are unique per task — not architecturally constrained by `AD-BACKEND-002` beyond "no ORM."
- `createdAt` is an ISO-8601 string, matching the frontend's assumed shape (§5, cross-checked in §14).
- No rate limiting or request-size limits are needed at this demo's scale (consistent with BRD scope).

**Open Questions:** none blocking — business spec and architecture are sufficient to design against.

## 13. Traceability Summary

| Requirement/AC | LLD Section | Coverage |
|---|---|---|
| REQ-TASK-TRACKER-001-01, AC-01, AC-05 | §5 (Validation strategy), §6 | Covered |
| REQ-TASK-TRACKER-001-02, AC-02 | §5 (API touchpoint table — `id`/`createdAt` assignment) | Covered |
| REQ-TASK-TRACKER-001-03, AC-03 | §5 (Ordering decision), §11 | Covered |
| REQ-TASK-TRACKER-001-04, AC-04 | §5 (Ordering decision — unshift on create) | Covered |

No uncovered requirements for this layer.

## 14. Companion LLD Reference

Companion: `LLD-FRONTEND-TASK-TRACKER-001.md`.

Cross-layer contract dependency: this LLD's §5 API touchpoint table (`POST /api/tasks` request/response shapes, `GET /api/tasks` response shape, status codes `201`/`400`/`200`) must match the companion's §5 API touchpoint table exactly — field names (`id`, `title`, `createdAt`), the newest-first ordering guarantee (owned here via repository insertion order, consumed as-is by the frontend), and the `400` error body shape (`{ error: string }`). Cross-checked against `LLD-FRONTEND-TASK-TRACKER-001.md` §5 in this run; no conflict found.
