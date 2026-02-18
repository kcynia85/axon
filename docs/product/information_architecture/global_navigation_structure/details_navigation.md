## Details Navigation

### Home

#### Dashboard
Dashboard Page
├─ Header
│  ├─ Greeting (e.g., "Good morning, Kamil")
│  └─ Date/Time
│
├─ AI Input Section (Central Hero)
│  └─ "Ask Axon..." input field (Command center entry)
│
├─ Recently Used (Horizontal Scroll)
│  └─ Items (Project cards, Space cards, Agent avatars)
│
├─ Workspace Cards (Grid - 5 Core)
│  ├─ Product Management
│  ├─ Discovery
│  ├─ Design
│  ├─ Delivery
│  └─ Growth & Market
│
└─ Inbox Preview (Vertical List)
   ├─ Header (Title, "View All" link)
   └─ Recent notifications/actions (max 5)


### Projects

#### Projects List
Projects Page
├─ Header
│  └─ Title: "Projects"
│
├─ Toolbar
│  ├─ Search bar
│  ├─ Filters (Status: Active/Archived, Workspace)
│  ├─ Sort (Name, Last Modified)
│  └─ [+ New Project] button
│
└─ Projects Grid/List
   └─ Project Card
      ├─ Name & Description
      ├─ Status badge
      ├─ Workspace badges
      └─ Actions menu (Edit, Archive, Delete)

#### New Project Modal
New Project (Modal)
├─ Fields: Name, Strategy URL, Space Selection
└─ Actions: [Cancel], [Create]

#### Edit Project Modal
Edit Project (Modal)
├─ Fields: same as New
└─ Actions: [Cancel], [Save]

---

## Screen Inventory → Details Navigation Mapping

