# speccraft.unit-test

## Purpose

This command starts the execution testing stage from approved implementation output.

---

## Required Input

- task file path or task identifier
- implementation output reference
- confirmation that implementation has passed review

---

## Execution Rule

**Before anything else in this invocation — before reading the task's `Layer` field, before any file read:** capture the real wall-clock `Start` timestamp per `spec/workflows/shared/SHARED-POLICIES.md` §Duration Capture. Non-skippable, whether this turn is a fresh invocation or a continuation from `task-to-code`.

Read the task's `Layer` field **first** — it determines the test file location and test-framework choice for the rest of this command. Branch on the `Layer` field programmatically, not on the filename tag.

When this command is invoked, the agent should read:

1. `spec/init.md`
2. `spec/AGENTS.md`
3. `spec/WORKFLOW-OVERVIEW.md`
4. `spec/workflows/testing/TESTING-STAGE.md`
5. the approved task, and its `Layer` field
6. the approved implementation output — `Layer: frontend` → under `src-code-frontend/`; `Layer: backend` → under `src-code-backend/`

Write unit tests under the routed layer's test convention: `Layer: frontend` → `src-code-frontend/`'s test convention and frontend test framework (per `src-code-frontend/AGENTS.md`); `Layer: backend` → `src-code-backend/`'s test convention and backend test framework (per `src-code-backend/AGENTS.md`).

The agent must not skip the testing review gate after tests are produced.

---

## Exit Behavior

After producing unit tests for the task:

1. output the list of test files written and a brief coverage summary
2. output the minimal handoff block (from `spec/workflows/shared/SHARED-POLICIES.md`)
3. append one row to current story traceability shard `spec/traceability/<mirrored-business-path>/TRACEABILITY.md` under `Workflow Metrics` per `spec/workflows/shared/SHARED-POLICIES.md` (story ID, command = `unit-test`, stage = `Testing`, date, model, start/end timestamps, duration (computed), input/output tokens (actual from transcript, est. fallback), tok source, artifacts, status, notes)
4. STOP — do not begin validate
5. do not self-approve the test output
6. wait for human response in the next conversation turn


