import asyncio
from typing import List, Optional, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from app.modules.knowledge.infrastructure.repo import AssetRepository, search_knowledge_hybrid
from app.modules.knowledge.domain.models import Asset
from flashrank import Ranker, RerankRequest
import logging

try:
    from langfuse.decorators import observe
except ImportError:
    def observe(*args, **kwargs):
        def decorator(func):
            return func
        return decorator

try:
    from langchain_core.retrievers import BaseRetriever
    from langchain_core.documents import Document
    from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
    from langchain_classic.chains import create_history_aware_retriever, create_retrieval_chain
    from langchain_classic.chains.combine_documents import create_stuff_documents_chain
    LANGCHAIN_RAG_AVAILABLE = True
except ImportError:
    LANGCHAIN_RAG_AVAILABLE = False

logger = logging.getLogger(__name__)

# Global lazy-loaded ranker
_ranker_instance = None

def _get_or_create_ranker():
    global _ranker_instance
    if _ranker_instance is None:
        try:
            logger.info("Initializing FlashRank...")
            _ranker_instance = Ranker()
        except Exception as e:
            logger.error(f"Failed to initialize FlashRank: {e}")
            raise e
    return _ranker_instance

def _rerank_sync(query: str, passages: List[dict]) -> List[dict]:
    ranker = _get_or_create_ranker()
    rerank_req = RerankRequest(query=query, passages=passages)
    return ranker.rerank(rerank_req)

if LANGCHAIN_RAG_AVAILABLE:
    class AxonRetriever(BaseRetriever):
        """
        Custom LangChain Retriever that uses Axon's Hybrid Search and Reranking.
        """
        service: Any
        hub_id: Optional[str] = None
        limit: int = 5
        provider_name: Optional[str] = None
        api_key: Optional[str] = None
        embedding_model_name: Optional[str] = None

        def _get_relevant_documents(self, query: str) -> List[Document]:
            # This is synchronous but our search is async. 
            # LangChain prefers async _aget_relevant_documents.
            raise NotImplementedError("Use aget_relevant_documents")

        async def _aget_relevant_documents(self, query: str) -> List[Document]:
            results = await self.service.search_knowledge(
                query=query, 
                hub_id=self.hub_id, 
                limit=self.limit,
                provider_name=self.provider_name,
                api_key=self.api_key,
                embedding_model_name=self.embedding_model_name
            )
            
            docs = []
            for res in results:
                meta = res.get("metadata", {})
                content = meta.get("text", "")
                # Create LangChain Document
                docs.append(Document(
                    page_content=content,
                    metadata={
                        "id": res.get("id"),
                        "score": res.get("score"),
                        **meta
                    }
                ))
            return docs

