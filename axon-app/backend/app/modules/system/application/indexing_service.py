import json
from uuid import UUID
from typing import Dict, Any, Optional
from app.modules.system.infrastructure.repo import SystemEmbeddingRepository
from app.shared.infrastructure.adapters.langchain_adapter import get_llm_adapter

class SystemIndexingService:
    """
    Service responsible for indexing system entities (agents, crews, tools, spaces, etc.) 
    into the system_embeddings table for System Awareness (RAG#2).
    """
    def __init__(self, repo: SystemEmbeddingRepository):
        self.repo = repo
        self.adapter = get_llm_adapter()

    async def index_entity(self, entity_id: UUID, entity_type: str, payload: Dict[str, Any], metadata: Optional[Dict[str, Any]] = None) -> None:
        """
        Converts entity payload to text representation, generates an embedding, 
        and upserts it into the system_embeddings table.
        """
        # Convert the payload to a text representation that captures its semantic meaning
        # We can just dump it to JSON or create a structured string.
        # For better embeddings, a structured string is usually preferred over raw JSON.
        text_representation = self._generate_text_representation(entity_type, payload)
        
        # Generate embedding
        embedding = await self.adapter.get_embeddings(
            text_representation,
            model_name="text-embedding-3-small",
            provider_name="openai",
            dimensions=768
        )
        
        # Upsert embedding
        await self.repo.upsert_embedding(
            entity_id=entity_id,
            entity_type=entity_type,
            embedding=embedding,
            payload=payload,
            metadata=metadata or {}
        )

    async def remove_entity(self, entity_id: UUID, entity_type: str) -> None:
        """
        Removes the entity embedding from the system_embeddings table.
        """
        await self.repo.delete_embedding(entity_id=entity_id, entity_type=entity_type)

    def _generate_text_representation(self, entity_type: str, payload: Dict[str, Any]) -> str:
        """
        Generates a human-readable text representation of the entity for embedding.
        """
        lines = [f"Entity Type: {entity_type}"]
        
        name = payload.get("name") or payload.get("title") or payload.get("display_name")
        if name:
            lines.append(f"Name: {name}")
            
        description = payload.get("description") or payload.get("summary") or payload.get("objective")
        if description:
            lines.append(f"Description: {description}")
            
        # Add other relevant text fields depending on entity type
        if entity_type == "agent":
            role = payload.get("role")
            if role:
                lines.append(f"Role: {role}")
            backstory = payload.get("backstory")
            if backstory:
                lines.append(f"Backstory: {backstory}")
        
        elif entity_type == "tool":
            func_name = payload.get("function_name")
            if func_name:
                lines.append(f"Function Name: {func_name}")
            params = payload.get("parameters")
            if params:
                lines.append(f"Parameters: {json.dumps(params, ensure_ascii=False)}")

        # As a fallback, include a JSON dump of the payload to ensure all data is captured
        lines.append(f"Full Data: {json.dumps(payload, ensure_ascii=False)}")
        
        return "\n".join(lines)
