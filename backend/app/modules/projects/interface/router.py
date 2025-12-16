from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID
from typing import List
from backend.app.shared.infrastructure.database import get_db
from backend.app.modules.projects.infrastructure.repo import ProjectRepository
from backend.app.modules.projects.domain.models import Project
from backend.app.api.deps import get_current_user

router = APIRouter(
    prefix="/projects", 
    tags=["projects"],
    dependencies=[Depends(get_current_user)]
)

@router.get("/", response_model=List[Project])
async def list_projects(
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    repo = ProjectRepository(db)
    # Ensure sub is a valid UUID
    try:
        user_id = UUID(current_user["sub"])
    except ValueError:
        # Fallback for dev/mock if ID is not UUID
        user_id = UUID("00000000-0000-0000-0000-000000000000")
        
    return await repo.list_by_user(user_id)

@router.post("/", response_model=Project)
async def create_project(project: Project, db: AsyncSession = Depends(get_db)):
    repo = ProjectRepository(db)
    return await repo.create(project)

@router.get("/{project_id}", response_model=Project)
async def get_project(project_id: UUID, db: AsyncSession = Depends(get_db)):
    repo = ProjectRepository(db)
    project = await repo.get(project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project
