"""Workflow Groups API endpoint."""

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.auth.dependencies import get_current_user
from app.core.auth.schemas import CurrentUser
from app.core.database import get_db
from app.models.group import WorkflowGroup
from app.schemas.group import WorkflowGroupRead

router = APIRouter(prefix="/workflow-groups", tags=["workflow-groups"])


@router.get("/", response_model=list[WorkflowGroupRead])
async def list_groups(
    current_user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """List all active top-level workflow groups with their children."""
    result = await db.execute(
        select(WorkflowGroup)
        .options(selectinload(WorkflowGroup.children))
        .where(WorkflowGroup.is_active == True)
        .where(WorkflowGroup.parent_group_id == None)
        .order_by(WorkflowGroup.name)
    )
    groups = list(result.scalars().all())
    return groups
