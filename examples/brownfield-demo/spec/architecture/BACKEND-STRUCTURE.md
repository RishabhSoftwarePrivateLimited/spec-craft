# Backend Structure — Data & Integration Strategy (Discovered)

## Agent Delta

**Role:** Supporting architecture spec for the backend layer — read alongside `ARCH-DECISIONS.md`'s `AD-BACKEND-*` section for any backend LLD, task, or scaffold work.
**Discovered via:** `/speccraft.onboard` — this file documents the layering and data strategy already present in `src-code-backend/`, not a designed decision. See each section's Evidence for file:line citations.
**Layering:** `routes/` (HTTP shape only) → `controllers/` (request/response mapping) → `services/` (business logic) → `repositories/` (data access) — one direction, no layer skipping, per the existing code.
**Data strategy:** single in-memory array in `tasks.repository.ts`, module-scoped, no persistence across process restarts (`AD-BACKEND-002`).
**Integration strategy:** no external systems found in the scan; the only boundary is this backend's own HTTP surface.
**Apply:** any backend LLD, `/speccraft.decompose`, `/speccraft.implement`/`/speccraft.integration-test` for `Layer: backend` tasks.

---

## Layering

| Layer | Path | Responsibility | May import from |
|---|---|---|---|
| Entry | `src/index.ts` | Express app bootstrap, middleware registration (`cors`, JSON body parsing), server listen | `src/routes/` |
| Routes | `src/routes/tasks.routes.ts` | URL + HTTP method shape only (`GET /api/tasks`, `POST /api/tasks`) — no logic | `src/controllers/` |
| Controllers | `src/controllers/tasks.controller.ts` | Parses/validates the request, calls the matching service function, shapes the HTTP response | `src/services/` |
| Services | `src/services/tasks.service.ts` | Business rules (title required/non-empty, new tasks placed at the front of the list) | `src/repositories/`, `src/types/` |
| Repositories | `src/repositories/tasks.repository.ts` | Sole owner of the in-memory array; every read/write to task data goes through here | `src/types/` |
| Types | `src/types/task.ts` | Shared `Task` shape | (none) |

Evidence: `src/index.ts:3,14` imports and mounts `tasksRouter`; `src/routes/tasks.routes.ts:2` imports only from `../controllers/tasks.controller`; `src/controllers/tasks.controller.ts:2` imports only `../services/tasks.service`, never the repository directly; `src/services/tasks.service.ts:3` imports `../repositories/tasks.repository`.

**Rule observed in the existing code:** a controller never touches the repository directly, and the route file carries no logic. Preserve this direction for any new backend work — it keeps unit tests (service + repository, no HTTP) cleanly separable from integration tests (full HTTP stack via `supertest`).

## Data / Integration Strategy

- **Persistence:** none found. `src/repositories/tasks.repository.ts:3` holds a single in-process array (`const tasks: Task[] = []`); restarting the server resets it to empty. Treat this as an existing condition to confirm or evolve deliberately (`AD-BACKEND-002`) — do not add a database as part of a feature task without a new `ARCH-DECISIONS.md` row.
- **Concurrency:** no locking code found; Node's single-threaded event loop makes the in-memory array safe for this codebase's current request volume.
- **External integrations:** none found in the scan — no third-party API client, queue, or datastore driver present in either `package.json`.
- **Integration testing implication:** `test/integration/tasks.integration.test.ts` already exercises the real Express app in-process via `supertest` (per `AD-BACKEND-007`), consistent with there being no external dependency to containerize or mock.

## Related

- `spec/architecture/ARCH-DECISIONS.md` — `AD-BACKEND-*` (framework, data access, testing), `AD-X-001`/`AD-X-002` (contract, CORS)
- `spec/ARCHITECTURE-REFERENCES.md` — index entry for this file
- `src-code-backend/rules/conventions.md`, `src-code-backend/skills/endpoint-creation.md` — finer-grained discovered conventions (naming, validation pattern, testing) that complement this file's layering documentation