class RAGService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.asset_repo = AssetRepository(session)

    @observe(name="search_knowledge_base")
    async def search_knowledge(
        self, 
        query: str, 
        hub_id: str = None, 
        limit: int = 5, 
        provider_name: str = None, 
        api_key: str = None,
        embedding_model_name: str = None
    ) -> List[Dict[str, Any]]:
        """
        Semantic search over Knowledge Base with Hybrid Search and Reranking.
        Searches across all configured vector databases.
        """
        from app.modules.settings.infrastructure.tables import VectorDatabaseTable, LLMProviderTable
        from sqlalchemy import select
        from urllib.parse import urlparse
        
        # 1. Fetch all vector databases
        stmt_vdbs = select(VectorDatabaseTable).where(VectorDatabaseTable.deleted_at.is_(None))
        res_vdbs = await self.session.execute(stmt_vdbs)
        vdbs = res_vdbs.scalars().all()
        
        if not vdbs:
            logger.warning("No vector databases configured.")
            return []

        # 2. Group VectorDBs by their embedding configuration
        vdb_groups = {}
        from app.shared.infrastructure.adapters.langchain_adapter import get_llm_adapter
        adapter = get_llm_adapter()

        for vdb in vdbs:
            vdb_model = embedding_model_name or vdb.vector_database_embedding_model_reference
            vdb_provider = provider_name
            if not vdb_provider:
                vdb_provider = "openai" if "openai" in vdb_model.lower() or "text-embedding-3" in vdb_model.lower() else "google"
            
            vdb_api_key = api_key
            if not vdb_api_key:
                stmt_prov = select(LLMProviderTable).where(LLMProviderTable.provider_technical_id.ilike(f"%{vdb_provider}%"))
                res_prov = await self.session.execute(stmt_prov)
                provider_obj = res_prov.scalars().first()
                vdb_api_key = provider_obj.provider_api_key if provider_obj else None

            group_key = (vdb_model, vdb_provider, vdb_api_key)
            if group_key not in vdb_groups: vdb_groups[group_key] = []
            vdb_groups[group_key].append(vdb)

        # 3. Perform search
        all_results = []
        for (model, provider, key), group_vdbs in vdb_groups.items():
            try:
                query_vector = await adapter.get_embeddings(text=query, model_name=model, provider_name=provider, api_key=key)
                if not query_vector: continue

                for vdb in group_vdbs:
                    db_type = str(vdb.vector_database_type.value if hasattr(vdb.vector_database_type, 'value') else vdb.vector_database_type).upper()
                    collection_name = vdb.vector_database_collection_name or "knowledge_base"
                    
                    try:
                        if "CHROMA" in db_type:
                            import chromadb
                            config = vdb.vector_database_config or {}
                            url = vdb.vector_database_connection_url or (f"http://{config.get('chroma_host', 'localhost')}:{config.get('chroma_port', 8000)}" if config.get('chroma_host') else "http://localhost:8000")
                            
                            parsed_url = urlparse(url)
                            if parsed_url.scheme and "http" in parsed_url.scheme:
                                client = chromadb.HttpClient(
                                    host=parsed_url.hostname or "localhost", 
                                    port=parsed_url.port or 8000,
                                    headers={"Authorization": f"Bearer {key}"} if key and "openai" not in provider.lower() else None
                                ) 
                            else:
                                client = chromadb.PersistentClient(path=url)
                            
                            col = client.get_collection(name=collection_name)
                            where_clause = {"hubIds": {"$contains": hub_id}} if hub_id else None
                            
                            chroma_res = col.query(query_embeddings=[query_vector], n_results=limit * 2, where=where_clause)
                            if chroma_res['ids'] and len(chroma_res['ids']) > 0:
                                for i in range(len(chroma_res['ids'][0])):
                                    meta = chroma_res['metadatas'][0][i] or {}
                                    if 'text' not in meta and chroma_res['documents']:
                                        meta['text'] = chroma_res['documents'][0][i]
                                    all_results.append({
                                        "id": chroma_res['ids'][0][i],
                                        "metadata": meta,
                                        "score": 1.0 / (1.0 + (chroma_res['distances'][0][i] if chroma_res['distances'] else 0))
                                    })

                        elif "QDRANT" in db_type:
                            from qdrant_client import QdrantClient
                            from qdrant_client.models import Filter, FieldCondition, MatchValue
                            config = vdb.vector_database_config or {}
                            url = vdb.vector_database_connection_url or config.get("qdrant_url") or "http://localhost:6333"
                            client = QdrantClient(url=url)
                            
                            query_filter = Filter(must=[FieldCondition(key="hubIds", match=MatchValue(value=hub_id))]) if hub_id else None
                            if client.collection_exists(collection_name):
                                # Determine correct method and parameter name
                                if hasattr(client, "query_points"):
                                    qdrant_res = client.query_points(collection_name=collection_name, query=query_vector, limit=limit * 2, query_filter=query_filter)
                                    points = qdrant_res.points
                                else:
                                    qdrant_res = client.search(collection_name=collection_name, query_vector=query_vector, limit=limit * 2, query_filter=query_filter)
                                    points = qdrant_res
                                
                                for r in points:
                                    all_results.append({"id": str(r.id), "metadata": r.payload or {}, "score": r.score})
                                
                        elif "POSTGRES" in db_type or "SUPABASE" in db_type:
                            from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
                            from sqlalchemy.orm import sessionmaker
                            url = vdb.vector_database_connection_url
                            if url:
                                if "postgresql://" in url and "asyncpg" not in url:
                                    url = url.replace("postgresql://", "postgresql+asyncpg://")
                                
                                # asyncpg doesn't support sslmode in URL, it uses ssl=...
                                # Or we can just strip it for now as it's often problematic in local dev
                                if "sslmode=" in url:
                                    from urllib.parse import urlparse, parse_qs, urlunparse
                                    u = urlparse(url)
                                    q = parse_qs(u.query)
                                    q.pop('sslmode', None)
                                    # For Supabase cloud, we might need ssl=True instead
                                    if "supabase.com" in url:
                                        q['ssl'] = ['require']
                                    from urllib.parse import urlencode
                                    url = urlunparse(u._replace(query=urlencode(q, doseq=True)))

                                ext_engine = create_async_engine(url)
                                async with sessionmaker(ext_engine, class_=AsyncSession)() as ext_session:
                                    pg_results = await search_knowledge_hybrid(
                                        session=ext_session, query=query, query_vector=query_vector,
                                        table_name=collection_name, hub_id=hub_id, limit=limit * 2
                                    )
                                    all_results.extend(pg_results)
                                await ext_engine.dispose()
                    except Exception as e:
                        logger.error(f"Search failed for {vdb.vector_database_name}: {e}")
            except Exception as e:
                logger.error(f"Failed search group {model}: {e}")

        # 4. Reranking
        if not all_results: return []
        passages = [{"id": str(r.get("id")), "text": r.get("metadata", {}).get("text") or r.get("metadata", {}).get("content", ""), "meta": r.get("metadata", {})} for r in all_results]
        try:
            valid_passages = [p for p in passages if p["text"].strip()]
            if valid_passages:
                reranked = await asyncio.to_thread(_rerank_sync, query, valid_passages)
                return [{"id": r["id"], "metadata": r["meta"], "score": r.get("score", 0.0)} for r in reranked[:limit]]
        except Exception as e:
            logger.error(f"Reranking failed: {e}")
        return sorted(all_results, key=lambda x: x.get("score", 0.0), reverse=True)[:limit]

    async def query_with_langchain(
        self, 
        query: str, 
        chat_history: List[Any] = None,
        hub_id: str = None,
        model_name: str = "gpt-4o",
        provider_name: str = "openai",
        embedding_model_name: str = "text-embedding-3-small"
    ) -> Dict[str, Any]:
        """
        Advanced RAG implementation using LangChain History-Aware Retrieval.
        Matches the user-provided snippet logic.
        """
        try:
            from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
            from langchain_classic.chains import create_history_aware_retriever, create_retrieval_chain
            from langchain_classic.chains.combine_documents import create_stuff_documents_chain
        except ImportError:
            raise RuntimeError("LangChain RAG components are not available. Please install 'langchain' and 'langchain-community'.")

        from app.shared.infrastructure.adapters.langchain_adapter import get_llm_adapter
        adapter = get_llm_adapter()
        
        # 1. Fetch API Key for Provider
        from app.modules.settings.infrastructure.tables import LLMProviderTable
        from sqlalchemy import select
        stmt = select(LLMProviderTable).where(LLMProviderTable.provider_technical_id.ilike(f"%{provider_name}%"))
        result = await self.session.execute(stmt)
        provider = result.scalars().first()
        api_key = provider.provider_api_key if provider else None
        
        # 2. Initialize LLM
        llm = adapter.get_chat_model(
            model_name=model_name, 
            provider_name=provider_name,
            api_key=api_key,
            temperature=0.3 # Lower temperature for RAG
        )

        # 3. Initialize Retriever
        retriever = AxonRetriever(
            service=self, 
            hub_id=hub_id, 
            limit=5,
            provider_name=provider_name,
            api_key=api_key,
            embedding_model_name=embedding_model_name
        )

        # 4. Contextualize Question Prompt (Logic from snippet)
        contextualize_q_system_prompt = (
            "Given a chat history and the latest user question "
            "which might reference context in the chat history, "
            "formulate a standalone question which can be understood "
            "without the chat history. Do NOT answer the question, just "
            "reformulate it if needed and otherwise return it as is."
        )

        contextualize_q_prompt = ChatPromptTemplate.from_messages([
            ("system", contextualize_q_system_prompt),
            MessagesPlaceholder("chat_history"),
            ("human", "{input}"),
        ])

        history_aware_retriever = create_history_aware_retriever(
            llm, retriever, contextualize_q_prompt
        )

        # 4. QA Prompt (Logic from snippet)
        qa_system_prompt = (
            "You are an assistant for question-answering tasks. Use "
            "the following pieces of retrieved context to answer the "
            "question. If you don't know the answer, just say that you "
            "don't know. Use three sentences maximum and keep the answer "
            "concise."
            "\n\n"
            "{context}"
        )

        qa_prompt = ChatPromptTemplate.from_messages([
            ("system", qa_system_prompt),
            MessagesPlaceholder("chat_history"),
            ("human", "{input}"),
        ])

        # 5. Build Chain
        question_answer_chain = create_stuff_documents_chain(llm, qa_prompt)
        rag_chain = create_retrieval_chain(history_aware_retriever, question_answer_chain)

        # 6. Execute
        response = await rag_chain.ainvoke({
            "input": query,
            "chat_history": chat_history or []
        })

        return {
            "answer": response["answer"],
            "context": response["context"],
            "standalone_question": response.get("input") # The reformulated question
        }

    async def get_cached_response(self, query: str) -> Optional[str]:
        # ... (cached response logic)
        return None # Placeholder for now to keep the snippet clean

    async def search_assets(self, query: str, limit: int = 5) -> List[Asset]:
        from app.shared.infrastructure.adapters.langchain_adapter import get_llm_adapter
        adapter = get_llm_adapter()
        query_vector = await adapter.get_embeddings(query)
        return await self.asset_repo.search_by_vector(query_vector, limit=limit)

    async def get_asset(self, slug: str) -> Optional[Asset]:
        return await self.asset_repo.get_by_slug(slug)
