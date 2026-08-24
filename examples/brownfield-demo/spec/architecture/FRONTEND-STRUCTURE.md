# Frontend Structure — Routing & Module Boundaries (Discovered)

## Agent Delta

**Role:** Supporting architecture spec for the frontend layer — read alongside `ARCH-DECISIONS.md`'s `AD-FRONTEND-*` section for any frontend LLD, task, or scaffold work.
**Discovered via:** `/speccraft.onboard` — this file documents the module boundaries and routing shape already present in `src-code-frontend/`, not a designed decision. See each section's Evidence for file:line citations.
**Routing:** single-page app, no router library found — one screen, no navigation.
**Module boundaries:** `src/api/` (HTTP calls only) → `src/components/` (presentation + local state) → `src/types/` (shared shapes); `App.tsx` is the sole composition root. Components never call `fetch` directly — always through `src/api/tasksClient.ts`.
**Apply:** any frontend LLD, `/speccraft.decompose`, `/speccraft.implement` for `Layer: frontend` tasks.

---

## Routing Conventions

No router library is present (`src-code-frontend/package.json` — no `react-router-dom` or equivalent dependency). `src/main.tsx` renders `App.tsx` directly, which renders the single task-tracker screen with no navigation.

If a future story adds a second screen, lock a router decision as a new `AD-FRONTEND-00N` row in `ARCH-DECISIONS.md` before adding one — do not add a routing library silently as part of a feature task.

## Module Boundaries

| Layer | Path | Responsibility | May import from |
|---|---|---|---|
| Entry | `src/main.tsx` | Vite/React bootstrap only | `App.tsx` |
| Composition | `src/App.tsx` | Renders `TaskList` + `TaskForm`, owns the `tasks` state and the create/refresh handlers | `src/components/`, `src/api/`, `src/types/` |
| Components | `src/components/TaskList.tsx`, `src/components/TaskForm.tsx` | Presentation + local (per-component) UI state only — no direct API calls | `src/types/` |
| API client | `src/api/tasksClient.ts` | Typed `fetch` wrapper for the backend `tasks` API only — the single seam between frontend and backend | `src/types/` |
| Types | `src/types/task.ts` | Shared `Task` shape, mirrors the backend's shape | (none) |

Evidence: `src/App.tsx:1-5` imports `TaskList`, `TaskForm`, `tasksClient`, `types/task`; `src/components/TaskForm.tsx` and `src/components/TaskList.tsx` each import only from `../types/task`, neither imports `../api/tasksClient`; `src/api/tasksClient.ts:1` imports only `../types/task`.

**Rule observed in the existing code:** dependencies flow one direction only — `App.tsx` → `components/` and `App.tsx`/`components/` → `api/`/`types/`. Components never import `api/tasksClient.ts` directly; all data flows through props from `App.tsx` (`TaskForm`'s `onCreate` prop, `TaskList`'s `tasks` prop). Preserve this direction for any new frontend work — it keeps the API seam in exactly one place.

## Related

- `spec/architecture/ARCH-DECISIONS.md` — `AD-FRONTEND-*` (framework, state, styling, testing), `AD-X-001` (API contract)
- `spec/ARCHITECTURE-REFERENCES.md` — index entry for this file
- `src-code-frontend/rules/conventions.md`, `src-code-frontend/skills/component-creation.md` — finer-grained discovered conventions (naming, testing, data-fetching) that complement this file's module-boundary documentation
