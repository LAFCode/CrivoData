"""Workflow Group model with self-referencing parent for hierarchy."""

from datetime import datetime, timezone
from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class WorkflowGroup(Base):
    __tablename__ = "workflow_groups"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    company_id: Mapped[int | None] = mapped_column(Integer, nullable=True)
    parent_group_id: Mapped[int | None] = mapped_column(
        ForeignKey("workflow_groups.id"), nullable=True
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    # Self-referencing relationships
    parent = relationship("WorkflowGroup", remote_side="WorkflowGroup.id", back_populates="children")
    children = relationship("WorkflowGroup", back_populates="parent", cascade="all, delete-orphan")

    def __repr__(self) -> str:
        return f"<WorkflowGroup(id={self.id}, name={self.name})>"
