"""Workflow business logic service."""

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.workflow import Workflow, WorkflowVersion, WorkflowFileDefinition
from app.schemas.workflow import WorkflowCreate, WorkflowUpdate, WorkflowFileDefinitionCreate


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

    async def create(
        self,
        data: WorkflowCreate,
        owner_id: int,
        file_definitions: list[WorkflowFileDefinitionCreate] | None = None,
    ) -> Workflow:
        """Create a new workflow with version and file definitions."""
        workflow = Workflow(
            name=data.name,
            slug=data.slug,
            description=data.description,
            status=data.status,
            workflow_type=data.workflow_type,
            workflow_group_id=data.workflow_group_id,
            execution_type=data.execution_type,
            recurrence_type=data.recurrence_type,
            cron_expression=data.cron_expression,
            timezone=data.timezone,
            expected_files_count=data.expected_files_count,
            allow_empty_files=data.allow_empty_files,
            max_error_threshold=data.max_error_threshold,
            owner_id=owner_id,
        )
        self.db.add(workflow)
        await self.db.flush()

        # Create initial version (v1)
        version = WorkflowVersion(
            workflow_id=workflow.id,
            version_number=1,
            config={},
            is_draft=True,
        )
        self.db.add(version)
        await self.db.flush()

        # Create file definitions from the files array
        if file_definitions:
            for idx, fd in enumerate(file_definitions):
                file_def = WorkflowFileDefinition(
                    workflow_version_id=version.id,
                    name=fd.name,
                    slug=fd.slug,
                    description=fd.description,
                    allowed_extensions=(
                        {"formats": fd.allowed_extensions}
                        if fd.allowed_extensions else None
                    ),
                    is_required=fd.is_required,
                    accept_multiple=fd.accept_multiple,
                    max_file_size_mb=fd.max_file_size_mb,
                    validation_order=fd.validation_order or idx,
                    schema_columns=(
                        {"columns": fd.schema_columns}
                        if fd.schema_columns else None
                    ),
                    custom_rules=(
                        {"rules": fd.custom_rules}
                        if fd.custom_rules else None
                    ),
                )
                self.db.add(file_def)

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