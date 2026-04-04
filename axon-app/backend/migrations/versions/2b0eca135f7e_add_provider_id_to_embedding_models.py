"""add_provider_id_to_embedding_models

Revision ID: 2b0eca135f7e
Revises: 1bfd77cb19ae
Create Date: 2026-04-03 23:45:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '2b0eca135f7e'
down_revision: Union[str, Sequence[str], None] = '1bfd77cb19ae'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column('embedding_models', sa.Column('provider_id', postgresql.UUID(as_uuid=True), nullable=True))


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column('embedding_models', 'provider_id')
