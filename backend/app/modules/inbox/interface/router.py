from fastapi import APIRouter, Depends, status, HTTPException
from typing import List
from uuid import UUID

from backend.app.api.deps import get_current_user
from backend.app.shared.security.schemas import UserPayload
from backend.app.modules.inbox.application.service import InboxService
from backend.app.modules.inbox.dependencies import get_inbox_service
from backend.app.modules.inbox.application.schemas import InboxItemResponse, BulkResolveRequest

router = APIRouter(
    prefix="/inbox",
    tags=["inbox"],
    dependencies=[Depends(get_current_user)]
)

@router.get("/", response_model=List[InboxItemResponse])
async def list_inbox_items(
    user: UserPayload = Depends(get_current_user),
    service: InboxService = Depends(get_inbox_service)
):
    """List inbox items for current user."""
    return await service.list_items(user.sub)

@router.patch("/{id}", response_model=InboxItemResponse)
async def resolve_item(
    id: UUID,
    service: InboxService = Depends(get_inbox_service)
):
    """Mark an item as resolved."""
    result = await service.resolve_item(id)
    if not result:
        raise HTTPException(status_code=404, detail="Inbox item not found")
    return result

@router.post("/bulk-resolve", status_code=status.HTTP_200_OK)
async def bulk_resolve(
    request: BulkResolveRequest,
    service: InboxService = Depends(get_inbox_service)
):
    """Resolve multiple items at once."""
    count = await service.bulk_resolve(request)
    return {"resolved_count": count}
