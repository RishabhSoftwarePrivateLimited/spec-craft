Read `spec/commands/speccraft.integration-test.md` and `spec/workflows/integration-testing/INTEGRATION-TESTING-STAGE.md` in full, then generate integration tests for the approved implementation and approved unit tests provided.

Input: $ARGUMENTS

Rules before starting:
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

The canonical contract now documents the backend-only precondition explicitly: this command refuses to run and routes straight to /speccraft.validate if the task's Layer is frontend.
