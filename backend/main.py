from fastapi import FastAPI

app = FastAPI(title="RAGAS Axon API")

@app.get("/")
async def root():
    return {"message": "RAGAS Axon API is running"}