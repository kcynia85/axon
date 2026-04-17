"""enable_rls_gate_0_tables

Revision ID: 601f44fa06a7
Revises: 5f0314dd3c96
Create Date: 2026-02-18 20:46:38.041574

"""
from typing import Sequence, Union

from alembic import op


# revision identifiers, used by Alembic.
revision: str = '601f44fa06a7'
down_revision: Union[str, Sequence[str], None] = '5f0314dd3c96'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # =========================================================================
    # 1. Project Scoped Tables (Strict Isolation)
    # =========================================================================

    # 1.1 Project Artifacts
    op.execute("ALTER TABLE project_artifacts ENABLE ROW LEVEL SECURITY")
    op.execute("""
        CREATE POLICY "Users access artifacts of own projects"
        ON project_artifacts
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

    # 1.2 Key Resources
    op.execute("ALTER TABLE project_key_resources ENABLE ROW LEVEL SECURITY")
    op.execute("""
        CREATE POLICY "Users access key resources of own projects"
        ON project_key_resources
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

    # 1.3 Inbox Items
    # Inbox items can be linked to a project directly OR via an artifact
    op.execute("ALTER TABLE inbox_items ENABLE ROW LEVEL SECURITY")
    op.execute("""
        CREATE POLICY "Users access inbox of own projects"
        ON inbox_items
        FOR ALL
        USING (
            (project_id IS NOT NULL AND project_id IN (SELECT id FROM projects WHERE owner_id = auth.uid()))
            OR
            (project_id IS NULL AND artifact_id IN (
                SELECT id FROM project_artifacts WHERE project_id IN (
                    SELECT id FROM projects WHERE owner_id = auth.uid()
                )
            ))
        )
        WITH CHECK (
            (project_id IS NOT NULL AND project_id IN (SELECT id FROM projects WHERE owner_id = auth.uid()))
        );
    """)

    # =========================================================================
    # 2. User Scoped Tables
    # =========================================================================

    # 2.1 Users
    op.execute("ALTER TABLE users ENABLE ROW LEVEL SECURITY")
    op.execute("""
        CREATE POLICY "Users access own profile"
        ON users
        FOR ALL
        USING (id = auth.uid())
        WITH CHECK (id = auth.uid());
    """)
    # Allow inserting if ID matches (e.g. on signup via API if used)
    op.execute("""
        CREATE POLICY "Users create own profile"
        ON users
        FOR INSERT
        WITH CHECK (id = auth.uid());
    """)

    # =========================================================================
    # 3. Shared / System Resources (Authenticated Access)
    # =========================================================================
    # These tables are currently shared across the workspace/installation.
    # Future enhancement: Restrict WRITE to admins, or filter by 'availability_workspace' if linked to users.
    # For now (vNext P0), we allow authenticated users to see and use them.

    shared_tables = [
        'prompt_archetypes',
        'external_services',
        'service_capabilities',
        'internal_tools',
        'automations',
        'automation_executions',
        'knowledge_hubs',
        'knowledge_sources',
        'text_chunks',
        'llm_providers',
        'llm_models',
        'llm_routers',
        'embedding_models',
        'chunking_strategies',
        'vector_databases',
        'patterns',
        'templates',
        'crews',
        'crew_agents',
        'agent_configs',
        'meta_agents',
        'voice_meta_agents'
    ]

    for table in shared_tables:
        # Check if RLS is already enabled (agent_configs might vary), but idempotent ENABLE is fine in PG usually, 
        # or we just run it. If it fails, we wrap in try/catch in PL/SQL, but here we assume safe.
        # Actually, ALERT TABLE ... ENABLE RLS is safe to run multiple times.
        op.execute(f"ALTER TABLE {table} ENABLE ROW LEVEL SECURITY")
        
        # Drop policy if exists to avoid conflict during re-runs
        op.execute(f'DROP POLICY IF EXISTS "Authenticated users access {table}" ON {table}')
        
        op.execute(f"""
            CREATE POLICY "Authenticated users access {table}"
            ON {table}
            FOR ALL
            USING (auth.role() = 'authenticated')
            WITH CHECK (auth.role() = 'authenticated');
        """)


def downgrade() -> None:
    """Downgrade schema."""
    
    # 3. Shared
    shared_tables = [
        'prompt_archetypes', 'external_services', 'service_capabilities', 'internal_tools',
        'automations', 'automation_executions', 'knowledge_hubs', 'knowledge_sources', 'text_chunks',
        'llm_providers', 'llm_models', 'llm_routers', 'embedding_models', 'chunking_strategies',
        'vector_databases', 'patterns', 'templates', 'crews', 'crew_agents', 'agent_configs',
        'meta_agents', 'voice_meta_agents'
    ]
    for table in shared_tables:
        op.execute(f'DROP POLICY IF EXISTS "Authenticated users access {table}" ON {table}')
        op.execute(f"ALTER TABLE {table} DISABLE ROW LEVEL SECURITY")

    # 2. Users
    op.execute('DROP POLICY IF EXISTS "Users create own profile" ON users')
    op.execute('DROP POLICY IF EXISTS "Users access own profile" ON users')
    op.execute("ALTER TABLE users DISABLE ROW LEVEL SECURITY")

    # 1. Project Scoped
    op.execute('DROP POLICY IF EXISTS "Users access inbox of own projects" ON inbox_items')
    op.execute("ALTER TABLE inbox_items DISABLE ROW LEVEL SECURITY")

    op.execute('DROP POLICY IF EXISTS "Users access key resources of own projects" ON project_key_resources')
    op.execute("ALTER TABLE project_key_resources DISABLE ROW LEVEL SECURITY")

    op.execute('DROP POLICY IF EXISTS "Users access artifacts of own projects" ON project_artifacts')
    op.execute("ALTER TABLE project_artifacts DISABLE ROW LEVEL SECURITY")
