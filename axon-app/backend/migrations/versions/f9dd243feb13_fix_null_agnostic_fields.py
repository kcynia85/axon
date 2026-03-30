"""fix_null_agnostic_fields

Revision ID: f9dd243feb13
Revises: 2a3932b10431
Create Date: 2026-03-30 18:30:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'f9dd243feb13'
down_revision = '2a3932b10431'
branch_labels = None
depends_on = None

def upgrade():
    op.execute("UPDATE llm_providers SET protocol = 'openai' WHERE protocol IS NULL")
    op.execute("UPDATE llm_providers SET response_content_path = 'choices.0.message.content' WHERE response_content_path IS NULL")
    op.execute("UPDATE llm_providers SET response_error_path = 'error.message' WHERE response_error_path IS NULL")
    op.execute("UPDATE llm_providers SET custom_headers = '[]'::jsonb WHERE custom_headers IS NULL")

def downgrade():
    pass
