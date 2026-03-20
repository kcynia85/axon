"""
T6: KE/Embedding Migration Warning
Warns about embedding model changes without forced reindex.
"""

import warnings
from typing import Optional
from dataclasses import dataclass
from app.shared.infrastructure.database import AsyncSessionLocal
from app.modules.settings.infrastructure.repo import SettingsRepository


@dataclass
class EmbeddingMigrationWarning:
    """Warning details for embedding model migration."""
    old_model_id: str
    new_model_id: str
    dimensions_changed: bool
    old_dimensions: int
    new_dimensions: int
    affected_hubs: list[str]
    estimated_reindex_time: str
    can_rollback: bool


class EmbeddingMigrationService:
    """
    T6: Service for handling embedding model changes.
    Provides warnings but does NOT force reindex.
    """

    @staticmethod
    async def check_migration_impact(
        old_model_id: str,
        new_model_id: str
    ) -> EmbeddingMigrationWarning:
        """
        Analyze impact of changing embedding model.
        Returns warning info without executing migration.
        """
        # Mock data - replace with actual model lookup
        model_info = {
            "text-embedding-004": {"dimensions": 768},
            "text-embedding-3-large": {"dimensions": 3072},
            "text-embedding-3-small": {"dimensions": 1536},
        }
        
        old_info = model_info.get(old_model_id, {"dimensions": 768})
        new_info = model_info.get(new_model_id, {"dimensions": 768})
        
        dimensions_changed = old_info["dimensions"] != new_info["dimensions"]
        
        # Count affected knowledge hubs (mock)
        async with AsyncSessionLocal() as session:
            # In real implementation: query hubs using old model
            affected_hubs = ["hub-1", "hub-2", "hub-3"]  # Mock
        
        # Estimate reindex time based on affected sources
        estimated_time = "~2 hours" if len(affected_hubs) > 5 else "~30 minutes"
        
        return EmbeddingMigrationWarning(
            old_model_id=old_model_id,
            new_model_id=new_model_id,
            dimensions_changed=dimensions_changed,
            old_dimensions=old_info["dimensions"],
            new_dimensions=new_info["dimensions"],
            affected_hubs=affected_hubs,
            estimated_reindex_time=estimated_time,
            can_rollback=True
        )

    @staticmethod
    def emit_warning(warning: EmbeddingMigrationWarning) -> None:
        """
        Emit user-visible warning about embedding change.
        Does NOT block or force reindex.
        """
        message = f"""
⚠️  EMBEDDING MODEL CHANGE WARNING

You are changing the embedding model from '{warning.old_model_id}' to '{warning.new_model_id}'.

Impact Analysis:
- Dimensions: {warning.old_dimensions} → {warning.new_dimensions} {'(CHANGED!)' if warning.dimensions_changed else '(same)'}
- Affected Knowledge Hubs: {len(warning.affected_hubs)}
- Estimated reindex time: {warning.estimated_reindex_time}
- Rollback available: {'Yes' if warning.can_rollback else 'No'}

⚠️  WARNING: Knowledge sources will need to be reindexed for search to work correctly.
   Existing vectors will remain but may produce degraded results until reindexed.

RECOMMENDED ACTIONS:
1. Schedule reindex during low-traffic period
2. Test search quality after partial reindex
3. Rollback if search quality degrades

This change has been saved. Reindex is NOT automatic - run manually when ready.
        """
        
        warnings.warn(message, UserWarning, stacklevel=2)

    @staticmethod
    async def save_model_change_with_warning(
        settings_repo: SettingsRepository,
        new_model_id: str
    ) -> EmbeddingMigrationWarning:
        """
        Save new embedding model with warning.
        Does NOT trigger automatic reindex.
        """
        # Get current model (mock - would query from DB)
        current_model_id = "text-embedding-004"  # Would come from DB
        
        # Analyze impact
        warning = await EmbeddingMigrationService.check_migration_impact(
            old_model_id=current_model_id,
            new_model_id=new_model_id
        )
        
        # Save the change
        await settings_repo.update_embedding_model(new_model_id)
        
        # Emit warning (non-blocking)
        EmbeddingMigrationService.emit_warning(warning)
        
        return warning
