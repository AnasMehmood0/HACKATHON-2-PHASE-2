# Plan: Phase III - AI-Powered Todo Chatbot

**Input**: spec.md for 003-ai-chatbot
**Created**: 2026-02-06

## Architecture Overview

```
┌─────────────────┐     ┌──────────────────────────────────────────────┐     ┌─────────────────┐
│                 │     │              FastAPI Server                   │     │                 │
│                 │     │  ┌────────────────────────────────────────┐  │     │                 │
│  ChatKit UI     │────▶│  │         Chat Endpoint                  │  │     │    Neon DB      │
│  (Frontend)     │     │  │  POST /api/chat                        │  │     │  (PostgreSQL)   │
│                 │     │  └───────────────┬────────────────────────┘  │     │                 │
│                 │     │                  │                           │     │  \- tasks        │
│                 │     │                  ▼                           │     │  \- conversations│
│                 │     │  ┌────────────────────────────────────────┐  │     │  \- messages     │
│                 │◀────│  │      OpenAI Agents SDK                 │  │     │                 │
│                 │     │  │      (Agent \+ Runner)                  │  │     │                 │
│                 │     │  └───────────────┬────────────────────────┘  │     │                 │
│                 │     │                  │                           │     │                 │
│                 │     │                  ▼                           │     │                 │
│                 │     │  ┌────────────────────────────────────────┐  │────▶│                 │
│                 │     │  │         MCP Server                 │  │     │                 │
│                 │     │  │  (MCP Tools for Task Operations)       │  │◀────│                 │
│                 │     │  └────────────────────────────────────────┘  │     │                 │
└─────────────────┘     └──────────────────────────────────────────────┘     └─────────────────┘
```

## Key Decisions

### 1. ChatKit Integration
**Decision**: Use OpenAI ChatKit React SDK embedded in dashboard
**Rationale**:
- Lightweight integration compared to full chat page
- Provides built-in typing indicators, auto-scroll
- Easy to add to existing Next.js app

### 2. MCP Server Architecture
**Decision**: Separate MCP server process using stdio transport
**Rationale**:
- Standard MCP protocol for tool exposure
- Stateless - easier to debug and test
- Can be run independently for development

### 3. Conversation Storage
**Decision**: Store full conversation history in database
**Rationale**:
- User can refresh page and see chat history
- Enables future features (conversation search, analytics)
- Stateless chat endpoint - easier to scale

### 4. Agent Implementation
**Decision**: Use OpenAI Agents SDK with function calling
**Rationale**:
- Native tool calling support
- Better intent understanding than regex/keyword matching
- Can handle multi-step reasoning

## File Structure

### Backend
```
backend/
├── src/backend/
│   ├── mcp_server.py          # MCP server with task tools
│   ├── agents/
│   │   ├── __init__.py
│   │   ├── chat_agent.py       # Agent definition with tools
│   │   └── runner.py           # Agent execution logic
│   ├── models.py               # Add Conversation, Message
│   ├── routes/
│   │   └── chat.py             # POST /api/chat endpoint
│   └── services/
│       └── conversation.py     # Conversation CRUD
```

### Frontend
```
frontend/
├── components/
│   ├── ChatPanel.tsx          # Expandable chat panel
│   └── ChatMessage.tsx         # Individual message component
├── lib/
│   └── chatkit.ts             # ChatKit configuration
└── app/
    └── dashboard/
        └── page.tsx            # Add ChatPanel integration
```

## Implementation Phases

### Phase A: MCP Server (Foundation)
1. Install `mcp` Python package
2. Create `mcp_server.py` with server setup
3. Implement `add_task` tool
4. Implement `list_tasks` tool
5. Implement `complete_task` tool
6. Implement `update_task` tool
7. Implement `delete_task` tool
8. Test MCP server independently

### Phase B: Database Models
1. Add `Conversation` model to `models.py`
2. Add `Message` model to `models.py`
3. Create database migration
4. Update `init_db()` to create new tables

### Phase C: Chat Agent
1. Install OpenAI Agents SDK
2. Create agent definition with function schemas
3. Implement tool calling logic
4. Add response generation
5. Handle tool errors gracefully

### Phase D: Chat API Endpoint
1. Create `POST /api/chat` endpoint
2. Implement conversation history fetching
3. Store user message
4. Run agent with tools
5. Store assistant response
6. Return formatted response

### Phase E: ChatKit UI
1. Install `@openai/chatkit-react` package
2. Create ChatPanel component
3. Configure ChatKit provider
4. Add to dashboard layout
5. Style to match existing design
6. Test message sending and receiving

## Dependencies

### Python (backend)
```txt
openai>=1.0.0
openai-agents-sdk>=0.1.0
mcp>=0.9.0
```

### Node.js (frontend)
```txt
@openai/chatkit-react>=0.5.0
```

## Environment Variables

```bash
# OpenAI API
OPENAI_API_KEY=sk-...

# MCP Server
MCP_SERVER_PORT=3001
```

## API Endpoints

### POST /api/chat
Creates or continues a conversation with the AI agent.

**Request:**
```json
{
  "message": "Add a task to buy groceries",
  "conversation_id": null  // optional for existing conversation
}
```

**Response:**
```json
{
  "response": "I've created a task called 'Buy groceries' for you.",
  "conversation_id": 1,
  "messages": [
    {"role": "user", "content": "Add a task to buy groceries", "created_at": "..."},
    {"role": "assistant", "content": "I've created...", "created_at": "..."}
  ]
}
```

## Risk Analysis

| Risk | Mitigation |
|------|------------|
| MCP protocol complexity | Start with stdio transport (simplest) |
| OpenAI API costs | Set usage limits; use gpt-3.5-turbo for development |
| Agent hallucination | Validate tool parameters; return structured data |
| Chat state management | Store everything in database; no in-memory state |

## Definition of Done

1. ✅ All 5 MCP tools working correctly
2. ✅ Chat UI integrated in dashboard
3. ✅ User can perform full CRUD via chat
4. ✅ Conversation history persists
5. ✅ Error handling for invalid commands
6. ✅ All data isolated by user_id
