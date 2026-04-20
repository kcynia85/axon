"""update_projects_and_add_inbox

Revision ID: 6b293c067de9
Revises: ce605a459f10
Create Date: 2026-02-17 22:25:32.627571

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '6b293c067de9'
down_revision: Union[str, Sequence[str], None] = 'ce605a459f10'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def create_enum_if_not_exists(name: str, values: list[str]):
    bind = op.get_bind()
    result = bind.execute(sa.text(f"SELECT 1 FROM pg_type WHERE typname = '{name}'"))
    if not result.first():
        values_str = ", ".join([f"'{v}'" for v in values])
        op.execute(f"CREATE TYPE {name} AS ENUM ({values_str})")

def upgrade() -> None:
    # 0. Create Enums safely
    create_enum_if_not_exists('projectstatus', ['IDEA', 'IN_PROGRESS', 'COMPLETED'])
    # create_enum_if_not_exists('resourceprovider', ['NOTION', 'FIGMA', 'GITHUB', 'OTHER'])
    # create_enum_if_not_exists('approvalstatus', ['DRAFT', 'IN_REVIEW', 'APPROVED'])
    # inboxitemstatus and inboxitemtype will be created by create_table
    # create_enum_if_not_exists('inboxitemstatus', ['NEW', 'RESOLVED'])
    # create_enum_if_not_exists('inboxitemtype', ['ARTIFACT_READY', 'CONSULTATION', 'APPROVAL_NEEDED'])

    # 1. Create new tables
    # Note: Using sa.Enum(..., create_type=False) to avoid DuplicateObjectError
    op.create_table('inbox_items',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('item_status', sa.Enum('NEW', 'RESOLVED', name='inboxitemstatus'), nullable=False),
        sa.Column('item_type', sa.Enum('ARTIFACT_READY', 'CONSULTATION', 'APPROVAL_NEEDED', name='inboxitemtype'), nullable=False),
        sa.Column('item_title', sa.String(), nullable=False),
        sa.Column('item_content', sa.String(), nullable=False),
        sa.Column('item_source', sa.String(), nullable=False),
        sa.Column('artifact_source_id', sa.UUID(), nullable=False),
        sa.Column('project_id', sa.UUID(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('resolved_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['project_id'], ['projects.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_table('project_artifacts',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('artifact_name', sa.String(), nullable=False),
        sa.Column('artifact_source_path', sa.String(), nullable=False),
        sa.Column('artifact_deliverable_url', sa.String(), nullable=False),
        sa.Column('workspace_domain', sa.String(), nullable=True),
        sa.Column('artifact_approval_status', sa.Enum('DRAFT', 'IN_REVIEW', 'APPROVED', name='approvalstatus'), nullable=False),
        sa.Column('approved_by_user_id', sa.UUID(), nullable=True),
        sa.Column('artifact_approved_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('project_id', sa.UUID(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['project_id'], ['projects.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_table('project_key_resources',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('resource_provider_type', sa.Enum('NOTION', 'FIGMA', 'GITHUB', 'OTHER', name='resourceprovider'), nullable=False),
        sa.Column('resource_label', sa.String(), nullable=False),
        sa.Column('resource_url', sa.String(), nullable=False),
        sa.Column('resource_icon', sa.String(), nullable=True),
        sa.Column('project_id', sa.UUID(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['project_id'], ['projects.id'], ),
        sa.PrimaryKeyConstraint('id')
    )

    # 2. Handle projects table updates
    op.alter_column('projects', 'name', new_column_name='project_name')
    
    op.add_column('projects', sa.Column('project_status', sa.Enum('IDEA', 'IN_PROGRESS', 'COMPLETED', name='projectstatus', create_type=False), nullable=True))
    op.add_column('projects', sa.Column('project_summary', sa.String(), nullable=True))
    op.add_column('projects', sa.Column('project_keywords', postgresql.JSONB(astext_type=sa.Text()), nullable=True))
    op.add_column('projects', sa.Column('project_strategy_url', sa.String(), nullable=True))
    op.add_column('projects', sa.Column('space_id', sa.UUID(), nullable=True))
    
    op.execute("UPDATE projects SET project_status = 'IDEA' WHERE project_status IS NULL")
    op.alter_column('projects', 'project_status', nullable=False)
    
    op.create_foreign_key(None, 'projects', 'spaces', ['space_id'], ['id'])

    op.drop_column('projects', 'status')
    op.drop_column('projects', 'domain')
    op.drop_column('projects', 'description')
    op.drop_column('projects', 'deleted_at')

    # 3. Clean up old artifacts/scenarios
    op.execute("DROP INDEX IF EXISTS idx_artifacts_metadata")
    op.execute("DROP TABLE IF EXISTS artifacts CASCADE")
    op.execute("DROP TABLE IF EXISTS scenarios CASCADE")


def downgrade() -> None:
    """Downgrade schema."""
    op.add_column('projects', sa.Column('name', sa.VARCHAR(), autoincrement=False, nullable=True))
    op.add_column('projects', sa.Column('deleted_at', postgresql.TIMESTAMP(timezone=True), autoincrement=False, nullable=True))
    op.add_column('projects', sa.Column('description', sa.VARCHAR(), autoincrement=False, nullable=True))
    
    op.drop_constraint(None, 'projects', type_='foreignkey')
    op.drop_column('projects', 'space_id')
    op.drop_column('projects', 'project_strategy_url')
    op.drop_column('projects', 'project_keywords')
    op.drop_column('projects', 'project_summary')
    op.drop_column('projects', 'project_status')
    op.drop_column('projects', 'project_name')
    
    op.drop_table('project_key_resources')
    op.drop_table('project_artifacts')
    op.drop_table('inbox_items')
    
    op.execute("DROP TYPE IF EXISTS projectstatus")
    op.execute("DROP TYPE IF EXISTS resourceprovider")
    op.execute("DROP TYPE IF EXISTS approvalstatus")
    op.execute("DROP TYPE IF EXISTS inboxitemstatus")
    op.execute("DROP TYPE IF EXISTS inboxitemtype")
