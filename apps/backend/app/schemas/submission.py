"""Submission Pydantic schemas."""

from datetime import datetime
from pydantic import BaseModel


class SubmissionCreate(BaseModel):
    workflow_id: int


class SubmissionRead(BaseModel):
    id: int
    workflow_id: int
    owner_id: int
    original_filename: str
    file_type: str
    file_size_bytes: int
    status: str
    error_message: str | None = None
    created_at: datetime
    completed_at: datetime | None = None

    model_config = {"from_attributes": True}


class SubmissionResultRead(BaseModel):
    id: int
    submission_id: int
    rule_id: int | None = None
    step_id: int | None = None
    status: str
    details: dict
    created_at: datetime

    model_config = {"from_attributes": True}