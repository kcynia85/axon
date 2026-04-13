import inngest
from app.config import settings

# Initialize Inngest Client
# Forced to development server as per user request
inngest_client = inngest.Inngest(
    app_id="ragas-axon",
    is_production=False, 
    api_base_url=settings.INNGEST_BASE_URL,
    event_api_base_url=settings.INNGEST_BASE_URL,
    signing_key=settings.INNGEST_SIGNING_KEY,
    event_key=settings.INNGEST_EVENT_KEY,
)

