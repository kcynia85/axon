import httpx
import json
import re
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

    def _render_template(self, template: str, variables: dict[str, Any]) -> dict[str, Any]:
        """
        Renders a JSON template string by replacing {{variable}} placeholders.
        """
        rendered = template
        for key, value in variables.items():
            placeholder = f"{{{{{key}}}}}"
            if isinstance(value, (dict, list)):
                rendered = rendered.replace(f'"{placeholder}"', json.dumps(value))
                rendered = rendered.replace(placeholder, json.dumps(value))
            else:
                rendered = rendered.replace(placeholder, str(value))
        
        try:
            return json.loads(rendered)
        except json.JSONDecodeError as e:
            # Fallback to simple replacement if JSON is invalid after render
            # This helps debug template errors
            raise ValueError(f"Failed to render inference template: {str(e)}. Rendered content: {rendered}")

    def _prepare_request(self, prompt: str, tools: list[Any] | None = None) -> tuple[str, dict, dict]:
        """
        Prepares URL, Headers, and Body based on agnostic SSoT configuration.
        Zero hardcoded protocol checks for body structure.
        """
        endpoint = self.provider.provider_api_endpoint.strip().rstrip("/")
        api_key = self.provider.provider_api_key
        protocol = self.provider.protocol.lower()
        
        # 1. Base URL construction using dynamic inference_path
        inference_path = self.provider.inference_path or ""
        
        # Special logic for Google models in URL if needed, 
        # but we try to keep it in inference_path template
        if protocol == "google" and "{{model}}" in inference_path:
            model_id = self.model.model_id if self.model else "gemini-2.0-flash"
            inference_path = inference_path.replace("{{model}}", model_id)
        
        if not inference_path.startswith("/") and not inference_path.startswith(":"):
            inference_path = "/" + inference_path
            
        url = f"{endpoint}{inference_path}"
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

        # 4. Render Body from template
        variables = {
            "prompt": prompt,
            "model": self.model.model_id if self.model else "unknown",
        }
        
        template = self.provider.inference_json_template
        if not template:
            # Fallback to default OpenAI style if template missing
            template = '{"model": "{{model}}", "messages": [{"role": "user", "content": "{{prompt}}"}]}'
            
        body = self._render_template(template, variables)

        # Handle tools automatically if not in template
        if tools and "tools" not in body:
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
