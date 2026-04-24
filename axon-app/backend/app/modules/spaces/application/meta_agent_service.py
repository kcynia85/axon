import logging
from typing import Optional

from app.modules.spaces.domain.meta_agent_models import MetaAgentProposalRequest, MetaAgentProposalResponse
from app.modules.spaces.infrastructure.repo import SpaceRepository
from app.modules.projects.infrastructure.repo import ProjectRepository
from app.modules.system.application.retriever import SystemAwarenessRetrieverService
from app.modules.system.infrastructure.repo import SystemRepository
from app.modules.settings.infrastructure.repo import SettingsRepository
from app.modules.knowledge.application.rag import RAGService
from app.shared.infrastructure.adapters.langchain_adapter import get_llm_adapter
from app.shared.domain.ports.external_docs import ExternalDocumentationPort
from app.shared.infrastructure.adapters.notion_adapter import get_external_docs_adapter
from app.modules.spaces.application.meta_agent_workflow import MetaAgentGraphBuilder

logger = logging.getLogger(__name__)

class MetaAgentService:
    """
    Service responsible for interacting with the Meta-Agent logic via an Agentic Workflow (LangGraph).
    """
    def __init__(
        self, 
        system_retriever: SystemAwarenessRetrieverService, 
        rag_service: RAGService, 
        system_repo: SystemRepository, 
        settings_repo: SettingsRepository, 
        space_repo: SpaceRepository,
        project_repo: ProjectRepository,
        external_docs_port: ExternalDocumentationPort = get_external_docs_adapter()
    ):
        self.system_retriever = system_retriever
        self.rag_service = rag_service
        self.system_repo = system_repo
        self.settings_repo = settings_repo
        self.space_repo = space_repo
        self.project_repo = project_repo
        self.external_docs_port = external_docs_port
        self.llm_adapter = get_llm_adapter()

    async def propose_draft(self, request: MetaAgentProposalRequest) -> MetaAgentProposalResponse:
        """
        Uses LangGraph workflow to plan, retrieve context, draft JSON and validate it.
        """
        # Fetch global Meta-Agent configuration from Settings
        meta_agent_config = await self.system_repo.get_meta_agent()

        # Fetch Current Space (Canvas) State and Project Context
        canvas_state = {}
        project_context_str = "No project context available."
        project_strategy_url = None
        try:
            space = await self.space_repo.get_space(request.space_id)
            if space:
                canvas_data = getattr(space, "canvas_data", {})
                canvas_state = canvas_data if isinstance(canvas_data, dict) else {}
                
                # Fetch Project Context
                if space.project_id:
                    project = await self.project_repo.get(space.project_id)
                    if project:
                        project_strategy_url = project.project_strategy_url
                        proj_lines = [f"Project Name: {project.project_name}"]
                        if project.project_summary:
                            proj_lines.append(f"Summary: {project.project_summary}")
                        if project.project_strategy_url:
                            proj_lines.append(f"Strategy Document (Notion/Doc): {project.project_strategy_url}")
                        
                        if getattr(project, "key_resources", None):
                            proj_lines.append("\nKey Resources:")
                            for res in project.key_resources:
                                proj_lines.append(f"- [{res.resource_provider_type.value}] {res.resource_url}")
                                
                        project_context_str = "\n".join(proj_lines)
                        
        except Exception as e:
            logger.warning(f"Failed to fetch space canvas state or project context: {e}")

        # Initialize Graph Builder
        builder = MetaAgentGraphBuilder(
            system_retriever=self.system_retriever,
            rag_service=self.rag_service,
            llm_adapter=self.llm_adapter,
            external_docs_port=self.external_docs_port,
            meta_agent_config=meta_agent_config
        )

        # Configure LLM provider / model from settings
        if meta_agent_config and meta_agent_config.llm_model_id:
            try:
                model = await self.settings_repo.get_llm_model(meta_agent_config.llm_model_id)
                if model:
                    provider = await self.settings_repo.get_llm_provider(model.llm_provider_id)
                    if provider:
                        builder.set_model_config(model.model_id, provider.provider_technical_id)
            except Exception as me:
                logger.warning(f"Failed to fetch model configuration: {me}")

        # Compile graph
        graph = builder.build_graph()

        # Initialize State
        initial_state = {
            "messages": [],
            "request": request,
            "canvas_state": canvas_state,
            "project_context": project_context_str,
            "project_strategy_url": project_strategy_url,
            "plan": "",
            "search_queries": [],
            "rag_context": "",
            "draft_response": None,
            "validation_errors": [],
            "iteration_count": 0
        }

        # Execute Graph
        try:
            logger.info(f"Starting Meta-Agent Graph Execution for query: {request.query}")
            final_state = await graph.ainvoke(initial_state)
            
            if final_state.get("validation_errors"):
                logger.warning(f"Meta-Agent returned result with errors (reached limit): {final_state['validation_errors']}")
            
            if not final_state.get("draft_response"):
                raise ValueError("Graph failed to generate a draft response.")
                
            return final_state["draft_response"]
            
        except Exception as e:
            logger.error(f"Meta-Agent Graph execution failed: {e}")
            raise ValueError(f"Failed to generate Meta-Agent flow. Last error: {str(e)}") from e
