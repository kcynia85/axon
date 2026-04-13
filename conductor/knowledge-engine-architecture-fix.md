# Plan: Knowledge Engine Architecture Fix & Performance Optimization

## Objective
Restore the performance and reliability of the Knowledge Base by separating heavy "Live Discovery" logic from the main list view and improving the file hand-off mechanism between the API and Inngest workers.

## Key Changes

### 1. Backend: Data Infrastructure
- Create a persistent `data/uploads` directory in the backend root to ensure uploaded files remain accessible to Inngest workers until indexing is complete.
- Update `.gitignore` to ignore the contents of `data/uploads`.

### 2. Backend: Repository Refactoring (`repo.py`)
- **Simplify `list_knowledge_sources`**: Revert to a high-performance SQL-only query. This ensures the main Knowledge Base list loads instantly.
- **Isolate Discovery**: Keep `discover_sources_from_all_databases` as a standalone utility for manual sync or background tasks, but remove it from the critical path of the list view.
- **Standardize Status Mapping**: Maintain the Title Case normalization (`Pending`, `Ready`, `Error`) to satisfy Pydantic validation.

### 3. Backend: API & Inngest Integration (`router.py` & `inngest_handlers.py`)
- **Reliable File Storage**: Update `create_knowledge_source` to save files into `data/uploads/` using the `source_id` as part of the filename.
- **Inngest Workflow**:
    - Ensure the indexing workflow receives the correct local path.
    - **Cleanup**: Add a final step to the Inngest workflow to delete the temporary file from `data/uploads/` after successful OR failed indexing to prevent disk bloat.

### 4. Frontend: UX Improvements
- Ensure `KnowledgeBrowser` remains responsive by hitting the now-fast SQL endpoint.
- Maintain the 60-second polling for status updates, which will now be highly efficient.

## Verification & Testing
1. **Performance Test**: Verify that `GET /knowledge/sources` returns in < 100ms.
2. **End-to-End Indexing**:
    - Upload a file via Resource Studio (Drag & Drop).
    - Monitor Inngest Dev Server for successful workflow execution.
    - Verify the "Indeksowanie zakończone" global toast appears.
3. **Multi-DB Verification**: Test specifically with Qdrant and ChromaDB to ensure the simplified logic still correctly triggers the specialized indexers.
