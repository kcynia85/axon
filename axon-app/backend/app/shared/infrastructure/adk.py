import warnings
from typing import List, AsyncGenerator
from app.config import settings
import asyncio

# The google.generativeai package is imported lazily inside methods 
# to avoid FutureWarnings and unnecessary dependencies during startup.

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
        try:
            import google.generativeai as genai
            if settings.GOOGLE_API_KEY:
                genai.configure(api_key=settings.GOOGLE_API_KEY)
                
            if model and not model.startswith("models/"):
                model = f"models/{model}"
                
            result = genai.embed_content(
                model=model,
                content=text,
                task_type="retrieval_query"
            )
            return result['embedding']
        except Exception as e:
            print(f"Error generating embeddings in GoogleADK: {e}")
            return [0.0] * 768 # Mock 768 dim vector

    @staticmethod
    async def generate_content(prompt: str, model_name: str = "gemini-2.0-flash", tools: List[any] = None, use_cache: bool = True) -> str:
        from app.shared.infrastructure.semantic_cache import SemanticCache
        
        # 1. Semantic Cache Check
        embedding = None
        cache = None
        if use_cache:
            try:
                cache = SemanticCache.get_instance()
                embedding = await GoogleADK.get_embeddings(prompt)
                cached_response = await asyncio.to_thread(cache.search, embedding)
                if cached_response:
                    return cached_response
            except Exception:
                pass

        # 2. LLM Generation
        try:
            import google.generativeai as genai
            from google.generativeai import protos
            if settings.GOOGLE_API_KEY:
                genai.configure(api_key=settings.GOOGLE_API_KEY)

            model = genai.GenerativeModel(model_name, tools=tools)
            chat = model.start_chat()
            
            async def execute_tool(func_call):
                name = func_call.name
                args = dict(func_call.args)
                tool_func = next((t for t in tools if t.__name__ == name), None)
                if not tool_func: return f"Error: Tool '{name}' not found."
                try:
                    return await tool_func(**args) if asyncio.iscoroutinefunction(tool_func) else tool_func(**args)
                except Exception as e: return f"Error executing tool '{name}': {str(e)}"

            response = await chat.send_message_async(prompt)
            
            max_turns = 5
            for _ in range(max_turns):
                if not response.parts: break
                part = response.parts[0]
                if part.function_call:
                    result = await execute_tool(part.function_call)
                    response = await chat.send_message_async(
                        protos.Part(
                            function_response=protos.FunctionResponse(
                                name=part.function_call.name,
                                response={"result": result}
                            )
                        )
                    )
                else: break
            
            response_text = response.text
            
            # 3. Cache Update
            if use_cache and cache and embedding and response_text:
                try:
                    await asyncio.to_thread(cache.store, embedding, prompt, response_text)
                except Exception: pass
            
            return response_text
            
        except Exception as e:
            print(f"Gemini API Error: {e}. Switching to Fallback Provider.")
            return await FallbackProvider.generate(prompt)

    @staticmethod
    async def generate_content_stream(prompt: str, model_name: str = "gemini-2.0-flash", tools: List[any] = None):
        try:
            import google.generativeai as genai
            if settings.GOOGLE_API_KEY:
                genai.configure(api_key=settings.GOOGLE_API_KEY)
                
            model = genai.GenerativeModel(model_name, tools=tools)
            
            if tools:
                 chat = model.start_chat(enable_automatic_function_calling=True)
                 response = await chat.send_message_async(prompt, stream=True)
            else:
                 response = await model.generate_content_async(prompt, stream=True)
                 
            async for chunk in response:
                if chunk.text: yield chunk.text
                    
        except Exception as e:
            print(f"Gemini API Stream Error: {e}. Switching to Fallback Provider.")
            async for chunk in FallbackProvider.generate_stream(prompt):
                yield chunk
