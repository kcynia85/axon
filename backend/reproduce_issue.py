import asyncio
import sys
import os
from dotenv import load_dotenv

# Add backend to path
sys.path.append(os.getcwd())

# Load env
load_dotenv("backend/.env")

from backend.app.modules.agents.application.context_composer import ContextComposer
from backend.app.shared.infrastructure.adk import GoogleADK
from backend.app.modules.agents.domain.enums import AgentRole
from backend.app.modules.agents.application.definitions import get_agent_definition

async def test_logic():
    print("Testing logic...")
    project_id = "00000000-0000-0000-0000-000000000000" # Dummy ID
    user_input = "Test weather"
    
    print("1. Testing ContextComposer...")
    try:
        composer = ContextComposer()
        # Mocking or checking what build_context does
        # If it hits DB, it might fail if not mocked or configured
        # But let's see if it imports and runs basic stuff
        context = await composer.build_context(project_id)
        print(f"Context built: {len(context)} chars")
    except Exception as e:
        print(f"ContextComposer failed: {e}")
        import traceback
        traceback.print_exc()

    print("\n2. Testing GoogleADK...")
    try:
        # Check if API key is set
        api_key = os.environ.get("GOOGLE_API_KEY")
        print(f"GOOGLE_API_KEY present: {bool(api_key)}")
        
        definition = get_agent_definition(AgentRole.MANAGER)
        prompt = definition.instruction.format(
            global_context="Context",
            user_input=user_input
        )
        
        # This might fail if no creds
        response = GoogleADK.generate_content(prompt, model_name=definition.model)
        print("GoogleADK response:", response)
    except Exception as e:
        print(f"GoogleADK failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_logic())
