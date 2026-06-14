"""FastAPI application entry point."""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.router import router as api_v1_router
from app.core.config import settings
from app.core.validation.engine import engine as validation_engine
from app.core.validation.rules.column_check import (
    ColumnExistsValidator,
    DataTypeValidator,
    RangeValidator,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan: register built-in validators on startup."""
    # Register built-in validators
    validation_engine.register_validator("column_exists", ColumnExistsValidator())
    validation_engine.register_validator("data_type", DataTypeValidator())
    validation_engine.register_validator("range", RangeValidator())
    yield


app = FastAPI(
    title=settings.APP_NAME,
    version="0.1.0",
    description="No-code validation workflow engine for data governance",
    lifespan=lifespan,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(api_v1_router)


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "ok",
        "app": settings.APP_NAME,
        "version": "0.1.0",
    }