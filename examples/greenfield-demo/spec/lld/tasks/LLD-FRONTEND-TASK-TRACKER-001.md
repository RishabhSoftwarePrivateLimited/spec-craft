# LLD-FRONTEND-TASK-TRACKER-001

## 1. Metadata

| Field | Value |
|---|---|
| LLD ID | LLD-FRONTEND-TASK-TRACKER-001 |
| Business Spec Reference | `spec/business/tasks/TASK-TRACKER-001.md` |
| Work Item Reference | TASK-TRACKER-001 |
| Status | `approved` |
| Last Updated | 2026-08-13 |
| API Spec Reference | Not yet created — `contracts/tasks/tasks.yaml` does not pre-exist (per `AD-X-001`); binding shape for this story is the touchpoint table in §5 of this LLD and its companion, cross-checked in §14, until backend `/speccraft.implement` writes the real file |
| Design Reference | None provided at intake |
| Depends On | None |

## 2. Purpose And Scope

**In scope:** the task-creation form and the task list view — REQ-TASK-TRACKER-001-01 through -04. A user enters a title, submits it, and sees the new task appear at the top of the list without a manual reload; the list also loads existing tasks on first render.

**Out of scope:** editing/deleting a task, marking a task complete, auth/session/per-user ownership, any persistence concern (owned entirely by the backend).

## 3. Source Requirements

- REQ-TASK-TRACKER-001-01, REQ-TASK-TRACKER-001-02, REQ-TASK-TRACKER-001-03, REQ-TASK-TRACKER-001-04
- AC-TASK-TRACKER-001-01, AC-TASK-TRACKER-001-02, AC-TASK-TRACKER-001-03, AC-TASK-TRACKER-001-04, AC-TASK-TRACKER-001-05

Same IDs cited by `LLD-BACKEND-TASK-TRACKER-001.md` — one shared intake pass, no per-layer fork.

## 4. Functional Understanding

Single anonymous user role (no auth in this demo — `AD-FRONTEND-005`). Behavior path:

1. On mount, the app fetches the current task list and renders it (newest first, as returned by the backend).
2. The user types a title into the create form and submits.
3. While the request is in flight, the submit control is disabled (prevents double-submit, per Edge Cases in the business spec).
4. On success, the newly created task (returned by the API, carrying server-assigned `id`/`createdAt`) is placed at the top of the visible list and the form clears — no page reload.
5. On a validation failure (empty/whitespace-only title) the request is never sent; an inline message is shown and the list is untouched.
6. On a server-side rejection (e.g. title fails backend validation despite client checks) or a network failure, an inline error is shown and the list is untouched.

No role variation, no state-transition diagram needed beyond this linear flow — flat enough that a Capability → Feature → Buildable Unit tree would add no traceability value over the flat REQ list above.

## 5. Frontend Design Decisions

**Route impact:** none — single screen, no router (`FRONTEND-STRUCTURE.md` §Routing Conventions). `App.tsx` renders the screen directly.

**Module ownership:** all new — first frontend story for this project; scaffold has not yet run. Follows the fixed module boundary: `src/api/` → `src/components/` → `src/types/`, with `App.tsx` as sole composition root (`FRONTEND-STRUCTURE.md` §Module Boundaries).

**Server/client boundary:** `src/api/tasksClient.ts` is the only file that calls `fetch`. `TaskForm` and `TaskList` never call the API directly — they receive data and callbacks as props from `App.tsx`.

**State ownership table:**

| State | Owner | Rule |
|---|---|---|
| `tasks: Task[]` | `App.tsx` | Single source of truth for the list; fetched on mount, prepended to on successful create |
| `title` (form input value) | `TaskForm.tsx` | Local, controlled input; cleared on successful submit |
| `isSubmitting` | `TaskForm.tsx` | Local; `true` while the create request is in flight; disables the submit control |
| `listError` / `formError` | `App.tsx` (list fetch error) / `TaskForm.tsx` (create/validation error) | Each surface owns the error state for its own request |

**Rendering strategy:** `App.tsx` fetches the list once on mount (`useEffect`, `GET /api/tasks`) and stores it in state. On a successful create, the task object returned by `POST /api/tasks` is unshifted onto the existing `tasks` array in local state — no re-fetch of the whole list. This is safe because the backend already guarantees creation-order (§5 of the companion LLD), so the frontend does not need to re-derive ordering; it only needs to place the one new item at index 0.

**Validation strategy:** `TaskForm` trims the input and blocks submission client-side when the trimmed value is empty (AC-TASK-TRACKER-001-05) — convenience only; the server remains the authoritative check (server-side-first principle, though this AC is a plain input check, not a permission check).

