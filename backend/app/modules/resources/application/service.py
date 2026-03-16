from uuid import UUID, uuid4
from typing import List, Optional, Dict, Any
from app.modules.resources.infrastructure.repo import ResourcesRepository
from app.modules.resources.domain.models import (
    PromptArchetype, ExternalService, ServiceCapability, InternalTool, Automation
)
from app.modules.resources.application.schemas import (
    CreatePromptArchetypeRequest, UpdatePromptArchetypeRequest, 
    CreateExternalServiceRequest, CreateCapabilityRequest,
    CreateAutomationRequest, TestPayload, SimulatorResultResponse, SyncResultResponse
)
from app.modules.resources.domain.enums import ValidationStatus
from app.shared.utils.time import now_utc

class ResourcesService:
    def __init__(self, repo: ResourcesRepository):
        self.repo = repo

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
        return await self.repo.create_prompt_archetype(archetype)

    async def list_prompt_archetypes(self) -> List[PromptArchetype]:
        return await self.repo.list_prompt_archetypes()

    async def get_prompt_archetype(self, id: UUID) -> Optional[PromptArchetype]:
        return await self.repo.get_prompt_archetype(id)

    async def update_prompt_archetype(self, id: UUID, request: UpdatePromptArchetypeRequest) -> Optional[PromptArchetype]:
        update_data = request.model_dump(exclude_unset=True)
        return await self.repo.update_prompt_archetype(id, update_data)

    async def delete_prompt_archetype(self, id: UUID) -> bool:
        return await self.repo.delete_prompt_archetype(id)

    # --- External Services ---

    async def create_external_service(self, request: CreateExternalServiceRequest) -> ExternalService:
        service = ExternalService(
            id=uuid4(),
            service_name=request.service_name,
            service_category=request.service_category,
            service_url=request.service_url,
            service_keywords=request.service_keywords,
            availability_workspace=request.availability_workspace,
            created_at=now_utc(),
            updated_at=now_utc()
        )
        return await self.repo.create_external_service(service)

    async def list_external_services(self) -> List[ExternalService]:
        return await self.repo.list_external_services()

    async def get_external_service(self, id: UUID) -> Optional[ExternalService]:
        return await self.repo.get_external_service(id)

    async def update_external_service(self, id: UUID, request: Any) -> Optional[ExternalService]:
        # Using Any for request type to handle different update schemas if needed
        # Or just use model_dump if it's a Pydantic model
        update_data = request.model_dump(exclude_unset=True) if hasattr(request, 'model_dump') else request
        return await self.repo.update_external_service(id, update_data)

    async def delete_external_service(self, id: UUID) -> bool:
        return await self.repo.delete_external_service(id)

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

    async def sync_tools(self) -> SyncResultResponse:
        # TODO: Implement real scanning of @tool decorated functions in codebase
        # For now, we stub this to return 0 changes.
        return SyncResultResponse(
            added=0,
            updated=0,
            removed=0,
            errors=[]
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
        return await self.repo.create_automation(automation)

    async def list_automations(self, workspace_id: Optional[str] = None) -> List[Automation]:
        return await self.repo.list_automations(workspace_id)

    async def get_automation(self, id: UUID) -> Optional[Automation]:
        return await self.repo.get_automation(id)

    async def update_automation(self, id: UUID, request: Any) -> Optional[Automation]:
        update_data = request.model_dump(exclude_unset=True) if hasattr(request, 'model_dump') else request
        return await self.repo.update_automation(id, update_data)

    async def delete_automation(self, id: UUID) -> bool:
        return await self.repo.delete_automation(id)

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
