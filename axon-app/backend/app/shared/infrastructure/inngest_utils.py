import httpx
import os

# Helper for broadcasting via bridge
async def broadcast_via_bridge(channel: str, message: dict):
    """
    Sends a message to the FastAPI internal broadcast bridge.
    This bridge uses PostgreSQL LISTEN/NOTIFY to reach all FastAPI worker processes
    and broadcast the message to connected WebSocket clients.
    """
    api_url = os.getenv("INTERNAL_API_URL", "http://localhost:8000")
    try:
        async with httpx.AsyncClient() as client:
            await client.post(f"{api_url}/system/internal/broadcast", json={
                "channel": channel,
                "message": message
            })
    except Exception as e:
        print(f"Error calling broadcast bridge: {e}")
