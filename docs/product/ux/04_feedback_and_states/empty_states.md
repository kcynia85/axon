###  List Empty States**

`Pattern (all lists):
├─ Icon: Relevant emoji (80px size)
├─ Heading: "No [items] yet" (h3)
├─ Description: Helpful context + action suggestion
├─ CTA: [Primary action] button
└─ Optional: Secondary link (e.g., "Learn more", "Import template")

Examples:

Projects List:
├─ Icon: 📂
├─ Heading: "No projects yet"
├─ Description: "Projects help you organize your work. Create your first project to get started."
└─ CTA: [+ New Project] button

Agents List:
├─ Icon: 🤖
├─ Heading: "No agents yet"
├─ Description: "Agents are AI assistants that help automate tasks. Create your first agent or load from library."
├─ CTA: [+ New Agent] button (primary)
└─ Link: "Browse Agent Library" (secondary)

Knowledge Hubs List:
├─ Icon: 📚
├─ Heading: "No knowledge hubs yet"
├─ Description: "Knowledge hubs provide RAG context for agents. Create your first hub to get started."
└─ CTA: [+ Add Hub] button

Inbox:
├─ Icon: 📭
├─ Heading: "All caught up!"
├─ Description: "You have no pending items. New notifications will appear here."
└─ CTA: None (just informational)

Canvas - No Nodes:
├─ Icon: ➕ (center of canvas, faded)
├─ Heading: "Empty canvas"
├─ Description: "Drag components from the sidebar to get started"
└─ Hint: Arrow pointing to left sidebar`

---

### Search/Filter No Results**

`Pattern:
├─ Icon: 🔍
├─ Heading: "No results found"
├─ Description: Context-specific suggestion
└─ Actions: [Clear Filters] or [Clear Search]

Examples:

No Search Results:
├─ Icon: 🔍
├─ Heading: "No results found for 'customer interview'"
├─ Description: "Try different keywords or check spelling"
└─ CTA: [Clear Search] button

No Filter Results:
├─ Icon: 🔍
├─ Heading: "No agents match your filters"
├─ Description: "Try adjusting your filters or clearing them"
├─ Active Filters: [× Discovery] [× High Cost]
└─ CTA: [Clear All Filters] button

Search + Filter (both active):
├─ Icon: 🔍
├─ Heading: "No results found"
├─ Description: "No agents match 'customer' with your current filters"
├─ Active: Search: "customer" + Filters: [× Discovery]
└─ Actions:
   ├─ [Clear Search] button
   └─ [Clear Filters] button`

---

### Section Empty States**

`Project Detail - No Key Resources:
├─ Icon: 🔗
├─ Heading: "No resources yet"
├─ Description: "Add links to related documents, designs, or external resources"
└─ CTA: [+ Add Resource] button

Project Detail - No Artifacts:
├─ Icon: 📄
├─ Heading: "No artifacts yet"
├─ Description: "Artifacts are generated when you run flows in your Space"
├─ CTA: [Open Space] button
└─ Note: "Run agents in Canvas to generate artifacts"

Hub Detail - No Sources:
├─ Icon: 📄
├─ Heading: "No sources yet"
├─ Description: "Upload documents to provide knowledge for your agents"
└─ CTA: [+ Add Source] button

Workspace Detail - No Agents:
├─ Icon: 🤖
├─ Heading: "No agents in this workspace yet"
├─ Description: "Create agents to automate tasks in this domain"
└─ CTA: [+ New Agent] button`

---

### First-Time User (Onboarding)**

`Dashboard - First Login:
├─ Welcome Modal:
│  ├─ Heading: "Welcome to Axon!"
│  ├─ Description: "Let's get you started with a quick tour"
│  ├─ Steps:
│  │  └─ "1. Create a project"
│  │  └─ "2. Build a workflow in Canvas"
│  │  └─ "3. Run your first agent"
│  ├─ Actions:
│  │  ├─ [Start Tour] button (primary)
│  │  └─ [Skip] link
│  └─ Checkbox: "Don't show this again"
│
└─ Dashboard Content (if skipped):
   ├─ Quick Start Cards (3 cards):
   │  ├─ "Create Project" → Opens modal
   │  ├─ "Browse Agent Library" → Opens Workspaces
   │  └─ "Watch Tutorial" → Opens docs
   └─ Recent Activity: Empty state (as above)

Progressive Onboarding Hints:
├─ After first project: "Great! Now create a Space to build workflows"
├─ After first space: "Now drag an Agent from the sidebar to the Canvas"
└─ After first execution: "Awesome! Check your Artifacts tab to see results"`