import logging
from typing import List, Optional, Dict
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, delete
from sqlalchemy.orm import selectinload

# Import all tables to ensure SQLAlchemy mappers are initialized correctly
from app.modules.resources.domain.models import (
    PromptArchetype, InternalTool, ExternalService, ServiceCapability, Automation
)
from app.modules.resources.infrastructure.tables import (
    PromptArchetypeTable, InternalToolTable
)
from app.modules.workspaces.infrastructure.tables import (
    ExternalServiceTable, ServiceCapabilityTable, AutomationTable
)
from app.shared.utils.time import now_utc

logger = logging.getLogger(__name__)

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
            deleted_at=archetype.deleted_at,
            created_at=archetype.created_at,
            updated_at=archetype.updated_at
        )
        self.session.add(db_obj)
        await self.session.commit()
        await self.session.refresh(db_obj)
        return self._to_domain_archetype(db_obj)

    async def list_prompt_archetypes(self) -> List[PromptArchetype]:
        result = await self.session.execute(select(PromptArchetypeTable).where(PromptArchetypeTable.deleted_at.is_(None)))
        return [self._to_domain_archetype(row) for row in result.scalars().all()]

    async def get_prompt_archetype(self, id: UUID) -> Optional[PromptArchetype]:
        result = await self.session.execute(select(PromptArchetypeTable).where(PromptArchetypeTable.id == id, PromptArchetypeTable.deleted_at.is_(None)))
        row = result.scalar_one_or_none()
        return self._to_domain_archetype(row) if row else None
    
    async def update_prompt_archetype(self, id: UUID, update_data: Dict) -> Optional[PromptArchetype]:
        update_data['updated_at'] = now_utc()
        stmt = update(PromptArchetypeTable).where(PromptArchetypeTable.id == id, PromptArchetypeTable.deleted_at.is_(None)).values(**update_data)
        await self.session.execute(stmt)
        await self.session.commit()
        return await self.get_prompt_archetype(id)
    
    async def delete_prompt_archetype(self, id: UUID) -> bool:
        stmt = update(PromptArchetypeTable).where(PromptArchetypeTable.id == id).values(deleted_at=now_utc(), updated_at=now_utc())
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
            deleted_at=row.deleted_at,
            created_at=row.created_at,
            updated_at=row.updated_at
        )

    # --- Internal Tool ---

    async def list_internal_tools(self) -> List[InternalTool]:
        result = await self.session.execute(
            select(InternalToolTable).where(InternalToolTable.tool_is_active == True)
        )
        return [self._to_domain_tool(row) for row in result.scalars().all()]
    
    async def upsert_internal_tool(self, tool: InternalTool):
        # Check existing
        try:
            existing = await self.session.execute(
                select(InternalToolTable).where(InternalToolTable.tool_function_name == tool.tool_function_name)
            )
            row = existing.scalar_one_or_none()
            
            if row:
                logger.info(f"Updating existing tool in DB: {tool.tool_function_name}")
                row.tool_display_name = tool.tool_display_name
                row.tool_description = tool.tool_description
                row.tool_category = tool.tool_category
                row.tool_input_schema = tool.tool_input_schema
                row.tool_output_schema = tool.tool_output_schema
                row.tool_is_active = True # Re-activate if it was inactive
                row.tool_status = tool.tool_status
                row.tool_keywords = tool.tool_keywords
                row.availability_workspace = tool.availability_workspace
                row.updated_at = now_utc()
            else:
                logger.info(f"Inserting new tool into DB: {tool.tool_function_name}")
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
                    tool_status=tool.tool_status,
                    availability_workspace=tool.availability_workspace,
                    created_at=tool.created_at,
                    updated_at=tool.updated_at
                )
                self.session.add(db_obj)
            
            await self.session.commit()
            logger.info(f"Successfully committed tool: {tool.tool_function_name}")
        except Exception as e:
            logger.error(f"Error in upsert_internal_tool for {tool.tool_function_name}: {str(e)}")
            await self.session.rollback()
            raise e

    async def deactivate_internal_tool(self, tool_function_name: str):
        existing = await self.session.execute(
            select(InternalToolTable).where(InternalToolTable.tool_function_name == tool_function_name)
        )
        row = existing.scalar_one_or_none()
        if row:
            row.tool_is_active = False
            row.updated_at = now_utc()
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
            tool_status=row.tool_status,
            availability_workspace=row.availability_workspace,
            created_at=row.created_at,
            updated_at=row.updated_at
        )

    # --- External Services ---
    async def list_external_services(self, workspace: Optional[str] = None) -> List[ExternalService]:
        stmt = select(ExternalServiceTable).where(ExternalServiceTable.deleted_at.is_(None)).options(selectinload(ExternalServiceTable.capabilities))
        if workspace:
            stmt = stmt.where(ExternalServiceTable.availability_workspace.contains([workspace]))
        result = await self.session.execute(stmt)
        return [self._service_to_domain(row) for row in result.scalars().all()]

    async def get_external_service(self, service_id: UUID) -> Optional[ExternalService]:
        stmt = select(ExternalServiceTable).where(ExternalServiceTable.id == service_id, ExternalServiceTable.deleted_at.is_(None)).options(selectinload(ExternalServiceTable.capabilities))
        result = await self.session.execute(stmt)
        row = result.scalar_one_or_none()
        return self._service_to_domain(row) if row else None

    async def create_external_service(self, service: ExternalService) -> ExternalService:
        new_row = ExternalServiceTable(
            id=service.id,
            service_name=service.service_name,
            service_description=service.service_description,
            service_category=service.service_category,
            service_url=service.service_url,
            service_keywords=service.service_keywords,
            availability_workspace=service.availability_workspace,
            created_at=service.created_at,
            updated_at=service.updated_at
        )
        
        # Add capabilities
        for cap in service.capabilities:
            new_row.capabilities.append(ServiceCapabilityTable(
                id=cap.id,
                capability_name=cap.capability_name,
                capability_description=cap.capability_description,
                external_service_id=service.id,
                created_at=cap.created_at
            ))
            
        self.session.add(new_row)
        await self.session.commit()
        return service

    async def sync_service_capabilities(self, service_id: UUID, capabilities: List[ServiceCapability]):
        # Delete old ones
        await self.session.execute(
            delete(ServiceCapabilityTable).where(ServiceCapabilityTable.external_service_id == service_id)
        )
        
        # Add new ones
        for cap in capabilities:
            db_obj = ServiceCapabilityTable(
                id=cap.id,
                capability_name=cap.capability_name,
                capability_description=cap.capability_description,
                external_service_id=service_id,
                created_at=cap.created_at
            )
            self.session.add(db_obj)
            
        await self.session.commit()

    async def update_external_service(self, service_id: UUID, data: dict) -> Optional[ExternalService]:
        stmt = update(ExternalServiceTable).where(ExternalServiceTable.id == service_id, ExternalServiceTable.deleted_at.is_(None)).values(**data)
        await self.session.execute(stmt)
        await self.session.commit()
        return await self.get_external_service(service_id)

    async def delete_external_service(self, service_id: UUID) -> bool:
        stmt = update(ExternalServiceTable).where(ExternalServiceTable.id == service_id).values(deleted_at=now_utc())
        result = await self.session.execute(stmt)
        await self.session.commit()
        return result.rowcount > 0

    async def add_service_capability(self, capability: ServiceCapability) -> ServiceCapability:
        new_row = ServiceCapabilityTable(
            id=capability.id,
            capability_name=capability.capability_name,
            capability_description=capability.capability_description,
            external_service_id=capability.external_service_id,
            created_at=capability.created_at
        )
        self.session.add(new_row)
        await self.session.commit()
        return capability

    def _service_to_domain(self, row: ExternalServiceTable) -> ExternalService:
        return ExternalService(
            id=row.id, service_name=row.service_name, 
            service_description=row.service_description,
            service_category=row.service_category,
            service_url=row.service_url, service_keywords=row.service_keywords or [],
            availability_workspace=row.availability_workspace,
            deleted_at=row.deleted_at,
            capabilities=[ServiceCapability(id=c.id, capability_name=c.capability_name, capability_description=c.capability_description, external_service_id=c.external_service_id) for c in row.capabilities],
            created_at=row.created_at, updated_at=row.updated_at
        )

    # --- Automations ---
    async def list_automations(self, workspace: Optional[str] = None) -> List[Automation]:
        stmt = select(AutomationTable).where(AutomationTable.deleted_at.is_(None)).options(selectinload(AutomationTable.executions))
        if workspace: stmt = stmt.where(AutomationTable.availability_workspace.contains([workspace]))
        result = await self.session.execute(stmt)
        return [self._automation_to_domain(row) for row in result.scalars().all()]

    async def get_automation(self, automation_id: UUID) -> Optional[Automation]:
        stmt = select(AutomationTable).where(AutomationTable.id == automation_id, AutomationTable.deleted_at.is_(None)).options(selectinload(AutomationTable.executions))
        result = await self.session.execute(stmt)
        row = result.scalar_one_or_none()
        return self._automation_to_domain(row) if row else None

    async def create_automation(self, automation: Automation) -> Automation:
        new_row = AutomationTable(**automation.model_dump(exclude={"executions", "deleted_at"}))
        self.session.add(new_row)
        await self.session.commit()
        return automation

    async def update_automation(self, automation_id: UUID, data: dict) -> Optional[Automation]:
        stmt = update(AutomationTable).where(AutomationTable.id == automation_id, AutomationTable.deleted_at.is_(None)).values(**data)
        await self.session.execute(stmt)
        await self.session.commit()
        return await self.get_automation(automation_id)

    async def delete_automation(self, automation_id: UUID) -> bool:
        stmt = update(AutomationTable).where(AutomationTable.id == automation_id).values(deleted_at=now_utc())
        result = await self.session.execute(stmt)
        await self.session.commit()
        return result.rowcount > 0

    def _automation_to_domain(self, row: AutomationTable) -> Automation:
        return Automation(
            id=row.id, automation_name=row.automation_name, automation_description=row.automation_description,
            automation_platform=row.automation_platform, automation_webhook_url=row.automation_webhook_url,
            automation_http_method=row.automation_http_method, automation_auth_config=row.automation_auth_config,
            automation_input_schema=row.automation_input_schema, automation_output_schema=row.automation_output_schema,
            automation_keywords=row.automation_keywords or [], availability_workspace=row.availability_workspace,
            deleted_at=row.deleted_at,
            created_at=row.created_at, updated_at=row.updated_at
        )
