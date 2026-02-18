from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from inngest.fast_api import serve
import traceback
import logging

# Enable Inngest Logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger("inngest")
logger.setLevel(logging.DEBUG)

from backend.app.modules.projects.interface.router import router as projects_router
from backend.app.modules.projects.interface.artifacts_router import router as artifacts_router
from backend.app.modules.agents.interface.router import router as agents_router
from backend.app.modules.agents.interface.config_router import router as agents_config_router
from backend.app.modules.knowledge.interface.router import router as knowledge_router
from backend.app.modules.workflows.interface.router import router as workflows_router
from backend.app.modules.spaces.interface.router import router as spaces_router
from backend.app.shared.infrastructure.inngest_client import inngest_client
from backend.app.modules.workflows.infrastructure.inngest_functions import hello_world
from backend.app.modules.agents.application.workflows import writer_workflow, generic_agent_workflow

app = FastAPI(title="RAGAS Axon API")

# Configure CORS
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# DEBUG: Catch exceptions
@app.exception_handler(Exception)
async def debug_exception_handler(request: Request, exc: Exception):
    with open("api_crash.log", "a") as f:
        f.write(f"API CRASH: {request.url}\n")
        f.write(traceback.format_exc())
        f.write("\n----------------\n")
        
    return JSONResponse(
        status_code=500,
        content={"message": "Internal Server Error", "detail": str(exc), "traceback": traceback.format_exc()},
    )

app.include_router(projects_router)
app.include_router(artifacts_router)
app.include_router(agents_router)
app.include_router(agents_config_router)
app.include_router(knowledge_router)
app.include_router(workflows_router) # Auto-prefix from router module
app.include_router(spaces_router)

# Inngest Handler
inngest_handler = serve(
    app,
    inngest_client,
    [hello_world, writer_workflow, generic_agent_workflow],
)

@app.get("/")
async def root():
    return {"message": "RAGAS Axon API is running"}