# Knowledge Indexing Pipeline: Analysis and Execution Plan

## Phase 0: Critical Logic Review (Knowledge Studio FIRST)

### Identified Issues, Inconsistencies, and Risks
1. **File Indexing Pipeline Absence**: The entire indexing pipeline is missing from the Knowledge Studio API. The frontend only manages a local state with mock saves, while the backend has a disconnected CLI script (`etl/ingest.py`) with hardcoded Vecs integration and Google ADK embeddings.
2. **Missing Vector Store Integration**: The current frontend lacks any section for selecting a Vector Store, which violates the constraint that "Knowledge Studio MUST require selection of a Vector Store."
3. **Resource Listing (`/resources/knowledge`)**: The `KnowledgeBrowser` in the frontend relies entirely on mock data (`MOCK_RESOURCES`). The `/knowledge/assets` API endpoint is implemented but seems to handle generic assets (prompts/templates) instead of specifically tracked RAG knowledge sources.
4. **Hub Assignment Logic**: The frontend uses a hardcoded list of Hubs. While the backend has a `KnowledgeHubTable` and `KnowledgeSourceTable` defined in `infrastructure/tables.py`, there is no API logic (routers, services, or repository layers) tying them to the file upload or indexing flows.

**Risk Assessment**:
Because the foundational API components for Knowledge Sources and Hubs are mostly unimplemented or entirely mocked, there is no legacy logic to "break." However, we must build the indexing pipeline from scratch while adhering to the Axon architecture (routers -> application services -> repositories).

## Phase 1: Codebase Analysis Summary

1. **Vector Studio (`settings` module)**:
   - Contains `VectorDatabaseTable` which correctly defines `vector_database_embedding_model_reference` and `vector_database_expected_dimensions`.
   - This aligns perfectly with the principle: *"Embedding model belongs to the Vector Store — NOT to the resource."*

2. **Embedding Studio (`settings` module)**:
   - Contains `EmbeddingModelTable` which manages embedding provider configurations.
   - Vector Store instances reference these models.

3. **Knowledge Studio (`knowledge` module)**:
   - The backend `knowledge` module currently has `KnowledgeHubTable`, `KnowledgeSourceTable`, and `TextChunkTable`.
   - The frontend `KnowledgeStudioView` implements a Pure View pattern but needs to be expanded to include Vector Store selection.

4. **LangChain Integration**:
   - Axon has a `LangChainAdapter` behind a feature flag (`FEATURE_LANGCHAIN_ADAPTER`). We will need to leverage LangChain text splitters and embedding interfaces within the `application` layer of the `knowledge` module to fulfill the requirement.

## Phase 2: Execution Plan

### Step 1: Backend Data & API Updates
1. **Vector Database Association**: Add `vector_database_id` to `KnowledgeSourceTable` (or create a link so the indexing process knows which vector store to use).
2. **Endpoints Implementation (`interface/router.py`)**:
   - `GET /knowledge/hubs`: List available hubs.
   - `POST /knowledge/sources/upload`: Handle file upload, store metadata, and initiate the indexing process.
   - `GET /knowledge/sources`: Implement fetching real resources for `/resources/knowledge` browser.
3. **Repository Layer (`infrastructure/repo.py`)**: Implement CRUD operations for Hubs, Sources, and TextChunks.

### Step 2: Frontend Knowledge Studio Updates
1. **Vector Store Selection**: Add a new `FormSection` to `KnowledgeStudioView` allowing the user to select an existing Vector Store. The dropdown will be populated via the Settings API.
2. **Dynamic Hubs**: Fetch Hubs from `GET /knowledge/hubs` instead of using the hardcoded array.
3. **API Integration**: Connect the "Zapisz i Indeksuj" (Save & Index) button to the `POST /knowledge/sources/upload` endpoint.

### Step 3: Indexing Pipeline Implementation
Create `application/indexer.py` (or similar service) responsible for:
1. **Processing Strategy**: Using LangChain `RecursiveCharacterTextSplitter` or other splitters based on the selected `ChunkingStrategy`.
2. **Embedding Generation**: Fetching the `VectorDatabase` configuration to determine the `EmbeddingModel`, and using LangChain's embedding interfaces to vectorize chunks.
3. **Metadata Enrichment**: Ensuring each vector payload includes:
   - `hubIds`
   - `resourceId`
   - `fileType`
   - `embeddingModel`
   - `chunkType`
4. **Vector Storage**: Inserting the enriched vectors into the configured Vector Store via the unified backend infrastructure.

### Step 4: Retrieval and Filtering
Ensure that the `search_vector_store` utility supports filtering by the metadata (`hubIds`, `resourceId`) to satisfy the unified vector storage constraint.
