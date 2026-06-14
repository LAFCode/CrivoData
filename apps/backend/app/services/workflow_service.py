"""Workflow business logic service."""

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.workflow import Workflow
from app.schemas.workflow import WorkflowCreate, WorkflowUpdate


class WorkflowService:
    """Encapsulates workflow CRUD operations."""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def list_by_owner(self, owner_id: int) -> list[Workflow]:
        """List all workflows owned by a user."""
        result = await self.db.execute(
            select(Workflow).where(Workflow.owner_id == owner_id).order_by(Workflow.created_at.desc())
        )
        return list(result.scalars().all())

    async def get(self, workflow_id: int, owner_id: int) -> Workflow | None:
        """Get a single workflow by id, checking ownership."""
        result = await self.db.execute(
            select(Workflow).where(
                Workflow.id == workflow_id,
                Workflow.owner_id == owner_id,
            )
        )
        return result.scalar_one_or_none()

    async def create(self, data: WorkflowCreate, owner_id: int) -> Workflow:
        """Create a new workflow."""
        workflow = Workflow(
            name=data.name,
            description=data.description,
            status=data.status,
            workflow_type=data.workflow_type,
            group_name=data.group_name,
            recurrence_type=data.recurrence_type,
            expected_files_count=data.expected_files_count,
            owner_id=owner_id,
        )
        self.db.add(workflow)
        await self.db.flush()
        await self.db.refresh(workflow)
        return workflow

    async def update(self, workflow_id: int, data: WorkflowUpdate, owner_id: int) -> Workflow | None:
        """Update an existing workflow."""
        workflow = await self.get(workflow_id, owner_id)
        if workflow is None:
            return None
        update_data = data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(workflow, field, value)
        await self.db.flush()
        await self.db.refresh(workflow)
        return workflow

    async def delete(self, workflow_id: int, owner_id: int) -> bool:
        """Delete a workflow."""
        workflow = await self.get(workflow_id, owner_id)
        if workflow is None:
            return False
        await self.db.delete(workflow)
        await self.db.flush()
        return True