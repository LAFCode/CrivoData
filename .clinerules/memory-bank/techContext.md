# Tech Context

## Technologies Used

### Frontend
- **React 19** - UI library
- **Vite 8** - Build tool and dev server
- **React Router DOM 7** - Client-side routing
- **Zustand 5** - Lightweight state management
- **Tailwind CSS 4** - Utility-first CSS framework (via Vite plugin)
- **TanStack React Query 5** - Server state management and caching
- **Axios** - HTTP client for API requests
- **Lucide React** - Icon library
- **i18next 26** / **react-i18next 17** - Internationalization
- **ESLint 10** - Code linting

### Backend (Implemented)
- **FastAPI** - Python web framework for API (port 8000)
- **SQLAlchemy 2.0 async** - Async ORM with asyncpg driver
- **Alembic** - Database migrations (sync via psycopg2)
- **Pydantic 2** - Data validation with Settings management
- **Celery 5.4** - Distributed task queue for async processing
- **Redis 7** - Message broker for Celery + caching
- **PostgreSQL 16** - Primary database
- **MinIO** - S3-compatible file storage
- **JWT (python-jose)** - Token-based authentication
- **bcrypt 4.x** (pinned <4.2) - Password hashing via passlib
- **pandas + openpyxl + PyPDF2** - File ingestion/parsing
- **pytest + pytest-asyncio** - Testing framework

### Infrastructure (Implemented)
- **Docker** - Containerization with Dockerfile
- **Docker Compose** - 5 service orchestration

### Development Setup
- Frontend runs on Vite dev server (port 5173)
- Backend runs on FastAPI (port 8000) — locally or via Docker
- Python 3.12.9 via pyenv with pip + virtualenv
- Node.js for frontend development

## Technical Constraints
- Frontend is a React SPA - all routing is client-side
- `AppProviders` is currently a pass-through component (no providers wired up)
- Internationalization is configured but not populated (i18n config exists, locales empty)
- bcrypt must stay <4.2 for passlib compatibility
- email-validator required for Pydantic `EmailStr` fields
- Alembic migrations use sync psycopg2 while app uses async asyncpg
- `PYTHONPATH=/app` needed in Docker for module resolution

## Dependencies
- **Node.js** (required for frontend)
- **npm** (package manager)
- **Python 3.12** (for backend)
- **Docker + Docker Compose** (for containerized deployment)

## Tool Usage Patterns
- `@/` path alias configured pointing to `src/` directory
- JSX for React components
- ES Modules (type: "module" in package.json)
- Tailwind CSS classes for styling
- Module-based folder organization under `src/modules/`
- Shared components under `src/shared/components/`
- Backend: module-based layout with `api/`, `core/`, `models/`, `schemas/`, `services/`, `tasks/`, `workers/`