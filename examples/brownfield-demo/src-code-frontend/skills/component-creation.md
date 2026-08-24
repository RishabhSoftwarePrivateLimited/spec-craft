# Creating A New Component (Discovered Procedure)

Discovered by `/speccraft.onboard` from the existing `TaskForm`/`TaskList` pair. Follow this shape for new frontend components in this codebase.

1. Add `src/components/<ComponentName>.tsx`.
2. Declare a `<ComponentName>Props` interface above the component if it takes props.
3. Export the component as a named export (`export function <ComponentName>(...)`), not a default export.
4. If the component needs domain data, import the type from `src/types/<domain>.ts` rather than redeclaring it.
5. If the component triggers an async action (e.g. create/update), accept a callback prop (`onCreate: (title: string) => Promise<void>`) rather than importing the API client directly — keeps the component testable in isolation.
6. Add `src/components/<ComponentName>.test.tsx` alongside it:
   - Render with React Testing Library.
   - Mock any imported API-client module with `vi.mock`.
   - Drive interactions with `@testing-library/user-event`.
7. Style via a new block in `src/index.css` using the existing `block__element` class naming (e.g. `task-form__input`), not inline styles or a new stylesheet.

Evidence: `src/components/TaskForm.tsx`, `src/components/TaskForm.test.tsx`, `src/components/TaskList.tsx`, `src/components/TaskList.test.tsx`, `src/index.css`.
