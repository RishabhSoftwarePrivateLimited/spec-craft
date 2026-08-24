# speccraft.decompose.md

Command: `/speccraft.decompose <lld-fe-file> <lld-be-file>` (Layer Scope = `both`) or `/speccraft.decompose <lld-file>` (Layer Scope is single-layer)

Starts or continues planning Decomposition for a single story's approved, in-scope LLD(s). When Layer Scope = `both`, both approved LLDs (frontend and backend) are required input, together — this is what lets cross-layer task dependencies (e.g. a BACKEND endpoint task that a FRONTEND task consumes) be expressed via the existing `Dependencies` field, even though both tasks can be coded in parallel against a mocked contract. When Layer Scope is single-layer, the single approved LLD is sufficient input on its own.

---

## Command Intent

- Use the in-scope approved LLD(s) as primary source — `LLD-FRONTEND-<id>.md` and `LLD-BACKEND-<id>.md` (both must be `approved`) when Layer Scope = `both`; the one approved LLD otherwise
- Enter or continue planning Decomposition flow
- Convert the approved LLD(s) into one delivery-ready task set spanning the in-scope layer(s)
- Write task files to `spec/tasks/<module>/` (mirrored per business module, flat, no `tasks/` subfolder, no per-layer subfolder)
- Every emitted task file must carry both the filename layer tag (`-FRONTEND-`/`-BACKEND-`) and a mandatory `Layer: frontend|backend` metadata field
- Update planning traceability (LLD section → task ID mappings, for the in-scope layer(s))
- Hand off into decomposition review, revision, or blocked state

Does not: edit any input LLD, edit the business spec, write code, write tests, invent architecture decisions not already in the LLD(s).

---

## Required Input

The approved LLD file reference(s) for this story's in-scope layer(s) — `LLD-FRONTEND-<id>.md` and `LLD-BACKEND-<id>.md` together when Layer Scope = `both`, or the single relevant file otherwise. Every file provided must be readable, status `approved`, and specific enough for safe task derivation. When Layer Scope = `both`, neither LLD alone is sufficient input — both must be read together so cross-layer dependencies can be identified.

---

## Pre-Execution Checks

**Step zero, before check 0 below and before anything else in this command — including reading any LLD file:** capture the real wall-clock `Start` timestamp per `spec/workflows/shared/SHARED-POLICIES.md` §Duration Capture. Non-skippable — applies even when this run ends immediately in `blocked` and on continuation turns, not only fresh invocations.

0. Invocation argument count matches this project's Layer Scope (read from `spec/architecture/ARCH-DECISIONS.md` §Layer Scope) — reject a two-file invocation when scope is single-layer (extraneous input), reject a one-file invocation when scope is `both` (missing companion)
1. Active phase is planning
2. Every in-scope LLD file exists, readable, status is `approved` — decomposition does not begin until all of them are independently approved (both, when Layer Scope = `both`)
3. Stable requirement references exist in or through every in-scope LLD
4. LLD traceability strong enough for downstream task derivation, on every in-scope side
5. No open blockers in any in-scope LLD making task slicing unsafe
6. Relevant architecture references known or explicitly noted as absent, for the in-scope layer(s)
7. When Layer Scope = `both`: each LLD's Companion LLD Reference section correctly names the other as its pair (sanity check the two files actually belong to the same story)

If these checks fail materially, do not produce review-ready task output.

---

## Documents This Command Must Use

- `spec/AGENTS.md`
- `spec/SPEC-HIERARCHY.md`
- `spec/REVIEW-AND-REVISION-POLICY.md`
- `spec/workflows/shared/STAGE-CONTRACT.md`
- `spec/workflows/shared/TRACEABILITY-RULES.md`
- `spec/workflows/decomposition/DECOMPOSITION-STAGE.md`
- project architecture references where decomposition touches architecture boundaries (see planning Read Order in `spec/AGENTS.md`)

Every in-scope approved LLD file is the primary planning source — read all of them in full before decomposition begins (both, when Layer Scope = `both`).

Do NOT load full architecture specs as standard reads. Load only where specific task touches architecture boundaries and structure reference is insufficient.

---

## Expected Behavior

