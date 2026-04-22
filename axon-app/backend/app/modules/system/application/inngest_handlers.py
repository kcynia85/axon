import inngest
import httpx
import os
from uuid import UUID
from app.shared.infrastructure.inngest_client import inngest_client
from app.shared.infrastructure.database import AsyncSessionLocal
from app.modules.system.infrastructure.repo import SystemEmbeddingRepository
from app.modules.system.application.indexing_service import SystemIndexingService

# Helper for broadcasting via bridge
async def broadcast_via_bridge(channel: str, message: dict):
    api_url = os.getenv("INTERNAL_API_URL", "http://localhost:8000")
    try:
        async with httpx.AsyncClient() as client:
            await client.post(f"{api_url}/system/internal/broadcast", json={
                "channel": channel,
                "message": message
            })
    except Exception as e:
        print(f"Error calling broadcast bridge: {e}")

@inngest_client.create_function(
    fn_id="system-entity-upserted",
    trigger=inngest.TriggerEvent(event="system.entity.upserted"),
)
async def system_entity_upserted_workflow(ctx: inngest.Context):
    step = ctx.step
    entity_id = ctx.event.data.get("entity_id")
    entity_type = ctx.event.data.get("entity_type")
    payload = ctx.event.data.get("payload")
    metadata = ctx.event.data.get("metadata", {})

    if not entity_id or not entity_type or not payload:
        return {"status": "error", "message": "Missing entity_id, entity_type, or payload"}

    async def index_entity():
        async with AsyncSessionLocal() as session:
            repo = SystemEmbeddingRepository(session)
            service = SystemIndexingService(repo)
            await service.index_entity(
                entity_id=UUID(entity_id),
                entity_type=entity_type,
                payload=payload,
                metadata=metadata
            )
            return True

    await step.run("index-system-entity", index_entity)

    async def broadcast_sync():
        await broadcast_via_bridge("awareness", {
            "event": "awareness_synchronized", 
            "entity_id": entity_id, 
            "entity_type": entity_type
        })
        return True
        
    await step.run("broadcast-sync", broadcast_sync)

    return {"status": "success", "entity_id": entity_id, "entity_type": entity_type}


@inngest_client.create_function(
    fn_id="system-entity-deleted",
    trigger=inngest.TriggerEvent(event="system.entity.deleted"),
)
async def system_entity_deleted_workflow(ctx: inngest.Context):
    step = ctx.step
    entity_id = ctx.event.data.get("entity_id")
    entity_type = ctx.event.data.get("entity_type")

    if not entity_id or not entity_type:
        return {"status": "error", "message": "Missing entity_id or entity_type"}

    async def remove_entity():
        async with AsyncSessionLocal() as session:
            repo = SystemEmbeddingRepository(session)
            service = SystemIndexingService(repo)
            await service.remove_entity(
                entity_id=UUID(entity_id),
                entity_type=entity_type
            )
            return True

    await step.run("remove-system-entity", remove_entity)

    async def broadcast_sync():
        await broadcast_via_bridge("awareness", {
            "event": "awareness_synchronized", 
            "entity_id": entity_id, 
            "entity_type": entity_type,
            "action": "deleted"
        })
        return True
        
    await step.run("broadcast-sync", broadcast_sync)

    return {"status": "success", "entity_id": entity_id, "entity_type": entity_type}
