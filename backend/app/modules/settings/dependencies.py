from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from backend.app.shared.infrastructure.database import get_db
from backend.app.modules.settings.infrastructure.repo import SettingsRepository
from backend.app.modules.settings.application.service import SettingsService

async def get_settings_repo(db: AsyncSession = Depends(get_db)) -> SettingsRepository:
    return SettingsRepository(db)

async def get_settings_service(repo: SettingsRepository = Depends(get_settings_repo)) -> SettingsService:
    return SettingsService(repo)
