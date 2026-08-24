# speccraft.implement

Command starts execution implementation stage from an approved delivery task.

---

## Required Input

- task file path or task identifier
- confirmation that task status is `approved`

---

## Fresh Context Rule

**Each task invocation starts a fresh context.** Do not carry over prior task implementation context. Load only what this specific task needs. This keeps per-task token cost bounded and prevents context bloat across tasks.

---

## Execution Rule

**Before anything else in this invocation — before reading the task's `Layer` field, before any file read:** capture the real wall-clock `Start` timestamp per `spec/workflows/shared/SHARED-POLICIES.md` §Duration Capture. Non-skippable, and it applies fresh to each task invocation per the Fresh Context Rule above — a new context means a new `Start` capture, never a carried-over or guessed one.

For each task invocation, read the task's `Layer` field **first** — it determines the code root, the architecture section, and the rule files for the rest of this list. Filename tag (`-FRONTEND-`/`-BACKEND-`) is belt-and-suspenders only; branch on the `Layer` field programmatically, not on the filename.

Read in order:

1. `spec/AGENTS.md`
2. relevant execution stage doc under `spec/workflows/` (implementation stage)
3. the approved task file — read its `Layer` field before anything else in this list
4. `spec/architecture/ARCH-DECISIONS.md` — **read before writing any code**; locked decisions are non-negotiable; `Layer: frontend` → read the `AD-FRONTEND-*` section, `Layer: backend` → read the `AD-BACKEND-*` section (either may also depend on `AD-X-*` cross-cutting decisions) (+ any other arch spec files this project added)
5. `Layer: frontend` → `src-code-frontend/AGENTS.md`; `Layer: backend` → `src-code-backend/AGENTS.md` — implementation rule routing for that root

Then write implementation output to the routed root: `Layer: frontend` → `src-code-frontend/`; `Layer: backend` → `src-code-backend/`.

For any API operation this task touches: `Layer: backend` — the approved `LLD-BACKEND-<id>.md` §5 touchpoint table entry is the binding shape; write or update `contracts/<module>/<module>.yaml` to match it as part of this task's own implementation output — the contract file does not need to pre-exist. `Layer: frontend` — read `contracts/<module>/<module>.yaml` if the operation is already there (its backend dependency has landed); otherwise use the approved, companion-checked LLD touchpoint table as the interim shape for a mocked implementation, and reconcile against the real file once the dependency resolves. If an operation has neither a real contract entry nor an approved LLD touchpoint entry, the task is `blocked` — do not hand-write a shape with no design-time authority.

Load additional rule files **only if the task explicitly requires them** — follow routing in the layer's `AGENTS.md`: `src-code-frontend/rules/` for frontend tasks, `src-code-backend/rules/` for backend tasks (created by that layer's `/speccraft.scaffold`; empty until a project fills them in).

Do NOT load full architecture specs beyond `ARCH-DECISIONS.md`'s `## Agent Delta` section as a standard read unless it's insufficient for the current task.

---

## Exit Behavior

After producing implementation output:

1. Output list of files written and brief implementation summary
2. Output minimal handoff block (stage, artifact, traceability status, assumptions, blockers, next action)
3. Append one row to current story traceability shard `spec/traceability/<mirrored-business-path>/TRACEABILITY.md` under `Workflow Metrics` per `spec/workflows/shared/SHARED-POLICIES.md`
4. STOP — do not begin code-to-unit-tests; wait for human response
5. Do not self-approve implementation

Implementation cannot be approved by the same execution that produced it.

