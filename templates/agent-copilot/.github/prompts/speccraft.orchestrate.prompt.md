---
description: Execute master end-to-end workflow for a business spec file.
mode: agent
---
Read `spec/commands/speccraft.orchestrate.md` in full, then execute the master end-to-end workflow for the business spec file provided.

Input: ${input:arguments:business spec file path}

Rules before starting:
- confirm the business spec file exists and is readable
- read all documents listed in the "Documents This Command Must Use" section of spec/commands/speccraft.orchestrate.md
- follow the stage sequence exactly as defined
- Stage 3 (LLD Review Gate) is a HARD STOP — produce LLD, output handoff, wait for human approval
- Stage 5 (Decomposition Review Gate) is a HARD STOP — produce tasks, output handoff, wait for human approval
- do not self-approve any artifact produced in this execution
- do not proceed past any review gate without explicit human approval in a new message

The canonical contract now documents layer-aware behavior: Stage 2 produces the LLD artifact(s) for this project's Layer Scope (a linked LLD-FRONTEND/LLD-BACKEND pair when Layer Scope = both, a single artifact otherwise), Stage 4 decomposes every in-scope LLD, and Stages 10–11 (integration testing) run only for backend-tagged tasks.
