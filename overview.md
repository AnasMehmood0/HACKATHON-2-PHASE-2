
# **Submission Requirements**

## **Required Submissions**

1. Public GitHub Repository containing:  
* All source code for all completed phases  
* /specs folder with all specification files  
* CLAUDE.md with Claude Code instructions  
* README.md with comprehensive documentation  
* Clear folder structure for each phase  
    
2. Deployed Application Links:  
* Phase II: Vercel/frontend URL \+ Backend API URL  
* Phase III-V: Chatbot URL  
* Phase IV: Instructions for local Minikube setup  
* Phase V: DigitalOcean deployment URL  
    
3. Demo Video (maximum 90 seconds):  
* Demonstrate all implemented features  
* Show spec-driven development workflow  
* Judges will only watch the first 90 seconds  
4. WhatsApp Number for presentation invitation

# **Resources**

## **Core Tools**

| Tool | Link | Description |
| :---- | :---- | :---- |
| Claude Code | claude.com/product/claude-code | AI coding assistant |
| GitHub Spec-Kit | github.com/panaversity/spec-kit-plus | Specification management |
| OpenAI ChatKit | platform.openai.com/docs/guides/chatkit | Chatbot UI framework |
| MCP | github.com/modelcontextprotocol/python-sdk | MCP server framework |

## **Infrastructure**

| Service | Link | Notes |
| :---- | :---- | :---- |
| Neon DB | neon.tech | Free tier available |
| Vercel | vercel.com | Free frontend hosting |
| DigitalOcean | digitalocean.com | $200 credit for 60 days |
| Minikube | minikube.sigs.k8s.io | Local Kubernetes |

# 

# **Frequently Asked Questions**

**Q: Can I skip phases?**  
A: No, each phase builds on the previous. You must complete them in order.

**Q: Can I use different technologies?**  
A: The core stack must remain as specified. You can add additional tools/libraries.

**Q: Do I need a DigitalOcean account from the start?**  
A: No, only for Phase V. Use the $200 free credit for new accounts.

**Q: Can I work in a team?**  
A: This is an individual hackathon. Each participant submits separately.

**Q: What if I don't complete all the phases?**  
A: Submit what you complete. Partial submissions are evaluated proportionally.

# **The Agentic Dev Stack: AGENTS.md \+ Spec-KitPlus \+ Claude Code** {#the-agentic-dev-stack:-agents.md-+-spec-kitplus-+-claude-code}

This is a powerful integration. By combining the **declarative** nature of AGENTS.md, the **structured workflow** of Panaversity Spec-KitPlus, and the **agentic execution** of Claude Code, you move from "vibe-coding" to a professional, spec-driven engineering pipeline.

This section outlines a workflow where AGENTS.md acts as the **Constitution**, Spec-KitPlus acts as the **Architect**, and Claude Code acts as the **Builder**.

## **1\. The Mental Model: Who Does What?**

| Component | Role | Responsibility |
| :---- | :---- | :---- |
| **AGENTS.md** | **The Brain** | Cross-agent truth. Defines *how* agents should behave, what tools to use, and coding standards. |
| **Spec-KitPlus** | **The Architect** | Manages spec artifacts (.specify, .plan, .tasks). Ensures technical rigor before coding starts. |
| **Claude Code** | **The Executor** | The agentic environment. Reads the project memory and executes Spec-Kit tools via MCP. |

**Key Idea:** Claude reads AGENTS.md via a tiny CLAUDE.md shim and interacts with Spec-KitPlus. For development setup an MCP Server and upgrade specifyplus commands to be available as Prompts in MCP. SpecKitPlus MCP server ensures every line of code maps back to a validated task.

## ---

**2\. Step 1: Initialize Spec-KitPlus**

First, scaffold the spec-driven structure in your project root. This ensures the agent has the necessary templates to create structured plans.

uv specifyplus init \<project\_name\>

**This enables the core pipeline:**

* /specify \-\> Captures requirements in speckit.specify.  
* /plan \-\> Generates the technical approach in speckit.plan.  
* /tasks \-\> Breaks the plan into actionable speckit.tasks.  
* /implement \-\> Executes the code changes.

## ---

**3\. Step 2: Create a Spec-Aware AGENTS.md**

