from uuid import UUID, uuid4
from datetime import datetime
from typing import List, Dict, Any, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.modules.system.infrastructure.tables import TokenUsageLogTable
from app.shared.utils.time import now_utc

class TokenUsageRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def log_usage(
        self,
        model_name: str,
        category: str,
        tokens_count: int,
        space_id: Optional[UUID] = None,
        metadata: Optional[Dict[str, Any]] = None
    ) -> None:
        """Logs a single token usage entry."""
        log_entry = TokenUsageLogTable(
            id=uuid4(),
            timestamp=now_utc(),
            model_name=model_name,
            category=category,
            tokens_count=tokens_count,
            space_id=space_id,
            metadata_=metadata
        )
        self.session.add(log_entry)
        await self.session.commit()

    async def get_usage_stats(
        self,
        category: Optional[str] = None,
        model_name: Optional[str] = None,
        days: int = 7
    ) -> List[Dict[str, Any]]:
        """Retrieves aggregated token usage stats per day."""
        # Simple aggregation by date
        # PostgreSQL specific date truncation
        date_trunc = func.date_trunc('day', TokenUsageLogTable.timestamp)
        
        stmt = select(
            date_trunc.label('date'),
            func.sum(TokenUsageLogTable.tokens_count).label('total_tokens')
        )
        
        if category:
            stmt = stmt.where(TokenUsageLogTable.category == category)
        if model_name:
            stmt = stmt.where(TokenUsageLogTable.model_name == model_name)
            
        stmt = stmt.group_by(date_trunc).order_by(date_trunc)
        
        result = await self.session.execute(stmt)
        rows = result.all()
        
        return [
            {
                "date": row.date.isoformat(),
                "tokens": int(row.total_tokens)
            }
            for row in rows
        ]

    async def list_available_models(self) -> List[str]:
        """Lists all models that have logged usage."""
        stmt = select(TokenUsageLogTable.model_name).distinct()
        result = await self.session.execute(stmt)
        return [row[0] for row in result.all()]

    async def get_total_usage(self) -> Dict[str, Any]:
        """Retrieves total sum of tokens used and estimated cost in PLN."""
        # 1. Get total tokens
        stmt_tokens = select(func.sum(TokenUsageLogTable.tokens_count))
        total_tokens = (await self.session.execute(stmt_tokens)).scalar() or 0

        # 2. Estimate cost
        # Fetch pricing for all models
        from app.modules.settings.infrastructure.tables import LLMModelTable
        stmt_pricing = select(LLMModelTable.model_id, LLMModelTable.model_pricing_config)
        pricing_rows = (await self.session.execute(stmt_pricing)).all()
        
        pricing_map = {}
        for row in pricing_rows:
            # model_pricing_config usually {input: X, output: Y} per 1M tokens
            config = row.model_pricing_config or {}
            # Use average if both available, otherwise use what's there
            input_price = config.get("input", 0)
            output_price = config.get("output", 0)
            avg_price = (input_price + output_price) / 2 if (input_price and output_price) else (input_price or output_price or 0)
            pricing_map[row.model_id] = avg_price

        # Aggregate tokens per model
        stmt_by_model = select(
            TokenUsageLogTable.model_name,
            func.sum(TokenUsageLogTable.tokens_count).label("count")
        ).group_by(TokenUsageLogTable.model_name)
        
        model_usage = (await self.session.execute(stmt_by_model)).all()
        
        total_cost_usd = 0.0
        for m in model_usage:
            # Try to match model name (handle simple 'gpt-4o' vs 'openai/gpt-4o' if needed)
            m_name = m.model_name
            price = pricing_map.get(m_name, 0.5) # Default 0.5$ per 1M if unknown
            total_cost_usd += (m.count / 1_000_000.0) * price

        usd_to_pln = 4.10 # Hardcoded for now
        total_cost_pln = total_cost_usd * usd_to_pln

        return {
            "total_tokens": total_tokens,
            "total_cost_pln": round(total_cost_pln, 2)
        }
