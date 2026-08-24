# CLAUDE.md — Project Config for Claude Code

This file is the source of truth for locked stack decisions and Claude-specific configuration.
`CLAUDE.md` overrides all architecture spec files on stack and caching decisions.

---

## Locked Stack Decisions

Layer Scope: **both**. Full decision log: `spec/architecture/ARCH-DECISIONS.md` (+ `spec/architecture/FRONTEND-STRUCTURE.md`, `spec/architecture/BACKEND-STRUCTURE.md`) — this file is a pointer, not a duplicate; read those for the authoritative rows.

- **Frontend** (`AD-FRONTEND-001..007`): Vite + React 18 + TypeScript strict, no UI/state library (plain hooks + `src/api/tasksClient.ts`), no form library, no auth, plain CSS, Vitest + React Testing Library.
- **Backend** (`AD-BACKEND-001..006`): Express + TypeScript strict, no ORM (in-memory array repository, no persistence across restarts by design), no auth, REST/JSON, no messaging, `node --test` + `supertest`.
- **Cross-cutting** (`AD-X-001..003`): API contract = OpenAPI 3.1 at `contracts/tasks/tasks.yaml` (written by backend implementation, not pre-created); CORS allows `http://localhost:5173` only; no token format (no auth in this demo).

---

## Prompt Caching — Claude / Anthropic API

When calling the Anthropic API programmatically with spec file content, add
`cache_control: {"type": "ephemeral"}` on every stable spec content block.

### What to cache
Mark these blocks with `cache_control`:
- Full content of all planning mandatory spec files (see `spec/SPEC-VERSION.md` tracked list)
- Full content of all execution mandatory spec files
- System prompt containing workflow rules

### What NOT to cache
Do not add `cache_control` to:
- Dynamic task file content (changes per story)
- Progress or traceability file content
- User turn messages

### Cache economics
- Cache write: 1.25× normal input token cost (paid once per TTL window)
- Cache read: 0.1× normal input token cost (90% savings)
- TTL: 5 minutes ephemeral — resets on each use
- Min cacheable block: 1,024 tokens

### Cache invalidation
Cache auto-invalidates when content changes (different content = different cache key).
Check `spec/SPEC-VERSION.md` — if `current` version changed since last session,
all spec cache entries are stale. Re-send with `cache_control` to create fresh cache.

### Example API call structure

```typescript
const response = await anthropic.messages.create({
  model: "claude-sonnet-4-6",
  max_tokens: 8096,
  system: [
    {
      type: "text",
      text: agentsMdContent,
      cache_control: { type: "ephemeral" }   // stable planning spec
    },
    {
      type: "text",
      text: archDecisionsMdContent,
      cache_control: { type: "ephemeral" }   // stable arch decisions
    }
  ],
  messages: [
    {
      role: "user",
      content: taskSpecificPrompt             // dynamic — no cache_control
    }
  ]
});
```

### Claude Code CLI
Claude Code caches context automatically for stable system prompt content above 1,024 tokens.
No explicit action needed when running commands via Claude Code CLI.

---

## Spec Version Check

Before starting any planning or execution work:
1. Read `spec/SPEC-VERSION.md`
2. Note `current` version
3. If version changed since last session — reload all mandatory spec files (cache is stale)
4. If version unchanged — cached spec content is still valid