**API touchpoint table:**

| Operation | Method | Path | Request Shape | Success Shape | Error Codes |
|---|---|---|---|---|---|
| Create task | POST | `/api/tasks` | `{ title: string }` | `201` → `{ id: string, title: string, createdAt: string }` | `400` → `{ error: string }` (blank/whitespace title) |
| List tasks | GET | `/api/tasks` | — | `200` → `Task[]` (newest-first, server-ordered) | — (no documented error path; a transport/network failure is handled as a generic fetch error, see §6) |

This table's shape is agreed with `LLD-BACKEND-TASK-TRACKER-001.md` §5 — see §14.

## 6. Edge Cases

| Error / Condition | Source | Handling Strategy | User-Facing Outcome |
|---|---|---|---|
| Empty or whitespace-only title submitted | Client validation (AC-05) | Block submit before any network call | Inline message under the form, e.g. "Title is required"; no task created |
| Title fails server-side validation despite passing client check (should not normally happen, but server is authoritative) | `POST /api/tasks` returns `400` | Show the server's `error` message inline in the form; do not clear the input | Inline error, form retains user's text |
| Rapid double-submit of the create form | Client-side | `TaskForm` disables the submit control while `isSubmitting` is `true` | Second click is a no-op; exactly one task created |
| No tasks exist yet | `GET /api/tasks` returns `[]` | Render an explicit empty-state message instead of an empty list area | e.g. "No tasks yet — create your first one above" |
| Network/server failure on initial list fetch | `fetch` rejects or non-2xx | Catch, set `listError`, keep `tasks` as last-known (empty on first load) | Inline error banner above the list, e.g. "Couldn't load tasks" |
| Network/server failure on create | `fetch` rejects or non-2xx with unparseable body | Catch, set `formError`, re-enable submit control | Inline error in the form; user's typed title is preserved so they can retry |

## 7. Impacted Areas

All **new** — first frontend story, no existing frontend code root yet (`src-code-frontend/` is created by `/speccraft.scaffold frontend`, not yet run).

| Area | Type | Notes |
|---|---|---|
| `src/main.tsx` | new | Vite/React bootstrap, renders `App.tsx` |
| `src/App.tsx` | new | Composition root; owns `tasks` state, fetch-on-mount, create handler |
| `src/components/TaskForm.tsx` | new | Controlled title input, client validation, submit-disable-while-in-flight |
| `src/components/TaskList.tsx` | new | Renders `tasks` array; empty state when length is 0 |
| `src/api/tasksClient.ts` | new | Typed `fetch` wrapper: `listTasks()`, `createTask(title)` |
| `src/types/task.ts` | new | Shared `Task` shape, mirrors backend contract |
| `src/index.css` | new | Minimal global styling (`AD-FRONTEND-006`) |

No indirect impacted areas — this is the first and only frontend story so far (per `BRD.md`, no other stories exist under this module yet).

## 8. Architecture Application

- **AD-FRONTEND-001** (Vite + React 18 + TS strict) — all new files are `.tsx`/`.ts` under strict mode; no deviation.
- **AD-FRONTEND-002** (no UI library) — `TaskForm`/`TaskList` are plain elements with `src/index.css` styling only.
- **AD-FRONTEND-003** (hooks + typed API client, no state library) — `App.tsx` uses `useState`/`useEffect` exclusively for the `tasks` list; `tasksClient.ts` is the one API seam, per §5.
- **AD-FRONTEND-004** (plain controlled inputs, no form library) — `TaskForm`'s single `title` field is a controlled input with hand-written trim/empty validation, no schema library.
- **AD-FRONTEND-005** (no auth) — no route guards, no session state; every component is unconditionally rendered.
- **AD-FRONTEND-006** (plain CSS) — styling lives in `src/index.css` only, no CSS-in-JS.
- **AD-FRONTEND-007** (Vitest + RTL) — see §11 Testing Implications.
- **`FRONTEND-STRUCTURE.md` module boundaries** — dependency direction honored: `App.tsx` → `components/`; `App.tsx`/`components/` → `api/`/`types/`; components never import `tasksClient.ts` directly (enforced by passing data/callbacks as props from `App.tsx`).
- **AD-X-001** (API contract format) — no contract file exists yet; this LLD's §5 touchpoint table is the interim binding shape, cross-checked against the backend companion in §14.

## 9. Reuse-Before-Build Decisions

**Reuse table:**