1. Dashboard → Home > Dashboard
2. Projects List → Projects > Projects List
3. New Project Modal → Projects > New Project Modal
4. Edit Project Modal → Projects > Edit Project Modal
5. Project Detail - Overview → Projects > Project Detail > Tab: Overview
6. Project Detail - Key Resources → Projects > Project Detail > Tab: Key Resources
7. Project Detail - Artifacts → Projects > Project Detail > Tab: Artifacts
8. Add Resource Modal → Projects > Add Resource Modal
9. Add Artifact Modal → Projects > Add Artifact Modal
10. Delete Project Confirmation → Projects > Delete Project Confirmation
11. Spaces Overview → Spaces > Spaces Overview
12. New Space Modal → Spaces > New Space Modal
13. Edit Space Modal → Spaces > Edit Space Modal
14. Canvas View → Spaces > Canvas View
15. Save as Pattern Modal → Spaces > Save as Pattern Modal
16. Space Settings Modal → Spaces > Space Settings Modal
17. Delete Space Confirmation → Spaces > Delete Space Confirmation
18. Workspaces Overview → Workspaces > Workspaces Overview
19. Workspace Detail → Workspaces > Workspace Detail
20. Agents List → Workspaces > Agents List
21. Agent Detail (Side Peek) → Workspaces > Agents > Agent Side Peek
22. New Agent - Modal Step 1 → Workspaces > New Agent - Modal Step 1
23. Archetype Library Modal → Workspaces > Archetype Library Modal
24. New Agent - Modal Step 2 → Workspaces > New Agent - Modal Step 2
25. New/Edit Agent - Full Page → Workspaces > Agent Edit Page
26. Crews List → Workspaces > Crews List
27. Crew Detail (Side Peek) → Workspaces > Crews > Crew Side Peek
28. New Crew - Process Type Modal → Workspaces > New Crew - Process Type Modal
29. New/Edit Crew - Parallel → Workspaces > Crew Edit Page > Parallel-specific
30. New/Edit Crew - Sequential → Workspaces > Crew Edit Page > Sequential-specific
31. New/Edit Crew - Hierarchical → Workspaces > Crew Edit Page > Hierarchical-specific
32. Patterns List → Workspaces > Patterns List
33. Pattern Detail (Side Peek) → Workspaces > Patterns > Pattern Side Peek
34. Edit Pattern Modal → Workspaces > Edit Pattern Modal
35. Templates List → Workspaces > Templates List
36. Template Detail (Side Peek) → Workspaces > Templates > Template Side Peek
37. New/Edit Template → Workspaces > Template Edit Page
38. Knowledge Hubs List → Resources > Knowledge Base > Knowledge Hubs List
39. New Hub Modal → Resources > Knowledge Base > New Hub Modal
40. Edit Hub Modal → Resources > Knowledge Base > Edit Hub Modal
41. Delete Hub Confirmation → Resources > Knowledge Base > Delete Hub Confirmation
42. Knowledge Hub Detail → Resources > Knowledge Base > Knowledge Hub Detail
43. Add Source Modal → Resources > Knowledge Base > Add Source Modal
44. Knowledge Source Detail → Resources > Knowledge Base > [Source File Name] (Overview/Chunks)
45. Edit Source Modal → Resources > Knowledge Base > Edit Source Modal
46. Delete Source Confirmation → Resources > Knowledge Base > Delete Source Confirmation
47. RAG Debugger Modal → Resources > Knowledge Base > RAG Debugger Modal
48. Archetypes List → Resources > Prompts (Archetypes) > Archetypes List
49. Archetype Detail (Side Peek) → Resources > Prompts (Archetypes) > Archetype Side Peek
50. New/Edit Archetype → Resources > Prompts (Archetypes) > New/Edit Archetype
51. Automations List → Resources > Automations > Automations List
52. Automation Detail (Side Peek) → Resources > Automations > Automation Side Peek
53. New/Edit Automation → Resources > Automations > New/Edit Automation
54. Services List → Resources > External Services > Services List
55. Service Detail (Side Peek) → Resources > External Services > Service Side Peek
56. New/Edit Service → Resources > External Services > New/Edit Service (3-step)
57. Internal Tools List → Resources > Internal Tools > Internal Tools List
58. Tool Detail (Side Peek) → Resources > Internal Tools > Tool Detail (Side Peek)
59. Edit Tool Modal → Resources > Internal Tools > Edit Tool Modal
60. Inbox List → Inbox > Inbox List
61. Settings Home → Settings > Settings Home
62. LLM Providers List → Settings > LLM Providers > Providers List Page
63. Provider Type Selection Modal → Settings > LLM Providers > Provider Type Selection Modal
64. Provider Detail - Cloud → Settings > LLM Providers > Provider Detail - Cloud
65. Provider Detail - Meta → Settings > LLM Providers > Provider Detail - Meta
66. OpenRouter Marketplace Modal → Settings > LLM Providers > OpenRouter Marketplace Modal
67. Provider Detail - Local → Settings > LLM Providers > Provider Detail - Local
68. Model Registry List → Settings > Model Registry List
69. Add Model (6-Step Modal) → Settings > LLM Model Registry > LLM Model Add (Multi-Step Modal)
70. Model Detail → Settings > Model Detail
71. Routers List → Settings > Routers List
72. New/Edit Router → Settings > LLM Routers (Edit)
73. Embedding Models List → Settings > Embedding Models List
74. New/Edit Embedding Model → Settings > New/Edit Embedding Model
75. Chunking Strategies List → Settings > Chunking Strategies List
76. New/Edit Chunking Strategy → Settings > New/Edit Chunking Strategy
77. Vector Databases List → Settings > Vector Databases List
78. New/Edit Vector Database → Settings > New/Edit Vector Database

#### Add Resource Modal
Add Resource (Modal)
├─ Provider (select)
├─ Label
├─ URL
└─ Icon (auto-detect + override)

#### Add Artifact Modal
Add Artifact (Modal)
├─ Name
├─ Path/Link (URL or storage path)
├─ Workspace
└─ Status (Draft/Final)

#### Delete Project Confirmation
Confirm Deletion (Modal)
├─ Warning (dependencies info)
└─ Actions: [Cancel], [Delete]

#### Project Detail
Project Detail Page
├─ Header
│  ├─ Breadcrumbs
│  ├─ Project Name
│  ├─ Status Badge
│  └─ Actions: Edit, Settings
│
├─ Tabs Navigation
│  └─ [Overview] [Key Resources] [Artifacts]
│
├─ Tab: Overview
│  ├─ Project Info (Description, Strategy URL)
│  ├─ Workspace Usage (Badges)
│  ├─ Recent Activity (Timeline)
│  └─ Quick Actions (e.g., "Open in Space")
│
├─ Tab: Key Resources
│  ├─ Toolbar (+ Add Resource)
│  └─ Resources List
│     └─ Resource Item (Icon, Name, Link/Type, Actions)
│
└─ Tab: Artifacts
   ├─ Toolbar (Search, Filter, + Add Artifact)
   └─ Artifacts Grid/List
      └─ Artifact Card (Name, Type, Status, Link)


