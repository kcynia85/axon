import pytest
from unittest.mock import MagicMock, patch
from backend.app.shared.infrastructure.semantic_cache import SemanticCache

@pytest.mark.asyncio
async def test_semantic_cache_singleton():
    with patch('backend.app.shared.infrastructure.semantic_cache.get_vecs_client') as mock_vecs, \
         patch('backend.app.shared.infrastructure.semantic_cache.create_engine') as mock_engine:
        # Reset instance
        SemanticCache._instance = None
        
        c1 = SemanticCache.get_instance()
        c2 = SemanticCache.get_instance()
        
        assert c1 is c2
        assert mock_vecs.called
        assert mock_engine.called

@pytest.mark.asyncio
async def test_store_cache():
    with patch('backend.app.shared.infrastructure.semantic_cache.get_vecs_client') as mock_vecs, \
         patch('backend.app.shared.infrastructure.semantic_cache.create_engine'):
        SemanticCache._instance = None
        mock_collection = MagicMock()
        mock_vecs.return_value.get_or_create_collection.return_value = mock_collection
        
        cache = SemanticCache.get_instance()
        
        # Test Store
        cache.store(
            embedding=[0.1]*768, 
            query_text="Hello", 
            response_text="Hi there"
        )
        
        mock_collection.upsert.assert_called_once()
        # Check records
        records = mock_collection.upsert.call_args[1].get('records') or mock_collection.upsert.call_args[0][0]
        assert len(records) == 1
        assert records[0][1] == [0.1]*768
        assert records[0][2]['query'] == "Hello"
        assert records[0][2]['response'] == "Hi there"

@pytest.mark.asyncio
async def test_search_cache_miss():
    with patch('backend.app.shared.infrastructure.semantic_cache.get_vecs_client'), \
         patch('backend.app.shared.infrastructure.semantic_cache.create_engine') as mock_engine:
        SemanticCache._instance = None
        
        # Mock Engine & Connection
        mock_conn = MagicMock()
        mock_engine.return_value.connect.return_value.__enter__.return_value = mock_conn
        
        # Mock Execute Result (Empty/None)
        mock_result = MagicMock()
        mock_result.fetchone.return_value = None
        mock_conn.execute.return_value = mock_result
        
        cache = SemanticCache.get_instance()
        result = cache.search([0.1]*768)
        
        assert result is None
        mock_conn.execute.assert_called_once()

@pytest.mark.asyncio
async def test_search_cache_hit():
    with patch('backend.app.shared.infrastructure.semantic_cache.get_vecs_client'), \
         patch('backend.app.shared.infrastructure.semantic_cache.create_engine') as mock_engine:
        SemanticCache._instance = None
        
        # Mock Engine & Connection
        mock_conn = MagicMock()
        mock_engine.return_value.connect.return_value.__enter__.return_value = mock_conn
        
        # Mock Execute Result (Hit)
        mock_result = MagicMock()
        mock_row = MagicMock()
        mock_row.metadata = {"response": "Cached Response", "query": "Hello"}
        mock_result.fetchone.return_value = mock_row
        mock_conn.execute.return_value = mock_result
        
        cache = SemanticCache.get_instance()
        result = cache.search([0.1]*768)
        
        assert result == "Cached Response"