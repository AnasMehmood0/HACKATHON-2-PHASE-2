# Hugging Face Space Configuration

This space deploys the FastAPI backend for the Todo App.

## Environment Variables

Configure these in the Space settings:

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string (e.g., from Neon, Railway, or Supabase) | Yes |
| `BETTER_AUTH_SECRET` | JWT signing secret (generate a random string) | Yes |
| `GEMINI_API_KEY` | Google Gemini API key for AI features | No |
| `OPENAI_API_KEY` | OpenAI API key (alternative to Gemini) | No |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | No |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | No |

## Quick Start

1. Create a new Space at hf.co/new
2. Choose **Docker** as the SDK
3. Push this repository or connect your repo
4. Add the environment variables in the Space settings
5. Click "Create Space" and wait for the build

## Database Setup

### Option 1: Neon (Recommended)
1. Go to [neon.tech](https://neon.tech)
2. Create a free account and database
3. Copy the connection string
4. Add `DATABASE_URL` to Space secrets

### Option 2: Railway
1. Go to [railway.app](https://railway.app)
2. Create a new PostgreSQL database
3. Copy the connection string
4. Add `DATABASE_URL` to Space secrets

### Option 3: Supabase
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Get the connection string from project settings
4. Add `DATABASE_URL` to Space secrets

## API Endpoints

Once deployed, your API will be available at:

```
https://<your-space-name>.hf.api.health
```

Available endpoints:
- `GET /` - API information
- `GET /api/health` - Health check
- `GET /docs` - Interactive API documentation (Swagger UI)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/tasks` - Get tasks (requires auth)
- `POST /api/tasks` - Create task (requires auth)
- `PATCH /api/tasks/{id}` - Update task (requires auth)
- `DELETE /api/tasks/{id}` - Delete task (requires auth)
