"""add_template_inputs_outputs

Revision ID: a1b2c3d4e5f6
Revises: 41eb441988ec
Create Date: 2026-02-24 14:13:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision: str = 'a1b2c3d4e5f6'
down_revision: Union[str, Sequence[str], None] = '41eb441988ec'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Add template_inputs and template_outputs columns to templates table."""
    op.add_column('templates', sa.Column(
        'template_inputs',
        postgresql.JSONB(astext_type=sa.Text()),
        nullable=False,
        server_default='[]'
    ))
    op.add_column('templates', sa.Column(
        'template_outputs',
        postgresql.JSONB(astext_type=sa.Text()),
        nullable=False,
        server_default='[]'
    ))


def downgrade() -> None:
    """Remove template_inputs and template_outputs columns."""
    op.drop_column('templates', 'template_outputs')
    op.drop_column('templates', 'template_inputs')
