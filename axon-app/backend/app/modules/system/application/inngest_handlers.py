import inngest
import os
import json
from uuid import UUID
from app.shared.infrastructure.inngest_client import inngest_client
from app.shared.infrastructure.database import AsyncSessionLocal
from app.modules.system.infrastructure.repo import SystemEmbeddingRepository
from app.modules.system.application.indexing_service import SystemIndexingService

# Inbox & Broadcast imports
from app.modules.inbox.infrastructure.repo import InboxRepository
from app.modules.inbox.domain.models import InboxItem
from app.modules.inbox.domain.enums import InboxItemType, InboxItemPriority
from app.shared.infrastructure.inngest_utils import broadcast_via_bridge

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

    name = payload.get("name") or payload.get("title") or payload.get("display_name") or "New Entity"

    async def index_entity():
        try:
            async with AsyncSessionLocal() as session:
                repo = SystemEmbeddingRepository(session)
                service = SystemIndexingService(repo)
                await service.index_entity(
                    entity_id=UUID(entity_id),
                    entity_type=entity_type,
                    payload=payload,
                    metadata=metadata
                )
                return {"success": True}
        except Exception as e:
            return {"success": False, "error": str(e)}

    index_result = await step.run("index-system-entity", index_entity)

    async def create_notification():
        async with AsyncSessionLocal() as session:
            inbox_repo = InboxRepository(session)
            
            if index_result.get("success"):
                item = InboxItem(
                    item_type=InboxItemType.SYSTEM_MESSAGE,
                    item_priority=InboxItemPriority.NORMAL,
                    item_title=f"{name} Indexed",
                    item_content=f"Successfully indexed structure.",
                    item_source="System Awareness"
                )
            else:
                # For error: just the name (will be red in UI)
                item = InboxItem(
                    item_type=InboxItemType.ERROR_ALERT,
                    item_priority=InboxItemPriority.HIGH,
                    item_title=name,
                    item_content=f"Error: {index_result.get('error')}",
                    item_source="System Awareness"
                )
            await inbox_repo.create_item(item)
            return True

    await step.run("create-notification", create_notification)

    async def broadcast_sync():
        await broadcast_via_bridge("awareness", {
            "event": "awareness_synchronized", 
            "entity_id": entity_id, 
            "entity_type": entity_type,
            "success": index_result.get("success")
        })
        return True
        
    await step.run("broadcast-sync", broadcast_sync)

    return {"status": "success" if index_result.get("success") else "error", "entity_id": entity_id}


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
        try:
            async with AsyncSessionLocal() as session:
                repo = SystemEmbeddingRepository(session)
                service = SystemIndexingService(repo)
                await service.remove_entity(
                    entity_id=UUID(entity_id),
                    entity_type=entity_type
                )
                return {"success": True}
        except Exception as e:
            return {"success": False, "error": str(e)}

    index_result = await step.run("remove-system-entity", remove_entity)

    async def create_notification():
        async with AsyncSessionLocal() as session:
            inbox_repo = InboxRepository(session)
            item = InboxItem(
                item_type=InboxItemType.SYSTEM_MESSAGE,
                item_priority=InboxItemPriority.NORMAL,
                item_title="Knowledge Removed",
                item_content=f"Removed {entity_type} from agnostic awareness.",
                item_source="System Awareness"
            )
            await inbox_repo.create_item(item)
            return True

    await step.run("create-notification", create_notification)

    async def broadcast_sync():
        await broadcast_via_bridge("awareness", {
            "event": "awareness_synchronized", 
            "entity_id": entity_id, 
            "entity_type": entity_type,
            "action": "deleted",
            "success": index_result.get("success")
        })
        return True
        
    await step.run("broadcast-sync", broadcast_sync)

    return {"status": "success" if index_result.get("success") else "error", "entity_id": entity_id}
