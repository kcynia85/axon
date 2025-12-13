from fastapi import FastAPI
from backend.app.modules.projects.interface.router import router as projects_router
from backend.app.modules.agents.interface.router import router as agents_router

app = FastAPI(title="RAGAS Axon API")

app.include_router(projects_router)
app.include_router(agents_router)

@app.get("/")
async def root():
    return {"message": "RAGAS Axon API is running"}