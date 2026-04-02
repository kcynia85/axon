import httpx
from typing import Dict, Any, Optional

class PricingScraper:
    """
    Mechanism to scrape/fetch unified pricing data for various LLM providers (including OpenAI, Anthropic, etc.).
    Uses the widely maintained LiteLLM pricing JSON as a reliable source since official pricing pages 
    are often dynamic SPA apps that block standard scrapers.
    """
    
    PRICING_URL = "https://raw.githubusercontent.com/BerriAI/litellm/main/model_prices_and_context_window.json"
    
    _cache: Dict[str, Any] = {}
    _last_fetched: float = 0
    CACHE_TTL_SECONDS = 3600 * 24  # 24 hours
    
    @classmethod
    async def get_pricing_data(cls) -> Dict[str, Any]:
        import time
        now = time.time()
        
        # Return cached data if valid
        if cls._cache and (now - cls._last_fetched) < cls.CACHE_TTL_SECONDS:
            return cls._cache
            
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(cls.PRICING_URL)
                response.raise_for_status()
                data = response.json()
                
                # Cache the new data
                cls._cache = data
                cls._last_fetched = now
                return data
        except Exception as e:
            print(f"Error scraping pricing data: {e}")
            return cls._cache # Return stale cache if request fails, or empty dict
            
    @classmethod
    async def get_model_pricing(cls, model_id: str) -> Optional[Dict[str, float]]:
        """
        Returns pricing per 1M tokens.
        Input and Output costs are mapped from per-token or per-1M-token formats.
        """
        data = await cls.get_pricing_data()
        
        # Try direct match
        model_data = data.get(model_id)
        
        # Try without provider prefix (e.g. if 'openai/gpt-4' is passed but litellm has 'gpt-4')
        if not model_data and "/" in model_id:
            model_data = data.get(model_id.split("/", 1)[1])
            
        if not model_data:
            return None
            
        # LiteLLM JSON stores pricing usually as 'input_cost_per_token' and 'output_cost_per_token'
        input_cost_per_token = model_data.get("input_cost_per_token", 0.0)
        output_cost_per_token = model_data.get("output_cost_per_token", 0.0)
        
        if isinstance(input_cost_per_token, (int, float)) and isinstance(output_cost_per_token, (int, float)):
            return {
                "pricing_input": input_cost_per_token * 1_000_000,
                "pricing_output": output_cost_per_token * 1_000_000
            }
            
        return None
