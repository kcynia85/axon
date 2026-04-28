from enum import Enum

class ProviderType(str, Enum):
    cloud = "cloud"
    meta = "meta"
    local = "local"

class ModelTier(str, Enum):
    TIER1 = "Tier1"
    TIER2 = "Tier2"

class RouterStrategy(str, Enum):
    COST_OPTIMIZED = "COST_OPTIMIZED"
    SPEED_OPTIMIZED = "SPEED_OPTIMIZED"
    QUALITY_OPTIMIZED = "QUALITY_OPTIMIZED"
    FALLBACK = "FALLBACK"
    LOAD_BALANCER = "LOAD_BALANCER"

class ChunkingMethod(str, Enum):
    RECURSIVE_CHARACTER = "Recursive_Character"
    CHARACTER = "Character"
    MARKDOWN = "Markdown"
    HTML = "HTML"
    CODE_SPLITTER = "Code_Splitter"
    TOKEN_SPLITTER = "Token_Splitter"
    LATEX = "LaTeX"
    JSON = "JSON"
    SEMANTIC = "Semantic"

class VectorDBType(str, Enum):
    POSTGRES_PGVECTOR_LOCAL = "POSTGRES_PGVECTOR_LOCAL"
    SUPABASE_PGVECTOR_CLOUD = "SUPABASE_PGVECTOR_CLOUD"
    QDRANT_LOCAL = "QDRANT_LOCAL"
    CHROMADB_CLOUD = "CHROMADB_CLOUD"
    CHROMADB_LOCAL = "CHROMADB_LOCAL"
    # Legacy for migration support
    POSTGRES_PGVECTOR = "POSTGRES_PGVECTOR"
    CHROMADB = "CHROMADB"
    PINECONE = "PINECONE"

class IndexMethod(str, Enum):
    HNSW = "HNSW"
    IVFFLAT = "IVFFLAT"

class ConnectionStatus(str, Enum):
    CONNECTED = "Connected"
    DISCONNECTED = "Disconnected"

class AutomationPlatform(str, Enum):
    N8N = "N8N"
    ZAPIER = "ZAPIER"
    MAKE = "MAKE"
    CUSTOM = "CUSTOM"

class AutomationAuthType(str, Enum):
    HEADER = "HEADER"
    BEARER = "BEARER"
    NONE = "NONE"
