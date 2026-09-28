---
"@rspl/speccraft": patch
---

Add a hard rule so progress and traceability are no longer lost when any story-level command (`/speccraft.orchestrate`, `tech-design`, `decompose`, `implement`, `unit-test`, `integration-test`, `validate`, `change`) delegates stories or tasks to sub-agents, whether in parallel or one after another.

- New `SHARED-POLICIES.md` § Sub-Agent Delegation Rules:
  - The delegation brief must name the story's exact progress file and traceability shard, and list the writes required at each stage.
  - The sub-agent writes those files itself before it returns, and ends with a Write-Back Receipt.
  - Repo-wide files (such as `STORY-DEPENDENCIES.md`) are written only by the parent, one at a time.
  - The parent reads the files to verify them before the story advances.
- `STAGE-CONTRACT.md` § Delegated Work Integrity: a delegated stage whose progress or traceability entries are missing triggers an automatic `revise` (write-back only). It is never an Accepted Issue.
- `speccraft.orchestrate.md`:
  - new § Parallel Execution And Sub-Agents
  - progress and traceability self-check before the auto-mode Final Consolidated Handoff
  - Stage 13 now confirms the verification gate passed
- `tech-design`, `decompose`, `implement`, `unit-test`, `integration-test`, `validate`, `change`: each contract has a new `## Sub-Agent Delegation` section listing the exact progress and traceability writes its stage requires, and covering both sides of the rule (when the command delegates, and when it runs as a sub-agent).
  - `change`: Pass 1 (Discovery) is never delegated, and the bundle is not submitted for review until every cascaded story passes the Parent Verification Gate.
- `spec/AGENTS.md` and the command stubs of all eight commands (Claude, Codex/Antigravity, Copilot, Gemini) now carry the sub-agent rule.
