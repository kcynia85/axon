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
        """
        Generates a fallback response when the primary provider fails.
        
        Args:
            prompt (str): The input prompt.
            
        Returns:
            str: The fallback response text.
        """
        return f"[FALLBACK GPT-4] Processed prompt: {prompt[:50]}..."

    @staticmethod
    async def generate_stream(prompt: str) -> AsyncGenerator[str, None]:
        """
        Generates a streaming fallback response.
        
        Args:
            prompt (str): The input prompt.
            
        Yields:
            str: Chunks of the fallback response.
        """
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
        
        Args:
            text (str): The input text to embed.
            model (str): The embedding model to use. Defaults to "models/text-embedding-004".
            
        Returns:
            List[float]: A list of floats representing the embedding vector.
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
        """
        Generates content using the specified Gemini model.
        
        Handles common API errors (Rate Limit, Server Error) by switching to the FallbackProvider.
        
        Args:
            prompt (str): The input prompt.
            model_name (str): The model version to use. Defaults to "gemini-1.5-flash".
            tools (List[any], optional): A list of tools available to the model.
            
        Returns:
            str: The generated response text.
        """
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
        
        Handles common API errors by yielding from the FallbackProvider.
        
        Args:
            prompt (str): The input prompt.
            model_name (str): The model version.
            tools (List[any], optional): List of tools.
            
        Yields:
            str: Text chunks from the model response.
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
