import pytest
from unittest.mock import AsyncMock, MagicMock
from uuid import uuid4
from datetime import datetime
from backend.app.modules.projects.infrastructure.repo import ProjectRepository
from backend.app.modules.projects.domain.models import Project
from backend.app.modules.projects.infrastructure.tables import ProjectTable
from backend.app.modules.projects.domain.enums import HubType, Status

@pytest.fixture
def mock_session():
    session = AsyncMock()
    session.add = MagicMock()
    return session

@pytest.fixture
def sample_project_data():
    return {
        "id": uuid4(),
        "name": "Test Project",
        "description": "Test Description",
        "domain": HubType.PRODUCT,
        "status": Status.IN_PROGRESS,
        "owner_id": uuid4(),
        "created_at": datetime.now(),
        "updated_at": datetime.now(),
        "artifacts": []
    }
@pytest.mark.asyncio
async def test_create_project(mock_session, sample_project_data):
    repo = ProjectRepository(mock_session)
    project_in = Project(**sample_project_data)

    # Setup mock behavior
    mock_session.refresh = AsyncMock()
    
    result = await repo.create(project_in)
    
    assert result.name == project_in.name
    mock_session.add.assert_called_once()
    mock_session.commit.assert_called_once()
    mock_session.refresh.assert_called_once()

@pytest.mark.asyncio
async def test_get_project_found(mock_session, sample_project_data):
    repo = ProjectRepository(mock_session)
    project_id = sample_project_data["id"]
    
    # Mock DB Object - We simulate the Table object behavior
    # Since ProjectTable is a SQLAlchemy model, we can instantiate it, 
    # but for pure unit test we can also just use a SimpleNamespace or Mock if we want to avoid SA overhead,
    # but instantiating the Table class is better to catch init issues.
    # However, we need to be careful if Table has relationships that might trigger lazy loads.
    # Here we exclude artifacts for the simple init.
    db_project = ProjectTable(**{k: v for k, v in sample_project_data.items() if k != 'artifacts'})
    
    # Mock execute result
    mock_result = MagicMock()
    mock_result.scalar_one_or_none.return_value = db_project
    mock_session.execute.return_value = mock_result
    
    result = await repo.get(project_id)
    
    assert result is not None
    assert result.id == project_id
    assert result.name == sample_project_data["name"]

@pytest.mark.asyncio
async def test_get_project_not_found(mock_session):
    repo = ProjectRepository(mock_session)
    
    mock_result = MagicMock()
    mock_result.scalar_one_or_none.return_value = None
    mock_session.execute.return_value = mock_result
    
    result = await repo.get(uuid4())
    
    assert result is None

@pytest.mark.asyncio
async def test_list_by_user(mock_session, sample_project_data):
    repo = ProjectRepository(mock_session)
    user_id = sample_project_data["owner_id"]
    
    db_project = ProjectTable(**{k: v for k, v in sample_project_data.items() if k != 'artifacts'})
    
    mock_result = MagicMock()
    mock_result.scalars.return_value.all.return_value = [db_project]
    mock_session.execute.return_value = mock_result
    
    result = await repo.list_by_user(user_id)
    
    assert len(result) == 1
    assert result[0].owner_id == user_id
