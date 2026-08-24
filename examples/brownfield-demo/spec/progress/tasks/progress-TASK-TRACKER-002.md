# Progress — TASK-TRACKER-002

## Intake

Completed this session (shared, layer-agnostic), 2026-08-14. Business input: `spec/business/tasks/BRD.md` (extension BRD — frames G1/G2 as pre-existing/onboarded, adds G3) and `spec/business/tasks/TASK-TRACKER-002.md` (the story). Neither existed before this session — both authored as part of this run since this is the first delivery story for this project since `/speccraft.onboard`.

**Intake Record:**

| Field | Value |
|---|---|
| Work Item ID | TASK-TRACKER-002 |
| Business Spec Source | `spec/business/tasks/TASK-TRACKER-002.md` |
| Scope Summary | Extend the pre-existing, onboarded `tasks` feature so a user can toggle a task's completion state and see completed tasks visually distinguished; no re-sort, no delete/edit. |
| Requirement IDs | REQ-TASK-TRACKER-002-01..04 — all intake-created (no pre-existing IDs in the fresh story file), each mapped to `spec/business/tasks/TASK-TRACKER-002.md` §3 |
| Acceptance Criteria IDs | AC-TASK-TRACKER-002-01..05, mapped to §4 of the same file |
| Architecture Documents Assessment | `ARCH-DECISIONS.md` — applicable (AD-FRONTEND-*/AD-BACKEND-*/AD-X-* all relevant, discovered stack). `FRONTEND-STRUCTURE.md` — applicable (module boundaries this story must extend). `BACKEND-STRUCTURE.md` — applicable (layering this story must extend). |
| Gaps And Open Questions | None LLD-blocking. Exact visual treatment for "completed" left as an LLD-level design decision (see `LLD-FRONTEND-TASK-TRACKER-002.md` §12), not a business-level gap. |
| Intake State | `approved` (folded into this same turn's LLD creation per `speccraft.orchestrate.md` Stage 1 → Stage 2, no separate intake gate) |
| Recommended Next Step | Proceed to LLD Review Gate (Stage 3) |

## LLD

### Frontend — LLD-FRONTEND-TASK-TRACKER-002
Approved 2026-08-14 (human responded `approved` to the combined Stage 3 gate). See `spec/lld/tasks/LLD-FRONTEND-TASK-TRACKER-002.md`.

### Backend — LLD-BACKEND-TASK-TRACKER-002
Approved 2026-08-14 (same combined gate). See `spec/lld/tasks/LLD-BACKEND-TASK-TRACKER-002.md`.

Both LLDs were produced together in the same turn (Layer Scope = `both`) and reviewed as one logical gate per `spec/workflows/lld/LLD-STAGE.md`.

## Decomposition

Approved 2026-08-14 — 4 tasks (2 backend, 2 frontend), sized smaller than `TASK-TRACKER-001`'s 5 since this story is a single-field, single-endpoint extension rather than a from-scratch feature. See `spec/traceability/tasks/TASK-TRACKER-002/TRACEABILITY.md` (LLD to Tasks).

## Scaffold Check (Stage 5.5)

Both `/speccraft.scaffold frontend` and `/speccraft.scaffold backend` invoked and confirmed to refuse, exactly as `speccraft.scaffold.md`'s Pre-Execution Check 1 requires: `src-code-frontend/` and `src-code-backend/` both already exist (pre-existing code, onboarded via `/speccraft.onboard`, not created by any workflow command) — expected, correct `blocked` outcome, not an error. See `spec/traceability/shared/scaffold-frontend/TRACEABILITY.md` and `spec/traceability/shared/scaffold-backend/TRACEABILITY.md`. No scaffold action needed or taken; proceeding directly to Stage 6 (Task-To-Code) against the existing code roots.

## Task: TASK-TASK-TRACKER-002-BACKEND-T1

### Status
`approved` — human approved 2026-08-14. Implementation review outcome: `approved`, no revisions requested.

### Implementation

**Changed files:**
- `src-code-backend/src/types/task.ts` — added `completed: boolean` to the `Task` interface
- `src-code-backend/src/repositories/tasks.repository.ts` — added `setCompleted(id, completed)`: linear-scan find-by-id, mutates `completed` in place, returns the updated task or `undefined` if no task matches; `create()`/`list()` unchanged
- `src-code-backend/src/services/tasks.service.ts` — added `setTaskCompleted(id, completed)`: rejects a non-boolean `completed` (`Error('completed must be a boolean')`) without calling the repository, rejects an unknown id (`Error('Task not found')`) via the repository's `undefined` signal, otherwise delegates exactly once; `createTask()` updated to set `completed: false` on the object literal it builds (see Assumptions — this is where the default actually belongs, not in the repository's `create()`, which just persists a fully-formed `Task` it's given)
- `contracts/tasks/tasks.yaml` (new) — OpenAPI 3.1 contract for all three `tasks` operations (`GET`, `POST` — pre-existing behavior now documented for the first time since no contract file existed before this project's first delivery story — and `PATCH /api/tasks/:id`, matching `LLD-BACKEND-TASK-TRACKER-002.md` §5 touchpoint table exactly)
- `src-code-backend/test/repositories/tasks.repository.test.ts` — fixed 3 existing object literals to include `completed: false` (required by the type change, not a behavior change) + 4 new tests
- `src-code-backend/test/services/tasks.service.test.ts` — 1 new test on `createTask` (completed defaults false) + 3 new tests on `setTaskCompleted`

**Not changed (explicitly out of scope for T1):** `src-code-backend/src/controllers/tasks.controller.ts`, `src-code-backend/src/routes/tasks.routes.ts` — reserved for `-BACKEND-T2`.

**Architecture mapping:** `AD-BACKEND-001` (strict TS), `AD-BACKEND-002` (repository remains sole array owner, no ORM), `AD-X-001` (contract written to match LLD touchpoint table, now covering all 3 operations — first time this file exists for this project), `BACKEND-STRUCTURE.md` §Layering (repository only imported by the service).

**Assumptions:**
- `completed: false` defaulting belongs in `tasks.service.ts`'s `createTask()` object-literal construction (where `id`/`createdAt` are also assigned), not in the repository's `create()`, which only persists an already-built `Task`. The task file's wording was slightly ambiguous on this point ("update `create()` to set `completed: false`") — resolved by following the existing code's actual division of responsibility rather than the literal wording.
- Repository lookup uses a linear scan, consistent with the existing small in-memory array and `AD-BACKEND-002`'s already-accepted O(n) tradeoff.

**Verification performed:** this project's `npm run build`/`npm test` have the same pre-existing `ts-node@10.9.2`/`typescript@7.0.2` incompatibility + `tsconfig.json` `rootDir`/`include` gap already found and fixed in `examples/greenfield-demo` (see that project's `WALKTHROUGH.md` §6) — but `package.json`/`tsconfig.json` are outside this task's own Impacted Areas, so instead of silently patching tooling as scope creep, verified via a scratch `tsc --ignoreConfig` compile (0 errors) to a throwaway directory, then ran the compiled output with plain `node --test`: **18/18 pass** (7 repository + 11 service, including all 8 new/fixed tests).

**Blockers / follow-up gaps:**
- Same environment-level `npm test`/`npm run build` tooling gap as `examples/greenfield-demo` had before its fix (see that project's `WALKTHROUGH.md` §6) — not introduced by this task, `package.json`/`tsconfig.json` outside this task's Impacted Areas. Flagged, not silently patched. A human may want to apply the same fix (tsconfig `include`, typescript version pin, `ts-node/register` test script) to this project too, as a separate follow-up.

**Traceability:** Task → Code and Code → Tests rows added in `spec/traceability/tasks/TASK-TRACKER-002/TRACEABILITY.md`; Coverage Matrix backend rows flipped to `partial` (T1 domain layer done, T2 endpoint pending).

**Handoff:** approved by human 2026-08-14. Proceeding to `/speccraft.unit-test` for this task.

### Testing

**Scope note:** per `TESTING-STAGE.md` (`## Overview` — "one task may include both code and tests; this is the default"), this task's own In-Scope Work already required the repository + service unit tests, written and passing during the Implementation stage above. This Testing-stage pass reviews that existing suite against the task's full Test Expectations / AC set rather than authoring a parallel/duplicate suite.

**Test files (unchanged from Implementation):**
- `src-code-backend/test/repositories/tasks.repository.test.ts` — 7 tests (3 existing, fixed for the type change + 4 new)
- `src-code-backend/test/services/tasks.service.test.ts` — 11 tests (7 existing, unchanged + 4 new)

**Coverage mapped to acceptance criteria:**

| AC-ID | Backend-owned behavior | Test(s) |
|---|---|---|
| AC-TASK-TRACKER-002-01 | Marking an incomplete task complete | `setCompleted(id, true) updates field and returns it`, `setTaskCompleted delegates to the repository exactly once for a valid call and returns the updated task` |
| AC-TASK-TRACKER-002-02 | Marking a completed task incomplete | `setCompleted(id, false) flips a completed task back to incomplete` |
| AC-TASK-TRACKER-002-03 | Backend's contribution: exposing `completed` on the `Task` shape | `createTask defaults completed to false on a new task` |
| AC-TASK-TRACKER-002-04 | No position/other-field change from a completion mutation | `setCompleted() does not change the array order or any other task` |
| AC-TASK-TRACKER-002-05 | Unknown task id rejected | `setCompleted() returns undefined for an id that does not exist`, `setTaskCompleted rejects an unknown task id` |

**Excluded from unit tests (named explicitly, not silently skipped):**
- HTTP status-code shaping (`200`/`400`/`404`) and the JSON error body — controller-layer behavior, owned by `-BACKEND-T2`.
- Full cross-boundary HTTP flow — deferred to the Integration Testing stage for this backend-tagged task.

**Verification performed:** re-ran the full suite via the same scratch `tsc --ignoreConfig` compile + plain `node --test` approach used in Implementation (no source changed since then) — 18/18 pass.

**Gaps:** none new. The pre-existing `npm test`/tooling gap logged under Implementation still applies and is not re-litigated here.

**Traceability:** no new Code→Tests rows needed (existing rows from Implementation already cover this task's full test scope); Workflow Metrics row appended for this `unit-test` command run.

**Status:** `approved` — human approved 2026-08-14. Testing review outcome: `approved`, no revisions requested. Proceeding to `/speccraft.integration-test` (backend-tagged task, per `AGENTS.md` §Dual-layer branch).

### Integration Testing

**Finding — no integration surface introduced by this task:** `-BACKEND-T1`'s own In-Scope Work is the domain layer only (`Task` type, repository, service, contract file). Per the task file's own Out-Of-Scope Work: "HTTP routing, request parsing, or response shaping (routes/controllers — see `-BACKEND-T2`)". Consequently:

- **API entrypoint:** none owned by this task. `PATCH /api/tasks/:id` does not yet route to real logic — `tasks.controller.ts`/`tasks.routes.ts` have not been touched by this task. Contract-level HTTP integration testing for this operation is not executable until `-BACKEND-T2` lands that wiring.
- **Persistence/cache/queue/external-service boundary:** none exists to test. `tasks.repository.ts` is a same-process in-memory array (`AD-BACKEND-002`) with no transaction boundary. The service→repository call (`setTaskCompleted` → `setCompleted`) is a plain in-process function call, not a network/persistence boundary — exactly what the approved unit tests already exercise (real repository, not a stub, wired through the service).
- Writing an "integration test" that only re-invokes `setTaskCompleted` against the real repository would duplicate the approved unit tests verbatim, which `INTEGRATION-TESTING-STAGE.md` §Rules explicitly disallows ("do not re-assert unit-level logic already covered by unit tests").

**Conclusion:** no integration test files added for `-BACKEND-T1`. The real HTTP-level integration test for `PATCH /api/tasks/:id` is deferred to `-BACKEND-T2`'s own Integration Testing stage, once that task's controller/route work is implemented and approved — the same pattern `TASK-TRACKER-001`'s `-BACKEND-T1`/`-BACKEND-T2` pair followed.

**Gaps (explicit, not silent):** full `PATCH /api/tasks/:id` contract-level coverage (status codes, error bodies, end-to-end toggle-then-list-reflects-it) is untested until `-BACKEND-T2` completes. This is a sequencing gap, not a defect in `-BACKEND-T1`.

**Traceability:** Unit Tests → Integration Tests row recorded as `deferred to -BACKEND-T2` (not `missing`) for this task's rows.

**Status:** `approved` — human approved 2026-08-14. This stage closes for `-BACKEND-T1` specifically (no boundary owed by this task); real HTTP-level integration coverage lands with `-BACKEND-T2`'s own Integration Testing stage.

### Validation

**1. Task Identification**
- Task ID: TASK-TASK-TRACKER-002-BACKEND-T1
- Title: Task completion — repository, service, types, contract
- Layer: backend
- LLD Section Reference: `LLD-BACKEND-TASK-TRACKER-002.md` §5, §6, §9, §11
- Business Spec Reference: `spec/business/tasks/TASK-TRACKER-002.md` — REQ-TASK-TRACKER-002-01, -02, -04, AC-01, -02, -04, -05

**2. Inputs Checked**
- Architecture docs: `spec/architecture/ARCH-DECISIONS.md` (AD-BACKEND-001, 002, 007, AD-X-001), `spec/architecture/BACKEND-STRUCTURE.md`
- Implementation review record: `### Status` — approved, human 2026-08-14
- Unit-testing review record: `### Testing` — approved, human 2026-08-14
- Integration-testing review record: `### Integration Testing` — approved, human 2026-08-14 (no boundary owed, deferred to `-BACKEND-T2`)

**3. AC Coverage Table**

| AC-ID | Criterion | Unit Test Ref | Integration Test Ref | Status |
|---|---|---|---|---|
| AC-01 | Incomplete task marked complete | `tasks.service.test.ts` — "setTaskCompleted delegates to the repository exactly once for a valid call and returns the updated task" | via `-BACKEND-T2`'s `tasks.integration.test.ts` — "PATCH ... marks a task complete" (exercises this task's service/repository transitively) | pass |
| AC-02 | Completed task marked incomplete | `tasks.repository.test.ts` — "setCompleted(id, false) flips a completed task back to incomplete" | via `-BACKEND-T2` integration — "marks a completed task back as incomplete" | pass |
| AC-04 | No position/other-field change | `tasks.repository.test.ts` — "setCompleted() does not change the array order or any other task" | via `-BACKEND-T2` integration — "does not change the task's position in GET /api/tasks" | pass |
| AC-05 | Unknown id rejected | `tasks.repository.test.ts` — "returns undefined for an id that does not exist"; `tasks.service.test.ts` — "rejects an unknown task id" | via `-BACKEND-T2` integration — "404 for an unknown task id" | pass |

**4. Architecture Conformance:** `compliant`
- AD-BACKEND-001 (TS strict) — all changed files `.ts` — compliant
- AD-BACKEND-002 (no ORM, sole array owner) — `tasks.repository.ts` is the only module touching the array — compliant
- AD-X-001 (contract format) — `contracts/tasks/tasks.yaml` (new for this project) verified field-for-field against LLD §5 touchpoint table — compliant, no drift
- `BACKEND-STRUCTURE.md` layering — repository imports only `types/task.ts`; not imported by the controller — compliant

**5. Traceability Chain** (backend, 5 links)

| Link | Status | Evidence |
|---|---|---|
| business req/AC → LLD | present | `spec/traceability/tasks/TASK-TRACKER-002/TRACEABILITY.md` — Business Spec to LLD table, backend rows |
| LLD → task | present | same shard — LLD to Tasks table |
| task → code | present | same shard — Tasks to Code table |
| code → unit test | present | same shard — Code to Tests table |
| unit test → integration test | present (via `-BACKEND-T2`) | same shard — row explicitly notes this task introduces no boundary of its own; boundary coverage lands via `-BACKEND-T2`'s `tasks.integration.test.ts`, which exercises this task's service/repository code in-process |

**6. Issues Found:** none. The pre-existing `ts-node@10.9.2`/`typescript@7.0.2` incompatibility and `tsconfig.json` `rootDir`/`include` gap (same category `examples/greenfield-demo` had before its own fix) affect this project's `npm run build`/`npm test` scripts, but do not affect this task's own scope — all tests were independently re-verified passing via the scratch-compile workaround at every stage, and a live end-to-end check against the running server (compiled + started outside `npm run dev`) confirmed the real behavior directly. `package.json`/`tsconfig.json` are outside every task's Impacted Areas in this story — not this task's to fix.

**7. Validation Outcome:** `approved` — all in-scope ACs pass, architecture compliant, full 5-link traceability chain present.

**8. Required Actions:** none to reach `done`. Recommended (not blocking, story-level): a human may want to apply the same tooling fix `examples/greenfield-demo` received (tsconfig `include`, typescript version pin, `ts-node/register` test script) to this project too, as a separate follow-up outside this story's scope.

**Status (validation):** `done` — validated 2026-08-17, all checks passed. Task closed.

## Task: TASK-TASK-TRACKER-002-BACKEND-T2

### Status
`approved` — human approved 2026-08-17. Implementation review outcome: `approved`, no revisions requested.

### Implementation

**Changed files:**
- `src-code-backend/src/controllers/tasks.controller.ts` — added `updateTaskCompletion(req, res)`: reads `id` from `req.params`, `completed` from `req.body`; calls `tasksService.setTaskCompleted`; on success responds `200` with the updated task; on a thrown error, maps `"Task not found"` to `404` and any other message (the `completed`-type rejection) to `400`
- `src-code-backend/src/routes/tasks.routes.ts` — added `router.patch('/:id', updateTaskCompletion)`
- `src-code-backend/test/controllers/tasks.controller.test.ts` — 3 existing `Task` literals fixed for the type change (required by `-BACKEND-T1`'s type change, not a behavior change) + 4 new tests (200/404/400/missing-body paths)

**Not changed:** `src-code-backend/src/index.ts` — already matched this task's required shape (Express bootstrap, CORS, JSON body parsing all pre-existing); no changes needed.

**Architecture mapping:** `AD-BACKEND-001` (strict TS), `AD-BACKEND-004` (REST/JSON, no versioning), `AD-X-002` (CORS already restricted, unchanged), `BACKEND-STRUCTURE.md` §Layering (controller calls the service only, never the repository directly; route file carries no logic beyond verb-to-handler wiring).

**Assumptions:**
- Status-code mapping distinguishes the two failure modes by the service's error message string (`"Task not found"` → `404`, anything else → `400`) — same forward-compatible convention `-BACKEND-T1` set up specifically so this task wouldn't have to re-derive the distinction.

**Type fix needed:** `req.params.id` is typed `string | string[]` by this project's installed `@types/express-serve-static-core` (`ParamsDictionary`'s index signature allows array values for some routing patterns). Cast to `string` (`req.params.id as string`) since a named `/:id` segment is never actually an array at runtime — same category of TS-only friction as the `req.params` typing here, not a real runtime concern for this route shape.

**Verification performed:** same scratch `tsc --ignoreConfig` compile (0 errors, after the `req.params.id` type fix above) + plain `node --test` workaround as `-BACKEND-T1` (this project's `npm run build`/`npm test` still have the pre-existing tooling gap, not re-litigated here) — full backend suite (7 repository + 11 service + 10 controller = **28 tests**) passes 28/28.

**Blockers / follow-up gaps:** none new. The pre-existing `npm test`/`npm run build` tooling gap logged under `-BACKEND-T1` still stands.

**Traceability:** Task → Code and Code → Tests rows added in `spec/traceability/tasks/TASK-TRACKER-002/TRACEABILITY.md`; Coverage Matrix backend rows flipped `Code Mapped` to `mapped` for all 4 REQs (both T1 and T2 now implemented).

**Handoff:** approved by human 2026-08-17. Proceeding to `/speccraft.unit-test` for this task.

### Testing

**Scope note:** per `TESTING-STAGE.md` (`## Overview`), this task's own In-Scope Work already required controller-level unit tests, written during Implementation above (4 new tests). This formal `/speccraft.unit-test` pass reviews that suite against this task's Test Expectations.

**Test files:**
- `src-code-backend/test/controllers/tasks.controller.test.ts` — 10 tests total (6 existing from the pre-existing app + 4 new for this task)

**Coverage mapped to Test Expectations:**

| Test Expectation | Test(s) |
|---|---|
| `200` with the updated task for a valid toggle in either direction | `updateTaskCompletion responds 200 with the updated task for a valid toggle` |
| `404` with the contract error body for an unknown task id | `updateTaskCompletion responds 404 with the contract error body for an unknown task id` |
| `400` with the contract error body for a non-boolean `completed` | `updateTaskCompletion responds 400 with the contract error body for a non-boolean completed value` |
| Missing body treated as a missing `completed` value | `updateTaskCompletion treats a missing request body as a missing completed value` |

**Excluded from unit tests (named explicitly, not silently skipped):**
- Full HTTP-stack behavior (real request/response cycle, `supertest`) — this task's own Integration Testing stage, next.
- Distinguishing empty-object vs. non-boolean `completed` at the controller level — that distinction is the service's responsibility (`-BACKEND-T1`, already unit-tested there); the controller only needs to prove it maps *any* thrown validation error to `400 { error: message }`.

**Verification performed:** re-ran the full backend suite (28 tests) via the same scratch-compile workaround — 28/28 pass.

**Traceability:** no new Code→Tests rows needed beyond what Implementation already recorded; Workflow Metrics row appended for this `unit-test` command run.

**Status:** `approved` — human approved 2026-08-17. Testing review outcome: `approved`, no revisions requested. Proceeding to `/speccraft.integration-test` (backend-tagged task).

### Integration Testing

**Boundary identified:** this task owns the resource's HTTP surface for the completion-toggle operation (`src/routes/tasks.routes.ts`, `src/controllers/tasks.controller.ts`), wired to the already-approved `-BACKEND-T1` service/repository. Per `BACKEND-STRUCTURE.md` §Integration Strategy, there is no external dependency to containerize or mock — the real Express app is exercised in-process via `supertest`, hitting real routes → controller → service → repository end to end, per `AD-BACKEND-007`.

**Test file (extended):** `src-code-backend/test/integration/tasks.integration.test.ts` — 7 new tests added to the existing 6 (13 total): `completed: false` default on create; `200` marking a task complete; `200` marking a completed task back incomplete; `404` for an unknown task id; `400` for a non-boolean `completed`; position-in-`GET`-list preserved across a toggle.

**Coverage mapped to Test Expectations / ACs:**

| Test Expectation / AC | Test(s) |
|---|---|
| `POST` still defaults `completed: false` (regression check — the type changed, not the behavior) | `POST /api/tasks responds 201 with completed: false by default` |
| AC-01: incomplete → complete | `PATCH /api/tasks/:id responds 200 and marks a task complete` |
| AC-02: complete → incomplete | `PATCH /api/tasks/:id responds 200 and marks a completed task back as incomplete` |
| AC-05: unknown id rejected | `PATCH /api/tasks/:id responds 404 with the contract error body for an unknown task id` |
| `completed` type validation, HTTP level | `PATCH /api/tasks/:id responds 400 with the contract error body for a non-boolean completed value` |
| AC-04: no position change | `PATCH /api/tasks/:id does not change the task's position in GET /api/tasks` |

**Boundaries not exercised, with reason:** none owed beyond the HTTP surface above — no database/cache/queue/external service exists in this project (`AD-BACKEND-002`, `AD-BACKEND-005`). CORS is wired in `src/index.ts` but not part of this task's own scope; not added here.

**Real bug caught during verification (infra, not implementation):** the scratch-compile workaround used for `-BACKEND-T1`/`-BACKEND-T2` unit-level verification compiled to a system-temp directory outside the project tree — fine for `repository`/`service`/`controller` tests (no third-party imports), but the integration test's `import supertest from 'supertest'` failed to resolve (`MODULE_NOT_FOUND`) because Node's `node_modules` resolution walks up from the file's own location, and a system-temp directory has no path back to this project's `node_modules`. Fixed by pointing the scratch `--outDir` at a directory *inside* `src-code-backend/` instead (deleted after verification, never committed) — same workaround category as the ts-node/typescript gap, not a defect in the implementation itself.

**Verification performed:** full backend suite (7 repository + 11 service + 10 controller + 13 integration = **41 tests**) passes 41/41.

**Traceability:** Unit Tests → Integration Tests row added for `-BACKEND-T1`/`-BACKEND-T2`'s shared boundary in `spec/traceability/tasks/TASK-TRACKER-002/TRACEABILITY.md`; Coverage Matrix backend rows' `Integration Test Mapped` flipped to `mapped`.

**Status:** `approved` — human approved 2026-08-17. This stage closes for `-BACKEND-T2`. Both backend tasks are now fully closed: implementation, unit tests, and integration testing all `approved` for `-BACKEND-T1` and `-BACKEND-T2`.

### Validation

**1. Task Identification**
- Task ID: TASK-TASK-TRACKER-002-BACKEND-T2
- Title: Task completion HTTP endpoint — controller, route
- Layer: backend
- LLD Section Reference: `LLD-BACKEND-TASK-TRACKER-002.md` §5, §6, §7
- Business Spec Reference: `spec/business/tasks/TASK-TRACKER-002.md` — REQ-TASK-TRACKER-002-01, -02, -04, AC-01, -02, -04, -05

**2. Inputs Checked**
- Architecture docs: `spec/architecture/ARCH-DECISIONS.md` (AD-BACKEND-001, 004, 007, AD-X-002), `spec/architecture/BACKEND-STRUCTURE.md`
- Implementation review record: `### Status` — approved, human 2026-08-17
- Unit-testing review record: `### Testing` — approved, human 2026-08-17
- Integration-testing review record: `### Integration Testing` — approved, human 2026-08-17

**3. AC Coverage Table**

| AC-ID | Criterion | Unit Test Ref | Integration Test Ref | Status |
|---|---|---|---|---|
| AC-01 | Valid toggle → `200` with updated task | `tasks.controller.test.ts` — "responds 200 with the updated task for a valid toggle" | `tasks.integration.test.ts` — "PATCH ... responds 200 and marks a task complete" | pass |
| AC-02 | Complete → incomplete | same controller test (both directions via mock) | `tasks.integration.test.ts` — "marks a completed task back as incomplete" | pass |
| AC-04 | No position change | n/a at controller level (pass-through) | `tasks.integration.test.ts` — "does not change the task's position in GET /api/tasks" | pass |
| AC-05 | Unknown id → `404` | `tasks.controller.test.ts` — "responds 404 with the contract error body for an unknown task id" | `tasks.integration.test.ts` — "responds 404 with the contract error body for an unknown task id" | pass |
| (contract) | Non-boolean `completed` → `400` | `tasks.controller.test.ts` — "responds 400 ... for a non-boolean completed value", "treats a missing request body as a missing completed value" | `tasks.integration.test.ts` — "responds 400 with the contract error body for a non-boolean completed value" | pass |

**4. Architecture Conformance:** `compliant`
- AD-BACKEND-001 (TS strict) — compliant
- AD-BACKEND-004 (REST/JSON, no versioning) — compliant
- AD-X-002 (CORS restricted to `http://localhost:5173`) — unchanged by this task — compliant
- `BACKEND-STRUCTURE.md` layering — `tasks.controller.ts` imports only `tasks.service.ts`; `tasks.routes.ts` carries URL/method shape only — compliant
- Contract Conformance — `contracts/tasks/tasks.yaml` (authored by `-BACKEND-T1`) matches this task's controller status-code/body shaping exactly (`200`/`400 {error}`/`404 {error}`) — compliant, no drift found; also confirmed via a live end-to-end check against the running compiled server (`GET`/`POST`/`PATCH` all exercised directly with real HTTP requests, not just via `supertest`)

**5. Traceability Chain** (backend, 5 links)

| Link | Status | Evidence |
|---|---|---|
| business req/AC → LLD | present | traceability shard — Business Spec to LLD |
| LLD → task | present | traceability shard — LLD to Tasks |
| task → code | present | traceability shard — Tasks to Code (`tasks.controller.ts`, `tasks.routes.ts`) |
| code → unit test | present | traceability shard — Code to Tests (`tasks.controller.test.ts`, 10 tests) |
| unit test → integration test | present | traceability shard — Unit Tests to Integration Tests (`tasks.integration.test.ts`, 13 tests, approved 2026-08-17) |

**6. Issues Found:** none new. Same pre-existing tooling gap as `-BACKEND-T1` (not this task's to fix); the real type error found and fixed during Implementation (`req.params.id` cast) is already resolved and verified, not an open issue.

**7. Validation Outcome:** `approved` — all in-scope ACs pass, architecture compliant (including Contract Conformance, confirmed live), full 5-link traceability chain present.

**8. Required Actions:** none to reach `done`. See `-BACKEND-T1` Validation for the shared, non-blocking tooling-gap recommendation.

**Status (validation):** `done` — validated 2026-08-17, all checks passed. Task closed.

## Task: TASK-TASK-TRACKER-002-FRONTEND-T1

### Status
`approved` — human approved 2026-08-17. Implementation review outcome: `approved`, no revisions requested.

### Implementation

**Changed files:**
- `src-code-frontend/src/types/task.ts` — added `completed: boolean` to the `Task` interface
- `src-code-frontend/src/api/tasksClient.ts` — added `updateTaskCompletion(id, completed)`: `PATCH /api/tasks/:id` with `{ completed }`, same typed-`fetch`-wrapper shape as `listTasks`/`createTask`
- `src-code-frontend/src/App.tsx` — added `handleToggleComplete(id, completed)`: calls the client, then replaces the matching task in `tasks` state at its existing index (`.map`, not a re-fetch); passes it to `TaskList` as `onToggleComplete`
- `src-code-frontend/src/components/TaskList.tsx` — added `onToggleComplete` to `TaskListProps` (type only — the function body is untouched; the prop isn't destructured or rendered yet, that's `-FRONTEND-T2`'s scope)
- `src-code-frontend/src/App.test.tsx` — 2 new tests; extended the existing `TaskList` mock with a per-row toggle button (mirroring the existing `TaskForm` mock's `mock-create` button pattern) so these tests have something to click
- `src-code-frontend/src/components/TaskList.test.tsx` — 2 existing `Task` literals + 2 existing `<TaskList>` render calls fixed for the type change (required because `TaskListProps` gained a required prop, not a behavior change — real usage of the prop is still `-FRONTEND-T2`'s scope)

**Not changed:** `src-code-frontend/src/components/TaskForm.tsx` — untouched, creation flow unaffected.

**Scope note on `TaskList.tsx`:** `-FRONTEND-T2`'s own task file lists "accept a new `onToggleComplete` prop" as its In-Scope Work, but since `TaskListProps` is one shared interface, adding the prop's *type* here (so `-FRONTEND-T1` type-checks and compiles independently, and `App.tsx` can pass the callback down) was unavoidable. `-FRONTEND-T2`'s remaining work is entirely the *rendering* — destructuring the prop, adding the toggle control markup, per-row in-flight state, and the visual "completed" treatment. No task boundary was skipped, only the type declaration moved earlier out of necessity — same category of forward-looking adjustment `TASK-TRACKER-001`'s `-FRONTEND-T1`/`-FRONTEND-T2` pair made with `TaskForm`'s `onCreate` prop type.

**Architecture mapping:** `AD-FRONTEND-001` (React 19 + Vite + TS), `AD-FRONTEND-003` (hooks only, `tasksClient.ts` remains the one API seam), `FRONTEND-STRUCTURE.md` §Module Boundaries (`App.tsx` is the only place that calls `tasksClient.ts`; `TaskList` receives the callback as a prop).

**Assumptions:**
- `handleToggleComplete` does not catch errors itself — a rejected `updateTaskCompletion` call propagates to whatever calls the `onToggleComplete` prop, consistent with the LLD's design that `-FRONTEND-T2`'s per-row UI owns the revert/error-display behavior, not `App.tsx`.

**Verification performed:** `npm run build` (`tsc -b && vite build`) clean, 0 errors. `npm test` (`vitest run`) — **13/13 pass** (11 existing + 2 new). Unlike the backend, this project's real `npm test`/`npm run build` have no tooling gap — both ran directly, no workaround needed.

**Blockers / follow-up gaps:** none.

**Traceability:** Task → Code and Code → Tests rows added in `spec/traceability/tasks/TASK-TRACKER-002/TRACEABILITY.md`; Coverage Matrix frontend rows for REQ-01/02/04 flipped to `partial (T1 only)` — REQ-03 (visual distinction) stays `missing` until `-FRONTEND-T2`.

**Handoff:** approved by human 2026-08-17. Proceeding to `/speccraft.unit-test` for this task.

### Testing

**Scope note:** per `TESTING-STAGE.md` (`## Overview`), this task's own In-Scope Work already required `App.tsx` unit tests, written during Implementation above (2 new tests). This formal `/speccraft.unit-test` pass reviews that suite against this task's Test Expectations.

**Test files (unchanged from Implementation):**
- `src-code-frontend/src/App.test.tsx` — 2 new tests (13 total in the file's test run across the project)

**Coverage mapped to Test Expectations:**

| Test Expectation | Test(s) |
|---|---|
| A successful toggle updates only the affected task's rendered state, at the same list position, without an additional `listTasks` call | `updates only the toggled task in place, at the same position, without a re-fetch` |
| A failed toggle does not change the task's state and surfaces an error path `-FRONTEND-T2` can render | `does not change local state when a toggle fails` |

**Excluded from unit tests (named explicitly):**
- The actual toggle control's markup, click wiring, and visual "completed" treatment — `-FRONTEND-T2`'s own component-level tests.
- Real network behavior — `tasksClient.ts` is mocked at the module boundary, same as `listTasks`/`createTask`.

**Verification performed:** re-reviewed both new tests against the task's Test Expectations — full coverage confirmed, no gaps, no test files modified. `npm test` — 13/13 pass (unchanged from Implementation stage verification).

**Traceability:** no new Code→Tests rows needed; Workflow Metrics row appended for this `unit-test` command run.

**Status:** `approved` — human approved 2026-08-17. Testing review outcome: `approved`, no revisions requested. Frontend-tagged task — no Integration Testing stage. `-FRONTEND-T1` is fully closed: implementation and unit tests both `approved`.

### Validation

**1. Task Identification**
- Task ID: TASK-TASK-TRACKER-002-FRONTEND-T1
- Title: Task completion — API client, types, composition wiring
- Layer: frontend
- LLD Section Reference: `LLD-FRONTEND-TASK-TRACKER-002.md` §5, §7, §9
- Business Spec Reference: `spec/business/tasks/TASK-TRACKER-002.md` — REQ-TASK-TRACKER-002-01, -02, -04, AC-01, -02, -04

**2. Inputs Checked**
- Architecture docs: `spec/architecture/ARCH-DECISIONS.md` (AD-FRONTEND-001, 003, 008, AD-X-001), `spec/architecture/FRONTEND-STRUCTURE.md`
- Implementation review record: `### Status` — approved, human 2026-08-17
- Unit-testing review record: `### Testing` — approved, human 2026-08-17
- Integration-testing review record: n/a — frontend-tagged task, no Integration Testing stage per `AGENTS.md` §Dual-layer branch

**3. AC Coverage Table**

| AC-ID | Criterion | Unit Test Ref | Integration Test Ref | Status |
|---|---|---|---|---|
| AC-01 | Incomplete → complete (this task's contribution: API call + state update) | `App.test.tsx` — "updates only the toggled task in place, at the same position, without a re-fetch" | n/a (frontend task) | pass |
| AC-02 | Complete → incomplete (same code path, either direction) | same test — the mock call asserts the target boolean sent, not a fixed direction | n/a (frontend task) | pass |
| AC-04 | No position change | same test — asserts the toggled task's position among rendered items is unchanged | n/a (frontend task) | pass |
| (error path) | Failed toggle does not change state | `App.test.tsx` — "does not change local state when a toggle fails" | n/a (frontend task) | pass |

**4. Architecture Conformance:** `compliant`
- AD-FRONTEND-001 (React 19 + Vite + TS) — compliant
- AD-FRONTEND-003 (hooks only, `tasksClient.ts` one seam) — `App.tsx` uses `useState` only for the new handler; no state library — compliant
- AD-FRONTEND-008 (Vitest + RTL) — compliant
- `FRONTEND-STRUCTURE.md` module boundaries — `App.tsx` is the only file calling `tasksClient.ts`; `TaskList` receives the callback as a prop — compliant
- Contract Conformance — `tasksClient.ts`'s `updateTaskCompletion` matches `contracts/tasks/tasks.yaml`'s `PATCH /api/tasks/{id}` operation exactly (field names, request/response shape) — compliant, confirmed via a live end-to-end check against the running backend

**5. Traceability Chain** (frontend, 4 links)

| Link | Status | Evidence |
|---|---|---|
| business req/AC → LLD | present | traceability shard — Business Spec to LLD, frontend rows |
| LLD → task | present | traceability shard — LLD to Tasks |
| task → code | present | traceability shard — Tasks to Code (`tasksClient.ts`, `App.tsx`) |
| code → unit test | present | traceability shard — Code to Tests (`App.test.tsx`, 2 new tests) |

**6. Issues Found:** none.

**7. Validation Outcome:** `approved` — all in-scope ACs pass, architecture compliant including contract conformance, full 4-link traceability chain present.

**8. Required Actions:** none.

**Status (validation):** `done` — validated 2026-08-17, all checks passed. Task closed.

## Task: TASK-TASK-TRACKER-002-FRONTEND-T2

### Status
`approved` — human approved 2026-08-17. Implementation review outcome: `approved`, no revisions requested.

### Implementation

**Changed files:**
- `src-code-frontend/src/components/TaskList.tsx` — destructures the `onToggleComplete` prop (added by `-FRONTEND-T1`); renders a checkbox per task reflecting `task.completed`; per-row in-flight state (`Set<string>` of toggling ids) disables that row's checkbox while its own request is pending; per-row error state (`Record<string, string>`) shows an inline `role="alert"` message on failure; applies `task-list__item--completed` when `task.completed` is true
- `src-code-frontend/src/index.css` — added `.task-list__item--completed` (strikethrough), `.task-list__item-label`, `.task-list__item-error`
- `src-code-frontend/src/components/TaskList.test.tsx` — 6 new tests

**Not changed:** `src-code-frontend/src/App.tsx`, `src-code-frontend/src/api/tasksClient.ts`, `src-code-frontend/src/types/task.ts` — untouched, all done in `-FRONTEND-T1`. `TaskForm.tsx` — untouched.

**Design simplification worth noting:** the LLD's Edge Cases (§6) describe a failed toggle needing to "revert the row's displayed state." In this implementation, no revert logic was needed: the checkbox's `checked` is bound directly to the `task.completed` prop, and `App.tsx`'s `handleToggleComplete` (`-FRONTEND-T1`) only calls `setTasks` *after* the API call succeeds — so a failure never optimistically changes what's displayed in the first place. There's nothing to revert; the inline error is shown alongside the unchanged checkbox. This is a simpler, equally-correct implementation of the same requirement, not a scope reduction.

**Architecture mapping:** `AD-FRONTEND-002` (no UI library — plain `<input type="checkbox">`), `AD-FRONTEND-006` (plain CSS, `block__element` naming matching `task-list__item`/`task-form__error` conventions), `AD-FRONTEND-008` (Vitest + RTL), `FRONTEND-STRUCTURE.md` §Module Boundaries (`TaskList` never imports `tasksClient.ts`; only calls the `onToggleComplete` prop).

**Assumptions:** per-row in-flight/error state is keyed by task `id` inside `TaskList` itself (not a separate sub-component) — consistent with this being a small, single-component concern rather than something needing extraction.

**Verification performed:** `npm run build` clean, 0 errors. `npm test` — **19/19 pass** (13 existing + 6 new). No tooling gap on this project's frontend.

**Blockers / follow-up gaps:** none. Real-browser manual verification was not performed for this task — relied on the automated unit/component test suite (RTL simulates real click/checkbox interaction), consistent with how every other task in this story and in `TASK-TRACKER-001` was verified.

**Traceability:** Task → Code and Code → Tests rows added; Coverage Matrix — all 8 REQs (4 frontend + 4 backend) across this story now `complete (pending validation)`.

**Handoff:** approved by human 2026-08-17. Proceeding to `/speccraft.unit-test` for this task — last of the 5 batched testing passes.

### Testing

**Scope note:** per `TESTING-STAGE.md`, this task's own In-Scope Work already required `TaskList` component tests, written during Implementation above (6 new tests). This formal `/speccraft.unit-test` pass — the last of the 4 tasks in this story — reviews that suite against Test Expectations.

**Test files (unchanged from Implementation):**
- `src-code-frontend/src/components/TaskList.test.tsx` — 8 tests total (2 pre-existing + 6 new)

**Coverage mapped to Test Expectations:**

| Test Expectation | Test(s) |
|---|---|
| Renders completed with treatment applied, incomplete without | `renders a completed task with the checkbox checked, an incomplete task unchecked` |
| Calls `onToggleComplete` with id + opposite boolean | `calls onToggleComplete with the task id and the opposite boolean of its current state` |
| Disables only the toggling row, re-enables after | `disables the toggling row's control while its own request is in flight, and re-enables it after`, `does not disable a sibling row's control while one row's toggle is in flight` |
| List order unchanged after a toggle | `preserves list order before and after a toggle` |
| Failed toggle shows inline error, doesn't affect other rows | `shows an inline error near the row when its toggle fails, without affecting other rows` |

**Excluded from unit tests (named explicitly):** the `onToggleComplete` implementation itself — `-FRONTEND-T1`'s own tests cover it; real network behavior — `TaskList` never calls `tasksClient.ts` directly.

**Verification performed:** re-reviewed all 6 new tests against Test Expectations line by line — full coverage confirmed, no gaps, no test files modified. `npm test` — 19/19 pass (unchanged from Implementation stage verification).

**Traceability:** no new Code→Tests rows needed; Workflow Metrics row appended for this `unit-test` command run. Last of the 4 tasks in the batch — once approved, all 4 tasks have approved unit-test passes and the story is ready for `/speccraft.validate`.

**Status:** `approved` — human approved 2026-08-17. Testing review outcome: `approved`, no revisions requested. Last of the 4 tasks in the batch — all 4 now have approved implementation + unit tests (backend tasks also have approved integration tests). Story ready for `/speccraft.validate`.

### Validation

**1. Task Identification**
- Task ID: TASK-TASK-TRACKER-002-FRONTEND-T2
- Title: Task completion toggle — list view
- Layer: frontend
- LLD Section Reference: `LLD-FRONTEND-TASK-TRACKER-002.md` §5, §6, §7, §10
- Business Spec Reference: `spec/business/tasks/TASK-TRACKER-002.md` — REQ-TASK-TRACKER-002-01, -02, -03, -04, AC-01, -02, -03, -04

**2. Inputs Checked**
- Architecture docs: `spec/architecture/ARCH-DECISIONS.md` (AD-FRONTEND-002, 006, 008), `spec/architecture/FRONTEND-STRUCTURE.md`
- Implementation review record: `### Status` — approved, human 2026-08-17
- Unit-testing review record: `### Testing` — approved, human 2026-08-17
- Integration-testing review record: n/a — frontend-tagged task

**3. AC Coverage Table**

| AC-ID | Criterion | Unit Test Ref | Integration Test Ref | Status |
|---|---|---|---|---|
| AC-01 | Incomplete → complete (rendering) | `TaskList.test.tsx` — "calls onToggleComplete with the task id and the opposite boolean of its current state" | n/a (frontend task) | pass |
| AC-02 | Complete → incomplete (same toggle path) | `TaskList.test.tsx` — "renders a completed task with the checkbox checked, an incomplete task unchecked" | n/a (frontend task) | pass |
| AC-03 | Completed tasks visually distinguished | `TaskList.test.tsx` — same checked/unchecked test; visual treatment is the `task-list__item--completed` CSS class applied per `task.completed` | n/a (frontend task) | pass |
| AC-04 | No position change (rendering contribution) | `TaskList.test.tsx` — "preserves list order before and after a toggle" | n/a (frontend task) | pass |

**4. Architecture Conformance:** `compliant`
- AD-FRONTEND-002 (no UI library) — plain `<input type="checkbox">`, styled via `index.css` only — compliant
- AD-FRONTEND-006 (plain CSS) — `block__element` naming (`task-list__item--completed`, `task-list__item-label`, `task-list__item-error`) consistent with existing conventions — compliant
- AD-FRONTEND-008 (Vitest + RTL) — compliant
- `FRONTEND-STRUCTURE.md` module boundaries — `TaskList.tsx` never imports `tasksClient.ts`; only calls the `onToggleComplete` prop — compliant

**5. Traceability Chain** (frontend, 4 links)

| Link | Status | Evidence |
|---|---|---|
| business req/AC → LLD | present | traceability shard |
| LLD → task | present | traceability shard |
| task → code | present | traceability shard — `TaskList.tsx`, `index.css` |
| code → unit test | present | traceability shard — `TaskList.test.tsx`, 6 new tests |

**6. Issues Found:** none. (The LLD's described "revert on failure" edge case turned out not to require dedicated revert logic, since the checkbox is bound directly to the `completed` prop and never optimistically updated — noted in Implementation as a design simplification, not a defect or gap.)

**7. Validation Outcome:** `approved` — all in-scope ACs pass, architecture compliant, full 4-link traceability chain present. This was the last of the 4 tasks in the story — all 4 now validated.

**8. Required Actions:** none. Story-level: all 4 tasks' Validation records complete; proceed to Progress Update (traceability Coverage Matrix + Workflow Metrics).

**Status (validation):** `done` — validated 2026-08-17, all checks passed. Task closed. All 4 tasks in `TASK-TRACKER-002` are now `done`.
