from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.shared.infrastructure.database import get_db
from app.modules.knowledge.infrastructure.repo import AssetRepository

async def get_asset_repo(db: AsyncSession = Depends(get_db)) -> AssetRepository:
    return AssetRepository(db)
