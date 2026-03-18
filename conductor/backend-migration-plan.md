# Plan: Migrate ExternalService and Automation to Workspaces Module

## Objective
Migrate `ExternalService` and `Automation` CRUD logic from `app.modules.resources` to `app.modules.workspaces` to align backend structure with the frontend workspace-centric architecture.

## Proposed Steps
1.  **Domain Update**: Move/Verify `ExternalService` and `Automation` models in `backend/app/modules/workspaces/domain/models.py`.
2.  **Repo Update**: Implement `WorkspaceRepository` methods for `ExternalService` and `Automation` in `backend/app/modules/workspaces/infrastructure/repo.py`.
3.  **App/Service Update**: Add CRUD use cases to `backend/app/modules/workspaces/application/service.py`.
4.  **Interface Update**: Expose new endpoints in `backend/app/modules/workspaces/interface/router.py`.
5.  **Schema Update**: Move/Ensure `Create/Update` schemas exist in `backend/app/modules/workspaces/application/schemas.py`.

## Migration Rules
- Maintain consistency with existing function-first patterns.
- Ensure dependency injection via `WorkspaceRepository`.
- Maintain exact API signatures expected by the frontend.
