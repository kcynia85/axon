import inngest
from backend.app.shared.infrastructure.inngest_client import inngest_client
from backend.app.shared.infrastructure.adk import GoogleADK
from backend.app.modules.agents.application.context_composer import ContextComposer
from backend.app.config import settings

# Prompts (Copied/Adapted from Orchestrator)
CRITIC_INSTRUCTION = """
Analyze the **Current Document**.
If it is perfect, return ONLY: "DOCUMENT_IS_PERFECT".
Otherwise, provide constructive **Critique/Suggestions**.

GLOBAL CONTEXT: {global_context}

**Current Document:**
{current_document}
"""

REFINER_INSTRUCTION = """
You are a Creative Writing Assistant.
**Current Document:** {current_document}
**Critique:** {criticism}
GLOBAL CONTEXT: {global_context}

Task:
Rewrite the document to fix issues based on the critique. 
Output ONLY the refined text.
"""

@inngest_client.create_function(
    fn_id="agent-writer-loop",
    trigger=inngest.TriggerEvent(event="agent/turn.requested"),
)
async def writer_workflow(ctx: inngest.Context, step: inngest.Step):
    """
    Durable Workflow for the Writer Agent.
    Implements a Critic-Refiner Loop.
    """
    event = ctx.event
    user_input = event.data["user_input"]
    project_id = event.data["project_id"]
    agent_role = event.data.get("agent_role") # Should be WRITER

    if agent_role != "WRITER":
        return {"status": "skipped", "reason": "Role not handled"}

    # 1. Build Context
    # We re-instantiate ContextComposer here or allow it to be stateless
    composer = ContextComposer()
    global_context = await step.run("build_context", lambda: composer.build_context(project_id))

    # 2. Initialize Loop State
    current_document = user_input
    max_iterations = 3
    
    # 3. Execution Loop
    for i in range(max_iterations):
        
        # Step A: Critic
        def critic_call():
            prompt = CRITIC_INSTRUCTION.format(
                global_context=global_context,
                current_document=current_document
            )
            return GoogleADK.generate_content(prompt, model_name="gemini-1.5-flash", use_cache=True)

        critique = await step.run(f"critic_turn_{i+1}", critic_call)
        
        # Check Exit Condition
        if "DOCUMENT_IS_PERFECT" in critique:
            break
            
        # Step B: Refiner
        def refiner_call():
            prompt = REFINER_INSTRUCTION.format(
                global_context=global_context,
                current_document=current_document,
                criticism=critique
            )
            return GoogleADK.generate_content(prompt, model_name="gemini-1.5-flash", use_cache=True)

        current_document = await step.run(f"refiner_turn_{i+1}", refiner_call)

    # 4. Finalize
    # In a real app, we would save the Artifact to the DB here or send a notification.
    # For now, we return it as the function result.
    return {
        "final_document": current_document,
        "iterations": i + 1
    }
