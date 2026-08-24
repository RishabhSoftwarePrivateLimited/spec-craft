# CLAUDE.md — Project Config for Claude Code

This file is the source of truth for locked stack decisions and Claude-specific configuration.
`CLAUDE.md` overrides all architecture spec files on stack and caching decisions.

---

## Locked Stack Decisions

`spec/architecture/` is currently empty — populate `ARCH-DECISIONS.md` with this project's
locked decisions for **both** layers:

- **Frontend** (`AD-FRONTEND-*`): framework, UI library, state management, forms, auth/session model, typing
- **Backend** (`AD-BACKEND-*`): framework, ORM/data-access layer, auth/session model, API style, messaging, typing
- **Cross-cutting** (`AD-X-*`): anything shared across both layers (API contract shape, CORS, token format, etc.)

Once recorded, list or link them here as the single source of truth.

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