### Spaces

#### Spaces Overview
Spaces Page
├─ Header
│  └─ Title: "Spaces"
│
├─ Toolbar
│  ├─ Search bar
│  └─ [+ New Space] button
│
├─ Recently Visited (Horizontal Scroll)
│  └─ Space Cards
│
└─ All Spaces Grid
   └─ Space Card (Name, Description, Last Modified, Actions)

#### Canvas
Canvas View
├─ Top Bar
│  ├─ Space Name (Editable)
│  ├─ Status / Saving indicator
│  ├─ Active Users (Avatars)
│  └─ Zoom/Pan controls
│
├─ Left Sidebar (Workspaces & Components)
│  ├─ Level 1: Workspaces (Default View)
│  │  ├─ Search Workspaces
│  │  ├─ Core Workspaces List (Product, Discovery, Design, Delivery, Growth)
│  │  │  └─ Action: Click to enter Workspace context (Transition to Level 2)
│  │  │  └─ Action: Drag & Drop to Canvas → Creates "Workspace Zone"
│  │  └─ Shared/Global Components
│  │
│  ├─ Level 2: Components (Inside a Workspace, e.g., "Design")
│  │  ├─ Header: < Back to Workspaces | "Design" Title
│  │  ├─ Search Components (within Workspace)
│  │  ├─ Categories (Accordion):
│  │  │  ├─ Core (Notes, Shapes)
│  │  │  ├─ Patterns (Drag & drop)
│  │  │  ├─ Crews
│  │  │  ├─ Agents
│  │  │  ├─ Templates
│  │  │  ├─ Services
│  │  │  └─ Automations
│  │  └─ Footer: Library Settings
│
├─ Main Canvas Area
│  ├─ Infinite scroll surface
│  ├─ Nodes (Visual representation of components)
│  └─ Edges (Connections/Flows)
│
└─ Right Panel (Inspector - Contextual)
   ├─ Header (Selected Node Name/Type)
   ├─ Node Details (Properties, Settings)
   ├─ Context (Inputs)
   ├─ Artifacts (Outputs)
   └─ Execution Status (Logs, Outputs)


#### New Space Modal
New Space (Modal)
├─ Fields: Name, Description, Linked Project (optional)
└─ Actions: [Cancel], [Create]

#### Edit Space Modal
Edit Space (Modal)
├─ Fields: same as New
└─ Actions: [Cancel], [Save]

#### Save as Pattern Modal
Save Selection as Pattern (Modal)
├─ Name, Description
├─ Context (Inputs)
├─ Artifacts (Outputs)
└─ Availability (Workspace checkboxes)

#### Space Settings Modal
Space Settings (Modal)
├─ Rename, Delete, Export
└─ Danger Zone (Delete confirmation entrypoint)

#### Delete Space Confirmation
Confirm Deletion (Modal)
├─ Warning (irreversible)
└─ Actions: [Cancel], [Delete]

### Workspaces

#### Workspaces Overview
Workspaces Overview Page
├─ Header
│  └─ Title: "Workspaces"
│
└─ Workspaces Grid (5 Core Workspaces)
   └─ Workspace Card
      ├─ Icon & Name (e.g., Discovery)
      ├─ Description
      └─ Quick Actions (Enter)

#### Workspace Detail
Workspace Dashboard (e.g., "Discovery Workspace")
├─ Header
│  ├─ Workspace Name
│  └─ Navigation Tabs
│
├─ Sub-Navigation (Tabs)
│  ├─ Patterns
│  ├─ Crews
│  ├─ Agents
│  ├─ Templates
│  ├─ Services
│  └─ Automations
│
└─ Content Area (Displays list/grid for selected tab)

#### Agents List
Agents (List within Workspace)
├─ Toolbar: Search, Filters, Sort, [+ New Agent]
└─ Cards/Grid of Agents

#### New Agent - Modal Step 1
Choose Starting Point (Modal)
├─ Options: Use Archetype, Start Empty
└─ Actions: [Cancel], [Next]

#### Archetype Library Modal
Select Archetype (Modal)
├─ Search, Featured, Cards
└─ Actions: [Back], [Use Archetype]

