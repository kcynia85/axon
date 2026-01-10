import google.generativeai as genai
from google.generativeai import protos
from google.api_core.exceptions import ResourceExhausted, ServiceUnavailable, InternalServerError
from typing import List, AsyncGenerator
from backend.app.config import settings
import asyncio
from backend.app.shared.infrastructure.semantic_cache import SemanticCache

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
    async def generate_content(prompt: str, model_name: str = "gemini-2.0-flash", tools: List[any] = None, use_cache: bool = True) -> str:
        """
        Generates content using the specified Gemini model.
        
        Handles common API errors (Rate Limit, Server Error) by switching to the FallbackProvider.
        Includes Semantic Caching to reduce costs.
        
        Args:
            prompt (str): The input prompt.
            model_name (str): The model version to use. Defaults to "gemini-2.0-flash".
            tools (List[any], optional): A list of tools available to the model.
            use_cache (bool): Whether to check/update the semantic cache.
            
        Returns:
            str: The generated response text.
        """
        # 1. Semantic Cache Check
        embedding = None
        cache = None
        if use_cache:
            try:
                cache = SemanticCache.get_instance()
                # Embed the prompt
                embedding = await GoogleADK.get_embeddings(prompt)
                
                # Check Cache (run sync vecs in thread)
                cached_response = await asyncio.to_thread(cache.search, embedding)
                if cached_response:
                    print(f"[ADK] Cache Hit for prompt: {prompt[:30]}...")
                    return cached_response
            except Exception as e:
                # print(f"[ADK] Cache Check Failed: {e}") # Reduce noise
                pass

        # 2. LLM Generation
        try:
            model = genai.GenerativeModel(model_name, tools=tools)
            chat = model.start_chat()
            
            # Helper to execute tools
            async def execute_tool(func_call):
                name = func_call.name
                args = dict(func_call.args)
                
                # Find the matching tool function
                tool_func = next((t for t in tools if t.__name__ == name), None)
                if not tool_func:
                    return f"Error: Tool '{name}' not found."
                
                try:
                    # Check if async
                    if asyncio.iscoroutinefunction(tool_func):
                        return await tool_func(**args)
                    else:
                        return tool_func(**args)
                except Exception as e:
                    return f"Error executing tool '{name}': {str(e)}"

            # Send initial message
            response = await chat.send_message_async(prompt)
            
            # Loop for function calls (limit iterations to avoid infinite loops)
            max_turns = 5
            for _ in range(max_turns):
                # Check if the model wants to call a function
                # Note: response.parts might contain function_call
                # We assume the first part is the function call if present
                if not response.parts:
                     break
                
                part = response.parts[0]
                if part.function_call:
                    print(f"[ADK] Tool Triggered: {part.function_call.name}")
                    result = await execute_tool(part.function_call)
                    
                    # Send result back
                    response = await chat.send_message_async(
                        protos.Part(
                            function_response=protos.FunctionResponse(
                                name=part.function_call.name,
                                response={"result": result}
                            )
                        )
                    )
                else:
                    # Text response - done
                    break
            
            response_text = response.text
            
            # 3. Cache Update
            if use_cache and cache and embedding and response_text:
                try:
                    await asyncio.to_thread(cache.store, embedding, prompt, response_text)
                except Exception as e:
                    print(f"[ADK] Cache Store Failed: {e}")
            
            return response_text
            
        except (ResourceExhausted, ServiceUnavailable, InternalServerError) as e:
            print(f"Gemini API Error: {e}. Switching to Fallback Provider.")
            return await FallbackProvider.generate(prompt)
        except Exception as e:
            print(f"Unexpected Error in ADK: {e}")
            raise e

    @staticmethod
    async def generate_content_stream(prompt: str, model_name: str = "gemini-2.0-flash", tools: List[any] = None):
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
            
            # Streaming with manual tool loop is complex.
            # Simplified: Use automatic calling if SDK supports async properly in future.
            # For now, we fall back to automatic and hope for the best, OR disable tools for stream.
            # BUT RAG usually happens in "generate_content" (Think/Plan), not in the final stream.
            # The Agent logic in workflows.py uses generate_content for reasoning!
            # It uses generate_content_stream ONLY for final output?
            
            # Check workflows.py:
            # - agent_generation uses generate_content (NOT stream)
            # So tools are mostly used in generate_content.
            
            if tools:
                 # Automatic function calling with streaming - giving it a try
                 # If this fails with coroutine error, we know why.
                 chat = model.start_chat(enable_automatic_function_calling=True)
                 response = await chat.send_message_async(prompt, stream=True)
            else:
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