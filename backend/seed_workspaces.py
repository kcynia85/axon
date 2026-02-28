import asyncio
import sys
import os
from uuid import uuid4
from datetime import datetime
from sqlalchemy import text

# Add backend to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), ".")))

from app.shared.infrastructure.database import AsyncSessionLocal
from app.modules.workspaces.infrastructure.tables import PatternTable, TemplateTable, CrewTable
from app.modules.workspaces.domain.enums import PatternType, ProcessType

async def seed_workspaces():
    print("🌱 Seeding Workspaces via Patterns and Crews...")
    async with AsyncSessionLocal() as session:
        # Check if patterns exist
        result = await session.execute(text("SELECT count(*) FROM patterns"))
        count = result.scalar()
        if count > 0:
            print("ℹ️ Workspaces data already exists.")
            return

        # Create a Pattern for 'Marketing' workspace
        pattern = PatternTable(
            id=uuid4(),
            pattern_name="SEO Strategy Pattern",
            pattern_type=PatternType.PATTERN,
            pattern_graph_structure={"nodes": [], "edges": []},
            pattern_keywords=["seo", "marketing"],
            availability_workspace=["Marketing"],
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        session.add(pattern)

        # Create a Crew for 'Research' workspace
        crew = CrewTable(
            id=uuid4(),
            crew_name="Deep Research Team",
            crew_description="Specialized team for market analysis",
            crew_process_type=ProcessType.SEQUENTIAL,
            crew_keywords=["research", "analysis"],
            availability_workspace=["Research"],
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        session.add(crew)

        # Create a Template for 'Engineering' workspace
        template = TemplateTable(
            id=uuid4(),
            template_name="Code Review Checklist",
            template_description="Standard engineering quality check",
            template_markdown_content="# Checklist\n- [ ] Test 1",
            template_keywords=["engineering", "quality"],
            availability_workspace=["Engineering"],
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        session.add(template)

        await session.commit()
        print("✅ Workspaces seeded successfully (Marketing, Research, Engineering).")

if __name__ == "__main__":
    asyncio.run(seed_workspaces())
