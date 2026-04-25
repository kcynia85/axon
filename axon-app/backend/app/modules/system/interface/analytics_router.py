from fastapi import APIRouter, Depends, Query
from typing import List, Dict, Any, Optional
from app.modules.system.infrastructure.token_usage_repo import TokenUsageRepository
from app.modules.system.dependencies import get_token_usage_repo

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/token-usage")
async def get_token_usage(
    category: Optional[str] = Query(None, description="Filter by category: meta-agent, knowledge, awareness"),
    model_name: Optional[str] = Query(None, description="Filter by model name"),
    days: int = Query(7, description="Number of days to retrieve data for"),
    repo: TokenUsageRepository = Depends(get_token_usage_repo)
):
    """
    Returns aggregated token usage statistics for charts.
    """
    return await repo.get_usage_stats(category=category, model_name=model_name, days=days)

@router.get("/models")
async def get_available_models(
    repo: TokenUsageRepository = Depends(get_token_usage_repo)
):
    """
    Returns a list of unique model names found in the logs.
    """
    return await repo.list_available_models()

@router.get("/summary")
async def get_token_summary(
    repo: TokenUsageRepository = Depends(get_token_usage_repo)
):
    """
    Returns total token consumption and cost summary.
    """
    summary = await repo.get_total_usage()
    return summary
