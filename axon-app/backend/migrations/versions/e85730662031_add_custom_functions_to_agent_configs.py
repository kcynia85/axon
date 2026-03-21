"""add custom_functions to agent_configs

Revision ID: e85730662031
Revises: aa77e006ec11
Create Date: 2026-03-21 19:00:53.938274

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = 'e85730662031'
down_revision: Union[str, Sequence[str], None] = 'aa77e006ec11'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column('agent_configs', sa.Column('custom_functions', postgresql.ARRAY(sa.String()), nullable=False, server_default='{}'))


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column('agent_configs', 'custom_functions')
