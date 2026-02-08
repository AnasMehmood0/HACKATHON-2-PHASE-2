# Data Model: Phase II Full-Stack Web Todo Application

**Feature**: `002-full-stack-web`
**Date**: 2025-02-06
**Purpose**: Define database schema and data structures for the web application

## Entities

### User

Represents a registered user of the application. User accounts are managed by Better Auth on the frontend, but the backend needs the model for foreign key relationships.

| Field | Type | Constraints | Description |
|-------|------|------------|-------------|
| id | string | PRIMARY KEY | Unique identifier (UUID) |
| email | string | UNIQUE, NOT NULL, max 255 | User's email address |
| name | string | NULLABLE, max 255 | User's display name |
| created_at | timestamp | NOT NULL, DEFAULT NOW() | Account creation timestamp |

**Indexes**:
- `users_email` - unique index on email
- `users_id` - primary key index

**Relationships**:
- One-to-many with Tasks (one user has many tasks)

### Task

Represents a single todo item owned by a user.

| Field | Type | Constraints | Description |
|-------|------|------------|-------------|
| id | integer | PRIMARY KEY, AUTO INCREMENT | Unique task identifier |
| user_id | string | FOREIGN KEY → users.id, NOT NULL, INDEX | Owner of the task |
| title | string | NOT NULL, max 200 | Task title/name |
| description | text | NULLABLE, max 1000 | Optional task details |
| completed | boolean | NOT NULL, DEFAULT false | Completion status |
| created_at | timestamp | NOT NULL, DEFAULT NOW() | Task creation time |
| updated_at | timestamp | NOT NULL, DEFAULT NOW() | Last modification time |

**Indexes**:
- `tasks_id` - primary key index
- `tasks_user_id` - index for user queries (performance)
- `tasks_completed` - index for filtering by status

**Relationships**:
- Many-to-one with User (many tasks belong to one user)

## Entity-Relationship Diagram

```
┌─────────────────┐
│     User        │
├─────────────────┤
│ id (PK)         │
│ email (unique)  │
│ name            │
│ created_at      │
└────────┬────────┘
         │ 1
         │
         │ N
┌────────▼────────┐
│     Task        │
├─────────────────┤
│ id (PK)         │
│ user_id (FK)    │
│ title           │
│ description     │
│ completed       │
│ created_at      │
│ updated_at      │
└─────────────────┘
```

## DTOs (Data Transfer Objects)

### TaskCreate
Request DTO for creating a new task.

```typescript
{
  title: string;           // Required, 1-200 characters
  description?: string;    // Optional, 0-1000 characters
}
```

### TaskUpdate
Request DTO for updating an existing task.

```typescript
{
  title?: string;          // Optional, 1-200 characters
  description?: string;    // Optional, 0-1000 characters
  completed?: boolean;     // Optional, toggle status
}
```

### TaskRead
Response DTO for task data (from database).

```typescript
{
  id: number;
  user_id: string;
  title: string;
  description: string | null;
  completed: boolean;
  created_at: string;      // ISO 8601 timestamp
  updated_at: string;      // ISO 8601 timestamp
}
```

### TaskListResponse
Response DTO for list of tasks.

```typescript
{
  tasks: TaskRead[];
  total: number;           // Total count (for pagination)
}
```

## Validation Rules

### User
- Email: Must be valid email format, unique across all users
- Password: Minimum 8 characters (enforced by Better Auth)
- Name: Optional, max 255 characters

### Task
- Title: Required, not empty, 1-200 characters
- Description: Optional, 0-1000 characters
- User ID: Required, must reference valid user
- Completed: Boolean, defaults to false

## State Transitions

### Task Lifecycle

```
┌─────────┐
│ Created │
│completed│
│ = false │
└────┬────┘
     │
     │ toggle_complete()
     │
     ▼
┌─────────┐
│Completed│
│completed│
│ = true  │
└────┬────┘
     │
     │ toggle_complete()
     │
     ▼
┌─────────┐
│Completed│
│completed│
│ = false │
└─────────┘
```

Tasks can transition between pending (completed=false) and completed (completed=true) states any number of times.

## Database Migrations

### Migration 1: Create users table

```sql
CREATE TABLE users (
    id VARCHAR(255) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
```

### Migration 2: Create tasks table

```sql
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_completed ON tasks(completed);
```

### Migration 3: Update timestamp trigger

```sql
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_tasks_updated_at
    BEFORE UPDATE ON tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();
```

## Cascade Rules

- **ON DELETE CASCADE**: When a user is deleted, all their tasks are automatically deleted
- **ON UPDATE NO ACTION**: User ID cannot be changed (tasks cannot be transferred)
