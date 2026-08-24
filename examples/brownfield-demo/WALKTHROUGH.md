# Walkthrough — Brownfield Demo

This is a real run of the `speccraft` brownfield workflow, not a hand-crafted mockup. The synthetic "legacy" `tasks` app (create a task, list tasks) already existed as real, running code — committed with no `spec/` at all — before any `/speccraft.*` command ever touched it. Every command below was actually invoked against this folder, every gate was actually reviewed by a human, and every file linked below is the real output. See `examples/LIVE-EXAMPLES-PLAN.md` Phase 2 for the plan this demo was built under, and `examples/greenfield-demo/WALKTHROUGH.md` for the from-scratch counterpart this demo is meant to be compared against.

Story delivered in this run: **TASK-TRACKER-002** — mark a task complete (`Layer Scope: both`).

---

## 0. Starting Point — Pre-Existing Code, No Spec

Before any workflow command ran, `src-code-frontend/` and `src-code-backend/` already existed as committed, working code: React 19 + Vite frontend (`TaskForm`, `TaskList`, `tasksClient.ts`), Express 5 backend (`routes` → `controllers` → `services` → `repositories`, in-memory store). No `spec/architecture/ARCH-DECISIONS.md`, no `spec/business/`, no `rules/`/`skills/` content — this is exactly the brownfield starting condition `/speccraft.onboard` exists for.

---

## 1. Onboarding — `/speccraft.onboard`

