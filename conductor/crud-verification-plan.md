# Plan: CRUD Verification for Service, Automation, and Archetype

## Objective
Verify CRUD operations for `Service`, `Automation`, and `Archetype` to ensure the new domain entities correctly integrate with the workspace API and maintain draft consistency.

## Key Files & Context
- `frontend/src/modules/studio/features/*/application/use*Studio.ts`: Logic entry points.
- `frontend/src/modules/workspaces/application/use*.ts`: API hooks.

## Proposed Solution
1. **API Integration Test**: Create a reproduction/verification script for each entity type to ensure end-to-end CRUD (Create, Read, Update, Delete) flow.
2. **Draft Persistence Test**: Validate that drafts persist correctly in localStorage and are cleared upon successful API submission.
3. **Consistency Check**: Ensure entity-specific fields are correctly mapped between UI and API.

## Implementation Steps
1. **Identify API Hooks**: Locate `useServices`, `useAutomations`, and `usePromptArchetypes` implementations.
2. **CRUD Verification Script**: Write a `verify_crud.spec.ts` update (or new spec) using Playwright to test the UI flow for these entities.
3. **Manual Validation**: Perform manual create/update/delete cycle for each, observing `localStorage` and network requests.

## Verification
- API returns expected 200/201 status codes.
- Local storage clears after `handleSubmit` success.
- UI reflects entity updates immediately.
