# Walkthrough — Greenfield Demo

This is a real run of the `speccraft` greenfield workflow, not a hand-crafted mockup. Every command
below was actually invoked against this folder, every gate was actually reviewed by a human, and
every file linked below is the real output. See `examples/LIVE-EXAMPLES-PLAN.md` for the plan this
demo was built under.

Story: **TASK-TRACKER-001** — create a task, list tasks, both layers (`Layer Scope: both`).

---

## 0. Setup

1. **Scratch-scaffold the boilerplate** — `node bin/speccraft.js examples/greenfield-demo --agents claude --yes`, run from the repo root. This is the real installer (`bin/speccraft.js` / `src/index.js`), not a hand-copy — it produced this folder's `spec/`, `.claude/`, `AGENTS.md`, `CLAUDE.md`, `README.md` shell.
2. **`templates/core/README.md` §"Before You Start" steps 1–5**, worked manually for both layers:
   - Step 1: read `.gitignore`'s prune guidance (nothing actionable yet at this point).
   - Step 2 (Layer Scope): answered `both` interactively.
   - Step 3 (lock the stack): populated [`spec/architecture/ARCH-DECISIONS.md`](spec/architecture/ARCH-DECISIONS.md) — `AD-FRONTEND-001..007` (Vite + React 18 + TypeScript strict, no UI/state library, Vitest + RTL), `AD-BACKEND-001..006` (Express + TypeScript strict, in-memory repository, `node --test` + `supertest`), `AD-X-001..003` (OpenAPI 3.1 contract convention, CORS, no-auth token format).
   - Step 4: added the two supporting architecture spec files — [`spec/architecture/FRONTEND-STRUCTURE.md`](spec/architecture/FRONTEND-STRUCTURE.md) (routing + module boundaries) and [`spec/architecture/BACKEND-STRUCTURE.md`](spec/architecture/BACKEND-STRUCTURE.md) (layering + data/integration strategy), indexed in `spec/ARCHITECTURE-REFERENCES.md`.
   - Step 5: filled in `spec/commands/speccraft.scaffold.md`'s per-layer placeholder sections to match the locked stack.
   - Recorded as `spec/SPEC-VERSION.md` v0.1.1, 2026-08-12.
3. **Authored the business input** — [`spec/business/tasks/BRD.md`](spec/business/tasks/BRD.md) (project-level BRD: goals G1/G2, explicit non-goals) and the story itself, [`spec/business/tasks/TASK-TRACKER-001.md`](spec/business/tasks/TASK-TRACKER-001.md) (4 requirements, 5 acceptance criteria, 3 edge cases).

Everything from here on is a real slash-command invocation, human-in-the-loop at every gate, all on **2026-08-13**.

---

## 1. LLD Creation — `/speccraft.tech-design spec/business/tasks/TASK-TRACKER-001.md`

- **10:57–11:04** — one shared intake pass against the BRD + story, then designed both companion LLDs together: [`spec/lld/tasks/LLD-FRONTEND-TASK-TRACKER-001.md`](spec/lld/tasks/LLD-FRONTEND-TASK-TRACKER-001.md) and [`spec/lld/tasks/LLD-BACKEND-TASK-TRACKER-001.md`](spec/lld/tasks/LLD-BACKEND-TASK-TRACKER-001.md). Cross-checked the two LLDs' API touchpoint tables against each other (§14 of each) — no conflict found.
- **⛔ LLD Review Gate** — human reviewed both LLDs as one combined gate. **11:16 — `approved`**, no revisions requested.

Traceability: `spec/traceability/tasks/TASK-TRACKER-001/TRACEABILITY.md` §Business Spec to LLD.

---

## 2. Decomposition — `/speccraft.decompose`

