# Progress — TASK-TRACKER-001

## Intake

Completed in a prior session (shared, layer-agnostic). See `spec/traceability/tasks/TASK-TRACKER-001/TRACEABILITY.md` (Business Spec to LLD) for the Req-ID set. This file did not exist at that time — no entry was recorded here contemporaneously; not backfilled by this run to avoid inventing detail not actually captured live.

## LLD

### Frontend — LLD-FRONTEND-TASK-TRACKER-001
Approved 2026-08-13. See `spec/lld/tasks/LLD-FRONTEND-TASK-TRACKER-001.md` and the Workflow Metrics rows in the traceability shard for this run's timing/token data.

### Backend — LLD-BACKEND-TASK-TRACKER-001
Approved 2026-08-13. See `spec/lld/tasks/LLD-BACKEND-TASK-TRACKER-001.md`.

## Decomposition

Approved 2026-08-13 — 5 tasks (2 backend, 3 frontend). See `spec/traceability/tasks/TASK-TRACKER-001/TRACEABILITY.md` (LLD to Tasks).

## Task: TASK-TASK-TRACKER-001-BACKEND-T1

### Status
`approved` — human approved 2026-08-13 14:17. Implementation review outcome: `approved`, no revisions requested.

### Implementation

**Changed files:**
- `src-code-backend/src/repositories/tasks.repository.ts` — implemented `list()` (returns the module-scoped array) and `create()` (unshifts, so index 0 is always newest — single ordering decision point per LLD §5)
- `src-code-backend/src/services/tasks.service.ts` — implemented `createTask()` (trims + validates `title`, treats `undefined`/empty/whitespace identically, throws `Error('Title is required')` on invalid input before touching the repository; on valid input assigns `randomUUID()` as `id` and `new Date().toISOString()` as `createdAt`, delegates to `tasksRepository.create()` exactly once) and `listTasks()` (delegates to `tasksRepository.list()`)
- `contracts/tasks/tasks.yaml` (new) — OpenAPI 3.1 contract for `GET /api/tasks` and `POST /api/tasks`, matching `LLD-BACKEND-TASK-TRACKER-001.md` §5 touchpoint table exactly (request/response shapes, `201`/`400`/`200`)
- `src-code-backend/test/repositories/tasks.repository.test.ts` (new) — 3 tests
- `src-code-backend/test/services/tasks.service.test.ts` (new) — 7 tests
- `src-code-backend/src/types/task.ts` — no change; scaffold's stub already matched the LLD shape exactly

**Not changed (explicitly out of scope for T1):** `src-code-backend/src/controllers/tasks.controller.ts`, `src-code-backend/src/routes/tasks.routes.ts`, `src-code-backend/src/index.ts` — all still scaffold stubs, reserved for `-BACKEND-T2`.

**Architecture mapping:** `AD-BACKEND-001` (strict TS, `.ts` files), `AD-BACKEND-002` (repository is sole array owner, no ORM, no persistence), `AD-BACKEND-003` (no auth/permission checks added), `AD-X-001` (contract written to match LLD touchpoint table), `BACKEND-STRUCTURE.md` §Layering (repository only imported by the service, never by a controller).

**Assumptions:**
- `id` generation uses `crypto.randomUUID()` — LLD §12 leaves the mechanism as an implementation detail as long as IDs are unique.
- Invalid-title signaling from service to controller uses a thrown `Error` whose `.message` is exactly the LLD's contract error text (`"Title is required"`), so `-BACKEND-T2`'s controller can map it to `400 { error: err.message }` without re-deriving the string. This is a forward-compatibility choice for the not-yet-implemented controller, not controller behavior itself.

**Verification performed:** `npx tsc --ignoreConfig --strict --module commonjs --target es2022 --esModuleInterop --skipLibCheck` type-checked the new/changed source and test files clean (0 errors). Ran the actual test logic by compiling `src/` + `test/` to a throwaway scratch directory (outside the repo) with plain `tsc` and executing with unmodified `node --test` — all 10 tests passed. This environment's real `npm test` (`node --test` on `.ts` directly) currently cannot run: `ts-node@10.9.2` (devDependency, installed by scaffold) throws (`Cannot read properties of undefined (reading 'fileExists')`) against the installed `typescript@7.0.2`, and Node 22.14's own `--experimental-strip-types` resolves relative imports as ESM (requiring explicit extensions) which conflicts with this project's `module: commonjs` tsconfig. This is a pre-existing scaffold/tooling version mismatch, not introduced by this task — flagged as a blocker/gap below rather than silently patched (`package.json` is not in this task's Impacted Areas).

**Blockers / follow-up gaps:**
- `npm test` cannot execute `.ts` test files as configured (see Verification above). Needs a human decision: pin `typescript` to a version compatible with `ts-node@10.9.2` (e.g. TS 5.x), or upgrade `ts-node`/switch to a native-TS-aware runner, or add `--experimental-strip-types` plus a commonjs-compatible import style. Out of scope for T1 to decide or fix unilaterally.

**Traceability:** Task → Code and Code → Tests rows added in `spec/traceability/tasks/TASK-TRACKER-001/TRACEABILITY.md`; Coverage Matrix's backend rows flipped `Code Mapped`/`Test Mapped` to `mapped` (Integration Test Mapped stays `missing` until `-BACKEND-T2` / integration-testing stage).

**Handoff:** approved by human 2026-08-13 14:17. Proceeding to `/speccraft.unit-test` for this task.

### Testing

**Scope note:** per `TESTING-STAGE.md` (`## Overview` — "one task may include both code and tests; this is the default"), this task's own In-Scope Work already required the repository + service unit tests, written and passing during the Implementation stage above. This Testing-stage pass reviewed that existing suite against the task's full Test Expectations / AC set rather than authoring a parallel/duplicate suite.

**Test files (unchanged from Implementation):**
- `src-code-backend/test/repositories/tasks.repository.test.ts` — 3 tests
- `src-code-backend/test/services/tasks.service.test.ts` — 7 tests

**Coverage mapped to acceptance criteria:**
| AC-ID | Backend-owned behavior | Test(s) |
|---|---|---|
| AC-TASK-TRACKER-001-01 | Valid title creates a task with that title | `createTask assigns id + createdAt and delegates to the repository exactly once`, `createTask trims the title before storing` |
| AC-TASK-TRACKER-001-02 | Response includes a unique `id` and `createdAt` | `createTask assigns id + createdAt and delegates to the repository exactly once` |
| AC-TASK-TRACKER-001-03 | Every task shown, newest-first | `create() places the new item at index 0 (newest-first)`, `list() reflects current contents after multiple creates` |
| AC-TASK-TRACKER-001-04 | Backend's contribution: `list()`/`GET` is already newest-first with no extra sort step needed | same repository ordering tests above |
| AC-TASK-TRACKER-001-05 | Empty/whitespace/missing title rejected, repository never called | `createTask rejects an empty title...`, `...a whitespace-only title...`, `...a missing title (undefined)...` |

**Excluded from unit tests (named explicitly, not silently skipped):**
- HTTP status-code shaping (`201`/`400`/`200`) and the JSON error body — controller-layer behavior, owned by `-BACKEND-T2`, not this domain-service layer.
- "Validation message shown" to the end user — frontend-layer concern (`LLD-FRONTEND-TASK-TRACKER-001.md`).
- Rapid double-submit dedup — business spec explicitly assigns this to the client (disable-while-in-flight); not this service's responsibility.
- Malformed JSON body handling — Express body-parser middleware, outside the service/repository layer.
- Full cross-boundary HTTP flow — deferred to the Integration Testing stage for this backend-tagged task.

**Verification performed:** re-ran the full suite via the same scratch `tsc` compile + plain `node --test` approach used in Implementation (no source changed since then) — 10/10 pass.

