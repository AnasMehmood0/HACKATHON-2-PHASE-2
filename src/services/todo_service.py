# T007: Create TodoService class skeleton with full implementation
"""
TodoService for managing in-memory task storage and operations.

This service handles all business logic for task management including
adding, listing, updating, deleting, and toggling task completion status.
"""

from __future__ import annotations

from src.models.task import Task


class TodoService:
    """
    Manages in-memory task storage and operations.

    Tasks are stored in a dictionary with integer IDs as keys for O(1) lookup.
    Task IDs are auto-incrementing starting from 1 and are never reused.
    """

    def __init__(self) -> None:
        """Initialize an empty TodoService with no tasks."""
        self._tasks: dict[int, Task] = {}
        self._next_id: int = 1

    def add_task(self, title: str, description: str | None = None) -> Task:
        """
        Add a new task to the todo list.

        Args:
            title: The title of the task (required)
            description: Optional description for the task

        Returns:
            The newly created Task object

        Raises:
            ValueError: If title is empty or None
        """
        if not title or not title.strip():
            raise ValueError("Title is required")

        task = Task(
            id=self._next_id,
            title=title.strip(),
            description=description.strip() if description else None,
            completed=False,
        )
        self._tasks[self._next_id] = task
        self._next_id += 1
        return task

    def list_tasks(self) -> list[Task]:
        """
        Get all tasks in the todo list.

        Returns:
            List of all tasks, sorted by ID
        """
        return [self._tasks[task_id] for task_id in sorted(self._tasks.keys())]

    def get_task(self, task_id: int) -> Task | None:
        """
        Get a task by its ID.

        Args:
            task_id: The ID of the task to retrieve

        Returns:
            The Task if found, None otherwise
        """
        return self._tasks.get(task_id)

    def update_task(
        self,
        task_id: int,
        title: str | None = None,
        description: str | None = None,
    ) -> Task | None:
        """
        Update an existing task's title and/or description.

        Args:
            task_id: The ID of the task to update
            title: New title (optional)
            description: New description (optional, use None to clear)

        Returns:
            The updated Task if found, None otherwise

        Raises:
            ValueError: If neither title nor description is provided
        """
        if title is None and description is None:
            raise ValueError("At least one field (title or description) must be provided")

        task = self.get_task(task_id)
        if task is None:
            return None

        if title is not None:
            if not title.strip():
                raise ValueError("Title cannot be empty")
            task.title = title.strip()

        if description is not None:
            task.description = description.strip() if description.strip() else None

        return task

    def delete_task(self, task_id: int) -> bool:
        """
        Delete a task by its ID.

        Args:
            task_id: The ID of the task to delete

        Returns:
            True if the task was deleted, False if not found
        """
        if task_id in self._tasks:
            del self._tasks[task_id]
            return True
        return False

    def toggle_complete(self, task_id: int, completed: bool = True) -> Task | None:
        """
        Toggle or set the completion status of a task.

        Args:
            task_id: The ID of the task to update
            completed: The completion status to set (default: True)

        Returns:
            The updated Task if found, None otherwise
        """
        task = self.get_task(task_id)
        if task is None:
            return None
        task.completed = completed
        return task
