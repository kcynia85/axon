import pytest
import json
from uuid import uuid4
from fastapi.testclient import TestClient
from backend.main import app
from unittest.mock import patch

client = TestClient(app)

@pytest.mark.asyncio
async def test_stream_chat_endpoint():
    # Payload
    project_id = str(uuid4())
    payload = {
        "project_id": project_id,
        "agent_role": "MANAGER",
        "message": "Hello stream"
    }

    # Mock the generator
    async def mock_generator(*args, **kwargs):
        yield json.dumps({"type": "token", "content": "Hello"})
        yield json.dumps({"type": "token", "content": " World"})

    # Patch the orchestrator instance method in the router
    with patch("backend.app.modules.agents.interface.router.orchestrator.run_turn_stream", side_effect=mock_generator):
        with client.stream("POST", "/agents/chat/stream", json=payload) as response:
            assert response.status_code == 200
            # Collect events
            chunks = []
            for line in response.iter_lines():
                if line:
                    chunks.append(line)
            
            # SSE format usually sends "data: ..."
            assert any("Hello" in c for c in chunks)
            assert any("World" in c for c in chunks)
