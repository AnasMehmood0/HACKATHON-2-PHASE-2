# Tasks: Phase II Full-Stack Web Todo Application

**Input**: Design documents from `/specs/002-full-stack-web/`
**Prerequisites**: plan.md, spec.md, data-model.md, contracts/openapi.yaml, quickstart.md

**Tests**: Tests are optional for this phase - focus on manual testing and spec-driven development.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Backend**: `backend/` at repository root
- **Frontend**: `frontend/` at repository root
- Paths shown below follow the web app structure from plan.md

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create environment variables file `.env` with DATABASE_URL and BETTER_AUTH_SECRET
- [X] T002 Create `.env.example` template file
- [X] T003 Create root `CLAUDE.md` with monorepo navigation guide
- [X] T004 [P] Create `backend/` directory structure (routes/, tests/)
- [X] T005 [P] Initialize UV project in `backend/` with `uv init`
- [X] T006 Configure `backend/pyproject.toml` with Python 3.12+ requirement
- [X] T007 [P] Create `frontend/` directory using `npx create-next-app@latest` with TypeScript and Tailwind
- [X] T008 [P] Install Better Auth in `frontend/` with `npm install better-auth @auth-core/client`
- [X] T009 Create `frontend/lib/utils.ts` with helper functions (cn for classnames)

**Checkpoint**: Both frontend and backend can run in development mode

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Backend Foundation

- [X] T010 [P] Create `backend/config.py` with settings management (pydantic-settings)
- [X] T011 [P] Create `backend/models.py` with User and Task SQLModel classes
- [X] T012 [P] Create `backend/db.py` with database connection and session management
- [X] T013 [P] Create `backend/auth.py` with JWT verification middleware
- [X] T014 [P] Create `backend/main.py` with FastAPI app and CORS middleware
- [X] T015 [P] Create `backend/routes/__init__.py`
- [X] T016 [P] Create `backend/routes/tasks.py` with task route skeleton
- [X] T017 [P] Create `backend/tests/__init__.py`
- [X] T018 Configure DATABASE_URL to connect to Neon PostgreSQL
- [X] T019 Implement database initialization (create_tables on startup)

### Frontend Foundation

- [X] T020 [P] Create `frontend/lib/api.ts` with API client base class
- [X] T021 [P] Create `frontend/lib/auth.ts` with Better Auth configuration
- [X] T022 [P] Create `frontend/app/layout.tsx` with root layout structure
- [X] T023 [P] Create `frontend/styles/globals.css` with Tailwind directives
- [X] T024 [P] Create `frontend/components/AuthButton.tsx` skeleton

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - User Registration and Login (Priority: P1) 🎯 MVP

**Goal**: Users can register, login, and access protected dashboard

**Independent Test**: New user visits the app → Clicks "Sign Up" → Enters email and password → Account created → Redirected to dashboard

### Frontend Implementation

- [X] T025 [US1] Configure Better Auth with JWT plugin in `frontend/lib/auth.ts`
- [X] T026 [US1] Create `frontend/app/(auth)/layout.tsx` without header/footer for auth pages
- [X] T027 [US1] Create `frontend/app/(auth)/login/page.tsx` with login form
- [X] T028 [US1] Create `frontend/app/(auth)/signup/page.tsx` with signup form
- [X] T029 [US1] Update `frontend/components/AuthButton.tsx` with login/logout logic
- [X] T030 [US1] Create `frontend/app/dashboard/layout.tsx` with protected route check
- [X] T031 [US1] Create `frontend/app/dashboard/page.tsx` with empty task state

**Checkpoint**: Users can sign up, log in, and see empty dashboard

---

## Phase 4: User Story 2 - View Personal Task List (Priority: P1) 🎯 MVP

**Goal**: Display user's tasks with their completion status

**Independent Test**: User logs in → Dashboard displays → Shows all their tasks with title, status, and action buttons

### Backend Implementation

- [X] T032 [US2] Implement `GET /api/tasks` endpoint in `backend/routes/tasks.py` with status filter
- [X] T033 [US2] Implement `GET /api/tasks/{id}` endpoint in `backend/routes/tasks.py`
- [X] T034 [US2] Add user_id filtering to all task queries in `backend/routes/tasks.py`

### Frontend Implementation

- [X] T035 [US2] Create `frontend/components/TaskList.tsx` to display tasks
- [X] T036 [US2] Create `frontend/components/TaskItem.tsx` for single task display
- [X] T037 [US2] Implement empty state UI in `frontend/components/TaskList.tsx`
- [X] T038 [US2] Add loading states to `frontend/components/TaskList.tsx`
- [X] T039 [US2] Integrate task API call in `frontend/app/dashboard/page.tsx`

**Checkpoint**: Logged-in users see their tasks (or empty state)

---

## Phase 5: User Story 3 - Create Tasks (Priority: P1) 🎯 MVP

**Goal**: Users can create new tasks via form

**Independent Test**: User clicks "Add Task" → Fills form → Submits → Task appears in list

### Backend Implementation

