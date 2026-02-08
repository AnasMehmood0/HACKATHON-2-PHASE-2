# Tasks: Phase I Console Todo App

**Input**: Design documents from `/specs/phase-1-console-todo/`
**Prerequisites**: plan.md, spec.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create directory structure: `src/`, `src/models/`, `src/services/`, `src/cli/`, `tests/`
- [x] T002 Initialize UV project with `uv init` at project root
- [x] T003 Configure `pyproject.toml` for Python 3.12+ requirement

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 [P] Create Task model in `src/models/task.py` with dataclass containing id, title, description, completed fields
- [x] T005 [P] Create `src/models/__init__.py` exporting Task class
- [x] T006 [P] Create `src/services/__init__.py`
- [x] T007 [P] Create TodoService class skeleton in `src/services/todo_service.py` with __init__ method setting up empty storage dict
- [x] T008 Create `src/cli/__init__.py`
- [x] T009 Create `src/cli/commands.py` with command handler function skeletons
- [x] T010 Create `src/cli/main.py` with REPL loop skeleton
- [x] T011 Create `src/main.py` entry point
- [x] T012 Create `tests/__init__.py`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - View Task List (Priority: P1) 🎯 MVP

**Goal**: Users can see all tasks with their completion status

**Independent Test**: Start app → Run list → See empty list message or tasks with IDs

- [x] T013 [US1] Implement `TodoService.list_tasks()` method returning list of all Tasks
- [x] T014 [US1] Implement `format_task(task: Task) -> str` function in `src/cli/main.py` for display formatting
- [x] T015 [US1] Implement list command handler in `src/cli/commands.py`
- [x] T016 [US1] Wire list command to REPL in `src/cli/main.py`

**Checkpoint**: At this point, users can run the app and list tasks (should show empty message)

---

## Phase 4: User Story 2 - Add Task (Priority: P1) 🎯 MVP

**Goal**: Users can create new tasks with title and optional description

**Independent Test**: Run add command → Run list → See new task

- [x] T017 [US2] Implement `TodoService.add_task(title: str, description: str | None)` method returning new Task with auto-increment ID
- [x] T018 [US2] Implement add command handler in `src/cli/commands.py` with title validation
- [x] T019 [US2] Wire add command to REPL in `src/cli/main.py`

**Checkpoint**: At this point, users can add tasks and see them in the list

---

## Phase 5: User Story 3 - Mark Task Complete (Priority: P1) 🎯 MVP

**Goal**: Users can toggle task completion status

**Independent Test**: Add task → Mark complete → List shows [✓]

- [x] T020 [US3] Implement `TodoService.toggle_complete(task_id: int, completed: bool)` method
- [x] T021 [US3] Implement `TodoService.get_task(task_id: int)` method for lookup
- [x] T022 [US3] Implement complete command handler in `src/cli/commands.py`
- [x] T023 [US3] Implement uncomplete command handler in `src/cli/commands.py`
- [x] T024 [US3] Wire complete/uncomplete commands to REPL in `src/cli/main.py`

**Checkpoint**: At this point, MVP is complete - users can add, list, and toggle tasks

---

## Phase 6: User Story 4 - Update Task (Priority: P2)

**Goal**: Users can modify task title and/or description

**Independent Test**: Add task → Update title → List shows new title

- [x] T025 [US4] Implement `TodoService.update_task(task_id: int, title: str | None, description: str | None)` method
- [x] T026 [US4] Implement update command handler in `src/cli/commands.py` with validation
- [x] T027 [US4] Wire update command to REPL in `src/cli/main.py`

**Checkpoint**: At this point, users can modify existing tasks

---

## Phase 7: User Story 5 - Delete Task (Priority: P2)

**Goal**: Users can remove tasks from their list

**Independent Test**: Add task → Delete → List no longer shows task

- [x] T028 [US5] Implement `TodoService.delete_task(task_id: int)` method returning bool
- [x] T029 [US5] Implement delete command handler in `src/cli/commands.py`
- [x] T030 [US5] Wire delete command to REPL in `src/cli/main.py`

