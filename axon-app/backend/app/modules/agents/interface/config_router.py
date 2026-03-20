from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from app.shared.infrastructure.database import get_db
from app.modules.agents.domain.models import AgentConfig
from app.modules.agents.domain.enums import AgentRole
from app.modules.agents.infrastructure.repo import AgentConfigRepository

router = APIRouter(prefix="/agents/configs", tags=["agent-configs"])

@router.get("/", response_model=List[AgentConfig])
async def list_configs(db: AsyncSession = Depends(get_db)):
    repo = AgentConfigRepository(db)
    return await repo.list_all()

@router.get("/{role}", response_model=AgentConfig)
async def get_config(role: AgentRole, db: AsyncSession = Depends(get_db)):
    repo = AgentConfigRepository(db)
    config = await repo.get_by_role(role)
    if not config:
        raise HTTPException(status_code=404, detail="Config not found")
    return config

@router.put("/{role}", response_model=AgentConfig)
async def update_config(role: AgentRole, config: AgentConfig, db: AsyncSession = Depends(get_db)):
    if config.role != role:
        raise HTTPException(status_code=400, detail="Role in path must match body")
    
    repo = AgentConfigRepository(db)
    return await repo.upsert(config)
