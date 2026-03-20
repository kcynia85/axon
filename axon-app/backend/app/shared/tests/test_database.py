import pytest
from unittest.mock import AsyncMock, patch
from app.shared.infrastructure.database import get_db

@pytest.mark.asyncio
async def test_get_db_yields_session():
    """Test that get_db yields a session and handles the context manager correctly."""
    
    mock_session = AsyncMock()
    # Mock the __aenter__ and __aexit__ for the async context manager
    mock_session.__aenter__.return_value = mock_session
    mock_session.__aexit__.return_value = None

    # Patch the AsyncSessionLocal in database.py
    with patch("backend.app.shared.infrastructure.database.AsyncSessionLocal", return_value=mock_session):
        async for session in get_db():
            assert session == mock_session
        
        # Verify that the session context manager was entered and exited
        mock_session.__aenter__.assert_called_once()
        mock_session.__aexit__.assert_called_once()
