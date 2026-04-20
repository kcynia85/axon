import asyncio
import sys
import os
from dotenv import load_dotenv
from sqlalchemy import select

load_dotenv() # Load environment variables from .env

from app.shared.infrastructure.database import AsyncSessionLocal
from app.modules.system.infrastructure.repo import SystemEmbeddingRepository
from app.modules.system.application.indexing_service import SystemIndexingService

# Tables
from app.modules.agents.infrastructure.tables import AgentConfigTable
from app.modules.workspaces.infrastructure.tables import CrewTable
from app.modules.spaces.infrastructure.tables import SpaceTable
from app.modules.resources.infrastructure.tables import InternalToolTable, PromptArchetypeTable
from app.modules.projects.infrastructure.tables import ProjectTable
from app.modules.settings.infrastructure.tables import LLMProviderTable

async def index_all():
    print("Connecting to the database to index all system entities...")
    
    async with AsyncSessionLocal() as session:
        # Check if we need API key from DB
        if not os.getenv("OPENAI_API_KEY"):
            print("OPENAI_API_KEY not found in env, looking in DB...")
            stmt = select(LLMProviderTable).where(
                (LLMProviderTable.provider_technical_id == "openai") | 
                (LLMProviderTable.provider_name == "OpenAI")
            ).limit(1)
            provider = (await session.execute(stmt)).scalar_one_or_none()
            if provider and getattr(provider, "provider_api_key", None):
                os.environ["OPENAI_API_KEY"] = provider.provider_api_key
                print("Found OpenAI API key in DB.")
            else:
                print("WARNING: Could not find OpenAI API key in DB either. Indexing will likely fail.")

        repo = SystemEmbeddingRepository(session)
        service = SystemIndexingService(repo)
        
        # 1. Agents
        print("Fetching Agents...")
        agents = (await session.execute(select(AgentConfigTable))).scalars().all()
        for agent in agents:
            payload = {
                "name": getattr(agent, "agent_name", "") or str(agent.id),
                "description": getattr(agent, "agent_description", ""),
                "role": getattr(agent, "agent_role_text", ""),
                "backstory": getattr(agent, "agent_backstory", ""),
                "goal": getattr(agent, "agent_goal", "")
            }
            print(f"Indexing Agent: {payload['name']}")
            await service.index_entity(agent.id, "agent", payload)
            
        # 2. Crews
        print("Fetching Crews...")
        crews = (await session.execute(select(CrewTable))).scalars().all()
        for crew in crews:
            payload = {
                "name": getattr(crew, "name", "") or str(crew.id),
                "description": getattr(crew, "description", ""),
                "process": getattr(crew, "process", ""),
            }
            print(f"Indexing Crew: {payload['name']}")
            await service.index_entity(crew.id, "crew", payload)
            
        # 3. Spaces
        print("Fetching Spaces...")
        spaces = (await session.execute(select(SpaceTable))).scalars().all()
        for space in spaces:
            payload = {
                "name": getattr(space, "name", "") or str(space.id),
                "description": getattr(space, "description", ""),
            }
            print(f"Indexing Space: {payload['name']}")
            await service.index_entity(space.id, "space", payload)
            
        # 4. Internal Tools
        print("Fetching Internal Tools...")
        tools = (await session.execute(select(InternalToolTable))).scalars().all()
        for tool in tools:
            payload = {
                "name": getattr(tool, "name", "") or str(tool.id),
                "description": getattr(tool, "description", ""),
                "function_name": getattr(tool, "function_name", ""),
                "parameters": getattr(tool, "parameters", {})
            }
            print(f"Indexing Tool: {payload['name']}")
            await service.index_entity(tool.id, "tool", payload)
            
        # 5. Prompt Archetypes
        print("Fetching Prompt Archetypes...")
        archetypes = (await session.execute(select(PromptArchetypeTable))).scalars().all()
        for arch in archetypes:
            payload = {
                "name": getattr(arch, "name", "") or str(arch.id),
                "description": getattr(arch, "description", ""),
                "system_prompt": getattr(arch, "system_prompt", ""),
            }
            print(f"Indexing Prompt Archetype: {payload['name']}")
            await service.index_entity(arch.id, "prompt_archetype", payload)
            
        # 6. Projects
        print("Fetching Projects...")
        projects = (await session.execute(select(ProjectTable))).scalars().all()
        for project in projects:
            payload = {
                "name": getattr(project, "name", "") or str(project.id),
                "description": getattr(project, "description", ""),
                "status": str(getattr(project, "status", "")),
            }
            print(f"Indexing Project: {payload['name']}")
            await service.index_entity(project.id, "project", payload)

    print("\n✅ System indexing completed successfully.")

if __name__ == "__main__":
    asyncio.run(index_all())
