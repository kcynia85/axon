import importlib.metadata
try:
    print(f"Inngest: {importlib.metadata.version('inngest')}")
except:
    print("Inngest: not found")

try:
    print(f"Pydantic: {importlib.metadata.version('pydantic')}")
except:
    print("Pydantic: not found")

try:
    print(f"FastAPI: {importlib.metadata.version('fastapi')}")
except:
    print("FastAPI: not found")