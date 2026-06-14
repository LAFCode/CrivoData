"""New schema: single workflow_groups table (self-ref), workflows uses workflow_group_id

Replaces 0005+0006 with a self-referencing workflow_groups table.
Drops workflow_subgroups, migrates workflows to use workflow_group_id.

Revision ID: 0007
Revises: 0004
Create Date: 2026-06-14 00:00:00.000000
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "0007"
down_revision: Union[str, None] = "0004"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def table_exists(name):
    from sqlalchemy import inspect
    bind = op.get_bind()
    inspector = inspect(bind)
    return name in inspector.get_table_names()


def column_exists(table, column):
    from sqlalchemy import inspect
    bind = op.get_bind()
    inspector = inspect(bind)
    cols = [c["name"] for c in inspector.get_columns(table)]
    return column in cols


def upgrade() -> None:
    # --- DROP old tables ---
    if table_exists("workflow_subgroups"):
        # Drop FK from workflows if it exists
        if column_exists("workflows", "subgroup_id"):
            op.drop_constraint("workflows_subgroup_id_fkey", "workflows", type_="foreignkey")
            op.drop_column("workflows", "subgroup_id")
        op.drop_table("workflow_subgroups")

    # --- Recreate workflow_groups with self-referencing parent ---
    if table_exists("workflow_groups"):
        # Drop FK from workflows before dropping workflow_groups
        if column_exists("workflows", "group_id"):
            op.drop_constraint("workflows_group_id_fkey", "workflows", type_="foreignkey")
        op.drop_table("workflow_groups")

    op.create_table(
        "workflow_groups",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("company_id", sa.Integer(), nullable=True),
        sa.Column("parent_group_id", sa.Integer(), sa.ForeignKey("workflow_groups.id"), nullable=True),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("is_active", sa.Boolean(), server_default=sa.text("true"), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_workflow_groups_id"), "workflow_groups", ["id"])

    # --- Alter workflows table ---
    # Drop old group_id column (FK already dropped above)
    if column_exists("workflows", "group_id"):
        op.drop_column("workflows", "group_id")

    # Remove old group string columns (keep scheduling columns)
    old_cols = ["group_name", "subgroup_name"]
    for col in old_cols:
        if column_exists("workflows", col):
            op.drop_column("workflows", col)

    # Add workflow_group_id
    if not column_exists("workflows", "workflow_group_id"):
        op.add_column(
            "workflows",
            sa.Column("workflow_group_id", sa.Integer(), sa.ForeignKey("workflow_groups.id"), nullable=True),
        )

    # --- Seed data: HR, Finance, Operations as top-level ---
    from sqlalchemy.sql import text
    conn = op.get_bind()

    result = conn.execute(text("SELECT COUNT(*) FROM workflow_groups"))
    count = result.scalar()
    if count == 0:
        conn.execute(
            text("""
                INSERT INTO workflow_groups (name, description)
                VALUES
                    ('hr', 'Human Resources'),
                    ('finance', 'Finance'),
                    ('operations', 'Operations')
            """)
        )

        groups = {}
        result = conn.execute(text("SELECT id, name FROM workflow_groups"))
        for row in result:
            groups[row.name] = row.id

        # Add subgroups as children
        if 'hr' in groups:
            conn.execute(
                text("""
                    INSERT INTO workflow_groups (parent_group_id, name, description)
                    VALUES
                        (:gid, 'payroll', 'Payroll processing'),
                        (:gid, 'recruitment', 'Recruitment and hiring'),
                        (:gid, 'benefits', 'Employee benefits')
                """),
                {"gid": groups['hr']}
            )
        if 'finance' in groups:
            conn.execute(
                text("""
                    INSERT INTO workflow_groups (parent_group_id, name, description)
                    VALUES
                        (:gid, 'accounts-payable', 'Accounts payable'),
                        (:gid, 'accounts-receivable', 'Accounts receivable'),
                        (:gid, 'billing', 'Billing operations')
                """),
                {"gid": groups['finance']}
            )
        if 'operations' in groups:
            conn.execute(
                text("""
                    INSERT INTO workflow_groups (parent_group_id, name, description)
                    VALUES
                        (:gid, 'logistics', 'Logistics management'),
                        (:gid, 'supply-chain', 'Supply chain management')
                """),
                {"gid": groups['operations']}
            )


def downgrade() -> None:
    if table_exists("workflow_groups"):
        op.drop_table("workflow_groups")
    if column_exists("workflows", "workflow_group_id"):
        op.drop_column("workflows", "workflow_group_id")
