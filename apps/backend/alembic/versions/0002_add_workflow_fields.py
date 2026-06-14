"""Add workflow_type, group_name, recurrence_type, expected_files_count, status

Revision ID: 0002
Revises: 0001
Create Date: 2026-06-13 14:00:00.000000
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "0002"
down_revision: Union[str, None] = "0001"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "workflows",
        sa.Column("status", sa.String(50), server_default="draft", nullable=False),
    )
    op.add_column("workflows", sa.Column("workflow_type", sa.String(100), nullable=True))
    op.add_column("workflows", sa.Column("group_name", sa.String(100), nullable=True))
    op.add_column("workflows", sa.Column("recurrence_type", sa.String(50), nullable=True))
    op.add_column(
        "workflows",
        sa.Column("expected_files_count", sa.Integer(), server_default="1", nullable=False),
    )


def downgrade() -> None:
    op.drop_column("workflows", "expected_files_count")
    op.drop_column("workflows", "recurrence_type")
    op.drop_column("workflows", "group_name")
    op.drop_column("workflows", "workflow_type")
    op.drop_column("workflows", "status")