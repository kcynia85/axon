"""
T3: LangChainAdapter - LangChain integration for LLM Gateway.
Feature-flag off by default (FEATURE_LANGCHAIN_ADAPTER=False).
This is a transitional adapter for migration without Big-Bang.
"""

from typing import Any, AsyncGenerator
import warnings
import os

try:
    from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
    from langchain_core.messages import HumanMessage, SystemMessage
    LANGCHAIN_AVAILABLE = True
except ImportError:
    LANGCHAIN_AVAILABLE = False

from app.shared.domain.ports.llm_gateway import LLMGateway
from app.config import settings
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
        use_cache: bool = True,
        provider_name: str | None = None,
        api_key: str | None = None
    ) -> str:
        if not self._enabled:
            return await self._fallback.generate_content(prompt, model_name, tools, use_cache, provider_name, api_key)

        provider = (provider_name or "google").lower()
        if provider == "openai":
            from langchain_openai import ChatOpenAI
            llm = ChatOpenAI(
                model=model_name or "gpt-4o",
                api_key=api_key or os.getenv("OPENAI_API_KEY"),
                temperature=0.7
            )
        else:
            # Default to Google
            llm = ChatGoogleGenerativeAI(
                model=model_name or "gemini-2.0-flash",
                google_api_key=api_key or settings.GOOGLE_API_KEY,
                temperature=0.7,
            )
        
        messages = [HumanMessage(content=prompt)]
        response = await llm.ainvoke(messages)
        return str(response.content)

    async def generate_stream(
        self, 
        prompt: str, 
        model_name: str | None = "gemini-2.0-flash",
        tools: list[Any] | None = None,
        provider_name: str | None = None,
        api_key: str | None = None
    ) -> AsyncGenerator[str, None]:
        if not self._enabled:
            async for chunk in self._fallback.generate_stream(prompt, model_name, tools, provider_name, api_key):
                yield chunk
            return

        provider = (provider_name or "google").lower()
        if provider == "openai":
            from langchain_openai import ChatOpenAI
            llm = ChatOpenAI(
                model=model_name or "gpt-4o",
                api_key=api_key or os.getenv("OPENAI_API_KEY"),
                temperature=0.7,
                streaming=True
            )
        else:
            # Default to Google
            llm = ChatGoogleGenerativeAI(
                model=model_name or "gemini-2.0-flash",
                google_api_key=api_key or settings.GOOGLE_API_KEY,
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
        model_name: str | None = "models/text-embedding-004",
        provider_name: str | None = None,
        dimensions: int | None = None,
        api_key: str | None = None
    ) -> list[float]:
        if not self._enabled:
            return await self._fallback.get_embeddings(text, model_name, provider_name, dimensions, api_key)

        provider = (provider_name or "google").lower()
        if provider == "openai":
            from langchain_openai import OpenAIEmbeddings
            params = {
                "model": model_name or "text-embedding-3-small",
                "api_key": api_key or os.getenv("OPENAI_API_KEY")
            }
            if dimensions:
                params["dimensions"] = dimensions
            embeddings = OpenAIEmbeddings(**params)
        elif provider in ["ollama", "local"]:
            from langchain_community.embeddings import OllamaEmbeddings
            embeddings = OllamaEmbeddings(
                model=model_name or "nomic-embed-text"
            )
        else:
            # Default to Google
            from langchain_google_genai import GoogleGenerativeAIEmbeddings
            params = {
                "model": model_name or "models/text-embedding-004",
                "google_api_key": api_key or settings.GOOGLE_API_KEY
            }
            if dimensions:
                params["output_dimensionality"] = dimensions
            embeddings = GoogleGenerativeAIEmbeddings(**params)
        
        return await embeddings.aembed_query(text)


def get_llm_adapter() -> LLMGateway:
    """
    Factory function to get the appropriate LLM adapter based on feature flags.
    """
    if settings.FEATURE_LANGCHAIN_ADAPTER:
        return LangChainAdapter()
    return CurrentAdapter()
