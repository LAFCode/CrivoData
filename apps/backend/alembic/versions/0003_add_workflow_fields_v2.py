"""Add slug, subgroup_name, execution_type, cron_expression, timezone, allow_empty_files, max_error_threshold

Revision ID: 0003
Revises: 0002
Create Date: 2026-06-13 22:00:00.000000
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "0003"
down_revision: Union[str, None] = "0002"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


COLUMNS = [
    {"name": "slug", "type": sa.String(255), "nullable": True, "server_default": None, "existing_type": sa.String(255)},
    {"name": "subgroup_name", "type": sa.String(100), "nullable": True, "server_default": None, "existing_type": sa.String(100)},
    {"name": "execution_type", "type": sa.String(50), "nullable": True, "server_default": None, "existing_type": sa.String(50)},
    {"name": "cron_expression", "type": sa.String(100), "nullable": True, "server_default": None, "existing_type": sa.String(100)},
    {"name": "timezone", "type": sa.String(100), "nullable": True, "server_default": None, "existing_type": sa.String(100)},
    {"name": "allow_empty_files", "type": sa.Boolean(), "nullable": False, "server_default": sa.text("false"), "existing_type": sa.Boolean()},
    {"name": "max_error_threshold", "type": sa.Integer(), "nullable": False, "server_default": "0", "existing_type": sa.Integer()},
]


def column_exists(table, column):
    """Check if a column exists in the given table."""
    from sqlalchemy import inspect
    bind = op.get_bind()
    inspector = inspect(bind)
    columns = [c["name"] for c in inspector.get_columns(table)]
    return column in columns


def upgrade() -> None:
    for col in COLUMNS:
        if not column_exists("workflows", col["name"]):
            op.add_column(
                "workflows",
                sa.Column(
                    col["name"],
                    col["type"],
                    nullable=col["nullable"],
                    server_default=col["server_default"],
                ),
            )


def downgrade() -> None:
    for col in reversed(COLUMNS):
        if column_exists("workflows", col["name"]):
            op.drop_column("workflows", col["name"])
