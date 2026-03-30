# Plan: Fixing Hydration and Data Flow in Router Studio

The goal is to ensure that "Router Studio" (the editor) correctly loads existing data, saves changes back to the backend, and that these changes are immediately reflected in the "Router Browser" (list/sidepeek).

## Problems Identified
1.  **Missing API/Hook**: No way to fetch a single router by ID.
2.  **Mocked Save**: `RouterStudioContainer` has a `TODO` instead of actual save logic.
3.  **Schema Mismatch**: `RouterFormData` (Studio) is more complex than `LLMRouter` (Shared Schema).
4.  **No Hydration**: The edit page doesn't fetch initial data, leading to an empty form.

## Proposed Changes

### 1. Update Infrastructure
-   **File**: `axon-app/frontend/src/modules/settings/infrastructure/api.ts`
    -   Add `getLLMRouter(id: string)` method.
-   **File**: `axon-app/frontend/src/modules/settings/application/useSettings.ts`
    -   Add `useLLMRouter(id: string)` hook.

### 2. Connect Router Studio to Backend
-   **File**: `axon-app/frontend/src/modules/studio/features/router-studio/ui/RouterStudioContainer.tsx`
    -   Use `useLLMRouter(routerId)` to fetch initial data.
    -   Use `useUpdateLLMRouter` / `useCreateLLMRouter` in `handleSave`.
    -   Implement mapping between `LLMRouter` and `RouterFormData`.

### 3. Fix Hydration in Edit Page
-   **File**: `axon-app/frontend/src/app/(studio)/settings/llms/routers/[id]/page.tsx`
    -   (Optional but recommended) Change to Server Component if SSR is desired, or keep as Client Component but ensure it handles the loading state of the hook correctly. *Decision: Keep as Client Component for now to avoid refactoring the entire Studio layout, but ensure the hook provides the data.*

### 4. Mapping Logic
-   **LLMRouter -> RouterFormData**:
    -   `router_alias` -> `name`
    -   `router_strategy` -> `strategy` (mapped to lowercase)
    -   `primary_model_id` -> first item in `priority_chain`
    -   `fallback_model_id` -> second item in `priority_chain` (if exists)
-   **RouterFormData -> LLMRouter**:
    -   Reverse of the above.

## Verification Plan
1.  Open an existing router in the Studio. Verify form is pre-filled.
2.  Edit the router and save. Verify toast success.
3.  Verify the router list/sidepeek reflects the changes.
4.  Check for any hydration warnings in the console.
