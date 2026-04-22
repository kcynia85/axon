import logging
from uuid import UUID, uuid4
from typing import List, Optional, Any
import inngest

from app.modules.resources.infrastructure.repo import ResourcesRepository
from app.modules.resources.domain.models import (
    PromptArchetype, ExternalService, ServiceCapability, InternalTool, Automation
)
from app.modules.resources.application.schemas import (
    CreatePromptArchetypeRequest, UpdatePromptArchetypeRequest,
    CreateExternalServiceRequest, UpdateExternalServiceRequest, CreateCapabilityRequest,
    CreateAutomationRequest, TestPayload, SimulatorResultResponse, SyncResultResponse, SyncRemoteToolRequest
)
from app.modules.resources.application.tools_scanner import ToolsScannerService
from app.modules.resources.domain.enums import ValidationStatus, ToolCategory
from app.shared.utils.time import now_utc
from app.shared.infrastructure.inngest_client import inngest_client

logger = logging.getLogger(__name__)

class ResourcesService:
    def __init__(self, repo: ResourcesRepository):
        self.repo = repo
        self.scanner = ToolsScannerService()

    async def _trigger_indexing(self, entity_id: UUID, entity_type: str, payload: dict):
        await inngest_client.send(
            inngest.Event(
                name="system.entity.upserted",
                data={
                    "entity_id": str(entity_id),
                    "entity_type": entity_type,
                    "payload": payload
                }
            )
        )

    async def _trigger_deletion(self, entity_id: UUID, entity_type: str):
        await inngest_client.send(
            inngest.Event(
                name="system.entity.deleted",
                data={
                    "entity_id": str(entity_id),
                    "entity_type": entity_type
                }
            )
        )

    # --- Prompt Archetypes ---

    async def create_prompt_archetype(self, request: CreatePromptArchetypeRequest) -> PromptArchetype:
        archetype = PromptArchetype(
            id=uuid4(),
            archetype_name=request.archetype_name,
            archetype_description=request.archetype_description,
            archetype_role=request.archetype_role,
            archetype_goal=request.archetype_goal,
            archetype_backstory=request.archetype_backstory,
            archetype_guardrails=request.archetype_guardrails,
            archetype_knowledge_hubs=request.archetype_knowledge_hubs,
            archetype_keywords=request.archetype_keywords,
            workspace_domain=request.workspace_domain,
            created_at=now_utc(),
            updated_at=now_utc()
        )
        created = await self.repo.create_prompt_archetype(archetype)
        await self._trigger_indexing(created.id, "prompt_archetype", created.model_dump(mode="json"))
        return created

    async def list_prompt_archetypes(self) -> List[PromptArchetype]:
        return await self.repo.list_prompt_archetypes()

    async def get_prompt_archetype(self, id: UUID) -> Optional[PromptArchetype]:
        return await self.repo.get_prompt_archetype(id)

    async def update_prompt_archetype(self, id: UUID, request: UpdatePromptArchetypeRequest) -> Optional[PromptArchetype]:
        update_data = request.model_dump(exclude_unset=True)
        updated = await self.repo.update_prompt_archetype(id, update_data)
        if updated:
            await self._trigger_indexing(updated.id, "prompt_archetype", updated.model_dump(mode="json"))
        return updated

    async def delete_prompt_archetype(self, id: UUID) -> bool:
        success = await self.repo.delete_prompt_archetype(id)
        if success:
            await self._trigger_deletion(id, "prompt_archetype")
        return success

    # --- External Services ---

    async def create_external_service(self, request: CreateExternalServiceRequest) -> ExternalService:
        service_id = uuid4()
        capabilities = [
            ServiceCapability(
                id=uuid4(),
                capability_name=cap.capability_name,
                capability_description=cap.capability_description,
                external_service_id=service_id,
                created_at=now_utc(),
                updated_at=now_utc()
            ) for cap in request.capabilities
        ]
        
        service = ExternalService(
            id=service_id,
            service_name=request.service_name,
            service_description=request.service_description,
            service_category=request.service_category,
            service_url=request.service_url,
            service_keywords=request.service_keywords,
            availability_workspace=request.availability_workspace,
            capabilities=capabilities,
            created_at=now_utc(),
            updated_at=now_utc()
        )
        created = await self.repo.create_external_service(service)
        # External services can also be indexed
        await self._trigger_indexing(created.id, "external_service", created.model_dump(mode="json"))
        return created

    async def list_external_services(self) -> List[ExternalService]:
        return await self.repo.list_external_services()

    async def get_external_service(self, id: UUID) -> Optional[ExternalService]:
        return await self.repo.get_external_service(id)

    async def update_external_service(self, id: UUID, request: UpdateExternalServiceRequest) -> Optional[ExternalService]:
        update_data = request.model_dump(exclude_unset=True, exclude={"capabilities"})
        
        # Handle capabilities update if provided
        if request.capabilities is not None:
            # For simplicity, we'll replace all capabilities
            # In a real app, you might want to sync them (update/create/delete)
            new_capabilities = [
                ServiceCapability(
                    id=uuid4(),
                    capability_name=cap.capability_name,
                    capability_description=cap.capability_description,
                    external_service_id=id,
                    created_at=now_utc(),
                    updated_at=now_utc()
                ) for cap in request.capabilities
            ]
            await self.repo.sync_service_capabilities(id, new_capabilities)
            
        updated = await self.repo.update_external_service(id, update_data)
        if updated:
            await self._trigger_indexing(updated.id, "external_service", updated.model_dump(mode="json"))
        return updated

    async def delete_external_service(self, id: UUID) -> bool:
        success = await self.repo.delete_external_service(id)
        if success:
            await self._trigger_deletion(id, "external_service")
        return success

    async def add_service_capability(self, service_id: UUID, request: CreateCapabilityRequest) -> ServiceCapability:
        capability = ServiceCapability(
            id=uuid4(),
            capability_name=request.capability_name,
            capability_description=request.capability_description,
            external_service_id=service_id,
            created_at=now_utc()
        )
        return await self.repo.add_service_capability(capability)

    # --- Internal Tools ---

    async def list_internal_tools(self) -> List[InternalTool]:
        return await self.repo.list_internal_tools()

    async def sync_remote_tool(self, request: SyncRemoteToolRequest) -> SyncResultResponse:
        """
        Receives a tool from the remote dev environment, saves it, and triggers a sync.
        Uses absolute path to avoid issues with current working directory.
        """
        from pathlib import Path
        import logging
        
        logger = logging.getLogger(__name__)
        
        # service.py is in app/modules/resources/application/
        # we need to go up 4 levels to get to the root 'backend' folder
        base_dir = Path(__file__).resolve().parent.parent.parent.parent.parent
        tools_dir = base_dir / "app" / "tools"
        
        logger.info(f"Syncing remote tool {request.file_name} to {tools_dir}")
        logger.info(f"Content length: {len(request.file_content)} bytes")
        
        if not request.file_content:
            logger.error("Received empty file content for sync")
            return SyncResultResponse(
                added=0, updated=0, removed=0,
                errors=[f"Received empty file content for {request.file_name}"]
            )
        
        try:
            if not tools_dir.exists():
                logger.info(f"Creating tools directory: {tools_dir}")
                tools_dir.mkdir(parents=True, exist_ok=True)
                
            file_path = tools_dir / request.file_name
            
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(request.file_content)
                
            logger.info(f"Successfully saved tool file: {file_path} ({len(request.file_content)} bytes)")
        except Exception as e:
            logger.error(f"Failed to save tool file: {str(e)}")
            return SyncResultResponse(
                added=0, updated=0, removed=0,
                errors=[f"Failed to save file {request.file_name}: {str(e)}"]
            )
            
        return await self.sync_tools(status_override=request.status)

    async def sync_tools(self, status_override: Optional[str] = None) -> SyncResultResponse:
        """
        Scans the codebase for tools and updates the database.
        Deactivates tools that are no longer present in the codebase.
        """
        import logging
        logger = logging.getLogger(__name__)
        
        # 1. Scan tools
        discovered_tools_data = self.scanner.scan_tools()
        logger.info(f"Discovered {len(discovered_tools_data)} tools in codebase")
        
        added = 0
        updated = 0
        removed = 0
        errors = []
        
        # Track which function names we found in the codebase
        discovered_func_names = [t["tool_function_name"] for t in discovered_tools_data]

        # 2. Update/Insert in DB
        if discovered_tools_data:
            for tool_data in discovered_tools_data:
                try:
                    # Check if tool already exists to count added vs updated
                    existing_tools = await self.repo.list_internal_tools()
                    existing_func_names = [t.tool_function_name for t in existing_tools]
                    
                    is_new = tool_data["tool_function_name"] not in existing_func_names

                    # We need to adapt the data to match what the repo expects
                    # Use override if provided, otherwise check tool_data, otherwise default
                    final_status = status_override or tool_data.get("status") or "production"
                    
                    tool = InternalTool(
                        id=uuid4(),
                        tool_function_name=tool_data["tool_function_name"],
                        tool_display_name=tool_data["name"],
                        tool_description=tool_data["description"] or "No description",
                        tool_category=ToolCategory.AI_UTILS, # Default category
                        tool_keywords=tool_data.get("keywords", ["python", "synced"]),
                        tool_input_schema=tool_data["args_schema"] or {},
                        tool_output_schema={"type": "string"}, # Default output schema
                        tool_is_active=True,
                        tool_status=final_status,
                        availability_workspace=["Global Availability"],
                        created_at=now_utc(),
                        updated_at=now_utc()
                    )
                    upserted = await self.repo.upsert_internal_tool(tool)
                    
                    # Trigger indexing for the tool
                    await self._trigger_indexing(upserted.id, "tool", upserted.model_dump(mode="json"))
                    
                    if is_new:
                        added += 1
                        logger.info(f"Successfully added new tool: {tool.tool_display_name}")
                    else:
                        updated += 1
                        logger.info(f"Successfully updated existing tool: {tool.tool_display_name}")
                        
                except Exception as e:
                    err_msg = f"Failed to upsert {tool_data.get('name')}: {str(e)}"
                    logger.error(err_msg)
                    errors.append(err_msg)
        else:
            logger.warning("No tools discovered during scan. Skipping DB update to avoid accidental deactivation.")

        # 3. Deactivate missing tools (only if we found at least one tool, to be safe)
        if discovered_func_names:
            try:
                db_tools = await self.repo.list_internal_tools()
                for db_tool in db_tools:
                    if db_tool.tool_function_name not in discovered_func_names and db_tool.tool_is_active:
                        await self.repo.deactivate_internal_tool(db_tool.tool_function_name)
                        # Trigger deletion for deactivated tool
                        await self._trigger_deletion(db_tool.id, "tool")
                        removed += 1
                        logger.info(f"Deactivated tool: {db_tool.tool_display_name}")
            except Exception as e:
                err_msg = f"Failed to deactivate missing tools: {str(e)}"
                logger.error(err_msg)
                errors.append(err_msg)

        return SyncResultResponse(
            added=added,
            updated=updated,
            removed=removed,
            errors=errors
        )

    # --- Automations ---

    async def create_automation(self, request: CreateAutomationRequest) -> Automation:
        automation = Automation(
            id=uuid4(),
            automation_name=request.automation_name,
            automation_description=request.automation_description,
            automation_platform=request.automation_platform,
            automation_webhook_url=request.automation_webhook_url,
            automation_http_method=request.automation_http_method,
            automation_auth_config=request.automation_auth_config,
            automation_input_schema=request.automation_input_schema,
            automation_output_schema=request.automation_output_schema,
            automation_keywords=request.automation_keywords,
            availability_workspace=request.availability_workspace,
            created_at=now_utc(),
            updated_at=now_utc()
        )
        created = await self.repo.create_automation(automation)
        await self._trigger_indexing(created.id, "automation", created.model_dump(mode="json"))
        return created

    async def list_automations(self, workspace_id: Optional[str] = None) -> List[Automation]:
        return await self.repo.list_automations(workspace_id)

    async def get_automation(self, id: UUID) -> Optional[Automation]:
        return await self.repo.get_automation(id)

    async def update_automation(self, id: UUID, request: Any) -> Optional[Automation]:
        update_data = request.model_dump(exclude_unset=True) if hasattr(request, 'model_dump') else request
        updated = await self.repo.update_automation(id, update_data)
        if updated:
            await self._trigger_indexing(updated.id, "automation", updated.model_dump(mode="json"))
        return updated

    async def delete_automation(self, id: UUID) -> bool:
        success = await self.repo.delete_automation(id)
        if success:
            await self._trigger_deletion(id, "automation")
        return success

    async def test_automation(self, id: UUID, payload: TestPayload) -> SimulatorResultResponse:
        # TODO: Implement real HTTP call using httpx
        # For now, stub response
        return SimulatorResultResponse(
            success=True,
            status_code=200,
            response_body={"message": "Mock success", "input": payload.payload},
            latency_ms=123.45,
            validation_status=ValidationStatus.VALID
        )