- **11:27–11:31** — derived 5 Layer-tagged tasks from the two approved LLDs: [`TASK-TASK-TRACKER-001-BACKEND-T1`](spec/tasks/tasks/TASK-TASK-TRACKER-001-BACKEND-T1.md) (domain layer: repository + service + contract), [`TASK-TASK-TRACKER-001-BACKEND-T2`](spec/tasks/tasks/TASK-TASK-TRACKER-001-BACKEND-T2.md) (HTTP layer: controller + routes + bootstrap), [`TASK-TASK-TRACKER-001-FRONTEND-T1`](spec/tasks/tasks/TASK-TASK-TRACKER-001-FRONTEND-T1.md) (API client + composition root), [`TASK-TASK-TRACKER-001-FRONTEND-T2`](spec/tasks/tasks/TASK-TASK-TRACKER-001-FRONTEND-T2.md) (create form), [`TASK-TASK-TRACKER-001-FRONTEND-T3`](spec/tasks/tasks/TASK-TASK-TRACKER-001-FRONTEND-T3.md) (list view).
  - Real hiccup, kept for honesty: the first invocation only supplied the backend LLD — an argument-count mismatch against this project's `Layer Scope: both`. Caught and corrected to both LLDs before any task output was produced.
- **⛔ Decomposition Review Gate** — human reviewed task size, ordering, and Layer tagging as one gate. **11:33 — `approved`**, no revisions requested.

Traceability: same shard, §LLD to Tasks.

---

## 3. Scaffold Check — `/speccraft.scaffold frontend` + `/speccraft.scaffold backend`

Run once per layer, per the boilerplate's one-time-per-root convention.

- **Frontend** — **11:52–11:58**. Created `src-code-frontend/` via the real Vite React-TS template, stub-only files per Hard Boundary Rules (components return `null`, API client throws "Not implemented"), empty `rules/`/`skills/` (+ `shared/`) with `.gitkeep`. Build check and test-runner check both passed. Status: [`spec/progress/shared/scaffold-frontend/STATUS.md`](spec/progress/shared/scaffold-frontend/STATUS.md).
- **Backend** — **11:59–12:05**. Created `src-code-backend/`, same stub convention (`501` controller stubs, repository/service throw "Not implemented"), Express bootstrap wired (CORS locked to `http://localhost:5173` per `AD-X-002`). Build check and test-runner check both passed. Status: [`spec/progress/shared/scaffold-backend/STATUS.md`](spec/progress/shared/scaffold-backend/STATUS.md).

Both approved by the human before implementation began. Traceability: [`spec/traceability/shared/scaffold-frontend/TRACEABILITY.md`](spec/traceability/shared/scaffold-frontend/TRACEABILITY.md), [`spec/traceability/shared/scaffold-backend/TRACEABILITY.md`](spec/traceability/shared/scaffold-backend/TRACEABILITY.md).

---

## 4. Implementation, Testing, Integration Testing — per task

The 5 tasks were implemented across two batches: implement-everything-first, then a **batched** unit-test → integration-test → validate pass across all 5 at once (an explicitly agreed deviation from strict per-task sequencing, visible in the traceability Notes column). Backend tasks ran the dual-layer branch (stages 11–12); frontend tasks skipped straight to validation, per `spec/AGENTS.md` §Dual-layer branch.

### `/speccraft.implement`

| Task | Time | Outcome | Files |
|---|---|---|---|
| BACKEND-T1 | 14:00–14:10, approved 14:17 | `approved` | `src-code-backend/src/repositories/tasks.repository.ts`, `src-code-backend/src/services/tasks.service.ts`, `contracts/tasks/tasks.yaml` (new) |
| BACKEND-T2 | 14:35–14:39, approved 15:11 | `approved` | `src-code-backend/src/controllers/tasks.controller.ts` |
| FRONTEND-T1 | 14:51–14:56, approved 15:08 | `approved` | `src-code-frontend/src/api/tasksClient.ts`, `src-code-frontend/src/App.tsx` |
| FRONTEND-T2 | 15:13–15:15, approved 15:18 | `approved` | `src-code-frontend/src/components/TaskForm.tsx` |
| FRONTEND-T3 | 15:19–15:20, approved 15:21 | `approved` | `src-code-frontend/src/components/TaskList.tsx` |

