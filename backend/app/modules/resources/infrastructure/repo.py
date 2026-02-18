from typing import List, Optional, Dict
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, delete
from sqlalchemy.orm import selectinload

from backend.app.modules.resources.domain.models import (
    PromptArchetype, ExternalService, ServiceCapability, InternalTool, Automation, AutomationExecution
)
from backend.app.modules.resources.infrastructure.tables import (
    PromptArchetypeTable, ExternalServiceTable, ServiceCapabilityTable, 
    InternalToolTable, AutomationTable, AutomationExecutionTable
)
from backend.app.shared.utils.time import now_utc

class ResourcesRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    # --- Prompt Archetype ---

    async def create_prompt_archetype(self, archetype: PromptArchetype) -> PromptArchetype:
        db_obj = PromptArchetypeTable(
            id=archetype.id,
            archetype_name=archetype.archetype_name,
            archetype_description=archetype.archetype_description,
            archetype_role=archetype.archetype_role,
            archetype_goal=archetype.archetype_goal,
            archetype_backstory=archetype.archetype_backstory,
            archetype_guardrails=archetype.archetype_guardrails,
            archetype_knowledge_hubs=archetype.archetype_knowledge_hubs,
            archetype_keywords=archetype.archetype_keywords,
            workspace_domain=archetype.workspace_domain,
            created_at=archetype.created_at,
            updated_at=archetype.updated_at
        )
        self.session.add(db_obj)
        await self.session.commit()
        await self.session.refresh(db_obj)
        return self._to_domain_archetype(db_obj)

    async def list_prompt_archetypes(self) -> List[PromptArchetype]:
        result = await self.session.execute(select(PromptArchetypeTable))
        return [self._to_domain_archetype(row) for row in result.scalars().all()]

    async def get_prompt_archetype(self, id: UUID) -> Optional[PromptArchetype]:
        result = await self.session.execute(select(PromptArchetypeTable).where(PromptArchetypeTable.id == id))
        row = result.scalar_one_or_none()
        return self._to_domain_archetype(row) if row else None
    
    async def update_prompt_archetype(self, id: UUID, update_data: Dict) -> Optional[PromptArchetype]:
        update_data['updated_at'] = now_utc()
        stmt = update(PromptArchetypeTable).where(PromptArchetypeTable.id == id).values(**update_data)
        await self.session.execute(stmt)
        await self.session.commit()
        return await self.get_prompt_archetype(id)
    
    async def delete_prompt_archetype(self, id: UUID) -> bool:
        stmt = delete(PromptArchetypeTable).where(PromptArchetypeTable.id == id)
        result = await self.session.execute(stmt)
        await self.session.commit()
        return result.rowcount > 0

    def _to_domain_archetype(self, row: PromptArchetypeTable) -> PromptArchetype:
        return PromptArchetype(
            id=row.id,
            archetype_name=row.archetype_name,
            archetype_description=row.archetype_description,
            archetype_role=row.archetype_role,
            archetype_goal=row.archetype_goal,
            archetype_backstory=row.archetype_backstory,
            archetype_guardrails=row.archetype_guardrails,
            archetype_knowledge_hubs=row.archetype_knowledge_hubs,
            archetype_keywords=row.archetype_keywords,
            workspace_domain=row.workspace_domain,
            created_at=row.created_at,
            updated_at=row.updated_at
        )

    # --- External Service ---

    async def create_external_service(self, service: ExternalService) -> ExternalService:
        db_obj = ExternalServiceTable(
            id=service.id,
            service_name=service.service_name,
            service_category=service.service_category,
            service_url=service.service_url,
            service_keywords=service.service_keywords,
            availability_workspace=service.availability_workspace,
            created_at=service.created_at,
            updated_at=service.updated_at
        )
        self.session.add(db_obj)
        await self.session.commit()
        await self.session.refresh(db_obj)
        return self._to_domain_service(db_obj)

    async def list_external_services(self) -> List[ExternalService]:
        result = await self.session.execute(
            select(ExternalServiceTable).options(selectinload(ExternalServiceTable.capabilities))
        )
        return [self._to_domain_service(row) for row in result.scalars().all()]
    
    async def add_service_capability(self, capability: ServiceCapability) -> ServiceCapability:
        db_obj = ServiceCapabilityTable(
            id=capability.id,
            capability_name=capability.capability_name,
            capability_description=capability.capability_description,
            external_service_id=capability.external_service_id,
            created_at=capability.created_at
        )
        self.session.add(db_obj)
        await self.session.commit()
        return capability # Domain object already has data

    def _to_domain_service(self, row: ExternalServiceTable) -> ExternalService:
        return ExternalService(
            id=row.id,
            service_name=row.service_name,
            service_category=row.service_category,
            service_url=row.service_url,
            service_keywords=row.service_keywords or [],
            availability_workspace=row.availability_workspace or [],
            created_at=row.created_at,
            updated_at=row.updated_at,
            capabilities=[
                ServiceCapability(
                    id=c.id,
                    capability_name=c.capability_name,
                    capability_description=c.capability_description,
                    external_service_id=c.external_service_id,
                    created_at=c.created_at,
                    updated_at=c.created_at # Assuming immutable or same
                ) for c in row.capabilities
            ]
        )

    # --- Internal Tool ---

    async def list_internal_tools(self) -> List[InternalTool]:
        result = await self.session.execute(select(InternalToolTable))
        return [self._to_domain_tool(row) for row in result.scalars().all()]
    
    async def upsert_internal_tool(self, tool: InternalTool):
        # Check existing
        existing = await self.session.execute(
            select(InternalToolTable).where(InternalToolTable.tool_function_name == tool.tool_function_name)
        )
        row = existing.scalar_one_or_none()
        
        if row:
            # Update fields
            row.tool_display_name = tool.tool_display_name
            row.tool_description = tool.tool_description
            row.tool_category = tool.tool_category
            row.tool_input_schema = tool.tool_input_schema
            row.tool_output_schema = tool.tool_output_schema
            row.updated_at = now_utc()
            # Do not overwrite user-editable fields like tool_keywords or tool_is_active if we want to preserve them
            # But "Sync" usually implies code is SSOT for definition. 
            # PRP says: "UI is Read-Only for definition, Write-Only for metadata".
            # So we keep keywords if they are not in the update payload (which they are default empty).
            # Here we just update the definition from code.
        else:
            db_obj = InternalToolTable(
                id=tool.id,
                tool_function_name=tool.tool_function_name,
                tool_display_name=tool.tool_display_name,
                tool_description=tool.tool_description,
                tool_category=tool.tool_category,
                tool_keywords=tool.tool_keywords,
                tool_input_schema=tool.tool_input_schema,
                tool_output_schema=tool.tool_output_schema,
                tool_is_active=tool.tool_is_active,
                availability_workspace=tool.availability_workspace,
                created_at=tool.created_at,
                updated_at=tool.updated_at
            )
            self.session.add(db_obj)
        
        await self.session.commit()
    
    def _to_domain_tool(self, row: InternalToolTable) -> InternalTool:
        return InternalTool(
            id=row.id,
            tool_function_name=row.tool_function_name,
            tool_display_name=row.tool_display_name,
            tool_description=row.tool_description,
            tool_category=row.tool_category,
            tool_keywords=row.tool_keywords,
            tool_input_schema=row.tool_input_schema,
            tool_output_schema=row.tool_output_schema,
            tool_is_active=row.tool_is_active,
            availability_workspace=row.availability_workspace,
            created_at=row.created_at,
            updated_at=row.updated_at
        )

    # --- Automation ---

    async def create_automation(self, automation: Automation) -> Automation:
        db_obj = AutomationTable(
            id=automation.id,
            automation_name=automation.automation_name,
            automation_description=automation.automation_description,
            automation_platform=automation.automation_platform,
            automation_webhook_url=automation.automation_webhook_url,
            automation_http_method=automation.automation_http_method,
            automation_auth_config=automation.automation_auth_config,
            automation_input_schema=automation.automation_input_schema,
            automation_output_schema=automation.automation_output_schema,
            automation_validation_status=automation.automation_validation_status,
            automation_last_validated_at=automation.automation_last_validated_at,
            automation_keywords=automation.automation_keywords,
            availability_workspace=automation.availability_workspace,
            created_at=automation.created_at,
            updated_at=automation.updated_at
        )
        self.session.add(db_obj)
        await self.session.commit()
        await self.session.refresh(db_obj)
        return self._to_domain_automation(db_obj)

    async def list_automations(self) -> List[Automation]:
        result = await self.session.execute(select(AutomationTable))
        return [self._to_domain_automation(row) for row in result.scalars().all()]
    
    def _to_domain_automation(self, row: AutomationTable) -> Automation:
        return Automation(
            id=row.id,
            automation_name=row.automation_name,
            automation_description=row.automation_description,
            automation_platform=row.automation_platform,
            automation_webhook_url=row.automation_webhook_url,
            automation_http_method=row.automation_http_method,
            automation_auth_config=row.automation_auth_config,
            automation_input_schema=row.automation_input_schema,
            automation_output_schema=row.automation_output_schema,
            automation_validation_status=row.automation_validation_status,
            automation_last_validated_at=row.automation_last_validated_at,
            automation_keywords=row.automation_keywords,
            availability_workspace=row.availability_workspace,
            created_at=row.created_at,
            updated_at=row.updated_at,
            executions=[] # Not loading executions by default for list
        )
