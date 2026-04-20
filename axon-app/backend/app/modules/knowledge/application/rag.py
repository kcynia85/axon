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

from app.shared.domain.ports.vector_store import VectorStoreAdapter

class RAGService:
    def __init__(self, session: AsyncSession, vector_store: Optional[VectorStoreAdapter] = None):
        self.session = session
        self.asset_repo = AssetRepository(session)
        self.vector_store = vector_store

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
        Semantic search over Knowledge Base using the active VectorStoreAdapter (Supabase Local).
        """
        all_results = []

        if not self.vector_store:
            logger.error("No active VectorStoreAdapter available for search.")
            return []

        try:
            # Default collection for Knowledge Base
            collection_name = "knowledge_base"
            proxy_results = await self.vector_store.search(
                collection_name=collection_name,
                query=query,
                limit=limit * 2
            )
            
            for res in proxy_results:
                # Filter by hub_id if provided (metadata filtering)
                if hub_id:
                    meta_hubs = res.get("metadata", {}).get("hubIds") or []
                    if hub_id not in meta_hubs:
                        continue
                        
                all_results.append({
                    "id": res.get("id"),
                    "metadata": res.get("metadata", {}),
                    "score": float(res.get("score", 0.0))
                })
        except Exception as e:
            logger.error(f"Search via VectorStoreAdapter failed: {e}")

        # 4. Reranking
        if not all_results: return []
        passages = [{"id": str(r.get("id")), "text": r.get("metadata", {}).get("text") or r.get("metadata", {}).get("content", ""), "meta": r.get("metadata", {})} for r in all_results]
        try:
            valid_passages = [p for p in passages if p["text"].strip()]
            if valid_passages:
                reranked = await asyncio.to_thread(_rerank_sync, query, valid_passages)
                return [{"id": r["id"], "metadata": r["meta"], "score": float(r.get("score", 0.0))} for r in reranked[:limit]]
        except Exception as e:
            logger.error(f"Reranking failed: {e}")
        
        return all_results[:limit]



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
