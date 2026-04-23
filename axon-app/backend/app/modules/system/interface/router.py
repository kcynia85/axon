from fastapi import APIRouter, Depends, Query, WebSocket, WebSocketDisconnect, Body, UploadFile, File
from fastapi.responses import StreamingResponse
from typing import List, Dict, Any
import os
import json
import asyncio
from sqlalchemy import text

from app.api.deps import get_current_user
from app.modules.system.application.service import SystemService
from app.modules.system.application.voice_service import VoiceInteractionService
from app.modules.system.dependencies import get_system_service, get_voice_interaction_service
from app.shared.infrastructure.websocket_manager import manager
from app.shared.infrastructure.database import AsyncSessionLocal
from app.modules.system.application.schemas import (
    MetaAgentResponse, UpdateMetaAgentRequest,
    VoiceMetaAgentResponse, UpdateVoiceMetaAgentRequest,
    SystemAwarenessSettingsResponse, UpdateSystemAwarenessSettingsRequest
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
                conn = await session.connection()
                raw_conn = await conn.get_raw_connection()
                
                async def callback(connection, pid, channel, payload):
                    try:
                        message = json.loads(payload)
                        await manager.broadcast("awareness", message)
                    except Exception as e:
                        print(f"Error in DB callback: {e}")

                driver_conn = raw_conn.driver_connection
                await driver_conn.add_listener("awareness_channel", callback)
                
                while True:
                    await asyncio.sleep(10)
        except Exception as e:
            print(f"DB Listen Task error: {e}. Retrying in 5s...")
            await asyncio.sleep(5)

@router.on_event("startup")
async def startup_event():
    global listen_task
    listen_task = asyncio.create_task(db_listen_task())

# --- Meta Agent ---

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

# --- Voice ---

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

@router.post("/voice/tts", dependencies=[Depends(get_current_user)])
async def generate_speech(
    payload: Dict[str, Any] = Body(...),
    service: VoiceInteractionService = Depends(get_voice_interaction_service)
):
    text = payload.get("text", "")
    return StreamingResponse(
        service.handle_tts(text),
        media_type="audio/mpeg"
    )

@router.post("/voice/stt", dependencies=[Depends(get_current_user)])
async def transcribe_audio(
    file: UploadFile = File(...),
    service: VoiceInteractionService = Depends(get_voice_interaction_service)
):
    audio_data = await file.read()
    text = await service.handle_stt(audio_data)
    return {"text": text}

# --- Awareness Settings ---

@router.get("/awareness", response_model=SystemAwarenessSettingsResponse, dependencies=[Depends(get_current_user)])
async def get_awareness_settings(
    service: SystemService = Depends(get_system_service)
):
    settings = await service.get_awareness_settings()
    if not settings:
        # Return default structure if not initialized
        import uuid
        return {
            "id": uuid.uuid4(),
            "embedding_model_id": None,
            "indexing_enabled": True,
            "realtime_sync_enabled": True
        }
    return settings

@router.put("/awareness", response_model=SystemAwarenessSettingsResponse, dependencies=[Depends(get_current_user)])
async def upsert_awareness_settings(
    request: UpdateSystemAwarenessSettingsRequest,
    service: SystemService = Depends(get_system_service)
):
    return await service.upsert_awareness_settings(request)

# --- Misc ---

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
    message = payload.get("message", {})
    async with AsyncSessionLocal() as session:
        payload_json = json.dumps(message)
        await session.execute(text("SELECT pg_notify('awareness_channel', :p)"), {"p": payload_json})
        await session.commit()
    return {"status": "ok", "method": "pg_notify"}

@router.websocket("/ws/awareness")
async def awareness_websocket(websocket: WebSocket):
    try:
        await websocket.accept()
        await manager.connect(websocket, "awareness")
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket, "awareness")
    except Exception:
        manager.disconnect(websocket, "awareness")