#### New Agent - Modal Step 2
Select Skills (Modal)
├─ Search Tools, Tool Cards
└─ Actions: [Back], [Create Agent]

#### Crews List
Crews (List within Workspace)
├─ Toolbar: Search, Filters, Sort, [+ New Crew]
└─ Cards/Grid of Crews

#### New Crew - Process Type Modal
Choose Process Type (Modal)
├─ Parallel, Sequential, Hierarchical
└─ Actions: [Cancel], [Continue]

#### Patterns List
Patterns (List within Workspace)
├─ Toolbar: Search, Filters, Sort
└─ Cards/Grid of Patterns

#### Templates List
Templates (List within Workspace)
├─ Toolbar: Search, Filters, Sort, [+ New]
└─ Cards/Grid of Templates

#### Patterns
Pattern Side Peek
├─ Header (Close ×, Pattern name)
├─ Scrollable Content:
│  ├─ Description
│  ├─ Components Preview
│  │  └─ Visual graph (React Flow mini preview)
│  ├─ Context (Inputs list)
│  │  └─ Field cards (name, type, required)
│  ├─ Artifacts (Outputs list)
│  │  └─ Field cards (name, type, required)
│  ├─ Keywords
│  └─ Availability (Workspace badges)
└─ Footer Actions
   ├─ Edit in Space button (opens Canvas with pattern loaded)
   ├─ Edit Pattern button (opens edit modal)
   ├─ Duplicate button
   └─ Delete button

Edit Pattern Modal
├─ Fields: Name, Description, Keywords
├─ Context (Inputs)
├─ Artifacts (Outputs)
└─ Actions: [Cancel], [Save]


#### Crews
Crew Side Peek
├─ Header (Close ×, Crew name, Process type badge)
├─ Scrollable Content:
│  ├─ Goal
│  ├─ Process Type (Parallel/Sequential/Hierarchical)
│  ├─ Team Members
│  │  └─ Agent cards (name, role, skills preview)
│  ├─ Manager (if Hierarchical)
│  ├─ Context (Input schema)
│  ├─ Artifacts (Output schema)
│  ├─ Keywords
│  └─ Availability (Workspace badges)
└─ Footer Actions
   ├─ Edit button
   ├─ Duplicate button
   └─ Delete button

Crew Edit Page (varies by Process Type)

├─ Header
│  ├─ Crew Name (editable)
│  ├─ Process Type badge (locked if editing)
│  └─ Actions: Save Team, Cancel
│
├─ Main Form (single scrollable page)
│  ├─ Basic Info
│  │  ├─ Name
│  │  ├─ Goal
│  │  └─ Keywords
│  │
│  ├─ Process Type (if new: radio buttons; if edit: locked display)
│  │  └─ Parallel / Sequential / Hierarchical
│  │
│  ├─ PARALLEL-SPECIFIC:
│  │  ├─ Team Members (multi-select agents)
│  │  └─ Owner Goal (synthesis instructions)
│  │
│  ├─ SEQUENTIAL-SPECIFIC:
│  │  └─ Task Definition
│  │     ├─ + Add Task button
│  │     └─ For each Task:
│  │        ├─ Task Name
│  │        ├─ Specialist (select agent)
│  │        ├─ Task Description
│  │        └─ Reorder handles (drag)
│  │
│  ├─ HIERARCHICAL-SPECIFIC:
│  │  ├─ Manager Agent (select one agent)
│  │  └─ Team Members (multi-select available executors)
│  │
│  ├─ Context/Artifacts (all types)
│  │  ├─ + Add Context
│  │  └─ + Add Artifact
│  │
│  └─ Availability (workspace checkboxes)
│
└─ Footer Actions (sticky)
   ├─ [Cancel] button
   └─ [Save Team] button

#### Agents
Agent Side Peek
├─ Header (Close ×, Agent name, Role)
├─ Scrollable Content:
│  ├─ Identity (Goal, Backstory)
│  ├─ Memory & Reasoning (Knowledge Hubs, Guardrails collapsible)
│  ├─ Engine (LLM Model, Temperature, RAG Enforcement)
│  ├─ Skills (Tools badges)
│  ├─ Interface (Input/Output schemas collapsible)
│  ├─ Availability (Workspace badges)
│  └─ Cost Estimate (Alert box)
└─ Footer Actions
   ├─ Edit button
   ├─ Duplicate button
   └─ Delete button

