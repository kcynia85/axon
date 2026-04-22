import inngest
import os
from uuid import UUID
from app.shared.infrastructure.inngest_client import inngest_client
from app.modules.knowledge.application.indexer import process_and_index_resource
from app.shared.infrastructure.database import AsyncSessionLocal
from app.modules.knowledge.infrastructure.tables import KnowledgeResourceTable
from sqlalchemy import select

# Inbox & Broadcast imports
from app.modules.inbox.infrastructure.repo import InboxRepository
from app.modules.inbox.domain.models import InboxItem
from app.modules.inbox.domain.enums import InboxItemType, InboxItemPriority
from app.shared.infrastructure.inngest_utils import broadcast_via_bridge

@inngest_client.create_function(
    fn_id="knowledge-indexing",
    trigger=inngest.TriggerEvent(event="knowledge/source.uploaded"),
)
async def knowledge_indexing_workflow(ctx: inngest.Context, step: inngest.Step):
    try:
        resource_id = ctx.event.data.get("source_id")
        file_path = ctx.event.data.get("file_path")
        
        if not resource_id or not file_path:
            return {"status": "error", "message": "Missing source_id or file_path"}

        async def get_resource():
            try:
                from app.modules.knowledge.infrastructure.repo import map_resource_to_domain
                async with AsyncSessionLocal() as session:
                    result = await session.execute(
                        select(KnowledgeResourceTable).where(KnowledgeResourceTable.id == UUID(resource_id))
                    )
                    resource_obj = result.scalar_one_or_none()
                    if not resource_obj:
                        raise Exception(f"Resource {resource_id} not found in DB")
                    return map_resource_to_domain(resource_obj).model_dump(mode="json")
            except Exception as e:
                print(f"ERROR IN GET_RESOURCE: {e}")
                raise e

        resource_dict = await step.run("fetch-resource", get_resource)
        
        async def do_index():
            try:
                from app.modules.knowledge.domain.models import KnowledgeResource
                resource = KnowledgeResource(**resource_dict)
                await process_and_index_resource(resource, file_path)
                return True
            except Exception as e:
                print(f"ERROR IN DO_INDEX: {e}")
                raise e

        try:
            await step.run("index-content", do_index)
            
            async def create_inbox_notification():
                async with AsyncSessionLocal() as session:
                    inbox_repo = InboxRepository(session)
                    
                    file_name = resource_dict.get("resource_file_name", "Unknown document")
                    
                    item = InboxItem(
                        item_type=InboxItemType.SYSTEM_MESSAGE,
                        item_priority=InboxItemPriority.NORMAL,
                        item_title="Knowledge Indexed",
                        item_content=f"Resource '{file_name}' has been successfully indexed in RAG#1 knowledge engine.",
                        item_source="Knowledge Engine"
                    )
                    await inbox_repo.create_item(item)
                    return True
            
            await step.run("create-inbox-notification", create_inbox_notification)

            async def broadcast_sync():
                await broadcast_via_bridge("awareness", {
                    "event": "awareness_synchronized", 
                    "entity_id": resource_id, 
                    "entity_type": "knowledge_resource"
                })
                return True
                
            await step.run("broadcast-sync", broadcast_sync)
            
        finally:
            async def cleanup_file():
                if os.path.exists(file_path):
                    os.remove(file_path)
                    return True
                return False
                
            await step.run("cleanup-uploads", cleanup_file)
        
        return {
            "status": "success",
            "resource_id": resource_id,
            "file_name": resource_dict.get("resource_file_name")
        }
    except Exception as main_e:
        import traceback
        traceback.print_exc()
        raise main_e
