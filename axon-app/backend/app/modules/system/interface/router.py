from fastapi import APIRouter, Depends
from app.api.deps import get_current_user
from app.modules.system.application.service import SystemService
from app.modules.system.dependencies import get_system_service
from app.modules.system.application.schemas import (
    MetaAgentResponse, UpdateMetaAgentRequest,
    VoiceMetaAgentResponse, UpdateVoiceMetaAgentRequest
)

router = APIRouter(
    prefix="/system",
    tags=["system"],
    dependencies=[Depends(get_current_user)]
)

@router.get("/meta-agent", response_model=MetaAgentResponse)
async def get_meta_agent(
    service: SystemService = Depends(get_system_service)
):
    """Get global Meta Agent configuration."""
    return await service.get_meta_agent()

@router.put("/meta-agent", response_model=MetaAgentResponse)
async def upsert_meta_agent(
    request: UpdateMetaAgentRequest,
    service: SystemService = Depends(get_system_service)
):
    """Create or Update global Meta Agent configuration."""
    return await service.upsert_meta_agent(request)

@router.get("/voice", response_model=VoiceMetaAgentResponse)
async def get_voice_meta_agent(
    service: SystemService = Depends(get_system_service)
):
    """Get global Voice Meta Agent configuration."""
    return await service.get_voice_meta_agent()

@router.put("/voice", response_model=VoiceMetaAgentResponse)
async def upsert_voice_meta_agent(
    request: UpdateVoiceMetaAgentRequest,
    service: SystemService = Depends(get_system_service)
):
    """Create or Update global Voice Meta Agent configuration."""
    return await service.upsert_voice_meta_agent(request)
