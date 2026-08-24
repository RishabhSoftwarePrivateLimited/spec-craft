# LLD-FRONTEND-TASK-TRACKER-002

## 1. Metadata

| Field | Value |
|---|---|
| LLD ID | LLD-FRONTEND-TASK-TRACKER-002 |
| Business Spec Reference | `spec/business/tasks/TASK-TRACKER-002.md` |
| Work Item Reference | TASK-TRACKER-002 |
| Status | `approved` |
| Last Updated | 2026-08-14 |
| API Spec Reference | Not yet created — `contracts/tasks/tasks.yaml` does not exist for this project (no prior story wrote one; the pre-existing app was onboarded, not delivered through this workflow); binding shape for this story is the touchpoint table in §5 of this LLD and its companion, cross-checked in §14, until backend `/speccraft.implement` writes the real file |
| Design Reference | None provided at intake |
| Depends On | None (extends pre-existing, onboarded code — see `spec/business/tasks/BRD.md` "Already Delivered") |

## 2. Purpose And Scope

**In scope:** extending the existing task list view so a user can toggle a task's completion state and see completed tasks visually distinguished — REQ-TASK-TRACKER-002-01 through -04.

**Out of scope:** deleting/editing a task, re-sorting or filtering by completion state, auth/session/per-user ownership, any persistence concern (owned entirely by the backend, unchanged).

## 3. Source Requirements

- REQ-TASK-TRACKER-002-01, REQ-TASK-TRACKER-002-02, REQ-TASK-TRACKER-002-03, REQ-TASK-TRACKER-002-04
- AC-TASK-TRACKER-002-01, AC-TASK-TRACKER-002-02, AC-TASK-TRACKER-002-03, AC-TASK-TRACKER-002-04, AC-TASK-TRACKER-002-05

Same IDs cited by `LLD-BACKEND-TASK-TRACKER-002.md` — one shared intake pass, no per-layer fork.

## 4. Functional Understanding

Single anonymous user role (no auth — `AD-FRONTEND-005`, unchanged). Behavior path:

1. The existing task list (`TaskList`, delivered by the pre-existing app) renders each task with a new toggle control (e.g. a checkbox) alongside its title.
2. The user clicks the toggle control for a task.
3. The frontend sends the task's *target* completion state (not a bare "flip") to the backend, so a duplicate click (e.g. accidental double-click) is idempotent rather than flipping twice.
4. On success, the one affected task's `completed` field is updated in local state, in place — no re-fetch of the whole list, no re-sort, no position change (REQ-04).
5. The task's row renders with a visual "completed" treatment (e.g. strikethrough title) when `completed` is `true`.
6. On a server-side rejection (task id no longer exists) or a network failure, an inline error is shown and the task's displayed state reverts to its last-known server value (no optimistic-update desync).

No role variation, no state-transition diagram needed beyond this linear flow — same flatness as the existing `TASK-TRACKER-001`-shape stories.

## 5. Frontend Design Decisions

**Route impact:** none — still the single existing screen, no router (`FRONTEND-STRUCTURE.md` §Routing Conventions, unchanged).

**Module ownership:** extends existing modules; no new files. Follows the existing module boundary discovered by `/speccraft.onboard`: `src/api/` → `src/components/` → `src/types/`, with `App.tsx` as sole composition root (`FRONTEND-STRUCTURE.md` §Module Boundaries).

**Server/client boundary:** `src/api/tasksClient.ts` remains the only file that calls `fetch` — extended with one new function, not a new client module. `TaskList` never calls the API directly — it receives the toggle callback as a prop from `App.tsx`, matching the existing `TaskForm`/`onCreate` pattern.

**State ownership table:**

| State | Owner | Rule |
|---|---|---|
| `tasks: Task[]` | `App.tsx` (existing) | Unchanged ownership; this story updates one array element in place on a successful toggle, never re-sorts, never re-fetches the whole list |
| `task.completed` (per item) | `App.tsx`'s `tasks` state, via the existing single source of truth | Not owned locally by `TaskList` — `TaskList` only renders what it's given, consistent with its existing presentational-only role |
| Per-item toggle-in-flight indicator | `TaskList.tsx` (new, local) | Local, transient; disables that row's toggle control while its own request is in flight — prevents the exact double-toggle desync named in the business spec's Edge Cases |

**Rendering strategy:** on toggle, `App.tsx`'s new `handleToggleComplete(id, completed)` calls the API client with the *target* state (not a flip), then — on success — replaces that one task object in the existing `tasks` array (same index, same array order) with the updated object returned by the backend. This satisfies REQ-04 (no position change) without needing a dedicated "don't re-sort" branch — the update is a single in-place replace, and the array's order was never touched.

