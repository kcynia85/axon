import asyncio
import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__))))

from dotenv import load_dotenv
load_dotenv()

from app.modules.spaces.application.meta_agent_workflow import propose_meta_agent_flow

async def main():
    res = await propose_meta_agent_flow({
        "query": "Create a Data Research Crew with two agents: Data Miner and Data Analyst.",
        "project_context": {},
        "system_entities": [],
        "space_id": "test",
        "attachments": [],
        "canvas_nodes": []
    })
    
    print("Drafts:", len(res.get('drafts', [])))
    for d in res.get('drafts', []):
        payload = d.get('payload', {})
        print(f"[{d.get('entity')}] {d.get('name')} | payload keys: {list(payload.keys())} | agent_member_ids: {payload.get('agent_member_ids', [])}")

if __name__ == "__main__":
    asyncio.run(main())
