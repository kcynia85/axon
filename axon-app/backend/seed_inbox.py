import asyncio
import sys
import os
from uuid import uuid4, UUID
from datetime import timedelta
from sqlalchemy import select

# Add backend to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.shared.infrastructure.database import AsyncSessionLocal
from app.modules.projects.infrastructure.tables import ProjectTable, ArtifactTable
from app.modules.inbox.infrastructure.tables import InboxItemTable
from app.modules.inbox.domain.enums import InboxItemStatus, InboxItemType, InboxItemPriority
from app.shared.utils.time import now_utc
from app.modules.projects.domain.enums import ProjectStatus, ApprovalStatus

# Use a consistent owner_id for local testing
TEST_USER_ID = UUID("00000000-0000-0000-0000-000000000000")

async def seed_inbox():
    async with AsyncSessionLocal() as session:
        print("🌱 Seeding Inbox Items...")
        
        # 1. Clean up existing test inbox items if any
        # await session.execute(delete(InboxItemTable))
        
        # 2. Ensure we have a project
        result = await session.execute(select(ProjectTable).where(ProjectTable.project_name == "Axon Demo Project"))
        project = result.scalar_one_or_none()
        
        if not project:
            project = ProjectTable(
                id=uuid4(),
                project_name="Axon Demo Project",
                project_status=ProjectStatus.IN_PROGRESS,
                project_summary="A demo project for testing inbox and other features.",
                owner_id=TEST_USER_ID
            )
            session.add(project)
            await session.commit()
            await session.refresh(project)
            print(f"✅ Created demo project: {project.id}")
        
        # 3. Create some artifacts
        artifacts_data = [
            {"name": "Technical Architecture v1", "domain": "DESIGN"},
            {"name": "Database Schema Draft", "domain": "DELIVERY"},
            {"name": "Market Research Report", "domain": "DISCOVERY"},
            {"name": "User Interview Summary", "domain": "DISCOVERY"},
            {"name": "Sprint Plan Q3", "domain": "DELIVERY"},
        ]
        
        artifacts = []
        for data in artifacts_data:
            artifact = ArtifactTable(
                id=uuid4(),
                artifact_name=data["name"],
                artifact_source_path=f"docs/{data['name'].lower().replace(' ', '_')}.md",
                artifact_deliverable_url=f"https://example.com/artifacts/{uuid4()}",
                workspace_domain=data["domain"],
                artifact_approval_status=ApprovalStatus.DRAFT,
                project_id=project.id
            )
            session.add(artifact)
            artifacts.append(artifact)
        
        await session.commit()
        print(f"✅ Created {len(artifacts)} artifacts")

        # 4. Create Inbox Items
        inbox_items_data = [
            {
                "title": "Artifact Ready for Review",
                "content": f"The artifact '{artifacts[0].artifact_name}' has been generated and is ready for your review.",
                "type": InboxItemType.ARTIFACT_READY,
                "priority": InboxItemPriority.HIGH,
                "source": "Architect Agent",
                "status": InboxItemStatus.NEW,
                "offset_minutes": 5,
                "artifact_id": artifacts[0].id
            },
            {
                "title": "Missing Information",
                "content": "I need more details about the security requirements for the new API endpoints.",
                "type": InboxItemType.CONSULTATION,
                "priority": InboxItemPriority.CRITICAL,
                "source": "Dev Agent",
                "status": InboxItemStatus.NEW,
                "offset_minutes": 15
            },
            {
                "title": "Approval Required: Budget",
                "content": "The marketing budget for next month exceeds the threshold and needs manual approval.",
                "type": InboxItemType.APPROVAL_NEEDED,
                "priority": InboxItemPriority.HIGH,
                "source": "Financial System",
                "status": InboxItemStatus.NEW,
                "offset_minutes": 45
            },
            {
                "title": "Build Failed: Backend",
                "content": "The latest commit to the backend repository failed the CI/CD pipeline due to linting errors.",
                "type": InboxItemType.ERROR_ALERT,
                "priority": InboxItemPriority.CRITICAL,
                "source": "Github Actions",
                "status": InboxItemStatus.NEW,
                "offset_minutes": 120
            },
            {
                "title": "System Update Complete",
                "content": "Axon has been updated to version 2.1.0. Check out the new features in the documentation.",
                "type": InboxItemType.SYSTEM_MESSAGE,
                "priority": InboxItemPriority.NORMAL,
                "source": "Axon System",
                "status": InboxItemStatus.NEW,
                "offset_minutes": 180
            },
            {
                "title": "Action Required: Update Profile",
                "content": "Please update your profile information to ensure correct team assignments.",
                "type": InboxItemType.ACTION_REQUIRED,
                "priority": InboxItemPriority.LOW,
                "source": "Team Manager",
                "status": InboxItemStatus.NEW,
                "offset_minutes": 300
            },
            {
                "title": "Research Complete",
                "content": f"Market research for '{project.project_name}' is finished. Check the findings in the artifacts section.",
                "type": InboxItemType.ARTIFACT_READY,
                "priority": InboxItemPriority.NORMAL,
                "source": "Research Agent",
                "status": InboxItemStatus.NEW,
                "offset_minutes": 420,
                "artifact_id": artifacts[2].id
            },
            {
                "title": "Old Resolved Task",
                "content": "This is an example of an already resolved notification.",
                "type": InboxItemType.SYSTEM_MESSAGE,
                "priority": InboxItemPriority.LOW,
                "source": "System",
                "status": InboxItemStatus.RESOLVED,
                "offset_minutes": 1440
            },
            {
                "title": "High Priority Alert",
                "content": "Server load is above 90% for the last 10 minutes. Please investigate.",
                "type": InboxItemType.ERROR_ALERT,
                "priority": InboxItemPriority.HIGH,
                "source": "Monitoring Agent",
                "status": InboxItemStatus.NEW,
                "offset_minutes": 2
            },
            {
                "title": "New Idea Proposed",
                "content": "A new idea for the mobile app navigation was added to the discovery zone.",
                "type": InboxItemType.ACTION_REQUIRED,
                "priority": InboxItemPriority.NORMAL,
                "source": "UX Designer",
                "status": InboxItemStatus.NEW,
                "offset_minutes": 10
            }
        ]

        # Add 10 more generic items to make it "full"
        for i in range(10):
            inbox_items_data.append({
                "title": f"Generic Notification #{i+1}",
                "content": f"This is a generic message to fill the inbox for UI testing purposes. Index: {i}",
                "type": InboxItemType.SYSTEM_MESSAGE,
                "priority": InboxItemPriority.LOW,
                "source": "Mock Generator",
                "status": InboxItemStatus.NEW,
                "offset_minutes": 600 + (i * 120)
            })

        for item_data in inbox_items_data:
            item = InboxItemTable(
                id=uuid4(),
                item_status=item_data["status"],
                item_type=item_data["type"],
                item_priority=item_data["priority"],
                item_title=item_data["title"],
                item_content=item_data["content"],
                item_source=item_data["source"],
                project_id=project.id,
                artifact_id=item_data.get("artifact_id"),
                created_at=now_utc() - timedelta(minutes=item_data["offset_minutes"]),
                resolved_at=now_utc() if item_data["status"] == InboxItemStatus.RESOLVED else None
            )
            session.add(item)
        
        await session.commit()
        print(f"✅ Successfully seeded {len(inbox_items_data)} inbox items.")

if __name__ == "__main__":
    asyncio.run(seed_inbox())
