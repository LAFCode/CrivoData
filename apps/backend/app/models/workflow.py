"""Workflow models matching the DB diagram.

Tables defined here:
- workflows (existing, extended)
- workflow_versions (existing, extended)
- workflow_steps (existing, extended)
- workflow_file_definitions (new)
- workflow_validation_rules (new)
- workflow_approval_configs (new)
- workflow_executions (new)
- workflow_execution_files (new)
- workflow_execution_steps (new)
- workflow_execution_logs (new)
- workflow_approvals (new)
"""

from datetime import datetime, timezone
from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, Text, JSON, BigInteger
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Workflow(Base):
    __tablename__ = "workflows"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    slug: Mapped[str | None] = mapped_column(String(255), nullable=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    status: Mapped[str] = mapped_column(String(50), default="draft")
    workflow_type: Mapped[str | None] = mapped_column(String(100), nullable=True)
    group_name: Mapped[str | None] = mapped_column(String(100), nullable=True)
    subgroup_name: Mapped[str | None] = mapped_column(String(100), nullable=True)
    execution_type: Mapped[str | None] = mapped_column(String(50), nullable=True)
    recurrence_type: Mapped[str | None] = mapped_column(String(50), nullable=True)
    cron_expression: Mapped[str | None] = mapped_column(String(100), nullable=True)
    timezone: Mapped[str | None] = mapped_column(String(100), nullable=True)
    expected_files_count: Mapped[int] = mapped_column(Integer, default=1)
    allow_empty_files: Mapped[bool] = mapped_column(Boolean, default=False)
    max_error_threshold: Mapped[int] = mapped_column(Integer, default=0)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    owner_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    # Relationships
    owner = relationship("User", back_populates="workflows")
    versions = relationship(
        "WorkflowVersion", back_populates="workflow", cascade="all, delete-orphan"
    )
    submissions = relationship("Submission", back_populates="workflow")
    executions = relationship("WorkflowExecution", back_populates="workflow")

    def __repr__(self) -> str:
        return f"<Workflow(id={self.id}, name={self.name})>"


class WorkflowVersion(Base):
    __tablename__ = "workflow_versions"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    workflow_id: Mapped[int] = mapped_column(
        ForeignKey("workflows.id"), nullable=False
    )
    version_number: Mapped[int] = mapped_column(Integer, nullable=False)
    config: Mapped[dict] = mapped_column(JSON, nullable=False, default=dict)
    is_draft: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    # Relationships
    workflow = relationship("Workflow", back_populates="versions")
    steps = relationship(
        "WorkflowStep", back_populates="version", cascade="all, delete-orphan"
    )
    file_definitions = relationship(
        "WorkflowFileDefinition", back_populates="version", cascade="all, delete-orphan"
    )
    approval_configs = relationship(
        "WorkflowApprovalConfig", back_populates="version", cascade="all, delete-orphan"
    )

    def __repr__(self) -> str:
        return (
            f"<WorkflowVersion(id={self.id}, "
            f"workflow_id={self.workflow_id}, "
            f"v{self.version_number})>"
        )


class WorkflowFileDefinition(Base):
    """Defines an expected file in a workflow version.

    Maps to the 'workflow_file_definitions' table from the DB diagram.
    Stores file metadata, schema columns, and custom validation rules.
    """
    __tablename__ = "workflow_file_definitions"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    workflow_version_id: Mapped[int] = mapped_column(
        ForeignKey("workflow_versions.id"), nullable=False
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    slug: Mapped[str | None] = mapped_column(String(255), nullable=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    allowed_extensions: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    is_required: Mapped[bool] = mapped_column(Boolean, default=True)
    accept_multiple: Mapped[bool] = mapped_column(Boolean, default=False)
    max_file_size_mb: Mapped[int] = mapped_column(Integer, default=10)
    validation_order: Mapped[int] = mapped_column(Integer, default=0)
    schema_columns: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    custom_rules: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    # Relationships
    version = relationship("WorkflowVersion", back_populates="file_definitions")

    def __repr__(self) -> str:
        return f"<WorkflowFileDefinition(id={self.id}, name={self.name})>"


class WorkflowStep(Base):
    __tablename__ = "workflow_steps"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    version_id: Mapped[int] = mapped_column(
        ForeignKey("workflow_versions.id"), nullable=False
    )
    step_order: Mapped[int] = mapped_column(Integer, nullable=False)
    step_type: Mapped[str] = mapped_column(
        String(100), nullable=False
    )
    config: Mapped[dict] = mapped_column(JSON, nullable=False, default=dict)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    # Relationships
    version = relationship("WorkflowVersion", back_populates="steps")
    validation_rules = relationship(
        "WorkflowValidationRule", back_populates="step", cascade="all, delete-orphan"
    )

    def __repr__(self) -> str:
        return (
            f"<WorkflowStep(id={self.id}, "
            f"version_id={self.version_id}, "
            f"order={self.step_order})>"
        )


class WorkflowValidationRule(Base):
    """Validation rule attached to a workflow step."""
    __tablename__ = "workflow_validation_rules"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    workflow_step_id: Mapped[int] = mapped_column(
        ForeignKey("workflow_steps.id"), nullable=False
    )
    rule_type: Mapped[str] = mapped_column(String(100), nullable=False)
    severity: Mapped[str | None] = mapped_column(String(50), nullable=True)
    error_message: Mapped[str | None] = mapped_column(Text, nullable=True)
    configuration_json: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    # Relationships
    step = relationship("WorkflowStep", back_populates="validation_rules")

    def __repr__(self) -> str:
        return f"<WorkflowValidationRule(id={self.id}, type={self.rule_type})>"


class WorkflowApprovalConfig(Base):
    """Approval configuration for a workflow version."""
    __tablename__ = "workflow_approval_configs"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    workflow_version_id: Mapped[int] = mapped_column(
        ForeignKey("workflow_versions.id"), nullable=False
    )
    enabled: Mapped[bool] = mapped_column(Boolean, default=False)
    approval_type: Mapped[str | None] = mapped_column(String(50), nullable=True)
    minimum_approvers: Mapped[int] = mapped_column(Integer, default=1)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    # Relationships
    version = relationship("WorkflowVersion", back_populates="approval_configs")

    def __repr__(self) -> str:
        return f"<WorkflowApprovalConfig(id={self.id}, enabled={self.enabled})>"


class WorkflowExecution(Base):
    """A single execution/run of a workflow."""
    __tablename__ = "workflow_executions"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    workflow_id: Mapped[int] = mapped_column(
        ForeignKey("workflows.id"), nullable=False
    )
    workflow_version_id: Mapped[int] = mapped_column(
        ForeignKey("workflow_versions.id"), nullable=False
    )
    retry_of_execution_id: Mapped[int | None] = mapped_column(
        ForeignKey("workflow_executions.id"), nullable=True
    )
    status: Mapped[str] = mapped_column(String(50), default="pending")
    started_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    finished_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    triggered_by: Mapped[int | None] = mapped_column(ForeignKey("users.id"), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    # Relationships
    workflow = relationship("Workflow", back_populates="executions")
    execution_files = relationship(
        "WorkflowExecutionFile", back_populates="execution", cascade="all, delete-orphan"
    )
    execution_steps = relationship(
        "WorkflowExecutionStep", back_populates="execution", cascade="all, delete-orphan"
    )
    approvals = relationship(
        "WorkflowApproval", back_populates="execution", cascade="all, delete-orphan"
    )

    def __repr__(self) -> str:
        return f"<WorkflowExecution(id={self.id}, status={self.status})>"


class WorkflowExecutionFile(Base):
    """A file uploaded for a workflow execution."""
    __tablename__ = "workflow_execution_files"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    execution_id: Mapped[int] = mapped_column(
        ForeignKey("workflow_executions.id"), nullable=False
    )
    workflow_file_definition_id: Mapped[int] = mapped_column(
        ForeignKey("workflow_file_definitions.id"), nullable=False
    )
    storage_path: Mapped[str | None] = mapped_column(Text, nullable=True)
    original_filename: Mapped[str | None] = mapped_column(String(255), nullable=True)
    mime_type: Mapped[str | None] = mapped_column(String(255), nullable=True)
    file_size: Mapped[int | None] = mapped_column(BigInteger, nullable=True)
    checksum: Mapped[str | None] = mapped_column(String(255), nullable=True)
    uploaded_by: Mapped[int | None] = mapped_column(ForeignKey("users.id"), nullable=True)
    uploaded_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    # Relationships
    execution = relationship("WorkflowExecution", back_populates="execution_files")

    def __repr__(self) -> str:
        return f"<WorkflowExecutionFile(id={self.id})>"


class WorkflowExecutionStep(Base):
    """A step within a workflow execution."""
    __tablename__ = "workflow_execution_steps"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    execution_id: Mapped[int] = mapped_column(
        ForeignKey("workflow_executions.id"), nullable=False
    )
    workflow_step_id: Mapped[int] = mapped_column(
        ForeignKey("workflow_steps.id"), nullable=False
    )
    status: Mapped[str] = mapped_column(String(50), default="pending")
    started_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    finished_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    error_message: Mapped[str | None] = mapped_column(Text, nullable=True)
    payload_json: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    # Relationships
    execution = relationship("WorkflowExecution", back_populates="execution_steps")

    def __repr__(self) -> str:
        return f"<WorkflowExecutionStep(id={self.id}, status={self.status})>"


class WorkflowExecutionLog(Base):
    """Log entries for workflow execution steps."""
    __tablename__ = "workflow_execution_logs"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    execution_id: Mapped[int] = mapped_column(
        ForeignKey("workflow_executions.id"), nullable=False
    )
    execution_step_id: Mapped[int | None] = mapped_column(
        ForeignKey("workflow_execution_steps.id"), nullable=True
    )
    log_level: Mapped[str | None] = mapped_column(String(50), nullable=True)
    event_type: Mapped[str | None] = mapped_column(String(100), nullable=True)
    message: Mapped[str | None] = mapped_column(Text, nullable=True)
    payload_json: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    def __repr__(self) -> str:
        return f"<WorkflowExecutionLog(id={self.id}, event={self.event_type})>"


class WorkflowApproval(Base):
    """Approval record for a workflow execution."""
    __tablename__ = "workflow_approvals"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    execution_id: Mapped[int] = mapped_column(
        ForeignKey("workflow_executions.id"), nullable=False
    )
    approved_by: Mapped[int | None] = mapped_column(ForeignKey("users.id"), nullable=True)
    status: Mapped[str] = mapped_column(String(50), default="pending")
    comments: Mapped[str | None] = mapped_column(Text, nullable=True)
    approved_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    # Relationships
    execution = relationship("WorkflowExecution", back_populates="approvals")

    def __repr__(self) -> str:
        return f"<WorkflowApproval(id={self.id}, status={self.status})>"