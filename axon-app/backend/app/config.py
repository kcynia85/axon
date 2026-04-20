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
    VECTOR_DATABASE_URL: Optional[str] = None # Sync PG URL for pgvector (Legacy/Fallback)
    
    # Auth
    SUPABASE_JWT_SECRET: str

    # AI
    GOOGLE_API_KEY: str
    OPENAI_API_KEY: Optional[str] = None

    # Feature Flags (Phase 11.T Transitional Bridge)
    FEATURE_LANGCHAIN_ADAPTER: bool = True  # T3: LangChainAdapter - default ON
    FEATURE_LANGFUSE_TELEMETRY: bool = False  # GATE 4: Telemetry
    FEATURE_LLM_GATEWAY: bool = False  # T3: LLM Gateway port

    # Inngest (Workflows)
    INNGEST_SIGNING_KEY: Optional[str] = None
    INNGEST_EVENT_KEY: Optional[str] = None
    INNGEST_BASE_URL: str = "http://127.0.0.1:8288"

    # Storage (MinIO / S3)
    STORAGE_ENDPOINT: str = "http://localhost:9000"
    STORAGE_ACCESS_KEY: str = "minioadmin"
    STORAGE_SECRET_KEY: str = "minioadmin"
    STORAGE_BUCKET_NAME: str = "axon-bucket"
    STORAGE_REGION: str = "us-east-1"
    
    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True)

settings = Settings()