1. Read every in-scope approved LLD in full
2. Identify all in-scope LLD sections and their source requirement references
3. Determine relevant architecture constraints at task level, per in-scope layer
4. Slice each LLD into delivery-ready tasks following sizing rules and Natural Task Shapes in `DECOMPOSITION-STAGE.md` (Foundation / Domain-Service / Endpoint / Shared-Utility, and their frontend equivalents)
5. Preserve edge cases and impacted areas from each LLD in its task definitions
6. Make dependencies and sequencing explicit across tasks — **only when Layer Scope = `both`**, this includes cross-layer dependencies: a task's `Dependencies` field may cite a task ID from the other layer; this is normal use of the existing field, no schema change needed. Sequencing is dependency-driven only: a task with no cross-layer `Dependencies` entry has no forced order relative to the other layer — never default to "backend before frontend" as a blanket rule
7. Write task files for each in-scope layer to `spec/tasks/<module>/TASK-<STORY-ID>-FRONTEND-T<n>.md` and/or `TASK-<STORY-ID>-BACKEND-T<n>.md`, each with a `Layer: frontend|backend` metadata field matching its filename tag and the in-scope layer(s)
8. Update traceability: LLD section → task ID mappings, for the in-scope layer(s); rows written here are always `Source = original` (see `spec/traceability/TRACEABILITY.md` §LLD to Tasks)
9. Assign honest state; prepare review handoff covering every in-scope layer's tasks together

Tasks must not be so vague that execution has to reverse-engineer the LLD or business spec.

---

## Output

Primary: delivery task files at `spec/tasks/<module>/TASK-<STORY-ID>-FRONTEND-T<n>.md` and/or `TASK-<STORY-ID>-BACKEND-T<n>.md` (per Layer Scope), mirrored per module, flat within the module folder.

Each task file must include: task ID, `Layer: frontend|backend` field, source requirement IDs, source LLD section refs (naming which LLD), objective, in-scope/out-of-scope, impacted areas, edge cases inherited from the LLD, architecture constraints, dependencies (may cite cross-layer task IDs when Layer Scope = `both`), expected implementation evidence, expected test implications.

Supporting: dependency map (including cross-layer edges when Layer Scope = `both`), sequencing notes, review-ready or blocked handoff, traceability update.

---

## Review Checklist Addition

In addition to the existing sizing/scope/edge-case checks in `DECOMPOSITION-STAGE.md`, decomposition review must also confirm:

- **filename layer tag matches `Layer` field** — revise if mismatched (e.g. a file named `TASK-101-FRONTEND-T3.md` with `Layer: backend` is a mismatch and must be revised before approval)

---

## Failure & Block Conditions

Move to `revise` or `blocked` when:
- Any in-scope LLD not yet `approved`
- Any in-scope LLD too vague to derive safe task boundaries
- Tasks would be too large to review or execute clearly
- Edge cases from any in-scope LLD cannot be safely preserved in task definitions
- Required dependencies (including cross-layer ones, when Layer Scope = `both`) cannot be made explicit
- Architecture conflicts appear at task level unresolved in any in-scope LLD
- An LLD gap would require reopening a locked planning artifact
- A task's filename layer tag and `Layer` field disagree
- Invocation argument count does not match this project's Layer Scope

Use `blocked` when human resolution required and revision alone cannot unblock.

---

## Exit Behavior

**HARD STOP after task artifacts produced.**

1. Output task list (IDs, names, complexity, layer), execution order (dependency-driven, not layer-priority-driven — see `DECOMPOSITION-STAGE.md` §Task ordering), sizing rationale — every in-scope layer together
2. Output minimal handoff block (command, in-scope LLD input(s), phase, stage, task files, task IDs, state, LLD scope covered per layer, traceability status, dependency status including cross-layer edges when Layer Scope = `both`, edge case carry-through, review need, blockers, next action)
3. Append one row to current story traceability shard `spec/traceability/<mirrored-business-path>/TRACEABILITY.md` under `Workflow Metrics` per `spec/workflows/shared/SHARED-POLICIES.md`
4. STOP — do not begin execution; wait for human response

execution begins only after explicit human approval of decomposition output.
Decomposition cannot be approved by the same execution that produced it.
If human responds `revise: [reason]` → revise tasks and stop again with new handoff.
If human responds `blocked: [reason]` → record blocker and stop.
