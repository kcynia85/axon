# Knowledge Migration Guide

> **Role:** Operational Guide for Knowledge Ingestion
> **Target:** Developers & DevOps

## 1. Overview
The Axon Knowledge System uses a **Dual-Path Strategy** to handle different types of knowledge:
1.  **Wisdom (Path A):** Unstructured knowledge (Articles, Notes, Logs) extracted into chunks and stored in a Vector Database (`pgvector`). Used for semantic search and RAG grounding.
2.  **Assets (Path B):** Structured knowledge (Templates, SOPs, Checklists) preserved as full documents. Used for tool-based retrieval (`get_asset`) and precise instantiation.
    > **Note:** Many Templates, SOPs, or Checklists might not have explicit prefixes/suffixes in their filenames. Robust ingestion should inspect the file content (e.g., frontmatter `type: template` or specific headers) to correctly classify them, rather than relying solely on filenames.

## 2. The Migration Pipeline (`ingest.py`)
The pipeline is located at `backend/app/modules/knowledge/etl/ingest.py`. It uses a **Router Pattern** to classify incoming Markdown files.

### 2.1 Classification Logic
The script scans the target directory (default: `docs/axon-context`) and applies the following rules:

*   **IF** filename contains "Template", "SOP", or "Checklist":
    *   **Action:** Treated as **Asset**.
    *   **Storage:** `assets` SQL table.
    *   **Embedding:** Only the `title` and `description` are embedded for search; the `content` is stored as text.
    *   **Key:** `slug` (derived from filename).

*   **ELSE**:
    *   **Action:** Treated as **Wisdom**.
    *   **Processing:** Split into overlapping chunks (1000 chars, 200 overlap).
    *   **Storage:** `knowledge_base` vector collection.
    *   **Embedding:** Each chunk is fully embedded.

## 3. Running the Migration

### Prerequisites
*   Backend environment set up (`uv`).
*   Database running (Supabase).
*   `GOOGLE_API_KEY` set in `.env` (for embeddings).

### Execution
Run the script from the project root or backend directory:

```bash
# From project root
cd backend
export PYTHONPATH=$PYTHONPATH:$(pwd)
uv run app/modules/knowledge/etl/ingest.py
```

### Output
The script logs its progress to stdout:
```text
Starting ingestion from: docs/axon-context
Found 15 files.
Ingested Asset: prd-template
Processing Wisdom: meetings-log.md
  -> Upserted 5 chunks.
...
```

## 4. Source Directory Structure
The script expects a structure similar to:

```text
docs/axon-context/
├── 00. Hubs/
├── 01. Product Management/
│   ├── PRD-Template.md       <- Becomes Asset
│   └── Discovery-Notes.md    <- Becomes Wisdom
├── 02. Delivery/
│   └── SOP-Deployment.md     <- Becomes Asset
└── ...
```

## 5. Idempotency & Updates
*   **Assets:** The script checks for existing slugs. If found, it skips (currently) or updates (if modified logic is added). *Current implementation skips duplicates.*
*   **Wisdom:** Vector upserts are idempotent based on ID, but since IDs are UUIDs generated at runtime, re-running will duplicate chunks unless the collection is cleared.
    *   **Recommendation:** Truncate the `knowledge_base` collection before a full re-import.

## 6. Verification
To verify the data:
1.  **Check Assets:**
    ```sql
    SELECT slug, title, type FROM assets;
    ```
2.  **Check Wisdom:**
    Use the `vecs` client or `search_knowledge` tool in the API.
