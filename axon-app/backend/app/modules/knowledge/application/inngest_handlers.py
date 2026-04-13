import inngest
import os
from uuid import UUID
from app.shared.infrastructure.inngest_client import inngest_client
from app.modules.knowledge.application.indexer import process_and_index_resource
from app.shared.infrastructure.database import AsyncSessionLocal
from app.modules.knowledge.infrastructure.tables import KnowledgeResourceTable
from sqlalchemy import select

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
                    # Mode='json' ensures UUIDs and datetimes are serialized for Inngest
                    return map_resource_to_domain(resource_obj).model_dump(mode="json")
            except Exception as e:
                import traceback
                print(f"ERROR IN GET_RESOURCE: {e}")
                traceback.print_exc()
                raise e

        resource_dict = await step.run("fetch-resource", get_resource)
        
        async def do_index():
            try:
                from app.modules.knowledge.domain.models import KnowledgeResource
                # Reconstruct domain model from JSON dict
                resource = KnowledgeResource(**resource_dict)
                await process_and_index_resource(resource, file_path)
                return True
            except Exception as e:
                import traceback
                print(f"ERROR IN DO_INDEX: {e}")
                traceback.print_exc()
                raise e

        try:
            await step.run("index-content", do_index)
            
            async def trigger_toast():
                from app.modules.knowledge.domain.models import KnowledgeResource
                resource = KnowledgeResource(**resource_dict)
                await inngest_client.send(
                    inngest.Event(
                        name="notification/toast.trigger",
                        data={
                            "type": "success",
                            "title": "Indeksowanie zakończone",
                            "message": f"Dokument '{resource.resource_file_name}' został pomyślnie zaindeksowany.",
                            "duration": 5000
                        }
                    )
                )
                return True
                
            await step.run("trigger-toast", trigger_toast)
            
        finally:
            # Cleanup temporary file from data/uploads
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
        print(f"FATAL ERROR IN WORKFLOW: {main_e}")
        traceback.print_exc()
        raise main_e

