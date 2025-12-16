from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Optional
from uuid import UUID
from backend.app.api.deps import get_db, get_current_user
from backend.app.shared.security.schemas import UserPayload
from sqlalchemy.ext.asyncio import AsyncSession
from backend.app.modules.workflows.domain.models import Workflow
from backend.app.modules.workflows.infrastructure.repo import WorkflowRepository

router = APIRouter(
    prefix="/workflows",
    tags=["workflows"]
)

@router.get("/", response_model=List[Workflow])
async def list_workflows(
    project_id: Optional[UUID] = Query(None),
    db: AsyncSession = Depends(get_db),
    user: UserPayload = Depends(get_current_user)
):
    repo = WorkflowRepository(db)
    if project_id:
        # TODO: Verify user owns project
        return await repo.list_by_project(project_id)
    else:
        return await repo.list_by_user(user.sub)

@router.post("/", response_model=Workflow)
async def create_workflow(
    workflow: Workflow,
    db: AsyncSession = Depends(get_db),
    user: UserPayload = Depends(get_current_user)
):
    repo = WorkflowRepository(db)
    # TODO: Verify user owns project_id in workflow
    return await repo.create(workflow)

@router.delete("/{workflow_id}", status_code=204)
async def delete_workflow(
    workflow_id: UUID,
    db: AsyncSession = Depends(get_db),
    user: UserPayload = Depends(get_current_user)
):
    repo = WorkflowRepository(db)
    # TODO: Verify ownership
    success = await repo.delete(workflow_id)
    if not success:
        raise HTTPException(status_code=404, detail="Workflow not found")
    return
