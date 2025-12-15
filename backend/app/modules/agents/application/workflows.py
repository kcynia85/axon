import inngest
from backend.app.shared.infrastructure.inngest_client import inngest_client
from backend.app.shared.infrastructure.adk import GoogleADK
from backend.app.modules.agents.application.context_composer import ContextComposer
from backend.app.modules.agents.application.definitions import get_agent_definition, CRITIC_INSTRUCTION, REFINER_INSTRUCTION
from backend.app.modules.agents.domain.enums import AgentRole

@inngest_client.create_function(
    fn_id="agent-writer-loop",
    trigger=inngest.TriggerEvent(event="agent/turn.requested", expression="event.data.agent_role == 'AgentRole.WRITER'"),
)
async def writer_workflow(ctx: inngest.Context, step: inngest.Step):
    """
    Durable Workflow for the Writer Agent (Loop Pattern).
    """
    event = ctx.event
    user_input = event.data["user_input"]
    project_id = event.data["project_id"]

    # 1. Build Context
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

    return {
        "final_document": current_document,
        "iterations": i + 1
    }

@inngest_client.create_function(
    fn_id="agent-generic-turn",
    trigger=inngest.TriggerEvent(event="agent/turn.requested", expression="event.data.agent_role != 'AgentRole.WRITER'"),
)
async def generic_agent_workflow(ctx: inngest.Context, step: inngest.Step):
    """
    Generic Durable Workflow for Standard Agents (Researcher, Builder, Manager).
    """
    event = ctx.event
    user_input = event.data["user_input"]
    project_id = event.data["project_id"]
    agent_role_str = event.data.get("agent_role")
    
    # Convert string back to Enum (removing 'AgentRole.' prefix if present)
    role_str = agent_role_str.replace("AgentRole.", "") if agent_role_str else "MANAGER"
    agent_role = AgentRole(role_str)
    
    definition = get_agent_definition(agent_role)

    # 1. Build Context
    composer = ContextComposer()
    global_context = await step.run("build_context", lambda: composer.build_context(project_id))

    # 2. Format Prompt
    # Note: definition.instruction expects {global_context} and {user_input}
    # We might need to handle formatting safely
    try:
        formatted_prompt = definition.instruction.format(
            global_context=global_context,
            user_input=user_input
        )
    except KeyError:
        # Fallback if format keys differ
        formatted_prompt = f"{definition.instruction}\n\nContext: {global_context}\n\nRequest: {user_input}"

    # 3. Generate
    def run_agent():
        return GoogleADK.generate_content(
            prompt=formatted_prompt, 
            model_name=definition.model, 
            tools=definition.tools,
            use_cache=True
        )

    response = await step.run("agent_generation", run_agent)
    
    return {
        "output": response,
        "role": agent_role.value
    }
