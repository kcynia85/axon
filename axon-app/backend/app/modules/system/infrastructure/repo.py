from uuid import uuid4, UUID
from typing import Optional, List, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, delete
from app.modules.system.domain.models import MetaAgent, VoiceMetaAgent, SystemAwarenessSearchResult, SystemAwarenessSettings
from app.modules.system.domain.enums import VoiceInteractionMode
from app.modules.system.infrastructure.tables import MetaAgentTable, VoiceMetaAgentTable, SystemEmbeddingTable, SystemAwarenessSettingsTable

class SystemRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    # --- Meta Agent ---

    async def get_meta_agent(self) -> Optional[MetaAgent]:
        result = await self.session.execute(select(MetaAgentTable).limit(1))
        row = result.scalar_one_or_none()
        if row:
            return MetaAgent(
                id=row.id,
                meta_agent_system_prompt=row.meta_agent_system_prompt,
                meta_agent_temperature=row.meta_agent_temperature,
                meta_agent_rag_enabled=row.meta_agent_rag_enabled,
                meta_agent_system_knowledge_rags=row.meta_agent_system_knowledge_rags or [],
                llm_model_id=row.llm_model_id
            )
        return None

    async def upsert_meta_agent(self, data: dict) -> MetaAgent:
        existing = await self.get_meta_agent()
        if existing:
            stmt = update(MetaAgentTable).where(MetaAgentTable.id == existing.id).values(**data)
            await self.session.execute(stmt)
        else:
            # Defaults for creation if missing
            new_agent = MetaAgentTable(
                id=uuid4(),
                meta_agent_system_prompt=data.get("meta_agent_system_prompt", "You are Axon."),
                meta_agent_temperature=data.get("meta_agent_temperature", 0.7),
                meta_agent_rag_enabled=data.get("meta_agent_rag_enabled", True),
                meta_agent_system_knowledge_rags=data.get("meta_agent_system_knowledge_rags", []),
                llm_model_id=data.get("llm_model_id")
            )
            self.session.add(new_agent)
        
        await self.session.commit()
        return (await self.get_meta_agent())

    # --- Voice Meta Agent ---

    async def get_voice_meta_agent(self) -> Optional[VoiceMetaAgent]:
        result = await self.session.execute(select(VoiceMetaAgentTable).limit(1))
        row = result.scalar_one_or_none()
        if row:
            return VoiceMetaAgent(
                id=row.id,
                voice_provider=row.voice_provider,
                interaction_mode=row.interaction_mode,
                provider_config=row.provider_config or {},
                meta_agent_system_prompt=row.meta_agent_system_prompt,
                meta_agent_temperature=row.meta_agent_temperature
            )
        return None

    async def upsert_voice_meta_agent(self, data: dict) -> VoiceMetaAgent:
        existing = await self.get_voice_meta_agent()
        if existing:
            stmt = update(VoiceMetaAgentTable).where(VoiceMetaAgentTable.id == existing.id).values(**data)
            await self.session.execute(stmt)
        else:
             # Ensure mandatory fields are present or defaulted
             new_voice = VoiceMetaAgentTable(
                 id=uuid4(),
                 voice_provider=data.get("voice_provider"),
                 interaction_mode=data.get("interaction_mode", VoiceInteractionMode.LIVE_CONVERSATION),
                 provider_config=data.get("provider_config", {}),
                 meta_agent_system_prompt=data.get("meta_agent_system_prompt", ""),
                 meta_agent_temperature=data.get("meta_agent_temperature", 0.7)
             )
             self.session.add(new_voice)
        
        await self.session.commit()
        return (await self.get_voice_meta_agent())

    # --- System Awareness Settings ---

    async def get_awareness_settings(self) -> Optional[SystemAwarenessSettings]:
        result = await self.session.execute(select(SystemAwarenessSettingsTable).limit(1))
        row = result.scalar_one_or_none()
        if row:
            return SystemAwarenessSettings(
                id=row.id,
                embedding_model_id=row.embedding_model_id,
                indexing_enabled=row.indexing_enabled,
                realtime_sync_enabled=row.realtime_sync_enabled
            )
        return None

    async def upsert_awareness_settings(self, data: dict) -> SystemAwarenessSettings:
        existing = await self.get_awareness_settings()
        if existing:
            stmt = update(SystemAwarenessSettingsTable).where(SystemAwarenessSettingsTable.id == existing.id).values(**data)
            await self.session.execute(stmt)
        else:
            new_settings = SystemAwarenessSettingsTable(
                id=uuid4(),
                embedding_model_id=data.get("embedding_model_id"),
                indexing_enabled=data.get("indexing_enabled", True),
                realtime_sync_enabled=data.get("realtime_sync_enabled", True)
            )
            self.session.add(new_settings)
        
        await self.session.commit()
        return (await self.get_awareness_settings())

class SystemEmbeddingRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def upsert_embedding(
        self,
        entity_id: UUID,
        entity_type: str,
        embedding: List[float],
        payload: Dict[str, Any],
        metadata: Dict[str, Any]
    ) -> None:
        """Upsert a system embedding for a given entity."""
        stmt = select(SystemEmbeddingTable).where(
            SystemEmbeddingTable.entity_id == entity_id,
            SystemEmbeddingTable.entity_type == entity_type
        )
        result = await self.session.execute(stmt)
        row = result.scalar_one_or_none()

        if row:
            # Update
            update_stmt = update(SystemEmbeddingTable).where(
                SystemEmbeddingTable.id == row.id
            ).values(
                embedding=embedding,
                payload=payload,
                metadata_=metadata
            )
            await self.session.execute(update_stmt)
        else:
            # Insert
            new_embedding = SystemEmbeddingTable(
                id=uuid4(),
                entity_id=entity_id,
                entity_type=entity_type,
                embedding=embedding,
                payload=payload,
                metadata_=metadata
            )
            self.session.add(new_embedding)
        
        await self.session.commit()

    async def delete_embedding(self, entity_id: UUID, entity_type: str) -> None:
        """Delete an embedding for a specific entity."""
        stmt = delete(SystemEmbeddingTable).where(
            SystemEmbeddingTable.entity_id == entity_id,
            SystemEmbeddingTable.entity_type == entity_type
        )
        await self.session.execute(stmt)
        await self.session.commit()

    async def list_embeddings(self, limit: int = 100, offset: int = 0) -> List[Dict[str, Any]]:
        """List all system embeddings for the Settings UI."""
        stmt = select(
            SystemEmbeddingTable.id,
            SystemEmbeddingTable.entity_id,
            SystemEmbeddingTable.entity_type,
            SystemEmbeddingTable.payload,
            SystemEmbeddingTable.updated_at
        ).order_by(SystemEmbeddingTable.updated_at.desc()).limit(limit).offset(offset)
        
        result = await self.session.execute(stmt)
        rows = result.all()
        
        return [
            {
                "id": str(row.id),
                "entity_id": str(row.entity_id),
                "entity_type": row.entity_type,
                "payload": row.payload,
                "updated_at": row.updated_at.isoformat() if row.updated_at else None
            }
            for row in rows
        ]

    async def search_similar(
        self,
        query_embedding: List[float],
        limit: int = 5,
        threshold: float = 0.7,
        entity_type: Optional[str] = None
    ) -> List[SystemAwarenessSearchResult]:
        """Search for similar system embeddings using cosine distance."""
        # Using cosine distance (<=>). Similarity = 1 - distance
        distance = SystemEmbeddingTable.embedding.cosine_distance(query_embedding)
        similarity = (1 - distance).label("similarity_score")
        
        stmt = select(SystemEmbeddingTable, similarity)
        
        if entity_type:
            stmt = stmt.where(SystemEmbeddingTable.entity_type == entity_type)
            
        stmt = stmt.where(similarity >= threshold).order_by(distance).limit(limit)
        
        result = await self.session.execute(stmt)
        rows = result.all()
        
        results = []
        for row, sim_score in rows:
            results.append(
                SystemAwarenessSearchResult(
                    entity_id=row.entity_id,
                    entity_type=row.entity_type,
                    payload=row.payload or {},
                    similarity_score=sim_score
                )
            )
        return results

