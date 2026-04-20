"""add_system_embeddings_table

Revision ID: 7799779ca73a
Revises: f2e43187e1b5
Create Date: 2026-04-20 18:03:04.556897

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql
from pgvector.sqlalchemy import Vector

# revision identifiers, used by Alembic.
revision: str = '7799779ca73a'
down_revision: Union[str, Sequence[str], None] = 'f2e43187e1b5'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Ensure vector extension exists
    op.execute('CREATE EXTENSION IF NOT EXISTS vector')

    op.create_table('system_embeddings',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('entity_id', sa.UUID(), nullable=False),
        sa.Column('entity_type', sa.String(), nullable=False),
        sa.Column('embedding', Vector(768), nullable=False),
        sa.Column('payload', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column('metadata_', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    
    op.create_index('ix_system_embeddings_entity', 'system_embeddings', ['entity_type', 'entity_id'], unique=False)


def downgrade() -> None:
    op.drop_index('ix_system_embeddings_entity', table_name='system_embeddings')
    op.drop_table('system_embeddings')

