import asyncio
import os
import sys

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), "axon-app", "backend"))

async def test():
    from app.shared.infrastructure.adapters.langchain_adapter import get_llm_adapter
    adapter = get_llm_adapter()
    text = "Hello world, this is a test of token counting."
    count = adapter.get_token_count(text, "gpt-4o", "openai")
    print(f"Token count: {count}")

if __name__ == "__main__":
    asyncio.run(test())
