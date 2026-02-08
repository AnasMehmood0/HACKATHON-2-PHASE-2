
## **Requirements**

You are required to complete the **5-Phase "Evolution of Todo" Project** using Claude Code and Spec-Kit Plus. The core deliverables are:

* **Spec-Driven Implementation:** You must implement all **5 Phases** of the project (detailed below). You are strictly required to use **Spec-Driven Development**. You must write a Markdown Constitution and Spec for every feature of the phase, and use **Claude Code** to generate the implementation.  
  * *Constraint:* You cannot write the code manually. You must refine the *Spec* until Claude Code generates the correct output.  
* **Integrated AI Chatbot:** In Phases III, IV, and V, you must implement a conversational interface using **OpenAI Chatkit**, **OpenAI Agents SDK**, and **Official MCP SDK**. The bot must be able to manage the user's Todo list via natural language (e.g., "Reschedule my morning meetings to 2 PM").  
* **Cloud Native Deployment:** In Phases IV and V, you must deploy the chatbot locally on Minikube, and on the cloud on DigitalOcean Kubernetes (DOKS). 

# **Todo App Feature Progression**

## **Basic Level (Core Essentials)**

These form the foundation—quick to build, essential for any MVP:

1. Add Task – Create new todo items  
2. Delete Task – Remove tasks from the list  
3. Update Task – Modify existing task details  
4. View Task List – Display all tasks  
5. Mark as Complete – Toggle task completion status

## **Intermediate Level (Organization & Usability)**

Add these to make the app feel polished and practical:

1.   
2. Priorities & Tags/Categories – Assign levels (high/medium/low) or labels (work/home)  
3. Search & Filter – Search by keyword; filter by status, priority, or date  
4. Sort Tasks – Reorder by due date, priority, or alphabetically

## **Advanced Level (Intelligent Features)**

1. Recurring Tasks – Auto-reschedule repeating tasks (e.g., "weekly meeting")  
2. Due Dates & Time Reminders – Set deadlines with date/time pickers; browser notifications

Use Agentic Dev Stack for building this hackathon project.

# **Hackathon Phases Overview**

| Phase | Description | Technology Stack | Points | Due Date |
| ----- | ----- | ----- | :---: | :---: |
| Phase I | In-Memory Python Console App | Python, Claude Code, Spec-Kit Plus | 100 | Dec 7, 2025 | Completed
| Phase II | Full-Stack Web Application | Next.js, FastAPI, SQLModel, Neon DB | 150 | Dec 14, 2025 | Completed
| Phase III | AI-Powered Todo Chatbot | OpenAI ChatKit, Agents SDK, Official MCP SDK | 200 | Dec 21, 2025 |
| Phase IV | Local Kubernetes Deployment | Docker, Minikube, Helm, kubectl-ai, kagent | 250 | Jan 4, 2026 |
| Phase V | Advanced Cloud Deployment | Kafka, Dapr, DigitalOcean DOKS | 300 | Jan 18, 2026 |
| **TOTAL** |  |  | **1,000** |  |

# **Bonus Points**

Participants can earn additional bonus points for exceptional implementations:

| Bonus Feature | Points |
| :---- | :---: |
| Reusable Intelligence – Create and use reusable intelligence via Claude Code Subagents and Agent Skills | \+200 |
| Create and use Cloud-Native Blueprints via Agent Skills | \+200 |
| Multi-language Support – Support Urdu in chatbot | \+100 |
| Voice Commands – Add voice input for todo commands | \+200 |
| **TOTAL BONUS** | **\+600** |

## **Project Details: The Evolution of Todo**

Focus and Theme: From CLI to Distributed Cloud-Native AI Systems.  
Goal: Students act as Product Architects, using AI to build progressively complex software without writing boilerplate code.

### **Project Overview**

This project simulates the real-world evolution of software. You will start with a simple script and end with a Kubernetes-managed, event-driven, AI-powered distributed system.

### **Phase Breakdown**

# **Phase II: Todo Full-Stack Web Application**

*Basic Level Functionality*

**Objective:** Using Claude Code and Spec-Kit Plus transform the console app into a modern multi-user web application with persistent storage.

