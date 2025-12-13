import vecs
from backend.app.config import settings

def get_vecs_client():
    return vecs.create_client(settings.DATABASE_URL)