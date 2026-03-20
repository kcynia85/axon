import pytest
from unittest.mock import AsyncMock, MagicMock
from uuid import uuid4
from datetime import datetime
from app.modules.inbox.infrastructure.repo import InboxRepository
from app.modules.inbox.domain.models import InboxItem
from app.modules.inbox.infrastructure.tables import InboxItemTable
from app.modules.inbox.domain.enums import InboxItemStatus, InboxItemType
from app.shared.utils.time import now_utc

@pytest.fixture
def mock_session():
    session = AsyncMock()
    session.add = MagicMock()
    session.execute = AsyncMock()
    session.commit = AsyncMock()
    session.refresh = AsyncMock()
    return session

@pytest.mark.asyncio
async def test_resolve_item(mock_session):
    repo = InboxRepository(mock_session)
    item_id = uuid4()
    
    # Mock update exec
    mock_session.execute.return_value = MagicMock()
    
    # Mock select result after update
    db_item = InboxItemTable(
        id=item_id,
        item_status=InboxItemStatus.RESOLVED,
        item_type=InboxItemType.ARTIFACT_READY,
        created_at=now_utc(),
        resolved_at=now_utc()
    )
    
    # We need to mock the SELECT that happens inside resolve_item
    # First execute is UPDATE, second is SELECT
    mock_result_update = MagicMock()
    mock_result_select = MagicMock()
    mock_result_select.scalar_one_or_none.return_value = db_item
    
    # side_effect for execute: first call returns update result, second returns select result
    mock_session.execute.side_effect = [mock_result_update, mock_result_select]
    
    result = await repo.resolve_item(item_id)
    
    assert result.item_status == InboxItemStatus.RESOLVED
    assert result.resolved_at is not None
    assert mock_session.commit.call_count == 1
