# T016: Task routes - CRUD operations for tasks

from typing import Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status, Query, Request
from sqlmodel import Session, select

from ..db import get_session
from ..auth import get_current_user, JWTPayload
from ..models import Task, TaskCreate, TaskUpdate, TaskRead

router = APIRouter()


# Helper to get authenticated user from request
async def _get_user(request: Request) -> JWTPayload:
    return await get_current_user(request)


# T032, T034: GET /api/tasks - List tasks with status filter and user_id filtering
@router.get("/tasks", response_model=list[TaskRead])
async def list_tasks(
    request: Request,
    session: Session = Depends(get_session),
    status_filter: Optional[str] = Query(None, alias="status", description="Filter by completion status"),
    sort: str = Query("created", description="Sort field: 'created' or 'title'"),
    order: str = Query("desc", description="Sort order: 'asc' or 'desc'"),
) -> list[TaskRead]:
    """
    List all tasks for the authenticated user.
    Supports filtering by completion status and sorting.
    """
    current_user = await _get_user(request)

    # Build query with user_id filter (T034 - critical for user isolation)
    query = select(Task).where(Task.user_id == current_user.user_id)

    # Apply status filter if provided (T032)
    if status_filter == "pending":
        query = query.where(Task.completed == False)
    elif status_filter == "completed":
        query = query.where(Task.completed == True)

    # Apply sorting (T062)
    if sort == "title":
        if order == "asc":
            query = query.order_by(Task.title.asc())
        else:
            query = query.order_by(Task.title.desc())
    else:  # sort == "created" (default)
        if order == "asc":
            query = query.order_by(Task.created_at.asc())
        else:
            query = query.order_by(Task.created_at.desc())

    # Execute query
    tasks = session.exec(query).all()
    return [TaskRead.model_validate(task) for task in tasks]


# T033: GET /api/tasks/{id} - Get single task
@router.get("/tasks/{task_id}", response_model=TaskRead)
async def get_task(
    task_id: int,
    request: Request,
    session: Session = Depends(get_session),
) -> TaskRead:
    """
    Get a specific task by ID.
    User must own the task (T050 - ownership verification).
    """
    current_user = await _get_user(request)
    task = session.get(Task, task_id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )

    # Verify ownership (T050)
    if task.user_id != current_user.user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have permission to access this task",
        )

    return TaskRead.model_validate(task)


# T040-T042: POST /api/tasks - Create task with validation
@router.post("/tasks", response_model=TaskRead, status_code=status.HTTP_201_CREATED)
async def create_task(
    task: TaskCreate,
    request: Request,
    session: Session = Depends(get_session),
) -> TaskRead:
    """
    Create a new task for the authenticated user.
    Validates title (required, max 200 chars) and description (max 1000 chars).
    """
    current_user = await _get_user(request)

    # T041: Title validation (required, max 200 chars)
    if not task.title or not task.title.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Title is required",
        )
    if len(task.title) > 200:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Title must be 200 characters or less",
        )

    # T042: Description validation (max 1000 chars)
    if task.description and len(task.description) > 1000:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Description must be 1000 characters or less",
        )

    # Create task with user association
    db_task = Task(
        title=task.title.strip(),
        description=task.description.strip() if task.description else None,
        user_id=current_user.user_id,
        completed=False,
    )

    session.add(db_task)
    session.commit()
    session.refresh(db_task)

    return TaskRead.model_validate(db_task)


# T048, T050: PUT /api/tasks/{id} - Update task with ownership verification
@router.put("/tasks/{task_id}", response_model=TaskRead)
async def update_task(
    task_id: int,
    task_update: TaskUpdate,
    request: Request,
    session: Session = Depends(get_session),
) -> TaskRead:
    """
    Update an existing task.
    User must own the task (T050 - ownership verification).
    """
    current_user = await _get_user(request)
    task = session.get(Task, task_id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )

    # Verify ownership (T050)
    if task.user_id != current_user.user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have permission to modify this task",
        )

    # Update fields if provided
    if task_update.title is not None:
        if not task_update.title.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Title cannot be empty",
            )
        if len(task_update.title) > 200:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Title must be 200 characters or less",
            )
        task.title = task_update.title.strip()

    if task_update.description is not None:
        if len(task_update.description) > 1000:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Description must be 1000 characters or less",
            )
        task.description = task_update.description if task_update.description else None

    if task_update.completed is not None:
        task.completed = task_update.completed

    task.updated_at = datetime.utcnow()

    session.commit()
    session.refresh(task)

    return TaskRead.model_validate(task)


# T049, T050: DELETE /api/tasks/{id} - Delete task with ownership verification
@router.delete("/tasks/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(
    task_id: int,
    request: Request,
    session: Session = Depends(get_session),
) -> None:
    """
    Delete a task.
    User must own the task (T050 - ownership verification).
    """
    current_user = await _get_user(request)
    task = session.get(Task, task_id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )

    # Verify ownership (T050)
    if task.user_id != current_user.user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have permission to delete this task",
        )

    session.delete(task)
    session.commit()


# T056: PATCH /api/tasks/{id}/complete - Toggle completion
@router.patch("/tasks/{task_id}/complete", response_model=TaskRead)
async def toggle_complete(
    task_id: int,
    request: Request,
    session: Session = Depends(get_session),
) -> TaskRead:
    """
    Toggle the completion status of a task.
    User must own the task.
    """
    current_user = await _get_user(request)
    task = session.get(Task, task_id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )

    # Verify ownership
    if task.user_id != current_user.user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have permission to modify this task",
        )

    # Toggle completion status
    task.completed = not task.completed
    task.updated_at = datetime.utcnow()

    session.commit()
    session.refresh(task)

    return TaskRead.model_validate(task)