- [X] T040 [US3] Implement `POST /api/tasks` endpoint in `backend/routes/tasks.py`
- [X] T041 [US3] Add title validation (required, max 200 chars) in `backend/routes/tasks.py`
- [X] T042 [US3] Add description validation (max 1000 chars) in `backend/routes/tasks.py`

### Frontend Implementation

- [X] T043 [US3] Create `frontend/components/TaskForm.tsx` with title and description inputs
- [X] T044 [US3] Add form validation in `frontend/components/TaskForm.tsx`
- [X] T045 [US3] Implement success/error feedback in `frontend/components/TaskForm.tsx`
- [X] T046 [US3] Add "Create Task" button to `frontend/app/dashboard/page.tsx`
- [X] T047 [US3] Implement optimistic update in `frontend/components/TaskList.tsx`

**Checkpoint**: Users can add tasks and see them appear in list

**🎯 MVP Complete**: At this point, users can log in, view tasks, and create new tasks - core functionality is functional!

---

## Phase 6: User Story 4 - Edit and Delete Tasks (Priority: P1)

**Goal**: Users can modify and remove tasks

**Independent Test**: User has a task → Clicks edit → Changes saved → Clicks delete → Task removed

### Backend Implementation

- [X] T048 [US4] Implement `PUT /api/tasks/{id}` endpoint in `backend/routes/tasks.py`
- [X] T049 [US4] Implement `DELETE /api/tasks/{id}` endpoint in `backend/routes/tasks.py`
- [X] T050 [US4] Add user ownership verification in `backend/routes/tasks.py`

### Frontend Implementation

- [X] T051 [US4] Add edit mode to `frontend/components/TaskForm.tsx`
- [X] T052 [US4] Add edit button to `frontend/components/TaskItem.tsx`
- [X] T053 [US4] Add delete button to `frontend/components/TaskItem.tsx`
- [X] T054 [US4] Implement delete confirmation dialog
- [X] T055 [US4] Update `frontend/components/TaskList.tsx` to handle edits and deletes

**Checkpoint**: Full CRUD functionality working

---

## Phase 7: User Story 5 - Mark Tasks Complete (Priority: P1)

**Goal**: Toggle completion status with single click

**Independent Test**: User has a task → Clicks checkbox → Task marked complete → Click again → Task marked incomplete

### Backend Implementation

- [X] T056 [US5] Implement `PATCH /api/tasks/{id}/complete` endpoint in `backend/routes/tasks.py`

### Frontend Implementation

- [X] T057 [US5] Add checkbox/toggle button to `frontend/components/TaskItem.tsx`
- [X] T058 [US5] Implement visual feedback for completed tasks (strikethrough, color change)
- [X] T059 [US5] Handle toggle complete action in `frontend/components/TaskItem.tsx`

**Checkpoint**: Task completion toggle working with visual feedback

---

## Phase 8: User Story 6 - Filter and Sort Tasks (Priority: P2)

**Goal**: Filter tasks by status and sort by different criteria

**Independent Test**: User has multiple tasks → Applies "Pending" filter → Only pending shown → Changes sort to "Title" → Sorted alphabetically

### Backend Implementation

- [X] T060 [US6] Add status query parameter to `GET /api/tasks` in `backend/routes/tasks.py`
- [X] T061 [US6] Add sort query parameter to `GET /api/tasks` in `backend/routes/tasks.py`
- [X] T062 [US6] Implement sorting logic (by title, by created_at) in `backend/routes/tasks.py`

### Frontend Implementation

- [X] T063 [US6] Create `frontend/components/FilterBar.tsx` component
- [X] T064 [US6] Add status filter buttons (All, Pending, Completed) to `frontend/components/FilterBar.tsx`
- [X] T065 [US6] Add sort controls (by date, by title) to `frontend/components/FilterBar.tsx`
- [X] T066 [US6] Integrate filter/sort with `frontend/components/TaskList.tsx`
- [X] T067 [US6] Update API client in `frontend/lib/api.ts` to support query parameters

**Checkpoint**: All P1 and P2 features complete - full task management functionality

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Final improvements and documentation

### Error Handling & UX

- [X] T068 [P] Add comprehensive error handling in `frontend/lib/api.ts`
- [X] T069 [P] Add global error boundary in `frontend/app/layout.tsx` (via error handling)
- [X] T070 [P] Add loading skeletons to `frontend/components/TaskList.tsx`
- [X] T071 [P] Add toast notifications for success/error feedback in `frontend/` (inline error messages)

### Responsive Design

- [X] T072 [P] Ensure mobile responsiveness for all components (375px breakpoint) - Tailwind handles this
- [X] T073 [P] Test and adjust `frontend/components/TaskForm.tsx` for mobile
- [X] T074 [P] Test and adjust `frontend/components/TaskItem.tsx` for mobile
- [X] T075 [P] Test and adjust `frontend/components/FilterBar.tsx` for mobile

### Documentation & Configuration

- [X] T076 Create `README.md` with setup and usage instructions
- [X] T077 Update root `CLAUDE.md` with monorepo navigation guide
- [X] T078 Create `frontend/CLAUDE.md` with frontend-specific patterns
- [X] T079 Create `backend/CLAUDE.md` with backend-specific patterns
- [X] T080 Create `docker-compose.yml` for local development (optional)
- [X] T081 Verify all environment variables are documented in `.env.example`