Agent Edit Page
├─ Top Section (sticky)
│  ├─ Progress Indicator
│  │  └─ [1●]─[2○]─[3○]─[4○]─[5○]─[6○]
│  └─ Step Labels
│     └─ Identity → Memory → Engine → Skills → Interface → Availability
│
├─ Main Content (scrollable, 2-column)
│  ├─ Left Column (form - 70% width)
│  │  └─ Current Step Form
│  │     ├─ Step 1: Identity (Name, Role, Goal, Backstory, Keywords)
│  │     ├─ Step 2: Memory (Knowledge Hubs, Guardrails, Few-shot, Reflexion)
│  │     ├─ Step 3: Engine (LLM Model, Temperature, RAG Enforcement)
│  │     ├─ Step 4: Skills (Selected tools list, + Add More button)
│  │     ├─ Step 5: Interface (Input/Output schema JSON editors)
│  │     └─ Step 6: Availability (Workspace checkboxes, Summary)
│  │
│  └─ Right Column (sidebar - 30% width, sticky)
│     └─ Cost Estimator
│        ├─ Cost per Action: "Średni ($0.70)"
│        ├─ "Pokaż Szczegóły" (collapsible)
│        │  ├─ Static Cost breakdown
│        │  └─ Dynamic Cost breakdown
│        ├─ Context Usage Bar
│        ├─ Memory Allocation
│        └─ AI Suggestions (when applicable)
│
└─ Bottom Section (sticky)
   └─ Navigation Buttons
      ├─ [Previous] (disabled on step 1)
      └─ [Next] (steps 1-5) / [Save Agent] (step 6)


#### Templates
Template Side Peek
├─ Header (Close ×, Template name)
├─ Scrollable Content:
│  ├─ Description
│  ├─ Goal
│  ├─ Instructions (Markdown preview, collapsible)
│  ├─ Context (Required variables)
│  ├─ Artifacts (Required outputs)
│  ├─ Checklist Items
│  │  └─ Auto-generated from markdown (list preview)
│  ├─ Keywords
│  └─ Availability (Workspace badges)
└─ Footer Actions
   ├─ Edit button
   ├─ Use in Canvas button
   ├─ Duplicate button
   └─ Delete button

Template Edit Page
├─ Header
│  ├─ Template Name (editable)
│  └─ Actions: Save Template, Cancel
│
├─ Main Form (single scrollable page)
│  ├─ Basic Info
│  │  ├─ Name
│  │  ├─ Description
│  │  ├─ Goal
│  │  └─ Keywords
│  │
│  ├─ Markdown Content (main section)
│  │  ├─ Editor (with toolbar)
│  │  │  └─ Headers, Bold, Italic, Lists, Links, Code blocks
│  │  ├─ Preview toggle
│  │  ├─ Autofill button (AI suggests content based on Name/Goal)
│  │  └─ Hints: Markdown syntax examples
│  │
│  ├─ Context (Define required inputs)
│  │  ├─ + Add Context button
│  │  └─ For each Context:
│  │     ├─ Type (Link/File/Text/Number)
│  │     ├─ Name
│  │     ├─ Required checkbox
│  │     └─ Delete button
│  │
│  ├─ Artifacts (Define expected outputs)
│  │  ├─ + Add Artifact button
│  │  └─ For each Artifact:
│  │     ├─ Type
│  │     ├─ Name
│  │     ├─ Required checkbox
│  │     └─ Delete button
│  │
│  ├─ Checklist Items
│  │  ├─ Auto-fill from Markdown (system extracts action items)
│  │  ├─ Manual add: + Add Item button
│  │  └─ List of items (editable, reorderable)
│  │
│  └─ Availability (workspace checkboxes)
│
└─ Footer Actions (sticky)
   ├─ [Cancel] button
   └─ [Save Template] button

### Resources
#### Knowledge Base
Knowledge Hubs List
├─ Toolbar: Search, Filters, [+ Add Hub]
└─ Hub Cards (Name, Description, Workspace, Stats)

New Hub Modal
├─ Fields: Name, Description, Workspace, Keywords
└─ Actions: [Cancel], [Create]

Edit Hub Modal
├─ Same fields as New
└─ Actions: [Cancel], [Save]

