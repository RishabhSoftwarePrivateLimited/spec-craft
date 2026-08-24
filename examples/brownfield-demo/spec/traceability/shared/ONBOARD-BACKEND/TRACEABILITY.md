# Traceability: ONBOARD-BACKEND

Shared exception for repo-wide backend brownfield-onboarding history. Do not use this file for story-specific traceability.

## Workflow Metrics

| Story ID | Command | Stage | Date | Model | Start | End | Duration (min) | Input Tok | Output Tok | Tok Source | Artifacts | Status | Notes |
|----------|---------|-------|------|-------|-------|-----|-----------------|-----------|------------|------------|-----------|--------|-------|
| ONBOARD-BACKEND | `/speccraft.onboard examples/brownfield-demo/src-code-frontend` | Brownfield Onboarding | 2026-08-14 | claude-sonnet-5 | 2026-08-14 16:28 | 2026-08-14 16:39 | 11 | 9046937 | 73162 | actual | `spec/architecture/ARCH-DECISIONS.md` (AD-BACKEND-*, AD-X-*), `src-code-backend/rules/conventions.md`, `src-code-backend/skills/endpoint-creation.md` | done | Session total across both layers (Layer Scope = both, single combined run); cache_read=8042906 + cache_creation=1003831 of 9046937 total input — mostly cached spec/context reads. Includes the human review-gate wait for `approved` (not separately measurable within this window). |

### Last Updated
2026-08-14

---

## Conflict Decisions

Not applicable — no ambiguous/conflicting stack evidence was found during this onboarding scan.