Create AGENTS.md in your root. This file teaches all AI agents (Claude, Copilot, Gemini) how to use your specific Spec-Kit workflow.

\`\`\`markdown

\# AGENTS.md  
Here is a \*\*significantly improved, clearer, more actionable, more valuable\*\* version of your \*\*AGENTS.md\*\*.  
I kept the spirit but made it \*practical\*, \*strict\*, and \*agent-compatible\*, so Claude/Gemini/Copilot can actually follow it in real workflows.

\---

\# \*\*AGENTS.md\*\*

\#\# \*\*Purpose\*\*

This project uses \*\*Spec-Driven Development (SDD)\*\* — a workflow where \*\*no agent is allowed to write code until the specification is complete and approved\*\*.  
All AI agents (Claude, Copilot, Gemini, local LLMs, etc.) must follow the \*\*Spec-Kit lifecycle\*\*:

\> \*\*Specify → Plan → Tasks → Implement\*\*

This prevents “vibe coding,” ensures alignment across agents, and guarantees that every implementation step maps back to an explicit requirement.

\---

\#\# \*\*How Agents Must Work\*\*

Every agent in this project MUST obey these rules:

1\. \*\*Never generate code without a referenced Task ID.\*\*  
2\. \*\*Never modify architecture without updating \`speckit.plan\`.\*\*  
3\. \*\*Never propose features without updating \`speckit.specify\` (WHAT).\*\*  
4\. \*\*Never change approach without updating \`speckit.constitution\` (Principles).\*\*  
5\. \*\*Every code file must contain a comment linking it to the Task and Spec sections.\*\*

If an agent cannot find the required spec, it must \*\*stop and request it\*\*, not improvise.

\---

\#\# \*\*Spec-Kit Workflow (Source of Truth)\*\*

\#\#\# \*\*1. Constitution (WHY — Principles & Constraints)\*\*

File: \`speckit.constitution\`  
Defines the project’s non-negotiables: architecture values, security rules, tech stack constraints, performance expectations, and patterns allowed.

Agents must check this before proposing solutions.

\---

\#\#\# \*\*2. Specify (WHAT — Requirements, Journeys & Acceptance Criteria)\*\*

File: \`speckit.specify\`

Contains:

\* User journeys  
\* Requirements  
\* Acceptance criteria  
\* Domain rules  
\* Business constraints

Agents must not infer missing requirements — they must request clarification or propose specification updates.

\---

\#\#\# \*\*3. Plan (HOW — Architecture, Components, Interfaces)\*\*

File: \`speckit.plan\`

Includes:

\* Component breakdown  
\* APIs & schema diagrams  
\* Service boundaries  
\* System responsibilities  
\* High-level sequencing

All architectural output MUST be generated from the Specify file.

\---

\#\#\# \*\*4. Tasks (BREAKDOWN — Atomic, Testable Work Units)\*\*

File: \`speckit.tasks\`

Each Task must contain:

\* Task ID  
\* Clear description  
\* Preconditions  
\* Expected outputs  
\* Artifacts to modify  
\* Links back to Specify \+ Plan sections

Agents \*\*implement only what these tasks define\*\*.

\---

\#\#\# \*\*5. Implement (CODE — Write Only What the Tasks Authorize)\*\*

Agents now write code, but must:

\* Reference Task IDs  
\* Follow the Plan exactly  
\* Not invent new features or flows  
\* Stop and request clarification if anything is underspecified

\> The golden rule: \*\*No task \= No code.\*\*

\---

\#\# \*\*Agent Behavior in This Project\*\*

\#\#\# \*\*When generating code:\*\*

Agents must reference:

\`\`\`  
\[Task\]: T-001  
\[From\]: speckit.specify §2.1, speckit.plan §3.4  
\`\`\`

\#\#\# \*\*When proposing architecture:\*\*

Agents must reference:

\`\`\`  
Update required in speckit.plan → add component X  
\`\`\`

\#\#\# \*\*When proposing new behavior or a new feature:\*\*

Agents must reference:

\`\`\`  
Requires update in speckit.specify (WHAT)  
\`\`\`

\#\#\# \*\*When changing principles:\*\*

Agents must reference:

\`\`\`  
Modify constitution.md → Principle \#X  
\`\`\`

\---

\#\# \*\*Agent Failure Modes (What Agents MUST Avoid)\*\*

Agents are NOT allowed to:

\* Freestyle code or architecture  
\* Generate missing requirements  
\* Create tasks on their own  
\* Alter stack choices without justification  
\* Add endpoints, fields, or flows that aren’t in the spec  
\* Ignore acceptance criteria  
\* Produce “creative” implementations that violate the plan

If a conflict arises between spec files, the \*\*Constitution \> Specify \> Plan \> Tasks\*\* hierarchy applies.

\---

\#\# \*\*Developer–Agent Alignment\*\*

Humans and agents collaborate, but the \*\*spec is the single source of truth\*\*.  
Before every session, agents should re-read:

1\. \`.memory/constitution.md\`

This ensures predictable, deterministic development.  
\`\`\`

## **4\. Step 3: Wire Spec-KitPlus into Claude via MCP**

To let Claude Code actually *run* Spec-KitPlus commands, you will set up an MCP server with prompts present in .claude/commands. Each command here will become a prompt in the MCP server.

### **4.1 Install SpecKitPlus, Create an MCP Server**

1. uv init specifyplus \<project\_name\>  
2. Create your Consitution  
3. Add Anthropic's official MCP Builder Skill   
4. Using SDD Loop (Specify, Plan, Tasks, Implement) you will  set up an MCP server with prompts present in .claude/commands  
5. Use these as part of your prompt instructions in specify: \`We have specifyplus commands on @.claude/commands/\*\* Each command takes user input and updates its prompt variable before sending it to the agent. Now you will use your mcp builder skill and create an mcp server where these commands are available as prompts. Goal: Now we can run this MCP server and connect with any agent and IDE.  
6. Test the MCP server

### **4.2 Register with Claude Code**

Add the server to your Claude Code config (usually .mcp.json at your project root):

{  
  "mcpServers": {  
    "spec-kit": {  
      "command": "spec-kitplus-mcp",  
      "args": \[\],  
      "env": {}  
    }  
  }  
}

**Success:**

- After running MCP Server and connecting it with Claude Code now you can have the same commands available as MCP prompts.

## 

## ---

**5\. Step 4: Connect Claude Code via the "Shim"**

Copy the default [CLAUDE.md](http://CLAUDE.md) file and integrate the content within AGENTS.md . Claude Code automatically looks for CLAUDE.md. To keep a single source of truth, use a redirection pattern.

**Create CLAUDE.md in your root:**

**\`\`\`markdown**	

@AGENTS.md  
**\`\`\`**

*This "forwarding" ensures Claude Code loads your comprehensive agent instructions into its context window immediately upon startup.*

## ---

## **6\. Step 5: The Day-to-Day Workflow**

Once configured, your interaction with Claude Code looks like this:

* **Context Loading:** You start Claude Code. It reads CLAUDE.md \-\> AGENTS.md and realizes it must use Spec-Kit.  
* **Spec Generation:**  
  * *User:* "I need a project dashboard."  
  * *Claude:* Calls speckit\_specify and speckit\_plan using the MCP.  
* **Task Breakdown:**  
  * *Claude:* Calls speckit\_tasks to create a checklist in speckit.tasks.  
* **Implementation:**  
  * *User:* "Execute the first two tasks."  
  * *Claude:* Calls speckit\_implement, writes the code, and checks it against the speckit.constitution.

## ---

**7\. Constitution vs. AGENTS.md: The Difference**

It is important not to duplicate information.

* **AGENTS.md (The "How"):** Focuses on the **interaction**. "Use these tools, follow this order, use these CLI commands."  
* **speckit.constitution (The "What"):** Focuses on **standards**. "We prioritize performance over brevity, we use async/await, we require 90% test coverage."

## ---

**Summary of Integration**

3. **Initialize:** specify init creates the structure.  
4. **Instruct:** AGENTS.md defines the rules.  
5. **Bridge:** CLAUDE.md (@AGENTS.md) connects the agent.  
6. **Empower:** MCP gives the agent the tools to execute.

**Good luck, and may your specs be clear and your code be clean\! 🚀**

*— The Panaversity, PIAIC, and GIAIC Teams*