Delete Hub Confirmation
├─ Warning (sources will be orphaned or removed per policy)
└─ Actions: [Cancel], [Delete]

Knowledge Hub Detail (Sub-Navigation)
├─ Header (Hub name, description, workspace badge, keywords, actions menu)
├─ Statistics Cards (Total Sources, Total Chunks, Last Indexed)
└─ Sources List
   ├─ Search bar
   ├─ Status filter (Pending, Indexing, Ready, Error)
   └─ Table (File Name, Format, Size, Status, Chunks, Indexed At)

[Source File Name]
├─ Overview Tab
│  ├─ Preview/Download section
│  ├─ RAG Settings (Chunking Strategy, Status, Re-index button)
│  ├─ Metadata (Tags, Auto-tag button, Custom metadata editor)
│  └─ Statistics (Chunks count, Total tokens, Avg chunk size)
└─ Chunks Tab
   └─ "Open RAG Debugger" button

Add Source Modal
├─ Upload, URL Import, Notion Sync, Strategy Link
└─ Metadata (Tags, Custom JSON)

Edit Source Modal
├─ Update Metadata, Strategy
└─ Actions: [Cancel], [Save]

Delete Source Confirmation
├─ Warning (irreversible)
└─ Actions: [Cancel], [Delete]

RAG Debugger Modal
├─ Chunks List (left)
└─ Chunk Detail (right) with metadata and preview

#### Prompts (Archetypes)
Archetypes List
├─ Toolbar: Search, Filters, [+ New]
└─ Archetype Cards

Archetype Side Peek
├─ Header (Close ×, Archetype name)
├─ Scrollable Content:
│  ├─ Identity
│  │  ├─ Role
│  │  ├─ Goal
│  │  └─ Backstory
│  ├─ Memory & Reasoning
│  │  ├─ Suggested Knowledge Hubs (list with links)
│  │  └─ Guardrails (collapsible)
│  │     ├─ Instructions (bullets)
│  │     └─ Constraints (bullets)
│  ├─ Categorization
│  │  ├─ Keywords (tags)
│  │  └─ Workspace badge
│  └─ Computed Estimates
│     ├─ Estimated Base Cost: "~ 1.8k tokenów"
│     └─ Memory Allocation:
│        ├─ Tożsamość: 0.8k
│        └─ Mózg i Wiedza: 1k
└─ Footer Actions
   ├─ Use in Agent button (opens New Agent with pre-fill)
   ├─ Edit button
   ├─ Duplicate button
   └─ Delete button

New/Edit Archetype
├─ Identity (Role, Goal, Backstory)
├─ Memory & Guardrails
├─ Keywords, Workspace Availability
└─ Actions: [Cancel], [Save]

#### Automations
Automations List
├─ Toolbar: Search, Filters, [+ Add]
└─ Automation Cards

Automation Side Peek
├─ Header (Close ×, Automation name)
├─ Scrollable Content:
│  ├─ Description
│  ├─ Connection Config
│  │  ├─ Platform badge (n8n, Zapier, Make, Custom)
│  │  ├─ Webhook URL (with copy button)
│  │  ├─ HTTP Method badge
│  │  └─ Authorization (masked)
│  ├─ Interface
│  │  ├─ Input Schema (collapsible JSON)
│  │  └─ Output Schema (collapsible JSON)
│  ├─ Validation
│  │  ├─ Status badge (Valid/Invalid/Untested)
│  │  └─ Last Validated timestamp
│  ├─ Simulator (Testing)
│  │  ├─ Test Data (JSON editor)
│  │  ├─ Execute Test button
│  │  └─ Results (Status, Response Time, Response Data)
│  ├─ Keywords
│  └─ Availability (Workspace badges)
└─ Footer Actions
   ├─ Edit button
   ├─ Test button
   ├─ Duplicate button
   └─ Delete button

New/Edit Automation
├─ Connection Config (Platform, Webhook URL, Method, Authorization)
├─ Interface (Input/Output Schemas)
├─ Availability (Workspace selection)
└─ Actions: [Cancel], [Save]


#### External Services
Services List
├─ Toolbar: Search, Filters, [+ New]
└─ Service Cards

