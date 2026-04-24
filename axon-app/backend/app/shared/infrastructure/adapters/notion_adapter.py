import httpx
import logging
import re
from typing import Optional, List, Dict, Any
from app.config import settings
from app.shared.domain.ports.external_docs import ExternalDocumentationPort

logger = logging.getLogger(__name__)

class NotionAdapter(ExternalDocumentationPort):
    """
    Adapter for Notion API that implements the ExternalDocumentationPort.
    Provides recursive block fetching to retrieve full page content including toggles.
    """
    def __init__(self, token: Optional[str] = None):
        self.token = token or settings.NOTION_TOKEN
        self.base_url = "https://api.notion.com/v1"
        self.headers = {
            "Authorization": f"Bearer {self.token}",
            "Notion-Version": "2022-06-28", # Stable version
            "Content-Type": "application/json"
        }

    def _extract_page_id(self, url: str) -> Optional[str]:
        # Extract 32-char hex ID from various Notion URL formats
        normalized = url.split("?")[0].split("/")[-1].replace("-", "")
        match = re.search(r"([0-9a-f]{32})$", normalized)
        if match:
            return match.group(1)
        match = re.search(r"([0-9a-f]{32})", normalized)
        return match.group(1) if match else None

    async def fetch_content(self, url: str) -> str:
        """Implements the Port interface using Notion's Block API."""
        if not self.token:
            logger.warning("Notion token not configured. Skipping content fetch.")
            return f"(Content hidden: Notion token missing for URL {url})"

        page_id = self._extract_page_id(url)
        if not page_id:
            logger.warning(f"Could not extract Notion Page ID from URL: {url}")
            return f"(Error: Invalid Notion URL {url})"

        try:
            async with httpx.AsyncClient() as client:
                return await self._fetch_blocks_recursive(client, page_id)
        except Exception as e:
            logger.error(f"Failed to fetch Notion content for {url}: {e}")
            return f"(Error fetching Notion content: {str(e)})"

    async def _fetch_blocks_recursive(self, client: httpx.AsyncClient, block_id: str, depth: int = 0) -> str:
        """Recursively fetches blocks and their children (for toggles, columns, etc.)"""
        if depth > 5: # Safety limit for recursion
            return ""

        blocks_url = f"{self.base_url}/blocks/{block_id}/children"
        response = await client.get(blocks_url, headers=self.headers)
        response.raise_for_status()
        
        data = response.json()
        results = data.get("results", [])
        
        content_parts = []
        for block in results:
            block_type = block.get("type")
            has_children = block.get("has_children", False)
            
            # Extract text from current block
            text_val = ""
            if block_type in ["paragraph", "heading_1", "heading_2", "heading_3", "bulleted_list_item", "numbered_list_item", "quote", "to_do", "toggle", "callout"]:
                rich_text = block.get(block_type, {}).get("rich_text", [])
                text_val = "".join([t.get("plain_text", "") for t in rich_text])
                if text_val:
                    prefix = "  " * depth
                    if block_type == "toggle":
                        content_parts.append(f"{prefix}▶ {text_val}")
                    elif "heading" in block_type:
                        content_parts.append(f"\n{prefix}{text_val.upper()}")
                    else:
                        content_parts.append(f"{prefix}{text_val}")

            # Recursively fetch children if they exist
            if has_children:
                child_content = await self._fetch_blocks_recursive(client, block.get("id"), depth + 1)
                if child_content:
                    content_parts.append(child_content)
        
        return "\n".join(content_parts)

def get_external_docs_adapter() -> ExternalDocumentationPort:
    """Factory function for documentation adapters."""
    return NotionAdapter()

