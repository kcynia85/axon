import google.generativeai as genai
from typing import List
from backend.app.config import settings

# Initialize GenAI
if settings.GOOGLE_API_KEY:
    genai.configure(api_key=settings.GOOGLE_API_KEY)

class GoogleADK:
    """
    Wrapper for Google GenAI SDK (ADK - AI Development Kit).
    Handles Embeddings and Chat Generation.
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
    async def generate_content(prompt: str, model_name: str = "gemini-1.5-flash") -> str:
        model = genai.GenerativeModel(model_name)
        response = await model.generate_content_async(prompt)
        return response.text
