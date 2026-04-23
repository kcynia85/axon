import asyncio
from app.shared.infrastructure.database import AsyncSessionLocal
from sqlalchemy import text

async def check():
    async with AsyncSessionLocal() as s:
        providers = await s.execute(text('SELECT * FROM llm_providers'))
        p_list = providers.fetchall()
        print(f"Providers ({len(p_list)}):")
        for p in p_list:
            print(f" - {p}")
            
        models = await s.execute(text('SELECT * FROM llm_models'))
        m_list = models.fetchall()
        print(f"Models ({len(m_list)}):")
        for m in m_list:
            print(f" - {m}")

if __name__ == "__main__":
    asyncio.run(check())
