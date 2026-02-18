from enum import Enum

class ProviderType(str, Enum):
    CLOUD = "Cloud"
    META_PROVIDER = "Meta-Provider"
    LOCAL = "Local"

class ModelTier(str, Enum):
    TIER1 = "Tier1"
    TIER2 = "Tier2"

class RouterStrategy(str, Enum):
    COST_OPTIMIZED = "Cost_Optimized"
    SPEED_OPTIMIZED = "Speed_Optimized"
    QUALITY_OPTIMIZED = "Quality_Optimized"

class ChunkingMethod(str, Enum):
    RECURSIVE_CHARACTER = "Recursive_Character"
    CODE_SPLITTER = "Code_Splitter"
    TOKEN_SPLITTER = "Token_Splitter"

class VectorDBType(str, Enum):
    POSTGRES_PGVECTOR = "Postgres_pgvector"
    CHROMADB = "ChromaDB"
    PINECONE = "Pinecone"

class IndexMethod(str, Enum):
    HNSW = "HNSW"
    IVFFLAT = "IVFFLAT"

class ConnectionStatus(str, Enum):
    CONNECTED = "Connected"
    DISCONNECTED = "Disconnected"