Service Side Peek
├─ Header (Close ×, Service name)
├─ Scrollable Content:
│  ├─ Identity
│  │  ├─ Name
│  │  ├─ Base URL (with external link icon)
│  │  └─ Category badge
│  ├─ Business Context (description)
│  ├─ Capabilities
│  │  └─ Capability cards (name, description)
│  ├─ Keywords
│  └─ Availability (Workspace badges)
└─ Footer Actions
   ├─ Edit button
   ├─ Duplicate button
   └─ Delete button

New/Edit Service (3-Step Wizard)
├─ Step 1: Identity (Name, Base URL, Category)
├─ Step 2: Capabilities (define capability cards)
└─ Step 3: Availability (Workspace selection)

#### Internal Tools
Internal Tools List
├─ Toolbar: Search, Filters, Sync CLI
└─ Tool Cards

Tool Detail (Side Peek)
├─ Header (Close ×, Tool name)
├─ Scrollable Content:
│  ├─ Function Info
│  │  ├─ Name
│  │  ├─ Description
│  │  └─ Category
│  ├─ Interface (Inputs/Outputs)
│  │  └─ JSON Schema preview
│  ├─ Availability (Workspace badges)
│  └─ Sync Status (Last synced)
└─ Footer Actions
   ├─ Edit Metadata button
   └─ Delete button

Edit Tool Modal
├─ Display Name, Description, Category, Keywords
└─ Actions: [Cancel], [Save]

### Inbox

#### Inbox List
Inbox Page
├─ Header
│  ├─ Title: "Inbox"
│  └─ Unread Count Badge
│
├─ Toolbar
│  ├─ Search bar
│  └─ Filters (All, Unread, Mentioned, Assigned, Archived)
│
└─ Notifications List
   └─ Notification Item
      ├─ Status Indicator (Read/Unread dot)
      ├─ Source Icon (Agent, System, User)
      ├─ Title / Message Summary
      ├─ Timestamp
      └─ Actions (Approve, Reply, Mark as Read, Archive)

### Settings

#### Settings Home
Settings Overview
├─ Sections: LLMs, Knowledge Engine
└─ Quick Links to Providers, Routers, Models, Embeddings, Chunking, Vector DBs

#### LLM Providers
Providers List Page
├─ Header (+ Add Provider)
└─ Providers Grid
   └─ Provider Card (Logo, Name: OpenAI/Anthropic/Local, Status: Connected/Error)

Provider Detail (Modal/Page)
├─ Header (Provider Name, Toggle Active)
├─ Settings Form
│  ├─ API Key (Masked input)
│  ├─ Base URL (Optional)
│  ├─ Organization ID (Optional)
│  └─ Default Parameters (optional)
└─ Footer Actions (Verify Connection, Save)

Provider Type Selection Modal
├─ Options: Cloud, Meta-Provider, Local
└─ Actions: [Cancel], [Continue]

Provider Detail - Cloud
├─ Connection (API Key, Base URL)
├─ Tokenization Settings
└─ Adapter Config

OpenRouter Marketplace Modal
├─ Browse/Install Models
└─ Search, Filters, Model Cards

Provider Detail - Meta
├─ Connection (Headers)
├─ Marketplace (installable child providers/models)
└─ Adapter Config

Provider Detail - Local
├─ Connection (Endpoint)
├─ Billing (if applicable)
└─ Adapter Config

#### Model Registry List
Models (Settings)
├─ Toolbar: Search, Filters, [+ Add Model]
└─ Model Cards

#### Model Detail
Model Detail (Settings)
├─ Identity, Capabilities
├─ Pricing (Economics)
└─ Actions: Edit, Delete

#### Routers List
Routers (Settings)
├─ Toolbar: Search, Filters, [+ Add Router]
└─ Router Cards

