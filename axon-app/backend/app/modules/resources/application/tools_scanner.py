import importlib
import pkgutil
import inspect
import sys
import os
from typing import List, Dict, Any
from app.modules.resources.domain.models import InternalTool

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
        
        # Ensure the path is in sys.path
        # current_dir = os.getcwd()
        # if current_dir not in sys.path:
        #     sys.path.append(current_dir)

        # Import the package to get its path
        try:
            package = importlib.import_module(TOOLS_DIR)
        except ImportError as e:
            print(f"Error importing {TOOLS_DIR}: {e}")
            return []

        # Iterate over all modules in the package
        for _, module_name, _ in pkgutil.iter_modules(package.__path__):
            full_module_name = f"{TOOLS_DIR}.{module_name}"
            
            try:
                # Reload module to ensure we get fresh code changes
                if full_module_name in sys.modules:
                    module = importlib.reload(sys.modules[full_module_name])
                else:
                    module = importlib.import_module(full_module_name)
                
                # Inspect members of the module
                for name, obj in inspect.getmembers(module):
                    # Check if it's a Tool object (CrewAI tools are usually objects or classes)
                    # When using @tool decorator, it returns a Tool object or similar.
                    # We need a robust way to identify them.
                    
                    # For CrewAI @tool decorator, it often returns a 'Tool' instance or wraps the function.
                    # We check for attributes like 'name', 'description', 'args_schema' or 'func'.
                    
                    if hasattr(obj, "is_crewai_tool") or (hasattr(obj, "name") and hasattr(obj, "description") and hasattr(obj, "run")):
                         # Filter out imports from other modules (ensure it's defined in this module)
                        if hasattr(obj, "__module__") and obj.__module__ != full_module_name:
                             # Some decorators wrap the function, so __module__ might point to the wrapper.
                             # But usually for @tool, the object instance is created in the module.
                             # Let's keep it simple: if it has 'name' and 'description' and is in the module scope.
                             pass

                        # We found a candidate. Let's try to extract metadata.
                        try:
                            tool_name = getattr(obj, "name", name)
                            tool_description = getattr(obj, "description", "")
                            
                            # Extract arguments schema
                            # CrewAI tools usually have 'args_schema' (Pydantic model)
                            args_schema = {}
                            if hasattr(obj, "args_schema") and obj.args_schema:
                                try:
                                    args_schema = obj.args_schema.model_json_schema()
                                except:
                                    args_schema = {"error": "Could not serialize schema"}
                            
                            # Identify the function name for import
                            # If it's a decorated function, the object name in the module is the function name.
                            # If it's a class tool, it's the class name.
                            func_name = name 
                            
                            discovered_tools.append({
                                "name": tool_name,
                                "description": tool_description,
                                "args_schema": args_schema,
                                "tool_function_name": func_name, # This is the symbol name in Python
                                "file_path": f"app/tools/{module_name}.py",
                                "import_path": f"{full_module_name}",
                                "is_active": True
                            })
                            
                        except Exception as e:
                            print(f"Error extracting metadata for {name} in {full_module_name}: {e}")

            except Exception as e:
                print(f"Error scanning module {full_module_name}: {e}")

        return discovered_tools
