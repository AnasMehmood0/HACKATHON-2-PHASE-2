# Implementation Plan: Phase I Console Todo App

**Branch**: `phase-1-console-todo` | **Date**: 2025-02-06 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/phase-1-console-todo/spec.md`

## Summary

Build a command-line todo application using Python 3.13+ that stores tasks in memory. The app supports 5 core operations: add, list, update, delete, and toggle completion status. All implementation must follow Spec-Driven Development principles with no manual coding allowed.

## Technical Context

**Language/Version**: Python 3.12+ (adjusted for compatibility)
**Primary Dependencies**: None (standard library only)
**Storage**: In-memory (dict mapping task IDs to Task objects)
**Testing**: Manual testing required; pytest optional
**Target Platform**: Console/CLI (Linux/Windows/Mac)
**Project Type**: Single Python project
**Performance Goals**: <100ms for all operations
**Constraints**: No file I/O, no persistence, no external dependencies
**Scale/Scope**: Single user, unlimited tasks (practical limit ~1000 for usability)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Spec-Driven Development | ✅ PASS | Following Specify → Plan → Tasks → Implement |
| II. Clean Code & Python Standards | ✅ PASS | Will use PEP 8, type hints, docstrings |
| III. In-Memory Storage | ✅ PASS | Using dict for storage, no persistence |
| IV. Console Interface | ✅ PASS | CLI using stdin/stdout |
| V. Minimum Viable Product | ✅ PASS | Only implementing 5 specified features |

## Project Structure

### Documentation (this feature)

```text
specs/phase-1-console-todo/
├── spec.md              # This file's source (/sp.spec command output)
├── plan.md              # This file (/sp.plan command output)
└── tasks.md             # Phase 2 output (/sp.tasks command)
```

### Source Code (repository root)

```text
src/
├── __init__.py
├── models/
│   ├── __init__.py
│   └── task.py          # Task dataclass
├── services/
│   ├── __init__.py
│   └── todo_service.py  # Core business logic (TodoService class)
├── cli/
│   ├── __init__.py
│   ├── commands.py      # Command handlers
│   └── main.py          # Console interface and REPL
└── main.py              # Entry point

tests/
├── __init__.py
├── test_task.py         # Task model tests
├── test_todo_service.py # TodoService tests
└── test_cli.py          # CLI tests

README.md                # Setup and usage instructions
pyproject.toml           # UV project configuration
```

**Structure Decision**: Single project structure chosen because Phase I is a simple console app with no frontend/backend separation. Models contain data structures, services contain business logic, and CLI contains presentation logic.

## Component Design

### Task Model (`src/models/task.py`)

```python
from dataclasses import dataclass

@dataclass
class Task:
    """Represents a single todo item."""
    id: int
    title: str
    description: str | None = None
    completed: bool = False
```

**Rationale**: Using `dataclass` provides immutability options, nice `__repr__`, and minimal boilerplate.

### TodoService (`src/services/todo_service.py`)

```python
class TodoService:
    """Manages in-memory task storage and operations."""

    def __init__(self) -> None: ...
    def add_task(self, title: str, description: str | None = None) -> Task: ...
    def list_tasks(self) -> list[Task]: ...
    def get_task(self, task_id: int) -> Task | None: ...
    def update_task(self, task_id: int, title: str | None = None,
                    description: str | None = None) -> Task | None: ...
    def delete_task(self, task_id: int) -> bool: ...
    def toggle_complete(self, task_id: int, completed: bool = True) -> Task | None: ...
```

**Storage**: `dict[int, Task]` for O(1) lookup by ID.
**ID Generation**: Incremental counter starting at 1, never reused.

### CLI Interface (`src/cli/main.py`)

```python
def print_help() -> None: ...
def format_task(task: Task) -> str: ...
def parse_command(input_str: str) -> tuple[str, list[str]]: ...
def run_repl() -> None: ...
```

**Command Format**:
- `add <title> [--desc <description>]`
- `list`
- `update <id> [--title <title>] [--desc <description>]`
- `delete <id>`
- `complete <id>`
- `uncomplete <id>`
- `help`
- `exit`

## Complexity Tracking

> No violations - all design decisions align with constitution principles.

| Aspect | Decision | Justification |
|--------|----------|---------------|
| Data Structure | dict for storage | O(1) lookup by ID, simple |
| Task Model | dataclass | Built-in, no dependencies, clean |
| CLI Pattern | REPL loop | Standard for console apps, easy to use |
| Error Handling | Exceptions with messages | Pythonic, clear user feedback |

## Dependencies & Execution Order

### Phase Dependencies
1. **Setup**: Initialize project structure
2. **Foundational**: Create model, service, CLI skeleton
3. **User Stories**: Implement features in priority order (P1 → P2)
4. **Polish**: Help text, validation, documentation

### Within Each User Story
1. Implement service method first
2. Add CLI command handler
3. Test manually
4. Move to next story

## Data Flow

```
User Input (stdin)
    ↓
CLI Parser (parse_command)
    ↓
Command Handler (commands.py)
    ↓
TodoService (business logic)
    ↓
Task Model (data)
    ↓
Output (stdout)
```

## Error Handling Strategy

| Error Type | Handler | User Message |
|------------|---------|--------------|
| Empty title | ValueError | "Title is required" |
| Invalid task ID | KeyError | "Task not found" |
| Invalid command | ValueError | "Unknown command. Type 'help' for available commands" |
| Invalid ID format | ValueError | "Invalid task ID. Must be a number." |
| No update data | ValueError | "At least one field must be provided" |

## Testing Approach

### Manual Testing (Required)
Each user story has independent test scenarios defined in spec.md

### Optional Unit Tests
```python
def test_add_task():
def test_list_empty():
def test_list_tasks():
def test_toggle_complete():
def test_update_task():
def test_delete_task():
```

## Success Criteria

From spec.md, verified during implementation:
- SC-001: First task in <10 seconds ✅
- SC-002: All operations <100ms ✅
- SC-003: Intuitive command flow ✅
- SC-004: Independent user stories ✅
- SC-005: 100% type hint coverage ✅

---

## Implementation Status

**Status**: ✅ COMPLETE (Implemented 2025-02-06)

All components from this plan have been implemented:

- ✅ Task model with dataclass (`src/models/task.py`)
- ✅ TodoService with in-memory storage (`src/services/todo_service.py`)
- ✅ CLI commands and REPL loop (`src/cli/commands.py`, `src/cli/main.py`)
- ✅ All 5 user stories implemented:
  - View Task List
  - Add Task
  - Mark Task Complete
  - Update Task
  - Delete Task

**Files Created**:
- `src/models/task.py` - Task dataclass
- `src/services/todo_service.py` - Business logic
- `src/cli/commands.py` - Command handlers
- `src/cli/main.py` - REPL interface
- `src/main.py` - Entry point
- `README.md` - Documentation
- `pyproject.toml` - Project configuration

**Testing**: All features verified working via manual testing.
