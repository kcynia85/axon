"""add_is_draft_to_embedding_and_chunking

Revision ID: 1bfd77cb19ae
Revises: c8409c768bdd
Create Date: 2026-04-03 23:17:18.367903

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '1bfd77cb19ae'
down_revision: Union[str, Sequence[str], None] = 'c8409c768bdd'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column('embedding_models', sa.Column('is_draft', sa.Boolean(), nullable=False, server_default='false'))
    op.add_column('chunking_strategies', sa.Column('is_draft', sa.Boolean(), nullable=False, server_default='false'))


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column('chunking_strategies', 'is_draft')
    op.drop_column('embedding_models', 'is_draft')