#### LLM Routers
LLM Router Edit (Full Page - Split Layout)
├─ Header
│  ├─ Router Name (editable)
│  └─ Actions: Save Router, Cancel
│
├─ Main Content (2-column split)
│  ├─ Left Column (form - 60% width, scrollable)
│  │  ├─ Name (Alias)
│  │  │  └─ Example: "Production Safe", "Fast Draft"
│  │  │
│  │  ├─ Strategy (dropdown)
│  │  │  ├─ Fallback (Cascade)
│  │  │  ├─ Load Balancer
│  │  │  └─ Priority Chain
│  │  │  └─ Description of selected strategy
│  │  │
│  │  ├─ Steps Configuration
│  │  │  ├─ + Add Step button
│  │  │  └─ For each Step:
│  │  │     ├─ Step Number
│  │  │     ├─ Model Selection (dropdown with search)
│  │  │     ├─ Override Params (collapsible JSON editor)
│  │  │     ├─ Trigger Condition (None/On Error/On Timeout/Both)
│  │  │     ├─ Delete Step button
│  │  │     └─ Reorder handles (drag)
│  │  │
│  │  └─ Thresholds
│  │     ├─ Max Tokens Threshold (optional)
│  │     └─ Cost Limit per Request (optional)
│  │
│  └─ Right Column (testing panel - 40% width, sticky)
│     └─ Testing Panel
│        ├─ Prompt Test (textarea)
│        ├─ [Send Test] button
│        └─ Results (after test)
│           ├─ Response (text display)
│           ├─ Metrics
│           │  ├─ Latency: X.Xs
│           │  ├─ Cost: $X.XX
│           │  ├─ Tokens: Input/Output
│           │  └─ Model Used: [which step]
│           ├─ Status: Connected / Error
│           └─ Raw Response (collapsible JSON)
│
└─ Footer Actions (sticky)
   ├─ [Cancel] button
   └─ [Save Router] button

#### LLM Model Registry
 LLM Model Add (Multi-Step Modal):
├─ Modal Header
│  ├─ Title: "Add Model"
│  ├─ Progress Dots: [●]─[○]─[○]─[○]─[○]─[○]
│  └─ Close button (×)
│
├─ Modal Body (scrollable, changes per step)
│  ├─ Step 1: Choose Provider
│  │  └─ Dropdown/Select from configured providers
│  │
│  ├─ Step 2: Identify Model
│  │  ├─ Search bar (searches provider's models)
│  │  ├─ Suggestions list
│  │  └─ Manual entry: "Use custom ID"
│  │
│  ├─ Step 3: Provider-Specific Params (Schema-Driven)
│  │  └─ Dynamic form based on provider's schema
│  │     └─ Example for OpenAI: reasoning_effort, top_k, etc.
│  │
│  ├─ Step 4: Custom Params (Passthrough)
│  │  └─ + Add Parameter (key-value pairs for undocumented params)
│  │
│  ├─ Step 5: Global Instructions (System Prompt)
│  │  ├─ Textarea: System prompt prefix
│  │  ├─ Example: "Always use Markdown formatting..."
│  │  └─ Import from URL button (optional)
│  │
│  └─ Step 6: Pricing (Economics)
│     ├─ Input Cost: $ per 1M tokens
│     └─ Output Cost: $ per 1M tokens
│
└─ Modal Footer
   ├─ [Cancel] button
   ├─ [Back] button (disabled on step 1)
   └─ [Next] button (steps 1-5) / [Save Model] button (step 6)

#### Knowledge Engine
Knowledge Engine Settings Page
├─ Header
│  └─ Title: "Knowledge Engine"
│
├─ Section: Embedding Models
│  ├─ Header (+ Add Model)
│  └─ Models List
│     └─ Model Card (Provider, Name, Dimensions, Cost)
│
├─ Section: Chunking Strategies
│  ├─ Header (+ Create Strategy)
│  └─ Strategies List
│     └─ Strategy Card (Name, Method: Recursive/Fixed, Chunk Size, Overlap)
│
└─ Section: Vector Databases
   ├─ Header (+ Add Database)
   └─ Databases List
      └─ Database Card (Type: Supabase/Pinecone, Index Name, Status)

#### Embedding Models List
Embedding Models (Settings)
├─ Toolbar: Search, Filters, [+ Add]
└─ Embedding Model Cards

#### New/Edit Embedding Model
Configure Embedding Model (Modal/Page)
├─ Provider, ID, Params
└─ Economics (pricing fields)

#### Chunking Strategies List
Chunking Strategies (Settings)
├─ Toolbar: Search, [+ Create]
└─ Strategy Cards

#### New/Edit Chunking Strategy
Configure Strategy (Modal/Page)
├─ Name, Method, Size, Separators
└─ Simulator (preview)

#### Vector Databases List
Vector Databases (Settings)
├─ Toolbar: [+ Add]
└─ Database Cards

#### New/Edit Vector Database
Configure Database (Modal/Page)
├─ Type, Connection, Index, Settings
└─ Actions: [Cancel], [Save]