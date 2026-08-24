# Creating A New Endpoint

Follow this procedure for new backend endpoints in this codebase, matching the existing `tasks` slice.

1. Add/extend `src/types/<domain>.ts` with the domain interface if it doesn't already exist.
2. Add `src/repositories/<domain>.repository.ts` exporting plain functions (`list()`, `create()`, etc.) over an in-memory store — see `spec/architecture/BACKEND-STRUCTURE.md` §Data / Integration Strategy; do not introduce an ORM or real datastore without a new `AD-BACKEND-*` decision.
3. Add `src/services/<domain>.service.ts` that calls the repository and owns validation: throw a plain `Error` with a human-readable message on invalid input.
4. Add `src/controllers/<domain>.controller.ts` with one exported function per route handler. Catch service errors and map them to the appropriate HTTP status with `{ error: message }`.
5. Add `src/routes/<domain>.routes.ts` using an Express `Router`, wiring HTTP verbs to controller functions — no logic in the route file itself.
6. Mount the router in `src/index.ts` under `/api/<domain>`.
7. If the new operation changes the API surface, update `contracts/<module>/<module>.yaml` to match the approved LLD's touchpoint table — per `AD-X-001`, this file is written/updated by backend implementation, not pre-created.
8. Add tests mirroring the layer structure:
   - `test/repositories/<domain>.repository.test.ts`
   - `test/services/<domain>.service.test.ts` (mock the repository)
   - `test/controllers/<domain>.controller.test.ts` (mock the service, assert status + body via a hand-built mock `Response`)
   - `test/integration/<domain>.integration.test.ts` (drive the real exported `app` with `supertest`, no mocking)

Evidence of the existing pattern: `src/types/task.ts`, `src/repositories/tasks.repository.ts`, `src/services/tasks.service.ts`, `src/controllers/tasks.controller.ts`, `src/routes/tasks.routes.ts`, `src/index.ts`, `test/repositories/tasks.repository.test.ts`, `test/services/tasks.service.test.ts`, `test/controllers/tasks.controller.test.ts`, `test/integration/tasks.integration.test.ts`.
