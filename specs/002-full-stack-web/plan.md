# Implementation Plan: Phase II Full-Stack Web Todo Application

**Branch**: `002-full-stack-web` | **Date**: 2025-02-06 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-full-stack-web/spec.md` and Phase II requirements from `phase-2.md`

## Summary

Transform the Phase I console app into a modern multi-user web application with persistent storage, authentication, and responsive UI. The application will use Next.js 16+ for the frontend, FastAPI for the backend API, Neon PostgreSQL for database, and Better Auth for authentication with JWT tokens for service-to-service communication.

## Technical Context

**Language/Version**:
- Frontend: TypeScript 5+ (with Next.js 16+)
- Backend: Python 3.12+

**Primary Dependencies**:
- Frontend: Next.js 16+, React 19+, Better Auth, Tailwind CSS
- Backend: FastAPI, SQLModel, uvicorn, pydantic, python-jose
- Database: Neon Serverless PostgreSQL

**Storage**: Neon Serverless PostgreSQL (hosted PostgreSQL)

**Testing**:
- Frontend: Jest, React Testing Library
- Backend: pytest, httpx
- E2E: Playwright (optional)

**Target Platform**: Web browser (desktop and mobile responsive)

**Project Type**: Full-stack web application (monorepo structure)

**Performance Goals**:
- Page load: <2 seconds initial, <1 second transitions
- API response: <200ms p95 for all endpoints
- Support 1000+ concurrent users

**Constraints**:
- Must use Spec-Driven Development (no manual coding)
- JWT shared secret between frontend and backend for auth
- User data isolation enforced at database level
- Responsive design for screens 375px and larger

**Scale/Scope**: Multi-user SaaS application, each user isolated to their own tasks

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Spec-Driven Development | ✅ PASS | Following Specify → Plan → Tasks → Implement |
| II. Clean Code | ✅ PASS | TypeScript strict mode, PEP 8 for Python, type hints required |
| III. Persistent Storage | ✅ PASS | Neon PostgreSQL with SQLModel (Phase II evolution) |
| IV. Web Interface | ✅ PASS | Next.js 16+ with responsive Tailwind CSS design |
| V. Multi-User | ✅ PASS | Better Auth + JWT enforces user data isolation |
| VI. Minimum Viable Product | ✅ PASS | Core 5 features + authentication only |

**Note**: The constitution has evolved from Phase I (console, in-memory) to Phase II (web, persistent database). This is documented as part of the "Evolution of Todo" project.

## Project Structure

### Documentation (this feature)

```text
specs/002-full-stack-web/
├── spec.md              # Feature requirements
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0: Technology research
├── data-model.md        # Phase 1: Database schema
├── quickstart.md        # Phase 1: Setup instructions
├── contracts/           # Phase 1: API specifications
│   ├── openapi.yaml     # OpenAPI spec for FastAPI
│   └── api-clients.md   # API usage examples
└── tasks.md             # Phase 2: Implementation tasks (/sp.tasks command)
```

### Source Code (repository root)

```text
# Web application structure (frontend + backend)

backend/                          # FastAPI REST API
├── main.py                     # FastAPI app entry point
├── models.py                   # SQLModel database models
├── db.py                       # Database connection and session
├── auth.py                     # JWT verification middleware
├── config.py                   # Configuration management
├── routes/
│   ├── __init__.py
│   ├── tasks.py               # Task CRUD endpoints
│   └── auth.py                # Authentication endpoints (if needed)
├── tests/
│   ├── __init__.py
│   ├── test_tasks.py
│   └── test_auth.py
└── pyproject.toml             # Python dependencies

frontend/                        # Next.js 16+ App Router application
├── app/
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Landing/redirect
│   ├── (auth)/                # Auth route group
│   │   ├── layout.tsx         # Auth layout (no header/footer)
│   │   ├── login/
│   │   │   └── page.tsx       # Login page
│   │   └── signup/
│   │       └── page.tsx       # Signup page
│   └── dashboard/             # Protected route group
│       ├── layout.tsx         # Dashboard layout
│       └── page.tsx           # Main todo app
├── components/
│   ├── TaskList.tsx           # Display all tasks
│   ├── TaskItem.tsx           # Single task with actions
│   ├── TaskForm.tsx           # Create/edit task form
│   ├── FilterBar.tsx          # Filter and sort controls
│   └── AuthButton.tsx         # Login/signup/logout button
├── lib/
│   ├── api.ts                 # API client with JWT handling
│   └── utils.ts               # Helper functions
├── styles/
│   └── globals.css            # Global styles + Tailwind
├── package.json
├── tsconfig.json
└── next.config.js

CLAUDE.md                        # Root: monorepo navigation guide
.env                             # Environment variables
.env.example                     # Environment template
docker-compose.yml               # Local development (optional)
README.md                        # Project documentation
```

**Structure Decision**: Web application structure chosen because Phase II requires a full-stack application with separate frontend and backend. The monorepo structure allows Claude Code to work with both codebases in a single context, enabling cross-cutting changes and simpler navigation.

## Component Design

### Database Schema (`backend/models.py`)

```python
from sqlmodel import SQLModel, Field, Relationship
from typing import Optional
from datetime import datetime

class User(SQLModel, table=True):
    """User account managed by Better Auth"""
    id: str = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True, max_length=255)
    name: Optional[str] = Field(default=None, max_length=255)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationship
    tasks: list["Task"] = Relationship(back_populates="user")

