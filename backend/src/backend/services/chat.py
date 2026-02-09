# Chat service for handling AI-powered conversations using Gemini API

import json
import os
from typing import Optional, List
from datetime import datetime
from fastapi import HTTPException, Request
import google.generativeai as genai
from sqlmodel import Session, select

from ..models import User, Task, Conversation, Message, ChatRequest, ChatResponse, MessageRead, ToolCall


class ChatService:
    """Service for managing AI chat conversations using Gemini API."""

    def __init__(self):
        # Initialize Gemini with API key from environment
        # Supports GEMINI_API_KEY or OPENAI_API_KEY (for compatibility)
        api_key = os.getenv("GEMINI_API_KEY") or os.getenv("OPENAI_API_KEY", "dev-key-placeholder")
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel("gemini-2.5-flash")

        # System prompt for the AI agent
        self.system_prompt = """You are a helpful Todo assistant. You can help users manage their tasks through natural language.

Available tools:
- add_task: Create a new task (requires: user_id, title, optional description)
- list_tasks: List tasks (requires: user_id, optional status: "all"/"pending"/"completed")
- complete_task: Mark task as complete (requires: user_id, task_id)
- update_task: Update task (requires: user_id, task_id, optional title, optional description)
- delete_task: Delete a task (requires: user_id, task_id)

When a user wants to manage tasks, use the appropriate tool and confirm the action.
Be friendly and concise. If you need more information, ask the user.

IMPORTANT: When you need to use a tool, output ONLY a valid JSON object in this exact format:
{"tool": "tool_name", "parameters": {"param": "value"}}
No other text should be included when calling a tool."""

    async def handle_message(
        self,
        message: str,
        user_id: str,
        conversation_id: Optional[int],
        session: Session,
    ) -> ChatResponse:
        """Process a user message and generate AI response."""

        # Get or create conversation
        if conversation_id is None:
            conversation = Conversation(user_id=user_id)
            session.add(conversation)
            session.commit()
            session.refresh(conversation)
        else:
            conversation = session.get(Conversation, conversation_id)
            if not conversation or conversation.user_id != user_id:
                raise HTTPException(status_code=404, detail="Conversation not found")

        # Store user message
        user_message = Message(
            user_id=user_id,
            conversation_id=conversation.id,
            role="user",
            content=message,
        )
        session.add(user_message)
        session.commit()

        # Fetch conversation history (excluding current message that's being added)
        history = session.exec(
            select(Message)
            .where(Message.conversation_id == conversation.id)
            .where(Message.id != user_message.id)
            .order_by(Message.created_at)
        ).all()

        # Build conversation for Gemini
        gemini_history = []
        for msg in history:
            role = "user" if msg.role == "user" else "model"
            gemini_history.append({
                "role": role,
                "parts": [msg.content],
            })

        # Start chat with history
        chat = self.model.start_chat(history=gemini_history)

        # Generate response
        tool_calls = []
        final_response = ""

        try:
            # Send message and get response
            response = chat.send_message(self.system_prompt + "\n\nUser: " + message)
            response_text = response.text.strip()

            # Check if response contains a tool call (JSON)
            if response_text.startswith("{") and response_text.endswith("}"):
                try:
                    tool_call_data = json.loads(response_text)
                    if "tool" in tool_call_data and "parameters" in tool_call_data:
                        # Execute the tool
                        tool_result = await self._execute_tool_call(
                            tool_call_data["tool"],
                            tool_call_data["parameters"],
                            user_id,
                            session,
                        )
                        tool_calls.append(tool_result)

                        # Generate confirmation response based on tool result
                        if "error" in tool_result:
                            final_response = f"Sorry, {tool_result['error']}"
                        elif tool_result["tool"] == "add_task":
                            final_response = f"Created task: {tool_result['result']['title']}"
                        elif tool_result["tool"] == "complete_task":
                            final_response = f"Marked task as complete: {tool_result['result']['title']}"
                        elif tool_result["tool"] == "update_task":
                            final_response = f"Updated task: {tool_result['result']['title']}"
                        elif tool_result["tool"] == "delete_task":
                            final_response = f"Deleted task: {tool_result['result']['title']}"
                        elif tool_result["tool"] == "list_tasks":
                            tasks = tool_result.get("result", [])
                            if tasks:
                                task_list = "\n".join([f"- {t['title']}" for t in tasks])
                                final_response = f"Here are your tasks:\n{task_list}"
                            else:
                                final_response = "You have no tasks yet."
                        else:
                            final_response = "Done!"
                except json.JSONDecodeError:
                    final_response = response_text
            else:
                final_response = response_text

        except Exception as e:
            final_response = f"I had trouble processing that. Error: {str(e)}"

        # Store assistant message
        ai_message = Message(
            user_id=user_id,
            conversation_id=conversation.id,
            role="assistant",
            content=final_response,
            tool_calls_json=json.dumps(tool_calls) if tool_calls else None,
        )
        session.add(ai_message)

        # Update conversation timestamp
        conversation.updated_at = datetime.utcnow()
        session.commit()
        session.refresh(conversation)

        # Fetch all messages for response
        all_messages = session.exec(
            select(Message)
            .where(Message.conversation_id == conversation.id)
            .order_by(Message.created_at)
        ).all()

        return ChatResponse(
            response=final_response,
            conversation_id=conversation.id,
            messages=[
                MessageRead(
                    id=m.id,
                    conversation_id=m.conversation_id,
                    role=m.role,
                    content=m.content,
                    created_at=m.created_at,
                    tool_calls=json.loads(m.tool_calls) if m.tool_calls else None,
                )
                for m in all_messages
            ],
            tool_calls=tool_calls,
        )

    async def _execute_tool_call(
        self,
        tool_name: str,
        arguments: dict,
        user_id: str,
        session: Session,
    ) -> dict:
        """Execute an MCP tool call."""
        try:
            if tool_name == "add_task":
                task = Task(
                    user_id=user_id,
                    title=arguments["title"],
                    description=arguments.get("description"),
                    completed=False,
                )
                session.add(task)
                session.commit()
                session.refresh(task)
                return {"tool": "add_task", "result": {"task_id": task.id, "status": "created", "title": task.title}}

            elif tool_name == "list_tasks":
                query = session.query(Task).where(Task.user_id == user_id)
                status = arguments.get("status", "all")
                if status == "pending":
                    query = query.where(Task.completed == False)
                elif status == "completed":
                    query = query.where(Task.completed == True)
                tasks = query.all()
                return {
                    "tool": "list_tasks",
                    "result": [{"id": t.id, "title": t.title, "completed": t.completed} for t in tasks],
                }

            elif tool_name == "complete_task":
                task = session.query(Task).where(
                    Task.id == arguments["task_id"],
                    Task.user_id == user_id,
                ).first()
                if not task:
                    return {"tool": "complete_task", "error": "Task not found"}
                task.completed = True
                task.updated_at = datetime.utcnow()
                session.commit()
                return {"tool": "complete_task", "result": {"task_id": task.id, "status": "completed", "title": task.title}}

            elif tool_name == "update_task":
                task = session.query(Task).where(
                    Task.id == arguments["task_id"],
                    Task.user_id == user_id,
                ).first()
                if not task:
                    return {"tool": "update_task", "error": "Task not found"}
                if "title" in arguments:
                    task.title = arguments["title"]
                if "description" in arguments:
                    task.description = arguments.get("description")
                task.updated_at = datetime.utcnow()
                session.commit()
                return {"tool": "update_task", "result": {"task_id": task.id, "status": "updated", "title": task.title}}

            elif tool_name == "delete_task":
                task = session.query(Task).where(
                    Task.id == arguments["task_id"],
                    Task.user_id == user_id,
                ).first()
                if not task:
                    return {"tool": "delete_task", "error": "Task not found"}
                title = task.title
                session.delete(task)
                session.commit()
                return {"tool": "delete_task", "result": {"task_id": arguments["task_id"], "status": "deleted", "title": title}}

            else:
                return {"tool": tool_name, "error": "Unknown tool"}

        except Exception as e:
            return {"tool": tool_name, "error": str(e)}


# Singleton instance
chat_service = ChatService()


def get_session_dep():
    """Generator for database session dependency."""
    from ..db import get_session
    for session in get_session():
        yield session
