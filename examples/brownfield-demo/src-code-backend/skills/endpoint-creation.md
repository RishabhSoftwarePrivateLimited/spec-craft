# Creating A New Endpoint (Discovered Procedure)

Discovered by `/speccraft.onboard` from the existing `tasks` slice. Follow this shape for new backend endpoints in this codebase.

1. Add/extend `src/types/<domain>.ts` with the domain interface if it doesn't already exist.
2. Add `src/repositories/<domain>.repository.ts` exporting plain functions (`list()`, `create()`, etc.) over an in-memory store, unless a real data store has been architecturally decided for this domain — do not introduce an ORM without an `AD-BACKEND-*` decision.
3. Add `src/services/<domain>.service.ts` that calls the repository and owns validation: throw a plain `Error` with a human-readable message on invalid input.
4. Add `src/controllers/<domain>.controller.ts` with one exported function per route handler. Catch service errors and map them to the appropriate HTTP status with `{ error: message }`.
5. Add `src/routes/<domain>.routes.ts` using an Express `Router`, wiring HTTP verbs to controller functions.
6. Mount the router in `src/index.ts` under `/api/<domain>`.
7. Add tests mirroring the layer structure:
   - `test/repositories/<domain>.repository.test.ts`
   - `test/services/<domain>.service.test.ts` (mock the repository)
   - `test/controllers/<domain>.controller.test.ts` (mock the service, assert status + body via a hand-built mock `Response`)
   - `test/integration/<domain>.integration.test.ts` (drive the real exported `app` with `supertest`, no mocking)

Evidence: `src/types/task.ts`, `src/repositories/tasks.repository.ts`, `src/services/tasks.service.ts`, `src/controllers/tasks.controller.ts`, `src/routes/tasks.routes.ts`, `src/index.ts:14`, `test/repositories/tasks.repository.test.ts`, `test/services/tasks.service.test.ts`, `test/controllers/tasks.controller.test.ts`, `test/integration/tasks.integration.test.ts`.
