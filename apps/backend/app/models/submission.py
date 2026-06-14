"""Submission and SubmissionResult models."""

from datetime import datetime, timezone
from sqlalchemy import DateTime, ForeignKey, Integer, String, Text, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Submission(Base):
    __tablename__ = "submissions"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    workflow_id: Mapped[int] = mapped_column(
        ForeignKey("workflows.id"), nullable=False
    )
    owner_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    file_path: Mapped[str] = mapped_column(String(512), nullable=False)
    original_filename: Mapped[str] = mapped_column(String(255), nullable=False)
    file_type: Mapped[str] = mapped_column(
        String(10), nullable=False
    )  # xlsx, csv, pdf
    file_size_bytes: Mapped[int] = mapped_column(Integer, nullable=False)
    status: Mapped[str] = mapped_column(
        String(50), default="pending"
    )  # pending, processing, completed, failed
    celery_task_id: Mapped[str | None] = mapped_column(String(255), nullable=True)
    error_message: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    completed_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )

    # Relationships
    workflow = relationship("Workflow", back_populates="submissions")
    owner = relationship("User", back_populates="submissions")
    results = relationship(
        "SubmissionResult", back_populates="submission", cascade="all, delete-orphan"
    )

    def __repr__(self) -> str:
        return (
            f"<Submission(id={self.id}, "
            f"file={self.original_filename}, "
            f"status={self.status})>"
        )


class SubmissionResult(Base):
    __tablename__ = "submission_results"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    submission_id: Mapped[int] = mapped_column(
        ForeignKey("submissions.id"), nullable=False
    )
    rule_id: Mapped[int | None] = mapped_column(
        ForeignKey("validation_rules.id"), nullable=True
    )
    step_id: Mapped[int | None] = mapped_column(
        ForeignKey("workflow_steps.id"), nullable=True
    )
    status: Mapped[str] = mapped_column(
        String(50), nullable=False
    )  # pass, fail, error
    details: Mapped[dict] = mapped_column(JSON, nullable=False, default=dict)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    # Relationships
    submission = relationship("Submission", back_populates="results")
    rule = relationship("ValidationRule")

    def __repr__(self) -> str:
        return (
            f"<SubmissionResult(id={self.id}, "
            f"submission_id={self.submission_id}, "
            f"status={self.status})>"
        )