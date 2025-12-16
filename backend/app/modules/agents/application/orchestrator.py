import json
from uuid import UUID
from backend.app.modules.agents.domain.models import ChatSession, Message
from backend.app.modules.agents.domain.enums import AgentRole
from backend.app.shared.security.guardrails import SecurityGuard
from backend.app.shared.utils.time import now_utc
import inngest
from backend.app.shared.infrastructure.inngest_client import inngest_client

class AgentOrchestrator:
    def __init__(self):
        self._security_guard = SecurityGuard()

    async def create_session(self, project_id: UUID, agent_role: AgentRole) -> ChatSession:
        return ChatSession(project_id=project_id, agent_role=agent_role)

    async def run_turn_stream(self, session: ChatSession, user_input: str):
        """
        Executes a turn by offloading to a Durable Workflow (Inngest).
        """
        # 1. Update History
        user_msg = Message(role="user", content=user_input, timestamp=now_utc())
        session.history.append(user_msg)
        session.updated_at = now_utc()
        
        # 2. Security Check
        safety_check = self._security_guard.check_input_safety(user_input)
        if not safety_check["is_safe"]:
            error_msg = f"Security Alert: Request blocked. {safety_check['reasons']}"
            yield json.dumps({"type": "error", "content": error_msg})
            
            session.history.append(Message(role="system", content=error_msg, timestamp=now_utc()))
            return

        # 3. Sanitize
        clean_input = self._security_guard.preprocess_input(user_input)
        
        # 4. Offload to Inngest
        try:
            await inngest_client.send(
                inngest.Event(
                    name="agent/turn.requested",
                    data={
                        "user_input": clean_input,
                        "project_id": str(session.project_id),
                        "agent_role": str(session.agent_role)
                    }
                )
            )
            
            # 5. Notify User
            msg = f"{session.agent_role.value} Agent has started a background workflow. Check Inbox for results."
            yield json.dumps({"type": "token", "content": msg})
            
            # Save system message
            model_msg = Message(role="model", content=msg, timestamp=now_utc())
            session.history.append(model_msg)
            
        except Exception as e:
            err_msg = f"Failed to start workflow: {e}"
            yield json.dumps({"type": "error", "content": err_msg})
