from typing import Protocol, AsyncGenerator, Any, Optional
from abc import abstractmethod

class LLMGateway(Protocol):
    """
    Port (Interface) for interacting with Large Language Models.
    Abstracts provider-specific logic (Google, OpenAI, Anthropic).
    """

    @abstractmethod
    async def generate_content(
        self, 
        prompt: str, 
        model_name: str | None = None, 
        tools: list[Any] | None = None,
        use_cache: bool = True,
        provider_name: str | None = None,
        api_key: str | None = None
    ) -> str:
        """
        Generates a complete text response for the given prompt.
        """
        ...

    @abstractmethod
    async def generate_stream(
        self, 
        prompt: str, 
        model_name: str | None = None,
        tools: list[Any] | None = None,
        provider_name: str | None = None,
        api_key: str | None = None
    ) -> AsyncGenerator[str, None]:
        """
        Generates a streaming text response (yielding chunks).
        """
        ...

    @abstractmethod
    async def get_embeddings(
        self, 
        text: str, 
        model_name: str | None = None,
        provider_name: str | None = None,
        dimensions: int | None = None,
        api_key: str | None = None
    ) -> list[float]:
        """
        Generates vector embeddings for the given text.
        """
        ...
