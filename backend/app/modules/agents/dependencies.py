from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.shared.infrastructure.database import get_db
from app.shared.infrastructure.inngest_client import inngest_client
from app.modules.agents.infrastructure.repo import AgentConfigRepository

async def get_inngest_client():
    return inngest_client

async def get_agent_repo(db: AsyncSession = Depends(get_db)) -> AgentConfigRepository:
    return AgentConfigRepository(db)
