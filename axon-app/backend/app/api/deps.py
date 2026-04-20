from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from app.shared.security.schemas import UserPayload

from uuid import UUID

# This defines where to look for the token (Authorization: Bearer)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token", auto_error=False)

def get_current_user(token: str = Depends(oauth2_scheme)) -> UserPayload:
    """
    MOCK AUTH FOR TESTING: Returns a static Test User.
    Bypasses actual JWT validation.
    """
    # Return a static UUID that we can rely on for seeding/testing
    mock_user_id = "00000000-0000-0000-0000-000000000000"
    return UserPayload(
        sub=UUID(mock_user_id),
        email="test@example.com",
        role="authenticated",
        aud="authenticated",
        app_metadata={},
        user_metadata={}
    )

async def get_vector_store_adapter():
    """
    Dependency for injecting the dynamically resolved VectorStoreAdapter.
    It fetches the active vector DB configuration from the DB per request.
    """
    from app.shared.infrastructure.adapters.vector_stores.proxy import VectorStoreProxy
    from app.modules.settings.infrastructure.repo import SettingsRepository
    from app.shared.infrastructure.database import AsyncSessionLocal
    
    async def config_resolver():
        async with AsyncSessionLocal() as session:
            repo = SettingsRepository(session)
            dbs = await repo.list_vector_databases()
            if not dbs:
                return {}
            
            # Simplified logic: pick the first available DB as the active global default.
            # Both RAG#1 and RAG#2 will use it, separating concerns via collection names.
            active_db = dbs[0]
            
            config = {
                "provider": "supabase_local" if "POSTGRES" in active_db.vector_database_type.name else "other",
                "url": active_db.vector_database_connection_url or ""
            }
            
            if not config["url"] and active_db.vector_database_host:
                from urllib.parse import quote_plus
                import re
                host = re.sub(r'^@', '', re.sub(r'\s+', '', active_db.vector_database_host))
                user = re.sub(r'\s+', '', active_db.vector_database_user or "")
                pwd = quote_plus(re.sub(r'\s+', '', active_db.vector_database_password or ""))
                db_name = re.sub(r'\s+', '', active_db.vector_database_db_name or "postgres")
                ssl = re.sub(r'\s+', '', active_db.vector_database_ssl_mode or "require")
                config["url"] = f"postgresql://{user}:{pwd}@{host}:{active_db.vector_database_port}/{db_name}?sslmode={ssl}"
            
            return config

    # The actual LLMGateway for embedding models will be injected fully in Faza 2 & 3.
    return VectorStoreProxy(config_resolver, gateway=None)
