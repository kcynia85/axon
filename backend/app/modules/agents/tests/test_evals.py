import pytest
from unittest.mock import AsyncMock, patch
from backend.app.modules.agents.application.evals import EvaluationService

@pytest.mark.asyncio
async def test_evaluate_faithfulness():
    # Mock Response
    mock_json = '{"score": 0.9, "reasoning": "Answer is supported by context."}'
    
    with patch('backend.app.shared.infrastructure.adk.GoogleADK.generate_content', new_callable=AsyncMock) as mock_gen:
        mock_gen.return_value = mock_json
        
        service = EvaluationService()
        result = await service.evaluate_faithfulness("q", "context", "answer")
        
        assert result["score"] == 0.9
        assert result["reasoning"] == "Answer is supported by context."
        
        # Verify Prompt
        mock_gen.assert_called_once()
        prompt = mock_gen.call_args[1]['prompt'] # or args[0]
        assert "Score 1.0" in prompt # Check if prompt template was used

@pytest.mark.asyncio
async def test_evaluate_json_error():
    # Mock Invalid Response
    with patch('backend.app.shared.infrastructure.adk.GoogleADK.generate_content', new_callable=AsyncMock) as mock_gen:
        mock_gen.return_value = "Not JSON"
        
        service = EvaluationService()
        result = await service.evaluate_relevance("q", "a")
        
        assert result["score"] == 0.0
        assert "Failed to parse" in result["reasoning"]
