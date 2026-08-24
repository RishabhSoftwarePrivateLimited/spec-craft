---
name: speccraft.unit-test
description: Generate unit tests for an approved implementation. Use when user runs $speccraft.unit-test or asks to write unit tests for an approved task.
---
Read `spec/commands/speccraft.unit-test.md` and `spec/workflows/testing/TESTING-STAGE.md` in full, then generate unit tests for the approved implementation provided.

Input: read the task file path the user supplied after invoking this skill.

Rules before starting:
- confirm the task implementation is approved before writing tests
- active phase must be execution
- cover all behaviors listed in the task's "Expected Test Implications" section
- use the test framework locked in `spec/architecture/ARCH-DECISIONS.md`
- follow this project's test-creation conventions in `src-code-frontend/skills/` or `src-code-backend/skills/` (layer-matched), once added
- update traceability in the current story's shard: `spec/traceability/<mirrored-business-path>/TRACEABILITY.md`
- after generating tests: output test file paths + coverage summary + minimal handoff block, then STOP
- do not self-approve the tests
- wait for human approval before running /speccraft.validate (backend tasks route through /speccraft.integration-test first; frontend tasks go straight to /speccraft.validate)

The canonical contract now documents Layer-field routing: the task's Layer selects the locked test framework and rules subset (frontend vs backend).