class Task(SQLModel, table=True):
    """Todo item belonging to a user"""
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(foreign_key="user.id", index=True)
    title: str = Field(max_length=200)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: bool = Field(default=False, index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationship
    user: User = Relationship(back_populates="tasks")

class TaskCreate(SQLModel):
    """DTO for creating a task"""
    title: str
    description: Optional[str] = None

class TaskUpdate(SQLModel):
    """DTO for updating a task"""
    title: Optional[str] = None
    description: Optional[str] = None
    completed: Optional[bool] = None

class TaskRead(SQLModel):
    """DTO for reading a task"""
    id: int
    user_id: str
    title: str
    description: Optional[str]
    completed: bool
    created_at: datetime
    updated_at: datetime
```

### Backend API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|-----|
| GET | `/api/health` | Health check | None |
| GET | `/api/tasks` | List user's tasks | JWT |
| POST | `/api/tasks` | Create task | JWT |
| GET | `/api/tasks/{id}` | Get task details | JWT |
| PUT | `/api/tasks/{id}` | Update task | JWT |
| DELETE | `/api/tasks/{id}` | Delete task | JWT |
| PATCH | `/api/tasks/{id}/complete` | Toggle completion | JWT |

**Query Parameters for GET /api/tasks**:
- `status`: "all" | "pending" | "completed" (default: "all")
- `sort`: "created" | "title" (default: "created")

### Frontend Components

```typescript
// Core components
// app/dashboard/page.tsx - Main dashboard page
// components/TaskList.tsx - Displays tasks with status
// components/TaskItem.tsx - Single task row with actions
// components/TaskForm.tsx - Form for creating/editing tasks
// components/FilterBar.tsx - Filter by status, sort options
// components/AuthButton.tsx - Conditional login/signup/logout
// lib/api.ts - API client with automatic JWT attachment
```

### Authentication Flow

```
1. User navigates to app
2. If not authenticated → Redirect to /signup or /login
3. User signs up or logs in via Better Auth
4. Better Auth creates session cookie + issues JWT token
5. Frontend retrieves JWT token from session
6. Frontend includes JWT in Authorization: Bearer <token> header
7. Backend middleware validates JWT signature using shared secret
8. Backend extracts user_id from JWT payload
9. Backend filters all database queries by user_id
10. Response returns only user's own data
```

## Complexity Tracking

> No constitutional violations - all design decisions align with the evolution from Phase I to Phase II.

| Aspect | Decision | Justification |
|--------|----------|---------------|
| Web Framework | Next.js 16+ | Industry standard for React apps, excellent DX |
| Backend Framework | FastAPI | Modern Python async framework, auto OpenAPI |
| ORM | SQLModel | Built on Pydantic, type-safe, great with FastAPI |
| Database | Neon PostgreSQL | Serverless, easy hosting, excellent free tier |
| Auth Library | Better Auth | TypeScript-first, works with Next.js App Router |
| Auth Between Services | JWT tokens | Stateless, standard for service-to-service auth |

## Dependencies & Execution Order

### Phase Dependencies
1. **Setup & Infrastructure**: Initialize both frontend and backend projects
2. **Database & Models**: Set up Neon, create SQLModel models
3. **Authentication**: Implement Better Auth + JWT middleware
4. **Backend API**: Implement task endpoints
5. **Frontend Core**: Build main dashboard and task list
6. **Frontend Actions**: Add create, edit, delete, toggle
7. **Filter & Sort**: Add filtering and sorting UI
8. **Polish**: Error handling, loading states, responsive design

### Within Each Phase
- Database must exist before models can be tested
- Authentication must work before protected endpoints
- Backend API must exist before frontend can integrate
- Each user story should be independently testable

## Data Flow

```
User Browser (Frontend)
    ↓
Next.js App Router
    ↓
API Client (lib/api.ts) - adds JWT token
    ↓
HTTP Request with Authorization header
    ↓
FastAPI Backend
    ↓
JWT Middleware - validates token, extracts user_id
    ↓
Route Handler (routes/tasks.py)
    ↓
SQLModel/Database - queries filtered by user_id
    ↓
JSON Response
    ↓
Frontend updates UI
```

## Error Handling Strategy

| Error Type | Handler | User Message |
|------------|---------|--------------|
| Not authenticated | 401 redirect | Redirect to login page |
| Forbidden (wrong user) | 403 | "You don't have permission to access this resource" |
| Task not found | 404 | "Task not found" |
| Validation error | 422 | Show specific field errors |
| Server error | 500 | "Something went wrong. Please try again." |
| Network error | Frontend catch | "Unable to connect. Check your internet." |

## Testing Approach

### Unit Tests (Required for backend)
- Test all route handlers
- Test JWT verification middleware
- Test database operations

### Integration Tests (Optional)
- Test full authentication flow
- Test CRUD operations end-to-end

### Manual Testing (Required)
- Each user story tested independently
- Responsive design verified on mobile
- User isolation verified (User A cannot see User B's tasks)

## Success Criteria

From spec.md, verified during implementation:
- SC-001: Registration + first task in <2 minutes
- SC-002: Page transitions <1 second
- SC-003: 95% success on core workflow (login → create → complete)
- SC-004: Mobile compatible (375px+)
- SC-005: 1000 tasks without degradation
- SC-006: Data persists across sessions
- SC-007: User isolation enforced

## Important Notes

1. **NO MANUAL CODING**: All code must be generated by Claude Code based on specs
2. **SPEC-FIRST**: Always reference `/specs/002-full-stack-web/spec.md`
3. **JWT SHARED SECRET**: Both frontend and backend must use `BETTER_AUTH_SECRET`
4. **USER ISOLATION**: Every database query MUST filter by `user_id`
5. **INCREMENTAL DELIVERY**: Each user story should be independently testable
6. **MONOREPO**: Single context for both frontend and backend enables cross-cutting changes