**2026-08-14.** Asked Layer Scope interactively (per the command's contract — never inferred from which code roots happen to exist): answered `both`. Scanned both code roots and proposed:

- **Tier 1** (LLD-required stack decisions, into `spec/architecture/ARCH-DECISIONS.md`): [`AD-FRONTEND-001..008`](spec/architecture/ARCH-DECISIONS.md) (React 19 + Vite, no UI/state library, no forms library, no auth, plain CSS, TypeScript, Vitest + RTL), `AD-BACKEND-001..007` (Express 5, no ORM, no auth, REST/JSON, no messaging, TypeScript, `node:test` + Supertest), `AD-X-001..003` (no formal API contract yet, single-origin CORS, no token format) — every row carrying file:line evidence, not a designed decision.
- **Tier 2** (everything else, into `rules/`/`skills/`): [`src-code-frontend/rules/conventions.md`](src-code-frontend/rules/conventions.md) + [`skills/component-creation.md`](src-code-frontend/skills/component-creation.md), [`src-code-backend/rules/conventions.md`](src-code-backend/rules/conventions.md) + [`skills/endpoint-creation.md`](src-code-backend/skills/endpoint-creation.md).

No ambiguous or conflicting evidence found for either tier. Reviewed as one combined gate — **`approved`**, both tiers written as proposed.

Records: [`spec/traceability/shared/ONBOARD-FRONTEND/TRACEABILITY.md`](spec/traceability/shared/ONBOARD-FRONTEND/TRACEABILITY.md) / [`ONBOARD-BACKEND/TRACEABILITY.md`](spec/traceability/shared/ONBOARD-BACKEND/TRACEABILITY.md), [`spec/progress/shared/ONBOARD-FRONTEND/STATUS.md`](spec/progress/shared/ONBOARD-FRONTEND/STATUS.md) / [`ONBOARD-BACKEND/STATUS.md`](spec/progress/shared/ONBOARD-BACKEND/STATUS.md).

Per the command's own Exit Behavior, this is where it stopped — **no chaining into `/speccraft.scaffold` or any planning stage**.

---

## 2. Supporting Architecture Docs (Phase 2 step 5)

`/speccraft.onboard`'s contract is deliberately narrow — Tier 1 + Tier 2 only, no supporting architecture spec files. Hand-authored those separately, documenting what the scan found rather than a designed decision: [`spec/architecture/FRONTEND-STRUCTURE.md`](spec/architecture/FRONTEND-STRUCTURE.md) (no router — single screen; module boundary `api/` → `components/` → `types/`) and [`spec/architecture/BACKEND-STRUCTURE.md`](spec/architecture/BACKEND-STRUCTURE.md) (layering `routes → controllers → services → repositories`; in-memory only, no external systems found). Both indexed in [`spec/ARCHITECTURE-REFERENCES.md`](spec/ARCHITECTURE-REFERENCES.md); `spec/SPEC-VERSION.md` bumped to `0.1.1`.

`/speccraft.tech-debt frontend`/`backend` (Phase 2 step 4) was **skipped by explicit user decision** — optional and non-blocking per its own contract, so nothing downstream depended on it.

---

## 3. Extension Story — `TASK-TRACKER-002`: Mark A Task Complete

The onboarded app only had create/list (`TASK-TRACKER-001`-shape behavior, delivered before this workflow existed for this project). This is the **first delivery story since onboarding** — the real test of "does implementation follow the discovered conventions."

### 3.1 Business Input

- [`spec/business/tasks/BRD.md`](spec/business/tasks/BRD.md) — an **extension BRD**: explicitly frames create/list as already-delivered, pre-existing behavior (not to be re-decomposed), and adds one new goal (G3: mark complete).
- [`spec/business/tasks/TASK-TRACKER-002.md`](spec/business/tasks/TASK-TRACKER-002.md) — the story: 4 requirements, 5 acceptance criteria, edge cases (unknown task id, double-toggle, empty list).

### 3.2 `/speccraft.orchestrate`, Stepped Through By Hand

Real timestamps below, all **2026-08-14 unless noted**; the run paused for two calendar days (14th → 17th) between the second backend Implementation Review Gate and its approval — visible directly in the traceability shard's `Start`/`End` columns as an honest record, not smoothed over.

**Stage 1–2 (Intake + LLD Creation), 18:00–18:03** — one shared intake pass, then both companion LLDs designed together: [`LLD-FRONTEND-TASK-TRACKER-002.md`](spec/lld/tasks/LLD-FRONTEND-TASK-TRACKER-002.md) / [`LLD-BACKEND-TASK-TRACKER-002.md`](spec/lld/tasks/LLD-BACKEND-TASK-TRACKER-002.md). Unlike a from-scratch LLD, §9 Reuse-Before-Build in both targets the **pre-existing, onboarded code** — extend `TaskList`/`tasksClient`/`tasks.controller`, don't build parallel structures. Key design call: the backend operation is `PATCH /api/tasks/:id` with an explicit **target-state** body (`{ completed: boolean }`), not a bare toggle endpoint — chosen specifically because a target-state `PATCH` is idempotent, so a double-click (the business spec's own edge case) can't silently flip a task twice.

**Stage 3 — LLD Review Gate (hard stop)**, approved 18:17.

