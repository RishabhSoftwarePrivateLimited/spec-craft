# speccraft.integration-test

## Purpose

This command starts the execution integration-testing stage from approved implementation and approved unit test output.

Command shape:

```text
/speccraft.integration-test <task-id>
```

---

## Required Input

- task file path or task identifier
- implementation output reference, with review outcome `approved`
- unit test output reference, with review outcome `approved`

---

## Pre-Execution Checks

**Step zero, before check 1 below and before anything else in this command — including reading the task definition:** capture the real wall-clock `Start` timestamp per `spec/workflows/shared/SHARED-POLICIES.md` §Duration Capture. Non-skippable — applies even when this run ends immediately in `blocked` (e.g. `Layer: frontend` routing it away) and on continuation turns.

Before this command proceeds, confirm:

1. active phase is execution
2. the task ID maps to an existing, readable task definition
3. **the task's `Layer` field is `backend`** — check this first. If `Layer: frontend`, do NOT run this command: report that this task routes directly to `/speccraft.validate` instead, and stop. This command only ever runs for backend-tagged tasks.
4. the implementation for this task has been reviewed and is `approved`
5. the unit tests for this task have been reviewed and are `approved`

If these checks fail materially, do not proceed — state the blocker explicitly.

---

## Execution Rule

When this command is invoked, the agent should read:

1. `spec/init.md`
2. `spec/AGENTS.md`
3. `spec/WORKFLOW-OVERVIEW.md`
4. `spec/workflows/integration-testing/INTEGRATION-TESTING-STAGE.md`
5. the approved implementation output
6. the approved unit test output
7. the approved task
8. the task's API contract reference, if one exists

The agent must not skip the integration testing review gate after tests are produced.

---

## Expected Command Behavior

1. identify the boundaries the task's implementation crosses (API entrypoint, persistence, cache, queue, external service)
2. write or update integration tests exercising the wired path across those boundaries — real or containerized dependency preferred over mocks
3. cover the contract-level behavior: request/response shape, status/error codes, and the relevant failure paths (dependency down, timeout, conflict)
4. document any boundary that could not be integration-tested in the current environment, with reason
5. update traceability: unit tests -> integration tests

---

## Exit Behavior

After producing integration tests for the task:

1. output the list of test files written and a brief cross-boundary coverage summary (which boundaries were exercised, real vs. containerized vs. justified mock)
2. output the minimal handoff block (from `spec/workflows/shared/SHARED-POLICIES.md`)
3. append one row to current story traceability shard `spec/traceability/<mirrored-business-path>/TRACEABILITY.md` under `Workflow Metrics` per `spec/workflows/shared/SHARED-POLICIES.md` (story ID, command = `integration-test`, stage = `Integration Testing`, date, model, start/end timestamps, duration (computed), input/output tokens (actual from transcript, est. fallback), tok source, artifacts, status, notes)
4. STOP — do not begin `/speccraft.validate`
5. do not self-approve the test output
6. wait for human response in the next conversation turn

---

## Relationship To Other Documents

Read this document together with:

- `spec/workflows/integration-testing/INTEGRATION-TESTING-STAGE.md`
- `spec/workflows/testing/TESTING-STAGE.md` — upstream stage
- `spec/workflows/validation/VALIDATION-STAGE.md` — downstream stage
- `spec/commands/speccraft.unit-test.md`
- `spec/commands/speccraft.validate.md`
