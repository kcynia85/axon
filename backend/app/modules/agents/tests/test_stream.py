import pytest
import json
from uuid import uuid4
from fastapi.testclient import TestClient
from backend.main import app
from app.api.deps import get_current_user
from app.modules.agents.application import service
from app.modules.agents.application.schemas import ChatRequest

client = TestClient(app)

# Override auth dependency
def mock_get_current_user():
    return {"sub": str(uuid4())} # Mock UserPayload

app.dependency_overrides[get_current_user] = mock_get_current_user

@pytest.mark.asyncio
async def test_stream_chat_endpoint():
    # Payload
    project_id = str(uuid4())
    payload = {
        "project_id": project_id,
        "agent_role": "MANAGER",
        "message": "Hello stream"
    }

    # Internal generator that yields content
    async def internal_generator():
        yield json.dumps({"type": "token", "content": "Hello"})
        yield json.dumps({"type": "token", "content": " World"})

    # Service mock (returns the generator, like the real service)
    async def mock_service(request: ChatRequest):
        return internal_generator()

    # Override the service dependency
    app.dependency_overrides[service.stream_chat_use_case] = mock_service

    try:
        with client.stream("POST", "/agents/chat/stream", json=payload) as response:
            assert response.status_code == 200
            # Collect events
            chunks = []
            for line in response.iter_lines():
                if line:
                    decoded = line if isinstance(line, str) else line.decode('utf-8')
                    chunks.append(decoded)
            
            print(f"DEBUG CHUNKS: {chunks}")
            
            assert any("Hello" in c for c in chunks)
            assert any("World" in c for c in chunks)
    finally:
        # Clean up override
        del app.dependency_overrides[service.stream_chat_use_case]
