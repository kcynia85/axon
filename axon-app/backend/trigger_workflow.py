import asyncio
import sys
import os
import inngest

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from backend.app.shared.infrastructure.inngest_client import inngest_client

async def trigger_test_event():
    print("🚀 Triggering Manual Inngest Event...")
    
    project_id = "cce17853-6e23-4037-b989-eac40a733bce" # From list_projects.py
    user_input = "Manual Integration Test: Generate a report."
    
    await inngest_client.send(
        inngest.Event(
            name="agent/turn.requested",
            data={
                "user_input": user_input,
                "project_id": project_id,
                "agent_role": "MANAGER"
            }
        )
    )
    print("✅ Event sent!")

if __name__ == "__main__":
    asyncio.run(trigger_test_event())