**Validation strategy:** none needed client-side beyond disabling the control while in flight — `completed` is a boolean toggle, not a free-text field; the authoritative check (task exists) is server-side (AC-05).

**API touchpoint table:**

| Operation | Method | Path | Request Shape | Success Shape | Error Codes |
|---|---|---|---|---|---|
| Update task completion | PATCH | `/api/tasks/:id` | `{ completed: boolean }` | `200` → `{ id: string, title: string, createdAt: string, completed: boolean }` | `404` → `{ error: string }` (task id not found); `400` → `{ error: string }` (`completed` not a boolean) |

This table's shape is agreed with `LLD-BACKEND-TASK-TRACKER-002.md` §5 — see §14. Existing `POST`/`GET /api/tasks` touchpoints (from the pre-existing app) are unchanged except that their response bodies now also include `completed` (see §7 Impacted Areas).

## 6. Edge Cases

| Error / Condition | Source | Handling Strategy | User-Facing Outcome |
|---|---|---|---|
| Toggling a task id that no longer exists | `PATCH /api/tasks/:id` returns `404` | Show an inline error near that row; revert the row's displayed state to its last-known value (do not leave it showing the optimistic/attempted state) | Inline error, e.g. "Couldn't update this task" |
| Rapid double-click of the same task's toggle control | Client-side | Disable that row's toggle control while its own request is in flight (per-row `isToggling` state, not a global lock) | Second click is a no-op; exactly one request sent per intended toggle |
| Network/server failure on toggle | `fetch` rejects or non-2xx with unparseable body | Catch, show inline error, revert displayed state, re-enable the control | Inline error near the affected row; list otherwise unaffected |
| List currently empty | No tasks to toggle | Not a special case — the existing empty-state message (G2) already covers this; no toggle controls render because no rows render | Unchanged from existing behavior |

## 7. Impacted Areas

