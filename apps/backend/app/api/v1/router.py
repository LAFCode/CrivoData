"""Aggregate all v1 API routers."""

from fastapi import APIRouter

from app.api.v1.auth import router as auth_router
from app.api.v1.workflows import router as workflows_router
from app.api.v1.groups import router as groups_router

router = APIRouter(prefix="/api/v1")
router.include_router(auth_router)
router.include_router(workflows_router)
router.include_router(groups_router)
