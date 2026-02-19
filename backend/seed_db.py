import asyncio
import sys
import os
from sqlalchemy import select
from uuid import uuid4

# Add backend to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.shared.infrastructure.database import AsyncSessionLocal
from app.modules.projects.infrastructure.tables import ProjectTable
from app.modules.projects.domain.enums import ProjectStatus
from app.modules.workflows.infrastructure.tables import WorkflowTable
from app.modules.spaces.infrastructure.tables import SpaceTable, SpaceNodeTable, SpaceZoneTable
from app.modules.spaces.domain.enums import SpaceStatus, WorkspaceDomain, NodeExecutionStatus

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
        print(f"ℹ️ Found existing project: {project.project_name} (Owner: {project.owner_id})")
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

async def seed_demo_space(session):
    """Seed a full demo space with all workspace zones and node types per breadboard spec."""
    print("🌱 Seeding Full Demo Space...")
    
    # Check if full demo space exists
    exists = await session.execute(select(SpaceTable).where(SpaceTable.space_name == "Complete Demo Space"))
    if exists.scalar_one_or_none():
        print("ℹ️ Complete Demo Space already exists.")
        return
    
    # Get any project to link to
    result = await session.execute(select(ProjectTable).limit(1))
    project = result.scalar_one_or_none()
    owner_id = project.owner_id if project else uuid4()
    
    # Use fixed UUID for demo space so frontend can reference it
    demo_id = uuid4()
    
    # Create complete demo space
    space = SpaceTable(
        id=demo_id,
        space_name="Complete Demo Space",
        space_description="Full-featured space with all node types and workspace zones per IA spec",
        space_status=SpaceStatus.DRAFT,
        project_id=project.id if project else None,
        owner_id=owner_id,
        space_viewport_config={"x": 0, "y": 0, "zoom": 0.8}
    )
    session.add(space)
    
    # Create 4 Workspace Zones with distinct colors per IA spec
    zones_data = [
        {
            "id": uuid4(),
            "domain": WorkspaceDomain.DISCOVERY,
            "x": 0, "y": 0, "width": 600, "height": 500,
            "color": "#dbeafe"  # Light blue
        },
        {
            "id": uuid4(),
            "domain": WorkspaceDomain.DESIGN,
            "x": 650, "y": 0, "width": 600, "height": 500,
            "color": "#fef3c7"  # Light amber/yellow
        },
        {
            "id": uuid4(),
            "domain": WorkspaceDomain.DELIVERY,
            "x": 0, "y": 550, "width": 600, "height": 500,
            "color": "#d1fae5"  # Light green
        },
        {
            "id": uuid4(),
            "domain": WorkspaceDomain.GROWTH,
            "x": 650, "y": 550, "width": 600, "height": 500,
            "color": "#fce7f3"  # Light pink
        }
    ]
    
    zones = []
    for z in zones_data:
        zone = SpaceZoneTable(
            id=z["id"],
            workspace_domain=z["domain"],
            zone_position_x=z["x"],
            zone_position_y=z["y"],
            zone_width=z["width"],
            zone_height=z["height"],
            zone_color=z["color"],
            space_id=demo_id
        )
        session.add(zone)
        zones.append(zone)
    
    # Create nodes of different types
    nodes_data = [
        # Discovery Zone - Research Agent
        {
            "id": uuid4(), "label": "Research Agent", "x": 100, "y": 100,
            "type": "agent", "status": NodeExecutionStatus.IDLE,
            "zone_idx": 0
        },
        # Discovery Zone - Sequential Crew (arrow icon)
        {
            "id": uuid4(), "label": "Research Crew →", "x": 350, "y": 100,
            "type": "crew", "status": NodeExecutionStatus.IDLE,
            "zone_idx": 0, "process_type": "sequential"
        },
        # Design Zone - Designer Agent
        {
            "id": uuid4(), "label": "Designer Agent", "x": 750, "y": 100,
            "type": "agent", "status": NodeExecutionStatus.WORKING,
            "zone_idx": 1
        },
        # Design Zone - Parallel Crew (lightning icon)
        {
            "id": uuid4(), "label": "Design Crew ⚡", "x": 1000, "y": 100,
            "type": "crew", "status": NodeExecutionStatus.IDLE,
            "zone_idx": 1, "process_type": "parallel"
        },
        # Design Zone - Pattern
        {
            "id": uuid4(), "label": "Design System Pattern", "x": 875, "y": 300,
            "type": "pattern", "status": NodeExecutionStatus.IDLE,
            "zone_idx": 1
        },
        # Delivery Zone - Dev Agent
        {
            "id": uuid4(), "label": "Dev Agent", "x": 100, "y": 650,
            "type": "agent", "status": NodeExecutionStatus.IDLE,
            "zone_idx": 2
        },
        # Delivery Zone - Hierarchical Crew (crown icon)
        {
            "id": uuid4(), "label": "Dev Team 👑", "x": 350, "y": 650,
            "type": "crew", "status": NodeExecutionStatus.IDLE,
            "zone_idx": 2, "process_type": "hierarchical"
        },
        # Delivery Zone - Template
        {
            "id": uuid4(), "label": "Sprint Planning Template", "x": 225, "y": 850,
            "type": "template", "status": NodeExecutionStatus.IDLE,
            "zone_idx": 2
        },
        # Growth Zone - Marketing Agent
        {
            "id": uuid4(), "label": "Marketing Agent", "x": 750, "y": 650,
            "type": "agent", "status": NodeExecutionStatus.IDLE,
            "zone_idx": 3
        },
        # Growth Zone - Service
        {
            "id": uuid4(), "label": "Analytics Service", "x": 1000, "y": 650,
            "type": "service", "status": NodeExecutionStatus.IDLE,
            "zone_idx": 3
        },
        # Growth Zone - Automation
        {
            "id": uuid4(), "label": "Campaign Automation", "x": 875, "y": 850,
            "type": "automation", "status": NodeExecutionStatus.DONE,
            "zone_idx": 3
        }
    ]
    
    nodes = []
    for n in nodes_data:
        # Calculate position relative to zone
        zone = zones[n["zone_idx"]]
        node = SpaceNodeTable(
            id=n["id"],
            node_label=n["label"],
            node_position_x=n["x"],
            node_position_y=n["y"],
            node_execution_status=n["status"],
            node_runtime_state={"process_type": n.get("process_type", "")},
            component_type=n["type"],
            component_id=uuid4(),
            space_id=demo_id
        )
        session.add(node)
        nodes.append(node)
    
    # Commit nodes first to get their IDs in DB
    await session.commit()
    
    # Create edges (connections between nodes)
    edges_data = [
        # Research → Research Crew
        {"source": nodes[0].id, "target": nodes[1].id},
        # Research Crew → Designer Agent
        {"source": nodes[1].id, "target": nodes[2].id},
        # Designer Agent → Design Crew
        {"source": nodes[2].id, "target": nodes[3].id},
        # Design Crew → Design Pattern
        {"source": nodes[3].id, "target": nodes[4].id},
        # Dev Agent → Dev Team
        {"source": nodes[5].id, "target": nodes[6].id},
        # Dev Team → Sprint Template
        {"source": nodes[6].id, "target": nodes[7].id},
        # Marketing → Analytics Service
        {"source": nodes[8].id, "target": nodes[9].id},
        # Analytics → Automation
        {"source": nodes[9].id, "target": nodes[10].id}
    ]
    
    from app.modules.spaces.infrastructure.tables import NodeEdgeTable
    for e in edges_data:
        edge = NodeEdgeTable(
            id=uuid4(),
            source_node_id=e["source"],
            edge_source_handle_id="right",
            target_node_id=e["target"],
            edge_target_handle_id="left",
            space_id=demo_id
        )
        session.add(edge)
    
    await session.commit()
    print(f"✅ Complete Demo Space seeded with ID: {demo_id}")
    print(f"   📊 Stats: 4 Zones, 11 Nodes, 8 Edges")
    print(f"💡 Use this ID in frontend: {demo_id}")

async def main():
    async with AsyncSessionLocal() as session:
        await seed_demo_project_and_workflow(session)
        await seed_demo_space(session)

if __name__ == "__main__":
    asyncio.run(main())
