from typing import List, Optional
from uuid import UUID
from app.modules.workspaces.infrastructure.repo import WorkspaceRepository
from app.modules.workspaces.domain.models import Pattern, Template, Crew
from app.modules.workspaces.application.schemas import (
    CreatePatternRequest, UpdatePatternRequest,
    CreateTemplateRequest, UpdateTemplateRequest,
    CreateCrewRequest, UpdateCrewRequest
)

class WorkspaceService:
    def __init__(self, repo: WorkspaceRepository):
        self.repo = repo

    async def get_unique_workspaces(self) -> List[str]:
        """Get all unique workspace identifiers from patterns, templates, and crews."""
        return await self.repo.get_unique_workspaces()

    # --- Patterns ---
    async def list_patterns(self, workspace: Optional[str] = None) -> List[Pattern]:
        return await self.repo.list_patterns(workspace)

    async def get_pattern(self, pattern_id: UUID) -> Optional[Pattern]:
        return await self.repo.get_pattern(pattern_id)

    async def create_pattern(self, request: CreatePatternRequest) -> Pattern:
        pattern = Pattern(**request.model_dump())
        return await self.repo.create_pattern(pattern)

    async def update_pattern(self, pattern_id: UUID, request: UpdatePatternRequest) -> Optional[Pattern]:
        data = request.model_dump(exclude_unset=True)
        return await self.repo.update_pattern(pattern_id, data)

    async def delete_pattern(self, pattern_id: UUID) -> bool:
        return await self.repo.delete_pattern(pattern_id)

    # --- Templates ---
    async def list_templates(self, workspace: Optional[str] = None) -> List[Template]:
        return await self.repo.list_templates(workspace)

    async def get_template(self, template_id: UUID) -> Optional[Template]:
        return await self.repo.get_template(template_id)

    async def create_template(self, request: CreateTemplateRequest) -> Template:
        template = Template(**request.model_dump())
        return await self.repo.create_template(template)

    async def update_template(self, template_id: UUID, request: UpdateTemplateRequest) -> Optional[Template]:
        data = request.model_dump(exclude_unset=True)
        return await self.repo.update_template(template_id, data)

    async def delete_template(self, template_id: UUID) -> bool:
        return await self.repo.delete_template(template_id)

    # --- Crews ---
    async def list_crews(self, workspace: Optional[str] = None) -> List[Crew]:
        return await self.repo.list_crews(workspace)

    async def get_crew(self, crew_id: UUID) -> Optional[Crew]:
        return await self.repo.get_crew(crew_id)

    async def create_crew(self, request: CreateCrewRequest) -> Crew:
        crew = Crew(**request.model_dump(exclude={"agent_member_ids"}))
        return await self.repo.create_crew(crew, request.agent_member_ids)

    async def update_crew(self, crew_id: UUID, request: UpdateCrewRequest) -> Optional[Crew]:
        data = request.model_dump(exclude_unset=True, exclude={"agent_member_ids"})
        agent_ids = request.agent_member_ids
        return await self.repo.update_crew(crew_id, data, agent_ids)

    async def delete_crew(self, crew_id: UUID) -> bool:
        return await self.repo.delete_crew(crew_id)
