from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import sys
import importlib
import inspect
import pkgutil
import json
import time
import httpx
from typing import List, Dict, Any, Optional

app = FastAPI(title="Axon Tools Local Dev Server")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

AXON_API_URL = os.environ.get("AXON_API_URL", "http://localhost:8080/api/v1")

class RunToolRequest(BaseModel):
    params: Dict[str, Any]

class SyncToolRequest(BaseModel):
    tool_name: str

def get_tools_dir():
    return os.environ.get("AXON_TOOLS_DIR", ".")

def scan_local_tools():
    tools_dir = get_tools_dir()
    if tools_dir not in sys.path:
        sys.path.insert(0, tools_dir)

    discovered_tools = []
    
    # Simple scan of python files in the directory
    for filename in os.listdir(tools_dir):
        if filename.endswith(".py") and not filename.startswith("__"):
            module_name = filename[:-3]
            try:
                if module_name in sys.modules:
                    module = importlib.reload(sys.modules[module_name])
                else:
                    module = importlib.import_module(module_name)
                
                for name, obj in inspect.getmembers(module):
                    if hasattr(obj, "is_crewai_tool") or (hasattr(obj, "name") and hasattr(obj, "description") and hasattr(obj, "run")):
                        if hasattr(obj, "__module__") and obj.__module__ != module_name:
                             pass
                             
                        tool_name = getattr(obj, "name", name)
                        tool_description = getattr(obj, "description", "")
                        
                        args_schema = {}
                        if hasattr(obj, "args_schema") and obj.args_schema:
                            try:
                                args_schema = obj.args_schema.model_json_schema()
                            except:
                                args_schema = {"error": "Could not serialize schema"}
                                
                        discovered_tools.append({
                            "name": tool_name,
                            "description": tool_description,
                            "args_schema": args_schema,
                            "function_name": name,
                            "file_path": filename,
                            "module_name": module_name
                        })
            except Exception as e:
                print(f"Error scanning {filename}: {e}")
                
    return discovered_tools

@app.get("/api/tools")
def list_tools():
    tools = scan_local_tools()
    return {"tools": tools}

@app.post("/api/tools/{tool_name}/run")
def run_tool(tool_name: str, request: RunToolRequest):
    tools = scan_local_tools()
    tool_info = next((t for t in tools if t["name"] == tool_name), None)
    
    if not tool_info:
        raise HTTPException(status_code=404, detail="Tool not found")
        
    module_name = tool_info["module_name"]
    function_name = tool_info["function_name"]
    
    try:
        module = importlib.import_module(module_name)
        func = getattr(module, function_name)
        
        # Capture stdout
        from io import StringIO
        import contextlib
        old_stdout = sys.stdout
        redirected_output = sys.stdout = StringIO()
        
        start_time = time.time()
        
        try:
            if hasattr(func, "run"):
                result = func.run(**request.params)
            else:
                result = func(**request.params)
            error = None
        except Exception as e:
            result = None
            error = str(e)
            
        execution_time = time.time() - start_time
        
        sys.stdout = old_stdout
        logs = redirected_output.getvalue()
        
        return {
            "result": result,
            "logs": logs,
            "error": error,
            "execution_time_ms": round(execution_time * 1000, 2)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/tools/{tool_name}/sync")
async def sync_tool(tool_name: str):
    tools = scan_local_tools()
    tool_info = next((t for t in tools if t["name"] == tool_name), None)
    
    if not tool_info:
        raise HTTPException(status_code=404, detail="Tool not found")
        
    file_path = os.path.join(get_tools_dir(), tool_info["file_path"])
    
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to read file: {e}")
        
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                f"{AXON_API_URL}/resources/internal-tools/sync-remote",
                json={
                    "file_name": tool_info["file_path"],
                    "file_content": content,
                    "author": "local-dev"
                }
            )
            response.raise_for_status()
            return {"success": True, "message": "Tool synced successfully"}
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=e.response.status_code, detail=f"Axon API Error: {e.response.text}")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to sync with Axon API: {e}")

# Mount Next.js static files
# Make sure the UI is built and placed in the 'static' folder
import pathlib
static_dir = os.path.join(os.path.dirname(__file__), "static")
if os.path.exists(static_dir):
    app.mount("/", StaticFiles(directory=static_dir, html=True), name="static")
