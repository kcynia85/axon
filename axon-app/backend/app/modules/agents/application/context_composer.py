from uuid import UUID
from app.shared.infrastructure.database import AsyncSessionLocal
from app.modules.projects.infrastructure.repo import ProjectRepository

class ContextComposer:
    async def build_context(self, project_id: UUID) -> str:
        print(f"Debug ContextComposer: Starting build_context for project_id: {project_id}")
        try:
            async with AsyncSessionLocal() as session:
                print("Debug ContextComposer: Database session opened.")
                repo = ProjectRepository(session)
                project = await repo.get(project_id)
                
                if not project:
                    print(f"Debug ContextComposer: Project {project_id} not found.")
                    return "No Project Context found."
                    
                context = f"""
                --- GLOBAL CONTEXT ---
                Project: {project.name}
                Domain: {project.domain}
                Status: {project.status}
                ----------------------
                """
                print("Debug ContextComposer: Context built successfully.")
                return context
        except Exception as e:
            print(f"Debug ContextComposer: ERROR during build_context: {e}")
            raise e
