# Plan: Refactor KnowledgeSource to KnowledgeResource

Refactor the `knowledge` module in the backend to use "Resource" terminology instead of "Source" for better consistency with the frontend and DDD best practices.

## Objective
Rename all occurrences of `KnowledgeSource` to `KnowledgeResource`, including classes, fields, database tables, and API routes.

## Key Files & Context
- **Domain:** `app/modules/knowledge/domain/models.py`, `app/modules/knowledge/domain/enums.py`
- **Infrastructure:** `app/modules/knowledge/infrastructure/tables.py`, `app/modules/knowledge/infrastructure/repo.py`
- **Application:** `app/modules/knowledge/application/service.py`, `app/modules/knowledge/application/schemas.py`, `app/modules/knowledge/application/indexer.py`, `app/modules/knowledge/application/inngest_handlers.py`
- **Interface:** `app/modules/knowledge/interface/router.py`

## Implementation Steps

### 1. Rename Enums & Models
- In `enums.py`:
    - Rename `SourceFileFormat` to `ResourceFileFormat`.
- In `models.py`:
    - Rename `KnowledgeSource` to `KnowledgeResource`.
    - Rename all fields starting with `source_` to `resource_` (e.g., `resource_file_name`).
    - Keep `source_url` in `Memory` as is unless instructed otherwise, as it refers to the origin URL.

### 2. Update Infrastructure Tables
- In `tables.py`:
    - Rename `KnowledgeSourceTable` to `KnowledgeResourceTable`.
    - Change `__tablename__` from `knowledge_sources` to `knowledge_resources`.
    - Rename all columns starting with `source_` to `resource_` (e.g., `resource_file_name`).
    - Update foreign keys and relationships (e.g., `knowledge_source_id` -> `knowledge_resource_id`).
- In `repo.py`:
    - Update all imports and function signatures.
    - Update `map_source_to_domain` to `map_resource_to_domain`.
    - Update all field mappings.
    - Update `delete_knowledge_source` and `update_knowledge_source_status`.
    - Note: Keep `sourceId` in vector metadata for now or plan a migration if needed (it's internal to the vector store).

### 3. Update Application Layer
- In `schemas.py`:
    - Rename `KnowledgeSourceCreate` to `KnowledgeResourceCreate`.
    - Rename `KnowledgeSourceResponse` to `KnowledgeResourceResponse`.
    - Rename all `source_` fields to `resource_`.
- In `service.py`:
    - Update use case names (e.g., `create_knowledge_resource_use_case`).
    - Update internal logic and calls to the repository.
- In `indexer.py`:
    - Update all references to `KnowledgeSource` and its fields.
    - Update logs and print statements.
- In `inngest_handlers.py`:
    - Update event trigger name from `knowledge/source.uploaded` to `knowledge/resource.uploaded`? (Verify if this breaks existing events).
    - Update internal logic.

### 4. Update Interface Layer
- In `router.py`:
    - Update route paths: `/sources` -> `/resources`.
    - Update function names and dependencies.
- In `main.py`:
    - (No change needed if router variable name is the same, but good to check).

### 5. Database Migration
- Since we are in development, we can perform a manual migration or reset the DB if acceptable.
- Proposed SQL:
    ```sql
    ALTER TABLE knowledge_sources RENAME TO knowledge_resources;
    ALTER TABLE knowledge_resources RENAME COLUMN source_file_name TO resource_file_name;
    -- ... and so on for all columns
    ALTER TABLE text_chunks RENAME COLUMN knowledge_source_id TO knowledge_resource_id;
    ```

### 6. Frontend Alignment
- Update `resourcesApi` in `api.ts` to use new endpoints and field names.
- Update `KnowledgeBrowser` and other components to use `resource_` fields instead of `source_`.

## Verification & Testing
- Run `curl` to verify `/knowledge/resources` returns data.
- Test document upload and indexing with the new names.
- Verify the frontend displays data correctly.
- Run existing knowledge tests (if any) after updating them.
