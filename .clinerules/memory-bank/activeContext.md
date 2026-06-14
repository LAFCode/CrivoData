# Active Context

## Current Work Focus
Full data persistence for Workflow Form — all form fields now sent to API and saved to database, including file definitions (validation archives).

## Recent Changes
### Form Validation & UX Fixes
- **Inline errors on all tabs on "Save"** — `validateStep` was called 3 times sequentially, each overwriting `validationErrors` state. Fixed by introducing `collectAllErrors()` which builds a single merged errors object and sets state once.
- **"Next Step" no longer auto-saves** — removed the API call (`workflowService.create/update`) that ran when leaving the Scheduling step. `handleNextStep` now only validates and advances.
- **Unused `isSaving` state removed** — cleaned up component.

### Group Validation Added
- **Group field (workflow_group_id)** — validation added to both `collectAllErrors()` and `validateStep('basic')`. Inline error display (red border + message) added to the Group `<select>` in `WorkflowBasicSection`.

### Full Data Persistence
- **14/14 form fields now sent to API** — previously only 6 were mapped, rest were dropped.
- **`WorkflowFileDefinition` model created** — new table `workflow_file_definitions` stores the full file definition data from the Validation tab (name, pattern, formats, columns, custom rules).
- **WorkflowVersion auto-created** — `WorkflowService.create()` now creates an initial version (v1) and attaches file definitions to it.
- **8 new tables added** to match the DB diagram:
  - `workflow_file_definitions` — expected file definitions with schema columns and custom rules
  - `workflow_validation_rules` — per-step validation rules
  - `workflow_approval_configs` — approval configuration per version
  - `workflow_executions` — execution runs
  - `workflow_execution_files` — uploaded files per execution
  - `workflow_execution_steps` — step results per execution
  - `workflow_execution_logs` — execution log entries
  - `workflow_approvals` — approval records

### Migration Idempotency
- Migrations 0003 and 0004 now check if columns/tables exist before creating them, preventing "already exists" errors.

## Current State
- **Frontend**: ~30% complete (full workflow form persistence working)
- **Backend**: ~45% complete (all workflow tables created, CRUD with file definitions)
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
| `POST` | `/api/v1/workflows/` | Create workflow (with file_definitions) |
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
- Migrations 0003 and 0004 are idempotent — check column/table existence before creating
- bcrypt pinned to 4.1.3 for passlib compatibility (5.x breaks passlib)
- email-validator installed for Pydantic `EmailStr` support
- Frontend auth uses `crivodata_token` key in localStorage
- Backend login expects `email` + `password` (not username)
- Workflow form submits to `POST /api/v1/workflows/` with all fields + `file_definitions[]`
- `WorkflowService.create()` auto-creates version v1 and links file definitions
- Validation errors shown inline (border + text) and via toast notification
- Toast notifications use `fixed bottom-6 right-6 z-50` positioning, dismissible
- useWorkflowFiles supports controlled mode when parent provides files/setFiles

### Test Results
- 15/15 unit tests pass locally
- Docker health check confirmed: `200 OK`
- Auth register + login confirmed working
- Workflow CRUD confirmed working (create with file definitions, list)