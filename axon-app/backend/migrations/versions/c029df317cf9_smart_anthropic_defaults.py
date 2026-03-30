"""smart_anthropic_defaults

Revision ID: c029df317cf9
Revises: f9dd243feb13
Create Date: 2026-03-30 18:45:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'c029df317cf9'
down_revision = 'f9dd243feb13'
branch_labels = None
depends_on = None

def upgrade():
    # Set correct agnostic defaults for Anthropic
    op.execute("""
        UPDATE llm_providers 
        SET 
            protocol = 'anthropic', 
            auth_header_name = 'x-api-key', 
            auth_header_prefix = '', 
            response_content_path = 'content.0.text', 
            discovery_json_path = 'data', 
            discovery_id_key = 'id',
            custom_headers = '[{"key": "anthropic-version", "value": "2023-06-01"}]'::jsonb
        WHERE provider_technical_id ILIKE '%anthropic%'
    """)

def downgrade():
    pass
