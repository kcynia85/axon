"""add_owner_id_to_spaces

Revision ID: ce605a459f10
Revises: 04e09cf04e85
Create Date: 2026-02-17 22:01:33.632194

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'ce605a459f10'
down_revision: Union[str, Sequence[str], None] = '04e09cf04e85'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # 1. Add owner_id
    op.add_column('spaces', sa.Column('owner_id', sa.UUID(), nullable=False))

    # 2. Enable RLS
    tables = [
        'spaces', 
        'space_nodes', 
        'space_zones', 
        'node_edges', 
        'execution_logs', 
        'canvas_chat_sessions'
    ]
    for table in tables:
        op.execute(f"ALTER TABLE {table} ENABLE ROW LEVEL SECURITY")

    # 3. Add Policies
    # spaces
    op.execute("""
        CREATE POLICY "Users can only access their own spaces"
        ON spaces FOR ALL
        USING (auth.uid() = owner_id)
        WITH CHECK (auth.uid() = owner_id);
    """)

    # space_nodes, space_zones, node_edges (direct link to space)
    for table in ['space_nodes', 'space_zones', 'node_edges']:
        op.execute(f"""
            CREATE POLICY "Users can access {table} of their spaces"
            ON {table} FOR ALL
            USING (space_id IN (SELECT id FROM spaces WHERE owner_id = auth.uid()))
            WITH CHECK (space_id IN (SELECT id FROM spaces WHERE owner_id = auth.uid()));
        """)

    # execution_logs, canvas_chat_sessions (linked via node)
    for table in ['execution_logs', 'canvas_chat_sessions']:
        op.execute(f"""
            CREATE POLICY "Users can access {table} of their space nodes"
            ON {table} FOR ALL
            USING (
                canvas_node_id IN (
                    SELECT sn.id FROM space_nodes sn 
                    JOIN spaces s ON s.id = sn.space_id 
                    WHERE s.owner_id = auth.uid()
                )
            );
        """)


def downgrade() -> None:
    """Downgrade schema."""
    tables = [
        'spaces', 
        'space_nodes', 
        'space_zones', 
        'node_edges', 
        'execution_logs', 
        'canvas_chat_sessions'
    ]
    for table in tables:
        op.execute(f"DROP POLICY IF EXISTS \"Users can only access their own spaces\" ON {table}")
        op.execute(f"DROP POLICY IF EXISTS \"Users can access {table} of their spaces\" ON {table}")
        op.execute(f"DROP POLICY IF EXISTS \"Users can access {table} of their space nodes\" ON {table}")
        op.execute(f"ALTER TABLE {table} DISABLE ROW LEVEL SECURITY")
        
    op.drop_column('spaces', 'owner_id')
