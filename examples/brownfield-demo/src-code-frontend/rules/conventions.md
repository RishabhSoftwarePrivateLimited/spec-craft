# Frontend Conventions (Discovered)

Discovered by `/speccraft.onboard` from existing code — not hand-authored. Apply these when implementing new frontend tasks in this codebase.

## Folder Layout

Flat, not feature-folder based: `src/api/` (typed API client functions), `src/components/` (UI components), `src/types/` (shared TS interfaces). A new domain concept gets a new file in the matching folder, not a new subfolder per feature.

Evidence: directory tree under `src-code-frontend/src/`.

## Naming

- Component files: PascalCase, one component per file (`TaskForm.tsx`, `TaskList.tsx`).
- Test files: colocated next to the file under test, same name + `.test.tsx` suffix (`TaskForm.tsx` + `TaskForm.test.tsx`).
- Props types: `<ComponentName>Props` interface declared in the same file as the component.

Evidence: `src/components/TaskForm.tsx:4`, `src/components/TaskList.tsx:3`.

## Component Pattern

Function components, named export (not default), props destructured in the signature:

```tsx
interface TaskFormProps {
  onCreate: (title: string) => Promise<void>
}

export function TaskForm({ onCreate }: TaskFormProps) { ... }
```

Evidence: `src/components/TaskForm.tsx:4-8`, `src/components/TaskList.tsx:3-7`.

## Data-Fetching Pattern

Plain `fetch` wrapped in typed async functions that return a typed `Promise`, grouped by domain in `src/api/<domain>Client.ts`. Base URL comes from a Vite env var with a localhost fallback — no data-fetching library (no React Query/SWR).

```ts
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000'
```

Evidence: `src/api/tasksClient.ts:3,5-13`.

## State Management

Local component state only (`useState`/`useEffect`), owned by the top-level component that needs it (`App.tsx`). No Redux/Zustand/Context API — do not introduce one without an explicit architecture decision.

Evidence: `src/App.tsx:8-10`.

## Styling

One global CSS file (`src/index.css`), class names follow a `block__element` pattern (e.g. `task-form__input`, `task-list__item`). No CSS-in-JS, no utility framework.

Evidence: `src/index.css`.

## Linting

`oxlint` with `react`, `typescript`, `oxc` plugins. `react/rules-of-hooks` is an error; `react/only-export-components` is a warning.

Evidence: `.oxlintrc.json`.

## Testing

Vitest + React Testing Library. Child components and API-client modules are mocked with `vi.mock` at the top of the test file; interactions are driven with `@testing-library/user-event`.

Evidence: `src/App.test.tsx:1-8`, `vite.config.ts:8-13`.
