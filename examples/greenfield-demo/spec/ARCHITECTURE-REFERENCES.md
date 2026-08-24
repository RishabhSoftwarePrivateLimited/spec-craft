# ARCHITECTURE-REFERENCES.md

Single index of authoritative architecture documents. Reference this file wherever arch docs are listed — do not re-list them inline in other documents.

---

## Authoritative Architecture Documents

Stack locked for this demo — `Layer Scope: both` (Vite+React+TS frontend, Express+TS backend, no auth). See `spec/architecture/ARCH-DECISIONS.md` for the full decision log.

| Document | Scope | Layer | Apply In |
|---|---|---|---|
| `spec/architecture/ARCH-DECISIONS.md` | Locked stack decisions — `AD-FRONTEND-001`..`007` (framework, UI, state, forms, auth, styling, testing); `AD-BACKEND-001`..`006` (framework, data access, auth, API style, messaging, testing); `AD-X-001`..`003` (API contract format, CORS, token format) | frontend / backend / cross-cutting | Every LLD (`LLD-FRONTEND` and/or `LLD-BACKEND`) and implementation task — read before designing or coding, filtered to the rows matching the task's or LLD's `Layer` |
| `spec/architecture/FRONTEND-STRUCTURE.md` | Routing conventions (none needed yet — single screen) and module boundaries (`api/` → `components/` → `types/`, one-way dependency flow) | frontend | Frontend LLD creation, `/speccraft.decompose`, `/speccraft.implement` for `Layer: frontend` tasks |
| `spec/architecture/BACKEND-STRUCTURE.md` | Layering (`routes` → `controllers` → `services` → `repositories`) and data/integration strategy (in-memory only, no external systems) | backend | Backend LLD creation, `/speccraft.decompose`, `/speccraft.implement`/`/speccraft.integration-test` for `Layer: backend` tasks |
| `contracts/<module>/<module>.yaml` | API contract — one growing file per module; not pre-created, written/updated by backend implementation tasks to match the approved LLD-BACKEND touchpoint table | cross-cutting | LLD creation (binding shape once it exists), backend implementation (authors it), frontend implementation (consumes it or the draft LLD shape if not yet written) |

---

## Rules

- These documents are **authoritative** — workflow docs wrap around them, never override them silently.
- If a business spec appears to conflict with a decision in ARCH-DECISIONS.md, escalate to human — do not self-resolve.
- When implementing, note in the task/LLD metadata which decisions apply (e.g. "AD-FRONTEND-001, AD-X-002").
- If a new cross-story architectural decision is made, add it to ARCH-DECISIONS.md under a new `AD-FRONTEND-NNN` / `AD-BACKEND-NNN` / `AD-X-NNN` ID, matching the layer it applies to.
- `/speccraft.tech-design` and `/speccraft.implement` filter this index by Layer before reading full arch spec files — a frontend-tagged LLD or task reads `AD-FRONTEND-*` and `AD-X-*` rows only; a backend-tagged one reads `AD-BACKEND-*` and `AD-X-*` rows only.

---

## Related

- `spec/commands/speccraft.scaffold.md §Architectural Decisions Not Implemented At Scaffold` — deferred decisions with per-story read pointers
- `spec/SPEC-HIERARCHY.md` — precedence model when documents conflict
- `spec/progress/shared/TECH-DEBT-FRONTEND/REPORT.md`, `spec/progress/shared/TECH-DEBT-BACKEND/REPORT.md` — optional, produced by `/speccraft.tech-debt`; cite a report entry from an in-scope LLD only if this project chooses to (opt-in, same treatment as `NFR-SUMMARY.md` — not a mandatory read for any stage)
