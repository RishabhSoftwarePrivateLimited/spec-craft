# Architecture Decisions

## Agent Delta

**Role:** Locked stack authority for both layers — read before any LLD, decomposition, scaffold, or implementation work.
**Layer Scope:** `both` (see §Layer Scope below).
**Frontend (`AD-FRONTEND-*`):** Vite + React 18 + TypeScript strict, no UI/state library (plain hooks + a typed fetch client), no form library, no auth, plain CSS, Vitest + React Testing Library.
**Backend (`AD-BACKEND-*`):** Express + TypeScript strict, no ORM (in-memory array-backed repository, no persistence across restarts by design), no auth, REST/JSON, no messaging/queue, `node --test` + `supertest`.
**Cross-cutting (`AD-X-*`):** API contract = OpenAPI 3.1 at `contracts/tasks/tasks.yaml` (written by backend implementation, not pre-created); CORS allows the frontend dev origin only; no token format — this demo has no auth.
**Apply:** every LLD/task reads only its matching layer's `AD-*` section plus `AD-X-*`; do not read the other layer's section unless a task is explicitly cross-cutting.

---

## Layer Scope

**Layer Scope:** `both`

Locked once per project, before any stack is locked below — see root `README.md` §Before You Start, step 2. Determines which of `AD-FRONTEND-*` / `AD-BACKEND-*` this project populates below, and which layer(s) `/speccraft.tech-design`, `/speccraft.decompose`, `/speccraft.orchestrate`, and `/speccraft.change` produce or require artifacts for.

Answered interactively as part of setting up this demo (see `examples/LIVE-EXAMPLES-PLAN.md` §"Scope per demo" — this demo is explicitly full-stack, both `src-code-frontend/` and `src-code-backend/`, to exercise the complete FE↔BE workflow). Changing this value after `TASK-TRACKER-001`'s LLD is approved is a scope change, not a routine edit.

---

## AD-FRONTEND — Frontend Decisions

| ID | Decision | Notes |
|---|---|---|
| AD-FRONTEND-001 | **Framework:** Vite + React 18, TypeScript in `strict` mode | Scaffolded via `npm create vite@latest . -- --template react-ts` — see `spec/commands/speccraft.scaffold.md` |
| AD-FRONTEND-002 | **UI library:** none | App is two small screens (task list + create-task form); a component library would add weight with no payoff at this scope. Revisit if the demo grows more screens. |
| AD-FRONTEND-003 | **State management:** React built-in hooks (`useState`/`useEffect`) only, plus a small typed API client module (`src/api/tasksClient.ts`) | No Redux/Zustand/Context — one shared list, one owner component (`App.tsx`), no cross-tree state sharing need |
| AD-FRONTEND-004 | **Forms:** plain controlled inputs, no form library | Single free-text `title` field for task creation; no validation library needed beyond "non-empty" |
| AD-FRONTEND-005 | **Auth/session model:** none | Out of scope for this demo — see BRD non-goals. Every route/component is public. |
| AD-FRONTEND-006 | **Styling:** plain CSS, one global stylesheet (`src/index.css`) | No CSS-in-JS, no utility framework — kept light on purpose |
| AD-FRONTEND-007 | **Testing framework:** Vitest + React Testing Library, run via `npm test` | Pairs natively with Vite; no separate test runner to configure |

## AD-BACKEND — Backend Decisions

| ID | Decision | Notes |
|---|---|---|
| AD-BACKEND-001 | **Framework:** Express (Node.js) + TypeScript in `strict` mode, `ts-node` for dev | See `spec/commands/speccraft.scaffold.md` for install commands |
| AD-BACKEND-002 | **ORM / data-access layer:** none — a single in-memory array-backed repository module (`src/repositories/tasks.repository.ts`) | No database. Deliberate: keeps `npm install && npm test` dependency-free for the demo, and matches the BRD's explicit non-goal of persistence across restarts |
| AD-BACKEND-003 | **Auth/session model:** none | Out of scope for this demo — see BRD non-goals |
| AD-BACKEND-004 | **API style:** REST, JSON request/response bodies | `GET /api/tasks`, `POST /api/tasks` — see `contracts/tasks/tasks.yaml` once backend implementation writes it |
| AD-BACKEND-005 | **Messaging / queue:** none | No async processing needed at this scope |
| AD-BACKEND-006 | **Testing framework:** Node's built-in test runner (`node --test`) + `supertest` for HTTP-level assertions | Matches this repo's own `test/` convention (see root `package.json` `"test": "node --test test/"`); `supertest` drives real HTTP requests against the Express app rather than mocking the route layer |

## AD-X — Cross-Cutting Decisions

| ID | Decision | Notes |
|---|---|---|
| AD-X-001 | **API contract:** OpenAPI 3.1, stored at `contracts/tasks/tasks.yaml` — one growing file for the `tasks` module, reference-only, no codegen wired into `/speccraft.scaffold` | Does not pre-exist; written/updated by backend `/speccraft.implement` to match the approved `LLD-BACKEND-TASK-TRACKER-001.md` touchpoint table |
| AD-X-002 | **CORS policy:** backend allows the frontend's local dev origin only (`http://localhost:5173`, Vite's default port); credentials not required (no auth) | Configured via the `cors` package in `src-code-backend/src/index.ts` |
| AD-X-003 | **Token format:** Not Applicable | No auth/session in this demo — see AD-FRONTEND-005 / AD-BACKEND-003 |

---

## Related

- `spec/ARCHITECTURE-REFERENCES.md` — index of this file plus the supporting architecture spec files (`FRONTEND-STRUCTURE.md`, `BACKEND-STRUCTURE.md`)
- `spec/commands/speccraft.scaffold.md` — install commands and folder structure derived from the decisions above
- `spec/business/tasks/BRD.md`, `spec/business/tasks/TASK-TRACKER-001.md` — the business input these decisions support
