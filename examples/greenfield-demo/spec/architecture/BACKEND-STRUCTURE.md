# Backend Structure — Data & Integration Strategy

## Agent Delta

**Role:** Supporting architecture spec for the backend layer — read alongside `ARCH-DECISIONS.md`'s `AD-BACKEND-*` section for any backend LLD, task, or scaffold work.
**Layering:** `routes/` (HTTP shape only) → `controllers/` (request/response mapping) → `services/` (business logic) → `repositories/` (data access) — strictly one direction, no layer skipping.
**Data strategy:** single in-memory array in `tasks.repository.ts`, module-scoped singleton, no persistence across process restarts — deliberate per `AD-BACKEND-002`.
**Integration strategy:** no external systems; the only boundary this backend has is its own HTTP surface, which is what `/speccraft.integration-test` exercises via `supertest`.
**Apply:** `/speccraft.tech-design` (backend LLD), `/speccraft.decompose`, `/speccraft.implement`/`/speccraft.integration-test` for `Layer: backend` tasks.

---

## Layering

| Layer | Path | Responsibility | May import from |
|---|---|---|---|
| Entry | `src/index.ts` | Express app bootstrap, middleware registration (`cors`, JSON body parsing), server listen | `src/routes/` |
| Routes | `src/routes/tasks.routes.ts` | URL + HTTP method shape only (`GET /api/tasks`, `POST /api/tasks`) — no logic | `src/controllers/` |
| Controllers | `src/controllers/tasks.controller.ts` | Parses/validates the request, calls the matching service method, shapes the HTTP response | `src/services/`, `src/types/` |
| Services | `src/services/tasks.service.ts` | Business rules (e.g. "title must be non-empty", "new tasks go to the front of the list") | `src/repositories/`, `src/types/` |
| Repositories | `src/repositories/tasks.repository.ts` | Sole owner of the in-memory array; every read/write to task data goes through here | `src/types/` |
| Types | `src/types/task.ts` | Shared `Task` shape | (none) |

Rule: a controller never touches the repository directly, and a route file never contains business logic — this keeps the eventual `contracts/tasks/tasks.yaml` mapping to exactly the controller layer, and keeps unit tests (service + repository, no HTTP) cleanly separable from integration tests (full HTTP stack via `supertest`).

## Data / Integration Strategy

- **Persistence:** none. `tasks.repository.ts` holds a single in-process array; restarting the server resets it to empty. This is a deliberate demo simplification (`AD-BACKEND-002`) — do not add a database as part of a feature task without a new `ARCH-DECISIONS.md` row.
- **Concurrency:** Node's single-threaded event loop makes the in-memory array safe for this demo's request volume; no locking needed.
- **External integrations:** none. There is no third-party API, queue, or datastore to integrate with — the only real boundary is this service's own HTTP surface.
- **Integration testing implication:** because there's no external dependency to containerize or mock, `/speccraft.integration-test` for backend tasks exercises the real Express app in-process via `supertest`, hitting real routes → controllers → services → repository, per `AD-BACKEND-006`.

## Related

- `spec/architecture/ARCH-DECISIONS.md` — `AD-BACKEND-*` (framework, data access, testing), `AD-X-001`/`AD-X-002` (contract, CORS)
- `spec/ARCHITECTURE-REFERENCES.md` — index entry for this file
- `spec/commands/speccraft.scaffold.md` §Required Folder Structure (Backend) — the folder structure this document defines is scaffolded from there
