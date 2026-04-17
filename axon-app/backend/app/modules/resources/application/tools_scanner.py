import importlib
import pkgutil
import inspect
import sys
import logging
from pathlib import Path
from typing import List, Dict, Any

logger = logging.getLogger(__name__)

# Optional import for crewai
try:
    from crewai.tools import tool as crewai_tool_decorator
    HAS_CREWAI = True
except ImportError:
    HAS_CREWAI = False
    crewai_tool_decorator = None

# Define the path to the tools directory
TOOLS_DIR = "app.tools"

class ToolsScannerService:
    """
    Service responsible for scanning the 'app.tools' directory
    to discover functions decorated with @tool.
    """

    def scan_tools(self) -> List[Dict[str, Any]]:
        """
        Scans all modules in app.tools and returns a list of discovered tools metadata.
        """
        discovered_tools = []
        
        # Ensure the backend root directory is in sys.path
        # Path to axon-app/backend
        backend_root = str(Path(__file__).resolve().parent.parent.parent.parent.parent)
        if backend_root not in sys.path:
            sys.path.insert(0, backend_root)
            logger.info(f"Added {backend_root} to sys.path")

        # Force refresh of caches
        importlib.invalidate_caches()

        # Import the package to get its path
        try:
            # We need to ensure we can import 'app.tools'
            if TOOLS_DIR in sys.modules:
                package = importlib.reload(sys.modules[TOOLS_DIR])
            else:
                package = importlib.import_module(TOOLS_DIR)
        except ImportError as e:
            logger.error(f"Error importing {TOOLS_DIR}: {e}")
            return []

        # Iterate over all modules in the package
        for _, module_name, _ in pkgutil.iter_modules(package.__path__):
            full_module_name = f"{TOOLS_DIR}.{module_name}"
            logger.info(f"Scanning module: {full_module_name}")
            
            try:
                # Reload module to ensure we get fresh code changes
                if full_module_name in sys.modules:
                    module = importlib.reload(sys.modules[full_module_name])
                else:
                    module = importlib.import_module(full_module_name)
                
                # Inspect members of the module
                for name, obj in inspect.getmembers(module):
                    # Check if it has tool indicators
                    is_tool = hasattr(obj, "is_crewai_tool") or (
                        hasattr(obj, "name") and 
                        hasattr(obj, "description") and 
                        hasattr(obj, "run")
                    )
                    
                    if is_tool:
                        # Filter out imports from other modules
                        obj_module = getattr(obj, "__module__", "")
                        if obj_module != full_module_name:
                             # For decorated functions, wraps preserves __module__
                             # If it's a wrapper from another module, skip it UNLESS it wraps something in this module
                             # We check __wrapped__ if available
                             actual_func = getattr(obj, "__wrapped__", obj)
                             if getattr(actual_func, "__module__", "") != full_module_name:
                                 continue

                        try:
                            tool_name = getattr(obj, "name", name)
                            tool_description = getattr(obj, "description", "")
                            tool_keywords = getattr(obj, "keywords", ["python", "synced"])
                            
                            logger.info(f"Discovered tool: {tool_name} ({name}) in {full_module_name}")

                            # Extract arguments schema
                            args_schema = {}
                            if hasattr(obj, "args_schema") and obj.args_schema:
                                try:
                                    if hasattr(obj.args_schema, "model_json_schema"):
                                        args_schema = obj.args_schema.model_json_schema()
                                    else:
                                        # Handle old pydantic or other objects
                                        args_schema = {"properties": {}}
                                except:
                                    args_schema = {"error": "Schema serialization failed"}
                            else:
                                # Fallback to inspection if no args_schema (standard functions)
                                try:
                                    target_func = getattr(obj, "__wrapped__", obj)
                                    from typing import get_type_hints
                                    hints = get_type_hints(target_func)
                                    sig = inspect.signature(target_func)
                                    props = {}
                                    required = []
                                    for p_name, p in sig.parameters.items():
                                        if p_name == "self": continue
                                        props[p_name] = {"type": str(hints.get(p_name, "any"))}
                                        if p.default == inspect.Parameter.empty:
                                            required.append(p_name)
                                    args_schema = {"properties": props, "required": required}
                                except:
                                    args_schema = {"properties": {}}
                            
                            discovered_tools.append({
                                "name": tool_name,
                                "description": tool_description,
                                "args_schema": args_schema,
                                "tool_function_name": name,
                                "file_path": f"app/tools/{module_name}.py",
                                "import_path": f"{full_module_name}",
                                "keywords": tool_keywords,
                                "is_active": True
                            })
                            
                        except Exception as e:
                            logger.error(f"Error extracting metadata for {name} in {full_module_name}: {e}")

            except Exception as e:
                logger.error(f"Error scanning module {full_module_name}: {e}")

        return discovered_tools
