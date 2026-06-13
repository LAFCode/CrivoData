# Project Brief

## CrivoData - Sistema de Workflows Dinâmicos

CrivoData is a no-code validation workflow system designed for data governance and quality. It allows users to create dynamic validation pipelines without writing code.

### Core Requirements
- **Pipelines configuráveis** - Configurable validation pipelines
- **Regras reutilizáveis** - Reusable validation rules
- **Templates de validação** - Validation templates
- **Versionamento de workflows** - Workflow versioning
- **Fluxos de aprovação** - Approval workflows
- **Regras de notificação** - Notification rules

### Supported File Types
- **MVP**: XLSX, CSV, PDF
- **Future**: JSON, XML, DOCX, Images

### Architecture Components
- API (FastAPI)
- Workers (Celery)
- Validation Engine
- Storage Layer (S3-compatible)
- Frontend (React)
- Audit System

### Enterprise Features (Planned)
- RBAC (Role-Based Access Control)
- Multi-tenant
- Hierarchical approval flows
- Organization management
- Advanced data governance

### Current Status
Early development stage. Focus areas:
- Validation engine
- File ingestion pipeline
- Spreadsheet validation
- PDF processing
- Audit system
- Async processing

### Long-term Vision
Transform into a complete data governance and quality platform with:
- Full SaaS
- Advanced AI automation
- Workflow orchestration
- Integration ecosystem
- Corporate data governance

### License
Apache License 2.0