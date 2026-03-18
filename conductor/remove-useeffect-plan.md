# Plan: Remove useEffect from Draft Autosave Logic

## Objective
Remove `useEffect` from `ServiceStudio`, `AutomationStudio`, and `ArchetypeStudio` components and replace it with a more idiomatic, "Zero useEffect" solution for draft autosave.

## Proposed Solution
1. **Event-Driven Autosave**: Replace the `useEffect` watcher with explicit `onBlur` or `onChange` event handlers passed to the UI components (e.g., `AutomationStudioView`).
2. **Form Submission Refinement**: Ensure the `handleSubmit` process handles final synchronization, and `onBlur` triggers draft saving.
3. **Consistency**: Use a dedicated `handleFieldBlur` or similar prop if necessary, but keep the components "Pure View" as per instructions.

## Implementation Steps
1. **Revert**: Remove the `useEffect` blocks from `ServiceStudio.tsx`, `AutomationStudio.tsx`, and `ArchetypeStudio.tsx`.
2. **Implement Event-Driven Persistence**:
    - Update the `AutomationStudioView`/`ServiceStudioView` to accept `onDraftChange` or similar callbacks on form inputs.
    - Alternatively, leverage React 19's `useActionState` if appropriate, or bind `syncDraft` directly to the `onBlur` event of critical form sections in the View component.
3. **Update Containers**: Ensure containers provide these event handlers.
4. **Verification**: Confirm that drafting still works when interacting with form fields.