| Area | Type | Notes |
|---|---|---|
| `src/types/task.ts` | direct, existing | Add `completed: boolean` to the `Task` interface |
| `src/api/tasksClient.ts` | direct, existing | Add `updateTaskCompletion(id, completed)`; existing `listTasks()`/`createTask()` unchanged (their response bodies now include `completed`, but the client doesn't need to do anything differently to pass it through) |
| `src/components/TaskList.tsx` | direct, existing | Add a toggle control per row, an `onToggleComplete` prop, per-row in-flight state, and a "completed" visual treatment |
| `src/App.tsx` | direct, existing | Add `handleToggleComplete`; pass it to `TaskList` as `onToggleComplete` |
| `src/index.css` | direct, existing | Add a `.task-list__item--completed` (or similar) class for the visual treatment |
| `src/components/TaskForm.tsx` | none | Untouched — creation flow is unaffected by this story |

No indirect impacted areas beyond the above — this story only touches the existing `tasks` list rendering and its owning composition root.

## 8. Architecture Application

- **AD-FRONTEND-001** (React 19 + Vite) — no deviation; all changes are `.tsx`/`.ts` edits to existing files.
- **AD-FRONTEND-002** (no UI library) — the toggle control is a plain `<input type="checkbox">` or `<button>`, styled via `index.css` only, no component library introduced.
- **AD-FRONTEND-003** (hooks only, one API seam) — the new per-row in-flight state uses `useState`; `tasksClient.ts` remains the one seam, extended rather than duplicated.
- **AD-FRONTEND-004** (no form library) — not applicable to a checkbox toggle; consistent with the existing no-form-library decision regardless.
- **AD-FRONTEND-005** (no auth) — no guard added; every toggle is unconditionally available, matching the existing app.
- **AD-FRONTEND-006** (plain CSS) — new class added to the existing `src/index.css`, no new stylesheet.
- **AD-FRONTEND-008** (Vitest + RTL) — see §11 Testing Implications.
- **`FRONTEND-STRUCTURE.md` module boundaries** — dependency direction preserved: `App.tsx` → `components/`; `App.tsx`/`components/` → `api/`/`types/`; `TaskList` never imports `tasksClient.ts` directly (enforced by passing the callback as a prop from `App.tsx`, same as the existing `TaskForm`/`onCreate` pattern).
- **AD-X-001** (no formal contract schema) — this LLD's §5 touchpoint table is the binding shape, same convention the pre-existing app already used for its two existing endpoints (no OpenAPI file exists for this project; not introduced by this story either).

## 9. Reuse-Before-Build Decisions

**Reuse table:**

| Existing Artifact | Import Path | Used By |
|---|---|---|
| `Task` type | `src/types/task.ts` | Extended in place (new `completed` field), not duplicated |
| `tasksClient.ts`'s existing `fetch` pattern | `src/api/tasksClient.ts` | New `updateTaskCompletion` function follows the exact same shape as the existing `listTasks`/`createTask` (typed Promise, throws `Error` with server message on non-2xx) |
| `TaskList.tsx` | `src/components/TaskList.tsx` | Extended in place — new prop and per-row control added to the existing component, not a new component |
| `App.tsx`'s existing state-ownership pattern | `src/App.tsx` | New handler follows the same shape as the existing `handleCreate` (calls the client, updates local `tasks` state, no re-fetch) |

**Create table:**

| New Artifact | Target Path | Reusable Beyond This Feature | Promotion Target |
|---|---|---|---|
| _(none)_ | — | This story adds no new files — everything is an extension of an existing artifact | — |

This is the first story since `/speccraft.onboard` — every reuse candidate above is the pre-existing, discovered code, not prior workflow output.

## 10. State And UX States

| Scenario | Component/Unit Affected | Expected Behavior |
|---|---|---|
| Toggle click, request in flight | `TaskList.tsx` (per-row) | That row's toggle control is disabled; no visible change to `completed` state yet |
| Toggle succeeds | `TaskList.tsx` / `App.tsx` | Row updates to the new `completed` state immediately (strikethrough or equivalent applied/removed); list order unchanged; control re-enabled |
| Toggle fails (404 or network) | `TaskList.tsx` | Row reverts to its last-known state, inline error shown near that row, control re-enabled so the user can retry |
| Mixed list (some completed, some not) | `TaskList.tsx` | Each row's visual treatment reflects only its own `completed` value — no cross-row effect |

## 11. Testing Implications

Per `AD-FRONTEND-008` (Vitest + RTL), extending the existing test suites rather than starting new ones:

- `TaskList.test.tsx` (existing file, extended): renders a completed task with the "completed" visual treatment applied and an incomplete task without it; clicking a row's toggle calls `onToggleComplete` with that task's id and the target (opposite) boolean; the control is disabled while its own toggle is in flight and re-enabled after; list order is unchanged after a toggle (asserted by checking row order before/after, not just presence).
- `App.test.tsx` (existing file, extended): a successful toggle updates only the affected task's rendered state, in the same list position, without re-fetching (`listTasks` call count unchanged from before the toggle); a failed toggle shows an inline error and leaves the task's rendered state unchanged from before the attempt.
- Critical flows needing coverage: complete→incomplete and incomplete→complete round trip (AC-01, AC-02); visual distinction present for completed tasks (AC-03); no position change after toggle (AC-04); error path for a toggle against a task id that no longer exists (AC-05, simulated via a mocked rejected `updateTaskCompletion` call — the real 404 path is backend/integration-test territory).

## 12. Open Questions And Assumptions

**Assumptions:**
- The toggle control is a plain checkbox (or equivalent button), not a separate "Mark Complete"/"Mark Incomplete" pair of buttons — simplest UI consistent with AD-FRONTEND-002 (no UI library) and the BRD's minimal-footprint intent.
- The exact visual treatment for "completed" (strikethrough vs. dimmed text vs. a badge) is left to implementation; strikethrough is assumed as the simplest CSS-only option consistent with `AD-FRONTEND-006`.
- No confirmation dialog before toggling — this is a low-stakes, fully reversible action (unlike delete, which is out of scope anyway).

**Open Questions:** none blocking — business spec and discovered architecture are sufficient to design against.

## 13. Traceability Summary

| Requirement/AC | LLD Section | Coverage |
|---|---|---|
| REQ-TASK-TRACKER-002-01, AC-01 | §5 (Rendering strategy), §10 | Covered |
| REQ-TASK-TRACKER-002-02, AC-02 | §5 (Rendering strategy — same toggle path both directions), §10 | Covered |
| REQ-TASK-TRACKER-002-03, AC-03 | §5 (Rendering strategy — visual treatment), §7 (`index.css`) | Covered |
| REQ-TASK-TRACKER-002-04, AC-04 | §5 (Rendering strategy — in-place replace, no re-sort) | Covered |
| AC-05 (server-side check, this LLD's contribution: surfacing the resulting error) | §6 (Edge Cases — 404 handling) | Covered |

No uncovered requirements for this layer.

## 14. Companion LLD Reference

Companion: `LLD-BACKEND-TASK-TRACKER-002.md`.

Cross-layer contract dependency: this LLD's §5 API touchpoint table (`PATCH /api/tasks/:id` request/response shapes, status codes `200`/`400`/`404`) must match the companion's §5 API touchpoint table exactly — field names (`id`, `title`, `createdAt`, `completed`), the "target state, not flip" request semantics (owned by the backend's authoritative check, consumed as the request contract here), and the `404`/`400` error body shapes (`{ error: string }`). Cross-checked against `LLD-BACKEND-TASK-TRACKER-002.md` §5 in this run; no conflict found.
