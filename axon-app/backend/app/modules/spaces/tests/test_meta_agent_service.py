import pytest
import json
from unittest.mock import AsyncMock, MagicMock, patch
from uuid import uuid4

from app.modules.spaces.application.meta_agent_service import MetaAgentService
from app.modules.spaces.domain.meta_agent_models import MetaAgentProposalRequest, MetaAgentProposalResponse
from app.shared.domain.ports.external_docs import ExternalDocumentationPort

@pytest.fixture
def mock_system_retriever():
    retriever = AsyncMock()
    retriever.search.return_value = []
    return retriever

@pytest.fixture
def mock_rag_service():
    rag = AsyncMock()
    rag.search_knowledge.return_value = []
    return rag

@pytest.fixture
def mock_system_repo():
    repo = AsyncMock()
    repo.get_meta_agent.return_value = None
    return repo

@pytest.fixture
def mock_settings_repo():
    repo = AsyncMock()
    return repo

@pytest.fixture
def mock_space_repo():
    repo = AsyncMock()
    return repo

@pytest.fixture
def mock_project_repo():
    repo = AsyncMock()
    return repo

@pytest.fixture
def mock_external_docs_port():
    port = AsyncMock(spec=ExternalDocumentationPort)
    port.fetch_content.return_value = "Mocked Notion content about marketing strategy."
    return port

@pytest.fixture
def mock_chat_model():
    model = MagicMock()
    
    # Provide a valid response that matches the schema
    valid_json_response = json.dumps({
        "drafts": [],
        "connections": [],
        "reasoning": "Test reasoning"
    })
    
    class MockResponse:
        def __init__(self, content):
            self.content = content
            self.execution_plan = "plan"
            self.search_queries = []
            self.drafts = []
            self.connections = []
            
    # Mock the async invoke
    async def mock_ainvoke(*args, **kwargs):
        # We also need to return a valid object for MetaAgentProposalResponse when Drafter runs
        return MetaAgentProposalResponse.model_construct(drafts=[], connections=[], reasoning="Test reasoning") if "Execution Plan" in args[0][0].content else MockResponse(content=valid_json_response)
        
    model.ainvoke = AsyncMock(side_effect=mock_ainvoke)
    
    # with_structured_output returns the model itself (or a modified version that has ainvoke)
    model.with_structured_output.return_value = model
    return model

@pytest.fixture
def mock_llm_adapter(mock_chat_model):
    adapter = MagicMock()
    adapter.get_chat_model.return_value = mock_chat_model
    return adapter

@pytest.mark.asyncio
async def test_propose_draft_includes_canvas_state_in_prompt(
    mock_system_retriever,
    mock_rag_service,
    mock_system_repo,
    mock_settings_repo,
    mock_space_repo,
    mock_project_repo,
    mock_external_docs_port,
    mock_chat_model
):
    # Setup mock Space
    class MockSpace:
        def __init__(self):
            self.id = "test_space_123"
            self.name = "My Test Space"
            self.project_id = "test_project_123"
            self.canvas_data = {
                "nodes": [
                    {
                        "id": "zone-1",
                        "type": "zone",
                        "data": {"label": "ws-discovery"}
                    },
                    {
                        "id": "agent-1",
                        "type": "agent",
                        "parentId": "zone-1",
                        "data": {"label": "Research Bot"}
                    }
                ]
            }
            
    class MockProject:
        def __init__(self):
            self.project_name = "My Test Project"
            self.project_summary = "A project summary"
            self.project_strategy_url = "https://notion.so/test-project"
            self.key_resources = []
            
    mock_space_repo.get_space.return_value = MockSpace()
    mock_project_repo.get.return_value = MockProject()

    # Patch the LLM adapter explicitly
    with patch("app.modules.spaces.application.meta_agent_service.get_llm_adapter") as mock_get_adapter:
        mock_adapter = MagicMock()
        mock_adapter.get_chat_model.return_value = mock_chat_model
        mock_get_adapter.return_value = mock_adapter

        # Init service
        service = MetaAgentService(
            system_retriever=mock_system_retriever,
            rag_service=mock_rag_service,
            system_repo=mock_system_repo,
            settings_repo=mock_settings_repo,
            space_repo=mock_space_repo,
            project_repo=mock_project_repo,
            external_docs_port=mock_external_docs_port
        )

        request = MetaAgentProposalRequest(
            space_id="test_space_123",
            query="Add a task for the Research Bot"
        )

        # Act
        await service.propose_draft(request)

        # Assert Space Repo was called
        mock_space_repo.get_space.assert_called_once_with("test_space_123")

        # Assert that the prompt passed to the chat model contains the canvas details
        assert mock_chat_model.ainvoke.call_count == 2
        
        # Second call is the drafter node
        call_args = mock_chat_model.ainvoke.call_args_list[1][0]
        prompt_content = call_args[0][0].content
        
        # Verify prompt inclusion
        assert "PROJECT CONTEXT:" in prompt_content
        assert "Project Name: My Test Project" in prompt_content
        assert "Strategy Document (Notion/Doc): https://notion.so/test-project" in prompt_content
        assert "PROJECT ASSUMPTIONS (Detailed content from Notion):" in prompt_content
        assert "Mocked Notion content about marketing strategy." in prompt_content
        assert "CURRENT CANVAS STATE" in prompt_content
        assert "EXISTING ZONES:" in prompt_content
        assert "- zone-1 (ws-discovery)" in prompt_content
        assert "ENTITIES CURRENTLY ON CANVAS:" in prompt_content
        assert '- [Agent] "Research Bot" (in zone: zone-1)' in prompt_content