**Checkpoint**: All 5 core features are now functional

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T031 Implement `print_help()` function in `src/cli/main.py` showing all commands
- [x] T032 Wire help command to REPL
- [x] T033 Add input validation for all commands (invalid task IDs, empty titles, etc.)
- [x] T034 Add clear error messages for all error scenarios
- [x] T035 Implement graceful exit command
- [x] T036 Create README.md with setup and usage instructions
- [x] T037 Add docstrings to all public functions and classes
- [x] T038 Verify type hints on all functions

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-7)**: All depend on Foundational phase completion
- **Polish (Phase 8)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable

### Within Each User Story

- Service methods before command handlers
- Command handlers before REPL wiring
- Core implementation before error handling

### Parallel Opportunities

- All Setup tasks (T001-T003) can run sequentially but are quick
- All Foundational tasks marked [P] (T004-T006, T008) can run in parallel
- User stories can be developed sequentially in priority order for single developer

---

## Implementation Strategy

### MVP First (User Stories 1-3 Only)

1. Complete Phase 1: Setup (T001-T003)
2. Complete Phase 2: Foundational (T004-T012) - CRITICAL
3. Complete Phase 3: User Story 1 (T013-T016)
4. Complete Phase 4: User Story 2 (T017-T019)
5. Complete Phase 5: User Story 3 (T020-T024)
6. **STOP and VALIDATE**: Test MVP independently
7. Demo if ready

### Full Feature Set (All User Stories)

1. Complete MVP (Phases 1-5 above)
2. Complete Phase 6: User Story 4 (T025-T027)
3. Complete Phase 7: User Story 5 (T028-T030)
4. Complete Phase 8: Polish (T031-T038)
5. Final testing and documentation

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Reference Task IDs in all code comments (e.g., "# T013: Implement list_tasks()")
- Commit after each user story completion
- Stop at any checkpoint to validate story independently

---

## Implementation Status

**Status**: ✅ **COMPLETE** (All 38 tasks completed - 2025-02-06)

### Summary

| Phase | Tasks | Status |
|-------|-------|--------|
| Phase 1: Setup | T001-T003 (3 tasks) | ✅ Complete |
| Phase 2: Foundational | T004-T012 (9 tasks) | ✅ Complete |
| Phase 3: US1 - View List | T013-T016 (4 tasks) | ✅ Complete |
| Phase 4: US2 - Add Task | T017-T019 (3 tasks) | ✅ Complete |
| Phase 5: US3 - Mark Complete | T020-T024 (5 tasks) | ✅ Complete |
| Phase 6: US4 - Update Task | T025-T027 (3 tasks) | ✅ Complete |
| Phase 7: US5 - Delete Task | T028-T030 (3 tasks) | ✅ Complete |
| Phase 8: Polish | T031-T038 (8 tasks) | ✅ Complete |
| **TOTAL** | **38 tasks** | **✅ 100% Complete** |

### Files Created

- `src/models/task.py` - Task dataclass (T004)
- `src/models/__init__.py` - Module exports (T005)
- `src/services/todo_service.py` - Business logic (T007)
- `src/services/__init__.py` - Module exports (T006)
- `src/cli/commands.py` - Command handlers (T009)
- `src/cli/main.py` - REPL interface (T010)
- `src/cli/__init__.py` - Module exports (T008)
- `src/main.py` - Entry point (T011)
- `tests/__init__.py` - Test module (T012)
- `README.md` - Documentation (T036)
- `pyproject.toml` - Project config (T002-T003)

### Verification

All 5 user stories tested and working:
- ✅ View Task List - Displays tasks with completion status
- ✅ Add Task - Creates tasks with title and optional description
- ✅ Mark Task Complete - Toggles completion with [✓] indicator
- ✅ Update Task - Modifies title and/or description
- ✅ Delete Task - Removes tasks from list