**Gaps:** none new. The `npm test` / `ts-node`↔`typescript@7.0.2` incompatibility logged under Implementation above still applies and is not re-litigated here.

**Traceability:** no new Code→Tests rows needed (existing rows from Implementation already cover this task's full test scope); Workflow Metrics row appended for this `unit-test` command run.

**Status:** `approved` — human approved 2026-08-13 14:20. Testing review outcome: `approved`, no revisions requested. Proceeding to `/speccraft.integration-test` (backend-tagged task, per `AGENTS.md` §Dual-layer branch).

**Batched-pass re-confirmation (2026-08-13, `/speccraft.unit-test` re-invoked):** re-run as the formal batched unit-test pass now that all 5 tasks' implementations are approved (see `-FRONTEND-T3` Handoff below). Re-reviewed the existing suite (`tasks.repository.test.ts` — 3 tests, `tasks.service.test.ts` — 7 tests; both files unchanged from the Implementation stage) line by line against this task's own `Test Expectations` / `Edge Cases To Preserve` and `LLD-BACKEND-TASK-TRACKER-001.md` §11 Testing Implications. Every listed behavior (repository ordering + list contents; service empty/whitespace/missing-title rejection with zero repository calls; id/createdAt assignment; exactly-once delegation per valid call; no dedup across repeated valid calls) already has a passing, deterministic test. No gaps found, no test files modified — regenerating would have duplicated already-approved coverage.

**Status (batched-pass confirmation):** `approved` — human approved 2026-08-13 15:57, no revisions requested. This task's slot in the batch is now closed: Testing re-confirmed and approved, Integration Testing already separately `approved` (2026-08-13 15:11, not reopened by this pass). Remaining batch work is the other 4 tasks' unit-test passes, then `/speccraft.validate` once the whole story is ready.

### Integration Testing

**Finding — no integration surface introduced by this task:** `-BACKEND-T1`'s own In-Scope Work is the domain layer only (`Task` type, repository, service, contract file). Per the task file's own Out-Of-Scope Work: "HTTP routing, request parsing, or response shaping (routes/controllers — see `-BACKEND-T2`)" and "Express app bootstrap, CORS, JSON body-parsing middleware (see `-BACKEND-T2`)". Consequently:

- **API entrypoint:** none owned by this task. `POST/GET /api/tasks` do not yet route to real logic — `tasks.controller.ts` still returns `501` stubs, `src/index.ts` has not wired the Express app. Contract-level HTTP integration testing (per `LLD-BACKEND-TASK-TRACKER-001.md` §11 — `POST /api/tasks` → `201`/`400`, `GET /api/tasks` → `200`, via `supertest`) is not executable until `-BACKEND-T2` lands that wiring.
- **Persistence/cache/queue/external-service boundary:** none exists to test. `tasks.repository.ts` is a same-process in-memory array (`AD-BACKEND-002`) with no transaction boundary (LLD §5: "Transaction boundaries: none needed — single in-process array, single-threaded event loop"). The service→repository call is a plain in-process function call, not a network/persistence/process boundary — it is exactly what the approved unit tests already exercise (real repository, not a stub, wired through the service).
- Writing an "integration test" that only re-invokes `createTask`/`listTasks` against the real repository would duplicate the approved unit tests verbatim, which `INTEGRATION-TESTING-STAGE.md` §Must-not explicitly disallows ("do not re-assert unit-level logic already covered by unit tests").

**Conclusion:** no integration test files added for `-BACKEND-T1`. The real HTTP-level integration tests described in the LLD are deferred to `-BACKEND-T2`'s own Integration Testing stage, once that task's routes/controller/app-bootstrap work is implemented and approved — that is the point at which an actual API entrypoint and wired boundary first exist for this resource.

**Gaps (explicit, not silent):** the full `POST`/`GET /api/tasks` contract-level coverage (status codes, error body, end-to-end create→list ordering over real HTTP) is untested until `-BACKEND-T2` completes. This is a sequencing gap, not a defect in `-BACKEND-T1`.

**Traceability:** Unit Tests → Integration Tests row recorded as `deferred to -BACKEND-T2` (not `missing`) for this task's rows, to distinguish "correctly not-yet-applicable" from "owed and outstanding."

**Status:** `approved` — human approved 2026-08-13 15:11. This stage closes for `-BACKEND-T1` specifically (no boundary owed by this task); real HTTP-level integration coverage still lands with `-BACKEND-T2`'s own Integration Testing stage.

**Re-confirmation (2026-08-13, `/speccraft.integration-test` re-invoked):** re-run against a request that named `-BACKEND-T1` explicitly, after surfacing to the human that this stage was already closed for this task and that `-BACKEND-T2` (now implemented and unit-test-approved) is the task that actually owns a testable API boundary. Human chose to re-confirm `-BACKEND-T1`'s closed finding rather than redirect to `-BACKEND-T2`. Re-read the current source: `src-code-backend/src/repositories/tasks.repository.ts` and `src-code-backend/src/services/tasks.service.ts` are unchanged since the original 15:11 approval — still a same-process in-memory array with a plain in-process function call between service and repository, no HTTP entrypoint, no persistence/cache/queue/external-service boundary. `-BACKEND-T2`'s controller having since moved off its `501` stub does not change `-BACKEND-T1`'s own ownership: routes/controller/app-bootstrap remain explicitly Out-Of-Scope for `-BACKEND-T1` per its own task file. Conclusion unchanged: no integration test files added for `-BACKEND-T1`; no boundary introduced or changed by this task's own scope. No test files modified.

**Status (re-confirmation):** `in-review` — awaiting human response. Not self-approved; original 15:11 approval and traceability row (`deferred to -BACKEND-T2`) stand unchanged, no correction required.

**Status (re-confirmation, approved):** `approved` — human approved 2026-08-13 16:22, no revisions requested. `-BACKEND-T1`'s Integration Testing stage remains closed on the same terms as the original 15:11 approval (no boundary owed by this task). Next pending integration testing work is `-BACKEND-T2`'s own stage.

### Validation

**1. Task Identification**
- Task ID: TASK-TASK-TRACKER-001-BACKEND-T1
- Title: Tasks domain service — repository, service, types, contract
- Layer: backend
- LLD Section Reference: `LLD-BACKEND-TASK-TRACKER-001.md` §5, §8, §9, §11
- Business Spec Reference: `spec/business/tasks/TASK-TRACKER-001.md` — REQ-TASK-TRACKER-001-01..04, AC-TASK-TRACKER-001-01..05

**2. Inputs Checked**
- Architecture docs: `spec/architecture/ARCH-DECISIONS.md` (AD-BACKEND-001..006, AD-X-001..003), `spec/architecture/BACKEND-STRUCTURE.md` (layering + data/integration strategy)
- Implementation review record: this file, `## Task: TASK-TASK-TRACKER-001-BACKEND-T1` → `### Status` — approved, human 2026-08-13 14:17
- Unit-testing review record: `### Testing` — approved, human 2026-08-13 14:20; batched-pass re-confirmation approved, human 2026-08-13 15:57
- Integration-testing review record: `### Integration Testing` — approved, human 2026-08-13 15:11; re-confirmation approved, human 2026-08-13 16:22

**3. AC Coverage Table**

| AC-ID | Criterion | Unit Test Ref | Integration Test Ref | Status |
|---|---|---|---|---|
| AC-01 | Non-empty title creates a task | `tasks.service.test.ts` — "assigns id + createdAt and delegates to the repository exactly once", "trims the title before storing" | `tasks.integration.test.ts` (via `-BACKEND-T2`, exercises this task's service/repository transitively) — "POST /api/tasks responds 201 ... valid title" | pass |
| AC-02 | Response includes unique `id` + `createdAt` | `tasks.service.test.ts` — "assigns id + createdAt..." | `tasks.integration.test.ts` — "POST 201 ... typeof id/createdAt string" | pass |
| AC-03 | Every task shown, newest-first | `tasks.repository.test.ts` — "create() places new item at index 0", "list() reflects contents after multiple creates" | `tasks.integration.test.ts` — "GET reflects newly created tasks newest-first over the real stack" | pass |
| AC-04 | List reflects new task without reload (backend's contribution: repository order needs no extra sort) | same repository ordering tests as AC-03 | same integration ordering test as AC-03 | pass |
| AC-05 | Empty/whitespace/missing title rejected, repository never called | `tasks.service.test.ts` — 3 rejection tests (empty, whitespace, missing/undefined) | `tasks.integration.test.ts` — 3 × 400 tests (whitespace, empty-string, missing field) | pass |

**4. Architecture Conformance:** `compliant`
- AD-BACKEND-001 (TS strict) — all new files `.ts` — compliant
- AD-BACKEND-002 (no ORM, sole array owner) — `tasks.repository.ts` is the only module touching the array — compliant
- AD-BACKEND-003 (no auth) — no guard/permission code present — compliant
- AD-X-001 (OpenAPI 3.1 contract) — `contracts/tasks/tasks.yaml`, authored by this task, verified field-for-field against LLD §5 touchpoint table (`Task`/`CreateTaskRequest`/`Error` schemas, `201`/`400`/`200`) — compliant, no drift
- `BACKEND-STRUCTURE.md` layering — repository imports only `src/types/task.ts`; not imported by the controller — compliant

**5. Traceability Chain** (backend, 5 links)

| Link | Status | Evidence |
|---|---|---|
| business req/AC → LLD | present | `spec/traceability/tasks/TASK-TRACKER-001/TRACEABILITY.md` — Business Spec to LLD table, backend rows |
| LLD → task | present | same shard — LLD to Tasks table |
| task → code | present | same shard — Tasks to Code table (`tasks.repository.ts`, `tasks.service.ts`, `contracts/tasks/tasks.yaml`) |
| code → unit test | present | same shard — Code to Tests table (`tasks.repository.test.ts`, `tasks.service.test.ts`) |
| unit test → integration test | present (via `-BACKEND-T2`) | same shard — Unit Tests to Integration Tests table; row explicitly notes this task introduces no boundary of its own, boundary coverage lands via `-BACKEND-T2`'s `tasks.integration.test.ts`, which exercises this task's service/repository code in-process — approved 2026-08-13 16:22 |

**6. Issues Found**
- **VAL-001** (minor) — this project's configured `npm test` script cannot execute `.ts` test files directly: installed `ts-node@10.9.2` is incompatible with installed `typescript@7.0.2` (`Cannot read properties of undefined (reading 'fileExists')`), and Node 22.14's `--experimental-strip-types` resolves relative imports as ESM, conflicting with this project's `module: commonjs` tsconfig. Affected check: none of the required Validation checks (AC Coverage, Architecture, Traceability) — all backend suites (repository, service, controller, integration — 23 tests total) were independently verified passing via a scratch `tsc`-compile + plain `node --test` workaround, run identically at every implementation/testing/integration-testing pass for this story. `package.json` is outside every task's own Impacted Areas, so no task in this story owns fixing it. This gap has been visibly disclosed (not silently patched) at every prior stage — Implementation (approved 14:17), Testing (approved 14:20, 15:57), Integration Testing (approved 15:11, 16:22) — and the human approved each of those stages with this note present, though no stage recorded it via the formal Accepted-Issues (`Issue`/`Justification`/`Accepted By`) schema. Required action: human decision to pin `typescript` to a `ts-node@10.9.2`-compatible version, upgrade `ts-node`, or adopt a different native-TS test-execution path — and, if accepting the gap as-is, ratify it explicitly via the Accepted-Issues schema. Does not block this task's Validation outcome (see §7).

**7. Validation Outcome:** `approved` — all in-scope ACs pass, architecture compliant, full 5-link traceability chain present. VAL-001 is a pre-existing, out-of-task-scope environment/tooling gap that does not affect AC coverage (independently re-verified via workaround), architecture conformance, or traceability completeness; it has been surfaced honestly rather than hidden and does not, on its own facts, warrant `blocked`.

**8. Required Actions:** none to reach `done` for this task. Recommended (not blocking): human ratifies or resolves VAL-001 (see Issues Found).

**Status (validation):** `done` — validated 2026-08-13, all checks passed. Task closed.

**VAL-001 Resolution (2026-08-14, sanity check per `examples/LIVE-EXAMPLES-PLAN.md` Phase 1 step 7 — not a workflow stage re-run):** ran `npm install`/`npm run build`/`npm test`/`npm run dev` for real in `src-code-backend/`. Found VAL-001 was broader than originally recorded — it also crashed `npm run dev` (`ts-node@10.9.2` incompatible with `typescript@7.0.2`), not just `npm test`. Also found a second, previously-undocumented gap: `npm run build` failed with `TS6059` because `tsconfig.json` had `rootDir: "src"` with no `include`, so `tsc` picked up `test/**` under its default include pattern. Resolved both: pinned `typescript` to `^5.9.3` (a `ts-node@10.9.2`-compatible release) in `src-code-backend/package.json`, added `"include": ["src/**/*"]` to `src-code-backend/tsconfig.json`, and changed the `test` script to `node --require ts-node/register --test` (routes test execution through ts-node's require hook instead of Node's native `.ts` type-stripping, which requires explicit file extensions on relative `require()`s that this project's imports don't use). Re-verified: `npm run build` clean, `npm test` 23/23 pass, `npm run dev` boots and serves `GET /health` → `{"status":"ok"}`, live `GET`/`POST /api/tasks` exercised against the running server and confirmed correct, `npm start` (build + `node dist/index.js`) also verified. No `src/`/`test/` source files changed. See `examples/greenfield-demo/WALKTHROUGH.md` §6 for the full account.

## Task: TASK-TASK-TRACKER-001-BACKEND-T2

### Status
`approved` — human approved 2026-08-13 15:11. Implementation review outcome: `approved`, no revisions requested.

### Implementation

**Changed files:**
- `src-code-backend/src/controllers/tasks.controller.ts` — implemented `listTasks()` (calls `tasksService.listTasks()`, responds `200` with the array) and `createTask()` (calls `tasksService.createTask(title)`; on success responds `201` with the created task; on the service's thrown validation error, responds `400` with `{ error: err.message }`)
- `src-code-backend/test/controllers/tasks.controller.test.ts` (new) — 5 controller-level tests, mocking `tasks.service.ts` via `node:test`'s `t.mock.method`

**Not changed:** `src-code-backend/src/index.ts`, `src-code-backend/src/routes/tasks.routes.ts` — both already matched this task's required shape from scaffold (Express bootstrap with `cors` restricted to `http://localhost:5173`, JSON body parsing, route registration, server listen already present; router already wired `GET`/`POST /` to the controller). No changes needed.

**Architecture mapping:** `AD-BACKEND-001` (strict TS), `AD-BACKEND-003` (no auth/guard added), `AD-BACKEND-004` (REST/JSON, no versioning), `AD-X-002` (CORS already restricted, unchanged), `BACKEND-STRUCTURE.md` §Layering (controller calls the service only, never the repository directly; route file carries no logic).

**Assumptions:**
- On a thrown service error, the controller maps `err.message` directly into the `400` body's `error` field, relying on the service (per `-BACKEND-T1`) always throwing with the exact contract text (`"Title is required"`). If a non-`Error` value were ever thrown, the controller falls back to the same literal string.
- `req.body` is read defensively as `req.body ?? {}` in case body-parsing ever yields `undefined`, even though `express.json()` (already wired in `index.ts`) normally yields `{}` for an empty body.

**Verification performed:** type-checked clean (`tsc --ignoreConfig --strict ...`) across all backend source + all three test files together. Ran the full suite (repository + service + controller, 15 tests) via the same scratch `tsc` compile + plain `node --test` workaround used for `-BACKEND-T1` — 15/15 pass. The `npm test` / `ts-node@10.9.2` vs `typescript@7.0.2` incompatibility logged under `-BACKEND-T1` still applies unchanged; not re-investigated here.

**Blockers / follow-up gaps:** none new. The pre-existing `npm test` tooling gap (see `-BACKEND-T1` above) still stands.

**Traceability:** Task → Code and Code → Tests rows added in `spec/traceability/tasks/TASK-TRACKER-001/TRACEABILITY.md` for `-BACKEND-T2`. Coverage Matrix backend rows were already `mapped` for Code/Test (shared REQ-IDs with `-BACKEND-T1`); no further change needed there.

**Handoff:** approved by human 2026-08-13 15:11. Per the agreed plan, formal `/speccraft.unit-test` (and, downstream, `-BACKEND-T2`'s own Integration Testing stage — the point at which real `supertest` HTTP-level coverage first becomes possible for this resource) are deferred until all 5 tasks' implementations are done.

### Testing

**Scope note:** per `TESTING-STAGE.md` (`## Overview` — "one task may include both code and tests; this is the default"), this task's own In-Scope Work already required controller-level unit tests, written during Implementation above (5 tests). This formal `/speccraft.unit-test` batched pass reviewed that suite against this task's `Test Expectations` / `Edge Cases To Preserve` and closed one gap found during review.

**Test files:**
- `src-code-backend/test/controllers/tasks.controller.test.ts` — 6 tests (5 existing + 1 added this pass)

**Gap found and closed:** the Test Expectations line "`GET /api/tasks` → `200` with all created tasks (order as returned by the service/repository) after multiple creates" was only exercised with a single-item mocked array in the existing suite. Added `listTasks responds 200 with all tasks in the order the service returns them, after multiple creates` — mocks the service to return a 2-item array in a specific order and asserts the controller passes it through unchanged (same reference, same order). This does not duplicate `-BACKEND-T1`'s repository/service ordering tests — it verifies the controller itself performs no re-sort or transformation, which is this task's own layer to own.

**Coverage mapped to Test Expectations:**
| Test Expectation | Test(s) |
|---|---|
| `POST /api/tasks` → `201` with created task, valid title | `createTask responds 201 with the created task for a valid title` |
| `POST /api/tasks` → `400` with `{ error }`, invalid title | `createTask responds 400 with the service error message for an invalid title`, `createTask treats a missing request body as a missing title` |
| `GET /api/tasks` → `200` with `[]` when empty | `listTasks responds 200 with an empty array when no tasks exist` |
| `GET /api/tasks` → `200` with all tasks, order as returned, after multiple creates | `listTasks responds 200 with the service result` (single item), `listTasks responds 200 with all tasks in the order the service returns them, after multiple creates` (new, multi-item) |

**Excluded from unit tests (named explicitly, not silently skipped):**
- Malformed JSON body handling — Express body-parser middleware default, outside the controller's own code.
- Full HTTP-stack behavior (real request/response cycle, headers, `supertest`) — deferred to this task's own Integration Testing stage.
- Distinguishing empty-string vs whitespace-only title at the controller level — that distinction is the service's responsibility (`-BACKEND-T1`, already unit-tested there); the controller only needs to prove it maps *any* thrown validation error to `400 { error: message }`, which the existing test already does.

**Verification performed:** re-ran the full backend suite (repository + service + controller, now 16 tests) via the same scratch `tsc` compile + plain `node --test` workaround used for prior backend tasks (the `npm test`/`ts-node@10.9.2`↔`typescript@7.0.2` incompatibility logged under `-BACKEND-T1` still applies, not re-investigated here) — 16/16 pass.

**Traceability:** Code → Tests row for `-BACKEND-T2` updated with the new test case; Workflow Metrics row appended for this `unit-test` command run.

**Status:** `approved` — human approved 2026-08-13 16:01, no revisions requested. Testing review outcome: `approved`. Proceeding to `/speccraft.integration-test` for this task (per `AGENTS.md` §Dual-layer branch).

### Integration Testing

**Boundary identified:** this task owns the resource's one real boundary — the HTTP surface (`src/index.ts` bootstrap, `src/routes/tasks.routes.ts`, `src/controllers/tasks.controller.ts`), wired to the already-approved `-BACKEND-T1` service/repository. Per `BACKEND-STRUCTURE.md` §Integration Strategy, there is no external dependency (no DB/cache/queue/third-party API) to containerize or mock — the real Express app is exercised in-process via `supertest`, hitting real routes → controller → service → repository end to end, per `AD-BACKEND-006`.

**Starting point found:** `src-code-backend/test/integration/tasks.integration.test.ts` already existed on disk (4 tests: `GET` empty-list, `POST` whitespace-title 400, `POST` valid-title 201, `GET` newest-first ordering over the real stack) but had never been passed through this workflow's Integration Testing stage — no traceability row, no progress record, no review outcome. Treated as an unreviewed draft for this task rather than a pre-approved artifact (nothing in traceability/progress recorded it as approved), reviewed it against this task's own `Test Expectations` / `Edge Cases To Preserve`, and extended it to close the gaps found.

**Gaps found and closed (3 new tests added, existing 4 preserved unchanged):**
- empty-string `title` → `400 { error: "Title is required" }` (Edge Cases listed empty/whitespace/missing as one path; whitespace was covered, empty-string was not)
- `title` field missing entirely from the request body → same `400` contract (distinct from empty-string at the wire level — no key at all vs. an empty value)
- malformed JSON body on `POST` → asserts Express's default body-parser error handling returns `400` and does **not** produce this task's own `{ error: "Title is required" }` contract body (proves the two failure paths are distinguishable, per this task's own Edge Cases line: "Express's default body-parser error handling applies (no custom body beyond the framework default)")

**Test files (final):**
- `src-code-backend/test/integration/tasks.integration.test.ts` — 7 tests (4 pre-existing + 3 added this pass)

**Coverage mapped to Test Expectations / Edge Cases:**
| Test Expectation / Edge Case | Test(s) |
|---|---|
| `POST /api/tasks` → `201` with created task, valid title | `POST /api/tasks responds 201 with the created task for a valid title` |
| `POST /api/tasks` → `400` with `{ error }`, whitespace title | `POST /api/tasks responds 400 with the contract error body for a whitespace-only title` |
| `POST /api/tasks` → `400` with `{ error }`, empty-string title | `POST /api/tasks responds 400 with the contract error body for an empty-string title` (new) |
| `POST /api/tasks` → `400` with `{ error }`, missing title field | `POST /api/tasks responds 400 with the contract error body when the title field is missing entirely` (new) |
| Malformed JSON body → Express default error handling, not the custom contract body | `POST /api/tasks with a malformed JSON body falls through to Express default body-parser error handling` (new) |
| `GET /api/tasks` → `200` with `[]` when empty | `GET /api/tasks responds 200 with [] when no tasks exist` |
| `GET /api/tasks` → `200` with all tasks, newest-first, after multiple creates, over the real stack | `GET /api/tasks reflects newly created tasks, newest first, over the real HTTP + service + repository stack` |

**Boundaries not exercised, with reason:** none owed by this task beyond the HTTP surface above — no database/cache/queue/external service exists in this project (`AD-BACKEND-002`, `AD-BACKEND-005`, `BACKEND-STRUCTURE.md`). CORS (`AD-X-002`) is wired in `src/index.ts` but is not part of this task's own `Test Expectations`/`Edge Cases`; not added here to avoid widening scope beyond what was asked — flagged as an optional future addition, not a gap owed by this task.

**Test isolation note:** `tasks.repository.ts` is a module-scoped singleton with no exposed reset hook (by design, per `AD-BACKEND-002` — no test-only surface added). Within this one file, the empty-list assertion must run first and is order-dependent on `node --test`'s default sequential-within-file execution; across separate `node --test` invocations state resets because each run is a fresh process. This is an accepted trade-off given the architecture, not silently hidden.

**Verification performed:** `npx tsc --ignoreConfig --strict --module commonjs --target es2022 --esModuleInterop --skipLibCheck` across all backend `src/` + `test/` files (including the new integration tests) — clean, 0 errors. Ran the actual suite via the same scratch `tsc`-compile-to-throwaway-dir + plain `node --test` workaround used for `-BACKEND-T1`/`-BACKEND-T2` Implementation (this project's `npm test` still cannot execute `.ts` directly — same pre-existing `ts-node@10.9.2` vs `typescript@7.0.2` incompatibility logged under `-BACKEND-T1`, unresolved, not re-litigated here) — full backend suite (repository 3 + service 7 + controller 6 + integration 7 = 23 tests) passes 23/23, including the 3 new integration tests.

**Traceability:** Unit Tests → Integration Tests row added for `-BACKEND-T1`/`-BACKEND-T2`'s shared boundary (the HTTP surface `-BACKEND-T2` owns, wired to `-BACKEND-T1`'s already-tested service/repository) in `spec/traceability/tasks/TASK-TRACKER-001/TRACEABILITY.md`; Coverage Matrix backend rows' `Integration Test Mapped` flipped from `deferred (-BACKEND-T2)` to `mapped`.

**Status:** `in-review` — awaiting human response. Not self-approved.

**Status (approved):** `approved` — human approved 2026-08-13 16:29, no revisions requested. All 5 tasks in this story now have approved implementation, unit tests, and (backend-tagged tasks) integration tests — story ready for `/speccraft.validate`.

### Validation

**1. Task Identification**
- Task ID: TASK-TASK-TRACKER-001-BACKEND-T2
- Title: Tasks HTTP endpoints — bootstrap, routes, controller
- Layer: backend
- LLD Section Reference: `LLD-BACKEND-TASK-TRACKER-001.md` §5, §6, §8, §10
- Business Spec Reference: `spec/business/tasks/TASK-TRACKER-001.md` — REQ-TASK-TRACKER-001-01..04, AC-TASK-TRACKER-001-01..05

**2. Inputs Checked**
- Architecture docs: `spec/architecture/ARCH-DECISIONS.md` (AD-BACKEND-001, 003, 004, 006, AD-X-001, 002), `spec/architecture/BACKEND-STRUCTURE.md`
- Implementation review record: `### Status` — approved, human 2026-08-13 15:11
- Unit-testing review record: `### Testing` — approved, human 2026-08-13 16:01 (existing 5 + 1 gap-closing test = 6)
- Integration-testing review record: `### Integration Testing` — approved, human 2026-08-13 16:29

**3. AC Coverage Table**

| AC-ID | Criterion | Unit Test Ref | Integration Test Ref | Status |
|---|---|---|---|---|
| AC-01 | Valid title → task created, `201` | `tasks.controller.test.ts` — "createTask responds 201 with the created task for a valid title" | `tasks.integration.test.ts` — "POST responds 201 with the created task for a valid title" | pass |
| AC-02 | Response includes `id` + `createdAt` | same 201 controller test (asserts body passthrough) | same integration 201 test (asserts `typeof id`/`createdAt`) | pass |
| AC-03 | Every task shown, newest-first | `tasks.controller.test.ts` — "listTasks responds 200 with all tasks in the order the service returns them, after multiple creates" | `tasks.integration.test.ts` — "GET reflects newly created tasks, newest first, over the real HTTP + service + repository stack" | pass |
| AC-04 | List reflects new task without reload (backend's `GET` contribution) | same ordering controller test | same integration ordering test | pass |
| AC-05 | Empty/whitespace/missing title → `400` `{ error }` | `tasks.controller.test.ts` — "responds 400 with the service error message", "treats a missing request body as a missing title" | `tasks.integration.test.ts` — 3× `400` tests (whitespace/empty/missing) + malformed-JSON-body distinguishing test | pass |

**4. Architecture Conformance:** `compliant`
- AD-BACKEND-001 (TS strict) — compliant
- AD-BACKEND-003 (no auth) — no guard middleware added — compliant
- AD-BACKEND-004 (REST/JSON, no versioning) — compliant
- AD-X-002 (CORS restricted to `http://localhost:5173`) — `src/index.ts` `cors({ origin: 'http://localhost:5173' })` — compliant
- `BACKEND-STRUCTURE.md` layering — `tasks.controller.ts` imports only `tasks.service.ts` (never the repository); `tasks.routes.ts` carries URL/method shape only, no logic — compliant
- Contract Conformance (backend, new/changed operation) — `contracts/tasks/tasks.yaml` (authored by `-BACKEND-T1`) matches this task's controller status-code/body shaping exactly (`201`/`400 {error}`/`200`) — compliant, no drift found

**5. Traceability Chain** (backend, 5 links)

| Link | Status | Evidence |
|---|---|---|
| business req/AC → LLD | present | traceability shard — Business Spec to LLD |
| LLD → task | present | traceability shard — LLD to Tasks |
| task → code | present | traceability shard — Tasks to Code (`tasks.controller.ts`) |
| code → unit test | present | traceability shard — Code to Tests (`tasks.controller.test.ts`, 6 tests) |
| unit test → integration test | present | traceability shard — Unit Tests to Integration Tests (`tasks.integration.test.ts`, 7 tests, approved 2026-08-13 16:29) |

**6. Issues Found**
- VAL-001 (see `-BACKEND-T1` Validation) — same environment-level `npm test`/`ts-node`↔`typescript` gap, not specific to this task's own code or scope; does not affect this task's AC coverage, independently re-verified passing via the same scratch-compile workaround.

**7. Validation Outcome:** `approved` — all in-scope ACs pass, architecture compliant (including Contract Conformance), full 5-link traceability chain present. VAL-001 does not block this outcome for the same reasons stated under `-BACKEND-T1`.

**8. Required Actions:** none to reach `done` for this task. See `-BACKEND-T1` Validation for the shared, non-blocking VAL-001 recommendation.

**Status (validation):** `done` — validated 2026-08-13, all checks passed. Task closed.

## Task: TASK-TASK-TRACKER-001-FRONTEND-T1

### Status
`approved` — human approved 2026-08-13 15:08. Implementation review outcome: `approved`, no revisions requested.

### Implementation

**Changed files:**
- `src-code-frontend/src/api/tasksClient.ts` — implemented `listTasks()` (`GET /api/tasks`, throws on non-2xx) and `createTask(title)` (`POST /api/tasks` with `{ title }` body, surfaces the server's `{ error }` body message on non-2xx, throws on network failure)
- `src-code-frontend/src/App.tsx` — composition root; owns `tasks: Task[]`, `isLoading`, `listError` state; fetches on mount via `useEffect`, catches fetch failure into `listError` (rendered as an inline `role="alert"` banner), shows a loading indicator while the initial fetch is in flight; `handleCreate` calls `tasksClient.createTask` and unshifts the result onto `tasks` (no re-fetch); renders `TaskList`/`TaskForm`, passing data/callbacks as props only
- `src-code-frontend/src/App.test.tsx` (new) — 4 tests

**Not changed:** `src-code-frontend/src/types/task.ts`, `src-code-frontend/src/main.tsx`, `src-code-frontend/src/index.css` — all already matched this task's required shape from scaffold. `src-code-frontend/src/components/TaskForm.tsx`, `src-code-frontend/src/components/TaskList.tsx` — untouched, explicitly out of scope (`-FRONTEND-T2`/`-T3`), still return `null`.

**Architecture mapping:** `AD-FRONTEND-001` (Vite+React+TS strict), `AD-FRONTEND-003` (hooks only, `tasksClient.ts` is the one API seam), `AD-FRONTEND-005` (no auth/guards), `AD-FRONTEND-007` (Vitest+RTL), `FRONTEND-STRUCTURE.md` §Module Boundaries (`App.tsx` → `components/`/`api/`/`types/`, one direction; components never import `tasksClient.ts` directly — unchanged, since I didn't touch the components).

**Contract note:** at task-authoring time this task was designed to consume the LLD-BACKEND touchpoint table as an interim mock shape (per its own `Dependencies` field), but `-BACKEND-T1` has since landed the real `contracts/tasks/tasks.yaml` — implemented directly against that real file instead of the interim shape, so no reconciliation is owed later.

**Assumptions:**
- `TaskForm`'s `onCreate` prop is currently typed `(title: string) => void` in its (unimplemented) stub. `App.tsx`'s `handleCreate` is actually `async` (returns `Promise<void>`), which TypeScript permits assigning to a `void`-returning callback type. This works today, but `-FRONTEND-T2` will likely need to widen `onCreate`'s type to `(title: string) => Promise<void>` once it implements `formError` handling, so it can `await`/`catch` create failures — a forward-compatibility note for that task, not a change made here (`TaskForm.tsx` is untouched).
- No loading-spinner library — plain text ("Loading tasks…") per `AD-FRONTEND-002`/`006`.
- `VITE_API_BASE_URL` (from `.env.example`, defaults to `http://localhost:4000`) is read via `import.meta.env`, typed permissively by the existing `vite/client` ambient types already in `tsconfig.app.json` — no new ambient `.d.ts` file needed.

**Verification performed:** `npx tsc -b --noEmit` clean (0 errors). `npx vitest run` — 4/4 tests pass. Unlike the backend, this project's real `npm test` command works out of the box here — no tooling gap on the frontend side.

**Blockers / follow-up gaps:** none. (The backend's `npm test`/`ts-node` gap is unrelated to this task and does not affect the frontend.)

**Traceability:** Task → Code and Code → Tests rows added for `-FRONTEND-T1`; Coverage Matrix frontend rows' Code Mapped/Test Mapped flipped from `missing` to `partial (T1 only)` — the data/API/composition layer is done, but each REQ's user-visible completion still needs `-FRONTEND-T2` (form) and/or `-FRONTEND-T3` (list rendering).

### Testing

**Scope note:** per `TESTING-STAGE.md` (`## Overview`), this task's own In-Scope Work already required `App.tsx` unit tests, written during Implementation above (4 tests). This formal `/speccraft.unit-test` batched pass reviewed that suite against this task's `Test Expectations` / `Edge Cases To Preserve`.

**Test files (unchanged from Implementation):**
- `src-code-frontend/src/App.test.tsx` — 4 tests

**Coverage mapped to Test Expectations:**
| Test Expectation / Edge Case | Test(s) |
|---|---|
| Fetches list on mount and renders it | `fetches the task list on mount and renders it` |
| Successful create places new task at top, no re-fetch | `places a newly created task at the top of local state without a re-fetch` (asserts `listTasks` called exactly once) |
| Failed initial fetch shows error banner | `shows an error banner when the initial fetch fails` |
| Loading indicator while initial fetch in flight | `shows a loading indicator while the initial fetch is in flight` |

**Excluded from unit tests (named explicitly):**
- `TaskList`'s own empty-state rendering — owned by `-FRONTEND-T3`; `App.tsx` is only responsible for passing the fetched array through unchanged, which the mount test already exercises regardless of array length.
- Real network behavior — `tasksClient.ts` is mocked at the module boundary per `AD-FRONTEND-003`'s "one API seam" rule; real fetch behavior belongs to that module's own tests, not `App.tsx`'s.

**Verification performed:** re-reviewed all 4 tests against the task's own Test Expectations and Edge Cases line by line — full coverage confirmed, no gaps found, no test files modified. `npx vitest run` — 4/4 pass (unchanged from Implementation stage verification).

**Traceability:** no new Code→Tests rows needed (existing rows already cover this task's full test scope); Workflow Metrics row appended for this `unit-test` command run.

**Status:** `approved` — human approved 2026-08-13 16:04, no revisions requested. Testing review outcome: `approved`. Frontend-tagged task, so no Integration Testing stage — this task's own testing/validation slot in the batch is now closed pending `/speccraft.validate` once all 5 tasks are unit-tested.

### Validation

**1. Task Identification**
- Task ID: TASK-TASK-TRACKER-001-FRONTEND-T1
- Title: Tasks feature module — API client, types, composition root
- Layer: frontend
- LLD Section Reference: `LLD-FRONTEND-TASK-TRACKER-001.md` §5, §8, §9
- Business Spec Reference: `spec/business/tasks/TASK-TRACKER-001.md` — REQ-TASK-TRACKER-001-01..04, AC-TASK-TRACKER-001-01..05

**2. Inputs Checked**
- Architecture docs: `spec/architecture/ARCH-DECISIONS.md` (AD-FRONTEND-001, 003, 005, 007, AD-X-001), `spec/architecture/FRONTEND-STRUCTURE.md`
- Implementation review record: `### Status` — approved, human 2026-08-13 15:08
- Unit-testing review record: `### Testing` — approved, human 2026-08-13 16:04
- Integration-testing review record: n/a — frontend-tagged task, no Integration Testing stage per `AGENTS.md` §Dual-layer branch

**3. AC Coverage Table**

| AC-ID | Criterion | Unit Test Ref | Integration Test Ref | Status |
|---|---|---|---|---|
| AC-01 | Non-empty title creates a task (this task's contribution: the API call + state update after submission — the form UI itself is `-FRONTEND-T2`) | `App.test.tsx` — "places a newly created task at the top of local state without a re-fetch" | n/a (frontend task) | pass |
| AC-02 | Created task carries `id` + `createdAt` (passed through unchanged from the API response) | same test — asserts the mocked created task (with `id`/`createdAt`) renders | n/a (frontend task) | pass |
| AC-03 | Every task shown, newest-first (this task's fetch-on-mount contribution; rendering itself is `-FRONTEND-T3`) | `App.test.tsx` — "fetches the task list on mount and renders it" | n/a (frontend task) | pass |
| AC-04 | List reflects new task without reload | `App.test.tsx` — "places a newly created task at the top of local state without a re-fetch call" (asserts `listTasks` called exactly once, i.e. no re-fetch) | n/a (frontend task) | pass |
| AC-05 | Empty/whitespace title rejected (client-side check owned by `-FRONTEND-T2`; not this task's scope) | n/a — owned by `-FRONTEND-T2` | n/a (frontend task) | n/a (owned by `-FRONTEND-T2`) |

**4. Architecture Conformance:** `compliant`
- AD-FRONTEND-001 (Vite+React18+TS strict) — compliant
- AD-FRONTEND-003 (hooks only, `tasksClient.ts` one seam) — `App.tsx` uses `useState`/`useEffect` only; no state library — compliant
- AD-FRONTEND-005 (no auth) — compliant
- AD-FRONTEND-007 (Vitest+RTL) — compliant
- `FRONTEND-STRUCTURE.md` module boundaries — `App.tsx` → `components/`, `api/`, `types/`; `tasksClient.ts` is the sole `fetch` call site — compliant
- Contract Conformance (frontend, cross-layer dependency resolved since task authoring) — `contracts/tasks/tasks.yaml` (written by `-BACKEND-T1`) landed before this task's implementation; verified `tasksClient.ts` was implemented directly against the real contract file (matching field names, `201`/`400 {error}`/`200`), not left against the interim LLD mock shape — compliant, reconciliation confirmed

**5. Traceability Chain** (frontend, 4 links)

| Link | Status | Evidence |
|---|---|---|
| business req/AC → LLD | present | traceability shard — Business Spec to LLD, frontend rows |
| LLD → task | present | traceability shard — LLD to Tasks |
| task → code | present | traceability shard — Tasks to Code (`tasksClient.ts`, `App.tsx`) |
| code → unit test | present | traceability shard — Code to Tests (`App.test.tsx`, 4 tests) |

**6. Issues Found:** none

**7. Validation Outcome:** `approved` — all in-scope ACs pass or are explicitly attributed to a sibling task, architecture compliant including contract reconciliation, full 4-link traceability chain present.

**8. Required Actions:** none.

**Status (validation):** `done` — validated 2026-08-13, all checks passed. Task closed.

## Task: TASK-TASK-TRACKER-001-FRONTEND-T2

### Status
`approved` — human approved 2026-08-13 15:18. Implementation review outcome: `approved`, no revisions requested.

### Implementation

**Changed files:**
- `src-code-frontend/src/components/TaskForm.tsx` — controlled `title` input; trims and blocks submission client-side on empty/whitespace (sets `formError` to `"Title is required"`, no call to `onCreate`); `isSubmitting` disables the submit button and guards against a second submit while a request is in flight (both via the disabled attribute and an internal early-return guard, covering the Enter-key double-submit path too); on valid submit calls `onCreate(trimmedTitle)`; on success clears the input; on failure shows the thrown error's message inline via `role="alert"`, keeps the typed text, and re-enables the control
- `src-code-frontend/src/index.css` — added `.task-form`, `.task-form__input`, `.task-form__submit`, `.task-form__error` classes
- `src-code-frontend/src/components/TaskForm.test.tsx` (new) — 5 tests

**Interface change (in scope — `TaskForm.tsx` is this task's own file):** widened the `onCreate` prop from the scaffold stub's `(title: string) => void` to `(title: string) => Promise<void>`, resolving the forward-compatibility note logged under `-FRONTEND-T1`. `App.tsx`'s `handleCreate` was already an `async` function returning `Promise<void>`, so no change was needed there — this task's own file is where the tightened type lives.

**Not changed:** `App.tsx`, `tasksClient.ts`, `types/task.ts` — untouched; `TaskList.tsx` — untouched, still out of scope (`-FRONTEND-T3`).

**Architecture mapping:** `AD-FRONTEND-004` (plain controlled input, hand-written validation, no form library), `AD-FRONTEND-002`/`006` (plain CSS only), `AD-FRONTEND-007` (Vitest+RTL), `FRONTEND-STRUCTURE.md` §Module Boundaries (`TaskForm` never imports `tasksClient.ts`; only calls the `onCreate` prop).

**Assumptions:**
- On a failed create, the inline message shown is `err.message` when the rejection is an `Error` (matching the backend's `{ error: string }` contract text passed through by `App.tsx`/`tasksClient.ts`), falling back to a generic `"Failed to create task"` otherwise.
- Kept `isSubmitting`/`formError`/`title` fully local to `TaskForm`, per the LLD's state-ownership table and this task's own Implementation Notes — none of it was lifted into `App.tsx`.

**Verification performed:** `npx tsc -b --noEmit` clean (0 errors) across the whole frontend, including the widened prop type. `npx vitest run` — 9/9 tests pass (4 existing from `-FRONTEND-T1` + 5 new).

**Blockers / follow-up gaps:** none.

**Traceability:** Task → Code and Code → Tests rows added for `-FRONTEND-T2`. Coverage Matrix: REQ-01 and REQ-02 flipped from `partial (T1 only)` to `mapped`/`complete (pending validation)` now that the form is done alongside the data layer; REQ-03 and REQ-04 remain `partial` — both still need `-FRONTEND-T3`'s list rendering for user-visible completion.

### Testing

**Scope note:** per `TESTING-STAGE.md` (`## Overview`), this task's own In-Scope Work already required `TaskForm` component tests, written during Implementation above (5 tests). This formal `/speccraft.unit-test` batched pass reviewed that suite against this task's `Test Expectations` / `Edge Cases To Preserve`.

**Test files (unchanged from Implementation):**
- `src-code-frontend/src/components/TaskForm.test.tsx` — 5 tests

**Coverage mapped to Test Expectations / Edge Cases:**
| Test Expectation / Edge Case | Test(s) |
|---|---|
| Blocks submit + message, empty title | `blocks submit and shows a message for an empty title` |
| Blocks submit + message, whitespace-only title | `blocks submit and shows a message for a whitespace-only title` |
| Calls `onCreate` with trimmed title, clears input on success | `calls onCreate with the trimmed title on valid submit and clears the input` |
| Disables submit while `isSubmitting`; second click no-op, exactly one call | `disables the submit control while isSubmitting and prevents a double-submit` |
| Server rejection → shows server error, re-enables control, preserves typed text | `shows the server error message on a failed create, re-enables the control, and preserves the typed text` |

**Excluded from unit tests (named explicitly):** real network/server behavior — `TaskForm` never calls `tasksClient.ts` directly; `onCreate` is a mocked prop per `FRONTEND-STRUCTURE.md` §Module Boundaries, so the actual create request is `-FRONTEND-T1`/backend-owned, not this component's.

**Verification performed:** re-reviewed all 5 tests against the task's Test Expectations and Edge Cases line by line — full coverage confirmed, no gaps found, no test files modified. `npx vitest run` — 5/5 pass (unchanged from Implementation stage verification).

**Traceability:** no new Code→Tests rows needed (existing rows already cover this task's full test scope); Workflow Metrics row appended for this `unit-test` command run.

**Status:** `approved` — human approved 2026-08-13 16:07, no revisions requested. Testing review outcome: `approved`. Frontend-tagged task; no Integration Testing stage.

**Handoff:** approved by human 2026-08-13 15:18. Per the agreed plan, formal `/speccraft.unit-test` is deferred until all 5 tasks' implementations are done. `-FRONTEND-T3` (list view) is the only remaining unimplemented task.

### Validation

**1. Task Identification**
- Task ID: TASK-TASK-TRACKER-001-FRONTEND-T2
- Title: Task creation form
- Layer: frontend
- LLD Section Reference: `LLD-FRONTEND-TASK-TRACKER-001.md` §5, §6, §10, §11
- Business Spec Reference: `spec/business/tasks/TASK-TRACKER-001.md` — REQ-TASK-TRACKER-001-01, AC-TASK-TRACKER-001-01, AC-TASK-TRACKER-001-05

**2. Inputs Checked**
- Architecture docs: `spec/architecture/ARCH-DECISIONS.md` (AD-FRONTEND-002, 004, 006, 007), `spec/architecture/FRONTEND-STRUCTURE.md`
- Implementation review record: `### Status` — approved, human 2026-08-13 15:18
- Unit-testing review record: `### Testing` — approved, human 2026-08-13 16:07
- Integration-testing review record: n/a — frontend-tagged task

**3. AC Coverage Table**

| AC-ID | Criterion | Unit Test Ref | Integration Test Ref | Status |
|---|---|---|---|---|
| AC-01 | Non-empty title creates a task | `TaskForm.test.tsx` — "calls onCreate with the trimmed title on valid submit and clears the input" | n/a (frontend task) | pass |
| AC-05 | Empty/whitespace-only title rejected client-side, inline message shown, no create call | `TaskForm.test.tsx` — "blocks submit and shows a message for an empty title", "...for a whitespace-only title" | n/a (frontend task) | pass |

**4. Architecture Conformance:** `compliant`
- AD-FRONTEND-004 (plain controlled input, no form library) — compliant
- AD-FRONTEND-002 / AD-FRONTEND-006 (plain elements, `index.css` only) — compliant
- AD-FRONTEND-007 (Vitest+RTL) — compliant
- `FRONTEND-STRUCTURE.md` module boundaries — `TaskForm.tsx` never imports `tasksClient.ts`; only calls the `onCreate` prop — compliant

**5. Traceability Chain** (frontend, 4 links)

| Link | Status | Evidence |
|---|---|---|
| business req/AC → LLD | present | traceability shard |
| LLD → task | present | traceability shard |
| task → code | present | traceability shard — `TaskForm.tsx` |
| code → unit test | present | traceability shard — `TaskForm.test.tsx`, 5 tests |

**6. Issues Found:** none

**7. Validation Outcome:** `approved` — both in-scope ACs pass, architecture compliant, full 4-link traceability chain present. (Edge cases beyond this task's two ACs — double-submit guard, server-rejection preserve-and-re-enable — are also test-covered per `TaskForm.test.tsx`, strengthening but not required for AC pass.)

**8. Required Actions:** none.

**Status (validation):** `done` — validated 2026-08-13, all checks passed. Task closed.

## Task: TASK-TASK-TRACKER-001-FRONTEND-T3

### Status
`approved` — human approved 2026-08-13 15:21. Implementation review outcome: `approved`, no revisions requested.

### Implementation

**Changed files:**
- `src-code-frontend/src/components/TaskList.tsx` — renders the `tasks` array exactly as received (no sort/comparator added); renders an explicit empty-state message ("No tasks yet — create your first one above") when the array is empty
- `src-code-frontend/src/index.css` — added `.task-list`, `.task-list__item`, `.task-list__empty` classes
- `src-code-frontend/src/components/TaskList.test.tsx` (new) — 2 tests

**Not changed:** `App.tsx`, `TaskForm.tsx`, `tasksClient.ts`, `types/task.ts` — untouched.

**Architecture mapping:** `AD-FRONTEND-002`/`006` (plain elements, `index.css` only), `AD-FRONTEND-007` (Vitest+RTL), `FRONTEND-STRUCTURE.md` §Module Boundaries (`TaskList` never imports `tasksClient.ts`; renders only the `tasks` prop).

**Assumptions:** none beyond what the task specifies — ordering is entirely the backend's responsibility (already verified end-to-end: repository unshifts newest-first, `App.tsx` prepends on create, `TaskList` renders as-given).

**Verification performed:** `npx tsc -b --noEmit` clean (0 errors). `npx vitest run` — 11/11 tests pass (9 existing from `-FRONTEND-T1`/`-T2` + 2 new).

**Blockers / follow-up gaps:** none.

**Traceability:** Task → Code and Code → Tests rows added for `-FRONTEND-T3`. Coverage Matrix: REQ-03 and REQ-04 flipped from `partial` to `mapped`/`complete (pending validation)` now that list rendering is done — all 4 frontend REQs now have their full code+test chain in place.

**Handoff:** approved by human 2026-08-13 15:21. All 5 tasks now have approved implementations — ready to start the batched `/speccraft.unit-test` → `/speccraft.integration-test` (backend only) → `/speccraft.validate` pass per the agreed plan.

### Testing

**Scope note:** per `TESTING-STAGE.md` (`## Overview`), this task's own In-Scope Work already required `TaskList` component tests, written during Implementation above (2 tests). This formal `/speccraft.unit-test` batched pass — the last of the 5 tasks in the batch — reviewed that suite against this task's `Test Expectations` / `Edge Cases To Preserve`.

**Test files (unchanged from Implementation):**
- `src-code-frontend/src/components/TaskList.test.tsx` — 2 tests

**Coverage mapped to Test Expectations / Edge Cases:**
| Test Expectation / Edge Case | Test(s) |
|---|---|
| Renders empty state with zero tasks (not an error) | `renders an empty-state message when there are no tasks` |
| Renders all items in the order given, no re-sort | `renders all items in the order given, without re-sorting` |

**Excluded from unit tests (named explicitly):** loading-indicator markup while fetch is in flight — owned by `App.tsx` (`-FRONTEND-T1`), not this component's concern; real network behavior — `TaskList` never calls `tasksClient.ts` directly, `tasks` arrives as a prop.

**Verification performed:** re-reviewed both tests against the task's Test Expectations and Edge Cases line by line — full coverage confirmed, no gaps found, no test files modified. `npx vitest run` — 2/2 pass (unchanged from Implementation stage verification).

**Traceability:** no new Code→Tests rows needed (existing rows already cover this task's full test scope); Workflow Metrics row appended for this `unit-test` command run.

**Status:** `approved` — human approved 2026-08-13 16:09, no revisions requested. Testing review outcome: `approved`. Frontend-tagged task; no Integration Testing stage. This was the last of the 5 tasks in the agreed batch — all 5 tasks now have approved unit-test passes; the story is ready for `/speccraft.validate`.

**Handoff:** approved by human 2026-08-13 15:08. Per the agreed plan, formal `/speccraft.unit-test` for this task is deferred until all 5 tasks' implementations are done.

### Validation

**1. Task Identification**
- Task ID: TASK-TASK-TRACKER-001-FRONTEND-T3
- Title: Task list view
- Layer: frontend
- LLD Section Reference: `LLD-FRONTEND-TASK-TRACKER-001.md` §5, §6, §10, §11
- Business Spec Reference: `spec/business/tasks/TASK-TRACKER-001.md` — REQ-TASK-TRACKER-001-03, REQ-TASK-TRACKER-001-04, AC-TASK-TRACKER-001-03, AC-TASK-TRACKER-001-04

**2. Inputs Checked**
- Architecture docs: `spec/architecture/ARCH-DECISIONS.md` (AD-FRONTEND-002, 006, 007), `spec/architecture/FRONTEND-STRUCTURE.md`
- Implementation review record: `### Status` — approved, human 2026-08-13 15:21
- Unit-testing review record: `### Testing` — approved, human 2026-08-13 16:09
- Integration-testing review record: n/a — frontend-tagged task

**3. AC Coverage Table**

| AC-ID | Criterion | Unit Test Ref | Integration Test Ref | Status |
|---|---|---|---|---|
| AC-03 | Every task shown, newest-first (rendering) | `TaskList.test.tsx` — "renders all items in the order given, without re-sorting"; empty-state case — "renders an empty-state message when there are no tasks" | n/a (frontend task) | pass |
| AC-04 | List reflects new task without reload (rendering contribution — renders whatever array `App.tsx` passes, no re-sort) | same ordering test — proves no client re-sort masks the prepend done by `App.tsx`/`-FRONTEND-T1` | n/a (frontend task) | pass |

**4. Architecture Conformance:** `compliant`
- AD-FRONTEND-002 / AD-FRONTEND-006 (plain elements, `index.css` only) — compliant
- AD-FRONTEND-007 (Vitest+RTL) — compliant
- `FRONTEND-STRUCTURE.md` module boundaries — `TaskList.tsx` never imports `tasksClient.ts`; renders only the `tasks` prop — compliant

**5. Traceability Chain** (frontend, 4 links)

| Link | Status | Evidence |
|---|---|---|
| business req/AC → LLD | present | traceability shard |
| LLD → task | present | traceability shard |
| task → code | present | traceability shard — `TaskList.tsx` |
| code → unit test | present | traceability shard — `TaskList.test.tsx`, 2 tests |

**6. Issues Found:** none

**7. Validation Outcome:** `approved` — both in-scope ACs pass, architecture compliant, full 4-link traceability chain present. This was the last of the 5 tasks in the story — all 5 now validated.

**8. Required Actions:** none. Story-level: all 5 tasks' Validation records complete; proceed to Progress Update (traceability Coverage Matrix + Workflow Metrics).

**Status (validation):** `done` — validated 2026-08-13, all checks passed. Task closed. All 5 tasks in TASK-TRACKER-001 are now `done`.
