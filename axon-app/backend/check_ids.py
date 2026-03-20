
import asyncio
from sqlalchemy import text
from app.shared.infrastructure.database import AsyncSessionLocal

async def check_ids():
    async with AsyncSessionLocal() as session:
        try:
            print("--- AGENTS ---")
            result = await session.execute(text("SELECT id, agent_name FROM agent_configs;"))
            agents = result.all()
            agent_ids = []
            for a in agents:
                print(f"Agent ID: {a[0]}, Name: {a[1]}")
                agent_ids.append(str(a[0]))
            
            print("\n--- CREWS & THEIR AGENTS ---")
            result = await session.execute(text("SELECT id, crew_name, manager_agent_id FROM crews;"))
            crews = result.all()
            for c in crews:
                print(f"\nCrew ID: {c[0]}, Name: {c[1]}, Manager ID: {c[2]}")
                res = await session.execute(text(f"SELECT agent_id FROM crew_agents WHERE crew_id = '{c[0]}';"))
                members = res.all()
                for m in members:
                    m_id = str(m[0])
                    exists = m_id in agent_ids
                    print(f"  Member Agent ID: {m_id} (Exists in agent_configs: {exists})")
                    if c[2] and str(c[2]) == m_id:
                        print("    ^ THIS IS THE MANAGER")
        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(check_ids())
