from typing import Any, AsyncGenerator
from app.shared.domain.ports.llm_gateway import LLMGateway
from app.shared.infrastructure.adk import GoogleADK
from app.config import settings

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
        use_cache: bool = True,
        provider_name: str | None = None,
        api_key: str | None = None
    ) -> str:
        return await GoogleADK.generate_content(
            prompt=prompt,
            model_name=model_name,
            tools=tools,
            use_cache=use_cache
        )

    async def generate_stream(
        self,
        prompt: str,
        model_name: str | None = "gemini-2.0-flash",
        tools: list[Any] | None = None,
        provider_name: str | None = None,
        api_key: str | None = None
    ) -> AsyncGenerator[str, None]:
        async for chunk in GoogleADK.generate_stream(
            prompt=prompt,
            model_name=model_name,
            tools=tools
        ):
            yield chunk

    async def get_embeddings(
        self,
        text: str,
        model_name: str | None = "models/text-embedding-004",
        provider_name: str | None = None,
        dimensions: int | None = None,
        api_key: str | None = None
    ) -> list[float]:
        return await GoogleADK.get_embeddings(text, model_name)
