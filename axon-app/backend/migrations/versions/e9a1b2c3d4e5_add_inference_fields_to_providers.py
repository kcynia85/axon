"""add_inference_fields_to_providers

Revision ID: e9a1b2c3d4e5
Revises: c029df317cf9
Create Date: 2026-03-31 10:00:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = 'e9a1b2c3d4e5'
down_revision: Union[str, Sequence[str], None] = 'c029df317cf9'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add columns
    op.add_column('llm_providers', sa.Column('inference_path', sa.String(), nullable=True))
    op.add_column('llm_providers', sa.Column('inference_json_template', sa.String(), nullable=True))
    
    # Set defaults for OpenAI style
    op.execute("""
        UPDATE llm_providers 
        SET 
            inference_path = '/chat/completions',
            inference_json_template = '{"model": "{{model}}", "messages": [{"role": "user", "content": "{{prompt}}"}]}'
        WHERE protocol = 'openai' OR protocol IS NULL
    """)
    
    # Set defaults for Anthropic
    op.execute("""
        UPDATE llm_providers 
        SET 
            inference_path = '/messages',
            inference_json_template = '{"model": "{{model}}", "messages": [{"role": "user", "content": "{{prompt}}"}], "max_tokens": 1024}'
        WHERE protocol = 'anthropic'
    """)

    # Set defaults for Google
    op.execute("""
        UPDATE llm_providers 
        SET 
            inference_path = '\:generateContent',
            inference_json_template = '{"contents": [{"parts": [{"text": "{{prompt}}"}]}]}'
        WHERE protocol = 'google'
    """)


def downgrade() -> None:
    op.drop_column('llm_providers', 'inference_json_template')
    op.drop_column('llm_providers', 'inference_path')
