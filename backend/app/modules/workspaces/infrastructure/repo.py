from uuid import UUID, uuid4
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, delete, func, union
from sqlalchemy.orm import selectinload
from app.modules.workspaces.domain.models import Pattern, Template, Crew
from app.modules.workspaces.infrastructure.tables import PatternTable, TemplateTable, CrewTable, crew_agents_association
from app.shared.utils.time import now_utc

class WorkspaceRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    # --- Patterns ---
    async def list_patterns(self, workspace: Optional[str] = None, limit: int = 100, offset: int = 0) -> List[Pattern]:
        stmt = select(PatternTable).where(PatternTable.deleted_at == None).order_by(PatternTable.created_at.desc())
        if workspace:
             stmt = stmt.where(PatternTable.availability_workspace.contains([workspace]))
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
             stmt = stmt.where(TemplateTable.availability_workspace.contains([workspace]))
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
            availability_workspace=row.availability_workspace,
            created_at=row.created_at,
            updated_at=row.updated_at
        )

    # --- Crews ---
    async def list_crews(self, workspace: Optional[str] = None, limit: int = 100, offset: int = 0) -> List[Crew]:
        stmt = select(CrewTable).options(selectinload(CrewTable.agents)).where(CrewTable.deleted_at == None).order_by(CrewTable.created_at.desc())
        if workspace:
             stmt = stmt.where(CrewTable.availability_workspace.contains([workspace]))
        stmt = stmt.limit(limit).offset(offset)
        result = await self.session.execute(stmt)
        return [self._crew_to_domain(row) for row in result.scalars().all()]

    async def get_crew(self, crew_id: UUID) -> Optional[Crew]:
        stmt = select(CrewTable).options(selectinload(CrewTable.agents)).where(CrewTable.id == crew_id, CrewTable.deleted_at == None)
        result = await self.session.execute(stmt)
        row = result.scalar_one_or_none()
        return self._crew_to_domain(row) if row else None

    async def update_crew(self, crew_id: UUID, data: dict, agent_ids: Optional[List[UUID]] = None) -> Optional[Crew]:
        data["updated_at"] = now_utc()
        
        from app.modules.agents.infrastructure.tables import AgentConfigTable
        stmt = select(CrewTable).options(selectinload(CrewTable.agents)).where(CrewTable.id == crew_id)
        result = await self.session.execute(stmt)
        row = result.scalar_one_or_none()
        if not row:
            return None
            
        for key, value in data.items():
            setattr(row, key, value)
            
        if agent_ids is not None:
             agents_stmt = select(AgentConfigTable).where(AgentConfigTable.id.in_(agent_ids))
             agents_result = await self.session.execute(agents_stmt)
             row.agents = agents_result.scalars().all()
             
        await self.session.commit()
        return self._crew_to_domain(row)

    async def delete_crew(self, crew_id: UUID) -> bool:
        stmt = update(CrewTable).where(CrewTable.id == crew_id).values(deleted_at=now_utc())
        result = await self.session.execute(stmt)
        await self.session.commit()
        return result.rowcount > 0

    async def create_crew(self, crew: Crew, agent_ids: List[UUID]) -> Crew:
        # Pydantic model doesn't store relationship directly in DB table schema
        data = crew.model_dump(exclude={"agent_member_ids"})
        new_row = CrewTable(**data)
        
        # Link agents
        from app.modules.agents.infrastructure.tables import AgentConfigTable
        if agent_ids:
            agents_stmt = select(AgentConfigTable).where(AgentConfigTable.id.in_(agent_ids))
            agents_result = await self.session.execute(agents_stmt)
            new_row.agents = agents_result.scalars().all()
            
        self.session.add(new_row)
        await self.session.commit()
        return self._crew_to_domain(new_row)

    async def get_unique_workspaces(self, limit: int = 100, offset: int = 0) -> List[str]:
        """Get all unique workspace identifiers from patterns, templates, and crews."""
        # Use SQL UNION and unnest for scalability
        p_sub = select(func.unnest(PatternTable.availability_workspace).label("ws"))
        t_sub = select(func.unnest(TemplateTable.availability_workspace).label("ws"))
        c_sub = select(func.unnest(CrewTable.availability_workspace).label("ws"))
        
        combined = union(p_sub, t_sub, c_sub).alias("all_ws")
        stmt = select(combined.c.ws).order_by(combined.c.ws).limit(limit).offset(offset)
        
        result = await self.session.execute(stmt)
        return [row[0] for row in result.all() if row[0]]

    def _crew_to_domain(self, row: CrewTable) -> Crew:
        return Crew(
            id=row.id,
            crew_name=row.crew_name,
            crew_description=row.crew_description,
            crew_process_type=row.crew_process_type,
            manager_agent_id=row.manager_agent_id,
            crew_keywords=row.crew_keywords or [],
            availability_workspace=row.availability_workspace,
            created_at=row.created_at,
            updated_at=row.updated_at,
            agent_member_ids=[a.id for a in row.agents] if hasattr(row, "agents") and row.agents else []
        )
