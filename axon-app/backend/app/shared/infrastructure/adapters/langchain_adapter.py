"""
T3: LangChainAdapter - LangChain integration for LLM Gateway.
Feature-flag off by default (FEATURE_LANGCHAIN_ADAPTER=False).
This is a transitional adapter for migration without Big-Bang.
"""

from typing import Any, AsyncGenerator
import warnings

try:
    from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
    from langchain_core.messages import HumanMessage, SystemMessage
    LANGCHAIN_AVAILABLE = True
except ImportError:
    LANGCHAIN_AVAILABLE = False

from app.shared.domain.ports.llm_gateway import LLMGateway
from app.shared.config import settings
from app.shared.infrastructure.adapters.current_adapter import CurrentAdapter


class LangChainAdapter(LLMGateway):
    """
    T3: LangChainAdapter - uses LangChain for LLM operations.
    Falls back to CurrentAdapter if feature flag is off or LangChain unavailable.
    """

    def __init__(self):
        self._fallback = CurrentAdapter()
        self._enabled = settings.FEATURE_LANGCHAIN_ADAPTER and LANGCHAIN_AVAILABLE
        
        if settings.FEATURE_LANGCHAIN_ADAPTER and not LANGCHAIN_AVAILABLE:
            warnings.warn(
                "FEATURE_LANGCHAIN_ADAPTER is enabled but LangChain is not installed. "
                "Falling back to CurrentAdapter.",
                RuntimeWarning
            )

    async def generate_content(
        self, 
        prompt: str, 
        model_name: str | None = "gemini-2.0-flash", 
        tools: list[Any] | None = None,
        use_cache: bool = True
    ) -> str:
        if not self._enabled:
            return await self._fallback.generate_content(prompt, model_name, tools, use_cache)

        # LangChain implementation
        llm = ChatGoogleGenerativeAI(
            model=model_name or "gemini-2.0-flash",
            google_api_key=settings.GOOGLE_API_KEY,
            temperature=0.7,
        )
        
        messages = [HumanMessage(content=prompt)]
        response = await llm.ainvoke(messages)
        return str(response.content)

    async def generate_stream(
        self, 
        prompt: str, 
        model_name: str | None = "gemini-2.0-flash",
        tools: list[Any] | None = None
    ) -> AsyncGenerator[str, None]:
        if not self._enabled:
            async for chunk in self._fallback.generate_stream(prompt, model_name, tools):
                yield chunk
            return

        # LangChain streaming implementation
        llm = ChatGoogleGenerativeAI(
            model=model_name or "gemini-2.0-flash",
            google_api_key=settings.GOOGLE_API_KEY,
            temperature=0.7,
            streaming=True
        )
        
        messages = [HumanMessage(content=prompt)]
        async for chunk in llm.astream(messages):
            if chunk.content:
                yield str(chunk.content)

    async def get_embeddings(
        self, 
        text: str, 
        model_name: str | None = "models/text-embedding-004"
    ) -> list[float]:
        if not self._enabled:
            return await self._fallback.get_embeddings(text, model_name)

        # LangChain embeddings implementation
        embeddings = GoogleGenerativeAIEmbeddings(
            model=model_name or "models/text-embedding-004",
            google_api_key=settings.GOOGLE_API_KEY
        )
        
        return await embeddings.aembed_query(text)


def get_llm_adapter() -> LLMGateway:
    """
    Factory function to get the appropriate LLM adapter based on feature flags.
    """
    if settings.FEATURE_LANGCHAIN_ADAPTER:
        return LangChainAdapter()
    return CurrentAdapter()
