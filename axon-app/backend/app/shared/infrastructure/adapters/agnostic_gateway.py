import httpx
import json
from typing import Any, AsyncGenerator, Optional
from app.shared.domain.ports.llm_gateway import LLMGateway
from app.modules.settings.domain.models import LLMProvider, LLMModel

class AgnosticGateway(LLMGateway):
    """
    AgnosticGateway: Implementation of LLMGateway that uses database-driven 
    configuration from LLMProvider and LLMModel instead of provider-specific hardcode.
    Purely data-driven via SSoT (Single Source of Truth).
    """

    def __init__(self, provider: LLMProvider, model: Optional[LLMModel] = None):
        self.provider = provider
        self.model = model

    def _get_nested_value(self, data: Any, path: str) -> Any:
        """Helper to get value from nested dict using dot notation like 'choices.0.message.content'"""
        if not path:
            return data
        
        parts = path.split(".")
        current = data
        
        try:
            for part in parts:
                if isinstance(current, list):
                    idx = int(part)
                    current = current[idx]
                elif isinstance(current, dict):
                    current = current.get(part)
                else:
                    return None
            return current
        except (IndexError, ValueError, KeyError, TypeError):
            return None

    def _prepare_request(self, prompt: str, tools: list[Any] | None = None) -> tuple[str, dict, dict]:
        """
        Prepares URL, Headers, and Body based on agnostic SSoT configuration.
        """
        endpoint = self.provider.provider_api_endpoint.strip().rstrip("/")
        api_key = self.provider.provider_api_key
        protocol = self.provider.protocol.lower()
        
        # 1. Base URL construction
        url = endpoint
        headers = {"Content-Type": "application/json"}
        
        # 2. Add API Key
        if api_key:
            if self.provider.api_key_placement == "query":
                url = f"{url}?key={api_key}" if "?" not in url else f"{url}&key={api_key}"
            elif self.provider.api_key_placement == "header":
                headers[self.provider.auth_header_name] = f"{self.provider.auth_header_prefix}{api_key}"

        # 3. Add Custom Headers
        if self.provider.custom_headers:
            for h in self.provider.custom_headers:
                if h.get("key") and h.get("value"):
                    headers[h["key"]] = h["value"]

        # 4. Protocol-Driven Body Construction
        body: dict = {"temperature": 0.7}
        
        if protocol == "google":
             # Google Gemini REST Style
             body["contents"] = [{"parts": [{"text": prompt}]}]
             if not url.endswith(":generateContent"):
                  model_id = self.model.model_id if self.model else "gemini-2.0-flash"
                  if f"models/{model_id}" not in url:
                       url = f"{url}/models/{model_id}:generateContent"
                  else:
                       url = f"{url}:generateContent"
        
        elif protocol == "anthropic":
             # Anthropic Style
             body["model"] = self.model.model_id if self.model else "claude-3-5-sonnet-20240620"
             body["messages"] = [{"role": "user", "content": prompt}]
             body["max_tokens"] = 1024
             # Auto-add required version header if missing
             if "anthropic-version" not in headers:
                 headers["anthropic-version"] = "2023-06-01"
             # Auto-map Authorization to x-api-key if default used
             if self.provider.auth_header_name == "Authorization" and "x-api-key" not in headers:
                 headers["x-api-key"] = api_key
                 headers.pop("Authorization", None)
        
        else:
             # OpenAI / Default / Custom Style
             body["model"] = self.model.model_id if self.model else "unknown"
             body["messages"] = [{"role": "user", "content": prompt}]

        if tools:
            body["tools"] = tools

        return url, headers, body

    async def generate_content(
        self, 
        prompt: str, 
        model_name: str | None = None, 
        tools: list[Any] | None = None,
        use_cache: bool = True
    ) -> str:
        url, headers, body = self._prepare_request(prompt, tools)
        
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(url, headers=headers, json=body)
            
            if not response.is_success:
                error_msg = self._get_nested_value(response.json(), self.provider.response_error_path)
                if not error_msg:
                    error_msg = response.text
                raise Exception(f"API Error: {error_msg}")
                
            data = response.json()
            
            # Use dynamic response mapping from provider config
            content = self._get_nested_value(data, self.provider.response_content_path)
            
            if content is not None:
                return str(content)
                
            return str(data)

    async def generate_stream(
        self, 
        prompt: str, 
        model_name: str | None = None,
        tools: list[Any] | None = None
    ) -> AsyncGenerator[str, None]:
        url, headers, body = self._prepare_request(prompt, tools)
        body["stream"] = True
        
        async with httpx.AsyncClient(timeout=60.0) as client:
            async with client.stream("POST", url, headers=headers, json=body) as response:
                response.raise_for_status()
                async for line in response.aiter_lines():
                    if line.startswith("data: "):
                        line = line[6:]
                    if not line or line == "[DONE]" or line == "{":
                        continue
                    try:
                        chunk = json.loads(line)
                        # For streaming we still use a heuristic or common paths
                        # since streaming formats differ significantly between protocols
                        content = (
                            chunk.get("choices", [{}])[0].get("delta", {}).get("content", "") or
                            chunk.get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", "") or
                            chunk.get("delta", {}).get("text", "") # Anthropic
                        )
                        if content:
                            yield content
                    except json.JSONDecodeError:
                        continue

    async def get_embeddings(
        self, 
        text: str, 
        model_name: str | None = None
    ) -> list[float]:
        raise NotImplementedError("Agnostic embeddings not yet implemented")
