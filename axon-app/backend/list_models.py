import asyncio
import os
import sys
from sqlalchemy import select

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__))))

from app.shared.infrastructure.database import AsyncSessionLocal
from app.modules.settings.infrastructure.tables import LLMModelTable, LLMProviderTable

async def main():
    async with AsyncSessionLocal() as session:
        stmt = select(LLMModelTable, LLMProviderTable.provider_name).join(LLMProviderTable)
        result = await session.execute(stmt)
        rows = result.all()
        
        print(f"{'ID':<40} | {'Model ID':<20} | {'Display Name':<20} | {'Provider':<20}")
        print("-" * 105)
        for row in rows:
            model, provider_name = row
            print(f"{str(model.id):<40} | {model.model_id:<20} | {model.model_display_name:<20} | {provider_name:<20}")

if __name__ == "__main__":
    asyncio.run(main())
