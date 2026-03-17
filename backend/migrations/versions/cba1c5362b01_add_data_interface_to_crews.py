"""add_data_interface_to_crews

Revision ID: cba1c5362b01
Revises: 2103b78eae2f
Create Date: 2026-03-16 21:15:36.730274

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'cba1c5362b01'
down_revision: Union[str, Sequence[str], None] = '2103b78eae2f'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    from sqlalchemy.dialects import postgresql
    op.add_column('crews', sa.Column('data_interface', postgresql.JSONB(astext_type=sa.Text()), nullable=False, server_default='{"context": [], "artefacts": []}'))


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column('crews', 'data_interface')

