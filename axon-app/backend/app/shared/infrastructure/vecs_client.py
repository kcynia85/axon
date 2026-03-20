import vecs
from app.config import settings

def get_vecs_client():
    """
    Creates and returns a client for the pgvector extension (vecs).
    
    This client is used to manage vector collections and perform semantic search operations.
    It connects using the DATABASE_URL from settings.
    
    Returns:
        vecs.Client: An active pgvector client instance.
    """
    return vecs.create_client(settings.DATABASE_URL)