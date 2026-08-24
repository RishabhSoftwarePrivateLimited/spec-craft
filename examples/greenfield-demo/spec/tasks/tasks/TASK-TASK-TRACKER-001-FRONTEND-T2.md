# TASK-TASK-TRACKER-001-FRONTEND-T2

## Metadata

| Field | Value |
|---|---|
| Task ID | TASK-TASK-TRACKER-001-FRONTEND-T2 |
| Layer | frontend |
| Title | Task creation form |
| Task Shape | Component-Slice Task |
| Current State | approved |
| Estimated Complexity | small |

## Source Requirement References

REQ-TASK-TRACKER-001-01, AC-TASK-TRACKER-001-01, AC-TASK-TRACKER-001-05

## Source LLD References

`LLD-FRONTEND-TASK-TRACKER-001.md` §5 (State ownership table — `title`/`isSubmitting`/`formError`; Validation strategy), §6 (Edge Cases), §10 (State And UX States), §11 (Testing Implications)

## Objective

Build the task-creation form surface: a controlled title input with client-side trim/empty validation, a submit control disabled while the create request is in flight, and inline error display for both validation and server rejections.

## In-Scope Work

- `src/components/TaskForm.tsx` — controlled `title` input (local state); trims and blocks submission client-side on empty/whitespace-only value (AC-05, convenience only — server remains authoritative); `isSubmitting` local state disables the submit control while the create request is in flight; calls the `onCreate` callback (from `App.tsx`, via props) with the trimmed title on valid submit; on success, clears the input; on failure (validation or server error), shows the server's `error` message inline and retains the user's typed text; re-enables the submit control after failure
- Component-level CSS classes for the form (added to `src/index.css`)
- Component unit tests (Vitest + RTL)

## Out-Of-Scope Work

- Any network call — `TaskForm` never calls `tasksClient.ts` directly; it only receives `onCreate` as a prop from `App.tsx`
- List rendering or empty-state display (see `-FRONTEND-T3`)
- Server-side validation (owned by the backend service, `-BACKEND-T1`)

## Impacted Areas

| Area | Type |
|---|---|
| `src/components/TaskForm.tsx` | new |
| `src/index.css` | new (form-specific classes) |

## Edge Cases To Preserve

- Empty or whitespace-only title submitted → block submit before any network call; inline message (e.g. "Title is required"); no task created
- Title fails server-side validation despite passing client check → show the server's `error` message inline in the form; do not clear the input
- Rapid double-submit → submit control disabled while `isSubmitting` is `true`; second click is a no-op; exactly one task created
- Network/server failure on create → catch, set `formError`, re-enable submit control; user's typed title preserved so they can retry

## Architecture Constraints

- `AD-FRONTEND-004` — plain controlled input, hand-written trim/empty validation, no form library
- `AD-FRONTEND-002` / `AD-FRONTEND-006` — plain elements, `src/index.css` styling only, no CSS-in-JS
- `AD-FRONTEND-007` — Vitest + RTL
- `FRONTEND-STRUCTURE.md` §Module Boundaries — components never import `tasksClient.ts` directly; all data/callbacks flow through props from `App.tsx`

## Reuse Expectations

Feature-local for now — only one screen exists; promote to a shared component only if a second screen needs the same form shape (`LLD-FRONTEND-TASK-TRACKER-001.md` §9).

## Dependencies

`TASK-TASK-TRACKER-001-FRONTEND-T1` (consumes the `onCreate` callback and error/loading contract `App.tsx` exposes as props).

## Implementation Notes

- This AC-05 check is a plain input check, not a permission check — no architecture implication beyond `AD-FRONTEND-004`.
- Keep validation and submit-disable logic local to this component; do not lift `isSubmitting`/`formError` into `App.tsx` state (per the LLD's state ownership table).

## Expected Evidence

- `src/components/TaskForm.tsx` present; form-specific classes added to `src/index.css`
- Component unit tests passing
- Task-to-code and code-to-unit-test traceability rows updated

## Test Expectations

- Renders; blocks submit and shows message on empty/whitespace title (AC-05)
- Calls `onCreate` with trimmed title on valid submit
- Disables submit control while `isSubmitting`
- Shows server error message when create rejects; re-enables control after failure
- Success + failure + edge-case paths per LLD §11

## Open Questions Or Blockers

None — LLD is approved and sufficiently specific for safe task derivation.
