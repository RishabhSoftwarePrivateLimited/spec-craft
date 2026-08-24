---
name: speccraft.validate
description: Run final read-only validation for a task. Use when user runs $speccraft.validate or asks to validate an approved, tested task.
---
Read `spec/commands/speccraft.validate.md` in full, then run final validation for the task provided.

Input: read the task id the user supplied after invoking this skill.

Rules before starting:
- confirm the task implementation is approved
- confirm the task tests are approved
- active phase must be execution
- this command is read-only — no code changes allowed during validation
- produce the Validation section (## Task: TASK-{id} → ### Validation) in spec/progress/<module>/progress-{STORY-ID}.md
- check: implementation matches task scope, tests cover required behaviors, traceability chain is complete — 4-link (req → LLD → task → code → tests) for Layer: frontend tasks, 5-link (adds unit-test → integration-test) for Layer: backend tasks
- after validation: output progress file path + pass/fail verdict + any gaps found, then STOP
- mark task as done only if all checks pass and all gaps are recorded

The canonical contract now documents the dual chain-length branch by task Layer, and requires backend tasks to have an approved integration-tests stage before this command runs.
