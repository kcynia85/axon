import vecs
from app.config import settings

def get_vecs_client(connection_url: str = None):
    """
    Creates and returns a client for the pgvector extension (vecs).
    If connection_url is provided, it uses it. Otherwise falls back to settings.
    """
    url = connection_url or settings.VECTOR_DATABASE_URL
    if not url:
        raise ValueError("Missing Vector Database URL. Please configure a Vector Database in Vector Studio (SSoT).")
    return vecs.create_client(url)