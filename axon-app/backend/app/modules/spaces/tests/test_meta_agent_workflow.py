import pytest
from app.modules.spaces.application.meta_agent_workflow import MetaAgentGraphBuilder
from app.modules.spaces.domain.meta_agent_models import MetaAgentProposalResponse, MetaAgentDraftEntity, MetaAgentProposalConnection

@pytest.fixture
def mock_builder():
    return MetaAgentGraphBuilder(
        system_retriever=None,
        rag_service=None,
        llm_adapter=None,
        meta_agent_config=None
    )

@pytest.mark.asyncio
async def test_validator_node_valid_draft(mock_builder):
    state = {
        "draft_response": MetaAgentProposalResponse(
            drafts=[
                MetaAgentDraftEntity(
                    entity="agent",
                    name="Agent1",
                    description="Desc",
                    target_workspace="ws-discovery",
                    payload={}
                )
            ],
            connections=[],
            reasoning="Valid draft"
        ),
        "canvas_state": {"nodes": []}
    }

    result = await mock_builder.validator_node(state)
    assert not result["validation_errors"]

@pytest.mark.asyncio
async def test_validator_node_invalid_workspace(mock_builder):
    state = {
        "draft_response": MetaAgentProposalResponse.model_construct(
            drafts=[
                MetaAgentDraftEntity.model_construct(
                    entity="agent",
                    name="Agent1",
                    description="Desc",
                    target_workspace="invalid-ws",  # Should cause error
                    payload={}
                )
            ],
            connections=[],
            reasoning="Invalid draft"
        ),
        "canvas_state": {"nodes": []}
    }

    result = await mock_builder.validator_node(state)
    assert len(result["validation_errors"]) == 1
    assert "invalid target_workspace 'invalid-ws'" in result["validation_errors"][0]

@pytest.mark.asyncio
async def test_validator_node_invalid_connections(mock_builder):
    state = {
        "draft_response": MetaAgentProposalResponse(
            drafts=[
                MetaAgentDraftEntity(
                    entity="agent",
                    name="Agent1",
                    description="Desc",
                    target_workspace="ws-discovery",
                    payload={}
                )
            ],
            connections=[
                MetaAgentProposalConnection(source_draft_name="NonExistentAgent", target_draft_name="Agent1")
            ],
            reasoning="Invalid connection"
        ),
        "canvas_state": {"nodes": []}
    }

    result = await mock_builder.validator_node(state)
    assert len(result["validation_errors"]) == 1
    assert "Connection source 'NonExistentAgent' does not exist" in result["validation_errors"][0]

@pytest.mark.asyncio
async def test_validator_node_valid_connections_with_canvas(mock_builder):
    state = {
        "draft_response": MetaAgentProposalResponse(
            drafts=[
                MetaAgentDraftEntity(
                    entity="task",
                    name="Task1",
                    description="Desc",
                    target_workspace="ws-discovery",
                    payload={}
                )
            ],
            connections=[
                MetaAgentProposalConnection(source_draft_name="CanvasAgent", target_draft_name="Task1")
            ],
            reasoning="Valid connection with canvas entity"
        ),
        "canvas_state": {
            "nodes": [
                {
                    "id": "agent-1",
                    "type": "agent",
                    "data": {"label": "CanvasAgent"}
                }
            ]
        }
    }

    result = await mock_builder.validator_node(state)
    assert not result["validation_errors"]

def test_check_validation(mock_builder):
    from langgraph.graph import END

    # No errors -> END
    assert mock_builder.check_validation({"validation_errors": [], "iteration_count": 1}) == END
    
    # Errors and count < 3 -> return to drafter
    assert mock_builder.check_validation({"validation_errors": ["Error"], "iteration_count": 1}) == "drafter"
    
    # Errors but count >= 3 -> break loop and go to END
    assert mock_builder.check_validation({"validation_errors": ["Error"], "iteration_count": 3}) == END