Real forward-compat thread worth noting: `TASK-TASK-TRACKER-001-FRONTEND-T1` left a note that `TaskForm`'s stub `onCreate` prop (`(title: string) => void`) would need widening once `-FRONTEND-T2` added its own `formError` handling — `-FRONTEND-T2` picked that up and widened it to `(title: string) => Promise<void>` (see `spec/progress/tasks/progress-TASK-TRACKER-001.md` under `-FRONTEND-T2` § Implementation, "Interface change").

### `/speccraft.unit-test` (batched pass across all 5)

| Task | Time | Outcome | Notes |
|---|---|---|---|
| BACKEND-T1 | 15:54, approved 15:57 | `approved` | Re-reviewed existing 10-test suite (repository + service) — full coverage confirmed, nothing added |
| BACKEND-T2 | 15:59, approved 16:01 | `approved` | Reviewed 5-test controller suite, found and closed one gap (multi-item ordering) — 6 tests total |
| FRONTEND-T1 | 16:03, approved 16:04 | `approved` | Re-reviewed existing 4-test `App.test.tsx` suite — full coverage confirmed |
| FRONTEND-T2 | 16:05, approved 16:07 | `approved` | Re-reviewed existing 5-test `TaskForm.test.tsx` suite — full coverage confirmed |
| FRONTEND-T3 | 16:08, approved 16:09 | `approved` | Re-reviewed existing 2-test `TaskList.test.tsx` suite — full coverage confirmed |

### `/speccraft.integration-test` (backend-tagged tasks only)

| Task | Time | Outcome | Notes |
|---|---|---|---|
| BACKEND-T1 | 14:21–14:22, approved 15:11; re-confirmed 16:19–16:20, approved 16:22 | `approved` (no boundary owed) | This task's own scope (repository + service) introduces no HTTP entrypoint and no persistence/queue/external boundary — writing a test here would duplicate the approved unit tests, which the stage's own Must-not rule disallows. Deferred to `-BACKEND-T2`. Re-invoked once more against an explicit request naming `-BACKEND-T1` directly; the human chose to re-confirm the same closed finding rather than redirect. |
| BACKEND-T2 | 16:23–16:27, approved 16:29 | `approved` | Found a 4-test `tasks.integration.test.ts` already on disk with no traceability record — treated as an unreviewed draft, closed 3 gaps (empty-string title, missing-title field, malformed JSON body distinguishing test) — 7 tests total, run via `supertest` against the real exported Express `app`. |

Traceability: same shard, §Tasks to Code, §Code to Tests, §Unit Tests to Integration Tests.

---

## 5. Final Validation — `/speccraft.validate`

**18:47–18:59**, all 5 tasks validated in one pass. Re-verified code directly against both LLDs, `contracts/tasks/tasks.yaml`, `ARCH-DECISIONS.md`, `FRONTEND-STRUCTURE.md`, `BACKEND-STRUCTURE.md` — not just prior progress notes. All 8 Coverage Matrix rows (4 frontend REQs + 4 backend REQs) flipped to `complete (validated)`.

**Outcome: `approved`** for all 5 tasks — every in-scope AC passes, architecture compliant (including Contract Conformance both directions), full traceability chain present (4-link × 3 frontend tasks, 5-link × 2 backend tasks).

One issue was logged, non-blocking at the time: **VAL-001** — this project's `npm test` script couldn't execute `.ts` test files directly (installed `ts-node@10.9.2` was incompatible with installed `typescript@7.0.2`, a pre-existing scaffold/tooling version mismatch, not caused by any task). All 23 backend + 11 frontend tests were independently re-verified passing via a scratch `tsc`-compile-then-`node --test` workaround at every stage. See `spec/progress/tasks/progress-TASK-TRACKER-001.md` §Validation, `-BACKEND-T1`, "6. Issues Found" for the original record. **VAL-001 has since been resolved** — see §6 below.

