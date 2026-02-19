import inngest
from app.config import settings

# Initialize Inngest Client
inngest_client = inngest.Inngest(
    app_id="ragas-axon",
    is_production=False, # Set to True in prod via env var if needed
    signing_key=settings.INNGEST_SIGNING_KEY,
    event_key=settings.INNGEST_EVENT_KEY,
)
