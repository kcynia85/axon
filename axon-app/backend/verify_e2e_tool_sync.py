import asyncio
import httpx
import sys
from pathlib import Path

# Setup paths
BACKEND_DIR = Path(__file__).parent
sys.path.append(str(BACKEND_DIR))

from app.shared.infrastructure.database import AsyncSessionLocal
from app.modules.resources.infrastructure.tables import InternalToolTable
from sqlalchemy import select

TOOL_CODE = """
from . import tool
from typing import Dict, Any

@tool("E2E Test Flow Tool", keywords=["test", "e2e", "flow"])
def e2e_flow_test_function(test_param: str, test_value: int = 10) -> Dict[str, Any]:
    \"\"\"
    A tool designed specifically for testing the end-to-end tool flow.
    Args:
        test_param: A string parameter for testing.
        test_value: An integer parameter for testing.
    \"\"\"
    return {"status": "ok", "param": test_param, "value": test_value}
"""

async def verify_sync():
    print("🚀 Starting Backend E2E Sync Verification...")
    url = "http://127.0.0.1:8000/resources/internal-tools/sync-remote"
    file_name = "e2e_flow_tool.py"
    
    async with httpx.AsyncClient() as client:
        print(f"📡 Sending sync request for {file_name}...")
        try:
            r = await client.post(url, json={
                "file_name": file_name,
                "file_content": TOOL_CODE,
                "author": "e2e-tester"
            }, timeout=10.0)
            
            if r.status_code != 200:
                print(f"❌ Sync failed with status {r.status_code}: {r.text}")
                return False
            
            print(f"✅ Sync request successful: {r.json()}")
        except Exception as e:
            print(f"❌ Connection error: {e}")
            return False

    async with AsyncSessionLocal() as session:
        print("🔍 Checking database for the new tool...")
        stmt = select(InternalToolTable).where(InternalToolTable.tool_function_name == "e2e_flow_test_function")
        result = await session.execute(stmt)
        tool = result.scalar_one_or_none()
        
        if not tool:
            print("❌ Tool not found in database!")
            return False
        
        print(f"✅ Tool found in DB: {tool.tool_display_name}")
        
        # Check keywords
        expected_keywords = ["test", "e2e", "flow"]
        if not all(k in tool.tool_keywords for k in expected_keywords):
            print(f"❌ Keywords mismatch! Got {tool.tool_keywords}, expected {expected_keywords}")
            return False
        print(f"✅ Keywords verified: {tool.tool_keywords}")
        
        # Check input schema
        props = tool.tool_input_schema.get("properties", {})
        if "test_param" not in props:
            print("❌ Schema missing property 'test_param'!")
            return False
        print("✅ Input schema verified.")
        
    print("\n🎉 BACKEND E2E SYNC VERIFIED!")
    return True

if __name__ == "__main__":
    success = asyncio.run(verify_sync())
    sys.exit(0 if success else 1)
