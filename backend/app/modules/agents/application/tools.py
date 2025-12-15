from backend.app.modules.knowledge.application.rag import RAGService
from backend.app.shared.infrastructure.database import AsyncSessionLocal
from backend.app.shared.infrastructure.adk_agents import ToolContext

async def search_knowledge_base(tool_context: ToolContext, query: str):
    """
    Searches the internal Knowledge Base for documents and facts.
    Use this to find information about the project, technology, or best practices.
    """
    print(f"[Tool Call] search_knowledge_base: {query}")
    try:
        async with AsyncSessionLocal() as session:
            service = RAGService(session)
            results = await service.search_knowledge(query)
            
        if not results:
            return "No relevant information found in the Knowledge Base."

        formatted = f"Search Results for '{query}':\n"
        for i, res in enumerate(results):
            # Adapt to vecs result structure (usually dict with 'metadata')
            meta = res.get('metadata', {}) if isinstance(res, dict) else getattr(res, 'metadata', {})
            source = meta.get('source', 'Unknown File')
            content = meta.get('content', '')
            formatted += f"SOURCE [{i+1}] (File: {source}):\n{content}\n---\n"
        
        return formatted
    except Exception as e:
        return f"Error searching knowledge base: {str(e)}"

def exit_loop(tool_context: ToolContext):
    """Call this function ONLY when the critique indicates no further changes are needed."""
    print(f"[Tool Call] exit_loop triggered by {tool_context.agent_name}")
    tool_context.actions.escalate = True
    return {}
