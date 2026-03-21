"""add tool_status to internal_tools

Revision ID: 1a822cd4cf18
Revises: e85730662031
Create Date: 2026-03-21 19:52:20.176753

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '1a822cd4cf18'
down_revision: Union[str, Sequence[str], None] = 'e85730662031'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column('internal_tools', sa.Column('tool_status', sa.String(), nullable=False, server_default='draft'))


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column('internal_tools', 'tool_status')
