# Onboarding Status: Backend

| Field | Value |
|---|---|
| Command | `/speccraft.onboard examples/brownfield-demo/src-code-frontend` |
| Layer Scope Resolved | both (backend half recorded here) |
| Existing Code Located | yes — `src-code-backend/` |
| Tier 1 Rows Proposed (backend) | 7 (`AD-BACKEND-001`..`007`) plus 3 shared `AD-X-001`..`003` |
| Tier 2 Entries Proposed (backend) | 2 (`rules/conventions.md`, `skills/endpoint-creation.md`) |
| Review Outcome | approved |
| ARCH-DECISIONS.md Written | yes |
| rules/skills Written | yes |
| Current State | complete |
| Date | 2026-08-14 |
| Start | 2026-08-14 16:28 |
| End | 2026-08-14 16:39 |

## Notes

- Discovered stack: Express 5 + TypeScript, no ORM (in-memory array-backed repository), no auth, REST/JSON, no messaging/queue, `node --test` + `supertest` — see `spec/architecture/ARCH-DECISIONS.md` `AD-BACKEND-001`..`007`.
- Cross-cutting (`AD-X-001`..`003`): no formal API contract schema yet, CORS allows the frontend dev origin only, no token format (no auth).
- No ambiguous or conflicting evidence found for any Tier 1 or Tier 2 finding.
- Existing code was not modified, moved, or refactored — this command is documentation-only per its Hard Boundary Rules.
- `rules/conventions.md` and `skills/endpoint-creation.md` written to `src-code-backend/rules/` and `src-code-backend/skills/` (no prior content existed in either folder).

## Next Recommended Action

Human should confirm the written `ARCH-DECISIONS.md` and `rules`/`skills` content is acceptable. Per `/speccraft.onboard`'s Exit Behavior, this command does not chain into `/speccraft.scaffold` or any planning stage — `/speccraft.scaffold backend` will (correctly) continue to refuse to run since `src-code-backend/` already has real code. Optionally run `/speccraft.tech-debt backend` for a read-only code-health report before starting feature work.
