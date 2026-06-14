"""Normalize workflow enum fields into lookup tables.

Creates 5 lookup tables (workflow_statuses, workflow_types, recurrence_types,
execution_types, timezones), seeds them with data, migrates existing workflow
string values to FK IDs, then drops the old string columns.

Revision ID: 0008
Revises: 0007
Create Date: 2026-06-14 00:00:00.000000
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "0008"
down_revision: Union[str, None] = "0007"
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
    conn = op.get_bind()

    # ============================================================
    # 1. CREATE LOOKUP TABLES
    # ============================================================

    # --- workflow_statuses ---
    if not table_exists("workflow_statuses"):
        op.create_table(
            "workflow_statuses",
            sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
            sa.Column("name", sa.String(50), nullable=False, unique=True),
            sa.Column("description", sa.Text(), nullable=True),
            sa.Column("is_active", sa.Boolean(), server_default=sa.text("true"), nullable=False),
            sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
            sa.PrimaryKeyConstraint("id"),
        )
        op.create_index(op.f("ix_workflow_statuses_id"), "workflow_statuses", ["id"])

    # --- workflow_types ---
    if not table_exists("workflow_types"):
        op.create_table(
            "workflow_types",
            sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
            sa.Column("name", sa.String(100), nullable=False, unique=True),
            sa.Column("description", sa.Text(), nullable=True),
            sa.Column("is_active", sa.Boolean(), server_default=sa.text("true"), nullable=False),
            sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
            sa.PrimaryKeyConstraint("id"),
        )
        op.create_index(op.f("ix_workflow_types_id"), "workflow_types", ["id"])

    # --- recurrence_types ---
    if not table_exists("recurrence_types"):
        op.create_table(
            "recurrence_types",
            sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
            sa.Column("name", sa.String(50), nullable=False, unique=True),
            sa.Column("description", sa.Text(), nullable=True),
            sa.Column("is_active", sa.Boolean(), server_default=sa.text("true"), nullable=False),
            sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
            sa.PrimaryKeyConstraint("id"),
        )
        op.create_index(op.f("ix_recurrence_types_id"), "recurrence_types", ["id"])

    # --- execution_types ---
    if not table_exists("execution_types"):
        op.create_table(
            "execution_types",
            sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
            sa.Column("name", sa.String(50), nullable=False, unique=True),
            sa.Column("description", sa.Text(), nullable=True),
            sa.Column("is_active", sa.Boolean(), server_default=sa.text("true"), nullable=False),
            sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
            sa.PrimaryKeyConstraint("id"),
        )
        op.create_index(op.f("ix_execution_types_id"), "execution_types", ["id"])

    # --- timezones ---
    if not table_exists("timezones"):
        op.create_table(
            "timezones",
            sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
            sa.Column("name", sa.String(100), nullable=False, unique=True),
            sa.Column("utc_offset", sa.String(10), nullable=True),
            sa.Column("description", sa.Text(), nullable=True),
            sa.Column("is_active", sa.Boolean(), server_default=sa.text("true"), nullable=False),
            sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
            sa.PrimaryKeyConstraint("id"),
        )
        op.create_index(op.f("ix_timezones_id"), "timezones", ["id"])

    # ============================================================
    # 2. SEED LOOKUP DATA
    # ============================================================

    from sqlalchemy.sql import text

    # --- Seed workflow_statuses ---
    result = conn.execute(text("SELECT COUNT(*) FROM workflow_statuses"))
    if result.scalar() == 0:
        conn.execute(
            text("""
                INSERT INTO workflow_statuses (name, description) VALUES
                    ('draft', 'Workflow is in draft state, not yet active'),
                    ('active', 'Workflow is active and ready for execution'),
                    ('paused', 'Workflow execution is temporarily paused'),
                    ('archived', 'Workflow has been archived and is no longer in use')
            """)
        )

    # --- Seed workflow_types ---
    result = conn.execute(text("SELECT COUNT(*) FROM workflow_types"))
    if result.scalar() == 0:
        conn.execute(
            text("""
                INSERT INTO workflow_types (name, description) VALUES
                    ('strict', 'Strict validation mode - all rules must pass'),
                    ('lenient', 'Lenient validation mode - warnings only'),
                    ('custom', 'Custom validation mode with user-defined rules')
            """)
        )

    # --- Seed recurrence_types ---
    result = conn.execute(text("SELECT COUNT(*) FROM recurrence_types"))
    if result.scalar() == 0:
        conn.execute(
            text("""
                INSERT INTO recurrence_types (name, description) VALUES
                    ('hourly', 'Runs every hour'),
                    ('daily', 'Runs once per day'),
                    ('weekly', 'Runs once per week'),
                    ('monthly', 'Runs once per month'),
                    ('custom', 'Custom cron-based recurrence')
            """)
        )

    # --- Seed execution_types ---
    result = conn.execute(text("SELECT COUNT(*) FROM execution_types"))
    if result.scalar() == 0:
        conn.execute(
            text("""
                INSERT INTO execution_types (name, description) VALUES
                    ('manual', 'Manually triggered execution'),
                    ('scheduled', 'Scheduled automatic execution'),
                    ('event_driven', 'Triggered by external events')
            """)
        )

    # --- Seed timezones ---
    result = conn.execute(text("SELECT COUNT(*) FROM timezones"))
    if result.scalar() == 0:
        conn.execute(
            text("""
                INSERT INTO timezones (name, utc_offset, description) VALUES
                    ('UTC', '+00:00', 'Coordinated Universal Time'),
                    ('America/New_York', '-05:00', 'Eastern Time (US & Canada)'),
                    ('America/Chicago', '-06:00', 'Central Time (US & Canada)'),
                    ('America/Denver', '-07:00', 'Mountain Time (US & Canada)'),
                    ('America/Los_Angeles', '-08:00', 'Pacific Time (US & Canada)'),
                    ('America/Sao_Paulo', '-03:00', 'Brasilia Time'),
                    ('Europe/London', '+00:00', 'Greenwich Mean Time'),
                    ('Europe/Berlin', '+01:00', 'Central European Time'),
                    ('Europe/Paris', '+01:00', 'Central European Time'),
                    ('Asia/Tokyo', '+09:00', 'Japan Standard Time'),
                    ('Asia/Shanghai', '+08:00', 'China Standard Time'),
                    ('Australia/Sydney', '+11:00', 'Australian Eastern Time')
            """)
        )

    # ============================================================
    # 3. MIGRATE EXISTING WORKFLOW DATA
    # ============================================================

    # Only proceed if workflows table has the old string columns
    if table_exists("workflows"):
        # --- Migrate status ---
        if column_exists("workflows", "status") and not column_exists("workflows", "status_id"):
            op.add_column(
                "workflows",
                sa.Column("status_id", sa.Integer(), sa.ForeignKey("workflow_statuses.id"), nullable=True),
            )
            conn.execute(
                text("""
                    UPDATE workflows
                    SET status_id = (SELECT id FROM workflow_statuses WHERE workflow_statuses.name = workflows.status)
                    WHERE status IS NOT NULL
                """)
            )

        # --- Migrate workflow_type ---
        if column_exists("workflows", "workflow_type") and not column_exists("workflows", "workflow_type_id"):
            op.add_column(
                "workflows",
                sa.Column("workflow_type_id", sa.Integer(), sa.ForeignKey("workflow_types.id"), nullable=True),
            )
            conn.execute(
                text("""
                    UPDATE workflows
                    SET workflow_type_id = (SELECT id FROM workflow_types WHERE workflow_types.name = workflows.workflow_type)
                    WHERE workflow_type IS NOT NULL
                """)
            )

        # --- Migrate execution_type ---
        if column_exists("workflows", "execution_type") and not column_exists("workflows", "execution_type_id"):
            op.add_column(
                "workflows",
                sa.Column("execution_type_id", sa.Integer(), sa.ForeignKey("execution_types.id"), nullable=True),
            )
            conn.execute(
                text("""
                    UPDATE workflows
                    SET execution_type_id = (SELECT id FROM execution_types WHERE execution_types.name = workflows.execution_type)
                    WHERE execution_type IS NOT NULL
                """)
            )

        # --- Migrate recurrence_type ---
        if column_exists("workflows", "recurrence_type") and not column_exists("workflows", "recurrence_type_id"):
            op.add_column(
                "workflows",
                sa.Column("recurrence_type_id", sa.Integer(), sa.ForeignKey("recurrence_types.id"), nullable=True),
            )
            conn.execute(
                text("""
                    UPDATE workflows
                    SET recurrence_type_id = (SELECT id FROM recurrence_types WHERE recurrence_types.name = workflows.recurrence_type)
                    WHERE recurrence_type IS NOT NULL
                """)
            )

        # --- Migrate timezone ---
        if column_exists("workflows", "timezone") and not column_exists("workflows", "timezone_id"):
            op.add_column(
                "workflows",
                sa.Column("timezone_id", sa.Integer(), sa.ForeignKey("timezones.id"), nullable=True),
            )
            conn.execute(
                text("""
                    UPDATE workflows
                    SET timezone_id = (SELECT id FROM timezones WHERE timezones.name = workflows.timezone)
                    WHERE timezone IS NOT NULL
                """)
            )

        # ============================================================
        # 4. DROP OLD STRING COLUMNS
        # ============================================================
        for col in ["status", "workflow_type", "execution_type", "recurrence_type", "timezone"]:
            if column_exists("workflows", col):
                op.drop_column("workflows", col)


def downgrade() -> None:
    """Reverse the migration: restore string columns, drop FK columns, drop lookup tables."""
    from sqlalchemy.sql import text
    conn = op.get_bind()

    if table_exists("workflows"):
        # Restore string columns with data from lookup tables
        for col, fk_col, lookup_table in [
            ("status", "status_id", "workflow_statuses"),
            ("workflow_type", "workflow_type_id", "workflow_types"),
            ("execution_type", "execution_type_id", "execution_types"),
            ("recurrence_type", "recurrence_type_id", "recurrence_types"),
            ("timezone", "timezone_id", "timezones"),
        ]:
            if not column_exists("workflows", col) and column_exists("workflows", fk_col):
                op.add_column(
                    "workflows",
                    sa.Column(col, sa.String(255), nullable=True),
                )
                conn.execute(
                    text(f"""
                        UPDATE workflows
                        SET {col} = (SELECT name FROM {lookup_table} WHERE {lookup_table}.id = workflows.{fk_col})
                        WHERE {fk_col} IS NOT NULL
                    """)
                )

        # Drop FK columns
        for fk_col in ["status_id", "workflow_type_id", "execution_type_id", "recurrence_type_id", "timezone_id"]:
            if column_exists("workflows", fk_col):
                op.drop_column("workflows", fk_col)

    # Drop lookup tables
    for table in ["workflow_statuses", "workflow_types", "recurrence_types", "execution_types", "timezones"]:
        if table_exists(table):
            op.drop_table(table)
