import google.generativeai as genai
from google.api_core.exceptions import ResourceExhausted, ServiceUnavailable, InternalServerError
from typing import List, AsyncGenerator
from backend.app.config import settings

# Initialize GenAI
if settings.GOOGLE_API_KEY:
    genai.configure(api_key=settings.GOOGLE_API_KEY)

class FallbackProvider:
    """
    Mock adapter for a secondary LLM (e.g. GPT-4).
    In a real app, this would use openai/anthropic SDKs.
    """
    @staticmethod
    async def generate(prompt: str) -> str:
        return f"[FALLBACK GPT-4] Processed prompt: {prompt[:50]}..."

    @staticmethod
    async def generate_stream(prompt: str) -> AsyncGenerator[str, None]:
        yield "[FALLBACK GPT-4] "
        yield "Processed "
        yield "prompt..."

class GoogleADK:
    """
    Wrapper for Google GenAI SDK (ADK - AI Development Kit).
    Handles Embeddings and Chat Generation with Fallback Resilience.
    """
    
    @staticmethod
    async def get_embeddings(text: str, model: str = "models/text-embedding-004") -> List[float]:
        """
        Generates embeddings for the given text.
        """
        try:
            result = genai.embed_content(
                model=model,
                content=text,
                task_type="retrieval_query"
            )
            return result['embedding']
        except Exception as e:
            # Fallback for dev/test without API key or mock
            print(f"Error generating embeddings: {e}")
            return [0.0] * 768 # Mock 768 dim vector

    @staticmethod
    async def generate_content(prompt: str, model_name: str = "gemini-1.5-flash", tools: List[any] = None) -> str:
        try:
            model = genai.GenerativeModel(model_name, tools=tools)
            response = await model.generate_content_async(prompt)
            return response.text
        except (ResourceExhausted, ServiceUnavailable, InternalServerError) as e:
            print(f"Gemini API Error: {e}. Switching to Fallback Provider.")
            return await FallbackProvider.generate(prompt)
        except Exception as e:
            print(f"Unexpected Error in ADK: {e}")
            raise e

    @staticmethod
    async def generate_content_stream(prompt: str, model_name: str = "gemini-1.5-flash", tools: List[any] = None):
        """
        Generates content streaming (yields chunks).
        """
        try:
            model = genai.GenerativeModel(model_name, tools=tools)
            response = await model.generate_content_async(prompt, stream=True)
            async for chunk in response:
                if chunk.text:
                    yield chunk.text
        except (ResourceExhausted, ServiceUnavailable, InternalServerError) as e:
            print(f"Gemini API Stream Error: {e}. Switching to Fallback Provider.")
            async for chunk in FallbackProvider.generate_stream(prompt):
                yield chunk
        except Exception as e:
            print(f"Error generating stream: {e}")
            yield f"Error: {str(e)}"
