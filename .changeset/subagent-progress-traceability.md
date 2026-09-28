---
"@rspl/speccraft": patch
---

Add a hard rule so progress and traceability are no longer lost when `/speccraft.orchestrate` delegates stories or tasks to sub-agents, whether in parallel or one after another.

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
- `spec/AGENTS.md` and every orchestrate command stub now carry the sub-agent rule.
