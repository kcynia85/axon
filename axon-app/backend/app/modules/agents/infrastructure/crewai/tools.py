import asyncio
import importlib
import logging
from typing import List, Any, Type, Optional, Dict
from langchain.tools import BaseTool, tool
from pydantic import BaseModel, Field

from app.modules.knowledge.application.rag import RAGService
from app.shared.infrastructure.database import AsyncSessionLocal

logger = logging.getLogger(__name__)

class SearchKnowledgeInput(BaseModel):
    query: str = Field(description="The semantic search query to find information in the Knowledge Base.")

class SearchKnowledgeTool(BaseTool):
    name: str = "search_knowledge"
    description: str = "Searches the internal Knowledge Base for documents, facts, and project-specific wisdom."
    args_schema: Type[BaseModel] = SearchKnowledgeInput

    def _run(self, query: str):
        """Use the tool synchronously."""
        try:
            loop = asyncio.get_event_loop()
        except RuntimeError:
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            
        if loop.is_running():
            # If loop is already running (e.g. in FastAPI request), we need to use a thread or handle it carefully
            # For simplicity in many AI frameworks, we might just use a separate thread for the RAG call
            import threading
            from concurrent.futures import ThreadPoolExecutor
            with ThreadPoolExecutor() as executor:
                future = executor.submit(lambda: asyncio.run(self._arun(query)))
                return future.result()
        else:
            return loop.run_until_complete(self._arun(query))

    async def _arun(self, query: str):
        """Use the tool asynchronously."""
        try:
            async with AsyncSessionLocal() as session:
                service = RAGService(session)
                results = await service.search_knowledge(query, limit=5)
                
            if not results:
                return "No relevant information found in the Knowledge Base."

            formatted = f"Search Results for '{query}':\n"
            for i, res in enumerate(results):
                meta = res.get('metadata', {}) if isinstance(res, dict) else getattr(res, 'metadata', {})
                source = meta.get('file_name') or meta.get('source', 'Unknown')
                content = meta.get('text') or meta.get('content', '')
                formatted += f"SOURCE [{i+1}] ({source}):\n{content}\n---\n"
            return formatted
        except Exception as e:
            return f"Error searching knowledge base: {str(e)}"

# Registry of native built-in tools
NATIVE_TOOL_REGISTRY = {
    "search_knowledge": SearchKnowledgeTool(),
}

def _load_custom_tool_from_codebase(tool_id: str) -> Optional[Any]:
    """
    Attempts to dynamically load a custom tool from app.tools package.
    These tools are usually synced via axon-tools CLI.
    """
    try:
        # 1. Search for the tool in app.tools
        # Usually tool_id corresponds to the function name
        # We need to find which module contains this function
        import pkgutil
        import app.tools as tools_pkg
        
        for _, module_name, _ in pkgutil.iter_modules(tools_pkg.__path__):
            module = importlib.import_module(f"app.tools.{module_name}")
            importlib.reload(module)
            
            if hasattr(module, tool_id):
                func = getattr(module, tool_id)
                if hasattr(func, "is_crewai_tool") and func.is_crewai_tool:
                    logger.info(f"Dynamically loaded custom tool: {tool_id} from {module_name}")
                    
                    # Ensure it's wrapped as a CrewAI-compatible tool
                    # If it's already a function from app/tools, it has our metadata
                    # We can use CrewAI's tool decorator if needed, or wrap it in a BaseTool
                    from crewai.tools import tool as crewai_tool
                    return crewai_tool(func)
                    
        return None
    except Exception as e:
        logger.error(f"Failed to dynamically load custom tool {tool_id}: {e}")
        return None

def resolve_crewai_tools(tool_ids: List[str]) -> List[Any]:
    """
    Resolves Axon tool IDs into CrewAI/Langchain compatible tool objects.
    Combines NATIVE tools and CUSTOM tools (synced from axon-tools).
    """
    resolved = []
    for tid in tool_ids:
        # 1. Check native tools
        if tid in NATIVE_TOOL_REGISTRY:
            resolved.append(NATIVE_TOOL_REGISTRY[tid])
            continue
            
        # 2. Check custom tools in app.tools
        custom_tool = _load_custom_tool_from_codebase(tid)
        if custom_tool:
            resolved.append(custom_tool)
            continue
            
        logger.warning(f"Tool with ID '{tid}' could not be resolved.")
        
    return resolved
