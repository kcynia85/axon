"""Seed default automation providers

Revision ID: f013267fb6a4
Revises: b163febeddc6
Create Date: 2026-04-27 23:06:10.697205

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'f013267fb6a4'
down_revision: Union[str, Sequence[str], None] = 'b163febeddc6'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Seed n8n
    op.execute(
        "INSERT INTO automation_providers (id, name, platform, base_url, auth_type, auth_header_name, auth_secret, created_at, updated_at) "
        "VALUES ('e8e0a2d4-1a3b-4c5d-8e9f-0a1b2c3d4e5f', 'n8n (Local)', 'N8N', 'http://localhost:5678', 'HEADER', 'X-N8N-API-KEY', 'PASTE_YOUR_N8N_TOKEN_HERE', now(), now())"
    )
    # Seed Make.com
    op.execute(
        "INSERT INTO automation_providers (id, name, platform, base_url, auth_type, auth_header_name, auth_secret, created_at, updated_at) "
        "VALUES ('f9f1b3e5-2b4c-5d6e-9f0a-1b2c3d4e5f6a', 'Make.com', 'MAKE', 'https://eu1.make.com', 'BEARER', 'Authorization', 'PASTE_YOUR_MAKE_TOKEN_HERE', now(), now())"
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.execute("DELETE FROM automation_providers WHERE id IN ('e8e0a2d4-1a3b-4c5d-8e9f-0a1b2c3d4e5f', 'f9f1b3e5-2b4c-5d6e-9f0a-1b2c3d4e5f6a')")
