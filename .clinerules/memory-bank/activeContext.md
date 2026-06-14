# Active Context

## Current Work Focus
Workflow Groups architecture refactored to self-referencing `workflow_groups` table (single table with `parent_group_id` instead of separate `workflow_groups` + `workflow_subgroups` tables). Migration 0007 is the sole migration for groups (0005 and 0006 deleted).

## Recent Changes
### Migration Cleanup
- **Deleted `0005_add_workflow_groups_and_subgroups.py`** — replaced by 0007
- **Deleted `0006_migrate_group_name_to_group_id.py`** — replaced by 0007
- **`entrypoint.sh`** — simplified to just `alembic upgrade head` (no more Python cleanup script)
- **Migration 0007** — `down_revision = "0004"`, only migration in `versions/` directory for groups

### Group Schema Fix
- **`WorkflowGroupRead`** — split into `WorkflowGroupChildRead` (no children field) and `WorkflowGroupRead` (with `children: list[WorkflowGroupChildRead]`) to avoid Pydantic v2 recursive model serialization issues
- **`WorkflowGroupChildRead`** — same fields as parent but without `children` attribute
- Removed `from __future__ import annotations` from `group.py` to prevent forward reference resolution issues

### Group Architecture (Self-Referencing)
- **`workflow_groups` table** — redesigned with self-referencing `parent_group_id` FK → `workflow_groups.id`. Top-level groups have `parent_group_id IS NULL`, children reference their parent.
- **`workflow_subgroups` table removed** — hierarchy is now handled entirely within `workflow_groups` via `parent_group_id`.
- **Migration 0007** — replaces 0005+0006 entirely. `down_revision = "0004"`. Drops `workflow_subgroups`, recreates `workflow_groups` with self-ref, drops old `group_id`/`subgroup_id` columns, adds `workflow_group_id` FK.
- **`WorkflowGroup` model** — self-referencing relationship: `parent` and `children` via `remote_side`.
- **Groups API** — `GET /api/v1/workflow-groups/` returns only **top-level** groups (`.where(WorkflowGroup.parent_group_id == None)`) with children eager-loaded via `selectinload`.
- **Seed data** — Migration 0007 seeds 3 top-level groups (HR, Finance, Operations) with 8 children (payroll, recruitment, benefits, accounts-payable, accounts-receivable, billing, logistics, supply-chain).

### Workflow Schema Fixes
- **`WorkflowCreate`** — added missing scheduling fields: `execution_type`, `recurrence_type`, `cron_expression`, `timezone`, `expected_files_count`, `allow_empty_files`, `max_error_threshold`.
- **`WorkflowRead`** — added same scheduling fields so GET/POST/PUT responses include them.

### Auto-Save on "Next Step" from Scheduling
- **"Next Step" now auto-saves** — when clicking "Next Step" on the Scheduling step, the form data is saved to the API (`workflowService.create()` or `update()` if already saved). The workflow ID is tracked via `savedWorkflowId` state. Button shows "Saving..." while the request is in flight. On save failure, the step does NOT advance.
- **`handleNextStep` function** — uses `useCallback` with dependencies. If `savedWorkflowId` exists, calls `update()`; otherwise calls `create()` and stores the returned ID.
- **Final "Save Workflow"** — now uses `update()` if `savedWorkflowId` exists to avoid duplicate creation.
- New states: `savedWorkflowId`, `isSaving`.

### Workflow Groups (DB-backed, self-ref)
- **`WorkflowBasicSection`** — fetches groups from `GET /api/v1/workflow-groups/`, flattens top-level + children into a single `<select>` with indentation for visual hierarchy.
- Group select is disabled while loading; shows "Loading..." option text.
- Frontend `groupService` uses same Axios instance pattern with JWT interceptor.

### Development Infrastructure
- **`docker-compose.dev.yml`** — development override with volume mounts for hot-reload: backend (`--reload`), celery-worker (`--autoreload`), and frontend (Vite HMR on port 5173).
- **`apps/frontend/Dockerfile.dev`** — Node 22 Alpine image running `npm run dev -- --host 0.0.0.0`.

