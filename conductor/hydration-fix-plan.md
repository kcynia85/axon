# Plan: Fix Hydration Issues in Studio Crew Form

This plan addresses hydration mismatches in the "Studio Crew" form specifically related to the "Context", "Artefacts", and "Hierarchical Execution" (Lead Manager) sections.

## Objective
Eliminate React hydration errors caused by inconsistent server/client rendering in the Crew Studio module.

## Key Files & Context
- `frontend/src/shared/ui/ui/Form.tsx`: Contains `FormItem` which uses `React.useId()`.
- `frontend/src/shared/ui/form/FormPropertyTable.tsx`: Uses array indices as keys for inputs, which can be unstable if initial data changes.
- `frontend/src/modules/studio/features/crew-studio/ui/sections/execution/HierarchicalExecution.tsx`: Handles the "Manager / Lead Agent" field.
- `frontend/src/modules/studio/features/crew-studio/application/useCrewForm.ts`: Manages default form values.
- `frontend/src/modules/studio/features/crew-studio/ui/sections/CrewContextSection.tsx` & `CrewArtefactsSection.tsx`: Form sections for context/artifacts.

## Proposed Changes

### 1. Fix `FormItem` Hydration (Potential `useId` issue)
`React.useId()` is generally safe for hydration in React 18+, but if the component tree structure differs between SSR and Client, it can cause mismatches.
- **Action:** Ensure `FormItem` is only rendered on the client if necessary, or verify that the wrapping `FormProvider` and `form` object are stable during hydration.
- **Action:** If `useId` is still causing issues, implement a `useHasHydrated` hook to suppress rendering until the client is ready, though this is a last resort.

### 2. Stabilize `FormPropertyTable` Keys
Currently, `FormPropertyTable.tsx` uses `${item.name}-${index}` as a key. If `item.name` is empty or changes, the key becomes unstable.
- **Action:** Introduce a stable internal `id` (e.g., using `crypto.randomUUID()` on the client or a counter) for each item in the `contexts` and `artefacts` arrays to ensure stable rendering.

### 3. Lead Manager (owner_agent_id) Field Fix
The "Manager / Lead Agent" field in `HierarchicalExecution.tsx` uses `FormSelect`. Hydration issues here often stem from the `agents` list being empty on the server but populated on the client, or vice versa.
- **Action:** Ensure `availableAgents` are passed correctly from the page level and that the `initialData` matches the expected format.
- **Action:** Wrap the dynamic execution sections in a "client-only" component if they depend on state that is only available after hydration.

### 4. General Hydration Guard
Apply a general pattern for complex form components that interact with browser APIs or dynamic data.
- **Action:** Create a `HydratedOnly` wrapper component to prevent server-side rendering of parts of the form that are known to cause hydration issues due to client-side specific logic.

## Verification & Testing
- **Manual Verification:** Open the Studio Crew form in a browser and check the console for "Hydration failed" or "Text content did not match" errors.
- **Environment:** Test in both development (`npm run dev`) and production build (`npm run build && npm run start`) modes.
- **Specific Scenarios:**
    - Creating a new crew.
    - Editing an existing crew.
    - Switching between "Hierarchical", "Parallel", and "Sequential" types.
