"""ValidationRule Pydantic schemas."""

from datetime import datetime
from pydantic import BaseModel


class ValidationRuleBase(BaseModel):
    name: str
    description: str | None = None
    rule_type: str
    config: dict = {}


class ValidationRuleCreate(ValidationRuleBase):
    pass


class ValidationRuleUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    rule_type: str | None = None
    config: dict | None = None
    is_active: bool | None = None


class ValidationRuleRead(ValidationRuleBase):
    id: int
    is_builtin: bool
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}