import os
from uuid import UUID
from typing import Optional
from langchain_text_splitters import RecursiveCharacterTextSplitter

from app.modules.knowledge.domain.models import KnowledgeResource
from app.modules.knowledge.domain.enums import RAGIndexingStatus
from app.modules.knowledge.infrastructure import repo as knowledge_repo
from app.modules.settings.infrastructure.tables import VectorDatabaseTable, EmbeddingModelTable, ChunkingStrategyTable, LLMProviderTable
from app.shared.infrastructure.vecs_client import get_vecs_client
from app.shared.infrastructure.adapters.langchain_adapter import get_llm_adapter
from app.modules.system.infrastructure.token_usage_repo import TokenUsageRepository
from app.shared.utils.tokens import count_tokens
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.modules.knowledge.etl.extractor import extract_documents
from app.modules.knowledge.etl.preprocessor import clean_text
from app.shared.utils.time import now_utc

from app.shared.infrastructure.database import AsyncSessionLocal

async def simulate_chunking(file_path: str, strategy_id: Optional[str], session: AsyncSession):
    """Simulates chunking for a given file and strategy."""
    from app.modules.settings.infrastructure.tables import ChunkingStrategyTable
    from app.modules.knowledge.etl.extractor import extract_documents
    from app.modules.knowledge.etl.preprocessor import clean_text
    from langchain_text_splitters import RecursiveCharacterTextSplitter
    from uuid import UUID

    # 1. Get Strategy Config
    chunk_size = 1000
    chunk_overlap = 200
    if strategy_id:
        try:
            strategy_uuid = UUID(strategy_id)
            strategy = await session.get(ChunkingStrategyTable, strategy_uuid)
            if strategy:
                chunk_size = strategy.strategy_chunk_size
                chunk_overlap = strategy.strategy_chunk_overlap
        except (ValueError, AttributeError, TypeError):
            pass

    # 2. Extract and Process Content
    docs = extract_documents(file_path)
    combined_text = "\n\n".join([doc.page_content for doc in docs])
    cleaned_content = clean_text(combined_text)

    # 3. Chunk
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
        separators=["\n\n", "\n", ".", " ", ""]
    )
    chunks = splitter.split_text(cleaned_content)
    
    return chunks[:10], len(chunks) # Return first 10 for preview

