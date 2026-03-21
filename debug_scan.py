import os
import sys
import importlib
import inspect

tools_dir = "axon-app/backend/app/tools"
if tools_dir not in sys.path:
    sys.path.insert(0, tools_dir)

discovered_tools = []
for filename in os.listdir(tools_dir):
    if filename.endswith(".py") and not filename.startswith("__"):
        module_name = filename[:-3]
        print(f"Scanning module: {module_name}")
        try:
            module = importlib.import_module(module_name)
            for name, obj in inspect.getmembers(module):
                if hasattr(obj, "is_crewai_tool"):
                    print(f"Found tool: {name}")
                    discovered_tools.append(name)
        except Exception as e:
            print(f"Error: {e}")

print(f"Discovered tools: {discovered_tools}")
