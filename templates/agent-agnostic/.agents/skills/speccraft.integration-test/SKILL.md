---
name: speccraft.integration-test
description: Generate integration tests for an approved implementation and unit tests (backend only). Use when user runs $speccraft.integration-test or asks to write integration tests for a backend task. Supports an "auto" mode that runs unattended, with no human approval gate.
---
Read `spec/commands/speccraft.integration-test.md` and `spec/workflows/integration-testing/INTEGRATION-TESTING-STAGE.md` in full, then generate integration tests for the approved implementation and approved unit tests provided.

Input: read the arguments the user supplied after invoking this skill as an optional leading `auto` token, then the task id. `auto` present -> auto mode; absent -> interactive mode (default).

Rules before starting (interactive mode):
- confirm the task implementation and unit tests are both approved before writing integration tests
- active phase must be execution
- cover each in-scope API endpoint or entrypoint at the contract level, and any persistence/cache/queue/external-service interaction the task introduces or changes
- prefer real or containerized dependencies over mocks; record the boundary explicitly if a mock is unavoidable
- use the test framework locked in `spec/architecture/ARCH-DECISIONS.md`
- follow this project's test-creation conventions in `src-code-backend/skills/`, once added
- update traceability in the current story's shard: `spec/traceability/<mirrored-business-path>/TRACEABILITY.md`
- after generating tests: output test file paths + cross-boundary coverage summary + minimal handoff block, then STOP
- do not self-approve the tests
- wait for human approval before running /speccraft.validate

Rules before starting (auto mode — `auto` token present):
- same confirmations and same test generation as interactive mode above
- do not pause for the Integration Testing Review Gate — apply `spec/commands/speccraft.integration-test.md` § Auto Mode instead: the agent self-reviews the tests against expected cross-boundary coverage, `revise` findings get up to 2 automatic retries (unresolved concerns logged as Accepted Issues, never dropped), and a `blocked` conflict is resolved and logged (`Approver: auto-mode-ai`) instead of escalated
- still do not run /speccraft.validate — this command does not auto-chain into the next stage even in auto mode
- report the same minimal handoff block with `Mode: auto`, then stop

The canonical contract now documents the backend-only precondition explicitly: this command refuses to run and routes straight to /speccraft.validate if the task's Layer is frontend — plus the full `/speccraft.integration-test auto <task-id>` signature and § Auto Mode mechanics.
