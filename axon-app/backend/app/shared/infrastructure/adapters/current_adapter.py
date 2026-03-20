from typing import Any, AsyncGenerator
from app.shared.domain.ports.llm_gateway import LLMGateway
from app.shared.infrastructure.adk import GoogleADK
from app.shared.config import settings

class CurrentAdapter(LLMGateway):
    """
    T2: Current Adapter - delegates to existing Google ADK implementation.
    This is the production adapter with no behavior change.
    """

    async def generate_content(
        self, 
        prompt: str, 
        model_name: str | None = "gemini-2.0-flash", 
        tools: list[Any] | None = None,
        use_cache: bool = True
    ) -> str:
        return await GoogleADK.generate_content(
            prompt=prompt,
            model_name=model_name or "gemini-2.0-flash",
            tools=tools,
            use_cache=use_cache
        )

    async def generate_stream(
        self, 
        prompt: str, 
        model_name: str | None = "gemini-2.0-flash",
        tools: list[Any] | None = None
    ) -> AsyncGenerator[str, None]:
        async for chunk in GoogleADK.generate_content_stream(
            prompt=prompt,
            model_name=model_name or "gemini-2.0-flash",
            tools=tools
        ):
            yield chunk

    async def get_embeddings(
        self, 
        text: str, 
        model_name: str | None = "models/text-embedding-004"
    ) -> list[float]:
        return await GoogleADK.get_embeddings(
            text=text,
            model=model_name or "models/text-embedding-004"
        )
