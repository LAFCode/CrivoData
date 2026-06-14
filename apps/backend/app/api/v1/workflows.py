"""Workflow CRUD API endpoints."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.auth.dependencies import get_current_user
from app.core.auth.schemas import CurrentUser
from app.core.database import get_db
from app.schemas.workflow import WorkflowCreate, WorkflowList, WorkflowRead, WorkflowUpdate, WorkflowFileDefinitionCreate
from app.services.workflow_service import WorkflowService

router = APIRouter(prefix="/workflows", tags=["workflows"])


@router.get("/", response_model=list[WorkflowList])
async def list_workflows(
    current_user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """List all workflows for the authenticated user."""
    service = WorkflowService(db)
    workflows = await service.list_by_owner(current_user.id)
    return workflows


@router.get("/{workflow_id}", response_model=WorkflowRead)
async def get_workflow(
    workflow_id: int,
    current_user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get a single workflow by ID."""
    service = WorkflowService(db)
    workflow = await service.get(workflow_id, current_user.id)
    if workflow is None:
        raise HTTPException(status_code=404, detail="Workflow not found")
    return workflow


@router.post("/", response_model=WorkflowRead, status_code=status.HTTP_201_CREATED)
async def create_workflow(
    data: WorkflowCreate,
    current_user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Create a new workflow with file definitions."""
    service = WorkflowService(db)
    workflow = await service.create(data, current_user.id, data.file_definitions)
    return workflow


@router.put("/{workflow_id}", response_model=WorkflowRead)
async def update_workflow(
    workflow_id: int,
    data: WorkflowUpdate,
    current_user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Update an existing workflow."""
    service = WorkflowService(db)
    workflow = await service.update(workflow_id, data, current_user.id)
    if workflow is None:
        raise HTTPException(status_code=404, detail="Workflow not found")
    return workflow


@router.delete("/{workflow_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_workflow(
    workflow_id: int,
    current_user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Delete a workflow."""
    service = WorkflowService(db)
    deleted = await service.delete(workflow_id, current_user.id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Workflow not found")