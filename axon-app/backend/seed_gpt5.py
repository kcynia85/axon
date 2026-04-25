import asyncio
import os
import sys
from sqlalchemy import select
from uuid import UUID

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__))))

from app.shared.infrastructure.database import AsyncSessionLocal
from app.modules.settings.infrastructure.tables import LLMModelTable, LLMProviderTable

async def main():
    async with AsyncSessionLocal() as session:
        # 1. Get OpenAI Provider
        stmt = select(LLMProviderTable).where(LLMProviderTable.provider_name == "OpenAI")
        result = await session.execute(stmt)
        provider = result.scalar_one_or_none()
        
        if not provider:
            print("❌ OpenAI Provider not found")
            return
            
        # 2. Check if gpt-5-nano exists
        model_id = "123e4567-e89b-12d3-a456-426614175000"
        stmt = select(LLMModelTable).where(LLMModelTable.id == UUID(model_id))
        result = await session.execute(stmt)
        if result.scalar_one_or_none():
            print("ℹ️ GPT-5 Nano already exists")
            return
            
        # 3. Insert GPT-5 Nano
        new_model = LLMModelTable(
            id=UUID(model_id),
            model_id="gpt-5-nano",
            model_display_name="GPT-5 Nano",
            llm_provider_id=provider.id,
            is_available=True
        )
        session.add(new_model)
        await session.commit()
        print("✅ GPT-5 Nano seeded successfully")

if __name__ == "__main__":
    asyncio.run(main())
