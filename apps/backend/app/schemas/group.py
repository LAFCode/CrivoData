"""Workflow Group Pydantic schemas."""

from datetime import datetime
from pydantic import BaseModel


class WorkflowGroupChildRead(BaseModel):
    id: int
    company_id: int | None = None
    parent_group_id: int | None = None
    name: str
    description: str | None = None
    is_active: bool = True
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class WorkflowGroupRead(BaseModel):
    id: int
    company_id: int | None = None
    parent_group_id: int | None = None
    name: str
    description: str | None = None
    is_active: bool = True
    created_at: datetime
    updated_at: datetime
    children: list[WorkflowGroupChildRead] = []

    model_config = {"from_attributes": True}


class WorkflowGroupCreate(BaseModel):
    name: str
    description: str | None = None
    parent_group_id: int | None = None
    is_active: bool = True
