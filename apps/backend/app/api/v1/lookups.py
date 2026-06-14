"""Lookup table API endpoints for normalized workflow enum fields."""

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.auth.dependencies import get_current_user
from app.core.auth.schemas import CurrentUser
from app.core.database import get_db
from app.models.lookup import (
    WorkflowStatus,
    WorkflowType,
    RecurrenceType,
    ExecutionType,
    Timezone,
)
from app.schemas.lookup import (
    WorkflowStatusRead,
    WorkflowTypeRead,
    RecurrenceTypeRead,
    ExecutionTypeRead,
    TimezoneRead,
)

router = APIRouter(prefix="/lookups", tags=["lookups"])


@router.get("/workflow-statuses", response_model=list[WorkflowStatusRead])
async def list_workflow_statuses(
    current_user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """List all active workflow statuses."""
    result = await db.execute(
        select(WorkflowStatus).where(WorkflowStatus.is_active == True).order_by(WorkflowStatus.name)
    )
    return list(result.scalars().all())


@router.get("/workflow-types", response_model=list[WorkflowTypeRead])
async def list_workflow_types(
    current_user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """List all active workflow types."""
    result = await db.execute(
        select(WorkflowType).where(WorkflowType.is_active == True).order_by(WorkflowType.name)
    )
    return list(result.scalars().all())


@router.get("/recurrence-types", response_model=list[RecurrenceTypeRead])
async def list_recurrence_types(
    current_user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """List all active recurrence types."""
    result = await db.execute(
        select(RecurrenceType).where(RecurrenceType.is_active == True).order_by(RecurrenceType.name)
    )
    return list(result.scalars().all())


@router.get("/execution-types", response_model=list[ExecutionTypeRead])
async def list_execution_types(
    current_user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """List all active execution types."""
    result = await db.execute(
        select(ExecutionType).where(ExecutionType.is_active == True).order_by(ExecutionType.name)
    )
    return list(result.scalars().all())


@router.get("/timezones", response_model=list[TimezoneRead])
async def list_timezones(
    current_user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """List all active timezones."""
    result = await db.execute(
        select(Timezone).where(Timezone.is_active == True).order_by(Timezone.name)
    )
    return list(result.scalars().all())
