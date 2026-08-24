# Frontend Structure — Routing & Module Boundaries

## Agent Delta

**Role:** Supporting architecture spec for the frontend layer — read alongside `ARCH-DECISIONS.md`'s `AD-FRONTEND-*` section for any frontend LLD, task, or scaffold work.
**Routing:** single-page app, no router library — one screen, no navigation. Add `react-router-dom` (and a new `AD-FRONTEND-*` row recording it) only if a second route is ever needed.
**Module boundaries:** `src/api/` (HTTP calls only) → `src/components/` (presentation + local state) → `src/types/` (shared shapes); `App.tsx` is the sole composition root. Components never call `fetch` directly — always through `src/api/tasksClient.ts`.
**Apply:** `/speccraft.tech-design` (frontend LLD), `/speccraft.decompose`, `/speccraft.implement` for `Layer: frontend` tasks.

---

## Routing Conventions

This demo has exactly one screen (the task tracker view), so there is no router. `App.tsx` renders the screen directly.

If a future story adds a second screen (e.g. a task detail view), lock a router decision as a new `AD-FRONTEND-00N` row in `ARCH-DECISIONS.md` before adding one — do not add a routing library silently as part of a feature task.

## Module Boundaries

| Layer | Path | Responsibility | May import from |
|---|---|---|---|
| Entry | `src/main.tsx` | Vite/React bootstrap only | `App.tsx` |
| Composition | `src/App.tsx` | Renders `TaskList` + `TaskForm`, owns the `tasks` state and the create/refresh handlers | `src/components/`, `src/api/`, `src/types/` |
| Components | `src/components/TaskList.tsx`, `src/components/TaskForm.tsx` | Presentation + local (per-component) UI state only — no direct API calls | `src/types/` |
| API client | `src/api/tasksClient.ts` | Typed `fetch` wrapper for the backend `tasks` API only — the single seam between frontend and backend | `src/types/` |
| Types | `src/types/task.ts` | Shared `Task` shape, mirrors the backend's contract | (none) |

Rule: dependencies flow one direction only — `App.tsx` → `components/` and `App.tsx`/`components/` → `api/`/`types/`. Components must never import `api/tasksClient.ts` directly; all data flows through props from `App.tsx`. This keeps the API seam in exactly one place, which matters once `contracts/tasks/tasks.yaml` exists and needs a single call site to update.

## Related

- `spec/architecture/ARCH-DECISIONS.md` — `AD-FRONTEND-*` (framework, state, styling, testing), `AD-X-001` (API contract)
- `spec/ARCHITECTURE-REFERENCES.md` — index entry for this file
- `spec/commands/speccraft.scaffold.md` §Required Folder Structure (Frontend) — the folder structure this document defines is scaffolded from there
