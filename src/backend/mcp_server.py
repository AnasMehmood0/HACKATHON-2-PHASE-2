# MCP Server for Todo Task Operations
# Exposes task CRUD tools for AI agent consumption

import asyncio
import json
from typing import Any
from mcp.server.models import InitializationOptions
from mcp.server.server import Server
from mcp.server.stdio import stdio_server
from mcp.types import Tool, TextContent

from ..db import Session, get_session_dep
from ..models import Task


class TodoMCPServer:
    """MCP Server for Todo task operations."""

    def __init__(self):
        self.server = Server("todo-mcp-server")
        self._setup_tools()

    def _setup_tools(self):
        """Register all MCP tools."""

        @self.server.list_tools()
        async def list_tools() -> list[Tool]:
            """List all available tools."""
            return [
                Tool(
                    name="add_task",
                    description="Create a new todo item for the user",
                    inputSchema={
                        "type": "object",
                        "properties": {
                            "user_id": {
                                "type": "string",
                                "description": "User ID who owns the task",
                            },
                            "title": {
                                "type": "string",
                                "description": "Task title (1-200 characters)",
                                "minLength": 1,
                                "maxLength": 200,
                            },
                            "description": {
                                "type": "string",
                                "description": "Optional task description (max 1000 characters)",
                                "maxLength": 1000,
                            },
                        },
                        "required": ["user_id", "title"],
                    },
                ),
                Tool(
                    name="list_tasks",
                    description="List all tasks or filter by completion status",
                    inputSchema={
                        "type": "object",
                        "properties": {
                            "user_id": {
                                "type": "string",
                                "description": "User ID to filter tasks",
                            },
                            "status": {
                                "type": "string",
                                "enum": ["all", "pending", "completed"],
                                "description": "Filter by completion status",
                                "default": "all",
                            },
                        },
                        "required": ["user_id"],
                    },
                ),
                Tool(
                    name="complete_task",
                    description="Mark a task as completed",
                    inputSchema={
                        "type": "object",
                        "properties": {
                            "user_id": {
                                "type": "string",
                                "description": "User ID who owns the task",
                            },
                            "task_id": {
                                "type": "integer",
                                "description": "Task ID to mark complete",
                            },
                        },
                        "required": ["user_id", "task_id"],
                    },
                ),
                Tool(
                    name="update_task",
                    description="Update task title or description",
                    inputSchema={
                        "type": "object",
                        "properties": {
                            "user_id": {
                                "type": "string",
                                "description": "User ID who owns the task",
                            },
                            "task_id": {
                                "type": "integer",
                                "description": "Task ID to update",
                            },
                            "title": {
                                "type": "string",
                                "description": "New task title (1-200 characters)",
                                "minLength": 1,
                                "maxLength": 200,
                            },
                            "description": {
                                "type": "string",
                                "description": "New task description (max 1000 characters)",
                                "maxLength": 1000,
                            },
                        },
                        "required": ["user_id", "task_id"],
                    },
                ),
                Tool(
                    name="delete_task",
                    description="Permanently delete a task",
                    inputSchema={
                        "type": "object",
                        "properties": {
                            "user_id": {
                                "type": "string",
                                "description": "User ID who owns the task",
                            },
                            "task_id": {
                                "type": "integer",
                                "description": "Task ID to delete",
                            },
                        },
                        "required": ["user_id", "task_id"],
                    },
                ),
            ]

        @self.server.call_tool()
        async def call_tool(name: str, arguments: dict) -> list[TextContent]:
            """Handle tool calls."""
            session: Session = next(get_session_dep())

            try:
                if name == "add_task":
                    return await self._add_task(session, arguments)
                elif name == "list_tasks":
                    return await self._list_tasks(session, arguments)
                elif name == "complete_task":
                    return await self._complete_task(session, arguments)
                elif name == "update_task":
                    return await self._update_task(session, arguments)
                elif name == "delete_task":
                    return await self._delete_task(session, arguments)
                else:
                    return [TextContent(type="text", text=f"Unknown tool: {name}")]
            except Exception as e:
                return [TextContent(type="text", text=f"Error: {str(e)}")]

    async def _add_task(self, session: Session, args: dict) -> list[TextContent]:
        """Create a new task."""
        from datetime import datetime

        user_id = args["user_id"]
        title = args["title"]
        description = args.get("description")

        task = Task(
            user_id=user_id,
            title=title,
            description=description,
            completed=False,
        )
        session.add(task)
        session.commit()
        session.refresh(task)

        result = {
            "task_id": task.id,
            "status": "created",
            "title": task.title,
        }
        return [TextContent(type="text", text=json.dumps(result))]

    async def _list_tasks(self, session: Session, args: dict) -> list[TextContent]:
        """List tasks with optional status filter."""
        user_id = args["user_id"]
        status = args.get("status", "all")

        query = session.query(Task).where(Task.user_id == user_id)

        if status == "pending":
            query = query.where(Task.completed == False)
        elif status == "completed":
            query = query.where(Task.completed == True)

        tasks = query.all()

        result = [
            {
                "id": t.id,
                "title": t.title,
                "description": t.description,
                "completed": t.completed,
            }
            for t in tasks
        ]
        return [TextContent(type="text", text=json.dumps(result))]

    async def _complete_task(self, session: Session, args: dict) -> list[TextContent]:
        """Mark a task as completed."""
        from datetime import datetime

        user_id = args["user_id"]
        task_id = args["task_id"]

        task = session.query(Task).where(
            Task.id == task_id,
            Task.user_id == user_id
        ).first()

        if not task:
            return [TextContent(type="text", text=json.dumps({"error": "Task not found"}))]

        task.completed = True
        task.updated_at = datetime.utcnow()
        session.commit()

        result = {
            "task_id": task.id,
            "status": "completed",
            "title": task.title,
        }
        return [TextContent(type="text", text=json.dumps(result))]

    async def _update_task(self, session: Session, args: dict) -> list[TextContent]:
        """Update a task."""
        from datetime import datetime

        user_id = args["user_id"]
        task_id = args["task_id"]
        title = args.get("title")
        description = args.get("description")

        task = session.query(Task).where(
            Task.id == task_id,
            Task.user_id == user_id
        ).first()

        if not task:
            return [TextContent(type="text", text=json.dumps({"error": "Task not found"}))]

        if title is not None:
            task.title = title
        if description is not None:
            task.description = description

        task.updated_at = datetime.utcnow()
        session.commit()

        result = {
            "task_id": task.id,
            "status": "updated",
            "title": task.title,
        }
        return [TextContent(type="text", text=json.dumps(result))]

    async def _delete_task(self, session: Session, args: dict) -> list[TextContent]:
        """Delete a task."""
        user_id = args["user_id"]
        task_id = args["task_id"]

        task = session.query(Task).where(
            Task.id == task_id,
            Task.user_id == user_id
        ).first()

        if not task:
            return [TextContent(type="text", text=json.dumps({"error": "Task not found"}))]

        title = task.title
        session.delete(task)
        session.commit()

        result = {
            "task_id": task_id,
            "status": "deleted",
            "title": title,
        }
        return [TextContent(type="text", text=json.dumps(result))]


async def main():
    """Run the MCP server."""
    server = TodoMCPServer()

    # Initialize and run the server
    async with stdio_server() as (read_stream, write_stream):
        async with server.run(
            read_stream,
            write_stream,
            InitializationOptions(
                server_name="todo-mcp-server",
                server_version="1.0.0",
            ),
        ):
            await asyncio.Event().wait()  # Run forever


if __name__ == "__main__":
    import uvloop
    uvloop.run(main())
