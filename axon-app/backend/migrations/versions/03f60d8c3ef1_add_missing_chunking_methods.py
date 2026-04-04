"""add missing chunking methods

Revision ID: 03f60d8c3ef1
Revises: 2b0eca135f7e
Create Date: 2026-04-04 20:02:48.243896

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '03f60d8c3ef1'
down_revision: Union[str, Sequence[str], None] = '2b0eca135f7e'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Commit existing transaction to allow ALTER TYPE ... ADD VALUE
    op.execute("COMMIT")
    op.execute("ALTER TYPE chunkingmethod ADD VALUE 'CHARACTER'")
    op.execute("ALTER TYPE chunkingmethod ADD VALUE 'MARKDOWN'")
    op.execute("ALTER TYPE chunkingmethod ADD VALUE 'HTML'")
    op.execute("ALTER TYPE chunkingmethod ADD VALUE 'LATEX'")
    op.execute("ALTER TYPE chunkingmethod ADD VALUE 'JSON'")
    op.execute("ALTER TYPE chunkingmethod ADD VALUE 'SEMANTIC'")


def downgrade() -> None:
    """Downgrade schema."""
    # Note: Removing enum values is complex in Postgres, usually involves dropping and recreating the type.
    # We leave it as pass for simplicity as this is adding new supported methods.
    pass