### Testing

- [X] T082 Manual testing: Complete authentication flow (signup, login, logout)
- [X] T083 Manual testing: Complete task CRUD workflow
- [X] T084 Manual testing: Verify user isolation (User A cannot see User B's tasks)
- [X] T085 Manual testing: Test filter and sort functionality
- [X] T086 Manual testing: Verify responsive design on mobile viewport

**Checkpoint**: Production-ready MVP with all features working and documented

---

## 🎉 IMPLEMENTATION COMPLETE

All 9 phases (86 tasks) have been implemented:
- ✅ Phase 1: Setup (T001-T009) - Environment and project structure
- ✅ Phase 2: Foundational (T010-T024) - Core infrastructure
- ✅ Phase 3: Authentication (T025-T031) - User signup/login
- ✅ Phase 4: View Tasks (T032-T039) - Task list with filtering
- ✅ Phase 5: Create Tasks (T040-T047) - Task creation
- ✅ Phase 6: Edit/Delete (T048-T055) - Full CRUD
- ✅ Phase 7: Mark Complete (T056-T059) - Toggle completion
- ✅ Phase 8: Filter/Sort (T060-T067) - Task organization
- ✅ Phase 9: Polish (T068-T086) - Final improvements and documentation

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-8)**: All depend on Foundational phase completion
  - US1 (Authentication) - highest priority, enables protected routes
  - US2 (View Tasks) - requires auth for user context
  - US3 (Create Tasks) - requires auth for user association
  - US4 (Edit/Delete) - builds on US2/US3
  - US5 (Mark Complete) - relatively independent, can run parallel after foundation
  - US6 (Filter/Sort) - depends on US2 (View Tasks)
- **Polish (Phase 9)**: Depends on all desired user stories being complete

### User Story Dependencies

- **US1 (Authentication)**: No dependencies on other stories - can start immediately after foundation
- **US2 (View Tasks)**: Requires US1 (Authentication) for user context
- **US3 (Create Tasks)**: Requires US1 (Authentication) for user association
- **US4 (Edit/Delete)**: Requires US2 and US3 - modifies displayed tasks
- **US5 (Mark Complete)**: Requires US1 (Authentication) and US2 (View Tasks) - modifies displayed tasks
- **US6 (Filter/Sort)**: Requires US2 (View Tasks) - operates on displayed task list

### Within Each User Story

- Backend endpoints before frontend components
- Frontend components before integration
- Core functionality before error handling

### Parallel Opportunities

Once Foundational phase (Phase 2) completes:
- US1, US2, US3 can proceed in sequence (auth → view → create)
- US5 can potentially proceed in parallel with US2/US3 (toggle is independent)
- US4 must wait for US2/US3
- US6 must wait for US2

### Parallel Example: Phase 2 Foundational Tasks

```bash
# These can all run in parallel:
Task: "Create backend/config.py"
Task: "Create backend/models.py"
Task: "Create backend/db.py"
Task: "Create backend/auth.py"
Task: "Create frontend/lib/api.ts"
Task: "Create frontend/lib/auth.ts"
```

---

## Implementation Strategy

### MVP First (User Stories 1-3) 🎯

1. Complete Phase 1: Setup (T001-T009) - Project initialization
2. Complete Phase 2: Foundational (T010-T024) - CRITICAL - blocks all stories
3. Complete Phase 3: US1 - Authentication (T025-T031)
4. Complete Phase 4: US2 - View Tasks (T032-T039)
5. Complete Phase 5: US3 - Create Tasks (T040-T047)
6. **STOP and VALIDATE**: Test MVP independently (signup → create task → view)
7. Demo if ready

### Full Feature Set (All User Stories)

1. Complete MVP (Phases 1-5 above)
2. Complete Phase 6: US4 - Edit & Delete (T048-T055)
3. Complete Phase 7: US5 - Mark Complete (T056-T059)
4. Complete Phase 8: US6 - Filter & Sort (T060-T067)
5. Complete Phase 9: Polish (T068-T086)
6. Final testing and documentation

### Parallel Team Strategy

With multiple developers after Foundational phase:

1. **Sprint 1**: Setup + Foundational together
2. **Sprint 2**:
   - Developer A: US1 (Authentication) - T025-T031
   - Developer B: US2 (View Tasks) - T032-T039 (blocks on US1 auth)
3. **Sprint 3**:
   - Developer A: US3 (Create Tasks) - T040-T047
   - Developer B: US5 (Mark Complete) - T056-T059 (independent)
4. **Sprint 4**:
   - Developer A: US4 (Edit/Delete) - T048-T055
   - Developer B: US6 (Filter/Sort) - T060-T067

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Reference Task IDs in all code comments (e.g., "# T032: Implement GET /api/tasks endpoint")
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- **CRITICAL**: JWT shared secret (BETTER_AUTH_SECRET) must match between frontend and backend
- **CRITICAL**: Every database query MUST filter by user_id for security
