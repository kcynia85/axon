from typing import Dict
from uuid import UUID
from backend.app.modules.agents.domain.models import AgentConfig, ChatSession, Message
from backend.app.modules.agents.domain.enums import AgentRole, ModelTier
from backend.app.shared.utils.time import now_utc

class AgentOrchestrator:
    def __init__(self):
        # In a real scenario, these configs might be loaded from DB or files
        self._configs: Dict[AgentRole, AgentConfig] = self._load_configs()

    def _load_configs(self) -> Dict[AgentRole, AgentConfig]:
        return {
            AgentRole.MANAGER: AgentConfig(
                role=AgentRole.MANAGER,
                model_tier=ModelTier.TIER_2_EXPERT,
                tools=["delegate_task", "review_plan"],
                system_instruction_ref="prompts/manager.md"
            ),
            AgentRole.RESEARCHER: AgentConfig(
                role=AgentRole.RESEARCHER,
                model_tier=ModelTier.TIER_2_EXPERT,
                tools=["search_knowledge", "find_asset", "get_asset"],
                system_instruction_ref="prompts/researcher.md"
            ),
            AgentRole.BUILDER: AgentConfig(
                role=AgentRole.BUILDER,
                model_tier=ModelTier.TIER_2_EXPERT,
                tools=["write_code", "read_code"],
                system_instruction_ref="prompts/builder.md"
            ),
            AgentRole.WRITER: AgentConfig(
                role=AgentRole.WRITER,
                model_tier=ModelTier.TIER_2_EXPERT,
                tools=["write_markdown"],
                system_instruction_ref="prompts/writer.md"
            ),
        }

    def get_config(self, role: AgentRole) -> AgentConfig:
        return self._configs.get(role)

    async def create_session(self, project_id: UUID, agent_role: AgentRole) -> ChatSession:
        return ChatSession(project_id=project_id, agent_role=agent_role)

    async def run_turn(self, session: ChatSession, user_input: str) -> str:
        """
        Executes a single turn of conversation.
        This is a placeholder for the actual LLM interaction logic.
        """
        # 1. Append user message
        user_msg = Message(role="user", content=user_input, timestamp=now_utc())
        session.history.append(user_msg)
        session.updated_at = now_utc()

        # 2. TODO: Retrieve context (RAG)
        
        # 3. TODO: Call LLM (Google GenAI)
        
        # 4. Mock response for now
        response_content = f"Mock response from {session.agent_role} to: {user_input}"
        
        # 5. Append model message
        model_msg = Message(role="model", content=response_content, timestamp=now_utc())
        session.history.append(model_msg)
        
        return response_content
