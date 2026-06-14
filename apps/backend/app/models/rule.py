"""ValidationRule model."""

from datetime import datetime, timezone
from sqlalchemy import Boolean, DateTime, String, Text, JSON
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class ValidationRule(Base):
    __tablename__ = "validation_rules"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    rule_type: Mapped[str] = mapped_column(
        String(100), nullable=False
    )  # e.g., "column_exists", "data_type", "range", "regex", "custom"
    config: Mapped[dict] = mapped_column(JSON, nullable=False, default=dict)
    is_builtin: Mapped[bool] = mapped_column(Boolean, default=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    def __repr__(self) -> str:
        return f"<ValidationRule(id={self.id}, name={self.name}, type={self.rule_type})>"