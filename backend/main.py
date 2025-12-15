from fastapi import FastAPI
from inngest.fast_api import serve
from backend.app.modules.projects.interface.router import router as projects_router
from backend.app.modules.projects.interface.artifacts_router import router as artifacts_router
from backend.app.modules.agents.interface.router import router as agents_router
from backend.app.modules.agents.interface.config_router import router as agents_config_router
from backend.app.modules.knowledge.interface.router import router as knowledge_router
from backend.app.shared.infrastructure.inngest_client import inngest_client
from backend.app.modules.workflows.infrastructure.inngest_functions import hello_world

app = FastAPI(title="RAGAS Axon API")

app.include_router(projects_router)
app.include_router(artifacts_router)
app.include_router(agents_router)
app.include_router(agents_config_router)
app.include_router(knowledge_router)

# Inngest Handler
inngest_handler = serve(
    app,
    inngest_client,
    [hello_world],
)

@app.get("/")
async def root():
    return {"message": "RAGAS Axon API is running"}