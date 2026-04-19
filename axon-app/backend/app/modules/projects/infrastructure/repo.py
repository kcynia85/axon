from uuid import UUID, uuid4
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, delete
from sqlalchemy.orm import selectinload
from app.modules.projects.domain.models import Project, KeyResource, Artifact
from app.modules.projects.domain.enums import ResourceProvider
from app.modules.projects.infrastructure.tables import ProjectTable, KeyResourceTable, ArtifactTable
from app.shared.utils.time import now_utc

class ProjectRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    def _get_provider_type(self, url: str) -> ResourceProvider:
        lower_url = url.lower()
        if "notion.so" in lower_url:
            return ResourceProvider.NOTION
        if "figma.com" in lower_url:
            return ResourceProvider.FIGMA
        if "github.com" in lower_url:
            return ResourceProvider.GITHUB
        return ResourceProvider.OTHER

    async def _sync_resources(self, project_id: UUID, urls: List[str]):
        # Delete existing resources for this project
        await self.session.execute(
            delete(KeyResourceTable).where(KeyResourceTable.project_id == project_id)
        )
        
        # Add new resources
        for url in urls:
            if not url or not url.strip():
                continue
            
            provider = self._get_provider_type(url)
            db_res = KeyResourceTable(
                id=uuid4(),
                project_id=project_id,
                resource_url=url,
                resource_label=provider.value,
                resource_provider_type=provider
            )
            self.session.add(db_res)

    def _to_domain(self, row: ProjectTable) -> Project:
        return Project(
            id=row.id,
            project_name=row.project_name,
            project_status=row.project_status,
            project_summary=row.project_summary,
            project_keywords=row.project_keywords or [],
            project_strategy_url=row.project_strategy_url,
            space_ids=row.space_ids or [],
            owner_id=row.owner_id,

            created_at=row.created_at,
            updated_at=row.updated_at,
            # Eagerly loaded
            key_resources=[
                KeyResource(
                    id=kr.id,
                    resource_provider_type=kr.resource_provider_type,
                    resource_label=kr.resource_label,
                    resource_url=kr.resource_url,
                    resource_icon=kr.resource_icon,
                    project_id=kr.project_id,
                    created_at=kr.created_at,
                    updated_at=kr.updated_at
                ) for kr in row.key_resources
            ],
            artifacts=[
                Artifact(
                    id=a.id,
                    artifact_name=a.artifact_name,
                    artifact_source_path=a.artifact_source_path,
                    artifact_deliverable_url=a.artifact_deliverable_url,
                    workspace_domain=a.workspace_domain,
                    artifact_approval_status=a.artifact_approval_status,
                    approved_by_user_id=a.approved_by_user_id,
                    artifact_approved_at=a.artifact_approved_at,
                    project_id=a.project_id,
                    created_at=a.created_at,
                    updated_at=a.updated_at
                ) for a in row.artifacts
            ],
        )

    async def create(self, project: Project) -> Project:
        db_project = ProjectTable(
            id=project.id,
            project_name=project.project_name,
            project_status=project.project_status,
            project_summary=project.project_summary,
            project_keywords=project.project_keywords,
            project_strategy_url=project.project_strategy_url,
            space_ids=[str(sid) for sid in project.space_ids] if project.space_ids else [],
            owner_id=project.owner_id,
            created_at=project.created_at,
            updated_at=project.updated_at
        )
        self.session.add(db_project)
        await self.session.commit()
        # Eager load relationships to avoid MissingGreenlet on _to_domain
        result = await self.session.execute(
            select(ProjectTable)
            .where(ProjectTable.id == db_project.id)
            .options(
                selectinload(ProjectTable.key_resources),
                selectinload(ProjectTable.artifacts)
            )
        )
        row = result.scalar_one()
        return self._to_domain(row)

    async def get(self, project_id: UUID) -> Optional[Project]:
        result = await self.session.execute(
            select(ProjectTable)
            .where(ProjectTable.id == project_id)
            .options(
                selectinload(ProjectTable.key_resources),
                selectinload(ProjectTable.artifacts)
            )
        )
        row = result.scalar_one_or_none()
        return self._to_domain(row) if row else None

    async def list_by_user(self, owner_id: UUID, limit: int = 100, offset: int = 0) -> List[Project]:
        result = await self.session.execute(
            select(ProjectTable)
            .where(ProjectTable.owner_id == owner_id)
            .limit(limit)
            .offset(offset)
            .order_by(ProjectTable.updated_at.desc())
            .options(
                selectinload(ProjectTable.key_resources),
                selectinload(ProjectTable.artifacts)
            )
        )
        return [self._to_domain(row) for row in result.scalars().all()]

    async def update(self, project_id: UUID, update_data: dict) -> Optional[Project]:
        # Filter valid columns
        valid_cols = {c.key for c in ProjectTable.__table__.columns}
        
        # Extract key_resources for separate handling
        key_resources_urls = update_data.pop('key_resources', None)
        
        clean_data = {k: v for k, v in update_data.items() if k in valid_cols and k != 'id'}
        
        # Sync resources if provided
        if key_resources_urls is not None:
            await self._sync_resources(project_id, key_resources_urls)

        if not clean_data:
            if key_resources_urls is not None:
                await self.session.commit()
            return await self.get(project_id)
            
        # Convert UUIDs to strings for JSONB columns
        if 'space_ids' in clean_data and clean_data['space_ids'] is not None:
            clean_data['space_ids'] = [str(sid) for sid in clean_data['space_ids']]

        clean_data['updated_at'] = now_utc()

        stmt = (
            update(ProjectTable)
            .where(ProjectTable.id == project_id)
            .values(**clean_data)
            .execution_options(synchronize_session="fetch")
        )
        await self.session.execute(stmt)
        await self.session.commit()
        return await self.get(project_id)

    async def delete(self, project_id: UUID) -> bool:
        stmt = delete(ProjectTable).where(ProjectTable.id == project_id)
        result = await self.session.execute(stmt)
        await self.session.commit()
        return result.rowcount > 0

    # --- Child Entity Methods ---

    async def add_resource(self, resource: KeyResource) -> KeyResource:
        db_res = KeyResourceTable(**resource.model_dump())
        self.session.add(db_res)
        await self.session.commit()
        await self.session.refresh(db_res)
        return resource # Return domain object

    async def add_artifact(self, artifact: Artifact) -> Artifact:
        db_art = ArtifactTable(**artifact.model_dump())
        self.session.add(db_art)
        await self.session.commit()
        await self.session.refresh(db_art)
        return artifact


class ArtifactRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def list_by_project(self, project_id: UUID) -> List[Artifact]:
        """List all artifacts for a given project."""
        result = await self.session.execute(
            select(ArtifactTable)
            .where(ArtifactTable.project_id == project_id)
            .order_by(ArtifactTable.created_at.desc())
        )
        rows = result.scalars().all()
        return [
            Artifact(
                id=r.id,
                artifact_name=r.artifact_name,
                artifact_source_path=r.artifact_source_path,
                artifact_deliverable_url=r.artifact_deliverable_url,
                workspace_domain=r.workspace_domain,
                artifact_approval_status=r.artifact_approval_status,
                approved_by_user_id=r.approved_by_user_id,
                artifact_approved_at=r.artifact_approved_at,
                project_id=r.project_id,
                created_at=r.created_at,
                updated_at=r.updated_at
            ) for r in rows
        ]

    async def list_for_inbox(self, owner_id: UUID) -> List[Artifact]:
        """List artifacts requiring review for a given user."""
        from sqlalchemy import or_
        from app.modules.projects.domain.enums import ApprovalStatus
        result = await self.session.execute(
            select(ArtifactTable)
            .where(ArtifactTable.approved_by_user_id.is_(None))
            .where(
                or_(
                    ArtifactTable.artifact_approval_status == ApprovalStatus.IN_REVIEW.value,
                    ArtifactTable.artifact_approval_status.is_(None)
                )
            )
            .order_by(ArtifactTable.created_at.desc())
            .limit(100)
        )
        rows = result.scalars().all()
        return [
            Artifact(
                id=r.id,
                artifact_name=r.artifact_name,
                artifact_source_path=r.artifact_source_path,
                artifact_deliverable_url=r.artifact_deliverable_url,
                workspace_domain=r.workspace_domain,
                artifact_approval_status=r.artifact_approval_status,
                approved_by_user_id=r.approved_by_user_id,
                artifact_approved_at=r.artifact_approved_at,
                project_id=r.project_id,
                created_at=r.created_at,
                updated_at=r.updated_at
            ) for r in rows
        ]
