# Progress

## What Works
### Backend (Implemented)
- **FastAPI project structure** scaffolded under `apps/backend/`
- **Core modules**: config (Pydantic Settings), async database (SQLAlchemy + asyncpg), JWT security
- **Auth system**: JWT-based with register/login/refresh endpoints, bearer token dependency
- **5 SQLAlchemy models** (8 tables): User, Workflow (with WorkflowVersion, WorkflowStep), Submission (with SubmissionResult), ValidationRule, Notification
- **Pydantic schemas** for all models (User, Workflow, Submission, ValidationRule)
- **Validation engine**: Plugin-based architecture with `BaseValidator` abstract class, `ValidationEngine` orchestrator, 3 built-in validators (ColumnExists, DataType, Range)
- **File ingestion**: Parsers for XLSX, CSV, PDF using pandas + PyPDF2 (factory pattern)
- **Celery worker**: Async `process_submission` task configured with Redis broker
- **Service layer**: `AuthService` encapsulates login/register/refresh business logic
- **Workflow service**: `WorkflowService` with `list_by_owner`, `get`, `create`, `update`, `delete`
- **Workflow CRUD API**: GET/POST/PUT/DELETE `/api/v1/workflows/` with JWT auth
- **Alembic**: Migration config with initial migration (0001) + workflow fields migration (0002)
- **15 unit tests** passing (security/JWT + validation engine/rules)
- **Docker**: Full Docker Compose with 5 services
- **Automatic migrations**: `entrypoint.sh` runs `alembic upgrade head` on startup

### Frontend (Implemented)
- **Frontend scaffolding**: Vite + React project initialized with all dependencies installed
- **Routing structure**: React Router configured with 6 routes (Dashboard, Submissions, Workflows, WorkflowForm, Notifications, Settings)
- **Module organization**: Feature-based directory structure established across 5 modules
- **Shared components**: Base components created (EmptyState, FileTypeIcon, PageHeader, StatusBadge, NavigationShell, UI primitives)
- **i18n configuration**: i18next configured with browser language detector, locale files created (empty)
- **Utility functions**: cn() helper for Tailwind class merging
- **Auth service**: Real backend API integration (`POST /api/v1/auth/login` with `{ email, password }`)
- **LoginPage**: Updated to use email field instead of username
- **Workflow service**: Axios client with JWT token injection, 401 redirect
- **WorkflowsPage**: Fetches from real API, dynamic group/status filters, loading/error states
- **WorkflowFormPage**: Full form with 3-step wizard (Basic, Scheduling, Validation), validation, toast notifications
- **Schedule Preset**: Compact selection pills instead of dropdown (Hourly, Daily, Weekly, Monthly)
- **Validation tab**: Empty state with dashed border box, no mock data, controlled file management via parent state
- **Form validation**: Inline errors (red border + text) + toast notifications on all required fields
- **Toast notifications**: Bottom-right dismissible toasts for validation errors, save success/failure
- **useWorkflowFiles hook**: Supports controlled mode (parent-provided files/setFiles)

## What's Left to Build

### Frontend
- [ ] Wire up AppProviders with actual providers (React Query, Zustand, auth, theme)
- [ ] Implement page content for remaining modules (Dashboard, Submissions, Notifications, Settings)
- [ ] Build NavigationShell with working navigation
- [ ] Implement state management stores (zustand)
- [ ] Populate i18n translations
- [ ] Implement file upload component
- [ ] Build workflow builder/visual editor
- [ ] Create notification management UI

### Backend (API Endpoints)
- [ ] Submissions CRUD + file upload endpoints
- [ ] Notifications CRUD endpoints
- [ ] Validation Rules CRUD endpoints
- [ ] Database seed data for built-in validation rules

### Infrastructure
- [ ] Kubernetes manifests (optional)
- [ ] CI/CD pipeline
- [ ] Monitoring and logging

### Testing
- [ ] Frontend unit tests
- [ ] Backend integration tests (API endpoints)
- [ ] E2E testing

## Current Status
**Phase**: Early Development - Foundation
**Frontend**: ~28% complete (auth + workflows connected to backend, form enhancements done)
**Backend**: ~40% complete (core, auth, validation, ingestion, Celery, Dockerized, workflow CRUD)
**Infrastructure**: Docker Compose ready

## Known Issues
- bcrypt 5.x incompatible with passlib — pinned to `4.1.3`
- email-validator required for Pydantic EmailStr

## Evolution of Project Decisions
- Frontend started as a React SPA with Vite (standard modern setup)
- Module-based architecture chosen for scalability (both frontend and backend)
- Async SQLAlchemy for performance; sync fallback for Celery workers
- Validation engine uses Strategy pattern with plugin-based registration
- Docker Compose with health checks ensures ordered service startup
- Alembic runs migrations via sync psycopg2 while app uses async asyncpg
- Frontend auth uses `crivodata_token` key in localStorage
- Backend login expects `email` + `password` (not username)
- Workflow form submits to `POST /api/v1/workflows/` with mapped fields
- Schedule Preset uses pill-shaped buttons for compact inline UX
- useWorkflowFiles supports controlled/uncontrolled dual mode
- Validation errors shown both inline and via toast notification