| Existing Artifact | Import Path | Used By |
|---|---|---|
| _(none)_ | — | No frontend code exists yet for this project — first story, `src-code-frontend/` not yet scaffolded |

**Create table:**

| New Artifact | Target Path | Reusable Beyond This Feature | Promotion Target |
|---|---|---|---|
| `tasksClient.ts` | `src/api/tasksClient.ts` | Yes — any future task-related screen reuses this client | Already at the shared `api/` layer, no further promotion needed |
| `Task` type | `src/types/task.ts` | Yes — shared shape for any task-related component | Already at the shared `types/` layer |
| `TaskForm.tsx`, `TaskList.tsx` | `src/components/` | Feature-local for now — only one screen exists | Promote to a shared component only if a second screen needs the same form/list shape |

## 10. State And UX States

| Scenario | Component/Unit Affected | Expected Behavior |
|---|---|---|
| Initial load, list fetch in flight | `App.tsx` / `TaskList.tsx` | Show a lightweight loading indicator (or skeleton text) instead of an empty list, to distinguish "loading" from "no tasks" |
| Initial load, list fetch succeeds, zero tasks | `TaskList.tsx` | Empty-state message (see §6) |
| Initial load, list fetch succeeds, N tasks | `TaskList.tsx` | Render all N tasks, newest first, as returned by the server |
| Initial load, list fetch fails | `App.tsx` | Error banner (see §6); no automatic retry (out of scope for this story) |
| Create in flight | `TaskForm.tsx` | Submit control disabled, no visual list change yet |
| Create succeeds | `TaskForm.tsx` / `TaskList.tsx` | Input clears, new task appears at top of `TaskList` immediately |
| Create fails (validation or server error) | `TaskForm.tsx` | Inline error shown, input retains typed text, submit control re-enabled |
| Recovery from a failed create | `TaskForm.tsx` | User can edit and resubmit; no special reset needed since state is local and uncorrupted |

## 11. Testing Implications

Per `AD-FRONTEND-007` (Vitest + RTL):

- `TaskForm`: renders; blocks submit and shows message on empty/whitespace title (AC-05); calls `onCreate` with trimmed title on valid submit; disables submit control while `isSubmitting`; shows server error message when create rejects; re-enables control after failure.
- `TaskList`: renders empty state with zero tasks; renders all items in the order given (does not re-sort — ordering is a backend concern).
- `App.tsx` (integration-style, still unit-level per `AD-FRONTEND-007` — no integration-testing stage for frontend tasks per `AGENTS.md` §Dual-layer branch): fetches list on mount and renders it; on successful create, new task appears at top without a re-fetch call; on failed initial fetch, shows the error banner.
- Critical flows needing coverage: full create-then-see-in-list path (AC-01, AC-02, AC-04); empty-title rejection path (AC-05); double-submit prevention (Edge Cases).

## 12. Open Questions And Assumptions

**Assumptions:**
- The backend returns tasks already in newest-first order (confirmed against companion LLD §5 — see §14); the frontend does not re-sort.
- No pagination — the full task list is small enough for this demo to fetch and render in one call (consistent with BRD scope).
- No loading spinner library — a plain text/CSS-only loading indicator is sufficient (`AD-FRONTEND-002`/`006`).

**Open Questions:** none blocking — business spec and architecture are sufficient to design against.

## 13. Traceability Summary

| Requirement/AC | LLD Section | Coverage |
|---|---|---|
| REQ-TASK-TRACKER-001-01, AC-01, AC-05 | §5 (Validation strategy), §6 | Covered |
| REQ-TASK-TRACKER-001-02, AC-02 | §5 (API touchpoint table), §10 | Covered |
| REQ-TASK-TRACKER-001-03, AC-03 | §5 (Rendering strategy), §10 | Covered |
| REQ-TASK-TRACKER-001-04, AC-04 | §5 (Rendering strategy — unshift on create), §10 | Covered |

No uncovered requirements for this layer.

## 14. Companion LLD Reference

Companion: `LLD-BACKEND-TASK-TRACKER-001.md`.

Cross-layer contract dependency: this LLD's §5 API touchpoint table (`POST /api/tasks` request/response shapes, `GET /api/tasks` response shape, status codes `201`/`400`/`200`) must match the companion's §5 API touchpoint table exactly — field names (`id`, `title`, `createdAt`), the newest-first ordering guarantee (owned by the backend, consumed as-is by the frontend), and the `400` error body shape (`{ error: string }`). Cross-checked against `LLD-BACKEND-TASK-TRACKER-001.md` §5 in this run; no conflict found.
