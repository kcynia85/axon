from uuid import UUID
from backend.app.shared.infrastructure.database import AsyncSessionLocal
from backend.app.modules.projects.infrastructure.repo import ProjectRepository

class ContextComposer:
    async def build_context(self, project_id: UUID) -> str:
        async with AsyncSessionLocal() as session:
            repo = ProjectRepository(session)
            project = await repo.get(project_id)
            
            if not project:
                return "No Project Context found."
                
            context = f"""
            --- GLOBAL CONTEXT ---
            Project: {project.name}
            Domain: {project.domain}
            Status: {project.status}
            ----------------------
            """
            return context