## Current State
- **Frontend**: ~35% complete (groups now DB-backed with self-ref hierarchy, auto-save on step transition)
- **Backend**: ~50% complete (self-referencing workflow_groups, CRUD + API, 3 migrations total — 0001-0004 + 0007)
- **Infrastructure**: Docker Compose ready with dev override

## Docker Compose Services (Production)
| Service | Image | Ports |
|---|---|---|
| `postgres` | postgres:16-alpine | 5432 |
| `redis` | redis:7-alpine | 6379 |
| `minio` | minio/minio:latest | 9000, 9001 |
| `backend` | custom (apps/backend/Dockerfile) | 8000 |
| `celery-worker` | custom (same image) | - |

## Docker Compose Services (Development — override)
- Adds `frontend` service (Vite HMR on 5173)
- Backend command overridden to `uvicorn --reload`
- Celery command overridden with `--autoreload`
- Volume mounts for live code editing

## Development Credentials
- **Email**: `test@test.com`
- **Password**: `test123`

## API Endpoints
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/auth/register` | Register user |
| `POST` | `/api/v1/auth/login` | Login (email + password) |
| `POST` | `/api/v1/auth/refresh` | Refresh token |
| `GET` | `/api/v1/auth/me` | Current user |
| `GET` | `/api/v1/workflow-groups/` | List top-level groups with children |
| `GET` | `/api/v1/workflows/` | List workflows |
| `GET` | `/api/v1/workflows/{id}` | Get workflow |
| `POST` | `/api/v1/workflows/` | Create workflow (with file_definitions) |
| `PUT` | `/api/v1/workflows/{id}` | Update workflow |
| `DELETE` | `/api/v1/workflows/{id}` | Delete workflow |

## Next Steps
1. Build remaining API endpoints (submissions, notifications, rules)
2. Implement file upload component
3. Build workflow builder/visual editor
4. Add multi-tenant support
5. Implement approval flow
6. Add database seed data for built-in validation rules

## Active Decisions and Considerations
- Migration runs automatically on container startup via `alembic upgrade head` in `entrypoint.sh`
- Alembic uses sync `psycopg2` connection for migrations while the app uses async `asyncpg`
- Migrations 0003, 0004, 0007 are idempotent — check column/table existence before creating
- **Migration 0007 replaces 0005+0006** — old migration files deleted from `versions/` directory
- bcrypt pinned to 4.1.3 for passlib compatibility (5.x breaks passlib)
- email-validator installed for Pydantic `EmailStr` support
- Frontend auth uses `crivodata_token` key in localStorage
- Backend login expects `email` + `password` (not username)
- Workflow form submits to `POST /api/v1/workflows/` with all fields + `file_definitions[]`
- `WorkflowService.create()` auto-creates version v1 and links file definitions
- Group select on WorkflowBasicSection fetches from `GET /api/v1/workflow-groups/`
- Group select is disabled while loading; shows "Loading..." option text
- Groups are displayed as a flat list with children indented under parents
- Frontend `groupService` uses same Axios instance pattern with JWT interceptor
- "Next Step" from Scheduling auto-saves workflow, tracks `savedWorkflowId`, blocks advance on failure
- Validation errors shown inline (border + text) and via toast notification
- Toast notifications use `fixed bottom-6 right-6 z-50` positioning, dismissible
- useWorkflowFiles supports controlled mode when parent provides files/setFiles
- Dev override (`docker-compose.dev.yml`) adds frontend Vite HMR service + backend `--reload`
- Frontend Dockerfile.dev uses Node 22 Alpine, runs `npm run dev -- --host 0.0.0.0`
- Migration 0007 seeds 3 top-level groups (HR, Finance, Operations) with 8 children
- **Pydantic schema fix**: `WorkflowGroupRead` uses separate `WorkflowGroupChildRead` for children to avoid recursive model serialization issues
- **`from __future__ import annotations` removed** from `group.py` to prevent forward reference resolution problems with Pydantic v2

### Test Results
- 15/15 unit tests pass locally
- Docker health check confirmed: all 6 services healthy
- Auth register + login confirmed working
- Workflow CRUD confirmed working (create with file definitions, list)
- Groups seed data verified: 3 top-level groups, 8 children in PostgreSQL
- Groups API returns proper nested JSON with children arrays
