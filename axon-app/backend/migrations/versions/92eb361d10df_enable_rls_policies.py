"""enable_rls_policies

Revision ID: 92eb361d10df
Revises: da0ef98d7a99
Create Date: 2025-12-16 22:33:16.062211

"""
from typing import Sequence, Union

from alembic import op


# revision identifiers, used by Alembic.
revision: str = '92eb361d10df'
down_revision: Union[str, Sequence[str], None] = 'da0ef98d7a99'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # 1. Projects (Base Table)
    op.execute("ALTER TABLE projects ENABLE ROW LEVEL SECURITY")
    op.execute("""
        CREATE POLICY "Users can only see their own projects"
        ON projects
        FOR ALL
        USING (auth.uid() = owner_id)
        WITH CHECK (auth.uid() = owner_id);
    """)

    # 2. Artifacts (Linked to Project)
    op.execute("ALTER TABLE artifacts ENABLE ROW LEVEL SECURITY")
    op.execute("""
        CREATE POLICY "Users can access artifacts of their projects"
        ON artifacts
        FOR ALL
        USING (
            project_id IN (
                SELECT id FROM projects WHERE owner_id = auth.uid()
            )
        )
        WITH CHECK (
            project_id IN (
                SELECT id FROM projects WHERE owner_id = auth.uid()
            )
        );
    """)

    # 3. Chat Sessions (Linked to Project)
    op.execute("ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY")
    op.execute("""
        CREATE POLICY "Users can access chats of their projects"
        ON chat_sessions
        FOR ALL
        USING (
            project_id IN (
                SELECT id FROM projects WHERE owner_id = auth.uid()
            )
        )
        WITH CHECK (
            project_id IN (
                SELECT id FROM projects WHERE owner_id = auth.uid()
            )
        );
    """)

    # 4. Agent Logs (Linked to Chat Session)
    op.execute("ALTER TABLE agent_logs ENABLE ROW LEVEL SECURITY")
    op.execute("""
        CREATE POLICY "Users can access logs of their chats"
        ON agent_logs
        FOR ALL
        USING (
            session_id IN (
                SELECT cs.id FROM chat_sessions cs
                JOIN projects p ON p.id = cs.project_id
                WHERE p.owner_id = auth.uid()
            )
        );
    """)
    # Note: agent_logs are usually append-only by system, but if user reads them via API, RLS applies.


def downgrade() -> None:
    """Downgrade schema."""
    op.execute("DROP POLICY IF EXISTS \"Users can access logs of their chats\" ON agent_logs")
    op.execute("ALTER TABLE agent_logs DISABLE ROW LEVEL SECURITY")

    op.execute("DROP POLICY IF EXISTS \"Users can access chats of their projects\" ON chat_sessions")
    op.execute("ALTER TABLE chat_sessions DISABLE ROW LEVEL SECURITY")

    op.execute("DROP POLICY IF EXISTS \"Users can access artifacts of their projects\" ON artifacts")
    op.execute("ALTER TABLE artifacts DISABLE ROW LEVEL SECURITY")

    op.execute("DROP POLICY IF EXISTS \"Users can only see their own projects\" ON projects")
    op.execute("ALTER TABLE projects DISABLE ROW LEVEL SECURITY")
