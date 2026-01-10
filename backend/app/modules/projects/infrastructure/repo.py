from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from uuid import UUID
from typing import List, Optional
from backend.app.modules.projects.domain.models import Project, Artifact, Scenario
from backend.app.modules.projects.infrastructure.tables import ProjectTable, ArtifactTable, ScenarioTable
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

    async def delete(self, project_id: UUID) -> bool:
        result = await self.session.execute(select(ProjectTable).where(ProjectTable.id == project_id))
        project = result.scalar_one_or_none()
        if project:
            await self.session.delete(project)
            await self.session.commit()
            return True
        return False

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
                ArtifactTable.status.in_([ReviewState.DRAFT, ReviewState.REVIEWED])
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

    async def create(self, artifact: Artifact) -> Artifact:
        db_obj = ArtifactTable(
            id=artifact.id,
            project_id=artifact.project_id,
            title=artifact.title,
            type=artifact.type,
            content=artifact.content,
            status=artifact.status,
            metadata_=artifact.metadata,
            created_at=artifact.created_at,
            updated_at=artifact.updated_at
        )
        self.session.add(db_obj)
        await self.session.commit()
        await self.session.refresh(db_obj)
        return Artifact.model_validate(db_obj, from_attributes=True)

class ScenarioRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def list_by_project(self, project_id: UUID) -> List[Scenario]:
        result = await self.session.execute(select(ScenarioTable).where(ScenarioTable.project_id == project_id))
        return [Scenario.model_validate(s, from_attributes=True) for s in result.scalars().all()]

    async def list_templates(self) -> List[Scenario]:
        result = await self.session.execute(select(ScenarioTable).where(ScenarioTable.project_id == None))
        return [Scenario.model_validate(s, from_attributes=True) for s in result.scalars().all()]

    async def create(self, scenario: Scenario) -> Scenario:
        db_obj = ScenarioTable(
            id=scenario.id,
            project_id=scenario.project_id,
            title=scenario.title,
            description=scenario.description,
            category=scenario.category,
            prompt_template=scenario.prompt_template,
            icon=scenario.icon,
            created_at=scenario.created_at,
            updated_at=scenario.updated_at
        )
        self.session.add(db_obj)
        await self.session.commit()
        await self.session.refresh(db_obj)
        return Scenario.model_validate(db_obj, from_attributes=True)
