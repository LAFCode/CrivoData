# Active Context

## Current Work Focus
Frontend Workflows module fully connected to backend API. Auth flow uses real backend API.

## Recent Changes
- **Workflow model** updated with `status`, `group_name`, `workflow_type`, `recurrence_type`, `expected_files_count` fields
- **Alembic migration 0002** created and auto-applied on container startup
- **Workflow CRUD API** endpoints created: GET/POST/PUT/DELETE `/api/v1/workflows/`
- **Workflow service** created with `list_by_owner`, `get`, `create`, `update`, `delete`
- **Frontend workflowService.js** created with Axios client, JWT token injection, 401 redirect
- **WorkflowsPage.jsx** updated to fetch from real API instead of mock data
- **WorkflowFormPage.jsx** updated to call `workflowService.create()` on submit
- **Auth service** updated to use real backend API (`POST /api/v1/auth/login` with `{ email, password }`)
- **LoginPage.jsx** updated to use email field instead of username
- **Token key** aligned: frontend uses `crivodata_token` in localStorage
- **bcrypt** pinned to 4.1.3 in requirements.txt for passlib compatibility

## Current State
- **Frontend**: ~25% complete (auth + workflows connected to backend)
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

### Test Results
- 15/15 unit tests pass locally
- Docker health check confirmed: `200 OK`
- Alembic migration logs confirm: `Running upgrade 0001 -> 0002`
- Auth register + login confirmed working
- Workflow CRUD confirmed working (create, list)