import pytest
from unittest.mock import AsyncMock, MagicMock, patch
from backend.app.modules.knowledge.application.rag import RAGService
from backend.app.modules.knowledge.domain.models import Asset

@pytest.mark.asyncio
async def test_get_asset():
    mock_session = AsyncMock()
    
    # Patch get_vecs_client to avoid real DB connection in KnowledgeVectorStore init
    with patch('backend.app.modules.knowledge.infrastructure.repo.get_vecs_client') as mock_vecs:
        service = RAGService(mock_session)
        
        # Mock Repo response
        mock_asset = Asset(
            title="Test Asset",
            slug="test-asset",
            content="Content",
            type="template",
            domain="coding"
        )
        service.asset_repo.get_by_slug = AsyncMock(return_value=mock_asset)
        
        result = await service.get_asset("test-asset")
        assert result.slug == "test-asset"
        assert result.title == "Test Asset"

@pytest.mark.asyncio
async def test_search_knowledge():
    mock_session = AsyncMock()
    
    # Patch GoogleADK and get_vecs_client
    with patch('backend.app.shared.infrastructure.adk.GoogleADK.get_embeddings', new_callable=AsyncMock) as mock_embed, \
         patch('backend.app.modules.knowledge.infrastructure.repo.get_vecs_client') as mock_vecs:
        
        mock_embed.return_value = [0.1] * 768
        mock_collection = MagicMock()
        mock_vecs.return_value.get_or_create_collection.return_value = mock_collection
        
        service = RAGService(mock_session)
        # Mock the search method on the vector store instance
        service.vector_store.search = MagicMock(return_value=[{"id": 1, "text": "Result"}])
        
        results = await service.search_knowledge("query")
        
        assert len(results) == 1
        assert results[0]["text"] == "Result"
        mock_embed.assert_called_once_with("query")
