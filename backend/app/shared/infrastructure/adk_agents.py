import asyncio
from typing import List, Optional, Any, Dict, Union, Callable, Awaitable
from dataclasses import dataclass, field
from backend.app.shared.infrastructure.adk import GoogleADK

# --- ADK Tool Context Pattern ---

class ActionFlags:
    def __init__(self):
        self.escalate = False

@dataclass
class ToolContext:
    """
    Context passed to tools and agents, holding shared state and control flags.
    """
    data: Dict[str, Any]
    agent_name: str = ""
    actions: ActionFlags = field(default_factory=ActionFlags)

# --- Agent Type Definition ---
AgentRunner = Callable[[ToolContext], Awaitable[Dict[str, Any]]]
AgentStreamer = Callable[[ToolContext], Any] # Async generator

# --- Helper to resolve context ---
def _resolve_context(context: Union[Dict, ToolContext]) -> Dict:
    if isinstance(context, ToolContext):
        return context.data
    return context if context else {}

def _ensure_tool_context(context: Union[Dict, ToolContext]) -> ToolContext:
    if isinstance(context, ToolContext):
        return context
    return ToolContext(data=context if context else {})

# --- Functional Agents ---

def agent(
    model: str,
    name: str,
    instruction: str,
    description: str = "",
    tools: Optional[List[Any]] = None,
    output_key: str = "output",
    include_contents: str = 'none'
) -> AgentRunner:
    """
    Creates a standard LLM agent function.
    """
    async def run(context: Union[Dict[str, Any], ToolContext] = None) -> Dict[str, Any]:
        data = _resolve_context(context)
        
        # Format Prompt
        try:
            formatted_instruction = instruction.format(**data)
        except KeyError:
            formatted_instruction = instruction
            
        user_input = data.get('user_input', '')
        full_prompt = f"{formatted_instruction}\n\nUser Request: {user_input}"

        print(f"[{name}] Running...")
        
        # Call LLM
        response_text = await GoogleADK.generate_content(
            prompt=full_prompt, 
            model_name=model,
            tools=tools
        )
        print(f"[{name}] Finished.")
        
        # Update Context
        if isinstance(context, ToolContext):
            context.data[output_key] = response_text
            context.agent_name = name
            
        return {output_key: response_text}

    # Attach metadata for introspection if needed
    run.name = name
    run.description = description
    run.output_key = output_key
    run.is_agent = True
    
    # Attach streamer (separate function logic, but attached to the runner for easy access)
    async def stream(context: Union[Dict[str, Any], ToolContext] = None):
        data = _resolve_context(context)
        formatted_instruction = instruction.format(**data)
        user_input = data.get('user_input', '')
        full_prompt = f"{formatted_instruction}\n\nUser Request: {user_input}"

        async for chunk in GoogleADK.generate_content_stream(
            prompt=full_prompt,
            model_name=model,
            tools=tools
        ):
            yield chunk
            
    run.stream = stream
    
    return run

def sequential(
    name: str,
    sub_agents: List[AgentRunner],
    description: str = "",
    output_key: str = "output"
) -> AgentRunner:
    """
    Creates a sequential execution chain.
    """
    async def run(context: Union[Dict[str, Any], ToolContext] = None) -> Dict[str, Any]:
        print(f"[{name}] Starting sequential chain...")
        ctx = _ensure_tool_context(context)

        for agent_func in sub_agents:
            # Execute sub-agent
            result = await agent_func(ctx)
            
            # Context is updated in place by the agent if it uses ToolContext
            # If plain dict was returned/used (legacy), we might need to update
            if not isinstance(context, ToolContext):
                # This branch shouldn't ideally happen with the helper
                pass 

        return ctx.data

    run.name = name
    run.description = description
    return run

def parallel(
    name: str,
    sub_agents: List[AgentRunner],
    description: str = ""
) -> AgentRunner:
    """
    Creates a parallel execution group.
    """
    async def run(context: Union[Dict[str, Any], ToolContext] = None) -> Dict[str, Any]:
        print(f"[{name}] Starting parallel execution...")
        ctx = _ensure_tool_context(context)
        
        # Snapshot data for safety in parallel
        data_snapshot = ctx.data.copy()
        
        # Create tasks. 
        # Note: We create new temporary contexts for branches to avoid race conditions on the dictionary
        tasks = []
        for agent_func in sub_agents:
            branch_ctx = ToolContext(data=data_snapshot.copy())
            tasks.append(agent_func(branch_ctx))
            
        results = await asyncio.gather(*tasks)
        
        merged_results = {}
        for res in results:
            merged_results.update(res)
            
        ctx.data.update(merged_results)
        return merged_results

    run.name = name
    run.description = description
    return run

def loop(
    name: str,
    sub_agents: List[AgentRunner],
    description: str = "",
    max_iterations: int = 3
) -> AgentRunner:
    """
    Creates a loop execution flow.
    """
    async def run(context: Union[Dict[str, Any], ToolContext] = None) -> Dict[str, Any]:
        print(f"[{name}] Starting Loop (Max: {max_iterations})...")
        ctx = _ensure_tool_context(context)

        for i in range(max_iterations):
            print(f"[{name}] Iteration {i+1}/{max_iterations}")
            
            for agent_func in sub_agents:
                await agent_func(ctx)
                
                if ctx.actions.escalate:
                    print(f"[{name}] Exit signal received. Breaking loop.")
                    return ctx.data
        
        print(f"[{name}] Max iterations reached.")
        return ctx.data

    run.name = name
    run.description = description
    return run
