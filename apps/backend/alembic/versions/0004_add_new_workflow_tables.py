"""Add workflow_file_definitions, workflow_validation_rules, workflow_approval_configs,
workflow_executions, workflow_execution_files, workflow_execution_steps,
workflow_execution_logs, workflow_approvals

Revision ID: 0004
Revises: 0003
Create Date: 2026-06-14 00:00:00.000000
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "0004"
down_revision: Union[str, None] = "0003"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


TABLES = [
    {
        "name": "workflow_file_definitions",
        "columns": [
            sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
            sa.Column("workflow_version_id", sa.Integer(), sa.ForeignKey("workflow_versions.id"), nullable=False),
            sa.Column("name", sa.String(255), nullable=False),
            sa.Column("slug", sa.String(255), nullable=True),
            sa.Column("description", sa.Text(), nullable=True),
            sa.Column("allowed_extensions", sa.JSON(), nullable=True),
            sa.Column("is_required", sa.Boolean(), server_default=sa.text("true"), nullable=False),
            sa.Column("accept_multiple", sa.Boolean(), server_default=sa.text("false"), nullable=False),
            sa.Column("max_file_size_mb", sa.Integer(), server_default="10", nullable=False),
            sa.Column("validation_order", sa.Integer(), server_default="0", nullable=False),
            sa.Column("schema_columns", sa.JSON(), nullable=True),
            sa.Column("custom_rules", sa.JSON(), nullable=True),
            sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
            sa.PrimaryKeyConstraint("id"),
        ],
    },
    {
        "name": "workflow_validation_rules",
        "columns": [
            sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
            sa.Column("workflow_step_id", sa.Integer(), sa.ForeignKey("workflow_steps.id"), nullable=False),
            sa.Column("rule_type", sa.String(100), nullable=False),
            sa.Column("severity", sa.String(50), nullable=True),
            sa.Column("error_message", sa.Text(), nullable=True),
            sa.Column("configuration_json", sa.JSON(), nullable=True),
            sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
            sa.PrimaryKeyConstraint("id"),
        ],
    },
    {
        "name": "workflow_approval_configs",
        "columns": [
            sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
            sa.Column("workflow_version_id", sa.Integer(), sa.ForeignKey("workflow_versions.id"), nullable=False),
            sa.Column("enabled", sa.Boolean(), server_default=sa.text("false"), nullable=False),
            sa.Column("approval_type", sa.String(50), nullable=True),
            sa.Column("minimum_approvers", sa.Integer(), server_default="1", nullable=False),
            sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
            sa.PrimaryKeyConstraint("id"),
        ],
    },
    {
        "name": "workflow_executions",
        "columns": [
            sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
            sa.Column("workflow_id", sa.Integer(), sa.ForeignKey("workflows.id"), nullable=False),
            sa.Column("workflow_version_id", sa.Integer(), sa.ForeignKey("workflow_versions.id"), nullable=False),
            sa.Column("retry_of_execution_id", sa.Integer(), sa.ForeignKey("workflow_executions.id"), nullable=True),
            sa.Column("status", sa.String(50), server_default=sa.text("'pending'"), nullable=False),
            sa.Column("started_at", sa.DateTime(timezone=True), nullable=True),
            sa.Column("finished_at", sa.DateTime(timezone=True), nullable=True),
            sa.Column("triggered_by", sa.Integer(), sa.ForeignKey("users.id"), nullable=True),
            sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
            sa.PrimaryKeyConstraint("id"),
        ],
    },
    {
        "name": "workflow_execution_files",
        "columns": [
            sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
            sa.Column("execution_id", sa.Integer(), sa.ForeignKey("workflow_executions.id"), nullable=False),
            sa.Column("workflow_file_definition_id", sa.Integer(), sa.ForeignKey("workflow_file_definitions.id"), nullable=False),
            sa.Column("storage_path", sa.Text(), nullable=True),
            sa.Column("original_filename", sa.String(255), nullable=True),
            sa.Column("mime_type", sa.String(255), nullable=True),
            sa.Column("file_size", sa.BigInteger(), nullable=True),
            sa.Column("checksum", sa.String(255), nullable=True),
            sa.Column("uploaded_by", sa.Integer(), sa.ForeignKey("users.id"), nullable=True),
            sa.Column("uploaded_at", sa.DateTime(timezone=True), nullable=True),
            sa.PrimaryKeyConstraint("id"),
        ],
    },
    {
        "name": "workflow_execution_steps",
        "columns": [
            sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
            sa.Column("execution_id", sa.Integer(), sa.ForeignKey("workflow_executions.id"), nullable=False),
            sa.Column("workflow_step_id", sa.Integer(), sa.ForeignKey("workflow_steps.id"), nullable=False),
            sa.Column("status", sa.String(50), server_default=sa.text("'pending'"), nullable=False),
            sa.Column("started_at", sa.DateTime(timezone=True), nullable=True),
            sa.Column("finished_at", sa.DateTime(timezone=True), nullable=True),
            sa.Column("error_message", sa.Text(), nullable=True),
            sa.Column("payload_json", sa.JSON(), nullable=True),
            sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
            sa.PrimaryKeyConstraint("id"),
        ],
    },
    {
        "name": "workflow_execution_logs",
        "columns": [
            sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
            sa.Column("execution_id", sa.Integer(), sa.ForeignKey("workflow_executions.id"), nullable=False),
            sa.Column("execution_step_id", sa.Integer(), sa.ForeignKey("workflow_execution_steps.id"), nullable=True),
            sa.Column("log_level", sa.String(50), nullable=True),
            sa.Column("event_type", sa.String(100), nullable=True),
            sa.Column("message", sa.Text(), nullable=True),
            sa.Column("payload_json", sa.JSON(), nullable=True),
            sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
            sa.PrimaryKeyConstraint("id"),
        ],
    },
    {
        "name": "workflow_approvals",
        "columns": [
            sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
            sa.Column("execution_id", sa.Integer(), sa.ForeignKey("workflow_executions.id"), nullable=False),
            sa.Column("approved_by", sa.Integer(), sa.ForeignKey("users.id"), nullable=True),
            sa.Column("status", sa.String(50), server_default=sa.text("'pending'"), nullable=False),
            sa.Column("comments", sa.Text(), nullable=True),
            sa.Column("approved_at", sa.DateTime(timezone=True), nullable=True),
            sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
            sa.PrimaryKeyConstraint("id"),
        ],
    },
]


def table_exists(name):
    """Check if a table exists in the database."""
    from sqlalchemy import inspect
    bind = op.get_bind()
    inspector = inspect(bind)
    return name in inspector.get_table_names()


def upgrade() -> None:
    for tbl in TABLES:
        if not table_exists(tbl["name"]):
            op.create_table(tbl["name"], *tbl["columns"])
            try:
                op.create_index(op.f(f"ix_{tbl['name']}_id"), tbl["name"], ["id"])
            except Exception:
                pass  # index may already exist


def downgrade() -> None:
    for tbl in reversed(TABLES):
        if table_exists(tbl["name"]):
            op.drop_table(tbl["name"])