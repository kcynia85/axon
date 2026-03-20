from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, delete, or_
from typing import Optional, List
from uuid import UUID
from app.modules.agents.domain.models import AgentConfig, ChatSession
from app.modules.agents.infrastructure.tables import AgentConfigTable, ChatSessionTable
from app.modules.agents.domain.enums import AgentRole
from app.shared.utils.time import now_utc

class AgentConfigRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, config: AgentConfig) -> AgentConfig:
        db_obj = AgentConfigTable(**config.model_dump())
        self.session.add(db_obj)
        await self.session.commit()
        await self.session.refresh(db_obj)
        return AgentConfig.model_validate(db_obj, from_attributes=True)

    async def get(self, id: UUID) -> Optional[AgentConfig]:
        stmt = select(AgentConfigTable).where(AgentConfigTable.id == id)
        result = await self.session.execute(stmt)
        row = result.scalar_one_or_none()
        if row:
            return AgentConfig.model_validate(row, from_attributes=True)
        return None

    async def list_all(self, workspace: Optional[str] = None) -> List[AgentConfig]:
        stmt = select(AgentConfigTable).where(AgentConfigTable.deleted_at == None)
        if workspace:
             stmt = stmt.where(or_(
                 AgentConfigTable.availability_workspace.contains([workspace]),
                 AgentConfigTable.availability_workspace.contains(["Global Availability"])
             ))
        result = await self.session.execute(stmt)
        return [AgentConfig.model_validate(r, from_attributes=True) for r in result.scalars().all()]

    async def update(self, id: UUID, update_data: dict) -> Optional[AgentConfig]:
        update_data['updated_at'] = now_utc()
        stmt = update(AgentConfigTable).where(AgentConfigTable.id == id).values(**update_data)
        await self.session.execute(stmt)
        await self.session.commit()
        return await self.get(id)

    async def delete(self, id: UUID) -> bool:
        # 1. Remove from crew members association
        from app.modules.workspaces.infrastructure.tables import crew_agents_association, CrewTable
        from sqlalchemy import delete as sa_delete

        # Remove from association table
        assoc_stmt = sa_delete(crew_agents_association).where(crew_agents_association.c.agent_id == id)
        await self.session.execute(assoc_stmt)

        # 2. Nullify manager_agent_id in crews where this agent is a manager
        manager_stmt = update(CrewTable).where(CrewTable.manager_agent_id == id).values(manager_agent_id=None)
        await self.session.execute(manager_stmt)

        # 3. Soft delete the agent
        stmt = (
            update(AgentConfigTable)
            .where(AgentConfigTable.id == id)
            .values(deleted_at=now_utc())
        )
        result = await self.session.execute(stmt)
        await self.session.commit()
        return result.rowcount > 0

    async def get_assigned_crews(self, agent_id: UUID) -> List[dict]:
        """Returns a list of crews where this agent is a member or manager."""
        from app.modules.workspaces.infrastructure.tables import CrewTable, crew_agents_association
        from sqlalchemy import or_

        # Query crews where agent is manager
        manager_stmt = select(CrewTable.id, CrewTable.crew_name).where(
            CrewTable.manager_agent_id == agent_id,
            CrewTable.deleted_at == None
        )
        manager_result = await self.session.execute(manager_stmt)
        
        # Query crews where agent is a member
        member_stmt = select(CrewTable.id, CrewTable.crew_name).join(
            crew_agents_association, CrewTable.id == crew_agents_association.c.crew_id
        ).where(
            crew_agents_association.c.agent_id == agent_id,
            CrewTable.deleted_at == None
        )
        member_result = await self.session.execute(member_stmt)

        crews = []
        for row in manager_result.all():
            crews.append({"id": str(row.id), "name": row.crew_name, "role": "Manager"})
        
        for row in member_result.all():
            # Avoid duplicates if agent is both manager and member
            if not any(c["id"] == str(row.id) for c in crews):
                crews.append({"id": str(row.id), "name": row.crew_name, "role": "Member"})
        
        return crews

    # --- Chat Sessions ---

    async def create_chat_session(self, session_data: ChatSession) -> ChatSession:
        db_obj = ChatSessionTable(**session_data.model_dump())
        self.session.add(db_obj)
        await self.session.commit()
        await self.session.refresh(db_obj)
        return ChatSession.model_validate(db_obj, from_attributes=True)

    async def get_chat_session(self, session_id: UUID) -> Optional[ChatSession]:
        stmt = select(ChatSessionTable).where(ChatSessionTable.id == session_id)
        result = await self.session.execute(stmt)
        row = result.scalar_one_or_none()
        if row:
            return ChatSession.model_validate(row, from_attributes=True)
        return None

    async def list_chat_sessions(self, agent_id: Optional[UUID] = None) -> List[ChatSession]:
        stmt = select(ChatSessionTable)
        if agent_id:
            stmt = stmt.where(ChatSessionTable.agent_id == agent_id)
        stmt = stmt.order_by(ChatSessionTable.updated_at.desc())
        result = await self.session.execute(stmt)
        return [ChatSession.model_validate(r, from_attributes=True) for r in result.scalars().all()]

    async def update_chat_session(self, session_data: ChatSession) -> Optional[ChatSession]:
        data = session_data.model_dump(exclude={"id", "created_at"})
        stmt = update(ChatSessionTable).where(ChatSessionTable.id == session_data.id).values(**data)
        await self.session.execute(stmt)
        await self.session.commit()
        return await self.get_chat_session(session_data.id)
