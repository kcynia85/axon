"""add_metadata_to_crews

Revision ID: 2103b78eae2f
Revises: e743c61acaa7
Create Date: 2026-03-16 21:09:36.730274

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '2103b78eae2f'
down_revision: Union[str, Sequence[str], None] = 'e743c61acaa7'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    from sqlalchemy.dialects import postgresql
    op.add_column('crews', sa.Column('metadata', postgresql.JSONB(astext_type=sa.Text()), nullable=False, server_default='{}'))


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column('crews', 'metadata')
