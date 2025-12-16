import asyncio
import sys
import os
from sqlalchemy import select

# Add backend to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from backend.app.shared.infrastructure.database import AsyncSessionLocal
from backend.app.modules.projects.infrastructure.tables import ScenarioTable, ProjectTable
from backend.app.modules.projects.domain.enums import HubType, Status
from backend.app.modules.workflows.infrastructure.tables import WorkflowTable
from uuid import uuid4

async def seed_scenarios(session):
    print("🌱 Seeding Global Scenarios (Templates)...")
    
    templates = [
        {
            "title": "Deep Research Assistant",
            "description": "Conducts thorough research on a given topic, aggregating sources and summarizing key findings.",
            "category": "Research",
            "prompt_template": "You are a research assistant. Investigate the topic: {{topic}}. Provide a summary with citations.",
            "icon": "globe"
        },
        {
            "title": "Code Review Partner",
            "description": "Analyzes code pull requests for potential bugs, security issues, and style violations.",
            "category": "Engineering",
            "prompt_template": "Review the following code diff. Focus on security and performance: {{code}}",
            "icon": "code"
        },
        {
            "title": "SEO Content Writer",
            "description": "Generates SEO-optimized blog posts based on keywords and target audience analysis.",
            "category": "Marketing",
            "prompt_template": "Write a blog post about {{keywords}} targeting {{audience}}.",
            "icon": "pen"
        },
        {
            "title": "Legal Contract Analyzer",
            "description": "Extracts key clauses, risks, and obligations from legal documents.",
            "category": "Legal",
            "prompt_template": "Analyze this contract and list all termination clauses: {{document}}",
            "icon": "file-text"
        }
    ]

    for t in templates:
        # Check if exists
        exists = await session.execute(select(ScenarioTable).where(ScenarioTable.title == t["title"]))
        if not exists.scalar_one_or_none():
            scenario = ScenarioTable(
                id=uuid4(),
                project_id=None, # Global Template
                title=t["title"],
                description=t["description"],
                category=t["category"],
                prompt_template=t["prompt_template"],
                icon=t["icon"]
            )
            session.add(scenario)
    
    await session.commit()
    print("✅ Scenarios seeded.")

async def seed_demo_project_and_workflow(session):
    print("🌱 Checking for users to seed Demo Project...")
    
    # We need a user to assign the project to. 
    # Since we use Supabase Auth, users are in 'auth.users' table which we might not have direct ORM access to easily 
    # without raw SQL or if we haven't mapped it.
    # However, our ProjectTable stores owner_id (UUID). 
    # We will try to find ANY project. If none, we can't easily guess a valid owner_id without querying auth schema.
    # But wait, RLS is enabled. We might not be able to insert for a random ID if we were running via API, 
    # but this script runs as backend/admin with direct DB access (bypassing RLS if using superuser or direct connection).
    
    # Let's try to query the public.projects table to see if any user has created a project yet.
    result = await session.execute(select(ProjectTable).limit(1))
    project = result.scalar_one_or_none()
    
    if project:
        print(f"ℹ️ Found existing project: {project.name} (Owner: {project.owner_id})")
        user_id = project.owner_id
        
        # Check if this project has a workflow
        wf_result = await session.execute(select(WorkflowTable).where(WorkflowTable.project_id == project.id))
        if not wf_result.scalar_one_or_none():
            print("🌱 Seeding Demo Workflow for this project...")
            wf = WorkflowTable(
                id=uuid4(),
                project_id=project.id,
                title="Demo Research Pipeline",
                description="A sample workflow to demonstrate capabilities.",
                status="ACTIVE",
                steps_count=3
            )
            session.add(wf)
            await session.commit()
            print("✅ Demo Workflow seeded.")
        else:
            print("ℹ️ Workflows already exist for this project.")
            
    else:
        print("⚠️ No projects found. Cannot seed Workflows (need a valid user/owner_id).")
        print("💡 Hint: Log in to the Frontend and create a 'Demo Project' first, then run this script again.")

async def main():
    async with AsyncSessionLocal() as session:
        await seed_scenarios(session)
        await seed_demo_project_and_workflow(session)

if __name__ == "__main__":
    asyncio.run(main())
