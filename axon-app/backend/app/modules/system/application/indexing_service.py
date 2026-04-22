import json
import os
from uuid import UUID
from typing import Dict, Any, Optional
from sqlalchemy import select

from app.modules.system.infrastructure.repo import SystemEmbeddingRepository
from app.shared.infrastructure.adapters.langchain_adapter import get_llm_adapter
from app.modules.settings.infrastructure.tables import LLMProviderTable

class SystemIndexingService:
    def __init__(self, repo: SystemEmbeddingRepository):
        self.repo = repo
        self.adapter = get_llm_adapter()

    async def _ensure_api_key(self) -> Optional[str]:
        if os.getenv("OPENAI_API_KEY"):
            return os.getenv("OPENAI_API_KEY")
        try:
            stmt = select(LLMProviderTable).where(
                (LLMProviderTable.provider_technical_id == "openai") | 
                (LLMProviderTable.provider_name == "OpenAI")
            ).limit(1)
            provider = (await self.repo.session.execute(stmt)).scalar_one_or_none()
            if provider and getattr(provider, "provider_api_key", None):
                key = provider.provider_api_key
                os.environ["OPENAI_API_KEY"] = key
                return key
        except Exception as e:
            print(f"[IndexingService] Failed to fetch API key from DB: {e}")
        return None

    async def index_entity(self, entity_id: UUID, entity_type: str, payload: Dict[str, Any], metadata: Optional[Dict[str, Any]] = None) -> None:
        print(f"[Awareness] !!! STARTING INDEXING: {entity_type} ({entity_id}) !!!")
        await self._ensure_api_key()
        text_representation = self._generate_text_representation(entity_type, payload)
        try:
            embedding = await self.adapter.get_embeddings(
                text_representation,
                model_name="text-embedding-3-small",
                provider_name="openai",
                dimensions=768
            )
            await self.repo.upsert_embedding(
                entity_id=entity_id,
                entity_type=entity_type,
                embedding=embedding,
                payload=payload,
                metadata=metadata or {}
            )
            print(f"[Awareness] !!! SUCCESS: Indexed {entity_type} {entity_id} !!!")
        except Exception as e:
            print(f"[Awareness] !!! FAILED: Indexing {entity_type} {entity_id}: {e} !!!")
            raise e

    async def remove_entity(self, entity_id: UUID, entity_type: str) -> None:
        await self.repo.delete_embedding(entity_id=entity_id, entity_type=entity_type)
        print(f"[Awareness] !!! REMOVED: {entity_type} {entity_id} !!!")

    def _generate_text_representation(self, entity_type: str, payload: Dict[str, Any]) -> str:
        lines = [f"Entity Type: {entity_type}"]
        name = payload.get("name") or payload.get("title") or payload.get("display_name")
        if name: lines.append(f"Name: {name}")
        description = payload.get("description") or payload.get("summary") or payload.get("objective")
        if description: lines.append(f"Description: {description}")
        lines.append(f"Full Data: {json.dumps(payload, ensure_ascii=False)}")
        return "\n".join(lines)
