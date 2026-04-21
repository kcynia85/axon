import json
import logging
import re
from typing import Optional, List
from app.modules.spaces.domain.meta_agent_models import MetaAgentProposalRequest, MetaAgentProposalResponse
from app.modules.system.application.retriever import SystemAwarenessRetrieverService
from app.modules.system.infrastructure.repo import SystemRepository
from app.modules.knowledge.application.rag import RAGService
from app.shared.infrastructure.adapters.langchain_adapter import get_llm_adapter

logger = logging.getLogger(__name__)

class MetaAgentService:
    """
    Service responsible for interacting with the Meta-Agent logic, retrieving system context
    via RAG#2 and Knowledge context via RAG#1, enforcing strict Pydantic output from the LLM.
    """
    def __init__(self, system_retriever: SystemAwarenessRetrieverService, rag_service: RAGService, system_repo: SystemRepository):
        self.system_retriever = system_retriever
        self.rag_service = rag_service
        self.system_repo = system_repo
        self.llm_adapter = get_llm_adapter()

    async def propose_draft(self, request: MetaAgentProposalRequest) -> MetaAgentProposalResponse:
        """
        Uses RAG#1 (Knowledge) and RAG#2 (System Awareness) to get context based on user query, 
        then asks the LLM for a structured proposal of a complete flow (multiple entities).
        """
        # Fetch global Meta-Agent configuration from Settings
        meta_agent_config = await self.system_repo.get_meta_agent()
        custom_system_instruction = meta_agent_config.meta_agent_system_prompt if meta_agent_config else "You are the Axon Meta-Agent, a senior AI architect."
        llm_temperature = meta_agent_config.meta_agent_temperature if meta_agent_config else 0.7

        context_data = request.context or {}
        knowledge_enabled = context_data.get("knowledge_enabled", True)
        system_awareness_enabled = context_data.get("system_awareness_enabled", True)
        
        system_context_str = ""
        knowledge_context_str = ""

        # 1. Retrieve system context via RAG#2 (System Awareness)
        if system_awareness_enabled:
            try:
                system_context_results = await self.system_retriever.search(query=request.query, limit=5)
                system_context_str = "\n".join([
                    f"- Existing Entity: {r.entity_type}, Name: {r.payload.get('name', 'Unknown')}, Description: {r.payload.get('description', '')}"
                    for r in system_context_results
                ])
            except Exception as e:
                logger.warning(f"RAG#2 (System Awareness) failed: {e}")
                system_context_str = "Error retrieving system context."

        # 2. Retrieve knowledge context via RAG#1 (Knowledge)
        if knowledge_enabled:
            try:
                knowledge_results = await self.rag_service.search_knowledge(query=request.query, limit=5)
                knowledge_context_str = "\n".join([
                    f"- Doc Fragment: {r.get('metadata', {}).get('text', '')[:300]}..."
                    for r in knowledge_results
                ])
            except Exception as e:
                logger.warning(f"RAG#1 (Knowledge) failed: {e}")
                knowledge_context_str = "Error retrieving knowledge context."

        # 3. Handle Attachments
        attachments_str = ""
        if request.attachments:
            attachments_str = "\n".join([
                f"- User Attachment: {a.name} ({a.content_type})"
                for a in request.attachments
            ])

        # 4. Build the prompt for Flow Generation
        schema_str = MetaAgentProposalResponse.model_json_schema()
        
        prompt = f"""
{custom_system_instruction}
Your task is to design a functional AI flow (Space Canvas) based on the user's requirements and available context.

User Requirement: "{request.query}"

Context Sources:
---
SYSTEM AWARENESS (Existing system entities):
{system_context_str if system_context_str else "No relevant system entities found."}

KNOWLEDGE BASE (Information from documents):
{knowledge_context_str if knowledge_context_str else "No relevant documents found."}

USER ATTACHMENTS:
{attachments_str if attachments_str else "No files attached."}
---

Your Goal:
Propose a COMPLETE FLOW of entities (agents, crews, tasks, tools, etc.) that fulfills the user requirement. 
Each proposed entity must be "Studio-Ready", meaning it should have all configuration fields required to function perfectly in the system.

ENTITY SCHEMAS & GUIDELINES:
- AGENT: Requires 'agent_name', 'agent_role_text', 'agent_goal', 'agent_backstory', 'system_instruction'. Can include 'tools' (list of strings), 'model_tier' (TIER_1_FAST, TIER_2_EXPERT), 'temperature', 'native_skills' (WEB_SEARCH, CODE_INTERPRETER). Important: Do NOT repeat skills or tools.
- CREW: Requires 'crew_name', 'crew_description', 'crew_process_type' (Sequential, Hierarchical, Parallel). Can include 'agent_member_ids' (if referencing existing agents).
- TEMPLATE: Requires 'template_name', 'template_description', 'template_markdown_content'. Can include 'template_checklist_items', 'template_inputs', 'template_outputs'.
- SERVICE: Requires 'service_name', 'service_description', 'service_category', 'service_url'. Can include 'capabilities' (list of {'capability_name', 'capability_description'}).

WORKSPACE ZONES (Mandatory field 'target_workspace'):
- 'ws-discovery': For research, data gathering, discovery agents and resources.
- 'ws-design': For architecture, design, and prototyping entities.
- 'ws-delivery': For automation, execution, code generation, and delivery tasks.
- 'ws-product': For product management, backlog, and requirements.
- 'ws-growth': For marketing, growth hacking, and external outreach.

CROSS-ZONE COMMUNICATION:
- Direct connections (edges) between nodes in DIFFERENT zones are FORBIDDEN by the canvas logic.
- To pass data from a source node in Zone A to a target node in Zone B:
    1. The source node MUST include an artifact in its 'payload' under 'artefacts' with 'isOutput: true'.
       Example: "payload": {{ "artefacts": [{{ "id": "output-1", "label": "Result Report", "isOutput": true, "status": "approved" }}] }}
    2. The target node MUST include a context requirement in its 'payload' under 'context_requirements' that references the source node's label and artifact label.
       Example: "payload": {{ "context_requirements": [{{ "id": "ctx-1", "label": "Input Data", "sourceNodeLabel": "Researcher Bot", "sourceArtifactLabel": "Result Report" }}] }}
- Only use 'connections' in the JSON response for nodes within the SAME zone.

Instructions:
1. Synthesize information from the Knowledge Base and System Awareness.
2. Design a sequence of entities. Reuse existing system entities if they fit perfectly by referencing their IDs in the payload.
3. Categorize each entity into the most appropriate 'target_workspace'.
4. Handle cross-zone data flow via 'isOutput: true' artifacts and 'context_requirements' instead of direct connections.
5. Generate a structured JSON response matching the provided schema.
6. Each entity must have 'status' set to 'draft'.
7. Important: The 'payload' field of each draft must contain the detailed configuration fields mentioned above.
8. Do NOT wrap in Markdown. Output raw JSON only.

JSON Schema:
{json.dumps(schema_str, indent=2)}
"""

        max_retries = 3
        for attempt in range(max_retries):
            try:
                # Use custom chat model configuration from Settings
                chat_model = self.llm_adapter.get_chat_model(
                    temperature=llm_temperature
                )
                
                from langchain_core.messages import HumanMessage
                messages = [HumanMessage(content=prompt)]
                response = await chat_model.ainvoke(messages)
                response_text = str(response.content)
                
                # Robust JSON extraction
                json_match = re.search(r"(\{.*\})", response_text, re.DOTALL)
                cleaned_text = json_match.group(1) if json_match else response_text.strip()

                return MetaAgentProposalResponse.model_validate_json(cleaned_text)
            
            except Exception as e:
                logger.warning(f"Meta-Agent generation failed (attempt {attempt + 1}/{max_retries}): {e}")
                if attempt == max_retries - 1:
                    raise ValueError(f"Failed to generate Meta-Agent flow. Last error: {str(e)}") from e
