import asyncio
import os
import sys
from sqlalchemy import select, update
from uuid import UUID

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__))))

from app.shared.infrastructure.database import AsyncSessionLocal
from app.modules.agents.infrastructure.tables import AgentConfigTable

async def main():
    async with AsyncSessionLocal() as session:
        model_id = "123e4567-e89b-12d3-a456-426614175000"
        stmt = update(AgentConfigTable).values(llm_model_id=UUID(model_id))
        result = await session.execute(stmt)
        await session.commit()
        print(f"✅ Updated {result.rowcount} agents to GPT-5 Nano")

if __name__ == "__main__":
    asyncio.run(main())
