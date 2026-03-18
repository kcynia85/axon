# Plan: Resolve SQLAlchemy Table Definition Conflict

## Objective
Remove duplicate `ExternalServiceTable`, `ServiceCapabilityTable`, `AutomationTable`, and `AutomationExecutionTable` definitions from the `resources` module, as they have been migrated to the `workspaces` module.

## Proposed Steps
1. **Analyze**: Identify the duplicate definitions in `backend/app/modules/resources/infrastructure/tables.py`.
2. **Remove**: Delete the migrated table classes from `backend/app/modules/resources/infrastructure/tables.py` to allow the application to restart without `InvalidRequestError`.
3. **Verify**: Ensure the application starts correctly.

## Migration Rules
- Ensure no code in `backend/app/modules/resources/application/service.py` still imports these tables directly (it should use the Repo layer).
