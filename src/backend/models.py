# T011: SQLModel database models for User and Task entities

from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, Any, List
from datetime import datetime
import json


class User(SQLModel, table=True):
    """
    User account managed by Better Auth.
    Note: Better Auth manages its own user table, but we include this model
    for SQLModel relationships and foreign key constraints.
    """

    __tablename__ = "users"

    id: str = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True, max_length=255)
    name: Optional[str] = Field(default=None, max_length=255)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = Field(default=None)

    # Profile fields
    bio: Optional[str] = Field(default=None, max_length=500)
    avatar: Optional[str] = Field(default=None, max_length=500)

    # Account settings
    username: Optional[str] = Field(default=None, max_length=50)
    timezone: Optional[str] = Field(default="America/New_York", max_length=50)
    language: Optional[str] = Field(default="en", max_length=10)

    # Relationships
    tasks: list["Task"] = Relationship(back_populates="user")


class Task(SQLModel, table=True):
    """
    Todo item belonging to a user.
    Each task is owned by exactly one user (user_id foreign key).
    """

    __tablename__ = "tasks"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(foreign_key="users.id", index=True, nullable=False)
    title: str = Field(max_length=200, nullable=False)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: bool = Field(default=False, index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    user: User = Relationship(back_populates="tasks")


# DTOs (Data Transfer Objects)

class TaskCreate(SQLModel):
    """DTO for creating a new task."""

    title: str
    description: Optional[str] = None


class TaskUpdate(SQLModel):
    """DTO for updating an existing task."""

    title: Optional[str] = None
    description: Optional[str] = None
    completed: Optional[bool] = None


class TaskRead(SQLModel):
    """DTO for reading task data (response)."""

    id: int
    user_id: str
    title: str
    description: Optional[str] = None
    completed: bool
    created_at: datetime
    updated_at: datetime


class TaskList(SQLModel):
    """DTO for list of tasks with metadata."""

    tasks: List[TaskRead]
    total: int


# Conversation and Message models for Phase III: AI Chatbot

class Conversation(SQLModel, table=True):
    """
    Chat conversation session for a user.
    Each user can have multiple conversations.
    """

    __tablename__ = "conversations"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(foreign_key="users.id", index=True, nullable=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    messages: List["Message"] = Relationship(back_populates="conversation")


class Message(SQLModel, table=True):
    """
    Individual message in a conversation.
    Can be from user or assistant.
    """

    __tablename__ = "messages"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(foreign_key="users.id", index=True, nullable=False)
    conversation_id: int = Field(foreign_key="conversations.id", index=True, nullable=False)
    role: str = Field(default="user")  # 'user' or 'assistant'
    content: str = Field(nullable=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    # Use String with default None for JSONB storage
    tool_calls_json: Optional[str] = Field(default=None)  # JSONB for tool call data

    # Relationships
    conversation: Conversation = Relationship(back_populates="messages")

    @property
    def tool_calls(self) -> Optional[dict]:
        """Parse tool_calls JSON string to dict."""
        if self.tool_calls_json:
            import json
            return json.loads(self.tool_calls_json)
        return None


# DTOs for Chat API

class MessageRead(SQLModel):
    """DTO for reading message data."""

    id: int
    conversation_id: int
    role: str
    content: str
    created_at: datetime
    tool_calls: Optional[dict] = None


class ConversationRead(SQLModel):
    """DTO for reading conversation with messages."""

    id: int
    user_id: str
    created_at: datetime
    updated_at: datetime
    messages: List[MessageRead] = []


class ChatRequest(SQLModel):
    """DTO for chat API request."""

    message: str
    conversation_id: Optional[int] = None


class ChatResponse(SQLModel):
    """DTO for chat API response."""

    response: str
    conversation_id: int
    messages: List[MessageRead]
    tool_calls: List[dict] = []


class ToolCall(SQLModel):
    """DTO for MCP tool call data."""

    tool: str
    parameters: dict
    result: Any