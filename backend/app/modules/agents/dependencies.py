from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from backend.app.shared.infrastructure.database import get_db
from backend.app.shared.infrastructure.inngest_client import inngest_client
from backend.app.modules.agents.infrastructure.repo import AgentConfigRepository

async def get_inngest_client():
    return inngest_client

async def get_agent_repo(db: AsyncSession = Depends(get_db)) -> AgentConfigRepository:
    return AgentConfigRepository(db)
