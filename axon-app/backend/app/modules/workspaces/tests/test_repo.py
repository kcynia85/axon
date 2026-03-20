import pytest
from unittest.mock import AsyncMock, MagicMock
from uuid import uuid4
from app.modules.workspaces.infrastructure.repo import WorkspaceRepository
from app.modules.workspaces.domain.models import Pattern, Template, Crew
from app.modules.workspaces.infrastructure.tables import PatternTable, TemplateTable, CrewTable
from app.modules.workspaces.domain.enums import PatternType, ProcessType
from app.shared.utils.time import now_utc
from app.modules.agents.infrastructure.tables import AgentConfigTable

@pytest.fixture
def mock_session():
    session = AsyncMock()
    session.add = MagicMock()
    session.execute = AsyncMock()
    session.commit = AsyncMock()
    return session

@pytest.mark.asyncio
async def test_create_pattern(mock_session):
    repo = WorkspaceRepository(mock_session)
    pattern = Pattern(
        pattern_name="Test Pattern",
        pattern_graph_structure={"nodes": [], "edges": []},
        availability_workspace=["Discovery"]
    )
    
    await repo.create_pattern(pattern)
    assert mock_session.add.call_count == 1
    assert mock_session.commit.call_count == 1

@pytest.mark.asyncio
async def test_create_template(mock_session):
    repo = WorkspaceRepository(mock_session)
    template = Template(
        template_name="Test Template",
        template_markdown_content="# Hello",
        availability_workspace=["Discovery"]
    )
    
    await repo.create_template(template)
    assert mock_session.add.call_count == 1
    assert mock_session.commit.call_count == 1

@pytest.mark.asyncio
async def test_create_crew(mock_session):
    repo = WorkspaceRepository(mock_session)
    crew = Crew(
        crew_name="Test Crew",
        availability_workspace=["Discovery"]
    )
    
    # Mock behavior for selecting agents
    mock_result = MagicMock()
    mock_result.scalars.return_value.all.return_value = []
    mock_session.execute.return_value = mock_result
    
    # Also need to mock the SELECT that happens at the end of create_crew (_crew_to_domain from row)
    # Actually create_crew returns _crew_to_domain(new_row)
    
    await repo.create_crew(crew, agent_ids=[])
    assert mock_session.add.call_count == 1
    assert mock_session.commit.call_count == 1
