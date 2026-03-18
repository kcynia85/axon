# Plan: Cleanup Resources Infrastructure Repository

## Objective
Remove orphaned imports and usages of `ExternalServiceTable`, `AutomationTable`, and `ServiceCapabilityTable` from `backend/app/modules/resources/infrastructure/repo.py` to fix `ImportError`.

## Proposed Steps
1. **Analyze**: Identify all references to migrated tables in `backend/app/modules/resources/infrastructure/repo.py`.
2. **Remove**: Delete these methods and imports.
3. **Verify**: Ensure the backend initializes without `ImportError`.
