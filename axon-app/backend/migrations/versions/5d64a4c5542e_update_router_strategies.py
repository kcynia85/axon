"""update_router_strategies

Revision ID: 5d64a4c5542e
Revises: 84e1220e1e8e
Create Date: 2026-03-28 19:35:39.487364

"""
from typing import Sequence, Union

from alembic import op


# revision identifiers, used by Alembic.
revision: str = '5d64a4c5542e'
down_revision: Union[str, Sequence[str], None] = '84e1220e1e8e'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Add new values to routerstrategy enum
    # Note: ALTER TYPE ... ADD VALUE cannot run inside a transaction block in some PG versions
    # but Alembic's execute usually handles this if configured correctly or using autocommit.
    op.execute("ALTER TYPE routerstrategy ADD VALUE 'FALLBACK'")
    op.execute("ALTER TYPE routerstrategy ADD VALUE 'LOAD_BALANCER'")


def downgrade() -> None:
    """Downgrade schema."""
    # Downgrading enums in PG is hard (requires deleting and recreating)
    # For now, we leave the values as they don't hurt existing data.
    pass
