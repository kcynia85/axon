import pytest
from unittest.mock import AsyncMock, MagicMock
from uuid import uuid4
from datetime import datetime
from app.modules.settings.infrastructure.repo import SettingsRepository
from app.modules.settings.domain.models import LLMProvider
from app.modules.settings.infrastructure.tables import LLMProviderTable
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
async def test_create_llm_provider(mock_session):
    repo = SettingsRepository(mock_session)
    provider = LLMProvider(
        id=uuid4(),
        provider_name="OpenAI",
        provider_api_key_required=True,
        provider_api_endpoint="https://api.openai.com/v1",
        created_at=now_utc(),
        updated_at=now_utc()
    )

    result = await repo.create_llm_provider(provider)
    
    assert result.provider_name == "OpenAI"
    mock_session.add.assert_called_once()
    mock_session.commit.assert_called_once()
    mock_session.refresh.assert_called_once()

@pytest.mark.asyncio
async def test_list_llm_providers(mock_session):
    repo = SettingsRepository(mock_session)
    
    provider = LLMProvider(
        id=uuid4(),
        provider_name="Anthropic",
        provider_api_key_required=True,
        created_at=now_utc(),
        updated_at=now_utc()
    )
    
    db_provider = LLMProviderTable(
        id=provider.id,
        provider_name=provider.provider_name,
        provider_api_key_required=provider.provider_api_key_required,
        created_at=provider.created_at,
        updated_at=provider.updated_at,
        models=[]
    )
    
    mock_result = MagicMock()
    mock_result.scalars.return_value.all.return_value = [db_provider]
    mock_session.execute.return_value = mock_result
    
    result = await repo.list_llm_providers()
    
    assert len(result) == 1
    assert result[0].provider_name == "Anthropic"
