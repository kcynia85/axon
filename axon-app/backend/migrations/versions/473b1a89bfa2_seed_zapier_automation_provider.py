"""Seed Zapier automation provider

Revision ID: 473b1a89bfa2
Revises: f013267fb6a4
Create Date: 2026-04-27 23:13:19.324739

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '473b1a89bfa2'
down_revision: Union[str, Sequence[str], None] = 'f013267fb6a4'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Seed Zapier
    op.execute(
        "INSERT INTO automation_providers (id, name, platform, base_url, auth_type, auth_header_name, auth_secret, created_at, updated_at) "
        "VALUES ('a1b2c3d4-e5f6-4a5b-b6c7-d8e9f0a1b2c3', 'Zapier', 'ZAPIER', 'https://hooks.zapier.com', 'HEADER', 'X-Zapier-Token', 'PASTE_YOUR_ZAPIER_TOKEN_HERE', now(), now())"
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.execute("DELETE FROM automation_providers WHERE id = 'a1b2c3d4-e5f6-4a5b-b6c7-d8e9f0a1b2c3'")
