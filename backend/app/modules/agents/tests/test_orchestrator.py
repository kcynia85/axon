import pytest
import json
from unittest.mock import AsyncMock, MagicMock, patch
from uuid import uuid4
from backend.app.modules.agents.application.orchestrator import AgentOrchestrator
from backend.app.modules.agents.domain.enums import AgentRole

@pytest.mark.asyncio
async def test_orchestrator_initialization():
    orchestrator = AgentOrchestrator()
    # Check if _agents are populated correctly (accessing private member for testing)
    assert AgentRole.RESEARCHER in orchestrator._agents
    assert AgentRole.BUILDER in orchestrator._agents
    assert AgentRole.WRITER in orchestrator._agents
    assert AgentRole.MANAGER in orchestrator._agents

@pytest.mark.asyncio
async def test_create_session():
    orchestrator = AgentOrchestrator()
    project_id = uuid4()
    session = await orchestrator.create_session(project_id, AgentRole.MANAGER)
    
    assert session.project_id == project_id
    assert session.agent_role == AgentRole.MANAGER
    assert len(session.history) == 0

@pytest.mark.asyncio
async def test_run_turn_stream_simple_agent():
    """Test streaming interaction with a simple agent (e.g. MANAGER)."""
    orchestrator = AgentOrchestrator()
    project_id = uuid4()
    session = await orchestrator.create_session(project_id, AgentRole.MANAGER)
    
    # Mock GoogleADK.generate_content_stream
    mock_chunks = ["Hello", " world", "!"]
    
    async def mock_stream_generator(*args, **kwargs):
        for chunk in mock_chunks:
            yield chunk

    with patch('backend.app.shared.infrastructure.adk.GoogleADK.generate_content_stream', side_effect=mock_stream_generator):
        
        received_chunks = []
        async for chunk_json in orchestrator.run_turn_stream(session, "Hello manager"):
            data = json.loads(chunk_json)
            if data["type"] == "token":
                received_chunks.append(data["content"])
        
        full_response = "".join(received_chunks)
        assert full_response == "Hello world!"
        
        # Verify history update
        assert len(session.history) == 2
        assert session.history[0].role == "user"
        assert session.history[0].content == "Hello manager"
        assert session.history[1].role == "model"
        assert session.history[1].content == "Hello world!"

@pytest.mark.asyncio
async def test_run_turn_loop_agent():
    """Test interaction with a loop agent (e.g. WRITER). loops don't stream token-by-token usually."""
    orchestrator = AgentOrchestrator()
    project_id = uuid4()
    session = await orchestrator.create_session(project_id, AgentRole.WRITER)
    
    # Mock GoogleADK.generate_content for non-streaming calls inside the loop
    # We mock it to return a string so the loop runs.
    # We won't simulate the full exit_loop logic here, just that it runs and returns.
    
    with patch('backend.app.shared.infrastructure.adk.GoogleADK.generate_content', return_value="Refined Content") as mock_gen:
        
        received_chunks = []
        async for chunk_json in orchestrator.run_turn_stream(session, "Write something"):
             data = json.loads(chunk_json)
             if data["type"] == "token":
                received_chunks.append(data["content"])

        # run_turn_stream for loop agents yields "Processing complex workflow...\n" then the result
        full_output = "".join(received_chunks)
        assert "Processing complex workflow..." in full_output
        assert "Refined Content" in full_output