**Stage 4 — Decomposition, 18:17–18:19** — 4 tasks (smaller than `TASK-TRACKER-001`'s 5, since this is a single-field/single-endpoint extension): [`BACKEND-T1`](spec/tasks/tasks/TASK-TASK-TRACKER-002-BACKEND-T1.md) (repository/service/contract), [`BACKEND-T2`](spec/tasks/tasks/TASK-TASK-TRACKER-002-BACKEND-T2.md) (controller/route), [`FRONTEND-T1`](spec/tasks/tasks/TASK-TASK-TRACKER-002-FRONTEND-T1.md) (API client + `App.tsx`), [`FRONTEND-T2`](spec/tasks/tasks/TASK-TASK-TRACKER-002-FRONTEND-T2.md) (`TaskList` toggle UI).

**Stage 5 — Decomposition Review Gate (hard stop)**, approved 18:22.

**Stage 5.5 — Scaffold Check, 18:22–18:23.** This is the check the brownfield path exists to prove: `/speccraft.scaffold frontend` and `/speccraft.scaffold backend` were both invoked and both **correctly refused** — Pre-Execution Check 1 in `spec/commands/speccraft.scaffold.md` ("confirm the target code root does not already exist") stopped each one immediately, since both roots already held real, onboarded code. No scaffold action taken, no files touched. Recorded in [`spec/traceability/shared/scaffold-frontend/TRACEABILITY.md`](spec/traceability/shared/scaffold-frontend/TRACEABILITY.md) / [`scaffold-backend/TRACEABILITY.md`](spec/traceability/shared/scaffold-backend/TRACEABILITY.md).

**Stage 6–9 (+ 10–11 for backend), per task:**

| Task | Implement | Test | Integration Test |
|---|---|---|---|
| `BACKEND-T1` | 18:22–18:27, approved 18:31 | approved 18:31 | approved 18:37 (no boundary owed — domain layer only, deferred to `-T2`) |
| `BACKEND-T2` | 18:37–18:40, approved *2026-08-17* 09:42 | approved 09:44 | approved 09:49 (owns the real HTTP boundary — extended `tasks.integration.test.ts` with 7 new tests) |
| `FRONTEND-T1` | 09:49–09:54, approved 09:55 | approved 09:57 | n/a — frontend task |
| `FRONTEND-T2` | 09:57–09:59, approved 10:08 | approved 10:09 | n/a — frontend task |

Two real things worth calling out, not smoothed over in the record:

- **A genuine multi-day gap.** `-BACKEND-T2`'s implementation finished 2026-08-14 18:40 but wasn't approved until 2026-08-17 09:42 — a real session boundary, visible as-is in the traceability shard rather than backfilled to look continuous.
- **A real bug caught by the verification workaround itself.** This project has the same `ts-node`/`typescript` version mismatch `greenfield-demo` had before its fix — unlike that demo, it was **left unfixed here** (out of scope for every task in this story; `package.json`/`tsconfig.json` weren't in anyone's Impacted Areas). The scratch-compile workaround used to verify tests initially failed on the integration-test file specifically, because compiling to a system-temp directory broke `supertest`'s `node_modules` resolution — fixed by compiling into a directory inside `src-code-backend/` instead (deleted after, nothing committed). See §5 below.

**Stage 12 — Final Validation, 2026-08-17 10:16–10:18**, all 4 tasks in one pass. Re-verified code directly against both LLDs, `contracts/tasks/tasks.yaml`, and the discovered architecture docs — plus a **live end-to-end HTTP check** against the actual compiled, running backend (`GET`/`POST`/`PATCH /api/tasks`, including the 404/400 error paths), not just the automated test suites. **Outcome: `approved` for all 4 tasks** — every in-scope AC passes, architecture compliant (including Contract Conformance both directions), full traceability chain present (4-link × 2 frontend, 5-link × 2 backend). All 4 tasks `done`.

Full Workflow Metrics and Coverage Matrix: [`spec/traceability/tasks/TASK-TRACKER-002/TRACEABILITY.md`](spec/traceability/tasks/TASK-TRACKER-002/TRACEABILITY.md). Full per-task narrative: [`spec/progress/tasks/progress-TASK-TRACKER-002.md`](spec/progress/tasks/progress-TASK-TRACKER-002.md).

---

## 4. What Got Built

- **Backend:** `PATCH /api/tasks/:id` with `{ completed: boolean }` — idempotent by design (see the design call in §3.2). New repository method (`setCompleted`), service function (`setTaskCompleted`, validates the boolean + existence), controller handler (maps not-found → `404`, bad type → `400`), route wiring. `contracts/tasks/tasks.yaml` written for the first time for this project, covering all three `tasks` operations.
- **Frontend:** `Task` type gained `completed`; `tasksClient.ts` gained `updateTaskCompletion`; `App.tsx` gained a handler that updates one task in place (no re-fetch, no re-sort); `TaskList` gained a per-row checkbox, per-row in-flight/error state, and a strikethrough treatment for completed tasks.
- Both sides extend the **existing** files discovered by onboarding — no parallel structures, no new components beyond the one new backend route file wiring.

---

## 5. Known Gap — Backend Tooling (Deliberately Left Unfixed Here)

`src-code-backend`'s installed `ts-node@10.9.2` is incompatible with installed `typescript@7.0.2` — the same category of gap `examples/greenfield-demo` hit and fixed (see that project's `WALKTHROUGH.md` §6). **This demo leaves it unfixed on purpose**: fixing `package.json`/`tsconfig.json` was outside every task's own Impacted Areas in this story, and no task's LLD or task file called for it. Consequences if you clone this and run it yourself:

