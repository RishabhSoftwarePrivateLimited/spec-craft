---
description: Generate integration tests for an approved implementation and unit tests.
mode: agent
---
Read `spec/commands/speccraft.integration-test.md` and `spec/workflows/integration-testing/INTEGRATION-TESTING-STAGE.md` in full, then generate integration tests for the approved implementation and approved unit tests provided.

Input: ${input:arguments:optional leading "auto" token, then task id}

Parse the input: an optional leading `auto` token selects auto mode (see below); consume it first if present, then parse the rest exactly as before. `auto` present -> auto mode; absent -> interactive mode (default).

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

Rules in both modes — sub-agents (hard rule):
- if you hand any of this work to a sub-agent (parallel or not), follow `spec/commands/speccraft.integration-test.md` § Sub-Agent Delegation
- the brief must name the story's exact `spec/progress/<module>/progress-<STORY-ID>.md` and `spec/traceability/<module>/<STORY-ID>/TRACEABILITY.md` and the writes required; the sub-agent writes them before returning and ends with a Write-Back Receipt
- read those files to verify them, and backfill or re-dispatch any gap before your handoff
- if you are running as a sub-agent yourself, make those writes before returning and end with a Write-Back Receipt

The canonical contract now documents the backend-only precondition explicitly: this command refuses to run and routes straight to /speccraft.validate if the task's Layer is frontend — plus the full `/speccraft.integration-test auto <task-id>` signature and § Auto Mode mechanics.
