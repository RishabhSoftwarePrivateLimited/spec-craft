# CHANGE.md — Spec Consolidation
**Date:** 2026-06-25
**Type:** Consolidation + Content Cuts
**Goal:** Reduce spec file count ~70%. Cut AI context load ~50% per session. Zero behavior change for pure consolidations; selective content cuts for NFR boilerplate.

---

## Summary

| Area | Before | After | Change Type |
|------|--------|-------|-------------|
| Workflow stage docs | 36 files (6 per stage) | 5 stage files (1 per stage) | Consolidation |
| Intake stage | 6 separate files | Inlined into LLD-STAGE.md | Consolidation |
| Shared workflow policies | 7 files | 3 files (STAGE-CONTRACT + TRACEABILITY-RULES kept, rest merged to SHARED-POLICIES) | Consolidation |
| rules/ + skills/ | 15 files | 4 files | Consolidation |
| nfr/ | 8 files | 1 file (NFR-SUMMARY.md) | Consolidation + Content Cut |
| traceability/ | 7 files | 1 file (TRACEABILITY.md) | Consolidation |
| templates/ | 6 files | 1 file (TEMPLATES.md) | Consolidation |
| Root commands/ wrappers | 4 files | Archived | Cleanup |

---

## New Files Created

### Workflow Stages
- `spec/workflows/lld/LLD-STAGE.md` — replaces: INTAKE-WORKFLOW, INTAKE-INPUT-CONTRACT, INTAKE-OUTPUT-CONTRACT, INTAKE-REVIEW-CHECKLIST, INTAKE-REVISION-RULES, INTAKE-DONE-CRITERIA, LLD-WORKFLOW, LLD-INPUT-CONTRACT, LLD-OUTPUT-CONTRACT, LLD-REVIEW-CHECKLIST, LLD-REVISION-RULES, LLD-DONE-CRITERIA
- `spec/workflows/decomposition/DECOMPOSITION-STAGE.md` — replaces: DECOMPOSITION-WORKFLOW, TASK-SIZING-RULES, TASK-OUTPUT-CONTRACT, DECOMPOSITION-REVIEW-CHECKLIST, DECOMPOSITION-REVISION-RULES, DECOMPOSITION-DONE-CRITERIA
- `spec/workflows/implementation/IMPLEMENTATION-STAGE.md` — replaces: TASK-TO-CODE-WORKFLOW, IMPLEMENTATION-INPUT-CONTRACT, IMPLEMENTATION-OUTPUT-CONTRACT, IMPLEMENTATION-REVIEW-CHECKLIST, IMPLEMENTATION-REVISION-RULES, IMPLEMENTATION-DONE-CRITERIA
- `spec/workflows/testing/TESTING-STAGE.md` — replaces: CODE-TO-UNIT-TESTS-WORKFLOW, TEST-INPUT-CONTRACT, TEST-OUTPUT-CONTRACT, TEST-REVIEW-CHECKLIST, TEST-REVISION-RULES, TEST-DONE-CRITERIA
- `spec/workflows/validation/VALIDATION-STAGE.md` — replaces: VALIDATION-WORKFLOW, VALIDATION-INPUT-CONTRACT, VALIDATION-OUTPUT-CONTRACT, VALIDATION-REVIEW-CHECKLIST, VALIDATION-DONE-CRITERIA

### Shared Policies
- `spec/workflows/shared/SHARED-POLICIES.md` — replaces: APPROVAL-STATE-MODEL, DONE-CRITERIA-RULES, HANDOFF-FORMAT, METRICS-RULES, CONFLICT-DECISIONS-RULES
- `spec/workflows/shared/STAGE-CONTRACT.md` — KEPT AS-IS (critical phase boundary rules, frequently referenced)
- `spec/workflows/shared/TRACEABILITY-RULES.md` — KEPT AS-IS (frequently referenced by name)

### Rules (merged rules/ + skills/ into spec/rules/)
- `spec/rules/COMPONENT-AND-UI-RULES.md` — replaces: NEXTJS-IMPLEMENTATION-RULES, skills/COMPONENT-CREATION-RULES, ACCESSIBILITY-RULES
- `spec/rules/STATE-AND-DATA-RULES.md` — replaces: STATE-MANAGEMENT-RULES, DATA-FETCHING-RULES, skills/HOOK-CREATION-RULES, skills/STORE-CREATION-RULES
- `spec/rules/QUALITY-AND-TEST-RULES.md` — replaces: FORM-AND-VALIDATION-RULES, ERROR-HANDLING-AND-OBSERVABILITY-RULES, skills/TEST-CREATION-RULES, PERFORMANCE-RULES, LINTING-AND-STATIC-ANALYSIS-RULES
- `spec/rules/INFRA-RULES.md` — replaces: CSP-AND-SECURITY-HEADERS-RULES, DEPENDENCY-AND-IMPORT-RULES, skills/SERVICE-FILE-RULES

### NFR
- `spec/nfr/NFR-SUMMARY.md` — replaces all 8 individual NFR files. **Content cut applied**: rationale and background paragraphs removed; actionable constraints and specific criteria retained.

### Traceability
- `spec/traceability/TRACEABILITY.md` — replaces: BUSINESS-TO-LLD, LLD-TO-TASKS, TASKS-TO-CODE, CODE-TO-TESTS, COVERAGE-MATRIX, WORKFLOW-METRICS, CONFLICT-DECISIONS

### Templates
- `spec/templates/TEMPLATES.md` — replaces all 6 individual template files

---

## Archived Files

All superseded files moved to archive folders (recoverable from git or archive path):

| Archive Folder | Files Moved |
|---------------|------------|
| `spec/_archive/workflows/intake/` | 6 intake workflow files |
| `spec/_archive/workflows/lld/` | 6 lld workflow files |
| `spec/_archive/workflows/decomposition/` | 6 decomposition workflow files |
| `spec/_archive/workflows/implementation/` | 6 implementation workflow files |
| `spec/_archive/workflows/testing/` | 6 testing workflow files |
| `spec/_archive/workflows/validation/` | 5 validation workflow files |
| `spec/_archive/workflows/shared/` | 5 shared policy files |
| `spec/_archive/rules/` | 10 original rules files |
| `spec/_archive/skills/` | 5 skills files |
| `spec/_archive/nfr/` | 8 individual NFR files |
| `spec/_archive/traceability/` | 7 traceability tracking files |
| `spec/_archive/templates/` | 6 template files |
| `_archive/commands/` | 4 root commands wrapper files |

**Recovery:** All archived files remain in git history. Use `git log -- <path>` and `git checkout <hash> -- <path>` to recover any specific file.

---

## Content Cuts Applied

| Area | What Was Cut | Reason |
|------|-------------|--------|
| NFR files | Rationale and background paragraphs explaining why each NFR category matters | Not actionable; adds ~3,000 tokens with zero constraint value |
| All stage merges | Per-file "## Purpose / This document defines..." boilerplate opening paragraphs | Redundant with section headers after merge |
| All merges | "See also:" cross-refs pointing to files now merged into same output | Dead references after merge |
| Intake stage | Full separate 6-file stage reduced to a brief section inside LLD-STAGE.md | Intake was trivial work (extract req IDs, confirm scope) not warranting 6 governance files |

---

## What Did NOT Change

- All actual rules, checklist items, criteria, and contracts: **fully preserved in merged files**
- Architecture files (`spec/architecture/`): **untouched**
- Business specs (`spec/business/`): **untouched**
- LLD artifacts (`spec/lld/`): **untouched**
- Delivery tasks (`spec/delivery/`): **untouched**
- Progress records (`spec/progress/`): **untouched**
- Commands (`spec/commands/`): **untouched** (path references updated in AGENTS.md and WORKFLOW-OVERVIEW.md)
- `spec/workflows/shared/STAGE-CONTRACT.md`: **untouched**
- `spec/workflows/shared/TRACEABILITY-RULES.md`: **untouched**

---

## Token Impact Estimate

| Session Type | Before | After | Reduction |
|-------------|--------|-------|-----------|
| Phase 1 LLD run | ~25,000 governance tokens | ~14,000 tokens | ~44% |
| Phase 2 impl run | ~45,000 governance tokens | ~22,000 tokens | ~51% |
| NFR context load | ~8,000 tokens | ~2,500 tokens | ~69% |
| Files read per stage | 6 files | 1 file | 83% fewer reads |

---

## Reference Update Map

Use this table to update any remaining external references to old file paths:

| Old Path | New Path |
|----------|----------|
| spec/workflows/intake/* | spec/workflows/lld/LLD-STAGE.md (see Intake Step section) |
| spec/workflows/lld/LLD-WORKFLOW.md | spec/workflows/lld/LLD-STAGE.md |
| spec/workflows/decomposition/DECOMPOSITION-WORKFLOW.md | spec/workflows/decomposition/DECOMPOSITION-STAGE.md |
| spec/workflows/implementation/TASK-TO-CODE-WORKFLOW.md | spec/workflows/implementation/IMPLEMENTATION-STAGE.md |
| spec/workflows/testing/CODE-TO-UNIT-TESTS-WORKFLOW.md | spec/workflows/testing/TESTING-STAGE.md |
| spec/workflows/validation/VALIDATION-WORKFLOW.md | spec/workflows/validation/VALIDATION-STAGE.md |
| spec/workflows/shared/APPROVAL-STATE-MODEL.md | spec/workflows/shared/SHARED-POLICIES.md |
| spec/rules/NEXTJS-IMPLEMENTATION-RULES.md | spec/rules/COMPONENT-AND-UI-RULES.md |
| spec/rules/STATE-MANAGEMENT-RULES.md | spec/rules/STATE-AND-DATA-RULES.md |
| spec/rules/FORM-AND-VALIDATION-RULES.md | spec/rules/QUALITY-AND-TEST-RULES.md |
| spec/rules/CSP-AND-SECURITY-HEADERS-RULES.md | spec/rules/INFRA-RULES.md |
| spec/skills/* | spec/rules/ (content folded into 4 domain rule files) |
| spec/nfr/[any individual NFR file] | spec/nfr/NFR-SUMMARY.md |
| spec/traceability/[any individual file] | spec/traceability/TRACEABILITY.md |
| spec/templates/[any individual file] | spec/templates/TEMPLATES.md |
| spec/rules/COMPONENT-AND-UI-RULES.md | src-code/rules/COMPONENT-AND-UI-RULES.md |
| spec/rules/STATE-AND-DATA-RULES.md | src-code/rules/STATE-AND-DATA-RULES.md |
| spec/rules/QUALITY-AND-TEST-RULES.md | src-code/rules/QUALITY-AND-TEST-RULES.md |
| spec/rules/INFRA-RULES.md | src-code/rules/INFRA-RULES.md |

---

## Change 2 — 2026-06-25: Implementation Rules Relocated to src-code/

**Type:** Structural move (zero content change)

**Goal:** Eliminate rule overhead from Phase 1 spec generation. Rules are Phase 2-only implementation constraints — they belong with the codebase, not the spec system.

| Area | Before | After |
|------|--------|-------|
| 4 domain rule files | `spec/rules/` | `src-code/rules/` |
| Loading model | Listed in spec/AGENTS.md Phase 2 read order | Two-tier: INFRA always + 3 conditional via src-code/AGENTS.md |

**Two-tier loading:**
- `src-code/rules/INFRA-RULES.md` — always read in Phase 2 (applies to every code file)
- `src-code/rules/COMPONENT-AND-UI-RULES.md` — read when building routes/components/UI
- `src-code/rules/STATE-AND-DATA-RULES.md` — read when building hooks/stores/services/API
- `src-code/rules/QUALITY-AND-TEST-RULES.md` — read when writing or reviewing tests

**Files updated:**
- `src-code/AGENTS.md` — added Implementation Rules section with always/conditional table
- `spec/AGENTS.md` — Phase 2 read order updated to src-code/rules/ paths; INFRA marked always
- `spec/workflows/implementation/IMPLEMENTATION-STAGE.md` — fixed stale pre-consolidation rule paths
- `spec/rules/README.md` — updated to redirect to src-code/rules/

**What did NOT change:** File content is identical — this is a pure file move.

---

## Change 3 — 2026-06-25: Architecture Split — Phase 1 Structural Ref + Phase 2 Implementation Ref

**Type:** Content extraction + read order change (no content removed from existing arch specs)

**Goal:** Cut total token load to ~30K for Phase 1 (LLD + Decomp combined) and ~30K for Phase 2 (Impl + Testing + Validation combined). Architecture docs were the largest single load — 38K tokens across 3 full specs loaded every run.

**Strategy:** Architecture content splits into two tiers by when it is actionable:
- Phase 1 needs structural context only (where does this feature go?)
- Phase 2 needs implementation constraints (how do I write it correctly?)

| Area | Before | After |
|------|--------|-------|
| Phase 1 arch load | ROUTING-SPEC (7.7K) + MODULE-ARCH-SPEC (8.9K) + NEXTJS-ARCH-SPEC (22K) = 38K | ARCH-STRUCTURE-REF.md (~2K) always |
| Phase 2 arch load | Same 3 full specs conditional | ARCH-QUICK-REF.md (~4K) always |
| Full arch specs | Loaded per-run | Reference-only — load only for deep design questions |

**New files created:**
- `spec/architecture/ARCH-STRUCTURE-REF.md` — Phase 1 only. Route group map, feature module map (11 modules), tech stack locked choices, component layers, auth tier structure, key pattern summaries. ~130 lines, ~2K tokens.
- `spec/architecture/ARCH-QUICK-REF.md` — Phase 2 only. All 12 locked AD-001–AD-012 decisions, rendering rules, routing enforcement rules, module/import rules, 3 data fetching patterns, state rules, auth/security rules, API client rules. ~160 lines, ~4K tokens.

**Files updated:**
- `spec/AGENTS.md` — Phase 1 read order: ARCH-DECISIONS.md + ARCH-STRUCTURE-REF.md always, full arch specs reference-only. Phase 2 read order: ARCH-QUICK-REF.md always, full arch specs reference-only.
- `spec/workflows/lld/LLD-STAGE.md` — Input contract updated: replaced 3 full arch spec entries with ARCH-DECISIONS.md + ARCH-STRUCTURE-REF.md. LLD Creation Step updated.
- `spec/workflows/implementation/IMPLEMENTATION-STAGE.md` — Process steps updated: ARCH-QUICK-REF.md read at step 2.

**What did NOT change:** Full arch specs untouched and remain authoritative. ARCH-STRUCTURE-REF and ARCH-QUICK-REF contain extracted content — no new decisions invented.

**Token impact (Phase 1 LLD stage):**

| Item | Before | After |
|------|--------|-------|
| Arch context | ~38K (3 full specs) | ~2K (ARCH-STRUCTURE-REF) |
| Stage file | ~9.3K | ~9K (minor edit) |
| AGENTS.md + shared | ~19K | ~19K (unchanged this pass) |
| **Stage total** | **~66K** | **~30K** |

---

## Change 4 — 2026-06-25: Genericity Fixes + Content Cuts

**Type:** Genericity enforcement + content cuts (no behavior change for correct workflow usage)

**Goal:** Make all governance/workflow files reusable for any frontend project (React, Angular, Vue, etc.) — no project-specific hardcoded file paths in generic stage files. Cut remaining high-token files to reach ~30K total per phase target.

### Genericity Fixes — Stage Files

All hardcoded project-specific file paths removed from stage files. Stage files now reference roles; `spec/AGENTS.md` Read Orders carry the actual project file paths.

| File | What Changed |
|------|-------------|
| `spec/workflows/lld/LLD-STAGE.md` | Input contract + process steps + done conditions: specific arch filenames → role descriptions (`project routing architecture`, `project module architecture`, `project rendering and data architecture`). Cross-refs: stale archived files → `SHARED-POLICIES.md`. |
| `spec/workflows/decomposition/DECOMPOSITION-STAGE.md` | Input contract items 6–8 + Architecture Application Rules + task field: specific arch file paths → generic roles. Cross-refs: stale archived files → `SHARED-POLICIES.md`. |
| `spec/workflows/implementation/IMPLEMENTATION-STAGE.md` | Process step 2: hardcoded `ARCH-QUICK-REF.md` → "the project architecture implementation reference (see Phase 2 Read Order in spec/AGENTS.md)". Implementation Rules: 4 specific rule file names → `follow the always-load and conditional implementation rules as defined in src-code/AGENTS.md`. |
| `spec/workflows/validation/VALIDATION-STAGE.md` | Input contract + process steps + review checklist + done conditions: specific arch filenames → role descriptions. Cross-refs at bottom: stale archived files + dead workflow names → `SHARED-POLICIES.md` + current stage file names. |

**Principle established:** Stage files = generic workflow mechanics (role descriptions). `spec/AGENTS.md` Read Orders = project configuration (specific file paths). Reusing this system for a new project requires only updating `spec/AGENTS.md` Read Orders and `spec/architecture/` files — no stage file edits needed.

### Content Cuts

| File | Before | After | Tokens saved |
|------|--------|-------|-------------|
| `spec/nfr/NFR-SUMMARY.md` | 166 lines (~6K tokens) | ~130 lines (~3.25K tokens) | ~2.75K |
| `spec/WORKFLOW-OVERVIEW.md` | 616 lines (~4.4K tokens) | ~115 lines (~1.2K tokens) | ~3.2K |
| `spec/AGENTS.md` | 475 lines (~4K tokens) | ~280 lines (~2.3K tokens) | ~1.7K |
| `spec/workflows/shared/SHARED-POLICIES.md` | 1430 lines (~9.5K tokens) | ~300 lines (~2.5K tokens) | ~7K |

**Total tokens saved this change:** ~14.65K

### NFR-SUMMARY.md Fixes

Resolved 10+ conflicts with locked architectural decisions (AD-001 to AD-012):

- Removed: Ant Design references (violates AD-004 — shadcn/ui locked)
- Removed: `useMutation` references (violates AD-003/AD-005 — Server Actions + TanStack Query locked)
- Removed: `socket.io-client` references (architecture uses SSE, not socket.io)
- Removed: route guard component refs (violates AD-002 — proxy.ts only for auth)
- Fixed: all wrong `src/` path prefixes (project has no `src/` folder — uses `components/`, `features/`, `lib/` at root)
- Updated: shadcn/ui Skeleton (not Ant Design), proxy.ts enforcement (not route guards), Server Actions error handling (not useMutation)

### AGENTS.md Cuts

- Removed: "What Counts As Workflow Foundation Complete" section
- Compressed: "Repository Intent" (20 lines → 2 lines)
- Replaced: "Architecture References" section with generic 4-line pointer
- Compressed: "Required Workflow Behavior" stage list (63 lines → 9 one-liners)
- Removed: "Small-Unit Documentation Rule", "Specificity Standard"
- Compressed: "NFR Rule" (28 lines → 2 lines)
- Replaced: "Implementation Rules For Frontend Work" (20 lines → 2 lines)
- Compressed: "Traceability Rules" (32 lines → 5 lines)

### SHARED-POLICIES.md Cut

Removed all "Why This Exists" rationale sections, verbose narrative explanations, redundant examples, interaction/role-split subsections, duration estimation tables, and verbose handoff quality/failure examples. Kept: all rules, state definitions, schema tables, critical human-approval rule, minimal handoff template, conflict trigger table.

### Updated Token Load Estimates (Post Change 4)

| Stage | Estimated Total |
|-------|----------------|
| Phase 1 LLD | AGENTS(2.3K) + WORKFLOW-OVERVIEW(1.2K) + LLD-STAGE(~8K) + ARCH-DECISIONS(~2K) + ARCH-STRUCTURE-REF(2K) + NFR(3.25K) + SHARED-POLICIES(2.5K) = **~21K** |
| Phase 1 Decomp | AGENTS(2.3K) + WORKFLOW-OVERVIEW(1.2K) + DECOMP-STAGE(~10K) + ARCH-STRUCTURE-REF(2K) + NFR(3.25K) + SHARED-POLICIES(2.5K) = **~21K** |
| Phase 2 Impl | init(1.7K) + AGENTS(2.3K) + IMPL-STAGE(1.3K) + ARCH-QUICK-REF(4K) + src-code/AGENTS(0.3K) + INFRA-RULES(1.4K) + NFR(3.25K) + SHARED-POLICIES(2.5K) = **~17K** + conditional rules |
| Phase 2 Testing | AGENTS(2.3K) + TEST-STAGE(~1.5K) + ARCH-QUICK-REF(4K) + QUALITY-TEST-RULES(~5K) = **~13K** |
| Phase 2 Validation | AGENTS(2.3K) + WORKFLOW-OVERVIEW(1.2K) + VALIDATION-STAGE(~8K) + ARCH-QUICK-REF(4K) + NFR(3.25K) = **~19K** |
| **Phase 1 total** (LLD + Decomp) | **~42K** — DECOMP-STAGE still ~10K, needs cut to reach 30K |
| **Phase 2 total** (Impl + Testing + Validation) | **~49K** with conditional rules — VALIDATION-STAGE needs cut |

**Remaining above target:** DECOMP-STAGE (~10K, target ~6K) and VALIDATION-STAGE (~8K, target ~5K).

---

## Change 4 — Addendum: Stage File Compression (same session)

After token load estimates, all major stage files were compressed further.

### Final Line Counts

| File | Before | After | Tokens (est.) |
|------|--------|-------|--------------|
| LLD-STAGE.md | 670 lines | 243 lines | ~2K |
| DECOMPOSITION-STAGE.md | 1194 lines | 236 lines | ~2K |
| VALIDATION-STAGE.md | 835 lines | 198 lines | ~1.7K |
| IMPLEMENTATION-STAGE.md | 141 lines | 140 lines | ~1.1K |
| SHARED-POLICIES.md | 1430 lines | 255 lines | ~2.4K |
| AGENTS.md | 475 lines | 280 lines | ~2.7K |
| WORKFLOW-OVERVIEW.md | 616 lines | 153 lines | ~1.3K |
| NFR-SUMMARY.md | 166 lines | 122 lines | ~1.2K |

Compression strategy: review checklists → table format; done criteria → numbered list; revision rules → 3–5 lines; verbose narrative → removed. All rules, check items, and hard stops preserved.

### Final Per-Stage Token Estimates

| Stage Run | Components | Total |
|-----------|-----------|-------|
| Phase 1 LLD | AGENTS(2.7K) + WORKFLOW-OVERVIEW(1.3K) + LLD-STAGE(2K) + ARCH-DECISIONS(~2K) + ARCH-STRUCTURE-REF(2K) + NFR(1.2K) + SHARED-POLICIES(2.4K) | **~13.6K** |
| Phase 1 Decomp | AGENTS(2.7K) + WORKFLOW-OVERVIEW(1.3K) + DECOMP-STAGE(2K) + ARCH-STRUCTURE-REF(2K) + NFR(1.2K) + SHARED-POLICIES(2.4K) | **~11.6K** |
| **Phase 1 combined** | | **~25K** ✅ |
| Phase 2 Impl | init(1.7K) + AGENTS(2.7K) + IMPL-STAGE(1.1K) + ARCH-QUICK-REF(4K) + src-code/AGENTS(0.3K) + INFRA-RULES(1.4K) + NFR(1.2K) + SHARED-POLICIES(2.4K) | **~15K** + conditional |
| Phase 2 Testing | AGENTS(2.7K) + TEST-STAGE(~1.5K) + ARCH-QUICK-REF(4K) + QUALITY-TEST-RULES(~5K) | **~13K** |
| Phase 2 Validation | AGENTS(2.7K) + WORKFLOW-OVERVIEW(1.3K) + VALIDATION-STAGE(1.7K) + ARCH-QUICK-REF(4K) + NFR(1.2K) + SHARED-POLICIES(2.4K) | **~13K** |
| **Phase 2 combined** | | **~41K** (sum of 3 separate runs) |

Phase 1 combined is well under the 30K target. Phase 2 individual runs are all under 16K each — well within agent context limits. Phase 2 combined sum (41K across 3 separate runs) exceeds the 30K combined target, but each individual run is practical and lean.

---

## Change 5 — 2026-06-25: Read Order Trimming + NFR Dedup

**Type:** Read order surgery + content cut (no behavior change)

**Goal:** Remove overhead files from every Phase 1 and Phase 2 run. `WORKFLOW-OVERVIEW.md` and `SHARED-POLICIES.md` were loaded every stage despite containing mostly meta-information not needed during generation.

### What Was Removed from Read Orders

| File | Removed From | Tokens Saved/Stage |
|------|-------------|-------------------|
| `spec/WORKFLOW-OVERVIEW.md` (~1.3K) | Phase 1 (LLD + Decomp) and Phase 2 (Impl + Testing + Validation) | 1.3K |
| `spec/workflows/shared/SHARED-POLICIES.md` (~2.4K) | Phase 1 (LLD + Decomp) | 2.4K |

`SHARED-POLICIES.md` approval state definitions inlined directly into each stage's Entry Conditions section so stages remain self-contained. Not removed from Phase 2 stages (validation already referenced it).

### NFR Dedup

4 NFR rules removed from `spec/nfr/NFR-SUMMARY.md` — direct duplicates of locked architectural decisions already in ARCH-DECISIONS.md (AD-001–AD-012). Retaining both caused contradiction risk and token bloat.

### Files Changed

- `spec/AGENTS.md` — Phase 1 read order: removed WORKFLOW-OVERVIEW and SHARED-POLICIES. Phase 2 read order: removed WORKFLOW-OVERVIEW.
- `spec/workflows/lld/LLD-STAGE.md` — Entry Conditions: inlined approval state from SHARED-POLICIES. Removed SHARED-POLICIES from cross-refs.
- `spec/workflows/decomposition/DECOMPOSITION-STAGE.md` — same as LLD-STAGE.
- `spec/nfr/NFR-SUMMARY.md` — 4 duplicated rules removed.

### Token Impact

Post-Change-4-Addendum governance overhead (Phase 1 combined) was ~25K (LLD 13.6K + Decomp 11.6K). Change 5 removes 3.7K per stage × 2 stages = ~7.4K governance tokens.

| Phase | Before | After | Saved |
|-------|--------|-------|-------|
| Phase 1 LLD (governance) | ~13.6K | ~9.9K | ~3.7K |
| Phase 1 Decomp (governance) | ~11.6K | ~7.9K | ~3.7K |
| Phase 1 combined governance | ~25.2K | ~17.8K | ~7.4K |
| Phase 2 per stage (governance) | +1.3K overhead | 0 | ~1.3K/stage |

---

## Change 6 — 2026-06-25: Phase 2 Token Reduction (Three Levers)

**Type:** Session model change + input contract change + rule file split

**Goal:** Phase 2 accounts for ~93% of full-run token cost (7 tasks × 3 stages = 21 stage runs). Three independent levers each cut a distinct cost driver.

### Lever A — Phase 2 Session Chaining

**Problem:** 3 stages per task (Implementation → Testing → Validation) each reload the same 7 governance and architecture files. 2 unnecessary reloads per task cycle.

**Wasted per task:** 2 × (init 1.7K + AGENTS 3.0K + ARCH-QUICK-REF 2.4K + src-AGENTS 0.4K + NFR-SUMMARY 3.4K + INFRA-RULES 1.4K + task 0.7K) = **2 × 13.1K = 26.2K**

**Fix:** Added "Phase 2 Session Model" section to `spec/AGENTS.md` (after Phase 2 Read Order):

```
Run Implementation → Testing → Validation as one chained session per task.
Files loaded in Stage 3 (Implementation) remain in context for Stages 4 and 5.
Do not reload: init.md, AGENTS.md, ARCH-QUICK-REF.md, src-code/AGENTS.md,
NFR-SUMMARY.md, INFRA-RULES.md, or the approved task file.
Start fresh context only when moving to a different task.
```

**Files changed:** `spec/AGENTS.md` — ~8 lines added.  
**Saves:** ~25.7K/task. For 7 tasks: ~180K.

### Lever B — Validation Task-Anchor Model

**Problem:** `VALIDATION-STAGE.md` Input Contract listed Approved LLD (~4.5K) and business spec (~4.5K) as mandatory reads. Approved delivery task already carries `Source Requirement References` and `Source LLD References` fields — the spec and LLD were being re-read to verify fields that summarize them.

**Fix:** Rewrote VALIDATION-STAGE.md Input Contract. Delivery task promoted to primary traceability anchor. LLD and business spec demoted to reference-only:

> The approved delivery task is the traceability anchor. Validation checks that code and tests satisfy the task's fields. Load the full LLD or business spec only when a task field reference is ambiguous or the reviewer flags a discrepancy.

Also removed stale `WORKFLOW-OVERVIEW.md` from "Relationship To Other Documents" cross-refs in VALIDATION-STAGE.md.

**Files changed:** `spec/workflows/validation/VALIDATION-STAGE.md` — Input Contract section rewrite.  
**Saves:** ~9.0K/task. For 7 tasks: ~63K.

### Lever C — Rule File Granularity Split

**Problem:** `STATE-AND-DATA-RULES.md` (23,880 bytes / ~6K tokens) and `QUALITY-AND-TEST-RULES.md` (20,196 bytes / ~5K tokens) load in full even when a task only touches a subset.

**Fix:** Split each into 2 files. Old files replaced with redirect stubs.

| Old File | New Files | Load When |
|----------|-----------|-----------|
| `STATE-AND-DATA-RULES.md` | `STATE-RULES.md` (10,734 bytes / ~2.7K) | Zustand stores, auth state |
| | `DATA-RULES.md` (13,145 bytes / ~3.3K) | hooks, Server Actions, TanStack Query |
| `QUALITY-AND-TEST-RULES.md` | `TEST-CORE-RULES.md` (11,779 bytes / ~2.9K) | any test work (always for testing stage) |
| | `QUALITY-RULES.md` (8,242 bytes / ~2.1K) | form testing, error states, perf paths |

`src-code/AGENTS.md` routing table updated from 3 conditional rows to 5. Old files kept as redirect stubs (not deleted).

**Files changed:** `src-code/AGENTS.md` (routing table) + 4 new rule files + 2 redirect stubs.  
**Saves per task:** ~2–4K depending on task type. Auth tasks (AUTH-1602) load all sub-files — net neutral. Simpler tasks skip one or more sub-files.

### Combined Token Impact

Measured against AUTH-1602 (7-task OTP registration feature, all 5 stages):

| Stage | Pre-C6 / task | Post-C6 / task | Saved | −% |
|-------|-------------|---------------|-------|-----|
| Stage 3 Implementation | 22,386 | 22,611 | — | 0% |
| Stage 4 Testing | 21,568 | 8,728 | 12,840 | 60% |
| Stage 5 Validation | 29,564 | 4,920 | 24,644 | 83% |
| **Per-task total** | **73,518** | **36,259** | **37,259** | **51%** |

| Scope | Pre-C6 Input | Post-C6 Input | Saved |
|-------|-------------|--------------|-------|
| Phase 1 (once) | 38,271 | 38,229 | ~42 |
| Phase 2 × 7 tasks | 514,626 | 253,813 | 260,813 |
| **Full run** | **552,897** | **292,042** | **−260,855** |
| **Reduction** | | | **−47%** |

Stage 3 reads slightly more post-C6 (+225 tokens) because both Lever C sub-files load for auth tasks (combined ~6.0K vs old single file ~5.9K). All gains are Lever A (Stage 4 −60%) and Lever A+B combined (Stage 5 −83%).

Output tokens unchanged: ~53K for full 7-task run.

---

## Change 7 — 2026-06-26: Business-Flow-First Decomposition + Task Cohesion Rules

**Type:** Decomposition guidance update (no workflow mechanics change)

**Goal:** Cut Phase 2 input cost by reducing task count for new user stories. Per-task Phase 2 governance overhead is ~22.9K tokens (fixed). Every task eliminated saves 22.9K tokens in governance alone.

### Problem

Current decomposition splits by technical layer within one business flow:
- T2 = OpenAPI types only → T3 = Server Actions only → T4 = Hook only

These three have no standalone delivery value. They were created because the decomposer used a layered mental model ("types first, then actions, then hook") rather than a delivery mental model. Result: 7 tasks for AUTH-1602, each burning full Phase 2 governance overhead.

### Target Decomposition Model

| Before (7 tasks) | After (4 tasks) | Wave |
|-----------------|----------------|------|
| T1: Foundation | Task A: Foundation | 1 |
| T2: Types + T3: Server Actions + T4: Hook | Task B: Data Layer (merged) | 1 (parallel with A) |
| T5: Mobile Entry Form | Task C: Mobile Entry Step | 2 (after A+B) |
| T6: OTP Forms + T7: Page Wiring | Task D: OTP + Page | 2 (parallel with C) |

C and D are independent and run in parallel. Dependency chain: A+B (Wave 1) → C+D parallel (Wave 2).

**Where the hook (T4) goes:** A hook that wires one feature's server actions and manages multi-step flow state for that feature belongs in the Data Layer task — not a separate task, even if multiple UI step tasks consume it. It becomes its own task only when consumed across independent features or user stories.

### What Changed

**Single file:** `spec/workflows/decomposition/DECOMPOSITION-STAGE.md`

| Edit | Location | Change |
|------|----------|--------|
| 1 | Core Rule paragraph | Added: "Phase 2 token cost scales directly with task count — per-task governance overhead is fixed regardless of task size." |
| 2 | Process Step 2 | Replaced "Identify task seams from LLD sections" with business-flow-first reasoning (steps a–d) |
| 3 | When Not To Split | Expanded from 1 sentence to 5 bullet anti-patterns (data-layer split, types alone, styling alone, single-feature hook, sequential same-flow steps) |
| 4 | New section: Natural Task Shapes | 4 canonical shapes — Foundation, Data Layer, UI Step, Shared Utility — with inclusion lists and split conditions |
| 5 | Task Quality Signals table | Added 2 rows: "types/interfaces as standalone task" and "sequential steps of same data flow as separate tasks" |

### Token Impact

| | 7 tasks (Change 6) | 4 tasks (Change 7) | Δ |
|---|---|---|---|
| Phase 2 governance overhead | ~160K (7 × 22.9K) | ~92K (4 × 22.9K) | −68K |
| Phase 2 input total | ~254K | ~123K | −131K |
| Full-run input total | ~292K | ~161K | −45% |
| Grand total (input + output) | ~345K | ~208K | −40% |

---

## Change 8 — 2026-06-26: VALIDATION-STAGE.md Compression + Cross-Ref Removal

**Type:** Stage file compression + cross-reference cleanup

**Goal:** Cut Stage 5 per-task load. Two concerns addressed: (a) VALIDATION-STAGE.md Output Contract was verbose (42-line narrative with example table rows); (b) "Relationship To Other Documents" section listed 4 files (STAGE-CONTRACT, TRACEABILITY-RULES, SHARED-POLICIES, REVIEW-AND-REVISION-POLICY) that AI agents may read as implied cross-refs, adding up to 2K tokens at Stage 5.

### What Changed

**File:** `spec/workflows/validation/VALIDATION-STAGE.md`

| Edit | Change |
|------|--------|
| Output Contract | Replaced 9 verbose narrative sections with a 9-row compact table. Removed example table rows. 42 lines → 12 lines. |
| Checks To Perform | Replaced 7 bold-header paragraphs with 7 terse bullet lines. 18 lines → 8 lines. |
| Relationship To Other Documents | Section removed entirely. Eliminates cross-ref ghost loads at Stage 5. |

### NFR-SUMMARY.md Assessment

Inspected NFR-SUMMARY.md for Lever D (further trimming). File is already fully lean — 119 lines, zero rationale paragraphs, all numbered actionable rules. No cuts possible without removing valid constraints. Lever D not applied.

### Token Impact

| | Before | After | Saved |
|--|--------|-------|-------|
| VALIDATION-STAGE.md | 11,678 bytes (~2.92K tokens) | 10,083 bytes (~2.52K tokens) | ~0.40K |
| Ghost loads (if STAGE-CONTRACT etc. were loading) | ~2.0K | 0 | ~2.0K |
| **Stage 5 per-task total** | ~4.92K | ~2.52K (certain) to ~2.52K (if ghosts confirmed gone) | ~0.40–2.40K |
| **4 tasks total** | ~19.7K | ~10.1K–19.7K | ~1.6K–9.6K |

Conservative estimate (only file compression, no ghost load reduction): −1.6K from 208K → **~206K total**.
Full estimate (ghost loads confirmed): −9.6K → **~198K total**.

---

## Phase 1 Estimate Correction — Identified 2026-06-26

Token estimates in Changes 5–8 were based on incorrect file size assumptions. Actual measured file sizes:

| File | Estimated | Measured | Delta |
|------|----------|----------|-------|
| `spec/workflows/lld/LLD-STAGE.md` | ~2K | 4,071 tokens | +2,071 |
| `spec/workflows/decomposition/DECOMPOSITION-STAGE.md` | ~2K | 4,171 tokens | +2,171 |
| `spec/nfr/NFR-SUMMARY.md` | ~1.2K | 3,441 tokens | +2,241 |
| `spec/architecture/ARCH-DECISIONS.md` | ~2K | 2,915 tokens | +915 |
| `spec/AGENTS.md` | ~2.7K | 2,970 tokens | +270 |

Phase 1 combined actual: **~34,050 tokens** (vs ~17,800 estimated in CHANGE.md — delta +16,250).

Phase 2 estimates are accurate. Stage 3 calculated total (22,560) matches measured (22,611). ✓

**Corrected grand totals (Change 7 baseline):** ~227K (not ~208K as previously recorded). +16K from Phase 1 underestimate; Phase 2 was correct.

---

## Change 9 — 2026-06-26: Session-Chain Guard in TESTING-STAGE.md (Lever C)

**Type:** One-line addition to stage Entry Conditions

**Goal:** Prevent `ARCH-QUICK-REF.md` from being reloaded at Stage 4 (Testing) despite the session chain rule already in `spec/AGENTS.md`.

### Evidence

Stage 4 (Testing) measured = 8,728 tokens.
Known file loads: TESTING-STAGE.md (722) + TEST-CORE-RULES.md (2,945) + QUALITY-RULES.md (2,061) = **5,728 tokens**.
Gap = 3,000 tokens = ARCH-QUICK-REF.md (2,414) + ~586 prompt overhead. ✓

Root cause: `spec/AGENTS.md` Phase 2 Read Order instructs agents to always read `ARCH-QUICK-REF.md`. Agents following the Read Order at Stage 4 reload it, missing the session chain override. The override only lives in AGENTS.md; there is no local signal at Stage 4 entry.

### Fix

Added one bullet to Entry Conditions in `spec/workflows/testing/TESTING-STAGE.md`:

> **Session chain:** running as continuation from Stage 3 — `ARCH-QUICK-REF.md`, `AGENTS.md`, `NFR-SUMMARY.md`, `INFRA-RULES.md`, `init.md`, and the approved task file are already in context; do not reload them

Session chain constraint now visible at the Stage 4 entry point, not only in AGENTS.md.

### Token Impact

| | Before | After | Saved |
|--|--------|-------|-------|
| ARCH-QUICK-REF.md at Stage 4 | 2,414 tok/task | 0 | 2,414 |
| 4 tasks total | ~9,656 tokens | 0 | ~9,656 |
| Full-run input (post Ch8) | ~177K | ~167K | ~10K |
| Grand total (input + output) | ~227K | ~217K | ~10K |

---

## Change 10 — 2026-07-01: Drop Python Runtime Layer — Embed Agent Delta Sections

**Type:** Architecture replacement (no behavior change for correct workflow usage)

**Goal:** Eliminate all external tooling dependency. Previous approach used a Python generator (`tools/generate_runtime_specs.py`) to produce compressed copies of spec files into `spec-runtime/`. This required Python to be installed, a manual generation step before workflow runs, and a CI job to catch stale files. New approach: embed a `## Agent Delta` section directly at the top of each canonical spec file. Agent reads only that section — no separate files, no generation, no staleness possible.

### What Was Deleted

| Item | What It Was |
|------|------------|
| `tools/generate_runtime_specs.py` | Python generator — extracted sections from canonical files, wrote spec-runtime/ |
| `tools/run_runtime_guard.py` | Python preflight helper — checked freshness, printed read set |
| `tools/runtime_sync.py` | Python file watcher — polled canonical files, auto-regenerated on change |
| `tools/start_runtime_sync.ps1` | PowerShell launcher for background watcher |
| `tools/stop_runtime_sync.ps1` | PowerShell stopper for background watcher |
| `spec-runtime/` | Entire generated runtime layer (all RUNTIME.md files + manifest.json) |
| `.github/workflows/runtime-freshness.yml` | CI job that ran `--check` on every PR/push to main |

### What Was Added — Agent Delta Protocol

Every spec file that agents must read now has a `## Agent Delta` section immediately after its title. Convention encoded in `spec/AGENTS.md`: read only `## Agent Delta` from each required file; read full file only when the delta is insufficient for the current subtask.

| File | Delta content |
|------|--------------|
| `spec/AGENTS.md` | Read order (planning + execution), source of truth hierarchy, hard boundary rule, never-load list, handoff format |
| `spec/workflows/lld/LLD-STAGE.md` | Entry conditions, 2-step output contract, blocked conditions, done criteria |
| `spec/workflows/decomposition/DECOMPOSITION-STAGE.md` | Entry, 4 task shapes, default sizing rule, must-not list, done criteria |
| `spec/workflows/implementation/IMPLEMENTATION-STAGE.md` | Entry, blocked-if conditions, output fields, per-task arch checks, done criteria |
| `spec/workflows/testing/TESTING-STAGE.md` | Entry, session chain reminder, coverage requirements, must-not list, done criteria |
| `spec/workflows/validation/VALIDATION-STAGE.md` | Entry, output path + 9-section contract, blocked conditions, done criteria |
| `spec/nfr/NFR-SUMMARY.md` | 8 categories, 7 critical execution rules, when to apply |
| `spec/architecture/ARCH-STRUCTURE-REF.md` | Planning-only role, contents summary, key planning facts |
| `spec/architecture/ARCH-QUICK-REF.md` | Execution-only role, contents summary, blocked condition for missing OpenAPI spec |

### What Was Cleaned in spec/AGENTS.md

| Edit | What Changed |
|------|-------------|
| Removed "Generated Runtime Layer" section | Eliminated entire block including Auto-Sync Scope and watcher commands |
| Read Order — planning | Removed ` or spec-runtime/... if fresh` alternatives from all 5 entries |
| Read Order — execution | Removed ` or spec-runtime/... if fresh` alternatives from all 5 entries |
| Minimum context if limited | Replaced spec-runtime paths with canonical file paths + `(Agent Delta)` annotation |

### Why This Approach Is Better

| Concern | Python runtime layer | Agent Delta sections |
|---------|---------------------|---------------------|
| External dependency | Python 3.x required | None — spec/ folder only |
| Staleness risk | Generated files drift from canonical | Delta IS the canonical file — zero drift |
| Freshness enforcement | CI job + manual generation + watcher | Not applicable — no generated files |
| Token savings mechanism | Separate compressed files | Read named section only (~10–20 lines) |
| Decision 1 (freshness) | Requires generator + CI | Eliminated — not a problem anymore |
| Decision 3 (enforcement) | Wrapper script needed | AGENTS.md read rule — no script |

### Token Impact

Agent Delta sections are 10–15 lines each. Reading 6 deltas per stage run ≈ 80–100 lines total versus 700+ lines (full canonical reads). Token reduction per stage run: ~85–90% on governance reads.

Per-stage read set with Agent Delta protocol: `spec/AGENTS.md` (delta) + stage workflow doc (delta) + arch ref (delta) + NFR-SUMMARY (delta) + input spec or task file = ≈ 100–120 lines governance context. Full file reads triggered only when delta is insufficient for a specific question.

---

## Change 11 — 2026-07-02: Consistency Sweep — Dead References + Precedence Conflict Fixed

**Type:** Correctness fix (no consolidation, no new content — closes gaps left by Changes 1–10)

**Goal:** The Change 1 consolidation (granular files → `SHARED-POLICIES.md` / `*-STAGE.md` / sharded `TRACEABILITY.md`) updated the canonical stage files but missed a long tail of cross-references in command contracts, the traceability files themselves, and the non-Claude agent bootstrap files (`GEMINI.md`, `.github/copilot-instructions.md`, `.claude/commands/*.md`). Any agent following one of those dead references would try to read a file that no longer exists. Separately, `spec/AGENTS.md` and `spec/SPEC-HIERARCHY.md` stated two different, contradictory precedence orders for NFR vs. LLD/task.

### Precedence Fix

`spec/AGENTS.md`'s condensed Agent Delta line ranked NFR below delivery task; `spec/SPEC-HIERARCHY.md`'s full Global Precedence Order ranks NFR above LLD/task (position 3 of 10) and its own §NFR Relationship text says "NFRs sit above LLD and tasks." Resolved in favor of `SPEC-HIERARCHY.md` — `AGENTS.md` updated to match, and its duplicate 8-item hierarchy list replaced with a pointer to `SPEC-HIERARCHY.md` so the two can't drift apart again.

### Dead References Fixed

| Old (dead) reference | Resolved to | Files affected |
|---|---|---|
| `spec/workflows/shared/APPROVAL-STATE-MODEL.md`, `HANDOFF-FORMAT.md`, `DONE-CRITERIA-RULES.md`, `METRICS-RULES.md`, `CONFLICT-DECISIONS-RULES.md` | `spec/workflows/shared/SHARED-POLICIES.md` | `run-workflow.md`, `validate.md`, `lld-creation.md`, `decompose.md`, `task-to-code.md`, `scaffold.md`, `code-to-unit-tests.md`, `spec/traceability/TRACEABILITY.md`, `spec/workflows/shared/TRACEABILITY-RULES.md`, `SPEC-FOLDER-STRUCTURE.md` tree diagram, `GEMINI.md`, `.github/copilot-instructions.md` |
| `spec/workflows/testing/CODE-TO-UNIT-TESTS-WORKFLOW.md`, `TEST-INPUT-CONTRACT.md`, `TEST-OUTPUT-CONTRACT.md` | `spec/workflows/testing/TESTING-STAGE.md` | `commands/code-to-unit-tests.md`, `commands/validate.md`, `.claude/commands/code-to-unit-tests.md` |
| `spec/workflows/implementation/IMPLEMENTATION-INPUT-CONTRACT.md`, `IMPLEMENTATION-OUTPUT-CONTRACT.md`, `IMPLEMENTATION-REVIEW-CHECKLIST.md`, `IMPLEMENTATION-DONE-CRITERIA.md`, `TASK-TO-CODE-WORKFLOW.md` | `spec/workflows/implementation/IMPLEMENTATION-STAGE.md` | `commands/validate.md`, `.claude/commands/task-to-code.md` |
| `spec/architecture/ROUTING-SPEC 1.md`, `MODULE-ARCH-SPEC 1.md`, `NEXTJS-ARCH-SPEC 1.md` (stale, pre-dates `ARCH-DECISIONS.md` convention) | `spec/architecture/ARCH-DECISIONS.md` + `spec/ARCHITECTURE-REFERENCES.md` | `spec/init.md`, `commands/validate.md` |
| `spec/traceability/BUSINESS-TO-LLD.md`, `LLD-TO-TASKS.md`, `TASKS-TO-CODE.md`, `CODE-TO-TESTS.md` (pre-Change-1 split model) | `spec/traceability/<mirrored-business-path>/TRACEABILITY.md` (sharded per story) | `.claude/commands/lld-creation.md`, `decompose.md`, `task-to-code.md`; `.github/copilot-instructions.md` |
| `spec/progress/tasks/TASK-{id}/`, `spec/progress/execution/`, `spec/progress/tasks/` (wrong folder names) | `spec/progress/validation/<mirrored business path>/TASK-{id}/`; `spec/progress/task/`, `implementation/`, `testing/`, `validation/` | `.claude/commands/validate.md`, `GEMINI.md` |
| `spec/workflows/intake/INTAKE-WORKFLOW.md` + 5 siblings, and per-file lists for decomposition/implementation/testing/validation (never-created, pre-Change-1 granularity) | Corrected to name the actual consolidated files (`LLD-STAGE.md` covers Intake; one `*-STAGE.md` per other stage) | `SPEC-FOLDER-STRUCTURE.md` §Full Authoritative Document List |
| `spec/rules/DATA-FETCHING-RULES.md` RULE-FETCH-013, `spec/nfr/SECURITY-NFR.md` (named files that don't exist — `spec/rules/` is empty in this boilerplate, `spec/nfr/` is one consolidated `NFR-SUMMARY.md`) | Reworded to point at `spec/rules/` (once populated) and `NFR-SUMMARY.md`'s Security category | `GEMINI.md`, `.github/copilot-instructions.md` |

### Other Corrections

- `spec/README.md` — stale "execution not yet enabled beyond task creation" line rewritten; the full Stage 1–11 pipeline has been active since Change 1.
- `SPEC-FOLDER-STRUCTURE.md` — "Already Created" claim corrected: it asserted `spec/rules/` and `spec/skills/` were complete; they don't exist yet (correctly empty — populated per-project).
- `spec/LLD-SDD-Template.md` — status line widened from the 3-state `draft → in-review → approved` to the real 6-state model in `REVIEW-AND-REVISION-POLICY.md`.
- `commands/validate.md` — added a line documenting that `/validate`'s 2-outcome model (`done`/`blocked`, no `revise`) is intentional: it's read-only, so a gap routes back to the owning stage's own gate instead.
- `commands/decompose.md` vs root `README.md` — signature mismatch fixed; `README.md` now shows `/decompose <lld-file>` matching the actual contract.
- `TESTING-STAGE.md` — "continuation from Stage 3" reworded to name the actual prior steps (Task-To-Code / Implementation Review), since global Stage 3 is the LLD review gate, not testing's own predecessor.
- `spec/init.md` — missing `spec/` path prefixes fixed; dead `§Workflow Entry Rule` anchor (section never existed in `WORKFLOW-OVERVIEW.md`) replaced with a reference to its actual §Exit Conditions / §Review Gates sections.

### What Did NOT Change

- No file consolidation, no content cuts, no new governance rules — pure reference correction plus the one precedence decision above.
- `spec/commands/decompose.md`, `spec/workflows/shared/SHARED-POLICIES.md`, `spec/SPEC-HIERARCHY.md` — confirmed already correct, untouched.
- `spec/rules/`, `spec/skills/` — still intentionally empty; not created by this change.

### Version

`spec/SPEC-VERSION.md` bumped `current: 7` → `8` (`last_updated: 2026-07-02`) — full list of touched files in `changed_files`.

---

## Change 12 — 2026-07-07: Frontend/Backend Merge — Full-Stack Workflow

**Type:** Structural merge (two boilerplates → one)

**Goal:** This repo previously ran two independent, near-identical SDD boilerplates side by side — `SDD-Custom` (frontend) and `SDD-Custom-Backend` (backend) — each with its own business specs, LLDs, tasks, and code root. A developer working a full-stack story had to run two disconnected workflows. This change merges them into one tree so a single business spec is fed once and a full-stack developer implements both layers of the same story end to end.

### What Changed

- **LLD Creation** now produces two linked artifacts per story from one shared intake pass: `spec/lld/<module>/LLD-FE-<STORY-ID>.md` and `LLD-BE-<STORY-ID>.md`, each citing the same requirement IDs and carrying a "Companion LLD Reference" section naming its pair. Both are reviewed together as one logical LLD Review Gate. The existing LLD-vs-LLD conflict hard-stop is extended to also catch same-story FE/BE contract mismatches.
- **Decomposition** (`/decompose <lld-fe-file> <lld-be-file>`) now reads both approved LLDs together (so cross-layer task dependencies can be expressed via the existing `Dependencies` field) and emits tasks tagged both by filename (`TASK-<STORY-ID>-FE-T<n>.md` / `-BE-T<n>.md`) and by a mandatory `Layer: frontend|backend` metadata field — belt-and-suspenders so a filename typo can't silently misroute execution.
- **Two independent code roots** replace the single `src-code/`: `src-code-frontend/` and `src-code-backend/`, each scaffolded independently (`/scaffold frontend` / `/scaffold backend`) per its own half of `spec/architecture/ARCH-DECISIONS.md` (`AD-FE-*` / `AD-BE-*` / `AD-X-*` cross-cutting decisions).
- **Integration testing** (adopted from `SDD-Custom-Backend`, which had it and frontend didn't) stays **backend-only** — a per-task branch, not per-story: backend-tagged tasks go through Integration Testing (stage 10) and its review gate (stage 11) before Final Validation; frontend-tagged tasks skip straight from the Testing Review Gate (stage 9) to Final Validation (stage 12). `/validate` accordingly checks a 4-link chain (req→LLD→task→code→test) for frontend and a 5-link chain (adds unit-test→integration-test) for backend.
- **NFR-SUMMARY.md** (`spec/architecture/NFR-SUMMARY.md`) merged both flavors: 6 of 8 categories are shared with FE/BE sub-bullets (Performance, Reusability, Security, Compliance, Testability, Observability, Reliability); `Accessibility` stays frontend-only, `API Consistency` stays backend-only — no forced parallel section for either.
- **Traceability** stays one shard per story (`spec/traceability/<module>/<STORY-ID>/TRACEABILITY.md`, not two), gaining a `Layer` column as its first data column so both chains are visible together. A frontend row's integration-test column reads `n/a (frontend task)` — never blank.
- **Progress** mirroring forks at the LLD stage, not intake: `## Intake` stays one shared section (layer-agnostic requirement IDs); from `## LLD` onward, records split per layer; task headings (`## Task: TASK-<STORY-ID>-FE-T<n>` / `-BE-T<n>`) carry the fork from Decomposition onward.
- `spec/rules/` and `spec/skills/` (still empty in this boilerplate) will split into `frontend/`, `backend/`, `shared/` subfolders once a project populates them.
- `spec/traceability/shared/SCAFFOLD/` split into `SCAFFOLD-FE/` and `SCAFFOLD-BE/` (independent scaffold runs, independent status) — `.gitignore`'s traceability exception updated to `!spec/traceability/shared/` to cover both.
- `SDD-Custom-Backend/.claude/commands/integration-tests.md`, `spec/commands/integration-tests.md`, `spec/workflows/integration-testing/{INTEGRATION-TESTING-STAGE.md,README.md}` were `git mv`'d into `SDD-Custom` to preserve history (the only content genuinely unique to the backend tree).
- All root bootstrap docs (`README.md`, `CLAUDE.md`, `AGENTS.md`, `GEMINI.md`, `.github/copilot-instructions.md`), spec governance docs, all 8 command contracts, all workflow stage docs, and `spec/dashboard/dashboard.html` (added a `Layer` column/filter) updated for the dual-layer model.

### What Did NOT Change

- The per-story-file convention already in place for `spec/lld/`, `spec/delivery/`, and `spec/progress/` (module-mirrored, no per-stage subfolder tree) — this merge layers the FE/BE split on top of that existing convention, it does not reintroduce the older per-stage-folder model.
- `spec/architecture/NFR-SUMMARY.md`'s status as an optional, not-mandatory gate.
- The Agent Delta protocol — every canonical file's delta section was updated in place to reflect dual-layer behavior, never dropped.

### Removed

- `SDD-Custom-Backend/` — retired in full once this merge was verified consistent (dead-reference sweep, `diff -rq` inventory cross-check, precedence-drift re-check per Change 11's precedent).

### Version

`spec/SPEC-VERSION.md` bumped `current: 8` → `9` (`last_updated: 2026-07-07`) — full list of touched files in `changed_files`.

---

## Change 14 — 2026-07-07: Decomposition Sizing/Ordering Clarification

**Type:** Wording clarification (no behavior change to what tasks look like — clarifies two rules that read ambiguously after Change 12's FE/BE merge)

**Goal:** Two questions came up about how decomposition should behave now that every task carries a mandatory `Layer` field: (1) should backend tasks always be created/ordered before frontend tasks, or should there be one combined task per view spanning both layers instead of split FE/BE tasks; (2) does the pre-existing sizing rule "do not split by technical layer within one flow" argue against the mandatory FE/BE task split. Decision on (1): keep tasks split by `Layer` — combining would break `/task-to-code`'s code-root selection, `/validate`'s 4-link/5-link chain, `/integration-tests`'s backend-only gate, and independent per-layer review gates, none of which have a meaningful single-task equivalent. Ordering should be dependency-driven via the existing `Dependencies` field, not a blanket layer-priority rule — not every frontend task depends on a backend task. On (2): the rule already meant within-codebase architectural layers (types/actions/hook-store on frontend, types/repository/service on backend, per `DECOMPOSITION-STAGE.md`'s existing "Frontend/Backend Task Shapes" and "do not split by layer (types task → actions task → hook/store task)" examples) — but the compressed Agent Delta line didn't say so explicitly, and Agent Delta is what gets read by default.

### What Changed

- `spec/workflows/decomposition/DECOMPOSITION-STAGE.md` — Agent Delta's "Default sizing" line now explicitly scopes "technical layer" to within-codebase layers and states the mandatory FE/BE `Layer` split is not what it prohibits; added a "Task ordering" line to the Agent Delta stating ordering is dependency-driven only, no blanket "all backend before all frontend"; Process Steps step 4 gained the same clarification inline.
- `spec/commands/decompose.md` — Expected Behavior step 6 and the Exit Behavior execution-order line both gained the dependency-driven-ordering clarification.
- `spec/commands/run-workflow.md` — Stage 4 description gained the same one-line clarification, kept consistent with the two files above (no restatement drift, per the discipline established in Change 11).

### What Did NOT Change

- No task field, filename convention, or Layer-branching mechanism changed — this is a documentation clarification, not a schema or behavior change.
- Combined single-task-per-view was considered and rejected — not implemented.

### Version

`spec/SPEC-VERSION.md` bumped `current: 9` → `10` (`last_updated: 2026-07-07`) — full list of touched files in `changed_files`.

---

## Change 15 — 2026-07-07: API Contract Convention (contracts/<module>/<module>.yaml)

**Type:** New convention + conflict fix (formalizes an existing loose reference, fixes a rule left inconsistent by Change 12)

**Goal:** `contracts/<module>/` was already mentioned informally in root `README.md` ("API Spec Ref" field, hard-stop on conflict) but never had a canonical location, a decided file granularity, or a rule for what happens when a contract doesn't exist yet for a brand-new API operation. Separately, `IMPLEMENTATION-STAGE.md` (written during the Change 12 merge) required an OpenAPI spec to pre-exist for every endpoint and blocked otherwise — a rule that assumed contract-first development and was never reconciled with how this workflow actually authors contracts.

### What Changed

- **Location and granularity:** `contracts/<module>/<module>.yaml` — one top-level, cross-cutting location, sibling to `spec/`, `src-code-frontend/`, `src-code-backend/`. One growing file per module (not per story) — new operations are appended to the module's existing file, avoiding the reconciliation problem a per-story file would create.
- **Authoring flow:** the contract does not pre-exist for a brand-new operation. `LLD-BE-<id>.md` §5's touchpoint table is the binding draft shape (already cross-checked against `LLD-FE-<id>.md` by the existing Companion LLD Alignment hard-stop). Backend `/task-to-code` writes or updates `contracts/<module>/<module>.yaml` to match it, as part of that task's own implementation output — not a precondition for starting the task. Frontend tasks read the real file once their backend dependency has landed, or the LLD's touchpoint table as an interim mock shape before that, with a reconciliation check once the dependency resolves.
- **Fixed conflict:** `IMPLEMENTATION-STAGE.md`'s Agent Delta, Entry Conditions, Output Contract, Process Steps, and Review Checklist previously said an OpenAPI spec missing for any endpoint blocks the task outright. Reworded throughout: a task is blocked only if an operation has *no* design-time authority at all — neither a real contract entry nor an approved LLD touchpoint entry.
- **LLD stage:** the pre-existing "API Contract vs Business Spec conflict" hard-stop in `LLD-STAGE.md` now explicitly scopes to the case where a contract *already exists* (an established endpoint being modified) — for brand-new operations there is nothing to conflict with yet, and the binding shape is the companion-checked LLD pair.
- **Validation:** `VALIDATION-STAGE.md` and `validate.md` gained a contract-conformance check — backend tasks touching a new/changed operation must show the contract file matches the LLD-BE touchpoint table; frontend tasks with a since-resolved cross-layer dependency must show reconciliation against the real file.
- `spec/architecture/README.md` and `spec/ARCHITECTURE-REFERENCES.md` note the contract convention as an `AD-X-*` cross-cutting decision — reference-only, no codegen wired into `/scaffold` by default.
- Root `README.md`'s Repository Structure diagram gained the `contracts/` entry — and, in the same pass, three unrelated staleness bugs in that same diagram were fixed: it still showed a separate `spec/nfr/` folder (NFR lives under `spec/architecture/` since before Change 12), `spec/lld/` and `spec/delivery/` without module-mirroring, and `spec/progress/` as a per-stage-subfolder tree instead of the one-file-per-story convention established elsewhere in the same document. These were missed by Change 12's reconciliation pass because they sit inside a code-fenced diagram, not matched by the prose greps used at the time.

### What Did NOT Change

- No codegen wired into `/scaffold` — contract stays a reference-only artifact for now, per explicit choice.
- No change to `spec/delivery/`, `spec/progress/`, `spec/traceability/`, or `spec/lld/` conventions themselves — only the stale README diagram describing them was corrected to match what was already true.

### Version

`spec/SPEC-VERSION.md` bumped `current: 10` → `11` (`last_updated: 2026-07-07`) — full list of touched files in `changed_files`. Also fixed a bug in v10's own bump: an incomplete find-replace had left v9's entire `changed_files` list appended after v10's 3 real files — corrected to v11's own accurate list.

---

## Change 16 — 2026-07-07: Remove spec/rules and spec/skills — src-code-<layer>/ Is the Sole Location

**Type:** Structural de-duplication (removes a concept, no new behavior)

**Goal:** `spec/rules/{frontend,backend,shared}/` and `spec/skills/{frontend,backend,shared}/` were documented as a spec-side planning mirror of the real content in `src-code-<layer>/rules/` — "just doubled per root" (`SPEC-FOLDER-STRUCTURE.md`, pre-Change-16). Change 2 introduced `src-code-<layer>/rules/` as the real location; a later pass added the spec-side copy on top without a stated reason two copies were needed. The copies had already drifted: `spec/AGENTS.md` routed rule-loading straight to `src-code-<layer>/rules/`, while `task-to-code.md` still routed to the spec-side copy. This change removes the spec-side folders as a concept entirely — `src-code-<layer>/rules/` and `src-code-<layer>/skills/` are now the only location.

### What Changed

- `spec/rules/` and `spec/skills/` no longer appear anywhere as folders "to be created" — dropped from `SPEC-FOLDER-STRUCTURE.md`'s Core Rule, canonical tree, Current State note, Active Now list, and Full Authoritative Document List; a pointer to `src-code-<layer>/rules/` + `src-code-<layer>/skills/` added in their place.
- `task-to-code.md` (the real routing fix) and `run-workflow.md` now route rule-loading to `src-code-frontend/rules/` / `src-code-backend/rules/` directly, matching `spec/AGENTS.md`'s existing routing.
- `.github/copilot-instructions.md` and `GEMINI.md` (root bootstrap docs) now point their data-fetching/data-access rule references at `src-code-<layer>/rules/`.
- `.claude/commands/code-to-unit-tests.md` and `integration-tests.md` (non-canonical stubs — the only two places skills were ever referenced) now point their test-creation-convention line at `src-code-<layer>/skills/`.
- `/scaffold` (`scaffold.md`) now creates empty `rules/`, `rules/shared/`, `skills/`, `skills/shared/` subfolders inside `src-code-<layer>/` as part of its existing folder-structure step, giving both a concrete creation point.
- Root `README.md` §Before You Start steps 5-6 and Quick Reference rows now point at `src-code-<layer>/rules/` / `skills/`, timed to "any time after that layer's `/scaffold` runs" rather than strict pre-planning setup, since the code root doesn't exist before that.

### What Did NOT Change

- `spec/AGENTS.md` — already routed to `src-code-<layer>/rules/` directly; no edit needed, and its phrasing is the pattern the other files now mirror.
- Skills are still not wired into `task-to-code.md` or any canonical `spec/commands/*.md` contract — only the two `.claude/commands/` stubs reference skills at all, unchanged in scope, just relocated.
- No change to the FE/BE task split, `Layer` routing, or any non-rules/skills folder.

### Version

`spec/SPEC-VERSION.md` bumped `current: 11` → `12` (`last_updated: 2026-07-07`).

---

## Change 17 — 2026-07-07: .gitignore Is Boilerplate-Only — Document The Prune Step

**Type:** Documentation/warning fix (no functional change to what's ignored today)

**Goal:** `.gitignore` ignores everything under `spec/business/`, `spec/delivery/`, `spec/lld/`, `spec/traceability/` (partially), and `spec/progress/` except each folder's `README.md`, plus fully ignores `src-code-frontend/` and `src-code-backend/`. Correct for this boilerplate as shipped — nothing real exists yet — but a landmine for real project use: once a team drops in a real business spec, generates a real LLD, decomposes real tasks, writes real progress records, or scaffolds real source code, none of it would be tracked by git. It would simply never appear in `git status`, silently excluded, until someone notices.

### What Changed

- `.gitignore` gained a header comment block naming itself as boilerplate-only and listing exactly which lines to delete or narrow before real project work begins.
- Root `README.md` §Before You Start gained step 10: prune `.gitignore` — delete the `src-code-frontend/`/`src-code-backend/` lines once `/scaffold` has produced real code (step 3), and delete or narrow the `spec/business/*`/`spec/delivery/*`/`spec/lld/*`/`spec/traceability/*`/`spec/progress/*` blocks once real spec content exists (step 7 onward).
- Quick Start gained a cross-reference: do step 10 before the first real commit, not just during initial setup, since that's the point real content actually starts landing.

### What Did NOT Change

- No `.gitignore` rule was removed or narrowed — the boilerplate's shipped state stays exactly as clean as it is today.
- No script, hook, or CI check added to enforce the pruning — matches this repo's established preference for explicit written rules over generated/automated enforcement (see Change 10's rationale for dropping the Python runtime layer).

### Version

`spec/SPEC-VERSION.md` bumped `current: 12` → `13` (`last_updated: 2026-07-07`).

---

## Change 18 — 2026-07-07: .gitignore Prune Step Moved To Step 1

**Type:** Reordering (no new content)

**Goal:** Change 17 added the `.gitignore` prune step as step 10 (last) in "Before You Start." User asked for it as step 1 — read first, before anything else, even though most of its content only becomes actionable once later steps (scaffold, first business spec) produce real content to prune around.

### What Changed

- `.gitignore` prune step is now step 1 in root `README.md`'s "Before You Start" table; all other steps shifted down by one (old step 1 → 2, ... old step 9 → 10).
- Every internal cross-reference to a step number ("do step 9 below", "Step 4 (NFR)", etc.) updated to match the new numbering.
- Quick Start's cross-reference updated from "step 10" to "step 1".

### What Did NOT Change

- No content change to any step's instructions — pure reordering and renumbering.

### Version

`spec/SPEC-VERSION.md` bumped `current: 13` → `14` (`last_updated: 2026-07-07`).

---

## Change 19 — 2026-07-15: Change Request (CR) Support + Optional Swagger Sync

**Type:** Two new features, landed together (one combined version bump)

**Goal:** (1) Add `/change-request` as an alternate planning entry for an already-approved story, with a bidirectional story-dependency ledger and an atomic, auto-cascading apply to every forward-reachable dependent — cross-story conflicts were previously only ever discovered reactively. (2) Add `/sync-contract` as an optional, human-triggered convenience layered on the existing `contracts/<module>/<module>.yaml` convention (Change 15) for projects with a live Swagger/OpenAPI endpoint, plus fix a residual bug from the v9 frontend/backend merge where `DECOMPOSITION-STAGE.md` still listed the API contract file as a frontend task deliverable.

### What Changed

**Change Request support:**
- New `spec/workflows/change-request/CHANGE-REQUEST-STAGE.md` — defines CR-0 through CR-5 (ledger integrity check, eligibility check, original-story gate, Pass 1 read-only discovery/cascade walk, Pass 1 conflict gate, Pass 2 atomic apply + combined review). Stage 6 onward is explicitly not re-specified — CR-produced delta tasks re-enter the existing unified pipeline exactly like normal decomposition output, branching per task `Layer` exactly as today. No separate frontend/backend CR stage table was needed, since that branch already exists inside the single pipeline (a concrete simplification over an earlier two-tree design this feature was adapted from).
- New `spec/commands/change-request.md` + `.claude/commands/change-request.md` — the 9th command pair.
- New `spec/traceability/shared/STORY-DEPENDENCIES.md` — Backward/Forward dependency ledger, two tables, no `Layer` column (dependency is a story-level fact; layer-specificity lives in each row's free-text Touchpoint).
- New `spec/business/CR-changes/README.md` — CR source file convention, `spec/business/CR-changes/<module>/CR-<STORY-ID>-<n>.md`.
- `spec/workflows/shared/SHARED-POLICIES.md` — added `change-request` to the Metrics `Command` enum, `Change Request` to both `Stage` enum occurrences (Metrics Rules and Conflict Decision Rules), and one new Conflict Decision Rules trigger row for a CR cascade break (reuses existing `Story vs Story` Conflict Type).
- `spec/workflows/lld/LLD-STAGE.md` — §1 Metadata gained a `Depends On: [STORY-ID, ...]` field, populated from the ledger, identical in both companion LLDs; one Agent Delta bullet pointing at the CR alternate entry.
- `spec/AGENTS.md`, `spec/WORKFLOW-OVERVIEW.md` — one bullet/section each pointing at the CR alternate entry and its atomic-cascade behavior.
- `spec/SPEC-FOLDER-STRUCTURE.md` — tree diagram, Active Now list, Folder Responsibilities table, and Full Authoritative Document List all updated for the new CR files.
- `spec/progress/README.md`, `spec/traceability/README.md`, `spec/business/README.md` — one addition each: `## Change Request: CR-<n>` progress section, `STORY-DEPENDENCIES.md` as the shared-ledger exception, and a cross-reference to `CR-changes/`.
- `spec/commands/lld-creation.md` — one new step: writing a backward dependency also writes the mirrored forward row to the ledger, same turn.
- `spec/workflows/decomposition/DECOMPOSITION-STAGE.md` — one note: a CR-triggered decomposition is delta-scoped only, reviewed via the CR's own combined gate.

**Optional Swagger sync:**
- New `spec/architecture/API-CONTRACT-SOURCE.md` — per-module `{{SWAGGER_URL}}` declaration, read only by `/sync-contract`, deliberately excluded from `spec/AGENTS.md`'s Read Order and `spec/SPEC-VERSION.md`'s Tracked Spec Files.
- New `spec/commands/sync-contract.md` + `.claude/commands/sync-contract.md` — the 10th command pair. Advisory-only ownership stance: `/sync-contract` only pre-populates/refreshes `contracts/<module>/<module>.yaml`; backend `/task-to-code` always remains the sole binding authority and reconciles the file to match the approved `LLD-BE-<id>.md` touchpoint table on conflict.
- `spec/workflows/decomposition/DECOMPOSITION-STAGE.md` — fixed the Frontend "Feature-Module Task" deliverable list (previously wrongly listed the API contract file as something that task produces; it only ever consumed/mocked it). The Backend "Domain-Service Task" deliverable list needed no substantive change — it correctly cross-references `IMPLEMENTATION-STAGE.md` now.
- `spec/workflows/implementation/IMPLEMENTATION-STAGE.md` — one clause: a pre-existing contract entry, however it got there, is never itself binding.
- `spec/architecture/NFR-SUMMARY.md` (`NFR-API-004`), `.github/copilot-instructions.md` — tightened to name the exact `contracts/<module>/<module>.yaml` file and the optional `/sync-contract` path; both also gained the `change-request`/`sync-contract` command rows.
- `README.md` — new Commands table rows, new Quick Reference rows (Swagger URL source, CR source, story dependency), Repository Structure diagram additions for `API-CONTRACT-SOURCE.md`, `CR-changes/`, `change-request/`, `STORY-DEPENDENCIES.md`, and the two new command files.
- `spec/commands/README.md` — index bullets for both new commands.

### What Did NOT Change

- `spec/REVIEW-AND-REVISION-POLICY.md`, `spec/workflows/testing/TESTING-STAGE.md`, `spec/workflows/integration-testing/INTEGRATION-TESTING-STAGE.md`, `spec/workflows/validation/VALIDATION-STAGE.md`, `spec/commands/run-workflow.md`, `spec/workflows/shared/STAGE-CONTRACT.md`, `spec/workflows/shared/TRACEABILITY-RULES.md` — none need CR- or sync-contract-awareness; both new commands are additive, standalone entry points.
- The core `contracts/<module>/<module>.yaml` authorship model from Change 15 (backend `/task-to-code` writes it, frontend reads/mocks it) is unchanged — `/sync-contract` only adds an optional, subordinate pre-population path.
- The pre-existing Conflict Decision Rules `Stage` enum gap (missing "Validation," unrelated to this change) was left alone, not opportunistically fixed.

### Version

`spec/SPEC-VERSION.md` bumped `current: 14` → `15` (`last_updated: 2026-07-15`).

---

## Change 20 — 2026-07-15: Layer Scope Selectivity (Frontend / Backend / Both)

**Type:** New feature — planning-stage layer selectivity

**Goal:** Since the v9 frontend/backend merge, Stages 1-5 (Intake, LLD Creation, LLD Review, Decomposition, Decomp Review) always produced both `LLD-FE`/`LLD-BE` and both `-FE-`/`-BE-` task sets, even for a project that only ever wanted one layer — the only workaround was to generate both and manually ignore the unwanted half. Stage 5.5 onward was already layer-selective (independent `/scaffold frontend`/`/scaffold backend`, per-task `Layer` routing, backend-only integration testing) and needed no change. This adds an explicit, one-time, interactive **Layer Scope** choice (frontend / backend / both) so single-layer projects never generate the other layer's planning artifacts at all.

### What Changed

- New `## Layer Scope` convention documented in `spec/architecture/README.md` — a section at the top of `spec/architecture/ARCH-DECISIONS.md` (above any `AD-FE-*`/`AD-BE-*`/`AD-X-*` row), holding `frontend` / `backend` / `both`. Chosen over an `AD-X-*` row (that log is for cross-layer architecture decisions both layers must honor identically, not a workflow-config flag) and over a standalone file (avoids extra Read Order/Agent Delta ceremony for one flag).
- Resolution rule, applied consistently everywhere this file is read: section present → honor it; section absent and file empty/placeholder → agent must stop and ask the human interactively, never infer or default; section absent but `AD-FE-*`/`AD-BE-*` already has real content (pre-existing project) → treat as `both`, the only reading consistent with a repo that already worked under the prior always-both system.
- `README.md` — new "Before You Start" step 2 (interactive Layer Scope question, right after the `.gitignore` prune step), renumbering old steps 2-10 to 3-11 and updating every internal step-number cross-reference; Full Workflow Diagram, Stage-By-Stage Walkthrough (Stages 2-5), Quick Start blocks, Stage Reference Table, Commands table, Blocking Conditions table, and Repository Structure diagram all gained a Layer-Scope caveat or conditional wording without rewriting their illustrative both-layers examples.
- `spec/commands/lld-creation.md` — new Pre-Execution Check 0 (resolve Layer Scope first, ask interactively if unresolved); every "produce both LLDs" instruction now conditional on Layer Scope; §14 Companion LLD Reference states `Not Applicable` for single-layer scope (kept as section 14, not renumbered, so every "14 sections" reference elsewhere stays valid); same-story cross-layer conflict check now applies only when Layer Scope = `both`.
- `spec/commands/decompose.md` — signature becomes `/decompose <lld-file> [<lld-file-2>]`; new Pre-Execution Check 0 validates the argument count against Layer Scope; every "both LLDs" instruction now conditional.
- `spec/commands/run-workflow.md` — Stage 1 unchanged (already layer-agnostic); Stages 2-5 rewritten to read Layer Scope before Stage 2 and produce/review only the in-scope LLD(s)/task(s), with "one logical gate" language now scoped to Layer Scope = `both`; Command Intent, Pre-Execution Checks, Output/Traceability Expectations, and Hard Boundary Rules updated to match.
- `spec/commands/change-request.md` + `spec/workflows/change-request/CHANGE-REQUEST-STAGE.md` — entry gate ("original story's LLD pair both approved/done") now reads "every in-scope LLD approved/done," since `/change-request` is an alternate Stage 1-5 entry point and inherited the identical always-both gap.
- `.claude/commands/lld-creation.md`, `decompose.md`, `run-workflow.md`, `change-request.md` — mirrored stub updates matching their canonical contracts.
- `spec/workflows/lld/LLD-STAGE.md`, `spec/workflows/decomposition/DECOMPOSITION-STAGE.md` — Agent Delta, Entry Conditions, Input/Output Contract, Process Steps, Review Checklist, and Done Criteria updated with the same conditional pattern as their command contracts, so the underlying stage rules don't contradict what the commands now do.
- `spec/WORKFLOW-OVERVIEW.md`, `spec/AGENTS.md` — Stage Summary table, Workflow Map, Exit Conditions, Read Order, and Required Workflow Behavior table updated from hardcoded `both` to Layer-Scope-conditional.
- `spec/progress/README.md`, `spec/SPEC-FOLDER-STRUCTURE.md` — progress-file fork-at-LLD-stage description now "one subsection per in-scope layer (two, when Layer Scope = `both`)" instead of always two.
- `spec/traceability/README.md`, `spec/workflows/shared/TRACEABILITY-RULES.md` — "One Shard, Both Chains" / "Dual-Chain-Per-Story Rule" now describe carrying the in-scope layer's chain(s), with the `Layer` column kept in the schema unconditionally (a single-layer project's shard simply never has rows for the other layer).

### What Did NOT Change

- `spec/commands/scaffold.md` — already fully independent per layer (`/scaffold frontend` and `/scaffold backend` are separate invocations, neither requires the other); no edit needed.
- `spec/workflows/shared/STAGE-CONTRACT.md`, `spec/workflows/shared/SHARED-POLICIES.md` — already layer-neutral (branch conditionally on a task's own `Layer` tag; Metrics `Layer` field already accepts `frontend`/`backend`/`shared`).
- `spec/init.md` — execution bootstrap is already per-task `Layer`-routed; no gating logic to change.
- `spec/traceability/shared/SCAFFOLD-FE/TRACEABILITY.md` / `SCAFFOLD-BE/TRACEABILITY.md` — already independent per-layer files.
- Backward compatibility: every conditional edit preserves the `both` branch as the literal prior behavior — a pre-existing project with `AD-FE-*`/`AD-BE-*` already populated but no `## Layer Scope` section reads as `both` by the resolution rule above, so no existing project's behavior changes.

### Version

`spec/SPEC-VERSION.md` bumped `current: 16` → `17` (`last_updated: 2026-07-15`).

---

## Change 21 — 2026-07-15: Layer Scope Precondition Made Universal (Closes a Change 20 Gap)

**Type:** Follow-up fix — correction to Change 20

**Goal:** Change 20 wired Layer Scope resolution into `/lld-creation`, `/decompose`, `/run-workflow`, `/change-request` — but not `/scaffold`, on the (incorrect) assumption in that change's own "What Did NOT Change" note that scaffold needed no edit since it was "already independent per layer." That's true for *running* scaffold once Layer Scope is known, but it meant `/scaffold`, often the very first command run on a fresh repo, could execute without the Layer Scope question ever being asked — a silent skip path Change 20 didn't intend.

### What Changed

- `spec/AGENTS.md` — new "Layer Scope Precondition — Universal, Every Command" section, right after "Cache Version Check": before *any* command reads `spec/architecture/ARCH-DECISIONS.md`, Layer Scope must be resolved (ask interactively if unresolved, never infer). Placed in `AGENTS.md` specifically because it's read by every command, planning and execution alike — not just the four planning-entry commands Change 20 touched.
- `spec/commands/scaffold.md` — new Pre-Execution Check 0 in both the Frontend and Backend subsections: confirm Layer Scope is resolved and includes the layer being scaffolded; if Layer Scope excludes it (e.g. `/scaffold backend` when Layer Scope = `frontend`), stop and report the mismatch rather than scaffolding an out-of-scope layer. Added the same case to Failure And Block Conditions.

### What Did NOT Change

- `/lld-creation`, `/decompose`, `/run-workflow`, `/change-request` — their existing Layer Scope checks from Change 20 were already correct; this change only closes the `/scaffold` gap.
- The Layer Scope resolution rule itself (present → honor; absent+placeholder → ask; absent+real content → default `both`) is unchanged — this change only widens *where* it's enforced, not *what* it decides.

### Version

`spec/SPEC-VERSION.md` bumped `current: 17` → `18` (`last_updated: 2026-07-15`).

---

## Change 22 — 2026-07-20: Brownfield Onboarding + Tech-Debt Audit Commands

**Type:** New feature — two new commands

**Goal:** This boilerplate was entirely greenfield-oriented: `ARCH-DECISIONS.md` ships empty and the "Before You Start" flow assumes a human interactively locks a brand-new stack from a blank slate. There was no path for onboarding an *existing* application — no way to derive `ARCH-DECISIONS.md` or `rules`/`skills` content from code that already exists, and no way to assess that code's health before planning work lands on it.

### What Changed

- **New command `spec/commands/onboard-brownfield.md`** (`/onboard-brownfield [path]`) — asks Layer Scope interactively (never a CLI arg, since it isn't known going in), locates existing code, and scans it into two tiers: Tier 1 (the same LLD-required `AD-FE-*`/`AD-BE-*`/`AD-X-*` decision set as greenfield step 3) written to `ARCH-DECISIONS.md`, and Tier 2 (finer-grained conventions — the same content as greenfield steps 7-8) written to `rules/`/`skills/` at whichever root the code actually lives in (`src-code-frontend/`/`src-code-backend/` if already there, else the user-provided path — code is never moved). Nothing is written before a combined human review gate returns `approved`. Alternate entry to root `README.md` §Before You Start steps 2-3 for brownfield projects; rejoins step 4 onward normally. `/scaffold` is unchanged and correctly still refuses to run once a code root exists.
- **New command `spec/commands/tech-debt-audit.md`** (`/tech-debt-audit frontend|backend`) — read-only, informational code-health report, modeled on `/sync-contract`'s non-blocking style (no approval gate, nothing downstream depends on it). Two additive derivation modes: Mode A (code-only: dependencies, deprecated/EOL patterns, code hygiene, test gaps, type-safety gaps, security-lite smells — always runs, no baseline needed) and Mode B (architecture drift — compares code against an already-locked `AD-*`/`rules/` baseline; empty category if no baseline exists yet, not a reason to refuse the run). Report written to `spec/progress/shared/TECH-DEBT-FE/REPORT.md` / `TECH-DEBT-BE/REPORT.md`, overwritten on each re-run.
- Mirror stubs for both commands across every model entry point, same pairing convention as every other command: `.claude/commands/*.md` (Claude Code), `.agents/skills/*/SKILL.md` (Codex CLI), `.github/prompts/*.prompt.md` (GitHub Copilot), `.gemini/commands/*.toml` (Gemini CLI).
- `GEMINI.md` and `.github/copilot-instructions.md` — added table rows for both new commands, same pattern as every other command row.
- Root `README.md` — new "Brownfield / Existing Codebase Path" subsection under §Before You Start, two new Commands table rows, two new Blocking Conditions rows, a brownfield Quick Start variant, and Repository Structure updates (`spec/commands/`, `spec/progress/shared/`, `spec/traceability/shared/`).
- `spec/architecture/README.md` — Layer Scope resolution rule now points to `/onboard-brownfield` instead of a blank interactive ask when real code already exists.
- `spec/AGENTS.md` — Layer Scope Precondition's "ask interactively" bullet now recommends `/onboard-brownfield` under the same condition.

### What Did NOT Change

- Business-spec reverse-engineering from existing feature behavior — explicitly out of scope for both new commands, documented as a Non-Goal/future phase.
- `/scaffold`'s existing refusal to overwrite an existing code root — already correct, no edit needed.
- The Layer Scope resolution rule's actual logic (present → honor; absent+placeholder → ask; absent+real content → default `both`) — unchanged; `/onboard-brownfield` satisfies the "ask" branch with evidence instead of a blank prompt, it doesn't change the branch logic itself.

### Version

`spec/SPEC-VERSION.md` bumped `current: 18` → `19` (`last_updated: 2026-07-20`).

---

## Change 23 — 2026-07-21: `spec/delivery/` Renamed to `spec/tasks/`

**Type:** Rename — folder + reference update, no behavior change

**Goal:** `spec/delivery/` held task packets but named the folder after the artifact's lifecycle stage rather than what it contains, inconsistent with `spec/lld/` (named for its artifact) and with `spec/SPEC-VERSION.md`'s own "Do NOT increment" rule, which already said `spec/tasks/` before the folder existed under that name. Renames the folder to match what every other reference already called it.

### What Changed

- `spec/delivery/` → `spec/tasks/` (git-moved, `README.md` retained, header and body updated).
- Every live path reference updated across: `spec/init.md`, `spec/commands/decompose.md`, `spec/commands/run-workflow.md`, `spec/workflows/decomposition/DECOMPOSITION-STAGE.md`, `spec/workflows/validation/VALIDATION-STAGE.md`, `spec/progress/README.md`, `spec/traceability/README.md`, `spec/SPEC-FOLDER-STRUCTURE.md`, root `README.md`, `.gitignore`, `.claude/commands/decompose.md`, `.github/prompts/decompose.prompt.md`, `.gemini/commands/decompose.toml`, `.agents/skills/decompose/SKILL.md`.
- `spec/SPEC-FOLDER-STRUCTURE.md`'s tree diagram under §Progress Layout had a stale nested `delivery/tasks/` shape that already disagreed with the flat per-module convention documented right below it — corrected to `tasks/<module>/` while renaming, matching the `lld/` entry's shape.
- Historical `CHANGE.md` entries and archived `spec/SPEC-VERSION.md` version notes that quote the old `spec/delivery/*` path as it existed at that point in time are left untouched — they are dated records of past state, not live references.

### What Did NOT Change

- No change to what the folder contains, how it's populated, or its mirrored-per-module/flat/no-per-layer-subfolder convention — path rename only.
- Prose uses of the word "delivery" (e.g. "delivery task", "delivery workflow") are unchanged — only literal path references moved.

### Version

`spec/SPEC-VERSION.md` bumped `current: 19` → `20` (`last_updated: 2026-07-21`).

---

## Change 24 — 2026-07-21: `spec/dashboard/` Renamed to `spec/sdd-insights/`

**Type:** Rename — folder + file, no behavior change

**Goal:** `spec/dashboard/dashboard.html` was named generically after its UI pattern rather than what it does. Renamed to `sdd-insights` at the user's request.

### What Changed

- `spec/dashboard/` → `spec/sdd-insights/` (git-moved).
- `dashboard.html` → `sdd-insights.html`; `<title>` and `<h1>` updated from "Traceability Dashboard" to "SDD Insights".
- `spec/sdd-insights/README.md` — header and all `dashboard.html` references updated to `sdd-insights.html`; "Local tool, not spec content / do not track / agents must not read" guidance kept verbatim.
- `CHANGE.md:694` (a historical entry describing a past edit to `spec/dashboard/dashboard.html`) left untouched — dated record of past state, not a live reference. Same treatment for `spec/SPEC-HIERARCHY.md`'s generic "Dashboards summarize state" prose, which isn't a path reference.

### What Did NOT Change

- No change to the tool's logic, data source (`spec/traceability/**/TRACEABILITY.md` shards), or in-browser-only behavior — pure rename.
- No `spec/SPEC-VERSION.md` version bump — this tool was never on the tracked-spec-files list (its own README says so), so nothing tracked changed.
