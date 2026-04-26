import asyncio
import os
import sys
from sqlalchemy import update, func
from uuid import UUID

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__))))
from app.shared.infrastructure.database import AsyncSessionLocal
from app.modules.agents.infrastructure.tables import AgentConfigTable

async def main():
    async with AsyncSessionLocal() as session:
        # Update .png to .webp in agent_visual_url using SQL func.replace
        stmt = (
            update(AgentConfigTable)
            .where(AgentConfigTable.agent_visual_url.like('%.png'))
            .values(agent_visual_url=func.replace(AgentConfigTable.agent_visual_url, '.png', '.webp'))
        )
        result = await session.execute(stmt)
        await session.commit()
        print(f"Updated {result.rowcount} agent avatar extensions to .webp")

if __name__ == "__main__":
    asyncio.run(main())
