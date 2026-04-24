from typing import Protocol, Optional

class ExternalDocumentationPort(Protocol):
    """
    Port for fetching documentation from external sources (Notion, Google Docs, etc.).
    This decouples the application from specific third-party APIs.
    """
    async def fetch_content(self, url: str) -> str:
        """Fetches the textual content of a document by its URL."""
        ...
