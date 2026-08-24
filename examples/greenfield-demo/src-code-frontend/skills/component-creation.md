# Creating A New Component

Follow this procedure for new frontend components in this codebase, matching the existing `TaskForm`/`TaskList` pair.

1. Add `src/components/<ComponentName>.tsx`.
2. Declare a `<ComponentName>Props` interface above the component if it takes props.
3. Export the component as a named export (`export function <ComponentName>(...)`), not a default export.
4. If the component needs domain data, import the type from `src/types/<domain>.ts` rather than redeclaring it.
5. If the component triggers an async action (e.g. create/update), accept a callback prop (`onCreate: (title: string) => Promise<void>`) rather than importing the API client directly — see `spec/architecture/FRONTEND-STRUCTURE.md` §Module Boundaries; only `App.tsx` and `src/api/` may touch the network.
6. Add `src/components/<ComponentName>.test.tsx` alongside it:
   - Render with React Testing Library (`render`, `screen`).
   - Drive interactions with `@testing-library/user-event`, not raw DOM events.
   - Cover: happy path, validation/error path, and (if the component has an async action) the in-flight/disabled state.
7. Style via a new block in `src/index.css` using the existing `block__element` class naming (e.g. `task-form__input`), not inline styles or a new stylesheet.
8. If `App.tsx` now composes the new component, add/update the corresponding `vi.mock('./components/<ComponentName>', ...)` stub in `App.test.tsx` so `App`'s own tests stay focused on composition/state wiring rather than the new component's internals.

Evidence of the existing pattern: `src/components/TaskForm.tsx`, `src/components/TaskForm.test.tsx`, `src/components/TaskList.tsx`, `src/components/TaskList.test.tsx`, `src/App.test.tsx`, `src/index.css`.
