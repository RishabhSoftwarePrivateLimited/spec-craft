# TASK-TASK-TRACKER-001-FRONTEND-T1

## Metadata

| Field | Value |
|---|---|
| Task ID | TASK-TASK-TRACKER-001-FRONTEND-T1 |
| Layer | frontend |
| Title | Tasks feature module — API client, types, composition root |
| Task Shape | Feature-Module Task |
| Current State | approved |
| Estimated Complexity | small |

## Source Requirement References

REQ-TASK-TRACKER-001-01, REQ-TASK-TRACKER-001-02, REQ-TASK-TRACKER-001-03, REQ-TASK-TRACKER-001-04, AC-TASK-TRACKER-001-01 through AC-TASK-TRACKER-001-05

## Source LLD References

`LLD-FRONTEND-TASK-TRACKER-001.md` §5 (Route impact, Module ownership, Server/client boundary, State ownership table, Rendering strategy, API touchpoint table), §8 (Architecture Application), §9 (Reuse-Before-Build)

## Objective

Stand up the data-and-orchestration layer for the task tracker screen: the shared `Task` type, the typed API client that is the only fetch seam, and `App.tsx` as the composition root that owns list state, fetches on mount, and handles create.

## In-Scope Work

- `src/types/task.ts` — shared `Task` shape, mirroring the backend contract (`id`, `title`, `createdAt`) per the companion-checked LLD touchpoint table
- `src/api/tasksClient.ts` — typed `fetch` wrapper: `listTasks()` (`GET /api/tasks`), `createTask(title)` (`POST /api/tasks`); the only file that calls `fetch`
- `src/App.tsx` — composition root; owns `tasks: Task[]` state; fetches the list on mount (`useEffect`) and stores it; on successful create, unshifts the returned task onto local state (no re-fetch); owns `listError`; renders `TaskForm` and `TaskList`, passing data/callbacks as props (never lets them call `tasksClient.ts` directly)
- `src/main.tsx` — Vite/React bootstrap, renders `App.tsx`
- `src/index.css` — base/global styling only (layout container, base loading-indicator styling); component-specific classes are added by their own Component-Slice tasks
- Unit/integration-style tests (still unit-level per `AD-FRONTEND-007`) for `App.tsx`: fetches list on mount and renders it; on successful create, new task appears at top without a re-fetch call; on failed initial fetch, shows the error banner

## Out-Of-Scope Work

- `TaskForm`/`TaskList` component markup, local component state, or component-level CSS (see `-FRONTEND-T2` / `-FRONTEND-T3`)
- Editing/deleting a task, marking complete, auth/session, any persistence concern (owned entirely by the backend)

## Impacted Areas

| Area | Type |
|---|---|
| `src/main.tsx` | new |
| `src/App.tsx` | new |
| `src/api/tasksClient.ts` | new |
| `src/types/task.ts` | new |
| `src/index.css` | new (base styles only) |

## Edge Cases To Preserve

- Network/server failure on initial list fetch → catch, set `listError`, keep `tasks` as last-known (empty on first load); inline error banner (`LLD-FRONTEND-TASK-TRACKER-001.md` §6)
- Initial load in flight → show a lightweight loading indicator instead of an empty list, to distinguish "loading" from "no tasks" (§10)
- No tasks exist yet → `TaskList` renders its own empty state (owned by `-FRONTEND-T3`); `App.tsx` must pass the fetched (possibly empty) array through without inventing its own empty-state UI

## Architecture Constraints

- `AD-FRONTEND-001` — Vite + React 18 + TS strict
- `AD-FRONTEND-003` — hooks only (`useState`/`useEffect`), no state library; `tasksClient.ts` is the one API seam
- `AD-FRONTEND-005` — no auth; no route guards, no session state
- `AD-FRONTEND-006` — plain CSS in `src/index.css` only, no CSS-in-JS
- `AD-FRONTEND-007` — Vitest + RTL
- `FRONTEND-STRUCTURE.md` §Module Boundaries — `App.tsx` → `components/`; `App.tsx`/`components/` → `api/`/`types/`; components must never import `tasksClient.ts` directly
- `AD-X-001` — no contract file exists yet at task-authoring time from the frontend's perspective; this task consumes the companion-checked `LLD-BACKEND-TASK-TRACKER-001.md` §5 touchpoint table as the interim mock shape until the real `contracts/tasks/tasks.yaml` (written by `-BACKEND-T1`) is available

## Reuse Expectations

`tasksClient.ts` and the `Task` type are already at their shared layer (`api/`, `types/`) — reusable by any future task-related screen without further promotion (`LLD-FRONTEND-TASK-TRACKER-001.md` §9).

## Dependencies

None (no other frontend task precedes this — it is the frontend chain's first task). No cross-layer dependency is recorded against `TASK-TASK-TRACKER-001-BACKEND-T1`/`-T2`: this task consumes the companion-checked LLD-BACKEND touchpoint table as an interim mock shape and can proceed in parallel with backend implementation, per the Feature-Module task shape's mock-first design.

## Implementation Notes

- The backend guarantees newest-first ordering via repository insertion order (companion LLD §5/§14); this task must not re-sort — it only needs to place one new item at index 0 on create.
- `TaskForm`/`TaskList` (from `-FRONTEND-T2`/`-T3`) depend on this task's exported props/callbacks shape from `App.tsx`.

## Expected Evidence

- `src/main.tsx`, `src/App.tsx`, `src/api/tasksClient.ts`, `src/types/task.ts`, `src/index.css` (base styles) present
- Unit tests for `App.tsx` passing
- Task-to-code and code-to-unit-test traceability rows updated

## Test Expectations

- Fetches list on mount and renders it
- On successful create, new task appears at top of local state without a re-fetch call
- On failed initial fetch, shows the error banner
- Success + failure + edge-case paths per LLD §11

## Open Questions Or Blockers

None — LLD is approved and sufficiently specific for safe task derivation.
