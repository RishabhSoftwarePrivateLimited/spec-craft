---
name: speccraft.implement
description: Implement an approved task. Use when user runs $speccraft.implement or asks to implement an approved task file.
---
Read `spec/commands/speccraft.implement.md` and `spec/workflows/implementation/IMPLEMENTATION-STAGE.md` in full, then implement the approved task provided.

Input: read the task file path the user supplied after invoking this skill.

Rules before starting:
- confirm the task file exists and its status is `approved`
- read the task's Layer field first, then confirm the matching code root exists (src-code-frontend/ for Layer: frontend, src-code-backend/ for Layer: backend) — if not, run /speccraft.scaffold frontend or /speccraft.scaffold backend first
- confirm the OpenAPI spec covering all API endpoints in this task is available; if missing, task is blocked
- active phase must be execution
- implement only what is in scope for the provided task — do not expand scope
- update traceability in the current story's shard: spec/traceability/<mirrored-business-path>/TRACEABILITY.md
- after implementing: output a summary of changed files + minimal handoff block, then STOP for review
- do not self-approve the implementation
- wait for human approval before running /speccraft.unit-test

The canonical contract now documents Layer-field routing: implementation, architecture subset, and rules subset are all selected by the task's Layer.
