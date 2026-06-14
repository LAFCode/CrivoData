"""Workflow, WorkflowVersion, and WorkflowStep models."""

from datetime import datetime, timezone
from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, Text, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Workflow(Base):
    __tablename__ = "workflows"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    status: Mapped[str] = mapped_column(
        String(50), default="draft"
    )  # active, draft, paused
    workflow_type: Mapped[str | None] = mapped_column(
        String(100), nullable=True
    )  # Spreadsheet Validation, PDF Validation, Hybrid
    group_name: Mapped[str | None] = mapped_column(
        String(100), nullable=True
    )  # HR, Finance, etc.
    recurrence_type: Mapped[str | None] = mapped_column(
        String(50), nullable=True
    )  # Daily, Weekly, Monthly
    expected_files_count: Mapped[int] = mapped_column(Integer, default=1)
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

    def __repr__(self) -> str:
        return (
            f"<WorkflowVersion(id={self.id}, "
            f"workflow_id={self.workflow_id}, "
            f"v{self.version_number})>"
        )


class WorkflowStep(Base):
    __tablename__ = "workflow_steps"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    version_id: Mapped[int] = mapped_column(
        ForeignKey("workflow_versions.id"), nullable=False
    )
    step_order: Mapped[int] = mapped_column(Integer, nullable=False)
    step_type: Mapped[str] = mapped_column(
        String(100), nullable=False
    )  # e.g., "validation", "approval", "notification"
    config: Mapped[dict] = mapped_column(JSON, nullable=False, default=dict)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    # Relationships
    version = relationship("WorkflowVersion", back_populates="steps")

    def __repr__(self) -> str:
        return (
            f"<WorkflowStep(id={self.id}, "
            f"version_id={self.version_id}, "
            f"order={self.step_order})>"
        )