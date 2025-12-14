from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from uuid import UUID
from typing import List, Optional
from backend.app.modules.projects.domain.models import Project, Artifact
from backend.app.modules.projects.infrastructure.tables import ProjectTable, ArtifactTable
from backend.app.modules.projects.domain.enums import ReviewState

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

class ArtifactRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def list_for_inbox(self, user_id: UUID) -> List[Artifact]:
        """
        List all artifacts that are in DRAFT or REVIEW status for projects owned by the user.
        """
        # Join Artifact with Project to filter by Project Owner
        stmt = (
            select(ArtifactTable)
            .join(ProjectTable)
            .where(
                ProjectTable.owner_id == user_id,
                ArtifactTable.status.in_([ReviewState.DRAFT, ReviewState.REVIEW])
            )
            .order_by(ArtifactTable.updated_at.desc())
        )
        result = await self.session.execute(stmt)
        return [Artifact.model_validate(a, from_attributes=True) for a in result.scalars().all()]

    async def get(self, artifact_id: UUID) -> Optional[Artifact]:
        result = await self.session.execute(select(ArtifactTable).where(ArtifactTable.id == artifact_id))
        db_artifact = result.scalar_one_or_none()
        if db_artifact:
            return Artifact.model_validate(db_artifact, from_attributes=True)
        return None
