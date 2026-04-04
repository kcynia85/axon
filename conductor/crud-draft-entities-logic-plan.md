# Plan: Full CRUD + Draft for Embedding Models and Chunking Strategies

Adding Create, Read, Update, Delete and Draft capabilities to Embedding Models and Chunking Strategies across the full stack.

## 1. Backend Changes

### 1.1 Database Schema (`infrastructure/tables.py`)
- [ ] Add `is_draft` column to `EmbeddingModelTable`.
- [ ] Add `is_draft` column to `ChunkingStrategyTable`.

### 1.2 Domain Models (`domain/models.py`)
- [ ] Add `is_draft` field to `EmbeddingModel`.
- [ ] Add `is_draft` field to `ChunkingStrategy`.

### 1.3 Application Schemas (`application/schemas.py`)
- [ ] Add `UpdateEmbeddingModelRequest`.
- [ ] Add `UpdateChunkingStrategyRequest`.
- [ ] Add `is_draft` to Create and Response schemas for both entities.

### 1.4 Infrastructure Repository (`infrastructure/repo.py`)
- [ ] Implement `get_embedding_model(id)`.
- [ ] Implement `update_embedding_model(id, data)`.
- [ ] Implement `get_chunking_strategy(id)`.
- [ ] Implement `update_chunking_strategy(id, data)`.

### 1.5 Application Service (`application/service.py`)
- [ ] Implement `get_embedding_model(id)`.
- [ ] Implement `update_embedding_model(id, request)`.
- [ ] Implement `get_chunking_strategy(id)`.
- [ ] Implement `update_chunking_strategy(id, request)`.

### 1.6 API Interface (`interface/router.py`)
- [ ] Add `GET /embedding-models/{id}`.
- [ ] Add `PATCH /embedding-models/{id}`.
- [ ] Add `GET /chunking-strategies/{id}`.
- [ ] Add `PATCH /chunking-strategies/{id}`.

### 1.7 Database Migration
- [ ] Create and run Alembic migration to add `is_draft` columns.

## 2. Frontend Changes

### 2.1 Domain Definitions (`shared/domain/settings.ts`)
- [ ] Update `EmbeddingModelSchema` and `ChunkingStrategySchema` to include `is_draft`.

### 2.2 Infrastructure API (`modules/settings/infrastructure/api.ts`)
- [ ] Add `getEmbeddingModel(id)`.
- [ ] Add `updateEmbeddingModel(id, data)`.
- [ ] Add `getChunkingStrategy(id)`.
- [ ] Add `updateChunkingStrategy(id, data)`.

### 2.3 Application Hooks (`modules/settings/application/useSettings.ts`)
- [ ] Add `useEmbeddingModel(id)`.
- [ ] Add `useUpdateEmbeddingModel()`.
- [ ] Add `useChunkingStrategy(id)`.
- [ ] Add `useUpdateChunkingStrategy()`.

### 2.4 UI - Embedding Studio (`modules/studio/features/embedding-studio/ui/EmbeddingStudioView.tsx`)
- [ ] Add "Zapisz Szkic" button.
- [ ] Update logic to handle Draft saving.

### 2.5 UI - Chunking Studio (`modules/studio/features/chunking-studio/ui/ChunkingStudioView.tsx`)
- [ ] Add "Zapisz Szkic" button.
- [ ] Update logic to handle Draft saving.

### 2.6 UI - Lists
- [ ] Update `EmbeddingModelsList.tsx` and `ChunkingStrategiesList.tsx` to visually distinguish drafts.

## 3. Verification & Testing
- [ ] Verify creation of both entities as Drafts and as Final.
- [ ] Verify updating existing entities.
- [ ] Verify deleting both drafts and final entities.
- [ ] Verify that Drafts are correctly filtered or marked in the UI.
