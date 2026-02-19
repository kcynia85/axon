import pytest
from unittest.mock import AsyncMock, MagicMock
from uuid import uuid4
from datetime import datetime
from app.modules.resources.infrastructure.repo import ResourcesRepository
from app.modules.resources.domain.models import PromptArchetype, ExternalService
from app.modules.resources.infrastructure.tables import PromptArchetypeTable, ExternalServiceTable
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
async def test_create_prompt_archetype(mock_session):
    repo = ResourcesRepository(mock_session)
    archetype = PromptArchetype(
        id=uuid4(),
        archetype_name="Test Persona",
        archetype_role="Tester",
        archetype_goal="Test",
        archetype_backstory="I test things",
        workspace_domain="Global",
        created_at=now_utc(),
        updated_at=now_utc()
    )

    # Mock DB Object
    db_obj = PromptArchetypeTable(
        id=archetype.id,
        archetype_name=archetype.archetype_name,
        archetype_role=archetype.archetype_role,
        archetype_goal=archetype.archetype_goal,
        archetype_backstory=archetype.archetype_backstory,
        workspace_domain=archetype.workspace_domain,
        created_at=archetype.created_at,
        updated_at=archetype.updated_at
    )
    
    # We mock _to_domain_archetype implicitly by checking what create returns
    # But wait, create returns what _to_domain returns.
    # _to_domain reads from DB object.
    # So if we mock session.add, session.refresh, create should work if db_obj is correctly constructed in repo.
    
    # Actually, repo.create constructs the DB object.
    # We just need to ensure session.add is called.
    
    result = await repo.create_prompt_archetype(archetype)
    
    assert result.archetype_name == "Test Persona"
    mock_session.add.assert_called_once()
    mock_session.commit.assert_called_once()
    mock_session.refresh.assert_called_once()

@pytest.mark.asyncio
async def test_list_external_services(mock_session):
    repo = ResourcesRepository(mock_session)
    
    service = ExternalService(
        id=uuid4(),
        service_name="Test Service",
        service_category="Utility",
        service_url="http://test.com",
        created_at=now_utc(),
        updated_at=now_utc()
    )
    
    db_service = ExternalServiceTable(
        id=service.id,
        service_name=service.service_name,
        service_category=service.service_category,
        service_url=service.service_url,
        created_at=service.created_at,
        updated_at=service.updated_at,
        capabilities=[] # relationship
    )
    
    mock_result = MagicMock()
    mock_result.scalars.return_value.all.return_value = [db_service]
    mock_session.execute.return_value = mock_result
    
    result = await repo.list_external_services()
    
    assert len(result) == 1
    assert result[0].service_name == "Test Service"
