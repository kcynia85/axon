import asyncio
import os
import sys
from sqlalchemy import select
from uuid import UUID

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__))))
from app.shared.infrastructure.database import AsyncSessionLocal
from app.modules.agents.infrastructure.tables import AgentConfigTable

async def main():
    async with AsyncSessionLocal() as session:
        stmt = select(AgentConfigTable.agent_name, AgentConfigTable.agent_visual_url).where(AgentConfigTable.agent_name.like('%Test%'))
        result = await session.execute(stmt)
        rows = result.all()
        print("Test Agents in DB:")
        for r in rows:
            print(f" - {r[0]}: {r[1]}")

if __name__ == "__main__":
    asyncio.run(main())
