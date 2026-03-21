import typer
import uvicorn
from .server import app as fastapi_app

app = typer.Typer()

@app.command()
def dev(path: str = ".", port: int = 8081):
    """
    Start the local development server for Axon Internal Tools.
    """
    import os
    import sys
    print(f"DEBUG: sys.path: {sys.path}")
    os.environ["AXON_TOOLS_DIR"] = path
    print(f"Starting axon-tools server for directory: {path}")
    print(f"UI will be available at http://localhost:{port}")
    uvicorn.run(fastapi_app, host="0.0.0.0", port=port)

if __name__ == "__main__":
    app()