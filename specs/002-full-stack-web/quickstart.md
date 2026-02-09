# Quickstart: Phase II Full-Stack Web Todo Application

**Feature**: `002-full-stack-web`
**Last Updated**: 2025-02-06

## Prerequisites

Before starting, ensure you have the following installed:

- **Node.js** 18+ or 20+ (for Next.js frontend)
- **Python** 3.12+ (for FastAPI backend)
- **UV** package manager (for Python dependencies)
- **Neon PostgreSQL** account (free tier works)
- **Git** for version control

## Project Setup

### 1. Clone and Navigate

```bash
cd "/mnt/c/Users/HP/OneDrive/Desktop/h2 phase"
git checkout 002-full-stack-web  # or create this branch
```

### 2. Environment Variables

Create `.env` file at project root:

```bash
# Database (Neon PostgreSQL)
DATABASE_URL=postgresql://user:password@host/database

# JWT Secret (shared between frontend and backend)
BETTER_AUTH_SECRET=your-secret-key-min-32-chars

# Backend
BACKEND_PORT=8000

# Frontend (optional - Next.js uses defaults)
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Create `.env.example`:

```bash
DATABASE_URL=postgresql://user:password@host/database
BETTER_AUTH_SECRET=your-secret-key-min-32-chars
BACKEND_PORT=8000
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Backend Setup (FastAPI)

### 1. Create Backend Directory

```bash
mkdir -p backend/routes backend/tests
cd backend
```

### 2. Initialize Python Project

```bash
uv init
uv add fastapi uvicorn[standard] sqlmodel psycopg2-binary python-jose[cryptography] passlib[bcrypt] pydantic pydantic-settings python-multipart
```

### 3. Backend Project Structure

```
backend/
├── main.py              # FastAPI app
├── models.py            # SQLModel models
├── db.py                # Database session
├── auth.py              # JWT middleware
├── config.py            # Settings
├── routes/
│   ├── __init__.py
│   ├── tasks.py         # Task endpoints
│   └── auth.py          # Auth endpoints (optional)
└── tests/
    ├── __init__.py
    ├── test_tasks.py
    └── test_auth.py
```

### 4. Run Backend

```bash
uvicorn main:app --reload --port 8000
```

API will be available at: http://localhost:8000
API docs (auto-generated): http://localhost:8000/docs

## Frontend Setup (Next.js)

### 1. Create Frontend Directory

```bash
cd ..  # Back to project root
npx create-next-app@latest frontend --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*"
```

### 2. Install Additional Dependencies

```bash
cd frontend
npm install better-auth @auth-core/client
npm install clsx tailwind-merge
```

### 3. Configure Better Auth

Create `lib/auth.ts`:

```typescript
import betterAuth from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
// or use the default adapter

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  secret: process.env.BETTER_AUTH_SECRET!,
  // ... other config
})
```

### 4. Frontend Project Structure

```
frontend/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── (auth)/
│   │   ├── layout.tsx
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── signup/
│   │       └── page.tsx
│   └── dashboard/
│       ├── layout.tsx
│       └── page.tsx
├── components/
│   ├── TaskList.tsx
│   ├── TaskItem.tsx
│   ├── TaskForm.tsx
│   └── FilterBar.tsx
├── lib/
│   ├── api.ts
│   ├── auth.ts
│   └── utils.ts
└── styles/
    └── globals.css
```

### 5. Run Frontend

```bash
npm run dev
```

Frontend will be available at: http://localhost:3000

## Database Setup (Neon PostgreSQL)

### 1. Create Neon Account

1. Go to [https://neon.tech](https://neon.tech)
2. Sign up for free account
3. Create a new project
4. Copy the connection string

### 2. Set Database URL

Add to `.env`:

```bash
DATABASE_URL=postgresql://username:password@ep-xxx.region.aws.neon.tech/neondb
```

### 3. Run Migrations

The database schema will be created automatically on first run via SQLModel's `create_engine`.

## Development Workflow

### 1. Start Services

Terminal 1 - Backend:
```bash
cd backend
uvicorn main:app --reload --port 8000
```

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

### 2. Access Application

1. Open browser to http://localhost:3000
2. Sign up for a new account
3. Create your first task
4. Verify data persistence (refresh page)

### 3. API Testing

Use the auto-generated Swagger UI at http://localhost:8000/docs or curl:

```bash
# Health check
curl http://localhost:8000/api/health

# Create task (replace YOUR_JWT_TOKEN)
curl -X POST http://localhost:8000/api/tasks \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title": "Test task"}'

# List tasks
curl http://localhost:8000/api/tasks \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Testing

### Backend Tests

```bash
cd backend
uv run pytest
```

### Frontend Tests

```bash
cd frontend
npm run test
```

### Manual Testing Checklist

- [ ] Sign up as new user
- [ ] Log out and log back in
- [ ] Create a task
- [ ] View task in list
- [ ] Mark task as complete
- [ ] Edit task title/description
- [ ] Delete task
- [ ] Filter by status (pending/completed)
- [ ] Sort by title/date
- [ ] Verify user isolation (open in incognito window)
- [ ] Test responsive design (shrink browser window)

## Troubleshooting

### CORS Issues

If frontend can't reach backend, ensure CORS is configured in `main.py`:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### JWT Issues

Ensure `BETTER_AUTH_SECRET` is the same in both `.env` files.

### Database Connection

Verify `DATABASE_URL` is correct and Neon database is active.

## Next Steps

1. Run `/sp.tasks` to generate detailed implementation tasks
2. Run `/sp.implement` to start implementing with Claude Code
3. Follow the spec-driven development workflow throughout
