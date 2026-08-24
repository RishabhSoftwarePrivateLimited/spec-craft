# Backend Conventions (Discovered)

Discovered by `/speccraft.onboard` from existing code — not hand-authored. Apply these when implementing new backend tasks in this codebase.

## Folder Layout

Layered, one folder per layer under `src/`: `routes/` -> `controllers/` -> `services/` -> `repositories/`, plus `types/` for shared interfaces. A request flows `routes -> controllers -> services -> repositories` in that order; a layer only calls into the layer directly below it.

Evidence: directory tree under `src-code-backend/src/`.

## Naming

One file per domain per layer, suffixed by layer: `<domain>.routes.ts`, `<domain>.controller.ts`, `<domain>.service.ts`, `<domain>.repository.ts` (e.g. `tasks.routes.ts`, `tasks.controller.ts`, `tasks.service.ts`, `tasks.repository.ts`).

Evidence: `src-code-backend/src/routes/tasks.routes.ts`, `src-code-backend/src/controllers/tasks.controller.ts`, `src-code-backend/src/services/tasks.service.ts`, `src-code-backend/src/repositories/tasks.repository.ts`.

## Data-Access Pattern

Repository modules export plain functions (`list()`, `create()`) over an in-memory array — no ORM, no query builder, no database driver. Controllers never import the repository directly; they only call the service.

Evidence: `src-code-backend/src/repositories/tasks.repository.ts:1-12`, `src-code-backend/src/controllers/tasks.controller.ts:2`.

## Validation Pattern

Input validation lives in the service layer, not the controller: the service trims/checks the input and throws a plain `Error` with a human-readable message on failure. The controller catches the error and maps it to an HTTP 400 with `{ error: message }`.

```ts
// service
if (!trimmedTitle) throw new Error('Title is required')

// controller
catch (err) {
  const message = err instanceof Error ? err.message : 'Title is required'
  res.status(400).json({ error: message })
}
```

Evidence: `src-code-backend/src/services/tasks.service.ts:10-13`, `src-code-backend/src/controllers/tasks.controller.ts:12-18`.

## App Export

`src/index.ts` builds and exports the Express `app` instance, and only calls `app.listen()` when the file is run directly (`require.main === module`). This lets integration tests import `app` and drive it with `supertest` without binding a real port.

Evidence: `src-code-backend/src/index.ts:18-24`.

## Env Config

`PORT` read from `process.env` with a `4000` fallback; documented in `.env.example` alongside `NODE_ENV`.

Evidence: `src-code-backend/src/index.ts:16`, `src-code-backend/.env.example`.

## Testing

Node's built-in `node:test` + `node:assert/strict`. One test file per layer under `test/<layer>/`, mirroring the `src/<layer>/` structure, plus `test/integration/` using `supertest` against the exported `app` for full-stack HTTP-level tests. Unit tests mock the layer directly below via `t.mock.method(...)`.

Evidence: `src-code-backend/test/controllers/tasks.controller.test.ts`, `src-code-backend/test/services/tasks.service.test.ts`, `src-code-backend/test/repositories/tasks.repository.test.ts`, `src-code-backend/test/integration/tasks.integration.test.ts`.
