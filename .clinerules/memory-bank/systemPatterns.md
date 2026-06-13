# System Patterns

## System Architecture
The system follows a modular architecture with clear separation of concerns:

```
Frontend (React/Vite)
    ↕ HTTP/REST
API (FastAPI)
    ↕
Validation Engine  ←→  Workers (Celery)
    ↕                    ↕
Storage (S3)         Redis/PostgreSQL
    ↕
Audit System
```

## Architecture Decisions
- **Frontend/Backend Separation** - React SPA communicates with FastAPI backend via REST
- **Async Processing** - Celery workers handle heavy validation tasks asynchronously
- **Event-Driven** - Validation events trigger notifications and audit logging
- **Plugin-Based Validation** - Rules are modular and extensible

## Key Design Patterns

### Frontend Patterns
1. **Module-Based Organization** - Each feature (workflows, submissions, dashboard, etc.) is a self-contained module with its own pages, components, and services
2. **Shared Component Library** - Common UI components in `shared/components/` for consistency
3. **Service Layer** - API communication abstracted through services in `shared/services/`
4. **Provider Pattern** - Global state and context managed through `AppProviders`
5. **Zustand for State** - Lightweight state management with zustand stores

### Frontend Modules
- **Dashboard** - Overview and metrics
- **Workflows** - Pipeline configuration and management
- **Submissions** - File uploads and validation results
- **Notifications** - Alert and notification management
- **Settings** - User and system configuration

### Component Tree
```
AppProviders
└── AppRouter
    └── NavigationShell
        ├── DashboardPage (/)
        ├── SubmissionsPage (/submissions)
        ├── WorkflowsPage (/workflows)
        ├── WorkflowFormPage (/workflows/new)
        ├── NotificationsPage (/notifications)
        └── SettingsPage (/settings)
```

### Data Flow
1. User uploads file through Submission module
2. Frontend sends file to API
3. API triggers async Celery task
4. Validation engine processes file against pipeline rules
5. Results stored and audit trail recorded
6. Notifications sent to relevant stakeholders
7. Frontend polls/websocket updates status

## Critical Implementation Paths
1. **File Ingestion** - Upload → Parse → Validate → Store Results
2. **Workflow Execution** - Pipeline Definition → Rule Application → Result Aggregation
3. **Approval Flow** - Validation Complete → Notify Approver → Approve/Reject → Archive
4. **Audit Trail** - Action → Timestamp → User → Details → Immutable Storage