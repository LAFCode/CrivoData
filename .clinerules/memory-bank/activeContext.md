# Active Context

## Current Work Focus
Implemented mock authentication system with modern login page.

## Recent Changes
- **Auth module** created under `src/modules/auth/` with service, store, page, and components
- **Login page** — modern split-panel design with branding sidebar and form card
- **Auth store** (Zustand) with login, logout, session validation, and error handling
- **Auth service** — mock layer easily swappable to real API (same return shape)
- **ProtectedRoute** component wrapping all authenticated routes
- **Routing** updated: `/login` is public, all other routes require authentication
- **Sidebar** now reads user from auth store (instead of hardcoded)
- **Logout button** added to SidebarUser

## Current State
- **Frontend**: ~20% complete (scaffold + auth + routing, pages still placeholder)
- **Backend**: 0% complete
- **Infrastructure**: 0% complete

## Next Steps
1. Build out page components with real UI content (Dashboard, Workflows, Submissions, etc.)
2. Create API service layer in shared/services/
3. Implement backend (FastAPI + Celery workers)
4. Build validation engine
5. Implement file ingestion pipeline

## Active Decisions and Considerations

### Auth Implementation
- Zustand store with localStorage persistence for token/user
- Service layer abstracts mock vs real API — switch by editing `authService.js`
- Protected routes use wrapper pattern (ProtectedRoute component)
- Logout clears local state and redirects to /login
- Default credentials: `admin` / `admin123`

### Internationalization
i18n config and locale structure exists but translations are empty. Consider:
- Default language (Portuguese? English?)
- Translation strategy (inline vs separate files)
- When to populate translations (now vs later)

### Backend Architecture
Backend is fully unimplemented. Key decisions pending:
- Project structure (monorepo in /apps/backend? or /backend/?)
- API contract design
- Authentication strategy

## Important Patterns and Preferences
- Module-based frontend organization (already established)
- Shared components library pattern
- Service layer for API abstraction
- Tailwind CSS for styling (Vite plugin integration)
- `@/` path alias pointing to `src/`
- Zustand stores for client state (auth, etc.)
- Protected routes with Navigate redirect

## Learnings and Project Insights
- Project is in very early development stage
- Frontend has good foundational structure but no real UI content
- Backend is completely unimplemented
- Enterprise features (RBAC, multi-tenant) are planned but not started
- Portuguese README suggests target audience or development team may be Portuguese/Brazilian