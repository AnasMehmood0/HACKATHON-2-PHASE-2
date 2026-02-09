# T004: Create Task model
"""
Task model for the Todo application.

This module defines the Task dataclass which represents a single todo item.
"""

from __future__ import annotations

from dataclasses import dataclass


@dataclass
class Task:
    """
    Represents a single todo item.

    Attributes:
        id: Unique identifier for the task (auto-incrementing, starts at 1)
        title: The task name (required)
        description: Additional details about the task (optional)
        completed: Whether the task is completed (defaults to False)
    """

    id: int
    title: str
    description: str | None = None
    completed: bool = False
