from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, or_
from typing import Optional, List
from uuid import UUID
from app.modules.agents.domain.models import AgentConfig, ChatSession
from app.modules.agents.domain.enums import AgentRole
from app.modules.agents.infrastructure.tables import AgentConfigTable, ChatSessionTable
from app.shared.utils.time import now_utc

# --- Functional-First Repository Layer ---

async def create_agent_config(session: AsyncSession, config: AgentConfig) -> AgentConfig:
    db_obj = AgentConfigTable(**config.model_dump())
    session.add(db_obj)
    await session.commit()
    await session.refresh(db_obj)
    return AgentConfig.model_validate(db_obj, from_attributes=True)

async def get_agent_config(session: AsyncSession, id: UUID) -> Optional[AgentConfig]:
    stmt = select(AgentConfigTable).where(AgentConfigTable.id == id)
    result = await session.execute(stmt)
    row = result.scalar_one_or_none()
    if row:
        return AgentConfig.model_validate(row, from_attributes=True)
    return None

async def get_agent_config_by_role(session: AsyncSession, role: AgentRole) -> Optional[AgentConfig]:
    stmt = select(AgentConfigTable).where(AgentConfigTable.role == role)
    result = await session.execute(stmt)
    row = result.scalar_one_or_none()
    if row:
        return AgentConfig.model_validate(row, from_attributes=True)
    return None

async def list_agent_configs(session: AsyncSession, workspace: Optional[str] = None) -> List[AgentConfig]:
    stmt = select(AgentConfigTable).where(AgentConfigTable.deleted_at == None)
    if workspace:
         stmt = stmt.where(or_(
             AgentConfigTable.availability_workspace.contains([workspace]),
             AgentConfigTable.availability_workspace.contains(["Global Availability"])
         ))
    result = await session.execute(stmt)
    return [AgentConfig.model_validate(r, from_attributes=True) for r in result.scalars().all()]

async def list_all_agent_configs(session: AsyncSession) -> List[AgentConfig]:
    stmt = select(AgentConfigTable).where(AgentConfigTable.deleted_at == None)
    result = await session.execute(stmt)
    return [AgentConfig.model_validate(r, from_attributes=True) for r in result.scalars().all()]

async def update_agent_config(session: AsyncSession, id: UUID, update_data: dict) -> Optional[AgentConfig]:
    update_data['updated_at'] = now_utc()
    stmt = update(AgentConfigTable).where(AgentConfigTable.id == id).values(**update_data)
    await session.execute(stmt)
    await session.commit()
    return await get_agent_config(session, id)

async def upsert_agent_config(session: AsyncSession, config: AgentConfig) -> AgentConfig:
    existing = await get_agent_config_by_role(session, config.role) if config.role else None
    if existing:
        return await update_agent_config(session, existing.id, config.model_dump(exclude={"id", "created_at"}))
    return await create_agent_config(session, config)

async def delete_agent_config(session: AsyncSession, id: UUID) -> bool:
    # 1. Remove from crew members association
    from app.modules.workspaces.infrastructure.tables import crew_agents_association, CrewTable
    from sqlalchemy import delete as sa_delete

    # Remove from association table
    assoc_stmt = sa_delete(crew_agents_association).where(crew_agents_association.c.agent_id == id)
    await session.execute(assoc_stmt)

    # 2. Nullify manager_agent_id in crews where this agent is a manager
    manager_stmt = update(CrewTable).where(CrewTable.manager_agent_id == id).values(manager_agent_id=None)
    await session.execute(manager_stmt)

    # 3. Soft delete the agent
    stmt = (
        update(AgentConfigTable)
        .where(AgentConfigTable.id == id)
        .values(deleted_at=now_utc())
    )
    result = await session.execute(stmt)
    await session.commit()
    return result.rowcount > 0

async def get_agent_assigned_crews(session: AsyncSession, agent_id: UUID) -> List[dict]:
    """Returns a list of crews where this agent is a member or manager."""
    from app.modules.workspaces.infrastructure.tables import CrewTable, crew_agents_association

    # Query crews where agent is manager
    manager_stmt = select(CrewTable.id, CrewTable.crew_name).where(
        CrewTable.manager_agent_id == agent_id,
        CrewTable.deleted_at == None
    )
    manager_result = await session.execute(manager_stmt)
    
    # Query crews where agent is a member
    member_stmt = select(CrewTable.id, CrewTable.crew_name).join(
        crew_agents_association, CrewTable.id == crew_agents_association.c.crew_id
    ).where(
        crew_agents_association.c.agent_id == agent_id,
        CrewTable.deleted_at == None
    )
    member_result = await session.execute(member_stmt)

    crews = []
    for row in manager_result.all():
        crews.append({"id": str(row.id), "name": row.crew_name, "role": "Manager"})
    
    for row in member_result.all():
        # Avoid duplicates if agent is both manager and member
        if not any(c["id"] == str(row.id) for c in crews):
            crews.append({"id": str(row.id), "name": row.crew_name, "role": "Member"})
    
    return crews

# --- Class-Based Wrapper (for backward compatibility) ---

class AgentConfigRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def list_all(self) -> List[AgentConfig]:
        return await list_all_agent_configs(self.session)

    async def get_by_role(self, role: AgentRole) -> Optional[AgentConfig]:
        return await get_agent_config_by_role(self.session, role)

    async def upsert(self, config: AgentConfig) -> AgentConfig:
        return await upsert_agent_config(self.session, config)

    async def get(self, id: UUID) -> Optional[AgentConfig]:
        return await get_agent_config(self.session, id)

    async def list(self, workspace: Optional[str] = None) -> List[AgentConfig]:
        return await list_agent_configs(self.session, workspace)

# --- Chat Sessions ---

async def create_chat_session(session: AsyncSession, session_data: ChatSession) -> ChatSession:
    db_obj = ChatSessionTable(**session_data.model_dump())
    session.add(db_obj)
    await session.commit()
    await session.refresh(db_obj)
    return ChatSession.model_validate(db_obj, from_attributes=True)

async def get_chat_session(session: AsyncSession, session_id: UUID) -> Optional[ChatSession]:
    stmt = select(ChatSessionTable).where(ChatSessionTable.id == session_id)
    result = await session.execute(stmt)
    row = result.scalar_one_or_none()
    if row:
        return ChatSession.model_validate(row, from_attributes=True)
    return None

async def list_chat_sessions(session: AsyncSession, agent_id: Optional[UUID] = None) -> List[ChatSession]:
    stmt = select(ChatSessionTable)
    if agent_id:
        stmt = stmt.where(ChatSessionTable.agent_id == agent_id)
    stmt = stmt.order_by(ChatSessionTable.updated_at.desc())
    result = await session.execute(stmt)
    return [ChatSession.model_validate(r, from_attributes=True) for r in result.scalars().all()]

async def update_chat_session(session: AsyncSession, session_data: ChatSession) -> Optional[ChatSession]:
    data = session_data.model_dump(exclude={"id", "created_at"})
    stmt = update(ChatSessionTable).where(ChatSessionTable.id == session_data.id).values(**data)
    await session.execute(stmt)
    await session.commit()
    return await get_chat_session(session, session_data.id)
