# Spec: Phase III - AI-Powered Todo Chatbot

**Feature ID**: 003-ai-chatbot
**Status**: Draft
**Created**: 2026-02-06

## Overview

Add an AI-powered conversational interface to the Todo application, allowing users to manage their tasks through natural language commands. The chatbot uses OpenAI's Agents SDK and MCP (Model Context Protocol) server architecture.

## User Stories

### US1: Chat Interface (P1)
As a user, I want to chat with an AI assistant to manage my todos, so I don't have to click through buttons.

**Acceptance Criteria:**
- Chat UI is accessible from the dashboard
- User can send natural language messages
- AI responds with helpful confirmations
- Conversation history persists across page refreshes

### US2: Task Creation via Chat (P1)
As a user, I want to create tasks by typing "Add a task to buy groceries", so the AI creates it for me.

**Acceptance Criteria:**
- AI recognizes task creation intent
- `add_task` MCP tool is invoked
- Task appears in the task list
- AI confirms creation with task details

### US3: Task Listing via Chat (P1)
As a user, I want to see my tasks by asking "What are my pending tasks?", so I can review them without leaving the chat.

**Acceptance Criteria:**
- AI recognizes listing intent
- `list_tasks` MCP tool is invoked
- AI summarizes the tasks found
- Filter by status (pending/completed) works

### US4: Task Completion via Chat (P1)
As a user, I want to mark tasks complete by saying "Mark task 1 as done", so I can complete tasks quickly.

**Acceptance Criteria:**
- AI recognizes completion intent
- `complete_task` MCP tool is invoked
- AI confirms the action
- Task status updates in UI

### US5: Task Updates via Chat (P1)
As a user, I want to update tasks by saying "Change task 1 title to Buy milk and eggs", so I can modify tasks.

**Acceptance Criteria:**
- AI recognizes update intent
- `update_task` MCP tool is invoked
- AI confirms the new values

### US6: Task Deletion via Chat (P1)
As a user, I want to delete tasks by saying "Delete task 1", so I can remove unwanted tasks.

**Acceptance Criteria:**
- AI recognizes deletion intent
- `delete_task` MCP tool is invoked
- AI asks for confirmation on deletion
- Task is removed after confirmation

## Functional Requirements

### FR-001: Chat UI
- Chat interface embedded in dashboard (expandable chat panel)
- Input field for natural language messages
- Message history display (user and assistant messages)
- Loading state during AI processing
- Auto-scroll to latest message

### FR-002: Chat API Endpoint
- `POST /api/chat` - Send message and get AI response
- Request: `{ message: string, conversation_id?: number }`
- Response: `{ response: string, conversation_id: number, tool_calls: ToolCall[] }`
- Authentication required (JWT token)

### FR-003: Conversation Persistence
- Messages stored in `messages` table
- Conversations stored in `conversations` table
- All data scoped to `user_id`

### FR-004: MCP Server
- Exposes 5 tools: `add_task`, `list_tasks`, `complete_task`, `update_task`, `delete_task`
- Each tool validates user_id for ownership
- Tools return structured responses

### FR-005: AI Agent Behavior
- Parse user intent from natural language
- Select appropriate MCP tool
- Handle tool errors gracefully
- Provide friendly confirmations
- Ask for clarification when needed

## Data Model

### Conversation Model
```sql
CREATE TABLE conversations (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### Message Model
```sql
CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR NOT NULL REFERENCES users(id),
    conversation_id INTEGER NOT NULL REFERENCES conversations(id),
    role VARCHAR NOT NULL, -- 'user' or 'assistant'
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    tool_calls JSONB, -- optional: array of tool call data
    INDEX (user_id, conversation_id)
);
```

## MCP Tools

### Tool: add_task
```python
{
    "name": "add_task",
    "description": "Create a new todo item for the user",
    "parameters": {
        "user_id": {"type": "string", "required": True},
        "title": {"type": "string", "required": True, "minLength": 1, "maxLength": 200},
        "description": {"type": "string", "required": False, "maxLength": 1000}
    }
}
```

### Tool: list_tasks
```python
{
    "name": "list_tasks",
    "description": "List all tasks or filter by completion status",
    "parameters": {
        "user_id": {"type": "string", "required": True},
        "status": {"type": "string", "enum": ["all", "pending", "completed"], "default": "all"}
    }
}
```

### Tool: complete_task
```python
{
    "name": "complete_task",
    "description": "Mark a task as completed",
    "parameters": {
        "user_id": {"type": "string", "required": True},
        "task_id": {"type": "integer", "required": True}
    }
}
```

### Tool: update_task
```python
{
    "name": "update_task",
    "description": "Update task title or description",
    "parameters": {
        "user_id": {"type": "string", "required": True},
        "task_id": {"type": "integer", "required": True},
        "title": {"type": "string", "required": False, "minLength": 1, "maxLength": 200},
        "description": {"type": "string", "required": False, "maxLength": 1000}
    }
}
```

### Tool: delete_task
```python
{
    "name": "delete_task",
    "description": "Permanently delete a task",
    "parameters": {
        "user_id": {"type": "string", "required": True},
        "task_id": {"type": "integer", "required": True}
    }
}
```

## Technology Stack

| Component | Technology |
|-----------|-----------|
| Frontend Chat | OpenAI ChatKit React SDK |
| Backend AI | OpenAI Agents SDK (Python) |
| MCP Server | Official MCP SDK (Python) |
| Database | Neon PostgreSQL (existing) |
| Authentication | Better Auth (existing) |

## API Contracts

### POST /api/chat
**Request:**
```json
{
  "message": "Add a task to buy groceries",
  "conversation_id": null
}
```

**Response:**
```json
{
  "response": "I've created a task called 'Buy groceries' for you.",
  "conversation_id": 1,
  "tool_calls": [
    {
      "tool": "add_task",
      "parameters": {"user_id": "123", "title": "Buy groceries"},
      "result": {"task_id": 5, "status": "created", "title": "Buy groceries"}
    }
  ]
}
```

## Success Criteria

1. ✅ Chat UI accessible from dashboard
2. ✅ All 5 MCP tools implemented and working
3. ✅ User can create, list, complete, update, delete tasks via chat
4. ✅ Conversation history persists across refreshes
5. ✅ All operations scoped to user_id (data isolation)
6. ✅ Agent handles errors gracefully

## Edge Cases

1. **Ambiguous commands**: "Change it" → Ask for clarification
2. **Invalid task_id**: "Delete task 999" → Return friendly error
3. **Empty task list**: "Show my tasks" → "You have no tasks yet"
4. **Malformed input**: "Add" → Ask what to add
5. **Multiple interpretations**: "Complete tasks" → Ask which tasks or confirm all pending

## Assumptions

1. OpenAI API key available in environment
2. MCP server runs as separate process from FastAPI
3. ChatKit uses embedded configuration (not standalone chat)
4. Agent uses GPT-4 or GPT-3.5-turbo for reasoning
5. MCP tools communicate via stdio or HTTP transport
