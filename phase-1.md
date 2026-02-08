
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
| Phase I | In-Memory Python Console App | Python, Claude Code, Spec-Kit Plus | 100 | Dec 7, 2025 |
| Phase II | Full-Stack Web Application | Next.js, FastAPI, SQLModel, Neon DB | 150 | Dec 14, 2025 |
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

### **Phase I: Todo In-Memory Python Console App**

*Basic Level Functionality*

**Objective:** Build a command-line todo application that stores tasks in memory using Claude Code and Spec-Kit Plus.

💡**Development Approach:** Use the [Agentic Dev Stack workflow](#the-agentic-dev-stack:-agents.md-+-spec-kitplus-+-claude-code): Write spec → Generate plan → Break into tasks → Implement via Claude Code. No manual coding allowed. We will review the process, prompts, and iterations to judge each phase and project.

## **Requirements**

* Implement all 5 Basic Level features (Add, Delete, Update, View, Mark Complete)  
* Use spec-driven development with Claude Code and Spec-Kit Plus  
* Follow clean code principles and proper Python project structure

## **Technology Stack**

* UV  
* Python 3.13+  
* Claude Code  
* Spec-Kit Plus

## **Deliverables**

1. GitHub repository with:  
* Constitution file   
* specs history folder containing all specification files  
* /src folder with Python source code  
* README.md with setup instructions  
* CLAUDE.md with Claude Code instructions  
    
2. Working console application demonstrating:  
* Adding tasks with title and description  
* Listing all tasks with status indicators  
* Updating task details  
* Deleting tasks by ID  
* Marking tasks as complete/incomplete

## **Windows Users: WSL 2 Setup**

Windows users must use WSL 2 (Windows Subsystem for Linux) for development:

\# Install WSL 2  
wsl \--install  
   
\# Set WSL 2 as default  
wsl \--set-default-version 2  
   
\# Install Ubuntu  
wsl \--install \-d Ubuntu-22.04
