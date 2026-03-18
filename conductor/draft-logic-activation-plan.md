# Plan: Enable Drafting Logic for Service, Automation, and Archetype

## Objective
Implement application-level logic to handle drafting for the new entities (`Service`, `Automation`, `Archetype`). This involves creating generic hooks/services for localStorage/Query management, similar to `useTemplateDraft`.

## Key Files & Context
- `frontend/src/modules/studio/domain/index.ts`: Source of entities.
- `frontend/src/modules/studio/features/template-studio/application/hooks/useTemplateDraft.ts`: Reference implementation.

## Proposed Solution
1. **Create Generic Drafting Hook**: Implement `useEntityDraft` in `frontend/src/modules/studio/application/hooks/useEntityDraft.ts` to support different entity types.
2. **Standardize Drafting Key**: Use a consistent naming convention for storage keys (e.g., `axon_draft_[entityType]_[id]`).
3. **Draft Services**: Create specialized services if needed for more complex drafting (e.g., auto-save).

## Implementation Steps
1. **Define Entity Types**: Update `useEntityDraft` to accept a generic type and an entity name prefix.
2. **Create useEntityDraft Hook**:
   - Location: `frontend/src/modules/studio/application/hooks/useEntityDraft.ts`
   - Functionality: `load`, `save`, `clear` using TanStack Query + LocalStorage.
3. **Register Hooks**: Export the new hooks from a central application index.
4. **Update Entities**: Ensure `is_draft: true` is set by default in the domain schemas (already done).

## Verification & Testing
- Unit test for the hook logic (mocking localStorage).
- Manual verification of draft persistence across page reloads.
