"""add_token_usage_logs_table

Revision ID: ce62f135733a
Revises: 454c0a8b3f89
Create Date: 2026-04-24 23:17:26.776421

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = 'ce62f135733a'
down_revision: Union[str, Sequence[str], None] = '454c0a8b3f89'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table('token_usage_logs',
    sa.Column('id', sa.UUID(), nullable=False),
    sa.Column('timestamp', sa.DateTime(timezone=True), nullable=True),
    sa.Column('model_name', sa.String(), nullable=False),
    sa.Column('category', sa.String(), nullable=False),
    sa.Column('tokens_count', sa.Integer(), nullable=False),
    sa.Column('space_id', sa.UUID(), nullable=True),
    sa.Column('metadata_', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_token_usage_logs_category'), 'token_usage_logs', ['category'], unique=False)
    op.create_index(op.f('ix_token_usage_logs_model_name'), 'token_usage_logs', ['model_name'], unique=False)
    op.create_index(op.f('ix_token_usage_logs_timestamp'), 'token_usage_logs', ['timestamp'], unique=False)


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_index(op.f('ix_token_usage_logs_timestamp'), table_name='token_usage_logs')
    op.drop_index(op.f('ix_token_usage_logs_model_name'), table_name='token_usage_logs')
    op.drop_index(op.f('ix_token_usage_logs_category'), table_name='token_usage_logs')
    op.drop_table('token_usage_logs')
