# T009: Create command handlers for the Todo CLI
"""
Command handlers for the Todo CLI application.

Each function handles a specific command and returns a message to display.
"""

from __future__ import annotations

from src.models.task import Task
from src.services.todo_service import TodoService


def handle_add(service: TodoService, args: list[str]) -> str:
    """
    Handle the 'add' command to create a new task.

    Usage: add <title> [--desc <description>]

    Args:
        service: The TodoService instance
        args: Command arguments

    Returns:
        Success message with task ID
    """
    if not args:
        raise ValueError("Title is required")

    # Parse title and optional description
    # Title is everything before --desc, or all args if no --desc
    description = None

    if "--desc" in args:
        desc_idx = args.index("--desc")
        if desc_idx > 0:
            title = " ".join(args[:desc_idx])
        else:
            raise ValueError("Title is required")
        if desc_idx + 1 < len(args):
            description = " ".join(args[desc_idx + 1 :])
    else:
        title = " ".join(args)

    if not title.strip():
        raise ValueError("Title is required")

    task = service.add_task(title, description)
    return f"Task added: [{task.id}] {task.title}"


def handle_list(service: TodoService, args: list[str]) -> str:
    """
    Handle the 'list' command to display all tasks.

    Usage: list

    Args:
        service: The TodoService instance
        args: Command arguments (ignored)

    Returns:
        Formatted list of tasks or empty message
    """
    tasks = service.list_tasks()

    if not tasks:
        return "No tasks found. Use 'add' to create a task."

    lines = ["Your Tasks:", ""]
    for task in tasks:
        status = "[✓]" if task.completed else "[ ]"
        desc = f" - {task.description}" if task.description else ""
        lines.append(f"  {status} [{task.id}] {task.title}{desc}")

    return "\n".join(lines)


def handle_update(service: TodoService, args: list[str]) -> str:
    """
    Handle the 'update' command to modify a task.

    Usage: update <id> [--title <title>] [--desc <description>]

    Args:
        service: The TodoService instance
        args: Command arguments

    Returns:
        Success message or error
    """
    if not args:
        raise ValueError("Task ID is required")

    try:
        task_id = int(args[0])
    except ValueError:
        raise ValueError("Invalid task ID. Must be a number.")

    title = None
    description = None

    if "--title" in args:
        title_idx = args.index("--title")
        if title_idx + 1 < len(args):
            title = " ".join(args[title_idx + 1 : args.index("--desc") if "--desc" in args and args.index("--desc") > title_idx else len(args)])

    if "--desc" in args:
        desc_idx = args.index("--desc")
        if desc_idx + 1 < len(args):
            description = " ".join(args[desc_idx + 1 :])

    task = service.update_task(task_id, title, description)
    if task is None:
        return f"Task not found: {task_id}"

    return f"Task updated: [{task.id}] {task.title}"


def handle_delete(service: TodoService, args: list[str]) -> str:
    """
    Handle the 'delete' command to remove a task.

    Usage: delete <id>

    Args:
        service: The TodoService instance
        args: Command arguments

    Returns:
        Success message or error
    """
    if not args:
        raise ValueError("Task ID is required")

    try:
        task_id = int(args[0])
    except ValueError:
        raise ValueError("Invalid task ID. Must be a number.")

    if service.delete_task(task_id):
        return f"Task deleted: {task_id}"
    return f"Task not found: {task_id}"


def handle_complete(service: TodoService, args: list[str]) -> str:
    """
    Handle the 'complete' command to mark a task as done.

    Usage: complete <id>

    Args:
        service: The TodoService instance
        args: Command arguments

    Returns:
        Success message or error
    """
    if not args:
        raise ValueError("Task ID is required")

    try:
        task_id = int(args[0])
    except ValueError:
        raise ValueError("Invalid task ID. Must be a number.")

    task = service.toggle_complete(task_id, completed=True)
    if task is None:
        return f"Task not found: {task_id}"

    return f"Marked as complete: [{task.id}] {task.title}"


def handle_uncomplete(service: TodoService, args: list[str]) -> str:
    """
    Handle the 'uncomplete' command to mark a task as not done.

    Usage: uncomplete <id>

    Args:
        service: The TodoService instance
        args: Command arguments

    Returns:
        Success message or error
    """
    if not args:
        raise ValueError("Task ID is required")

    try:
        task_id = int(args[0])
    except ValueError:
        raise ValueError("Invalid task ID. Must be a number.")

    task = service.toggle_complete(task_id, completed=False)
    if task is None:
        return f"Task not found: {task_id}"

    return f"Marked as incomplete: [{task.id}] {task.title}"
