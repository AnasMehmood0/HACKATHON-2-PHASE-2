# Evolution of Todo - Phase I: In-Memory Console Todo App

A simple command-line todo application built with Python 3.13+ using Spec-Driven Development principles.

## Features

- **Add Task**: Create new tasks with title and optional description
- **List Tasks**: View all tasks with completion status indicators
- **Update Task**: Modify task title and/or description
- **Delete Task**: Remove tasks from your list
- **Mark Complete/Incomplete**: Toggle task completion status

## Installation

### Prerequisites

- Python 3.13 or higher
- UV package manager

### Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd h2-phase
```

2. Install dependencies (none required - uses stdlib only):
```bash
uv sync
```

## Usage

### Start the Application

```bash
uv run python src/main.py
```

Or if installed as a package:
```bash
todo
```

### Available Commands

| Command | Usage | Description |
|---------|-------|-------------|
| `add` | `add <title> [--desc <description>]` | Create a new task |
| `list` | `list` | Display all tasks |
| `update` | `update <id> [--title <t>] [--desc <d>]` | Modify a task |
| `delete` | `delete <id>` | Remove a task |
| `complete` | `complete <id>` | Mark task as complete |
| `uncomplete` | `uncomplete <id>` | Mark task as incomplete |
| `help` | `help` | Show help message |
| `exit` | `exit` | Quit the application |

### Example Session

```
Todo Console App - Type 'help' for commands, 'exit' to quit
--------------------------------------------------

todo> add Buy groceries
Task added: [1] Buy groceries

todo> add Call dentist --desc Schedule checkup
Task added: [2] Call dentist

todo> list
Your Tasks:

  [ ] [1] Buy groceries
  [ ] [2] Call dentist - Schedule checkup

todo> complete 1
Marked as complete: [1] Buy groceries

todo> list
Your Tasks:

  [✓] [1] Buy groceries
  [ ] [2] Call dentist - Schedule checkup

todo> update 2 --title Call dentist --desc Schedule for next week
Task updated: [2] Call dentist

todo> delete 1
Task deleted: 1

todo> list
Your Tasks:

  [ ] [2] Call dentist - Schedule for next week

todo> exit
Goodbye!
```

## Project Structure

```
src/
├── models/
│   └── task.py          # Task dataclass
├── services/
│   └── todo_service.py  # Business logic
├── cli/
│   ├── commands.py      # Command handlers
│   └── main.py          # REPL loop
└── main.py              # Entry point

specs/                    # Feature specifications
tests/                    # Test files
.specify/                 # Spec-Kit configuration
```

## Development

This project follows **Spec-Driven Development** using:
- **Claude Code**: AI coding assistant
- **Spec-Kit Plus**: Specification management framework

### Spec-Kit Workflow

1. **Constitution**: Project principles defined in `.specify/memory/constitution.md`
2. **Specify**: Feature requirements in `specs/phase-1-console-todo/spec.md`
3. **Plan**: Technical architecture in `specs/phase-1-console-todo/plan.md`
4. **Tasks**: Implementation tasks in `specs/phase-1-console-todo/tasks.md`
5. **Implement**: Code generation with reference to Task IDs

## Constraints (Phase I)

- In-memory storage only (no persistence)
- Standard library only (no external dependencies)
- Console interface only (no GUI)
- Single-user application

## Future Phases

- Phase II: Full-Stack Web Application (Next.js + FastAPI)
- Phase III: AI-Powered Todo Chatbot
- Phase IV: Local Kubernetes Deployment
- Phase V: Advanced Cloud Deployment

## License

MIT

## Hackathon Submission

Built for the "Evolution of Todo" hackathon - Phase I submission.
