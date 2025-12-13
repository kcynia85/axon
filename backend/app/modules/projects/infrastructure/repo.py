from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from uuid import UUID
from typing import List, Optional
from backend.app.modules.projects.domain.models import Project
from backend.app.modules.projects.infrastructure.tables import ProjectTable

class ProjectRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, project: Project) -> Project:
        db_project = ProjectTable(**project.model_dump(exclude={"artifacts"}))
        self.session.add(db_project)
        await self.session.commit()
        await self.session.refresh(db_project)
        return Project.model_validate(db_project, from_attributes=True)

    async def get(self, project_id: UUID) -> Optional[Project]:
        result = await self.session.execute(select(ProjectTable).where(ProjectTable.id == project_id))
        db_project = result.scalar_one_or_none()
        if db_project:
            return Project.model_validate(db_project, from_attributes=True)
        return None

    async def list_by_user(self, user_id: UUID) -> List[Project]:
        result = await self.session.execute(select(ProjectTable).where(ProjectTable.owner_id == user_id))
        return [Project.model_validate(p, from_attributes=True) for p in result.scalars().all()]
