import pytest
from uuid import uuid4
from backend.app.modules.agents.application.orchestrator import AgentOrchestrator
from backend.app.modules.agents.domain.enums import AgentRole

@pytest.mark.asyncio
async def test_orchestrator_initialization():
    orchestrator = AgentOrchestrator()
    config = orchestrator.get_config(AgentRole.RESEARCHER)
    assert config is not None
    assert config.role == AgentRole.RESEARCHER
    assert "search_knowledge" in config.tools

@pytest.mark.asyncio
async def test_create_session():
    orchestrator = AgentOrchestrator()
    project_id = uuid4()
    session = await orchestrator.create_session(project_id, AgentRole.MANAGER)
    
    assert session.project_id == project_id
    assert session.agent_role == AgentRole.MANAGER
    assert len(session.history) == 0

@pytest.mark.asyncio
async def test_run_turn_mock():
    orchestrator = AgentOrchestrator()
    project_id = uuid4()
    session = await orchestrator.create_session(project_id, AgentRole.BUILDER)
    
    response = await orchestrator.run_turn(session, "Build a hello world")
    
    assert "Mock response" in response
    assert len(session.history) == 2 # User + Model
    assert session.history[0].content == "Build a hello world"
