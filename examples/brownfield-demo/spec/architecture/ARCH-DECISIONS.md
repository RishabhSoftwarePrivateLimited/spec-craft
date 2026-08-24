# Architecture Decisions

## Agent Delta

**Role:** Locked stack authority for both layers — read before any LLD, decomposition, scaffold, or implementation work.
**Layer Scope:** `both` (see §Layer Scope below).
**Frontend (`AD-FRONTEND-*`):** React 19 + Vite, no UI/state library (plain hooks), no form library, no auth, plain global CSS, TypeScript, Vitest + React Testing Library.
**Backend (`AD-BACKEND-*`):** Express 5 + TypeScript, no ORM (in-memory array-backed repository), no auth, REST/JSON, no messaging/queue, `node --test` + `supertest`.
**Cross-cutting (`AD-X-*`):** No formal API contract schema yet (plain REST/JSON by convention); CORS allows the frontend dev origin only; no token format — no auth in either layer.
**Discovered via:** `/speccraft.onboard` — this file was populated by scanning existing code in `src-code-frontend/` and `src-code-backend/`, not hand-authored from a blank stack choice. See each row's Evidence column.
**Apply:** every LLD/task reads only its matching layer's `AD-*` section plus `AD-X-*`; do not read the other layer's section unless a task is explicitly cross-cutting.

---

## Layer Scope

**Layer Scope:** `both`

Locked once per project, before any stack is locked below — see root `README.md` §Before You Start, step 2. Determines which of `AD-FRONTEND-*` / `AD-BACKEND-*` this project populates below, and which layer(s) `/speccraft.tech-design`, `/speccraft.decompose`, `/speccraft.orchestrate`, and `/speccraft.change` produce or require artifacts for.

Answered interactively via `/speccraft.onboard` against pre-existing code in both `src-code-frontend/` and `src-code-backend/`. Changing this value after any story's LLD has been approved is a scope change, not a routine edit — reconcile any already-produced artifacts of a dropped layer manually; no automated migration exists for this.

---

## AD-FRONTEND — Frontend Decisions

| ID | Decision | Evidence |
|---|---|---|
| AD-FRONTEND-001 | **Framework:** React 19 + Vite | `src-code-frontend/package.json:14`, `src-code-frontend/vite.config.ts:2` |
| AD-FRONTEND-002 | **UI library:** none — plain CSS, no component library | `src-code-frontend/src/index.css`; no UI-library dependency in `package.json` |
| AD-FRONTEND-003 | **State management:** React built-in hooks only (`useState`/`useEffect`), no external store | `src-code-frontend/src/App.tsx:8-10` |
| AD-FRONTEND-004 | **Forms:** plain controlled inputs, no form library | `src-code-frontend/src/components/TaskForm.tsx:9,43-50` |
| AD-FRONTEND-005 | **Auth/session model:** none present | no auth code found anywhere in scan |
| AD-FRONTEND-006 | **Styling:** plain global CSS file | `src-code-frontend/src/index.css` |
| AD-FRONTEND-007 | **Typing:** TypeScript | `src-code-frontend/package.json:27`, `src-code-frontend/tsconfig.json` |
| AD-FRONTEND-008 | **Test framework:** Vitest + React Testing Library | `src-code-frontend/package.json:19-21,29`, `src-code-frontend/vite.config.ts:8-13` |

## AD-BACKEND — Backend Decisions

| ID | Decision | Evidence |
|---|---|---|
| AD-BACKEND-001 | **Framework:** Express 5 | `src-code-backend/package.json:17`, `src-code-backend/src/index.ts:1,5` |
| AD-BACKEND-002 | **ORM/data-access layer:** none — in-memory array behind a repository module | `src-code-backend/src/repositories/tasks.repository.ts:3` |
| AD-BACKEND-003 | **Auth/session model:** none present | no auth code found anywhere in scan |
| AD-BACKEND-004 | **API style:** REST/JSON | `src-code-backend/src/routes/tasks.routes.ts:6-7` |
| AD-BACKEND-005 | **Messaging/queue:** none present | no queue/broker dependency in `package.json` |
| AD-BACKEND-006 | **Typing:** TypeScript | `src-code-backend/package.json:26`, `src-code-backend/tsconfig.json` |
| AD-BACKEND-007 | **Test framework:** Node built-in `node:test` + Supertest for HTTP integration | `src-code-backend/package.json:9,24`, `src-code-backend/test/integration/tasks.integration.test.ts:1-3` |

## AD-X — Cross-Cutting Decisions

| ID | Decision | Evidence |
|---|---|---|
| AD-X-001 | **API contract:** plain REST/JSON, no OpenAPI/GraphQL schema present; frontend client matches backend routes by convention only | `src-code-frontend/src/api/tasksClient.ts:6,16`, `src-code-backend/src/routes/tasks.routes.ts:6-7` |
| AD-X-002 | **CORS policy:** explicit single-origin allowlist for the Vite dev server | `src-code-backend/src/index.ts:7` (`origin: 'http://localhost:5173'`) |
| AD-X-003 | **Token format:** Not Applicable — no auth/session in either layer | no evidence found — see AD-FRONTEND-005 / AD-BACKEND-003 |

---

## Agent Delta — Onboarding Provenance

Populated by `/speccraft.onboard` on 2026-08-14 against pre-existing code in `src-code-frontend/` and `src-code-backend/`. All rows above are discovered facts with file:line evidence, not designed decisions — treat gaps (no auth, no ORM, no API contract schema) as existing conditions to confirm or evolve deliberately, not defaults to leave unquestioned.

---

## Related

- `spec/ARCHITECTURE-REFERENCES.md` — index of this file plus any supporting architecture spec files
- `spec/commands/speccraft.onboard.md` — the command that discovered and proposed the content above
- `src-code-frontend/rules/`, `src-code-frontend/skills/`, `src-code-backend/rules/`, `src-code-backend/skills/` — Tier 2 conventions discovered alongside these decisions
