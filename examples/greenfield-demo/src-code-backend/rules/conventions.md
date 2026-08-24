# Backend Conventions

Cross-cutting implementation rules for `src-code-backend/`, beyond what `spec/architecture/ARCH-DECISIONS.md` (`AD-BACKEND-*`) and `spec/architecture/BACKEND-STRUCTURE.md` already lock (framework, layering, data strategy). Apply these when implementing any backend task.

## Naming

One file per domain per layer, suffixed by layer: `<domain>.routes.ts`, `<domain>.controller.ts`, `<domain>.service.ts`, `<domain>.repository.ts` (e.g. `tasks.routes.ts`, `tasks.controller.ts`, `tasks.service.ts`, `tasks.repository.ts`). Test files mirror this exactly under `test/<layer>/`, plus `test/integration/<domain>.integration.test.ts` for the full-stack HTTP tests.

## Data-Access Pattern

Repository modules export plain functions (`list()`, `create()`) over an in-memory array — no ORM, no query builder, no database driver. Controllers never import the repository directly; they only call the service — see `BACKEND-STRUCTURE.md` §Layering ("a controller never touches the repository directly").

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

Route handlers themselves (`*.routes.ts`) contain no logic — only HTTP-verb-to-controller-function wiring via an Express `Router`.

## App Export

`src/index.ts` builds and exports the Express `app` instance, and only calls `app.listen()` when the file is run directly (`require.main === module`). This lets integration tests import `app` and drive it with `supertest` without binding a real port.

## Env Config

`PORT` read from `process.env` with a `4000` fallback; documented in `.env.example` alongside `NODE_ENV`. Add any new env var to `.env.example` in the same commit that introduces it.

## Testing

Node's built-in `node:test` + `node:assert/strict`, run via `npm test`.

- One test file per layer under `test/<layer>/`, mirroring `src/<layer>/`. Unit tests for a layer mock only the layer directly below it via `t.mock.method(...)` — a controller test mocks the service, a service test mocks the repository; never mock two layers down.
- `test/integration/` tests import the real exported `app` and drive it with `supertest`, no mocking — these exercise the real routes → controllers → services → repository stack end to end, per `AD-BACKEND-006`/`BACKEND-STRUCTURE.md` §Data / Integration Strategy.
- Cover success, validation-failure, and edge-input cases (missing field, empty string, whitespace-only) for every endpoint at both the controller-unit and integration level.
