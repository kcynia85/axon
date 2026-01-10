from backend.app.modules.knowledge.application.rag import RAGService
from backend.app.shared.infrastructure.database import AsyncSessionLocal
from backend.app.shared.infrastructure.adk_agents import ToolContext

async def search_knowledge_base(query: str):
    """
    Searches the internal Knowledge Base for documents and facts (Wisdom).
    Use this to find general information, guidelines, or non-structured knowledge.
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

async def get_asset(slug: str):
    """
    Retrieves a specific Asset (Template, SOP, Checklist) by its unique slug.
    Use this when you know exactly which document you need (e.g. from find_asset).
    
    Args:
        slug (str): The unique identifier of the asset (e.g., 'sop-content-audit').
    """
    print(f"[Tool Call] get_asset: {slug}")
    try:
        async with AsyncSessionLocal() as session:
            service = RAGService(session)
            asset = await service.get_asset(slug)
            
        if not asset:
            return f"Asset with slug '{slug}' not found."
            
        return f"ASSET: {asset.title}\nTYPE: {asset.type}\n\n{asset.content}"
    except Exception as e:
        return f"Error retrieving asset: {str(e)}"

async def find_asset(query: str):
    """
    Searches for structured Assets (Templates, SOPs, Checklists) using semantic search.
    Use this to discover available tools or documents before retrieving them.
    
    Returns a list of matching assets with their slugs.
    """
    print(f"[Tool Call] find_asset: {query}")
    try:
        async with AsyncSessionLocal() as session:
            service = RAGService(session)
            assets = await service.search_assets(query)
            
        if not assets:
            return "No matching assets found."
            
        formatted = f"Found {len(assets)} Assets for '{query}':\n"
        for asset in assets:
            formatted += f"- [{asset.type.upper()}] {asset.title} (slug: {asset.slug})\n"
            
        return formatted
    except Exception as e:
        return f"Error finding assets: {str(e)}"

def exit_loop(tool_context: ToolContext):
    """Call this function ONLY when the critique indicates no further changes are needed."""
    print(f"[Tool Call] exit_loop triggered by {tool_context.agent_name}")
    tool_context.actions.escalate = True
    return {}