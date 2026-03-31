"""add_deleted_at_to_settings_tables

Revision ID: f8a2b3c4d5e6
Revises: e9a1b2c3d4e5
Create Date: 2026-03-31 11:00:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = 'f8a2b3c4d5e6'
down_revision: Union[str, Sequence[str], None] = 'e9a1b2c3d4e5'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add deleted_at column to settings tables
    tables = [
        'llm_providers',
        'llm_models',
        'llm_routers',
        'embedding_models',
        'chunking_strategies',
        'vector_databases'
    ]
    
    for table in tables:
        op.add_column(table, sa.Column('deleted_at', sa.DateTime(timezone=True), nullable=True))


def downgrade() -> None:
    tables = [
        'llm_providers',
        'llm_models',
        'llm_routers',
        'embedding_models',
        'chunking_strategies',
        'vector_databases'
    ]
    
    for table in tables:
        op.drop_column(table, 'deleted_at')
