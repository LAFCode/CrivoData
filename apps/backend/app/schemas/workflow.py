"""Workflow Pydantic schemas."""

from datetime import datetime
from pydantic import BaseModel


class WorkflowStepBase(BaseModel):
    step_order: int
    step_type: str
    config: dict = {}


class WorkflowStepCreate(WorkflowStepBase):
    pass


class WorkflowStepRead(WorkflowStepBase):
    id: int
    version_id: int
    created_at: datetime

    model_config = {"from_attributes": True}


class WorkflowVersionBase(BaseModel):
    version_number: int
    config: dict = {}
    is_draft: bool = True


class WorkflowVersionCreate(WorkflowVersionBase):
    steps: list[WorkflowStepCreate] = []


class WorkflowVersionRead(WorkflowVersionBase):
    id: int
    workflow_id: int
    created_at: datetime
    steps: list[WorkflowStepRead] = []

    model_config = {"from_attributes": True}


class WorkflowBase(BaseModel):
    name: str
    description: str | None = None
    status: str = "draft"
    workflow_type: str | None = None
    group_name: str | None = None
    recurrence_type: str | None = None
    expected_files_count: int = 1


class WorkflowCreate(WorkflowBase):
    pass


class WorkflowUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    status: str | None = None
    workflow_type: str | None = None
    group_name: str | None = None
    recurrence_type: str | None = None
    expected_files_count: int | None = None
    is_active: bool | None = None


class WorkflowRead(WorkflowBase):
    id: int
    is_active: bool
    owner_id: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class WorkflowList(BaseModel):
    id: int
    name: str
    description: str | None
    status: str
    workflow_type: str | None
    group_name: str | None
    recurrence_type: str | None
    expected_files_count: int
    is_active: bool
    owner_id: int
    created_at: datetime

    model_config = {"from_attributes": True}