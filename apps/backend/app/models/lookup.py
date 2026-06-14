"""Lookup/normalized tables for workflow enum-like fields.

Tables defined here:
- WorkflowStatus (status)
- WorkflowType (workflow_type)
- RecurrenceType (recurrence_type)
- ExecutionType (execution_type)
- Timezone (timezone)
"""

from datetime import datetime, timezone
from sqlalchemy import Boolean, DateTime, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class WorkflowStatus(Base):
    """Normalized lookup table for workflow status values."""
    __tablename__ = "workflow_statuses"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(50), nullable=False, unique=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    # Relationships
    workflows = relationship("Workflow", back_populates="status_ref")

    def __repr__(self) -> str:
        return f"<WorkflowStatus(id={self.id}, name={self.name})>"


class WorkflowType(Base):
    """Normalized lookup table for workflow type values."""
    __tablename__ = "workflow_types"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False, unique=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    # Relationships
    workflows = relationship("Workflow", back_populates="workflow_type_ref")

    def __repr__(self) -> str:
        return f"<WorkflowType(id={self.id}, name={self.name})>"


class RecurrenceType(Base):
    """Normalized lookup table for recurrence type values."""
    __tablename__ = "recurrence_types"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(50), nullable=False, unique=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    # Relationships
    workflows = relationship("Workflow", back_populates="recurrence_type_ref")

    def __repr__(self) -> str:
        return f"<RecurrenceType(id={self.id}, name={self.name})>"


class ExecutionType(Base):
    """Normalized lookup table for execution type values."""
    __tablename__ = "execution_types"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(50), nullable=False, unique=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    # Relationships
    workflows = relationship("Workflow", back_populates="execution_type_ref")

    def __repr__(self) -> str:
        return f"<ExecutionType(id={self.id}, name={self.name})>"


class Timezone(Base):
    """Normalized lookup table for timezone values."""
    __tablename__ = "timezones"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False, unique=True)
    utc_offset: Mapped[str | None] = mapped_column(String(10), nullable=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    # Relationships
    workflows = relationship("Workflow", back_populates="timezone_ref")

    def __repr__(self) -> str:
        return f"<Timezone(id={self.id}, name={self.name})>"
