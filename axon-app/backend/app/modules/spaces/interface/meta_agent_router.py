from fastapi import APIRouter, Depends
from app.modules.spaces.domain.meta_agent_models import MetaAgentProposalRequest, MetaAgentProposalResponse
from app.modules.spaces.application.meta_agent_service import MetaAgentService
from app.modules.spaces.application.service import get_space_repo
from app.modules.spaces.infrastructure.repo import SpaceRepository
from app.modules.system.dependencies import get_system_awareness_retriever, get_system_repo
from app.modules.settings.dependencies import get_settings_repo
from app.modules.settings.infrastructure.repo import SettingsRepository
from app.modules.system.application.retriever import SystemAwarenessRetrieverService
from app.modules.system.infrastructure.repo import SystemRepository
from app.modules.knowledge.application.rag import RAGService
from app.modules.knowledge.dependencies import get_rag_service
from app.modules.projects.infrastructure.repo import ProjectRepository
from app.modules.projects.dependencies import get_project_repo

router = APIRouter(prefix="/meta-agent", tags=["Meta-Agent"])

async def get_meta_agent_service(
    system_retriever: SystemAwarenessRetrieverService = Depends(get_system_awareness_retriever),
    rag_service: RAGService = Depends(get_rag_service),
    system_repo: SystemRepository = Depends(get_system_repo),
    settings_repo: SettingsRepository = Depends(get_settings_repo),
    space_repo: SpaceRepository = Depends(get_space_repo),
    project_repo: ProjectRepository = Depends(get_project_repo)
) -> MetaAgentService:
    return MetaAgentService(system_retriever, rag_service, system_repo, settings_repo, space_repo, project_repo)

@router.post("/propose", response_model=MetaAgentProposalResponse)
async def propose_draft(
    request: MetaAgentProposalRequest,
    service: MetaAgentService = Depends(get_meta_agent_service)
):
    """
    Endpoint for the Meta-Agent to propose a new entity or modification.
    """
    try:
        return await service.propose_draft(request)
    except Exception as e:
        from fastapi import HTTPException
        raise HTTPException(status_code=422, detail=str(e))
