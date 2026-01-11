---
template_type: crew
---

# Knowledge Migration Guide

> **Role:** Operational Guide for Knowledge Ingestion
> **Target:** Developers & DevOps

## 1. Overview
The Axon Knowledge System uses a **Dual-Path Strategy** to handle different types of knowledge:
1.  **Wisdom (Path A):** Unstructured knowledge (Articles, Notes, Logs) extracted into chunks and stored in a Vector Database (`pgvector`). Used for semantic search and RAG grounding.
2.  **Assets (Path B):** Structured knowledge (Templates, SOPs, Checklists) preserved as full documents. Used for tool-based retrieval (`get_asset`) and precise instantiation.

## 2. Domain Mapping & Source of Truth
The ETL process analyzes the directory structure to assign semantic context (`metadata`).

| Source Path | Domain (`metadata->>domain`) | Type (`metadata->>type`) |
| :--- | :--- | :--- |
| `00. Hubs/*.md` | `meta` | `hub_definition` |
| `01. Product Management/*.md` | `product_management` | `methodology` |
| `02. Discovery/*.md` | `discovery` | `methodology` |
| `03. Design/*.md` | `design` | `methodology` |
| `04. Delivery/*.md` | `delivery` | `methodology` |
| `05. Growth & Market/*.md` | `growth` | `methodology` |
| `Zasoby/Engineering Knowledge Base/**/*.md` | `delivery` | `pattern` |
| `Zasoby/Psychology/**/*.md` | `design` | `psychology` |

## 3. Database Schema
To support the Asset Registry (Path B), the following SQL structure is required (Supabase/Postgres).

### Assets Table
```sql
CREATE TABLE assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,          -- e.g., 'sop-discovery-lite'
  title TEXT NOT NULL,                -- e.g., 'Discovery Lite Checklist'
  content TEXT NOT NULL,              -- FULL Markdown content (no chunking)
  type TEXT NOT NULL,                 -- 'template', 'checklist', 'sop'
  domain TEXT NOT NULL,               -- 'discovery', 'design'
  metadata JSONB DEFAULT '{}',        -- Additional attributes
  description_embedding VECTOR(768)   -- Embedding of title/description ONLY
);

-- Index for fast retrieval by slug (for get_asset tool)
CREATE INDEX idx_assets_slug ON assets(slug);
```

## 4. The Migration Pipeline (`ingest.py`)
The pipeline is located at `backend/app/modules/knowledge/etl/ingest.py`. It uses a **Router Pattern** to classify incoming Markdown files.

### 4.1 Classification Logic
The script scans the target directory (default: `docs/axon-context`) and applies the following rules:

*   **IF** filename contains "Template", "SOP", or "Checklist" (or Polish equivalents like "Szablon"):
    *   **Action:** Treated as **Asset**.
    *   **Storage:** `assets` SQL table.
    *   **Embedding:** Only the `title` and `description` are embedded for search; the `content` is stored as text.
    *   **Key:** `slug` (derived from filename).

*   **ELSE**:
    *   **Action:** Treated as **Wisdom**.
    *   **Processing:** Split into overlapping chunks (1000 chars, 200 overlap).
    *   **Storage:** `knowledge_base` vector collection.
    *   **Embedding:** Each chunk is fully embedded.

## 5. Running the Migration

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

## 6. Agent Tools Integration (Usage)
The system exposes tools for Agents to interact with this data:

1.  **`find_asset(query: str)`**
    *   **Logic:** Vector search on `assets.description_embedding`.
    *   **Use Case:** "Find a template for PRD." -> Returns `[{'slug': 'master-prd-template', ...}]`.

2.  **`get_asset(slug: str)`**
    *   **Logic:** Direct SQL select by slug.
    *   **Use Case:** "Retrieve master-prd-template." -> Returns full markdown content.

## 7. Verification
To verify the data:
1.  **Check Assets:**
    ```sql
    SELECT slug, title, type FROM assets;
    ```
2.  **Check Wisdom:**
    Use the `vecs` client or `search_knowledge` tool in the API.