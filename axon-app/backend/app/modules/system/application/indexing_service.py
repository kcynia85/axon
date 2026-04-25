import json
import os
from uuid import UUID
from typing import Dict, Any, Optional
from sqlalchemy import select

from app.modules.system.infrastructure.repo import SystemEmbeddingRepository, SystemRepository
from app.modules.system.infrastructure.token_usage_repo import TokenUsageRepository
from app.shared.infrastructure.adapters.langchain_adapter import get_llm_adapter
from app.modules.settings.infrastructure.tables import LLMProviderTable, EmbeddingModelTable
from app.modules.settings.infrastructure.repo import SettingsRepository
from app.shared.utils.tokens import count_tokens

class SystemIndexingService:
    def __init__(self, repo: SystemEmbeddingRepository):
        self.repo = repo
        self.system_repo = SystemRepository(repo.session)
        self.settings_repo = SettingsRepository(repo.session)
        self.token_usage_repo = TokenUsageRepository(repo.session)
        self.adapter = get_llm_adapter()

    async def _ensure_api_key(self, provider_id: Optional[UUID] = None, tech_id: Optional[str] = None) -> Optional[str]:
        # Check env first
        if tech_id == "openai" and os.getenv("OPENAI_API_KEY"):
            return os.getenv("OPENAI_API_KEY")
        if tech_id == "google" and os.getenv("GOOGLE_API_KEY"):
            return os.getenv("GOOGLE_API_KEY")

        try:
            if provider_id:
                provider = await self.settings_repo.get_llm_provider(provider_id)
            else:
                # Default search if no specific provider requested
                stmt = select(LLMProviderTable).where(
                    (LLMProviderTable.provider_technical_id == (tech_id or "openai")) | 
                    (LLMProviderTable.provider_name == (tech_id or "OpenAI"))
                ).limit(1)
                provider = (await self.repo.session.execute(stmt)).scalar_one_or_none()
            
            if provider and getattr(provider, "provider_api_key", None):
                key = provider.provider_api_key
                # Map to env for standard SDKs
                if provider.provider_technical_id == "openai":
                    os.environ["OPENAI_API_KEY"] = key
                elif provider.provider_technical_id == "google":
                    os.environ["GOOGLE_API_KEY"] = key
                return key
        except Exception as e:
            print(f"[IndexingService] Failed to fetch API key from DB: {e}")
        return None

    async def index_entity(self, entity_id: UUID, entity_type: str, payload: Dict[str, Any], metadata: Optional[Dict[str, Any]] = None) -> None:
        print(f"[Awareness] !!! STARTING INDEXING: {entity_type} ({entity_id}) !!!")
        
        # 1. Fetch agnostic settings
        settings = await self.system_repo.get_awareness_settings()
        
        model_id = "text-embedding-3-small"
        provider_name = "openai"
        dimensions = 768
        provider_uuid = None

        if settings and settings.embedding_model_id:
            # Fetch real model config
            model_info = await self.settings_repo.get_embedding_model(settings.embedding_model_id)
            if model_info:
                model_id = model_info.model_id
                provider_name = model_info.model_provider_name.lower()
                dimensions = model_info.model_vector_dimensions or 768
                provider_uuid = model_info.provider_id

        await self._ensure_api_key(provider_id=provider_uuid, tech_id=provider_name)
        
        text_representation = self._generate_text_representation(entity_type, payload)
        tokens_count = count_tokens(text_representation, model_id)
        
        try:
            # Generate embedding using agnostic parameters
            embedding = await self.adapter.get_embeddings(
                text_representation,
                model_name=model_id,
                provider_name=provider_name,
                dimensions=dimensions
            )
            
            # Upsert embedding
            await self.repo.upsert_embedding(
                entity_id=entity_id,
                entity_type=entity_type,
                embedding=embedding,
                payload=payload,
                metadata=metadata or {}
            )

            # Log usage
            await self.token_usage_repo.log_usage(
                model_name=model_id,
                category="awareness",
                tokens_count=tokens_count,
                metadata={"entity_type": entity_type, "entity_id": str(entity_id)}
            )

            print(f"[Awareness] !!! SUCCESS: Indexed {entity_type} {entity_id} using {model_id} ({tokens_count} tk) !!!")
        except Exception as e:
            print(f"[Awareness] !!! FAILED: Indexing {entity_type} {entity_id}: {e} !!!")
            raise e

    async def remove_entity(self, entity_id: UUID, entity_type: str) -> None:
        await self.repo.delete_embedding(entity_id=entity_id, entity_type=entity_type)
        print(f"[Awareness] !!! REMOVED: {entity_type} {entity_id} !!!")

    def _generate_text_representation(self, entity_type: str, payload: Dict[str, Any]) -> str:
        lines = [f"Entity Type: {entity_type}"]
        
        name = payload.get("name") or payload.get("title") or payload.get("display_name")
        if name:
            lines.append(f"Name: {name}")
            
        description = payload.get("description") or payload.get("summary") or payload.get("objective")
        if description:
            lines.append(f"Description: {description}")
            
        # Specific type handling
        if entity_type == "agent":
            role = payload.get("role") or payload.get("agent_role_text")
            if role: lines.append(f"Role: {role}")
            backstory = payload.get("backstory") or payload.get("agent_backstory")
            if backstory: lines.append(f"Backstory: {backstory}")
        
        elif entity_type == "space":
            # Space topology summary
            canvas_data = payload.get("canvas_data", {})
            nodes = canvas_data.get("nodes", [])
            
            zones = [n for n in nodes if n.get("type") == "zone"]
            if zones:
                lines.append("Zones:")
                for z in zones:
                    lines.append(f" - {z.get('data', {}).get('label', 'Unnamed')}")

            entities = [n for n in nodes if n.get("type") in ["agent", "crew", "tool"]]
            if entities:
                lines.append("Entities present in this space: " + ", ".join([e.get("data", {}).get("label", "Unknown") for e in entities]))

        lines.append(f"Full Data: {json.dumps(payload, ensure_ascii=False)}")
        
        return "\n".join(lines)