Full Workflow Metrics (every command's real timing/token data) and the full Coverage Matrix: [`spec/traceability/tasks/TASK-TRACKER-001/TRACEABILITY.md`](spec/traceability/tasks/TASK-TRACKER-001/TRACEABILITY.md). Full per-task narrative (implementation notes, assumptions, verification performed, blockers): [`spec/progress/tasks/progress-TASK-TRACKER-001.md`](spec/progress/tasks/progress-TASK-TRACKER-001.md).

---

## 6. Sanity Check (2026-08-14) — VAL-001 Resolved, One New Gap Found And Fixed

Ran `npm install` / `npm run build` / `npm test` / `npm run dev` for real in both `src-code-frontend/` and `src-code-backend/` (Phase 1 step 7 of `examples/LIVE-EXAMPLES-PLAN.md`), rather than assuming the recorded validation results still held.

**Frontend:** all four checks passed as-is — `npm install`, `npm run build` (Vite), `npm test` (11/11 via `vitest run`), `npm run dev` (boots, serves `200` on `http://localhost:5173/`). No changes needed.

**Backend:** found it could not build, test, or run in dev mode out of the box:
- `npm run build` failed with `TS6059` — `tsconfig.json` had `rootDir: "src"` with no `include`/`exclude`, so `tsc`'s default `**/*` pattern picked up `test/**` and rejected it as outside `rootDir`. This was a distinct bug from VAL-001, not previously documented. **Fixed** by adding `"include": ["src/**/*"]` to `tsconfig.json`.
- `npm run dev` (`ts-node src/index.ts`) crashed immediately with VAL-001's exact error (`ts-node@10.9.2` incompatible with `typescript@7.0.2`) — this means VAL-001 was broader than its original write-up stated; it broke dev mode, not just `npm test`. **Fixed** by pinning `typescript` to `^5.9.3` in `package.json` (a `ts-node@10.9.2`-compatible release) and reinstalling.
- `npm test` (plain `node --test`) still failed after the typescript pin — a separate cause: Node's native `.ts` execution requires explicit file extensions on relative `require()`s, which this project's extensionless CommonJS-style imports don't use. **Fixed** by changing the `test` script to `node --require ts-node/register --test`, routing test execution through ts-node's require hook instead of Node's native type-stripping.

All four backend checks now pass for real: `npm run build` (clean), `npm test` (23/23 via `node --require ts-node/register --test`), `npm run dev` (boots, `GET /health` → `{"status":"ok"}`), and a live end-to-end check of `GET`/`POST /api/tasks` against the running dev server, confirmed working. `npm start` (build + `node dist/index.js`) also verified working as a bonus check.

No source files in `src/` or `test/` changed — only `src-code-backend/package.json` (`typescript` version pin, `test` script) and `src-code-backend/tsconfig.json` (`include`).

---

## Where To Look Next

| You want... | Look at... |
|---|---|
| The business ask | [`spec/business/tasks/BRD.md`](spec/business/tasks/BRD.md), [`spec/business/tasks/TASK-TRACKER-001.md`](spec/business/tasks/TASK-TRACKER-001.md) |
| The locked stack | [`spec/architecture/ARCH-DECISIONS.md`](spec/architecture/ARCH-DECISIONS.md) |
| Design decisions per layer | [`spec/lld/tasks/LLD-FRONTEND-TASK-TRACKER-001.md`](spec/lld/tasks/LLD-FRONTEND-TASK-TRACKER-001.md), [`spec/lld/tasks/LLD-BACKEND-TASK-TRACKER-001.md`](spec/lld/tasks/LLD-BACKEND-TASK-TRACKER-001.md) |
| What got implemented and why | [`spec/progress/tasks/progress-TASK-TRACKER-001.md`](spec/progress/tasks/progress-TASK-TRACKER-001.md) |
| Every command's real timing/tokens/outcome | [`spec/traceability/tasks/TASK-TRACKER-001/TRACEABILITY.md`](spec/traceability/tasks/TASK-TRACKER-001/TRACEABILITY.md) |
| Implementation conventions for new work | `src-code-frontend/rules/conventions.md` + `skills/component-creation.md`, `src-code-backend/rules/conventions.md` + `skills/endpoint-creation.md` |
| The actual running code | `src-code-frontend/src/`, `src-code-backend/src/` |
