import pytest
from unittest.mock import AsyncMock, MagicMock
from uuid import uuid4
from backend.app.modules.system.infrastructure.repo import SystemRepository
from backend.app.modules.system.domain.models import MetaAgent
from backend.app.modules.system.infrastructure.tables import MetaAgentTable

@pytest.fixture
def mock_session():
    session = AsyncMock()
    session.add = MagicMock()
    session.execute = AsyncMock()
    session.commit = AsyncMock()
    return session

@pytest.mark.asyncio
async def test_get_meta_agent_found(mock_session):
    repo = SystemRepository(mock_session)
    
    db_agent = MetaAgentTable(
        id=uuid4(),
        meta_agent_system_prompt="You are Axon.",
        meta_agent_temperature=0.7,
        meta_agent_rag_enabled=True,
        meta_agent_system_knowledge_rags=[],
        llm_model_id=None
    )
    
    mock_result = MagicMock()
    mock_result.scalar_one_or_none.return_value = db_agent
    mock_session.execute.return_value = mock_result
    
    result = await repo.get_meta_agent()
    
    assert result is not None
    assert result.meta_agent_system_prompt == "You are Axon."

@pytest.mark.asyncio
async def test_upsert_meta_agent_create(mock_session):
    repo = SystemRepository(mock_session)
    
    # First get returns None (not found)
    mock_result_none = MagicMock()
    mock_result_none.scalar_one_or_none.return_value = None
    
    # Second get returns Created object (after insert)
    db_agent = MetaAgentTable(
        id=uuid4(),
        meta_agent_system_prompt="New Prompt",
        meta_agent_temperature=0.7,
        meta_agent_rag_enabled=True,
        meta_agent_system_knowledge_rags=[],
        llm_model_id=None
    )
    mock_result_found = MagicMock()
    mock_result_found.scalar_one_or_none.return_value = db_agent
    
    mock_session.execute.side_effect = [mock_result_none, mock_result_found]
    
    data = {"meta_agent_system_prompt": "New Prompt"}
    result = await repo.upsert_meta_agent(data)
    
    assert result.meta_agent_system_prompt == "New Prompt"
    mock_session.add.assert_called_once()
    mock_session.commit.assert_called_once()
