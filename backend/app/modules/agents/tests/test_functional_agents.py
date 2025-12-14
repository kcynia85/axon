import pytest
from unittest.mock import AsyncMock, patch
from backend.app.shared.infrastructure.adk_agents import agent, sequential, loop, ToolContext

@pytest.mark.asyncio
async def test_simple_agent():
    # Mock ADK
    with patch("backend.app.shared.infrastructure.adk.GoogleADK.generate_content", new_callable=AsyncMock) as mock_gen:
        mock_gen.return_value = "Hello World"
        
        # Define agent
        hello_agent = agent(
            model="mock-model",
            name="hello_agent",
            instruction="Say hello to {name}",
            output_key="greeting"
        )
        
        # Run
        context = {"name": "Tester"}
        result = await hello_agent(context) # Using functional call
        
        # Verify
        assert result["greeting"] == "Hello World"
        # Check prompt formatting
        assert "Say hello to Tester" in mock_gen.call_args[1]['prompt']

@pytest.mark.asyncio
async def test_sequential_chain():
    with patch("backend.app.shared.infrastructure.adk.GoogleADK.generate_content", new_callable=AsyncMock) as mock_gen:
        # Setup mock responses for sequence
        mock_gen.side_effect = ["Data A", "Report based on Data A"]
        
        # Agent 1: Finder
        finder = agent(
            model="mock", 
            name="finder", 
            instruction="Find data", 
            output_key="data"
        )
        
        # Agent 2: Writer
        writer = agent(
            model="mock", 
            name="writer", 
            instruction="Write report using {data}", 
            output_key="report"
        )
        
        # Chain
        chain = sequential(name="chain", sub_agents=[finder, writer])
        
        # Run
        result = await chain({})
        
        # Verify Context Flow
        assert result["data"] == "Data A"
        assert result["report"] == "Report based on Data A"
        assert mock_gen.call_count == 2
        
        # Verify second call used output from first
        second_call_prompt = mock_gen.call_args_list[1][1]['prompt']
        assert "Write report using Data A" in second_call_prompt

@pytest.mark.asyncio
async def test_loop_agent_exit():
    with patch("backend.app.shared.infrastructure.adk.GoogleADK.generate_content", new_callable=AsyncMock) as mock_gen:
        # Mock responses: 
        # 1. Critic says "Bad"
        # 2. Refiner says "Better"
        # 3. Critic says "Perfect"
        # 4. Refiner calls ADK one last time (returns "Final"), then checks critique and exits
        mock_gen.side_effect = ["Bad", "Better", "Perfect", "Final"]
        
        # Define Tool to Exit
        def exit_tool(ctx: ToolContext):
            ctx.actions.escalate = True
            return {}

        # Critic
        critic = agent(
            model="mock", name="critic", 
            instruction="Critique {doc}", output_key="critique"
        )
        
        # Refiner (Simulating logic where it calls exit if critic is 'Perfect')
        # Since we mock ADK, we inject the logic into the test flow via a side-effect or wrapper,
        # OR we assume the agent function handles logic.
        # But `agent()` function is simple. 
        # Let's wrap the refiner behavior to simulate "Thinking" and calling tool manually for test.
        
        async def smart_refiner(ctx: ToolContext):
            # Run standard generation
            res = await agent("mock", "refiner", "Fix {doc}", output_key="doc")(ctx)
            
            # Simulate "If critique is Perfect, exit" logic which usually happens inside LLM + Tool use
            if ctx.data.get("critique") == "Perfect":
                exit_tool(ctx)
            
            return res

        # Loop
        flow = loop(name="loop", sub_agents=[critic, smart_refiner], max_iterations=5)
        
        # Run
        initial_ctx = ToolContext(data={"doc": "Draft v1"})
        result = await flow(initial_ctx)
        
        # Verify
        # Iteration 1: Critic "Bad", Refiner "Better"
        # Iteration 2: Critic "Perfect", Refiner "Final" -> Triggers exit
        
        assert mock_gen.call_count == 4
        assert initial_ctx.actions.escalate is True