async def process_and_index_resource(
    resource: KnowledgeResource,
    file_path: str
) -> None:
    async with AsyncSessionLocal() as session:
        try:
            # 1. Update status
            await knowledge_repo.update_knowledge_resource_status(
                session, resource.id, RAGIndexingStatus.INDEXING
            )

            # 2. Get Vector Database Config (Task 1: Dynamic Payload)
            vdb_config = resource.resource_metadata.get("vector_database_config")
            
            vector_db = None
            db_api_key = None
            
            if vdb_config:
                # Use provided config from Task 1 payload
                from dataclasses import dataclass
                @dataclass
                class MockVdb:
                    vector_database_name: str
                    vector_database_connection_url: str
                    vector_database_collection_name: str
                    vector_database_expected_dimensions: int
                    vector_database_index_method: str
                    vector_database_embedding_model_reference: str
                    vector_database_config: dict

                vector_db = MockVdb(
                    vector_database_name=vdb_config.get("name"),
                    vector_database_connection_url=vdb_config.get("connection_url"),
                    vector_database_collection_name=vdb_config.get("collection_name"),
                    vector_database_expected_dimensions=vdb_config.get("dimensions"),
                    vector_database_index_method=vdb_config.get("index_method"),
                    vector_database_embedding_model_reference=vdb_config.get("embedding_model"),
                    vector_database_config=vdb_config
                )
                db_api_key = vdb_config.get("chroma_api_key") or vdb_config.get("api_key")
            elif resource.vector_database_id:
                vector_db = await session.get(VectorDatabaseTable, resource.vector_database_id)
            
            if not vector_db:
                # Fallback
                stmt = select(VectorDatabaseTable).limit(1)
                result = await session.execute(stmt)
                vector_db = result.scalar_one_or_none()

            if not vector_db:
                raise ValueError("No Vector Database configured.")

            # 3. Get Chunking Strategy Config
            chunk_size = 1000
            chunk_overlap = 200
            if resource.resource_chunking_strategy_ref:
                try:
                    strategy_uuid = UUID(resource.resource_chunking_strategy_ref)
                    strategy = await session.get(ChunkingStrategyTable, strategy_uuid)
                    if strategy:
                        chunk_size = strategy.strategy_chunk_size
                        chunk_overlap = strategy.strategy_chunk_overlap
                except (ValueError, AttributeError):
                    pass

            # 4. Extract and Process Content
            docs = extract_documents(file_path)
            combined_text = "\n\n".join([doc.page_content for doc in docs])
            cleaned_content = clean_text(combined_text)

            token_usage_repo = TokenUsageRepository(session)
            total_knowledge_tokens = 0

            # 4.1 Auto-Tagging
            auto_tags = []
            try:
                import json
                # Używamy wybranego adaptera zamiast sztywnego GoogleADK
                adapter = get_llm_adapter()
                prompt = f"Analyze the following text and extract 3 to 5 relevant tags/keywords. Return ONLY a JSON list of strings. Text: {cleaned_content[:3000]}"
                
                # Count prompt tokens
                total_knowledge_tokens += count_tokens(prompt, "gpt-4o-mini") # Heuristic for tagging
                
                tags_response = await adapter.generate_content(prompt)
                
                if isinstance(tags_response, str):
                    total_knowledge_tokens += count_tokens(tags_response, "gpt-4o-mini")
                    clean_resp = tags_response.replace('```json', '').replace('```', '').strip()
                    if clean_resp:
                        auto_tags = json.loads(clean_resp)
                elif isinstance(tags_response, list):
                    auto_tags = tags_response
                
                if not isinstance(auto_tags, list):
                    auto_tags = []
            except Exception as e:
                print(f"Auto-tagging skipped or failed: {e}")

            text_splitter = RecursiveCharacterTextSplitter(
                chunk_size=chunk_size,
                chunk_overlap=chunk_overlap,
                length_function=len,
                is_separator_regex=False,
            )
            texts = text_splitter.split_text(cleaned_content)
            
            # 5. Connect to Vector Store and Store Vectors
            
            # Detect DB Type from vector_db metadata or object
            db_type_val = getattr(vector_db, 'vector_database_type', None)
            if hasattr(db_type_val, 'value'):
                db_type_val = db_type_val.value
            
            db_type = str(db_type_val).upper() if db_type_val else ""
            
            db_name_attr = getattr(vector_db, 'vector_database_name', "") or ""
            if not db_type:
                 if "CHROMA" in db_name_attr.upper():
                     db_type = "CHROMADB"
                 else:
                     db_type = "POSTGRES_PGVECTOR"

            print(f"DEBUG INDEXER: Detected db_type='{db_type}' for db_name='{db_name_attr}'")

            # Resolve Config
            db_config = getattr(vector_db, 'vector_database_config', {}) or {}
            
            # Resolve URL
            connection_url = getattr(vector_db, 'vector_database_connection_url', None)
            if not connection_url and db_config:
                if db_config.get("chroma_host") and db_config.get("chroma_port"):
                    connection_url = f"http://{db_config.get('chroma_host')}:{db_config.get('chroma_port')}"
                else:
                    connection_url = db_config.get("chroma_url") or db_config.get("url") or db_config.get("connection_url")

            # Resolve API Key for Chroma/External
            if not db_api_key:
                db_api_key = db_config.get("chroma_api_key") or db_config.get("api_key")

            records = []
            adapter = get_llm_adapter()
            
            # 6. Generate Embeddings Provider Info
            # Zmieniamy domyślny provider na OpenAI, jeśli nie został wykryty inaczej
            provider_name = "OpenAI" 
            api_key = None
            embedding_model_ref = vector_db.vector_database_embedding_model_reference
            
            print(f"DEBUG INDEXER: Initial provider={provider_name}, model_ref={embedding_model_ref}")
            
            # Robust Provider & API Key Resolution
            stmt = select(EmbeddingModelTable).where(
                EmbeddingModelTable.model_id == embedding_model_ref
            )
            result = await session.execute(stmt)
            embedding_model = result.scalar_one_or_none()
            
            if embedding_model:
                provider_name = embedding_model.model_provider_name
                print(f"DEBUG INDEXER: Found model in DB, provider updated to {provider_name}")
                if embedding_model.provider_id:
                    provider = await session.get(LLMProviderTable, embedding_model.provider_id)
                    if provider:
                        api_key = provider.provider_api_key
            else:
                # Heuristic fallback
                if embedding_model_ref and ("gemini" in embedding_model_ref.lower() or "google" in embedding_model_ref.lower()):
                    provider_name = "Google"
                elif not embedding_model_ref or "text-embedding" in embedding_model_ref.lower():
                    provider_name = "OpenAI"
                
                print(f"DEBUG INDEXER: Model not in DB, using heuristic provider={provider_name}")

                if provider_name == "OpenAI":
                    # Try to find an OpenAI provider to get its key
                    p_stmt = select(LLMProviderTable).where(LLMProviderTable.provider_technical_id.ilike("%openai%"))
                    p_res = await session.execute(p_stmt)
                    p_obj = p_res.scalars().first()
                    if p_obj: 
                        api_key = p_obj.provider_api_key
                        print("DEBUG INDEXER: Found OpenAI API key in DB")
            
            print(f"DEBUG INDEXER: Final Decision -> Provider: {provider_name}, Model: {embedding_model_ref}")

            creation_timestamp = now_utc().isoformat()

            if "CHROMA" in db_type:
                # --- CHROMADB BRANCH ---
                import chromadb
                from urllib.parse import urlparse
                
                print(f"DEBUG INDEXER: Entering ChromaDB branch with URL='{connection_url}' and Provider='{provider_name}'")
                
                if not connection_url:
                    raise ValueError(f"Missing connection URL for ChromaDB (Type: {db_type}, Name: {db_name_attr})")

                # Parse URL to get host/port
                parsed_url = urlparse(connection_url)
                
                # Create Client
                if parsed_url.scheme and "http" in parsed_url.scheme:
                    chroma_client = chromadb.HttpClient(
                        host=parsed_url.hostname or "localhost",
                        port=parsed_url.port or 8000,
                        headers={"Authorization": f"Bearer {db_api_key}"} if db_api_key else None
                    )
                else:
                    # Fallback to local persistent client if URL is just a path
                    chroma_client = chromadb.PersistentClient(path=connection_url)

                # Get or Create Collection
                collection_name = vector_db.vector_database_collection_name or "knowledge_base"
                chroma_collection = chroma_client.get_or_create_collection(name=collection_name)

                # Prepare Data
                ids = []
                embeddings = []
                metadatas = []
                documents = []

                for i, chunk in enumerate(texts):
                    # Use adapter for embeddings
                    total_knowledge_tokens += count_tokens(chunk, embedding_model_ref)
                    embedding = await adapter.get_embeddings(
                        text=chunk, 
                        model_name=embedding_model_ref,
                        provider_name=provider_name,
                        dimensions=vector_db.vector_database_expected_dimensions,
                        api_key=api_key
                    )
                    
                    # Construct metadata - ChromaDB requirements: 
                    # 1. No empty lists in metadata values.
                    # 2. Values must be simple types or non-empty lists.
                    # 3. No nested dictionaries.
                    metadata = {
                        "sourceId": str(resource.id),
                        "fileType": resource.resource_file_format,
                        "file_name": resource.resource_file_name,
                        "chunk_index": i,
                        "chunkType": str(resource.resource_chunking_strategy_ref or "General Text"),
                        "embeddingModel": str(embedding_model_ref),
                        "created_at": creation_timestamp,
                        "vector_db_name": str(vector_db.vector_database_name)
                    }
                    
                    if resource.knowledge_hub_id:
                        metadata["hubIds"] = [str(resource.knowledge_hub_id)]
                        
                    if auto_tags and len(auto_tags) > 0:
                        metadata["auto_tags"] = auto_tags
                        
                    # Flatten resource_metadata and exclude 'vector_database_config' (nested dict)
                    temp_meta = {}
                    original_meta = resource.resource_metadata or {}
                    for k, v in original_meta.items():
                        if k == "vector_database_config": continue # Skip nested dict
                        if isinstance(v, list) and len(v) == 0: continue # Skip empty lists
                        if isinstance(v, (str, int, float, bool, list)) or v is None:
                            temp_meta[k] = v
                            
                    temp_meta.update(metadata)
                    
                    ids.append(f"{resource.id}_{i}")
                    embeddings.append(embedding)
                    metadatas.append(temp_meta)
                    documents.append(chunk)
                    records.append((f"{resource.id}_{i}", embedding, temp_meta))

                # Upsert to Chroma
                if ids:
                    chroma_collection.upsert(
                        ids=ids,
                        embeddings=embeddings,
                        metadatas=metadatas,
                        documents=documents
                    )

            elif "QDRANT" in db_type:
                # --- QDRANT BRANCH ---
                from qdrant_client import QdrantClient
                from qdrant_client.models import VectorParams, Distance, PointStruct
                import uuid

                print(f"DEBUG INDEXER: Entering Qdrant branch with URL='{connection_url}'")
                
                if db_config.get("qdrant_url"):
                    qdrant_url = db_config.get("qdrant_url")
                    qdrant_key = db_config.get("qdrant_api_key")
                    qdrant_client = QdrantClient(url=qdrant_url, api_key=qdrant_key)
                elif connection_url:
                    qdrant_client = QdrantClient(url=connection_url)
                else:
                    qdrant_client = QdrantClient(url="http://localhost:6333")

                collection_name = vector_db.vector_database_collection_name or "knowledge_base"
                expected_dim = vector_db.vector_database_expected_dimensions or 768
                
                # Ensure collection exists
                if not qdrant_client.collection_exists(collection_name):
                    qdrant_client.create_collection(
                        collection_name=collection_name,
                        vectors_config=VectorParams(size=expected_dim, distance=Distance.COSINE),
                    )

                points = []
                for i, chunk in enumerate(texts):
                    # Use adapter for embeddings
                    total_knowledge_tokens += count_tokens(chunk, embedding_model_ref)
                    embedding = await adapter.get_embeddings(
                        text=chunk, 
                        model_name=embedding_model_ref,
                        provider_name=provider_name,
                        dimensions=expected_dim,
                        api_key=api_key
                    )
                    
                    metadata = {
                        "sourceId": str(resource.id),
                        "fileType": resource.resource_file_format,
                        "file_name": resource.resource_file_name,
                        "chunk_index": i,
                        "chunkType": str(resource.resource_chunking_strategy_ref or "General Text"),
                        "embeddingModel": str(embedding_model_ref),
                        "created_at": creation_timestamp,
                        "vector_db_name": str(vector_db.vector_database_name),
                        "text": chunk
                    }
                    
                    if resource.knowledge_hub_id:
                        metadata["hubIds"] = [str(resource.knowledge_hub_id)]
                        
                    if auto_tags and len(auto_tags) > 0:
                        metadata["auto_tags"] = auto_tags
                        
                    temp_meta = (resource.resource_metadata or {}).copy()
                    temp_meta.update(metadata)
                    
                    # Generate a valid UUID for Qdrant point ID
                    point_id = str(uuid.uuid5(uuid.NAMESPACE_DNS, f"{resource.id}_{i}"))
                    
                    points.append(PointStruct(id=point_id, vector=embedding, payload=temp_meta))
                    records.append((f"{resource.id}_{i}", embedding, temp_meta))

                if points:
                    qdrant_client.upsert(
                        collection_name=collection_name,
                        points=points
                    )

            else:
                # --- PGVECTOR (VECS) BRANCH ---
                print(f"DEBUG INDEXER: Entering PGVector branch with URL='{connection_url}' and Provider='{provider_name}'")
                vx = get_vecs_client(connection_url)
                expected_dim = vector_db.vector_database_expected_dimensions or 768
                
                collection = vx.get_or_create_collection(
                    name=vector_db.vector_database_collection_name, 
                    dimension=expected_dim
                )

                for i, chunk in enumerate(texts):
                    # Use adapter for embeddings
                    total_knowledge_tokens += count_tokens(chunk, embedding_model_ref)
                    embedding = await adapter.get_embeddings(
                        text=chunk, 
                        model_name=embedding_model_ref,
                        provider_name=provider_name,
                        dimensions=vector_db.vector_database_expected_dimensions,
                        api_key=api_key
                    )
                    
                    metadata = {
                        "sourceId": str(resource.id),
                        "hubIds": [str(resource.knowledge_hub_id)] if resource.knowledge_hub_id else [],
                        "fileType": resource.resource_file_format,
                        "file_name": resource.resource_file_name,
                        "chunk_index": i,
                        "chunkType": resource.resource_chunking_strategy_ref or "General Text",
                        "embeddingModel": embedding_model_ref,
                        "text": chunk,
                        "created_at": creation_timestamp,
                        "auto_tags": auto_tags,
                        "deleted_at": None,
                        "vector_db_name": vector_db.vector_database_name
                    }
                    # Preserve user metadata
                    temp_meta = (resource.resource_metadata or {}).copy()
                    temp_meta.update(metadata)
                    
                    records.append((f"{resource.id}_{i}", embedding, temp_meta))

                # Store Vectors in pgvector
                if records:
                    collection.upsert(records=records)
                    
                    from app.modules.settings.domain.enums import IndexMethod
                    index_method = vector_db.vector_database_index_method or IndexMethod.HNSW
                    try:
                        collection.create_index(method=index_method.lower())
                    except Exception as ix_err:
                        print(f"Index warning: {ix_err}")

            # 7.2 Store relational chunks (Common for both)
            if records:
                # Log total usage for this indexing operation
                await token_usage_repo.log_usage(
                    model_name=embedding_model_ref or "unknown",
                    category="knowledge",
                    tokens_count=total_knowledge_tokens,
                    metadata={"resource_id": str(resource.id), "file_name": resource.resource_file_name}
                )
                
                from app.modules.knowledge.infrastructure.tables import TextChunkTable
                from uuid import uuid4
                from sqlalchemy import delete as sql_delete
                
                await session.execute(
                    sql_delete(TextChunkTable).where(TextChunkTable.knowledge_resource_id == resource.id)
                )

                for i, chunk in enumerate(texts):
                    emb = records[i][1]
                    # Relational table 'text_chunks' has a fixed 768 vector column. 
                    # If model is OpenAI (1536), we skip embedding storage in relational table to avoid crash.
                    # specialized Vector DB (Chroma/pgvector collection) already has the full data.
                    if len(emb) != 768:
                        emb = None

                    db_chunk = TextChunkTable(
                        id=uuid4(),
                        chunk_index=i,
                        chunk_text=chunk,
                        chunk_embedding=emb,
                        chunk_metadata={"auto_tags": auto_tags, "sourceId": str(resource.id)},
                        knowledge_resource_id=resource.id,
                        created_at=now_utc()
                    )
                    session.add(db_chunk)
                
                await session.commit()

            # 8. Mark Ready
            await knowledge_repo.update_knowledge_resource_status(
                session, resource.id, RAGIndexingStatus.READY, chunk_count=len(texts)
            )

        except Exception as e:
            import traceback
            error_trace = traceback.format_exc()
            await knowledge_repo.update_knowledge_resource_status(
                session, resource.id, RAGIndexingStatus.ERROR, error=f"{str(e)}\n{error_trace}"
            )
            print(f"Indexing Error: {e}\n{error_trace}")
        finally:
            if os.path.exists(file_path):
                try:
                    os.remove(file_path)
                except Exception as e:
                    print(f"Failed to delete temp file: {e}")