💡**Development Approach:** Use the [Agentic Dev Stack workflow](#the-agentic-dev-stack:-agents.md-+-spec-kitplus-+-claude-code): Write spec → Generate plan → Break into tasks → Implement via Claude Code. No manual coding allowed. We will review the process, prompts, and iterations to judge each phase and project.

## **Requirements**

* Implement all 5 Basic Level features as a web application  
* Create RESTful API endpoints  
* Build responsive frontend interface  
* Store data in Neon Serverless PostgreSQL database  
* Authentication – Implement user signup/signin using Better Auth

## **Technology Stack**

| Layer | Technology |
| :---- | :---- |
| Frontend | Next.js 16+ (App Router) |
| Backend | Python FastAPI |
| ORM | SQLModel |
| Database | Neon Serverless PostgreSQL |
| Spec-Driven | Claude Code \+ Spec-Kit Plus |
| Authentication | Better Auth |

## **API Endpoints**

| Method | Endpoint | Description |
| :---- | :---- | :---- |
| GET | /api/{user\_id}/tasks | List all tasks |
| POST | /api/{user\_id}/tasks | Create a new task |
| GET | /api/{user\_id}/tasks/{id} | Get task details |
| PUT | /api/{user\_id}/tasks/{id} | Update a task |
| DELETE | /api/{user\_id}tasks/{id} | Delete a task |
| PATCH | /api/{user\_id}tasks/{id}/complete | Toggle completion |

# **Securing the REST API**

*Better Auth \+ FastAPI Integration*

# **The Challenge**

Better Auth is a JavaScript/TypeScript authentication library that runs on your **Next.js frontend**. However, your **FastAPI backend** is a separate Python service that needs to verify which user is making API requests.

# **The Solution: JWT Tokens**

Better Auth can be configured to issue **JWT (JSON Web Token)** tokens when users log in. These tokens are self-contained credentials that include user information and can be verified by any service that knows the secret key.

# **How It Works**

* User logs in on Frontend → Better Auth creates a session and issues a JWT token  
* Frontend makes API call → Includes the JWT token in the Authorization: Bearer \<token\> header  
* Backend receives request → Extracts token from header, verifies signature using shared secret  
* Backend identifies user → Decodes token to get user ID, email, etc. and matches it with the user ID in the URL  
* Backend filters data → Returns only tasks belonging to that user

# **What Needs to Change**

| Component | Changes Required |
| :---- | :---- |
| **Better Auth Config** | Enable JWT plugin to issue tokens |
| **Frontend API Client** | Attach JWT token to every API request header |
| **FastAPI Backend** | Add middleware to verify JWT and extract user |
| **API Routes** | Filter all queries by the authenticated user's ID |

# **The Shared Secret**

Both frontend (Better Auth) and backend (FastAPI) must use the **same secret key** for JWT signing and verification. This is typically set via environment variable **BETTER\_AUTH\_SECRET** in both services.

# **Security Benefits**

| Benefit | Description |
| :---- | :---- |
| **User Isolation** | Each user only sees their own tasks |
| **Stateless Auth** | Backend doesn't need to call frontend to verify users |
| **Token Expiry** | JWTs expire automatically (e.g., after 7 days) |
| **No Shared DB Session** | Frontend and backend can verify auth independently |

# **API Behavior Change**

**After Auth:**

| All endpoints require valid JWT token |
| :---- |
| Requests without token receive 401 Unauthorized |
| Each user only sees/modifies their own tasks |
| Task ownership is enforced on every operation |

# **Bottom Line**

The REST API endpoints stay the same (**GET /api/user\_id/tasks**, **POST /api/user\_id/tasks**, etc.), but every request now must include a JWT token, and all responses are filtered to only include that user's data.

# 

# 

# **Monorepo Organization For Full-Stack Projects With GitHub Spec-Kit \+ Claude Code**

This guide explains how to organize your Full-Stack Projects in a monorepo to integrate **GitHub Spec-Kit** for spec-driven development with **Claude Code**. This guide explains how to organize your repository so that Claude Code and Spec-Kit Plus can effectively edit both frontend (Next.js) and backend (FastAPI) code in a single context.

# **Spec-Kit Monorepo Folder Structure**

hackathon-todo/  
├── .spec-kit/                    \# Spec-Kit configuration  
│   └── config.yaml  
├── specs/                        \# Spec-Kit managed specifications  
│   ├── overview.md               \# Project overview  
│   ├── architecture.md           \# System architecture  
│   ├── features/                 \# Feature specifications  
│   │   ├── task-crud.md  
│   │   ├── authentication.md  
│   │   └── chatbot.md  
│   ├── api/                      \# API specifications  
│   │   ├── rest-endpoints.md  
│   │   └── mcp-tools.md  
│   ├── database/                 \# Database specifications  
│   │   └── schema.md  
│   └── ui/                       \# UI specifications  
│       ├── components.md  
│       └── pages.md  
├── CLAUDE.md                     \# Root Claude Code instructions  
├── frontend/  
│   ├── CLAUDE.md  
│   └── ... (Next.js app)  
├── backend/  
│   ├── CLAUDE.md  
│   └── ... (FastAPI app)  
├── docker-compose.yml  
└── README.md

# **Key Differences from Basic Monorepo**

| Aspect | Without Spec-Kit | With Spec-Kit |
| :---- | :---- | :---- |
| **Specs Location** | /specs (flat) | /specs (organized by type) |
| **Config File** | None | /.spec-kit/config.yaml |
| **Spec Format** | Freeform markdown | Spec-Kit conventions |
| **Referencing** | @specs/file.md | @specs/features/file.md |

# **Spec-Kit Config File**

\# .spec-kit/config.yaml  
name: hackathon-todo  
version: "1.0"  
   
structure:  
  specs\_dir: specs  
  features\_dir: specs/features  
  api\_dir: specs/api  
  database\_dir: specs/database  
  ui\_dir: specs/ui  
   
phases:  
  \- name: phase1-console  
    features: \[task-crud\]  
  \- name: phase2-web  
    features: \[task-crud, authentication\]  
  \- name: phase3-chatbot  
    features: \[task-crud, authentication, chatbot\]

# **CLAUDE.md Files**

Create multiple CLAUDE.md files to provide context at different levels:

# **Root CLAUDE.md**

\# Todo App \- Hackathon II  
   
\#\# Project Overview  
This is a monorepo using GitHub Spec-Kit for spec-driven development.  
   
\#\# Spec-Kit Structure  
Specifications are organized in /specs:  
\- /specs/overview.md \- Project overview  
\- /specs/features/ \- Feature specs (what to build)  
\- /specs/api/ \- API endpoint and MCP tool specs  
\- /specs/database/ \- Schema and model specs  
\- /specs/ui/ \- Component and page specs  
   
\#\# How to Use Specs  
1\. Always read relevant spec before implementing  
2\. Reference specs with: @specs/features/task-crud.md  
3\. Update specs if requirements change  
   
\#\# Project Structure  
\- /frontend \- Next.js 14 app  
\- /backend \- Python FastAPI server  
   
\#\# Development Workflow  
1\. Read spec: @specs/features/\[feature\].md  
2\. Implement backend: @backend/CLAUDE.md  
3\. Implement frontend: @frontend/CLAUDE.md  
4\. Test and iterate  
   
\#\# Commands  
\- Frontend: cd frontend && npm run dev  
\- Backend: cd backend && uvicorn main:app \--reload  
\- Both: docker-compose up

## **Frontend CLAUDE.md**

\# Frontend Guidelines  
   
\#\# Stack  
\- Next.js 14 (App Router)  
\- TypeScript  
\- Tailwind CSS  
   
\#\# Patterns  
\- Use server components by default  
\- Client components only when needed (interactivity)  
\- API calls go through \`/lib/api.ts\`  
   
\#\# Component Structure  
\- \`/components\` \- Reusable UI components  
\- \`/app\` \- Pages and layouts  
   
\#\# API Client  
All backend calls should use the api client:  
   
import { api } from '@/lib/api'  
const tasks \= await api.getTasks()  
   
\#\# Styling  
\- Use Tailwind CSS classes  
\- No inline styles  
\- Follow existing component patterns

## 

## **Backend CLAUDE.md**

\# Backend Guidelines  
   
\#\# Stack  
\- FastAPI  
\- SQLModel (ORM)  
\- Neon PostgreSQL  
   
\#\# Project Structure  
\- \`main.py\` \- FastAPI app entry point  
\- \`models.py\` \- SQLModel database models  
\- \`routes/\` \- API route handlers  
\- \`db.py\` \- Database connection  
   
\#\# API Conventions  
\- All routes under \`/api/\`  
\- Return JSON responses  
\- Use Pydantic models for request/response  
\- Handle errors with HTTPException  
   
\#\# Database  
\- Use SQLModel for all database operations  
\- Connection string from environment variable: DATABASE\_URL  
   
\#\# Running  
uvicorn main:app \--reload \--port 8000

# 

# **Example Spec Files**

## **/specs/overview.md**

\# Todo App Overview  
   
\#\# Purpose  
A todo application that evolves from console app to AI chatbot.  
   
\#\# Current Phase  
Phase II: Full-Stack Web Application  
   
\#\# Tech Stack  
\- Frontend: Next.js 14, TypeScript, Tailwind CSS  
\- Backend: FastAPI, SQLModel, Neon PostgreSQL  
\- Auth: Better Auth with JWT  
   
\#\# Features  
\- \[ \] Task CRUD operations  
\- \[ \] User authentication  
\- \[ \] Task filtering and sorting

## **/specs/features/task-crud.md**

\# Feature: Task CRUD Operations  
   
\#\# User Stories  
\- As a user, I can create a new task  
\- As a user, I can view all my tasks  
\- As a user, I can update a task  
\- As a user, I can delete a task  
\- As a user, I can mark a task complete  
   
\#\# Acceptance Criteria  
   
\#\#\# Create Task  
\- Title is required (1-200 characters)  
\- Description is optional (max 1000 characters)  
\- Task is associated with logged-in user  
   
\#\#\# View Tasks  
\- Only show tasks for current user  
\- Display title, status, created date  
\- Support filtering by status

## **/specs/api/rest-endpoints.md**

\# REST API Endpoints  
   
\#\# Base URL  
\- Development: http://localhost:8000  
\- Production: https://api.example.com  
   
\#\# Authentication  
All endpoints require JWT token in header:  
Authorization: Bearer \<token\>  
   
\#\# Endpoints  
   
\#\#\# GET /api/tasks  
List all tasks for authenticated user.  
   
Query Parameters:  
\- status: "all" | "pending" | "completed"  
\- sort: "created" | "title" | "due\_date"  
   
Response: Array of Task objects  
   
\#\#\# POST /api/tasks  
Create a new task.  
   
Request Body:  
\- title: string (required)  
\- description: string (optional)  
   
Response: Created Task object

## **/specs/database/schema.md**

\# Database Schema  
   
\#\# Tables  
   
\#\#\# users (managed by Better Auth)  
\- id: string (primary key)  
\- email: string (unique)  
\- name: string  
\- created\_at: timestamp  
   
\#\#\# tasks  
\- id: integer (primary key)  
\- user\_id: string (foreign key \-\> users.id)  
\- title: string (not null)  
\- description: text (nullable)  
\- completed: boolean (default false)  
\- created\_at: timestamp  
\- updated\_at: timestamp  
   
\#\# Indexes  
\- tasks.user\_id (for filtering by user)  
\- tasks.completed (for status filtering)

# **Workflow with Spec-KitPlus \+ Claude Code**

* Write/Update Spec → @specs/features/new-feature.md  
* Ask Claude Code to Implement → "Implement @specs/features/new-feature.md"  
* Claude Code reads: Root CLAUDE.md, Feature spec, API spec, Database spec, Relevant CLAUDE.md  
* Claude Code implements in both frontend and backend  
* Test and iterate on spec if needed

# **Referencing Specs in Claude Code**

\# Implement a feature  
You: @specs/features/task-crud.md implement the create task feature  
   
\# Implement API  
You: @specs/api/rest-endpoints.md implement the GET /api/tasks endpoint  
   
\# Update database  
You: @specs/database/schema.md add due\_date field to tasks  
   
\# Full feature across stack  
You: @specs/features/authentication.md implement Better Auth login

# **Summary**

| Component | Purpose |
| :---- | :---- |
| **/.spec-kit/config.yaml** | Spec-Kit configuration |
| **/specs/\<features\>/\*\*** | What to build |
| **/CLAUDE.md** | How to navigate and use specs |
| **/frontend/CLAUDE.md** | Frontend-specific patterns |
| **/backend/CLAUDE.md** | Backend-specific patterns |

**Key Point:**   
Spec-Kit Plus provides organized, structured specs that Claude Code can reference. The CLAUDE.md files tell Claude Code how to use those specs and project-specific conventions.

# **Summary: Monorepo vs Separate Repos**

| Approach | Pros | Cons |
| :---- | :---- | :---- |
| **Monorepo ⭐** | Single CLAUDE.md context, easier cross-cutting changes | Larger repo |
| Separate Repos | Clear separation, independent deployments | Claude Code needs workspace setup |

**Recommendation:**   
Use monorepo for the hackathon – simpler for Claude Code to navigate and edit both frontend and backend in a single context.

# **Key Benefits of This Structure**

| Benefit | Description |
| :---- | :---- |
| **Single Context** | Claude Code sees entire project, can make cross-cutting changes |
| **Layered CLAUDE.md** | Root file for overview, subfolder files for specific guidelines |
| **Specs Folder** | Reference specifications directly with @specs/filename.md |
| **Clear Separation** | Frontend and backend code in separate folders, easy to navigate |

# **Phase IV: Local Kubernetes Deployment (Minikube, Helm Charts, kubectl-ai, Kagent, Docker Desktop, and Gordon)**

*Cloud Native Todo Chatbot with Basic Level Functionality*

**Objective:** Deploy the Todo Chatbot on a local Kubernetes cluster using Minikube, Helm Charts.

💡**Development Approach:** Use the [Agentic Dev Stack workflow](#the-agentic-dev-stack:-agents.md-+-spec-kitplus-+-claude-code): Write spec → Generate plan → Break into tasks → Implement via Claude Code. No manual coding allowed. We will review the process, prompts, and iterations to judge each phase and project.

## **Requirements**

* Containerize frontend and backend applications (Use Gordon)  
* Use Docker AI Agent (Gordon) for AI-assisted Docker operations  
* Create Helm charts for deployment (Use kubectl-ai and/or kagent to generate)  
* Use kubectl-ai and kagent for AI-assisted Kubernetes operations  
* Deploy on Minikube locally

*Note: If Docker AI (Gordon) is unavailable in your region or tier, use standard Docker CLI commands or ask Claude Code to generate the `docker run` commands for you.*

## **Technology Stack**

| Component | Technology |
| :---- | :---- |
| Containerization | Docker (Docker Desktop) |
| Docker AI | Docker AI Agent (Gordon) |
| Orchestration | Kubernetes (Minikube) |
| Package Manager | Helm Charts |
| AI DevOps | kubectl-ai, and Kagent |
| Application | Phase III Todo Chatbot |

## **AIOps**

Use [Docker AI Agent (Gordon)](https://docs.docker.com/ai/gordon/) for intelligent Docker operations:

\# To know its capabilities  
docker ai "What can you do?"

Enable Gordon: Install latest Docker Desktop 4.53+, go to Settings \> Beta features, and toggle it on.

Use [kubectl-ai](https://github.com/GoogleCloudPlatform/kubectl-ai), and [Kagent](https://github.com/kagent-dev/kagent) for intelligent Kubernetes operations:

\# Using kubectl-ai  
kubectl-ai "deploy the todo frontend with 2 replicas"  
kubectl-ai "scale the backend to handle more load"  
kubectl-ai "check why the pods are failing"  
   
\# Using kagent  
kagent "analyze the cluster health"  
kagent "optimize resource allocation"

Starting with kubectl-ai will make you feel empowered from day one. Layer in Kagent for advanced use cases. Pair them with Minikube for zero-cost learning and work.

**Research Note: Using Blueprints for Spec-Driven Deployment**  
Can Spec-Driven Development be used for infrastructure automation, and how we may need to use blueprints powered by Claude Code Agent Skills.

1. [Is Spec-Driven Development Key for Infrastructure Automation?](https://thenewstack.io/is-spec-driven-development-key-for-infrastructure-automation/)  
2. [ChatGPT Progressive Learning Conversation](https://chatgpt.com/share/6924914a-43dc-8001-8f67-af29c4d9617e)  
3. [Spec-Driven Cloud-Native Architecture: Governing AI Agents for Managed Services with Claude Code and SpecKit](https://claude.ai/public/artifacts/6025a232-6ebe-4c42-bb51-02dbd4603e18)  
 