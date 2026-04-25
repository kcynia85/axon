import json
import logging
from typing import Dict, Any, List
from langgraph.graph import StateGraph, END
from langchain_core.messages import HumanMessage, SystemMessage

from app.modules.spaces.domain.meta_agent_graph_models import MetaAgentState, PlannerOutput
from app.modules.spaces.domain.meta_agent_models import MetaAgentProposalResponse
from app.modules.system.application.retriever import SystemAwarenessRetrieverService
from app.modules.knowledge.application.rag import RAGService
from app.shared.infrastructure.adapters.langchain_adapter import LangChainAdapter
from app.shared.domain.ports.external_docs import ExternalDocumentationPort
from app.shared.utils.tokens import count_tokens

logger = logging.getLogger(__name__)

class MetaAgentGraphBuilder:
    def __init__(
        self,
        system_retriever: SystemAwarenessRetrieverService,
        rag_service: RAGService,
        llm_adapter: LangChainAdapter,
        external_docs_port: ExternalDocumentationPort,
        meta_agent_config: Any
    ):
        self.system_retriever = system_retriever
        self.rag_service = rag_service
        self.llm_adapter = llm_adapter
        self.external_docs_port = external_docs_port
        
        self.system_instruction = getattr(meta_agent_config, 'meta_agent_system_prompt', "You are the Axon Meta-Agent, a senior AI architect.") if meta_agent_config else "You are the Axon Meta-Agent, a senior AI architect."
        self.temperature = getattr(meta_agent_config, 'meta_agent_temperature', 0.7) if meta_agent_config else 0.7
        self.model_name = "gpt-5-nano"
        self.provider_name = "openai"

    def set_model_config(self, model_name: str, provider_name: str):
        self.model_name = model_name
        self.provider_name = provider_name

    def _get_chat_model(self, use_cheap_model: bool = False):
        # We could route to a cheaper model for the planner, but for simplicity we'll use the same or allow override
        # Assuming gpt-4o-mini if cheap requested and provider is openai
        model = self.model_name
        if use_cheap_model and self.provider_name == "openai" and "gpt-4o" in model:
            model = "gpt-4o-mini"
            
        return self.llm_adapter.get_chat_model(
            model_name=model,
            provider_name=self.provider_name,
            temperature=self.temperature
        )

    def _format_canvas_state(self, canvas_state: Dict[str, Any]) -> str:
        nodes = canvas_state.get("nodes", [])
        zones = [n for n in nodes if n.get("type") == "zone"]
        entities = [n for n in nodes if n.get("type") in ["agent", "crew", "tool"]]
        
        canvas_lines = ["CURRENT CANVAS STATE:"]
        
        if zones:
            canvas_lines.append("\nEXISTING ZONES:")
            for z in zones:
                canvas_lines.append(f"- {z.get('id')} ({z.get('data', {}).get('label', 'Unnamed')})")
        
        if entities:
            canvas_lines.append("\nENTITIES CURRENTLY ON CANVAS:")
            for e in entities:
                ent_type = e.get('type', 'unknown').capitalize()
                ent_label = e.get('data', {}).get('label', 'Unnamed')
                zone_id = e.get('parentId', 'no zone')
                canvas_lines.append(f"- [{ent_type}] \"{ent_label}\" (in zone: {zone_id})")
        
        if not zones and not entities:
            canvas_lines.append("No existing entities on canvas.")
            
        return "\n".join(canvas_lines)

    async def planner_node(self, state: MetaAgentState) -> Dict[str, Any]:
        logger.info("[MetaAgentGraph] Executing Planner Node")
        request = state["request"]
        canvas_state_str = self._format_canvas_state(state["canvas_state"])
        project_context_str = state.get("project_context", "No project context available.")
        
        # Calculate tokens for these persistent contexts
        stats = state["context_stats"]
        stats.space_canvas_tokens = count_tokens(canvas_state_str, self.model_name)
        stats.project_context_tokens = count_tokens(project_context_str, self.model_name)
        
        prompt = f"""
{self.system_instruction}
You are the Planner phase of the Meta-Agent. Your task is to analyze the user's request and the current Canvas state, and output an execution plan.

STRICT SCOPE GUARDRAILS:
- You ONLY serve to design AI flows, agents, crews, and project architectures on the Axon Space Canvas.
- You are allowed to search the Knowledge Base (RAG#1) and System Awareness (RAG#2) for relevant technical context.
- You ARE NOT a general-purpose chat bot.
- You ARE NOT allowed to answer general knowledge questions (e.g., "who is the president", "how to bake a cake").
- You ARE NOT allowed to write general code unrelated to Axon agents.
- If a request is out of scope, set 'is_out_of_scope' to True.

User Requirement: "{request.query}"

PROJECT CONTEXT:
{project_context_str}

{canvas_state_str}

Goal:
1. Determine if the request is within scope.
2. Explain what needs to be created or modified.
3. Formulate 1 to 3 search queries to find existing tools, templates, or knowledge relevant to this request.
4. Write a step-by-step execution plan for the Drafter to follow.

Output strict JSON conforming to the requested schema.
"""
        model = self._get_chat_model(use_cheap_model=True).with_structured_output(PlannerOutput, method="function_calling")
        
        try:
            planner_out = await model.ainvoke([HumanMessage(content=prompt)])
            return {
                "plan": planner_out.execution_plan,
                "search_queries": planner_out.search_queries,
                "context_stats": stats,
                "is_out_of_scope": planner_out.is_out_of_scope
            }
        except Exception as e:
            logger.error(f"Planner Node failed: {e}")
            # Fallback
            return {
                "plan": "Fulfill the user requirement: " + request.query,
                "search_queries": [request.query],
                "context_stats": stats,
                "is_out_of_scope": False
            }

    async def retriever_node(self, state: MetaAgentState) -> Dict[str, Any]:
        logger.info("[MetaAgentGraph] Executing Retriever Node")
        queries = state["search_queries"]
        request = state["request"]
        strategy_url = state.get("project_strategy_url")
        stats = state["context_stats"]
        
        context_data = request.context or {}
        knowledge_enabled = context_data.get("knowledge_enabled", True)
        system_awareness_enabled = context_data.get("system_awareness_enabled", True)
        
        # Deduplicate and limit queries
        queries = list(set(queries))[:3]
        if not queries:
            queries = [request.query]
            
        system_context_str = ""
        knowledge_context_str = ""
        notion_context_str = ""
        
        # 1. Retrieve system context
        if system_awareness_enabled:
            all_system_results = []
            try:
                for q in queries:
                    res = await self.system_retriever.search(query=q, limit=3)
                    all_system_results.extend(res)
                
                # Format system results
                if all_system_results:
                    entities_str = "\n".join([
                        f"- [{r.entity_type.upper()}] {r.payload.get('name', 'Unknown')}\n"
                        f"  Description: {r.payload.get('description', '')}\n"
                        f"  Details: {json.dumps({k:v for k,v in r.payload.items() if k not in ('name', 'description')}, ensure_ascii=False)}"
                        for r in all_system_results[:5] # Limit total
                    ])
                    system_context_str = "\nSYSTEM AWARENESS (Existing system entities):\n" + entities_str
                    stats.system_awareness_tokens = count_tokens(entities_str, self.model_name)
            except Exception as e:
                logger.warning(f"RAG#2 (System Awareness) failed: {e}")

        # 2. Retrieve knowledge context
        if knowledge_enabled:
            all_knowledge_results = []
            try:
                for q in queries:
                    res = await self.rag_service.search_knowledge(query=q, limit=3)
                    all_knowledge_results.extend(res)
                    
                if all_knowledge_results:
                    knowledge_str = "\n".join([
                        f"- Doc Fragment: {r.get('metadata', {}).get('text', '')[:300]}..."
                        for r in all_knowledge_results[:5]
                    ])
                    knowledge_context_str = "\nKNOWLEDGE BASE (Information from documents):\n" + knowledge_str
                    stats.knowledge_tokens = count_tokens(knowledge_str, self.model_name)
            except Exception as e:
                logger.warning(f"RAG#1 (Knowledge) failed: {e}")

        # 3. Fetch Notion content if available
        if strategy_url and "notion.so" in strategy_url.lower():
            logger.info(f"[MetaAgentGraph] Fetching Notion content from {strategy_url}")
            notion_content = await self.external_docs_port.fetch_content(strategy_url)
            stats.notion_tokens = count_tokens(notion_content, self.model_name)
            notion_context_str = f"\nPROJECT ASSUMPTIONS (Detailed content from Notion):\n{notion_content}\n"

        rag_context = f"{notion_context_str}\n{system_context_str}\n{knowledge_context_str}".strip()
        if not rag_context:
            rag_context = "No relevant context found."
            
        return {
            "rag_context": rag_context, 
            "context_stats": stats,
            "system_entities": [
                {
                    "entity_type": r.entity_type,
                    "name": r.payload.get('name') or r.payload.get('agent_name'),
                    "visual_url": r.payload.get('agent_visual_url') or r.payload.get('visual_url')
                }
                for r in all_system_results
            ]
        }

    async def drafter_node(self, state: MetaAgentState) -> Dict[str, Any]:
        logger.info("[MetaAgentGraph] Executing Drafter Node")
        request = state["request"]
        plan = state["plan"]
        rag_context = state["rag_context"]
        canvas_state_str = self._format_canvas_state(state["canvas_state"])
        project_context_str = state.get("project_context", "No project context available.")
        errors = state.get("validation_errors", [])
        stats = state["context_stats"]
        is_out_of_scope = state.get("is_out_of_scope", False)

        if is_out_of_scope:
            return {
                "draft_response": MetaAgentProposalResponse(
                    drafts=[],
                    connections=[],
                    reasoning="I'm sorry, but I can only help you with designing AI flows, agents, and project architectures on the Axon Space Canvas. Your request falls outside of this scope.",
                    context_stats=stats
                ),
                "iteration_count": 3 # Stop here
            }

        # Handle Attachments
        attachments_str = ""
        if request.attachments:
            files_str = "\n".join([
                f"- User Attachment: {a.name} ({a.content_type})"
                for a in request.attachments
            ])
            attachments_str = "\nUSER ATTACHMENTS:\n" + files_str
            stats.attachments_tokens = count_tokens(files_str, self.model_name)
            
        error_context = ""
        if errors:
            error_context = "\nPREVIOUS VALIDATION ERRORS (YOU MUST FIX THESE):\n" + "\n".join([f"- {err}" for err in errors])
            
        prompt = f"""
{self.system_instruction}
Your task is to design a functional AI flow (Space Canvas) based on the Execution Plan and context.

User Requirement: "{request.query}"

Execution Plan:
{plan}

Context Sources:
---
PROJECT CONTEXT:
{project_context_str}

{canvas_state_str}

{rag_context}
{attachments_str}
{error_context}
---

Your Goal:
Propose a COMPLETE FLOW of entities (agents, crews). Each proposed entity must be "Studio-Ready".

ENTITY SCHEMAS & GUIDELINES:
- AGENT: A standalone intelligent unit. It requires you to set the 'agent_role_text' and 'system_instruction' fields.
- CREW: An AGGREGATOR that collects multiple agents to perform a complex task. It requires you to set 'crew_process_type', and 'agent_member_ids' (an array of agent names).
    * IMPORTANT: A Crew node MUST NOT contain the full definition of its member agents in its payload.
    * CORRECT MODELING: To create a Crew with 2 Agents, you must propose 3 SEPARATE entities (1 Crew and 2 Agents) in the 'drafts' list. The Crew entity must include the exact names of these 2 Agents in its 'agent_member_ids' root array.
    * CRITICAL: You MUST emit a SEPARATE draft entity of type 'agent' for EVERY member listed in 'agent_member_ids'. If you omit the 'agent' drafts, the system will fail.
    * NO EDGES FOR CREW MEMBERS: Do NOT create any 'connections' between the member Agents and their Crew. The relationship is defined solely by the 'agent_member_ids' aggregation.

WORKSPACE ZONES (Mandatory field 'target_workspace'):
- 'ws-discovery': For research, data gathering, discovery agents and resources.
- 'ws-design': For architecture, design, and prototyping entities.
- 'ws-delivery': For automation, execution, code generation, and delivery tasks.
- 'ws-product': For product management, backlog, and requirements.
- 'ws-growth': For marketing, growth hacking, and external outreach.

CROSS-ZONE COMMUNICATION:
- Direct connections between nodes in DIFFERENT zones are FORBIDDEN.
- Use 'isOutput: true' artifacts and 'context_requirements' for cross-zone data flow.
- Only use 'connections' in the JSON response for nodes within the SAME zone.

Instructions:
1. Follow the Execution Plan.
2. For any Crew requested, generate the Crew node AND its member Agent nodes as SEPARATE entries in the 'drafts' array, and add the exact agent names to the Crew's 'agent_member_ids' array.
3. Do NOT link member Agents to their Crew using the 'connections' array. Connections are only for sequential task execution between different standalone nodes or crews.
4. Categorize each entity into the most appropriate 'target_workspace'.
5. If the user wants to add a new entity for an existing entity on the canvas, output the new draft and add a connection where 'source_draft_name' is the existing entity's name.
6. Do not recreate agents or tools that are already listed in the CURRENT CANVAS STATE. Reuse them or reference them.
7. Each entity must have 'status' set to 'draft'.
8. Do NOT wrap in Markdown. Output raw JSON only.
"""
        model = self._get_chat_model(use_cheap_model=False).with_structured_output(MetaAgentProposalResponse, method="function_calling")
        
        try:
            draft_response = await model.ainvoke([HumanMessage(content=prompt)])
            
            # Post-process: Hydrate visual_url for existing entities
            system_entities = state.get("system_entities", [])
            for draft in draft_response.drafts:
                # Find if this draft matches an existing system entity by name
                match = next((e for e in system_entities if e["name"] == draft.name), None)
                if match and match.get("visual_url"):
                    draft.visual_url = match["visual_url"]

            # Finalize total tokens
            stats.total_tokens = (
                stats.space_canvas_tokens + 
                stats.system_awareness_tokens + 
                stats.knowledge_tokens + 
                stats.project_context_tokens + 
                stats.notion_tokens + 
                stats.attachments_tokens
            )
            draft_response.context_stats = stats
            
            return {
                "draft_response": draft_response,
                "context_stats": stats,
                "iteration_count": state["iteration_count"] + 1
            }
        except Exception as e:
            logger.error(f"Drafter Node failed: {e}")
            raise

    async def validator_node(self, state: MetaAgentState) -> Dict[str, Any]:
        logger.info("[MetaAgentGraph] Executing Validator Node")
        draft = state["draft_response"]
        canvas_state = state["canvas_state"]
        
        errors = []
        if not draft:
            return {"validation_errors": ["No draft was generated."]}
            
        # Valid zones
        valid_zones = ["ws-discovery", "ws-design", "ws-delivery", "ws-product", "ws-growth"]
        
        # Existing entities names from canvas
        existing_names = set()
        nodes = canvas_state.get("nodes", [])
        for n in nodes:
            if n.get("type") in ["agent", "crew", "tool"]:
                name = n.get("data", {}).get("label")
                if name:
                    existing_names.add(name)
                    
        # Drafted entities
        draft_names = {d.name for d in draft.drafts}
        
        # 1. Validate target workspaces
        for d in draft.drafts:
            if d.target_workspace not in valid_zones:
                errors.append(f"Entity '{d.name}' has invalid target_workspace '{d.target_workspace}'. Must be one of {valid_zones}.")
                
        # 2. Validate connections
        for conn in draft.connections:
            # Source must exist in either drafts or canvas
            if conn.source_draft_name not in draft_names and conn.source_draft_name not in existing_names:
                errors.append(f"Connection source '{conn.source_draft_name}' does not exist in drafts or on the canvas.")
            
            # Target must exist in either drafts or canvas
            if conn.target_draft_name not in draft_names and conn.target_draft_name not in existing_names:
                errors.append(f"Connection target '{conn.target_draft_name}' does not exist in drafts or on the canvas.")
                
            # Ideally we would also check cross-zone here, but since zone assignments for drafted items vs existing items can be complex,
            # we stick to basic validation for the reflex loop.
            
        if errors:
            logger.warning(f"[MetaAgentGraph] Validator found {len(errors)} errors.")
            
        return {"validation_errors": errors}

    def check_validation(self, state: MetaAgentState) -> str:
        errors = state.get("validation_errors", [])
        if errors and state["iteration_count"] < 3:
            return "drafter"
        return END

    def build_graph(self):
        workflow = StateGraph(MetaAgentState)

        workflow.add_node("planner", self.planner_node)
        workflow.add_node("retriever", self.retriever_node)
        workflow.add_node("drafter", self.drafter_node)
        workflow.add_node("validator", self.validator_node)

        workflow.set_entry_point("planner")
        workflow.add_edge("planner", "retriever")
        workflow.add_edge("retriever", "drafter")
        workflow.add_edge("drafter", "validator")
        workflow.add_conditional_edges("validator", self.check_validation)

        return workflow.compile()
