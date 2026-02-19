from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, delete
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
             stmt = stmt.where(AgentConfigTable.availability_workspace.contains([workspace]))
        result = await self.session.execute(stmt)
        return [AgentConfig.model_validate(r, from_attributes=True) for r in result.scalars().all()]

    async def update(self, id: UUID, update_data: dict) -> Optional[AgentConfig]:
        update_data['updated_at'] = now_utc()
        stmt = update(AgentConfigTable).where(AgentConfigTable.id == id).values(**update_data)
        await self.session.execute(stmt)
        await self.session.commit()
        return await self.get(id)

    async def delete(self, id: UUID) -> bool:
        stmt = (
            update(AgentConfigTable)
            .where(AgentConfigTable.id == id)
            .values(deleted_at=now_utc())
        )
        result = await self.session.execute(stmt)
        await self.session.commit()
        return result.rowcount > 0

    # Legacy support
    async def get_by_role(self, role: AgentRole) -> Optional[AgentConfig]:
        stmt = select(AgentConfigTable).where(AgentConfigTable.role == role)
        result = await self.session.execute(stmt)
        row = result.scalar_one_or_none()
        if row:
            return AgentConfig.model_validate(row, from_attributes=True)
        return None

    async def upsert(self, config: AgentConfig) -> AgentConfig:
        # Check if exists by role (legacy flow) or id
        existing = None
        if config.role:
            existing = await self.get_by_role(config.role)
        
        if not existing:
             # Try getting by ID if provided
             existing = await self.get(config.id)

        if existing:
            # Update
            data = config.model_dump(exclude={"id", "created_at"})
            stmt = update(AgentConfigTable).where(AgentConfigTable.id == existing.id).values(**data)
            await self.session.execute(stmt)
            await self.session.commit()
            return await self.get(existing.id)
        else:
            # Create
            return await self.create(config)

class ChatSessionRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, session_data: ChatSession) -> ChatSession:
        db_obj = ChatSessionTable(**session_data.model_dump())
        self.session.add(db_obj)
        await self.session.commit()
        await self.session.refresh(db_obj)
        return ChatSession.model_validate(db_obj, from_attributes=True)

    async def get(self, session_id: UUID) -> Optional[ChatSession]:
        stmt = select(ChatSessionTable).where(ChatSessionTable.id == session_id)
        result = await self.session.execute(stmt)
        row = result.scalar_one_or_none()
        if row:
            return ChatSession.model_validate(row, from_attributes=True)
        return None

    async def update(self, session_data: ChatSession) -> ChatSession:
        data = session_data.model_dump(exclude={"created_at"})
        stmt = update(ChatSessionTable).where(ChatSessionTable.id == session_data.id).values(**data)
        await self.session.execute(stmt)
        await self.session.commit()
        return await self.get(session_data.id)
