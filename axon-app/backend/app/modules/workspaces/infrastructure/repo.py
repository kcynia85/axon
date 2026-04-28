from uuid import UUID
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, delete, func, or_, String, cast
from sqlalchemy.orm import selectinload, joinedload
from app.modules.workspaces.domain.models import Pattern, Template, Crew, ResolvedMember, ExternalService, ServiceCapability, Automation, TrashItem
from app.modules.workspaces.infrastructure.tables import (
    PatternTable, TemplateTable, CrewTable, ExternalServiceTable, ServiceCapabilityTable, AutomationTable
)
from app.shared.utils.time import now_utc

class WorkspaceRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    # --- Patterns ---
    async def list_patterns(self, workspace: Optional[str] = None, limit: int = 100, offset: int = 0) -> List[Pattern]:
        stmt = select(PatternTable).where(PatternTable.deleted_at == None).order_by(PatternTable.created_at.desc())
        if workspace:
             stmt = stmt.where(or_(
                 PatternTable.availability_workspace.contains([workspace]),
                 PatternTable.availability_workspace.contains(["Global Availability"])
             ))
        stmt = stmt.limit(limit).offset(offset)
        result = await self.session.execute(stmt)
        return [self._pattern_to_domain(row) for row in result.scalars().all()]

    async def get_pattern(self, pattern_id: UUID) -> Optional[Pattern]:
        stmt = select(PatternTable).where(PatternTable.id == pattern_id, PatternTable.deleted_at == None)
        result = await self.session.execute(stmt)
        row = result.scalar_one_or_none()
        return self._pattern_to_domain(row) if row else None

    async def update_pattern(self, pattern_id: UUID, data: dict) -> Optional[Pattern]:
        data["updated_at"] = now_utc()
        stmt = update(PatternTable).where(PatternTable.id == pattern_id).values(**data)
        await self.session.execute(stmt)
        await self.session.commit()
        return await self.get_pattern(pattern_id)

    async def delete_pattern(self, pattern_id: UUID) -> bool:
        stmt = update(PatternTable).where(PatternTable.id == pattern_id).values(deleted_at=now_utc())
        result = await self.session.execute(stmt)
        await self.session.commit()
        return result.rowcount > 0

    async def create_pattern(self, pattern: Pattern) -> Pattern:
        new_row = PatternTable(**pattern.model_dump())
        self.session.add(new_row)
        await self.session.commit()
        return pattern

    def _pattern_to_domain(self, row: PatternTable) -> Pattern:
        return Pattern(
            id=row.id,
            pattern_name=row.pattern_name,
            pattern_type=row.pattern_type,
            pattern_okr_context=row.pattern_okr_context,
            pattern_graph_structure=row.pattern_graph_structure,
            pattern_keywords=row.pattern_keywords or [],
            availability_workspace=row.availability_workspace,
            created_at=row.created_at,
            updated_at=row.updated_at
        )

    # --- Templates ---
    async def list_templates(self, workspace: Optional[str] = None, limit: int = 100, offset: int = 0) -> List[Template]:
        stmt = select(TemplateTable).where(TemplateTable.deleted_at == None).order_by(TemplateTable.created_at.desc())
        if workspace:
             stmt = stmt.where(or_(
                 TemplateTable.availability_workspace.contains([workspace]),
                 TemplateTable.availability_workspace.contains(["Global Availability"])
             ))
        stmt = stmt.limit(limit).offset(offset)
        result = await self.session.execute(stmt)
        return [self._template_to_domain(row) for row in result.scalars().all()]

    async def get_template(self, template_id: UUID) -> Optional[Template]:
        stmt = select(TemplateTable).where(TemplateTable.id == template_id, TemplateTable.deleted_at == None)
        result = await self.session.execute(stmt)
        row = result.scalar_one_or_none()
        return self._template_to_domain(row) if row else None

    async def update_template(self, template_id: UUID, data: dict) -> Optional[Template]:
        data["updated_at"] = now_utc()
        stmt = update(TemplateTable).where(TemplateTable.id == template_id).values(**data)
        await self.session.execute(stmt)
        await self.session.commit()
        return await self.get_template(template_id)

    async def delete_template(self, template_id: UUID) -> bool:
        stmt = update(TemplateTable).where(TemplateTable.id == template_id).values(deleted_at=now_utc())
        result = await self.session.execute(stmt)
        await self.session.commit()
        return result.rowcount > 0
        
    async def check_template_usage(self, template_id: UUID) -> List[str]:
        stmt = select(PatternTable.pattern_name).where(
            PatternTable.deleted_at == None,
            cast(PatternTable.pattern_graph_structure, String).like(f"%{template_id}%")
        )
        result = await self.session.execute(stmt)
        return list(result.scalars().all())

    async def create_template(self, template: Template) -> Template:
        new_row = TemplateTable(**template.model_dump())
        self.session.add(new_row)
        await self.session.commit()
        return template

    def _template_to_domain(self, row: TemplateTable) -> Template:
        return Template(
            id=row.id,
            template_name=row.template_name,
            template_description=row.template_description,
            template_markdown_content=row.template_markdown_content,
            template_checklist_items=row.template_checklist_items or [],
            template_keywords=row.template_keywords or [],
            template_inputs=row.template_inputs or [],
            template_outputs=row.template_outputs or [],
            availability_workspace=row.availability_workspace or [],
            created_at=row.created_at,
            updated_at=row.updated_at,
            deleted_at=row.deleted_at
        )
    # --- Crews ---
    async def list_crews(self, workspace: Optional[str] = None, limit: int = 100, offset: int = 0) -> List[Crew]:
        stmt = select(CrewTable).options(
            selectinload(CrewTable.agents), 
            joinedload(CrewTable.manager)
        ).where(CrewTable.deleted_at == None).order_by(CrewTable.created_at.desc())
        if workspace:
             stmt = stmt.where(or_(
                 CrewTable.availability_workspace.contains([workspace]),
                 CrewTable.availability_workspace.contains(["Global Availability"])
             ))
        stmt = stmt.limit(limit).offset(offset)
        result = await self.session.execute(stmt)
        return [self._crew_to_domain(row) for row in result.scalars().all()]

    async def get_crew(self, crew_id: UUID) -> Optional[Crew]:
        stmt = select(CrewTable).options(
            selectinload(CrewTable.agents),
            joinedload(CrewTable.manager)
        ).where(CrewTable.id == crew_id, CrewTable.deleted_at == None)
        result = await self.session.execute(stmt)
        row = result.scalar_one_or_none()
        return self._crew_to_domain(row) if row else None

    async def update_crew(self, crew_id: UUID, data: dict, agent_ids: Optional[List[UUID]] = None) -> Optional[Crew]:
        data["updated_at"] = now_utc()
        from app.modules.agents.infrastructure.tables import AgentConfigTable
        stmt = select(CrewTable).options(
            selectinload(CrewTable.agents),
            joinedload(CrewTable.manager)
        ).where(CrewTable.id == crew_id)
        result = await self.session.execute(stmt)
        row = result.scalar_one_or_none()
        if not row: return None
        for key, value in data.items():
            if key == "metadata": setattr(row, "metadata_", value)
            else: setattr(row, key, value)
        if agent_ids is not None:
             agents_stmt = select(AgentConfigTable).where(AgentConfigTable.id.in_(agent_ids))
             agents_result = await self.session.execute(agents_stmt)
             row.agents = agents_result.scalars().all()
        await self.session.commit()
        await self.session.refresh(row)
        return self._crew_to_domain(row)

    async def delete_crew(self, crew_id: UUID) -> bool:
        stmt = update(CrewTable).where(CrewTable.id == crew_id).values(deleted_at=now_utc())
        result = await self.session.execute(stmt)
        await self.session.commit()
        return result.rowcount > 0

    async def create_crew(self, crew: Crew, agent_ids: List[UUID]) -> Crew:
        data = crew.model_dump(exclude={"agent_member_ids", "resolved_members", "resolved_manager"})
        if "metadata" in data: data["metadata_"] = data.pop("metadata")
        new_row = CrewTable(**data)
        from app.modules.agents.infrastructure.tables import AgentConfigTable
        if agent_ids:
            agents_stmt = select(AgentConfigTable).where(AgentConfigTable.id.in_(agent_ids))
            agents_result = await self.session.execute(agents_stmt)
            new_row.agents = agents_result.scalars().all()
        self.session.add(new_row)
        await self.session.commit()
        
        # Reload with relationships
        stmt = select(CrewTable).options(
            selectinload(CrewTable.agents),
            joinedload(CrewTable.manager)
        ).where(CrewTable.id == new_row.id)
        result = await self.session.execute(stmt)
        new_row = result.scalar_one()
        
        return self._crew_to_domain(new_row)

    def _crew_to_domain(self, row: CrewTable) -> Crew:
        return Crew(
            id=row.id,
            crew_name=row.crew_name,
            crew_description=row.crew_description,
            crew_process_type=row.crew_process_type,
            manager_agent_id=row.manager_agent_id,
            crew_keywords=row.crew_keywords or [],
            availability_workspace=row.availability_workspace,
            data_interface=row.data_interface or {"context": [], "artefacts": []},
            metadata=row.metadata_ or {},
            created_at=row.created_at,
            updated_at=row.updated_at,
            agent_member_ids=[a.id for a in row.agents] if hasattr(row, "agents") and row.agents else [],
            resolved_members=[
                ResolvedMember(
                    id=a.id, 
                    role=a.agent_role_text or (a.role.value if a.role else "Agent"), 
                    visualUrl=a.agent_visual_url
                ) for a in row.agents
            ] if hasattr(row, "agents") and row.agents else [],
            resolved_manager=ResolvedMember(
                id=row.manager.id,
                role=row.manager.agent_role_text or (row.manager.role.value if row.manager.role else "Manager"),
                visualUrl=row.manager.agent_visual_url
            ) if hasattr(row, "manager") and row.manager else None
        )

    # --- External Services ---
    async def list_external_services(self, workspace: Optional[str] = None) -> List[ExternalService]:
        stmt = select(ExternalServiceTable).options(selectinload(ExternalServiceTable.capabilities)).where(ExternalServiceTable.deleted_at == None)
        if workspace: stmt = stmt.where(ExternalServiceTable.availability_workspace.contains([workspace]))
        result = await self.session.execute(stmt)
        return [self._service_to_domain(row) for row in result.scalars().all()]

    async def get_external_service(self, service_id: UUID) -> Optional[ExternalService]:
        stmt = select(ExternalServiceTable).options(selectinload(ExternalServiceTable.capabilities)).where(ExternalServiceTable.id == service_id, ExternalServiceTable.deleted_at == None)
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
            service_input_schema=service.service_input_schema,
            service_output_schema=service.service_output_schema,
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
        stmt = update(ExternalServiceTable).where(ExternalServiceTable.id == service_id).values(**data)
        await self.session.execute(stmt)
        await self.session.commit()
        return await self.get_external_service(service_id)

    async def delete_external_service(self, service_id: UUID) -> bool:
        stmt = update(ExternalServiceTable).where(ExternalServiceTable.id == service_id).values(deleted_at=now_utc())
        result = await self.session.execute(stmt)
        await self.session.commit()
        return result.rowcount > 0

    def _service_to_domain(self, row: ExternalServiceTable) -> ExternalService:
        return ExternalService(
            id=row.id, service_name=row.service_name, 
            service_description=row.service_description,
            service_category=row.service_category,
            service_url=row.service_url, 
            service_input_schema=row.service_input_schema,
            service_output_schema=row.service_output_schema,
            service_keywords=row.service_keywords or [],
            availability_workspace=row.availability_workspace,
            capabilities=[ServiceCapability(id=c.id, capability_name=c.capability_name, capability_description=c.capability_description, external_service_id=c.external_service_id) for c in row.capabilities],
            created_at=row.created_at, updated_at=row.updated_at
        )

    # --- Automations ---
    async def list_automations(self, workspace: Optional[str] = None) -> List[Automation]:
        stmt = select(AutomationTable).where(AutomationTable.deleted_at == None)
        if workspace: stmt = stmt.where(AutomationTable.availability_workspace.contains([workspace]))
        result = await self.session.execute(stmt)
        return [self._automation_to_domain(row) for row in result.scalars().all()]

    async def get_automation(self, automation_id: UUID) -> Optional[Automation]:
        stmt = select(AutomationTable).where(AutomationTable.id == automation_id, AutomationTable.deleted_at == None)
        result = await self.session.execute(stmt)
        row = result.scalar_one_or_none()
        return self._automation_to_domain(row) if row else None

    async def create_automation(self, automation: Automation) -> Automation:
        new_row = AutomationTable(**automation.model_dump(exclude={"executions"}))
        self.session.add(new_row)
        await self.session.commit()
        return automation

    async def update_automation(self, automation_id: UUID, data: dict) -> Optional[Automation]:
        stmt = update(AutomationTable).where(AutomationTable.id == automation_id).values(**data)
        await self.session.execute(stmt)
        await self.session.commit()
        return await self.get_automation(automation_id)

    async def delete_automation(self, automation_id: UUID) -> bool:
        stmt = update(AutomationTable).where(AutomationTable.id == automation_id).values(deleted_at=now_utc())
        result = await self.session.execute(stmt)
        await self.session.commit()
        return result.rowcount > 0

    async def get_trash(self) -> List[TrashItem]:
        from app.modules.agents.infrastructure.tables import AgentConfigTable
        from app.modules.knowledge.infrastructure.tables import AssetTable, KnowledgeResourceTable

        from app.modules.resources.infrastructure.tables import PromptArchetypeTable
        from app.modules.settings.infrastructure.tables import (
            LLMProviderTable, LLMModelTable, LLMRouterTable, 
            EmbeddingModelTable, ChunkingStrategyTable, VectorDatabaseTable
        )
        
        # Build union query for all tables
        # Since schemas differ, we select only the common fields: id, name, type, deleted_at
        
        queries = [
            # Workspaces module
            select(PatternTable.id, PatternTable.pattern_name.label("name"), func.cast("pattern", String).label("type"), PatternTable.deleted_at).where(PatternTable.deleted_at != None),
            select(TemplateTable.id, TemplateTable.template_name.label("name"), func.cast("template", String).label("type"), TemplateTable.deleted_at).where(TemplateTable.deleted_at != None),
            select(CrewTable.id, CrewTable.crew_name.label("name"), func.cast("crew", String).label("type"), CrewTable.deleted_at).where(CrewTable.deleted_at != None),
            select(ExternalServiceTable.id, ExternalServiceTable.service_name.label("name"), func.cast("service", String).label("type"), ExternalServiceTable.deleted_at).where(ExternalServiceTable.deleted_at != None),
            select(AutomationTable.id, AutomationTable.automation_name.label("name"), func.cast("automation", String).label("type"), AutomationTable.deleted_at).where(AutomationTable.deleted_at != None),
            # Knowledge module
            select(AssetTable.id, AssetTable.title.label("name"), func.cast("asset", String).label("type"), AssetTable.deleted_at).where(AssetTable.deleted_at != None),
            select(KnowledgeResourceTable.id, KnowledgeResourceTable.resource_file_name.label("name"), func.cast("knowledge_resource", String).label("type"), KnowledgeResourceTable.deleted_at).where(KnowledgeResourceTable.deleted_at != None),
            # Resources module
            select(PromptArchetypeTable.id, PromptArchetypeTable.archetype_name.label("name"), func.cast("prompt_archetype", String).label("type"), PromptArchetypeTable.deleted_at).where(PromptArchetypeTable.deleted_at != None),
            # Agents module
            select(AgentConfigTable.id, func.coalesce(AgentConfigTable.agent_name, AgentConfigTable.agent_role_text).label("name"), func.cast("agent", String).label("type"), AgentConfigTable.deleted_at).where(AgentConfigTable.deleted_at != None),
            # Settings module
            select(LLMProviderTable.id, LLMProviderTable.provider_name.label("name"), func.cast("llm_provider", String).label("type"), LLMProviderTable.deleted_at).where(LLMProviderTable.deleted_at != None),
            select(LLMModelTable.id, LLMModelTable.model_display_name.label("name"), func.cast("llm_model", String).label("type"), LLMModelTable.deleted_at).where(LLMModelTable.deleted_at != None),
            select(LLMRouterTable.id, LLMRouterTable.router_alias.label("name"), func.cast("llm_router", String).label("type"), LLMRouterTable.deleted_at).where(LLMRouterTable.deleted_at != None),
            select(EmbeddingModelTable.id, EmbeddingModelTable.model_id.label("name"), func.cast("embedding_model", String).label("type"), EmbeddingModelTable.deleted_at).where(EmbeddingModelTable.deleted_at != None),
            select(ChunkingStrategyTable.id, ChunkingStrategyTable.strategy_name.label("name"), func.cast("chunking_strategy", String).label("type"), ChunkingStrategyTable.deleted_at).where(ChunkingStrategyTable.deleted_at != None),
            select(VectorDatabaseTable.id, VectorDatabaseTable.vector_database_name.label("name"), func.cast("vector_database", String).label("type"), VectorDatabaseTable.deleted_at).where(VectorDatabaseTable.deleted_at != None)
        ]
        
        trash_items = []
        for q in queries:
            result = await self.session.execute(q)
            for row in result.all():
                trash_items.append(TrashItem(
                    id=row.id,
                    name=row.name or "Unnamed",
                    type=row.type,
                    deleted_at=row.deleted_at
                ))
        
        # Sort by deleted_at desc
        trash_items.sort(key=lambda x: x.deleted_at, reverse=True)
        return trash_items

    async def restore_item(self, item_id: UUID, item_type: str) -> bool:
        from app.modules.agents.infrastructure.tables import AgentConfigTable
        from app.modules.knowledge.infrastructure.tables import AssetTable, KnowledgeResourceTable

        from app.modules.resources.infrastructure.tables import PromptArchetypeTable
        from app.modules.settings.infrastructure.tables import (
            LLMProviderTable, LLMModelTable, LLMRouterTable, 
            EmbeddingModelTable, ChunkingStrategyTable, VectorDatabaseTable
        )
        
        table_map = {
            "pattern": PatternTable,
            "template": TemplateTable,
            "crew": CrewTable,
            "service": ExternalServiceTable,
            "automation": AutomationTable,
            "asset": AssetTable,
            "knowledge_resource": KnowledgeResourceTable,
            "prompt_archetype": PromptArchetypeTable,
            "agent": AgentConfigTable,
            "llm_provider": LLMProviderTable,
            "llm_model": LLMModelTable,
            "llm_router": LLMRouterTable,
            "embedding_model": EmbeddingModelTable,
            "chunking_strategy": ChunkingStrategyTable,
            "vector_database": VectorDatabaseTable
        }
        
        table = table_map.get(item_type.lower())
        if not table:
            return False
            
        stmt = update(table).where(table.id == item_id).values(deleted_at=None)
        result = await self.session.execute(stmt)
        await self.session.commit()
        return result.rowcount > 0

    async def purge_item(self, item_id: UUID, item_type: str) -> bool:
        from app.modules.agents.infrastructure.tables import AgentConfigTable
        from app.modules.knowledge.infrastructure.tables import AssetTable, KnowledgeResourceTable

        from app.modules.resources.infrastructure.tables import PromptArchetypeTable
        from app.modules.settings.infrastructure.tables import (
            LLMProviderTable, LLMModelTable, LLMRouterTable, 
            EmbeddingModelTable, ChunkingStrategyTable, VectorDatabaseTable
        )
        
        table_map = {
            "pattern": PatternTable,
            "template": TemplateTable,
            "crew": CrewTable,
            "service": ExternalServiceTable,
            "automation": AutomationTable,
            "asset": AssetTable,
            "knowledge_resource": KnowledgeResourceTable,
            "prompt_archetype": PromptArchetypeTable,
            "agent": AgentConfigTable,
            "llm_provider": LLMProviderTable,
            "llm_model": LLMModelTable,
            "llm_router": LLMRouterTable,
            "embedding_model": EmbeddingModelTable,
            "chunking_strategy": ChunkingStrategyTable,
            "vector_database": VectorDatabaseTable
        }
        
        table = table_map.get(item_type.lower())
        if not table:
            return False
            
        stmt = delete(table).where(table.id == item_id)
        result = await self.session.execute(stmt)
        await self.session.commit()
        return result.rowcount > 0

    def _automation_to_domain(self, row: AutomationTable) -> Automation:
        return Automation(
            id=row.id, 
            automation_name=row.automation_name, 
            automation_description=row.automation_description,
            automation_platform=row.automation_platform, 
            automation_webhook_url=row.automation_webhook_url,
            automation_http_method=row.automation_http_method, 
            automation_provider_id=row.automation_provider_id,
            automation_auth_config=row.automation_auth_config,
            automation_input_schema=row.automation_input_schema, 
            automation_output_schema=row.automation_output_schema,
            automation_keywords=row.automation_keywords or [], 
            availability_workspace=row.availability_workspace or [],
            created_at=row.created_at, 
            updated_at=row.updated_at
        )
