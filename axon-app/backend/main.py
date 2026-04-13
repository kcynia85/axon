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

from app.modules.projects.interface.router import router as projects_router
from app.modules.projects.interface.artifacts_router import router as artifacts_router
from app.modules.agents.interface.router import router as agents_router
from app.modules.agents.interface.config_router import router as agents_config_router
from app.modules.knowledge.interface.router import router as knowledge_router
from app.modules.spaces.interface.router import router as spaces_router
from app.modules.resources.interface.router import router as resources_router
from app.modules.settings.interface.router import router as settings_router
from app.modules.inbox.interface.router import router as inbox_router
from app.modules.system.interface.router import router as system_router
from app.modules.workspaces.interface.router import router as workspaces_router
from app.shared.infrastructure.inngest_client import inngest_client
from app.modules.agents.application.workflows import writer_workflow, generic_agent_workflow
from app.modules.settings.application.inngest_handlers import sync_all_pricing, sync_provider_pricing_event
from app.modules.knowledge.application.inngest_handlers import knowledge_indexing_workflow

app = FastAPI(title="RAGAS Axon API")

# Configure CORS
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:8081",
    "http://localhost:8082",
    "http://localhost:8288",
    "http://localhost:8290",
    "http://127.0.0.1:8288",
    "http://127.0.0.1:8290",
    "http://192.168.0.100:8290",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def log_inngest_calls(request: Request, call_next):
    if "/api/inngest" in request.url.path:
        body = await request.body()
        with open("inngest_calls.log", "a") as f:
            f.write(f"\n--- INNGEST CALL: {request.method} {request.url} ---\n")
            f.write(f"Headers: {request.headers}\n")
            f.write(f"Body: {body.decode('utf-8', errors='replace')}\n")
        
        # Reset body for the next handler
        async def receive():
            return {"type": "http.request", "body": body}
        request._receive = receive

    response = await call_next(request)

    if "/api/inngest" in request.url.path:
        # Capture response body if possible
        with open("inngest_calls.log", "a") as f:
            f.write(f"Response Status: {response.status_code}\n")
            
    return response

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
app.include_router(spaces_router)
app.include_router(resources_router)
app.include_router(settings_router)
app.include_router(inbox_router)
app.include_router(system_router)
app.include_router(workspaces_router)

# Inngest Handler
inngest_handler = serve(
    app,
    inngest_client,
    [writer_workflow, generic_agent_workflow, sync_all_pricing, sync_provider_pricing_event, knowledge_indexing_workflow],
)

@app.get("/")
async def root():
    return {"message": "RAGAS Axon API is running"}
