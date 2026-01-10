# How to Run the Backend

Navigate to the `backend` directory and run the start script:

```bash
cd backend
./start.sh
```

Or manually using `uv`:

```bash
cd backend
export PYTHONPATH=..
uv run uvicorn backend.main:app --reload --port 8000
```
