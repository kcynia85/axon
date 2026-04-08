import asyncio
from uuid import UUID
from typing import List, Dict, Any
from langchain_text_splitters import RecursiveCharacterTextSplitter

from app.modules.knowledge.domain.models import KnowledgeSource
from app.modules.knowledge.domain.enums import RAGIndexingStatus
from app.modules.knowledge.infrastructure import repo as knowledge_repo
from app.modules.settings.infrastructure.tables import VectorDatabaseTable, EmbeddingModelTable, ChunkingStrategyTable
from app.shared.infrastructure.vecs_client import get_vecs_client
from app.shared.infrastructure.adapters.langchain_adapter import get_llm_adapter
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

async def process_and_index_source(
    session: AsyncSession,
    source: KnowledgeSource,
    content: str
) -> None:
    try:
        # 1. Update status
        await knowledge_repo.update_knowledge_source_status(
            session, source.id, RAGIndexingStatus.INDEXING
        )

        # 2. Get Vector Database Config
        if not source.vector_database_id:
            raise ValueError("Knowledge source does not have a linked vector database")
            
        vector_db = await session.get(VectorDatabaseTable, source.vector_database_id)
        if not vector_db:
            raise ValueError("Linked vector database not found")

        # 3. Get Chunking Strategy Config
        # Determine chunk size and overlap
        chunk_size = 1000
        chunk_overlap = 200
        if source.source_chunking_strategy_ref:
            # Optionally fetch the actual chunking strategy config here if it's an ID
            # Assuming it's an ID for now
            try:
                strategy_uuid = UUID(source.source_chunking_strategy_ref)
                strategy = await session.get(ChunkingStrategyTable, strategy_uuid)
                if strategy:
                    chunk_size = strategy.strategy_chunk_size
                    chunk_overlap = strategy.strategy_chunk_overlap
            except ValueError:
                pass # Not a UUID, fallback to defaults

        # 4. Process Content (LangChain Splitter)
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap,
            length_function=len,
            is_separator_regex=False,
        )
        texts = text_splitter.split_text(content)
        
        # 5. Connect to Vector Store
        vx = get_vecs_client(vector_db.vector_database_connection_url)
        # TODO: VectorDatabaseTable should specify the dimension.
        collection = vx.get_or_create_collection(
            name=vector_db.vector_database_collection_name, 
            dimension=vector_db.vector_database_expected_dimensions or 768
        )

        # 6. Generate Embeddings & Enrich Metadata
        records = []
        adapter = get_llm_adapter()
        
        # Get provider and api_key for the selected embedding model
        stmt = select(EmbeddingModelTable).where(
            EmbeddingModelTable.model_id == vector_db.vector_database_embedding_model_reference
        )
        result = await session.execute(stmt)
        embedding_model = result.scalar_one_or_none()
        
        provider_name = "Google"
        api_key = None
        
        if embedding_model:
            provider_name = embedding_model.model_provider_name
            if embedding_model.provider_id:
                from app.modules.settings.infrastructure.tables import LLMProviderTable
                provider = await session.get(LLMProviderTable, embedding_model.provider_id)
                if provider:
                    api_key = provider.provider_api_key

        for i, chunk in enumerate(texts):
            # Using LangChain Embeddings via LLM adapter
            embedding = await adapter.get_embeddings(
                text=chunk, 
                model_name=vector_db.vector_database_embedding_model_reference,
                provider_name=provider_name,
                dimensions=vector_db.vector_database_expected_dimensions,
                api_key=api_key
            )
            
            # Unified Metadata required by architecture
            metadata = {
                "sourceId": str(source.id),
                "hubIds": [str(source.knowledge_hub_id)] if source.knowledge_hub_id else [],
                "fileType": source.source_file_format,
                "chunkType": source.source_chunking_strategy_ref or "General Text",
                "embeddingModel": vector_db.vector_database_embedding_model_reference,
                "text": chunk
            }
            # Merge user metadata
            metadata.update(source.source_metadata)
            
            records.append(
                (
                    f"{source.id}_{i}", # Vector ID
                    embedding,          # Vector
                    metadata            # Metadata
                )
            )

        # 7. Store Vectors
        if records:
            collection.upsert(records=records)
            
            # 7.1. Create/Ensure Index based on configuration
            from app.modules.settings.domain.enums import IndexMethod
            
            index_method = vector_db.vector_database_index_method or IndexMethod.HNSW
            print(f"Creating/Updating index using method: {index_method}")
            
            try:
                # vecs allows creating index. If it exists, it might skip or update.
                # HNSW is default for high performance.
                collection.create_index(
                    method=index_method.lower() # vecs expects lowercase 'hnsw' or 'ivfflat'
                )
            except Exception as ix_err:
                print(f"Index creation warning (might already exist): {ix_err}")

        # 8. Mark Ready
        await knowledge_repo.update_knowledge_source_status(
            session, source.id, RAGIndexingStatus.READY, chunk_count=len(texts)
        )

    except Exception as e:
        # Fail fast and mark error
        await knowledge_repo.update_knowledge_source_status(
            session, source.id, RAGIndexingStatus.ERROR, error=str(e)
        )
        print(f"Indexing Error: {e}")
