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


class WorkflowFileDefinitionCreate(BaseModel):
    """Schema for creating a file definition within a workflow version."""
    name: str
    slug: str | None = None
    description: str | None = None
    allowed_extensions: list[str] | None = None
    is_required: bool = True
    accept_multiple: bool = False
    max_file_size_mb: int = 10
    validation_order: int = 0
    schema_columns: list[dict] | None = None
    custom_rules: list[dict] | None = None


class WorkflowBase(BaseModel):
    name: str
    slug: str | None = None
    description: str | None = None
    status: str = "draft"
    workflow_type: str | None = None
    group_name: str | None = None
    subgroup_name: str | None = None
    execution_type: str | None = None
    recurrence_type: str | None = None
    cron_expression: str | None = None
    timezone: str | None = None
    expected_files_count: int = 1
    allow_empty_files: bool = False
    max_error_threshold: int = 0


class WorkflowCreate(WorkflowBase):
    file_definitions: list[WorkflowFileDefinitionCreate] = []


class WorkflowUpdate(BaseModel):
    name: str | None = None
    slug: str | None = None
    description: str | None = None
    status: str | None = None
    workflow_type: str | None = None
    group_name: str | None = None
    subgroup_name: str | None = None
    execution_type: str | None = None
    recurrence_type: str | None = None
    cron_expression: str | None = None
    timezone: str | None = None
    expected_files_count: int | None = None
    allow_empty_files: bool | None = None
    max_error_threshold: int | None = None
    is_active: bool | None = None


class WorkflowRead(WorkflowBase):
    id: int
    is_active: bool
    owner_id: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class WorkflowFileDefinitionRead(BaseModel):
    id: int
    workflow_version_id: int
    name: str
    slug: str | None = None
    description: str | None = None
    allowed_extensions: dict | None = None
    is_required: bool = True
    accept_multiple: bool = False
    max_file_size_mb: int = 10
    validation_order: int = 0
    schema_columns: dict | None = None
    custom_rules: dict | None = None
    created_at: datetime

    model_config = {"from_attributes": True}


class WorkflowList(BaseModel):
    id: int
    name: str
    slug: str | None = None
    description: str | None = None
    status: str
    workflow_type: str | None = None
    group_name: str | None = None
    subgroup_name: str | None = None
    execution_type: str | None = None
    recurrence_type: str | None = None
    cron_expression: str | None = None
    timezone: str | None = None
    expected_files_count: int
    allow_empty_files: bool = False
    max_error_threshold: int = 0
    is_active: bool
    owner_id: int
    created_at: datetime

    model_config = {"from_attributes": True}