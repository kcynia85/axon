# RAG Knowledge Pipeline Implementation Plan

## Objective
Design and implement a fully optimized RAG Knowledge pipeline in the Axon codebase, covering ingestion, preprocessing, chunking, embeddings, metadata, storage, hybrid retrieval, reranking, semantic caching, and user feedback.

## Architecture & Decisions
- **Ingestion:** Local `unstructured` Python library for handling complex formats (PDF, DOCX, HTML, Markdown).
- **Caching:** `SemanticCacheTable` in PostgreSQL using `pgvector` for storing and retrieving LLM responses (similarity > 0.95).
- **Hybrid Search:** Native PostgreSQL combining `pgvector` (semantic) and `tsvector` (Full-Text Search) within a single SQL query, using manual Reciprocal Rank Fusion (RRF) to keep logic in the database and minimize dependencies.
- **Reranking:** Local `FlashRank` for compressing top 20 retrieved results down to the 3 most relevant contexts.
- **Hub Filtering:** Strict `knowledge_hub_id` scoping applied *before* vector similarity search.
- **Feedback:** User 👍/👎 feedback stored in a new `KnowledgeFeedbackTable` linked to specific chunks/queries for evaluation (e.g., using Langfuse).

## Key Files & Context
- **Backend:** `axon-app/backend/app/modules/knowledge/` (`etl/ingest.py`, `application/indexer.py`, `application/rag.py`, `infrastructure/repo.py`, `infrastructure/tables.py`)
- **Frontend:** `axon-app/frontend/src/modules/studio/features/knowledge-studio/`

---

## Phase 1: Environment & Schema Updates
1. **Dependencies:** Add `unstructured`, `flashrank`, and optionally `langfuse` to `pyproject.toml` (managed by `uv`).
2. **Schema Additions (`tables.py`):**
   - Create `SemanticCacheTable` (id, query, query_embedding, response, metadata, created_at).
   - Create `KnowledgeFeedbackTable` (id, query, response, feedback_type, chunk_ids, user_id).
3. **Migrations:** Generate and apply Alembic migration for the new tables.

## Phase 2: Ingestion & Preprocessing
1. **Extractor (`knowledge/etl/extractor.py`):**
   - Implement extraction using `unstructured.partition.auto.partition`.
2. **Preprocessor (`knowledge/etl/preprocessor.py`):**
   - Implement functions to remove footers, licenses, normalize whitespace, and deduplicate repetitive banners.
3. **Integration (`knowledge/etl/ingest.py`):** Hook the extractor and preprocessor into the existing ingestion flow.

## Phase 3: Chunking & Metadata Enrichment
1. **Chunking (`indexer.py`):**
   - Ensure the chunking logic respects `ChunkingStrategyTable` parameters.
   - Use structure-aware splitters operating on the cleaned text from Phase 2.
2. **Metadata (`indexer.py` & `metadata_extractor.py`):**
   - Extract dynamic metadata (e.g., creation timestamp, inferred topics) during ingestion.
   - Implement auto-tagging logic (lightweight LLM call to generate tags for the document).
   - Store metadata in the JSONB `chunk_metadata` column.

## Phase 4: Hybrid Search & Reranking
1. **Hybrid Retrieval (`repo.py` / `rag.py`):**
   - Implement Native PostgreSQL RRF query.
   - The query will perform a `pgvector` similarity search and a `tsvector` FTS match, applying strict metadata filtering on `knowledge_hub_id`.
   - Merge the results using the RRF algorithm in SQL.
2. **Reranking (`rag.py`):**
   - Add `FlashRank` to re-score the top 20 results from the hybrid search.
   - Return the top 3 results to the LLM context.

## Phase 5: Semantic Caching
1. **Cache Layer (`rag.py` / `repo.py`):**
   - Before executing the full retrieval pipeline, embed the user query.
   - Query `SemanticCacheTable` for `query_embedding` with cosine similarity > 0.95.
   - If a match is found, return the cached response immediately.
   - If not found, proceed with generation and insert the new response into the cache.

## Phase 6: User Feedback Loop
1. **Endpoints (`interface/router.py`):**
   - Create `POST /feedback` (or update existing) to log user ratings (👍/👎).
2. **Storage (`repo.py`):**
   - Insert feedback into `KnowledgeFeedbackTable`, associating it with the query and the specific chunks used.

## Verification & Testing
- Validate each step independently: verify `unstructured` parsing, check metadata JSONB structure, ensure vector + FTS SQL RRF results are merged correctly, confirm FlashRank picks the most relevant docs, and test cache hits/misses.
