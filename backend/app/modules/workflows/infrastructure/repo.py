from typing import List, Optional
from uuid import UUID
from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.modules.workflows.infrastructure.tables import WorkflowTable
from app.modules.workflows.domain.models import Workflow
from app.modules.projects.infrastructure.tables import ProjectTable

class WorkflowRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def list_by_project(self, project_id: UUID) -> List[Workflow]:
        result = await self.session.execute(
            select(WorkflowTable).where(WorkflowTable.project_id == project_id)
        )
        # Convert SQLAlchemy models to Pydantic
        rows = result.scalars().all()
        return [
            Workflow(
                id=r.id,
                project_id=r.project_id,
                title=r.title,
                description=r.description or "",
                status=r.status,
                steps_count=r.steps_count,
                last_run=r.last_run,
                created_at=r.created_at,
                updated_at=r.updated_at
            ) for r in rows
        ]

    async def list_by_user(self, user_id: UUID) -> List[Workflow]:
        stmt = (
            select(WorkflowTable)
            .join(ProjectTable)
            .where(ProjectTable.owner_id == user_id)
        )
        result = await self.session.execute(stmt)
        rows = result.scalars().all()
        return [
            Workflow(
                id=r.id,
                project_id=r.project_id,
                title=r.title,
                description=r.description or "",
                status=r.status,
                steps_count=r.steps_count,
                last_run=r.last_run,
                created_at=r.created_at,
                updated_at=r.updated_at
            ) for r in rows
        ]

    async def create(self, workflow: Workflow) -> Workflow:
        db_obj = WorkflowTable(
            id=workflow.id,
            project_id=workflow.project_id,
            title=workflow.title,
            description=workflow.description,
            status=workflow.status,
            steps_count=workflow.steps_count,
            created_at=workflow.created_at,
            updated_at=workflow.updated_at
        )
        self.session.add(db_obj)
        await self.session.commit()
        await self.session.refresh(db_obj)
        return workflow

    async def delete(self, workflow_id: UUID) -> bool:
        result = await self.session.execute(select(WorkflowTable).where(WorkflowTable.id == workflow_id))
        workflow = result.scalar_one_or_none()
        if workflow:
            await self.session.delete(workflow)
            await self.session.commit()
            return True
        return False
