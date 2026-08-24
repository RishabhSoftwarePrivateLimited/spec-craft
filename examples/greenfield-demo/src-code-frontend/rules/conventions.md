# Frontend Conventions

Cross-cutting implementation rules for `src-code-frontend/`, beyond what `spec/architecture/ARCH-DECISIONS.md` (`AD-FRONTEND-*`) and `spec/architecture/FRONTEND-STRUCTURE.md` already lock (framework, module boundaries, routing). Apply these when implementing any frontend task.

## Naming

- Component files: PascalCase, one component per file (`TaskForm.tsx`, `TaskList.tsx`).
- Test files: colocated next to the file under test, same name + `.test.tsx` suffix (`TaskForm.tsx` + `TaskForm.test.tsx`).
- Props types: a `<ComponentName>Props` interface declared in the same file as the component, not a shared props-types file.
- API client functions: verb-first, domain-scoped, grouped by module in `src/api/<domain>Client.ts` (`listTasks`, `createTask` in `tasksClient.ts`).

## Component Pattern

Function components, named export (not default — `App.tsx`'s default export is the sole exception, required by Vite's entry convention), props destructured directly in the signature:

```tsx
interface TaskFormProps {
  onCreate: (title: string) => Promise<void>
}

export function TaskForm({ onCreate }: TaskFormProps) { ... }
```

Presentational components never call `fetch` or import `src/api/` directly — see `FRONTEND-STRUCTURE.md` §Module Boundaries. They receive data and callbacks as props from `App.tsx`.

## Data-Fetching Pattern

Plain `fetch` wrapped in typed async functions returning a typed `Promise`, one client module per domain. Base URL comes from a Vite env var with a localhost fallback — no data-fetching library (no React Query/SWR) at this scope:

```ts
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000'
```

A non-`ok` response throws an `Error` with either the server's `{ error }` body message or a generic `Failed to <verb> (status)` fallback — callers catch and surface `err.message` to the user, they never re-derive the message from the response themselves.

## State Management

Local component state only (`useState`/`useEffect`), owned by the top-level component that needs it (`App.tsx` owns the `tasks` list; each form/list component owns only its own transient UI state — e.g. `TaskForm`'s `isSubmitting`/`formError`). Do not introduce Redux/Zustand/Context without a new `AD-FRONTEND-*` decision.

## Styling

One global CSS file (`src/index.css`), class names follow a `block__element` convention (e.g. `task-form__input`, `task-list__item`, `task-form__error`). No CSS-in-JS, no utility framework, no per-component stylesheets.

## Linting

`oxlint` with `react`, `typescript`, `oxc` plugins. `react/rules-of-hooks` is an error; `react/only-export-components` is a warning (`allowConstantExport: true`). Run via `npm run lint`.

## Testing

Vitest + React Testing Library, run via `npm test`.

- Components are tested in isolation with `render` + `screen`, interactions driven by `@testing-library/user-event`, never by firing raw DOM events.
- `App.tsx` tests mock `src/api/tasksClient` and the child components it composes (`vi.mock('./api/tasksClient')`, `vi.mock('./components/TaskList', ...)`) so the composition/state-wiring logic is tested independently of both the API layer and the child components' own rendering — those get their own dedicated test files.
- Assert user-visible outcomes (text, role, disabled state) over implementation details — e.g. `expect(button).toBeDisabled()`, not inspecting component internals.
- Cover the same three axes for every interactive component: happy path, validation/error path, and in-flight/loading state.
