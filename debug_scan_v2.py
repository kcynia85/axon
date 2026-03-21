import os
import sys
import importlib
import inspect

tools_dir = os.path.abspath("axon-app/backend/app/tools")
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

print(f"Tools Dir: {tools_dir}")
print(f"Package Name: {package_name}")
print(f"Sys Path: {sys.path[:3]}")

discovered_tools = []
for filename in os.listdir(tools_dir):
    if filename.endswith(".py") and not filename.startswith("__"):
        module_base = filename[:-3]
        full_module_name = f"{package_name}.{module_base}" if package_name else module_base
        print(f"Scanning module: {full_module_name}")
        try:
            module = importlib.import_module(full_module_name)
            for name, obj in inspect.getmembers(module):
                if hasattr(obj, "is_crewai_tool"):
                    print(f"Found tool: {name}")
                    discovered_tools.append(name)
        except Exception as e:
            print(f"Error: {e}")

print(f"Discovered tools: {discovered_tools}")
