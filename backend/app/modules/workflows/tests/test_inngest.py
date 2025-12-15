import pytest
from httpx import AsyncClient, ASGITransport
from backend.main import app

@pytest.mark.asyncio
async def test_inngest_endpoint_exists():
    """
    Verifies that the Inngest API endpoint is mounted and responding.
    Note: We cannot fully test Inngest execution without a running Inngest Dev Server,
    so we just check if the endpoint is reachable (POST /api/inngest).
    """
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        # Inngest SDK mounts at /api/inngest by default (or passed via serve)
        # However, serve() in fastapi usually mounts at /api/inngest
        # Let's check the schema or just try to hit it.
        # GET /api/inngest usually returns a method not allowed or similar if not configured for GET
        # The signing key check might fail, but 401/403/400 is better than 404.
        
        response = await ac.get("/api/inngest")
        # Depending on Inngest version, GET might show the introspection UI or 405.
        # If it returns 404, we have a problem.
        
        assert response.status_code != 404
