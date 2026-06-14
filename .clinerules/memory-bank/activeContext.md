# Active Context

## Current Work Focus
Frontend Workflow Form fully enhanced with validation, toast notifications, and improved UX.

## Recent Changes
- **Schedule Preset** changed from `<select>` dropdown to compact selection pills (Hourly, Daily, Weekly, Monthly) with `flex-wrap gap-1.5` inline layout
- **"Enable Workflow" checkbox** removed from Scheduling section
- **Execution Type dropdown** now has a placeholder option and shows validation error styling
- **Mock data removed** from Validation tab — `INITIAL_STATE = []`, users start with empty file list
- **Empty state** added to Validation tab: dashed border box with icon, title, and explanation text
- **useWorkflowFiles hook** updated to support controlled mode — accepts `externalFiles` and `onFilesChange` params so parent's `form.files` is the source of truth
- **WorkflowValidationSection** now passes through `files`/`setFiles` props to the hook
- **Form validation** added on step advance (Next Step) and final submit:
  - Basic: workflow name required
  - Scheduling: execution type required
  - Validation: at least 1 expected file required
- **Toast notifications** shown on validation errors, save success, and save failure (bottom-right, dismissible)
- **WorkflowBasicSection** shows inline error (red border + message) for missing name
- **WorkflowSchedulingSection** shows inline error for missing execution type
- **Initial form state** changed: `files` starts empty, no mock file data

## Current State
- **Frontend**: ~28% complete (auth + workflows connected to backend, form enhancements done)
- **Backend**: ~40% complete (core, auth, validation, ingestion, Celery, Dockerized, workflow CRUD)
- **Infrastructure**: Docker Compose ready

## Docker Compose Services
| Service | Image | Ports |
|---|---|---|
| `postgres` | postgres:16-alpine | 5432 |
| `redis` | redis:7-alpine | 6379 |
| `minio` | minio/minio:latest | 9000, 9001 |
| `backend` | custom (apps/backend/Dockerfile) | 8000 |
| `celery-worker` | custom (same image) | - |

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
| `GET` | `/api/v1/workflows/` | List workflows |
| `GET` | `/api/v1/workflows/{id}` | Get workflow |
| `POST` | `/api/v1/workflows/` | Create workflow |
| `PUT` | `/api/v1/workflows/{id}` | Update workflow |
| `DELETE` | `/api/v1/workflows/{id}` | Delete workflow |

## Next Steps
1. Build remaining API endpoints (submissions, notifications, rules)
2. Implement file upload component
3. Build workflow builder/visual editor
4. Add multi-tenant support
5. Implement approval flow
6. Add database seed data

## Active Decisions and Considerations
- Migration runs automatically on container startup via `alembic upgrade head` in `entrypoint.sh`
- Alembic uses sync `psycopg2` connection for migrations while the app uses async `asyncpg`
- bcrypt pinned to 4.1.3 for passlib compatibility (5.x breaks passlib)
- email-validator installed for Pydantic `EmailStr` support
- Frontend auth uses `crivodata_token` key in localStorage
- Backend login expects `email` + `password` (not username)
- Workflow form submits to `POST /api/v1/workflows/` with mapped fields
- Validation errors shown inline (border + text) and via toast notification
- Toast notifications use `fixed bottom-6 right-6 z-50` positioning, dismissible
- useWorkflowFiles supports controlled mode when parent provides files/setFiles

### Test Results
- 15/15 unit tests pass locally
- Docker health check confirmed: `200 OK`
- Alembic migration logs confirm: `Running upgrade 0001 -> 0002`
- Auth register + login confirmed working
- Workflow CRUD confirmed working (create, list)