- `npm run dev` and `npm test` (as configured) will fail with the ts-node/typescript error.
- `npm run build` will additionally fail with a separate `tsconfig.json` `rootDir`/`include` issue (test files picked up by `tsc`'s default include pattern).
- To actually exercise the backend: compile with a scratch `tsc --ignoreConfig` invocation to a directory *inside* `src-code-backend/` (not a system-temp directory — `supertest` needs to resolve `node_modules` from somewhere with a real path back to this project) and run the compiled output with plain `node --test`, or `node dist/index.js` for the server. This is exactly the workaround used throughout this story's own verification — see the traceability shard's Workflow Metrics notes for `-BACKEND-T1`/`-BACKEND-T2`.
- The frontend (`npm test`/`npm run build`) has no such gap and runs as-is.

**Sanity-checked 2026-08-17** (`examples/LIVE-EXAMPLES-PLAN.md` Phase 2 step 8): ran `npm install`/`npm run build`/`npm test`/`npm run dev` for real in both roots. Frontend: all 4 passed (19/19 tests, dev server serves `200`). Backend: `npm run build`/`npm test`/`npm run dev` all failed exactly as described above — confirmed, not just documented. The underlying app itself is fully functional despite this: the scratch-compile workaround (41/41 tests) and a live compiled server both work, proving this is a tooling-configuration gap, not a broken app.

---

## Where To Look Next

| You want... | Look at... |
|---|---|
| What onboarding discovered | [`spec/architecture/ARCH-DECISIONS.md`](spec/architecture/ARCH-DECISIONS.md), [`FRONTEND-STRUCTURE.md`](spec/architecture/FRONTEND-STRUCTURE.md), [`BACKEND-STRUCTURE.md`](spec/architecture/BACKEND-STRUCTURE.md) |
| Discovered implementation conventions | `src-code-frontend/rules/`+`skills/`, `src-code-backend/rules/`+`skills/` |
| The extension business ask | [`spec/business/tasks/BRD.md`](spec/business/tasks/BRD.md), [`spec/business/tasks/TASK-TRACKER-002.md`](spec/business/tasks/TASK-TRACKER-002.md) |
| Design decisions per layer | [`spec/lld/tasks/LLD-FRONTEND-TASK-TRACKER-002.md`](spec/lld/tasks/LLD-FRONTEND-TASK-TRACKER-002.md), [`spec/lld/tasks/LLD-BACKEND-TASK-TRACKER-002.md`](spec/lld/tasks/LLD-BACKEND-TASK-TRACKER-002.md) |
| What got implemented and why | [`spec/progress/tasks/progress-TASK-TRACKER-002.md`](spec/progress/tasks/progress-TASK-TRACKER-002.md) |
| Every command's real timing/outcome | [`spec/traceability/tasks/TASK-TRACKER-002/TRACEABILITY.md`](spec/traceability/tasks/TASK-TRACKER-002/TRACEABILITY.md) |
| Proof the scaffold refuses on brownfield code | [`spec/traceability/shared/scaffold-frontend/TRACEABILITY.md`](spec/traceability/shared/scaffold-frontend/TRACEABILITY.md) / [`scaffold-backend/TRACEABILITY.md`](spec/traceability/shared/scaffold-backend/TRACEABILITY.md) |
| The actual running code | `src-code-frontend/src/`, `src-code-backend/src/` |
