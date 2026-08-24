# TASK-TASK-TRACKER-001-BACKEND-T1

## Metadata

| Field | Value |
|---|---|
| Task ID | TASK-TASK-TRACKER-001-BACKEND-T1 |
| Layer | backend |
| Title | Tasks domain service — repository, service, types, contract |
| Task Shape | Domain-Service Task |
| Current State | approved |
| Estimated Complexity | small |

## Source Requirement References

REQ-TASK-TRACKER-001-01, REQ-TASK-TRACKER-001-02, REQ-TASK-TRACKER-001-03, REQ-TASK-TRACKER-001-04, AC-TASK-TRACKER-001-01 through AC-TASK-TRACKER-001-05

## Source LLD References

`LLD-BACKEND-TASK-TRACKER-001.md` §5 (Backend Design Decisions — module ownership, data ownership, ordering decision, validation strategy, API touchpoint table), §8 (Architecture Application), §9 (Reuse-Before-Build), §11 (Testing Implications)

## Objective

Stand up the data-and-business-rule layer for the `tasks` resource: the shared `Task` type, the in-memory repository that owns the array and its newest-first insertion order, the service that validates titles and assigns `id`/`createdAt`, and the OpenAPI contract file that records the agreed request/response shapes.

## In-Scope Work

- `src/types/task.ts` — shared `Task` shape (`id: string`, `title: string`, `createdAt: string`)
- `src/repositories/tasks.repository.ts` — module-scoped in-memory array; `create(task)` unshifts (index 0) so iteration order is always newest-first by construction; `list()` returns the current array
- `src/services/tasks.service.ts` — trims and validates `title` (reject empty/whitespace, this is the authoritative check per server-side-first principle); on valid input assigns a unique `id` and ISO-8601 `createdAt`, delegates the actual write to the repository exactly once per valid call
- `contracts/tasks/tasks.yaml` — OpenAPI 3.1 file, written to match the LLD's §5 API touchpoint table (`POST /api/tasks`, `GET /api/tasks`, request/response shapes, `201`/`400`/`200`) — this task authors the contract file; it does not yet exist
- Unit tests (no HTTP) for the repository (`create()` unshifts; `list()` reflects current contents) and the service (rejects empty/whitespace title; assigns `id`/`createdAt` on valid input; delegates to repository once per valid call)

## Out-Of-Scope Work

- HTTP routing, request parsing, or response shaping (routes/controllers — see `-BACKEND-T2`)
- Express app bootstrap, CORS, JSON body-parsing middleware (see `-BACKEND-T2`)
- Editing/deleting a task, marking complete, auth/session, persistence across restarts

## Impacted Areas

| Area | Type |
|---|---|
| `src/types/task.ts` | new |
| `src/repositories/tasks.repository.ts` | new |
| `src/services/tasks.service.ts` | new |
| `contracts/tasks/tasks.yaml` | new |

## Edge Cases To Preserve

- Empty or whitespace-only `title` → service rejects before reaching the repository (`LLD-BACKEND-TASK-TRACKER-001.md` §6)
- Missing `title` field entirely → treated as equivalent to empty, same validation path
- No tasks exist yet → `list()` returns `[]`, not an error
- Rapid duplicate valid create calls → not deduplicated by the service; each valid call creates its own task (business spec assigns dedup responsibility to the client, not this layer)

## Architecture Constraints

- `AD-BACKEND-001` — TypeScript strict, `.ts` files
- `AD-BACKEND-002` — no ORM; `tasks.repository.ts` is the sole owner of the in-memory array; no persistence across restarts
- `AD-BACKEND-003` — no auth; no permission checks in the service
- `AD-BACKEND-006` — `node --test`, unit tests co-located per project convention
- `AD-X-001` — API contract format is OpenAPI 3.1 at `contracts/tasks/tasks.yaml`; this task is the one that writes it (contract does not pre-exist)
- `BACKEND-STRUCTURE.md` §Layering — repositories may only be imported by services, never by controllers directly

## Reuse Expectations

All new — first backend story, no existing backend code to reuse (`LLD-BACKEND-TASK-TRACKER-001.md` §9). `tasks.repository.ts`, `tasks.service.ts`, and the `Task` type are already at their shared layer (`repositories/`, `services/`, `types/`) — no further promotion needed; any future task-related endpoint reuses these directly instead of duplicating.

## Dependencies

None. This is the first task in the backend chain for this story — no upstream backend task exists yet.

## Implementation Notes

- Ordering is decided in exactly one place — the repository's `create()` — per the LLD's single-decision-point rule; the service and any future controller must not re-sort.
- `id` generation mechanism (e.g. `crypto.randomUUID()` vs incrementing counter) is an implementation detail per LLD §12 — any approach producing unique IDs is acceptable.
- The contract file this task writes becomes the binding shape `-BACKEND-T2` (routes/controller) and the frontend Feature-Module task consume.

## Expected Evidence

- `src/types/task.ts`, `src/repositories/tasks.repository.ts`, `src/services/tasks.service.ts`, `contracts/tasks/tasks.yaml` present and matching the LLD's touchpoint table
- Unit test files for repository and service, passing
- Task-to-code and code-to-unit-test traceability rows updated

## Test Expectations

- Repository: `create()` places new items at index 0; `list()` reflects current contents including after multiple creates
- Service: rejects empty/whitespace title without calling the repository; assigns `id` + `createdAt` on valid input; calls repository exactly once per valid call
- Success + failure + edge-case paths per LLD §11 (create → list ordering; validation rejection; repeated valid creates producing correctly-ordered results)

## Open Questions Or Blockers

None — LLD is approved and sufficiently specific for safe task derivation.
