# Plan: Fix Database Schema Mismatch

## Objective
The database schema for `external_services` and `automations` is out of sync with the application code. The code defines `deleted_at`, but the physical database table lacks this column.

## Proposed Steps
1. **Analyze**: Identify the database state using `alembic` or direct SQL inspection.
2. **Corrective Action**: Since I cannot easily run `alembic upgrade`, I will temporarily adjust the `Table` definitions in `backend/app/modules/workspaces/infrastructure/tables.py` to match the existing database state (remove `deleted_at`) to restore service functionality.
3. **Future Proofing**: Recommend running the migration script or generate the necessary alembic migration to add the column in a proper way.

## Migration Rules
- Ensure code strictly matches the physical database schema until migrations are applied.
