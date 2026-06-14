"""Lookup/normalized Pydantic schemas for workflow enum-like fields."""

from datetime import datetime
from pydantic import BaseModel


class WorkflowStatusRead(BaseModel):
    id: int
    name: str
    description: str | None = None
    is_active: bool = True
    created_at: datetime

    model_config = {"from_attributes": True}


class WorkflowTypeRead(BaseModel):
    id: int
    name: str
    description: str | None = None
    is_active: bool = True
    created_at: datetime

    model_config = {"from_attributes": True}


class RecurrenceTypeRead(BaseModel):
    id: int
    name: str
    description: str | None = None
    is_active: bool = True
    created_at: datetime

    model_config = {"from_attributes": True}


class ExecutionTypeRead(BaseModel):
    id: int
    name: str
    description: str | None = None
    is_active: bool = True
    created_at: datetime

    model_config = {"from_attributes": True}


class TimezoneRead(BaseModel):
    id: int
    name: str
    utc_offset: str | None = None
    description: str | None = None
    is_active: bool = True
    created_at: datetime

    model_config = {"from_attributes": True}
