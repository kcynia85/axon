from fastapi import APIRouter, Depends, Query, WebSocket, WebSocketDisconnect, Body
from typing import List, Dict, Any
import os
import json
import asyncio
from sqlalchemy import text

from app.api.deps import get_current_user
from app.modules.system.application.service import SystemService
from app.modules.system.dependencies import get_system_service
from app.shared.infrastructure.websocket_manager import manager
from app.shared.infrastructure.database import AsyncSessionLocal
from app.modules.system.application.schemas import (
    MetaAgentResponse, UpdateMetaAgentRequest,
    VoiceMetaAgentResponse, UpdateVoiceMetaAgentRequest
)

router = APIRouter(
    prefix="/system",
    tags=["system"]
)

# Global background task for DB listening
listen_task = None

async def db_listen_task():
    """Listens for PostgreSQL NOTIFY events and broadcasts them via WebSocket."""
    print(f"[PID:{os.getpid()}] Starting DB Listen Task for awareness_channel")
    while True:
        try:
            async with AsyncSessionLocal() as session:
                # We need a direct asyncpg connection for the listener
                # SQLAlchemy's AsyncConnection.get_raw_connection() returns an asyncpg.Connection
                conn = await session.connection()
                raw_conn = await conn.get_raw_connection()
                
                async def callback(connection, pid, channel, payload):
                    print(f"[PID:{os.getpid()}] Received DB Notification on {channel}")
                    try:
                        message = json.loads(payload)
                        await manager.broadcast("awareness", message)
                    except Exception as e:
                        print(f"Error in DB callback: {e}")

                # Access the underlying asyncpg connection object
                driver_conn = raw_conn.driver_connection
                await driver_conn.add_listener("awareness_channel", callback)
                print(f"[PID:{os.getpid()}] Listener added successfully")
                
                while True:
                    await asyncio.sleep(10) # Keep task alive
        except Exception as e:
            print(f"DB Listen Task error: {e}. Retrying in 5s...")
            await asyncio.sleep(5)

@router.on_event("startup")
async def startup_event():
    global listen_task
    listen_task = asyncio.create_task(db_listen_task())

@router.get("/meta-agent", response_model=MetaAgentResponse, dependencies=[Depends(get_current_user)])
async def get_meta_agent(
    service: SystemService = Depends(get_system_service)
):
    return await service.get_meta_agent()

@router.put("/meta-agent", response_model=MetaAgentResponse, dependencies=[Depends(get_current_user)])
async def upsert_meta_agent(
    request: UpdateMetaAgentRequest,
    service: SystemService = Depends(get_system_service)
):
    return await service.upsert_meta_agent(request)

@router.get("/voice", response_model=VoiceMetaAgentResponse, dependencies=[Depends(get_current_user)])
async def get_voice_meta_agent(
    service: SystemService = Depends(get_system_service)
):
    return await service.get_voice_meta_agent()

@router.put("/voice", response_model=VoiceMetaAgentResponse, dependencies=[Depends(get_current_user)])
async def upsert_voice_meta_agent(
    request: UpdateVoiceMetaAgentRequest,
    service: SystemService = Depends(get_system_service)
):
    return await service.upsert_voice_meta_agent(request)

@router.get("/embeddings", response_model=List[Dict[str, Any]], dependencies=[Depends(get_current_user)])
async def list_system_embeddings(
    limit: int = Query(100, ge=1, le=1000),
    offset: int = Query(0, ge=0),
    service: SystemService = Depends(get_system_service)
):
    return await service.list_embeddings(limit=limit, offset=offset)

@router.post("/internal/broadcast")
async def internal_broadcast(
    payload: Dict[str, Any] = Body(...)
):
    """
    Internal bridge that uses DB NOTIFY to reach all FastAPI worker processes.
    """
    message = payload.get("message", {})
    
    async with AsyncSessionLocal() as session:
        # Use simple execute for NOTIFY
        payload_json = json.dumps(message)
        # Note: NOTIFY payload must be a string literal or escaped
        await session.execute(text("SELECT pg_notify('awareness_channel', :p)"), {"p": payload_json})
        await session.commit()
        
    return {"status": "ok", "method": "pg_notify"}

@router.websocket("/ws/awareness")
async def awareness_websocket(websocket: WebSocket):
    try:
        await websocket.accept()
        print(f"[PID:{os.getpid()}] [WebSocket] Connected: {websocket.client}")
        await manager.connect(websocket, "awareness")
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket, "awareness")
    except Exception as e:
        manager.disconnect(websocket, "awareness")
