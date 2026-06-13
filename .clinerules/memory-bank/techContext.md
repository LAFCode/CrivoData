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

### Backend (Planned/Architecture)
- **FastAPI** - Python web framework for API
- **Celery** - Distributed task queue for async processing
- **Redis** - Message broker for Celery
- **PostgreSQL** - Primary database
- **S3-compatible Storage** - File storage layer

### Infrastructure (Planned)
- **Docker** - Containerization
- **Kubernetes** - Orchestration

## Development Setup
- Frontend runs on Vite dev server (default port typically 5173)
- Backend runs on FastAPI (likely port 8000)
- Python environment for backend development
- Node.js for frontend development

## Technical Constraints
- Frontend is a React SPA - all routing is client-side
- No backend code exists yet in the repository (API, workers, validation engine)
- No authentication/authorization implemented yet
- `AppProviders` is currently a pass-through component (no providers wired up)
- Internationalization is configured but not populated (i18n config exists, locales empty)

## Dependencies
- **Node.js** (required for frontend)
- **npm** (package manager)
- **Python** (for backend when implemented)

## Tool Usage Patterns
- `@/` path alias configured pointing to `src/` directory
- JSX for React components
- ES Modules (type: "module" in package.json)
- Tailwind CSS classes for styling
- Module-based folder organization under `src/modules/`
- Shared components under `src/shared/components/`