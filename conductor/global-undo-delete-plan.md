# Global Delete with Undo Implementation Plan

This plan implements a "Delete with Undo" pattern across all entities in the Axon application. Entities will disappear immediately from the UI, and a 10-second toast will allow the user to undo the action.

## Steps

1.  **Zustand Store**: Create `frontend/src/shared/lib/store/usePendingDeletionsStore.ts` to track IDs of items that are hidden but not yet deleted.
2.  **Shared Hook**: Create `frontend/src/shared/hooks/useDeleteWithUndo.ts` to manage the 10-second timer and `sonner` toast.
3.  **UI Interception**: Update `WorkspaceCard` and `WorkspaceCardHorizontal` to return `null` if their `resourceId` is in the `pendingDeletions` store. This provides a "global" fix for visibility.
4.  **Component Migration**: Update `handleDelete` in all relevant components (Automations, Agents, Crews, etc.) to use `deleteWithUndo` instead of showing a confirmation modal.
5.  **Refinement**: Remove `DestructiveDeleteModal` from components where the undo pattern replaces it.

## Verification
- Click delete on any card.
- Verify it disappears instantly.
- Verify 10s toast appears with "Undo".
- Click "Undo" -> Verify item reappears.
- Wait 10s -> Verify item is permanently deleted (API call).
