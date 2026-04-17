from typing import Any, AsyncGenerator
from app.shared.domain.ports.llm_gateway import LLMGateway
from app.shared.infrastructure.adk import GoogleADK
import os

class CurrentAdapter(LLMGateway):
    """
    T2: Current Adapter - delegates to existing Google ADK implementation or OpenAI SDK.
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
        # For now, generation still defaults to Google ADK unless explicitly OpenAI
        if provider_name and provider_name.lower() == "openai":
             from openai import AsyncOpenAI
             client = AsyncOpenAI(api_key=api_key or os.getenv("OPENAI_API_KEY"))
             response = await client.chat.completions.create(
                 model=model_name or "gpt-4o",
                 messages=[{"role": "user", "content": prompt}]
             )
             return response.choices[0].message.content

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
        if provider_name and provider_name.lower() == "openai":
             from openai import AsyncOpenAI
             client = AsyncOpenAI(api_key=api_key or os.getenv("OPENAI_API_KEY"))
             stream = await client.chat.completions.create(
                 model=model_name or "gpt-4o",
                 messages=[{"role": "user", "content": prompt}],
                 stream=True
             )
             async for chunk in stream:
                 if chunk.choices[0].delta.content:
                     yield chunk.choices[0].delta.content
             return

        async for chunk in GoogleADK.generate_stream(
            prompt=prompt,
            model_name=model_name,
            tools=tools
        ):
            yield chunk

    async def get_embeddings(
        self,
        text: str,
        model_name: str | None = None,
        provider_name: str | None = None,
        dimensions: int | None = None,
        api_key: str | None = None
    ) -> list[float]:
        # Determine provider - if not specified, try to guess from model_name
        provider = (provider_name or "").lower()
        if not provider and model_name:
            if "text-embedding-3" in model_name.lower():
                provider = "openai"
            elif "text-embedding-004" in model_name.lower() or "gemini" in model_name.lower():
                provider = "google"
        
        # Default fallback to openai if still unknown (more likely in this project)
        if not provider:
            provider = "openai"
        
        if provider == "openai":
            from openai import AsyncOpenAI
            client = AsyncOpenAI(api_key=api_key or os.getenv("OPENAI_API_KEY"))
            
            params = {
                "input": text,
                "model": model_name or "text-embedding-3-small"
            }
            if dimensions:
                params["dimensions"] = dimensions
                
            response = await client.embeddings.create(**params)
            return response.data[0].embedding
            
        return await GoogleADK.get_embeddings(text, model_name or "models/text-embedding-004")
