from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from typing import Optional, List
from uuid import UUID
from backend.app.modules.agents.domain.models import AgentConfig, ChatSession
from backend.app.modules.agents.infrastructure.tables import AgentConfigTable, ChatSessionTable
from backend.app.modules.agents.domain.enums import AgentRole

class AgentConfigRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_by_role(self, role: AgentRole) -> Optional[AgentConfig]:
        stmt = select(AgentConfigTable).where(AgentConfigTable.role == role)
        result = await self.session.execute(stmt)
        row = result.scalar_one_or_none()
        if row:
            return AgentConfig.model_validate(row, from_attributes=True)
        return None

    async def list_all(self) -> List[AgentConfig]:
        stmt = select(AgentConfigTable)
        result = await self.session.execute(stmt)
        return [AgentConfig.model_validate(r, from_attributes=True) for r in result.scalars().all()]

    async def upsert(self, config: AgentConfig) -> AgentConfig:
        # Check if exists
        existing = await self.get_by_role(config.role)
        
        if existing:
            # Update
            # We exclude id/created_at to preserve them. updated_at handles itself via onupdate in Table? 
            # Actually SA onupdate handles DB side, but Pydantic model might have new val.
            # We trust the DB to handle updated_at or pass it.
            data = config.model_dump(exclude={"id", "created_at"})
            stmt = update(AgentConfigTable).where(AgentConfigTable.role == config.role).values(**data)
            await self.session.execute(stmt)
            await self.session.commit()
            
            # Fetch updated
            return await self.get_by_role(config.role)
        else:
            # Create
            db_obj = AgentConfigTable(**config.model_dump())
            self.session.add(db_obj)
            await self.session.commit()
            await self.session.refresh(db_obj)
            return AgentConfig.model_validate(db_obj, from_attributes=True)

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
