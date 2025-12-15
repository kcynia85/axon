# backend/app/config.py
from typing import Optional
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "RAGAS Axon"
    API_V1_STR: str = "/api/v1"
    
    # Database
    SUPABASE_URL: str
    SUPABASE_KEY: str
    DATABASE_URL: str  # Async PG URL

    # AI
    GOOGLE_API_KEY: str

    # Inngest (Workflows)
    INNGEST_SIGNING_KEY: Optional[str] = None
    INNGEST_EVENT_KEY: Optional[str] = None
    
    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True)

settings = Settings()