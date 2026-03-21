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
from typing import List, Dict, Any, Optional, get_type_hints

app = FastAPI(title="Axon Tools Local Dev Server")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

AXON_API_URL = os.environ.get("AXON_API_URL", "http://127.0.0.1:8000")

class RunToolRequest(BaseModel):
    params: Dict[str, Any]

class UpdateStatusRequest(BaseModel):
    tool_name: str
    status: str

def get_tools_dir():
    # Priority 1: Internal tools directory (SSOT)
    internal_tools = os.path.join(os.path.dirname(__file__), "tools")
    
    # Priority 2: Environment variable, but only if it's not just the default "."
    env_dir = os.environ.get("AXON_TOOLS_DIR")
    if env_dir and env_dir != ".":
        return env_dir
        
    return internal_tools

def get_metadata_path():
    return os.path.join(get_tools_dir(), "tools_metadata.json")

def load_metadata() -> Dict[str, Any]:
    path = get_metadata_path()
    if os.path.exists(path):
        try:
            with open(path, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return {}
    return {}

def save_metadata(metadata: Dict[str, Any]):
    path = get_metadata_path()
    with open(path, "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=4)

def get_type_name(t):
    # Handle cases where t is a class, a string, or an Any
    ts = str(t).lower()
    if "str" in ts: return "STRING"
    if "int" in ts: return "INTEGER"
    if "float" in ts: return "NUMBER"
    if "bool" in ts: return "BOOLEAN"
    return "ANY"

def scan_local_tools():
    tools_dir = os.path.abspath(get_tools_dir())
    metadata = load_metadata()
    
    # Try to determine if we are in a package
    is_package = os.path.exists(os.path.join(tools_dir, "__init__.py"))
    
    if is_package:
        parent_dir = os.path.dirname(tools_dir)
        package_name = os.path.basename(tools_dir)
        if parent_dir not in sys.path:
            sys.path.insert(0, parent_dir)
    else:
        if tools_dir not in sys.path:
            sys.path.insert(0, tools_dir)
        package_name = None

    discovered_tools = []
    
    if not os.path.exists(tools_dir):
        return []

    for filename in os.listdir(tools_dir):
        if filename.endswith(".py") and not filename.startswith("__"):
            module_base = filename[:-3]
            full_module_name = f"{package_name}.{module_base}" if package_name else module_base
            
            try:
                # Reload the tools package first to pick up decorator changes
                tools_pkg = f"{package_name}" if package_name else "tools"
                if tools_pkg in sys.modules:
                    importlib.reload(sys.modules[tools_pkg])
                
                if full_module_name in sys.modules:
                    module = importlib.reload(sys.modules[full_module_name])
                else:
                    module = importlib.import_module(full_module_name)
                
                for name, obj in inspect.getmembers(module):
                    if hasattr(obj, "is_crewai_tool") or (hasattr(obj, "name") and hasattr(obj, "description") and hasattr(obj, "run")):
                        # Check if defined in THIS module
                        if hasattr(obj, "__module__") and obj.__module__ != full_module_name:
                             continue
                             
                        tool_name = getattr(obj, "name", name)
                        tool_description = getattr(obj, "description", "")
                        tool_keywords = getattr(obj, "keywords", ["python", "synced"])
                        
                        # Get status from metadata or default to draft
                        tool_status = metadata.get(tool_name, {}).get("status", "draft")
                        
                        args_schema = {}
                        if hasattr(obj, "args_schema") and obj.args_schema:
                            try:
                                if hasattr(obj.args_schema, "model_json_schema"):
                                    args_schema = obj.args_schema.model_json_schema()
                                else:
                                    args_schema = {"properties": {}} 
                            except:
                                args_schema = {"error": "Could not serialize schema"}
                        else:
                            # Fallback: extract from type hints
                            try:
                                target_func = obj
                                if hasattr(obj, "__wrapped__"):
                                    target_func = obj.__wrapped__
                                    
                                hints = get_type_hints(target_func)
                                sig = inspect.signature(target_func)
                                props = {}
                                required = []
                                
                                for param_name, param in sig.parameters.items():
                                    if param_name == "self": continue
                                    t = hints.get(param_name, Any)
                                    props[param_name] = {"type": get_type_name(t)}
                                    if param.default == inspect.Parameter.empty:
                                        required.append(param_name)
                                        
                                args_schema = {"properties": props, "required": required}
                            except Exception as e:
                                args_schema = {"error": f"Metadata error: {str(e)}"}
                                
                        discovered_tools.append({
                            "name": tool_name,
                            "description": tool_description,
                            "args_schema": args_schema,
                            "function_name": name,
                            "file_path": filename,
                            "module_name": full_module_name,
                            "keywords": tool_keywords,
                            "status": tool_status
                        })
            except Exception as e:
                print(f"Error scanning {filename} ({full_module_name}): {e}")
                
    return discovered_tools

@app.get("/api/tools")
def list_tools():
    tools = scan_local_tools()
    return {"tools": tools}

@app.post("/api/update-tool-status")
def update_tool_status(request: UpdateStatusRequest):
    metadata = load_metadata()
    if request.tool_name not in metadata:
        metadata[request.tool_name] = {}
    metadata[request.tool_name]["status"] = request.status
    metadata[request.tool_name]["updated_at"] = time.time()
    save_metadata(metadata)
    return {"success": True, "status": request.status}

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
        
        target_func = func
        if hasattr(func, "__wrapped__"):
            target_func = func.__wrapped__
            
        try:
            hints = get_type_hints(target_func)
            casted_params = {}
            for key, value in request.params.items():
                if key in hints:
                    expected_type = hints[key]
                    try:
                        if expected_type == float:
                            casted_params[key] = float(value)
                        elif expected_type == int:
                            casted_params[key] = int(value)
                        elif expected_type == bool:
                            casted_params[key] = str(value).lower() in ("true", "1", "yes")
                        else:
                            casted_params[key] = value
                    except (ValueError, TypeError):
                        casted_params[key] = value
                else:
                    casted_params[key] = value
            params_to_use = casted_params
        except Exception:
            params_to_use = request.params

        from io import StringIO
        old_stdout = sys.stdout
        redirected_output = sys.stdout = StringIO()
        
        start_time = time.time()
        
        try:
            if hasattr(func, "run"):
                result = func.run(**params_to_use)
            else:
                result = func(**params_to_use)
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
        
    sync_url = f"{AXON_API_URL}/resources/internal-tools/sync-remote"
    
    async with httpx.AsyncClient(timeout=10.0) as client:
        try:
            response = await client.post(
                sync_url,
                json={
                    "file_name": tool_info["file_path"],
                    "file_content": content,
                    "author": "local-dev",
                    "status": tool_info["status"] # Pass status to Axon App
                }
            )
            response.raise_for_status()
            return {"success": True, "message": "Tool synced successfully"}
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=e.response.status_code, detail=f"Axon API Error: {e.response.text}")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to sync with Axon API: {e}")

import pathlib
static_dir = os.path.join(os.path.dirname(__file__), "static")
if os.path.exists(static_dir):
    app.mount("/", StaticFiles(directory=static_dir, html=True), name="static")
