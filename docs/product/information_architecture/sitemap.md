## Home
/ → Dashboard
├─ Greetings ("Welcome back, {user}")
├─ AI Input ("What do you want to do today?")
├─ Recently Used (Last 3 Spaces, Last 3 Projects)
├─ Workspace Quick Access (5 cards: PM, Discovery, Design, Delivery, Growth)
└─ Inbox Preview (if items exist)

## Inbox
/inbox
└─ Inbox List
   ├─ Search bar
   ├─ Filters: Type (All/Artifact Ready/Consultation/Approval), Priority, Status
   ├─ Item Cards:
   │  ├─ Type icon (📄 artifact, 💬 consultation, ⚠️ approval)
   │  ├─ Title
   │  ├─ Description
   │  ├─ Source info (Project/Space/Node)
   │  ├─ Priority badge (High/Normal)
   │  ├─ Status badge (New/Resolved)
   │  └─ Timestamp
   │
   └─ Click routing: ★ UPDATED v3.0 ★
      ├─ artifact_ready → Project > Artifacts Tab > Highlight artifact
      ├─ consultation → Space Canvas > Select node > Inspector
      └─ approval_needed → Space Canvas > Select node > Briefing state

## Projects
/projects
├─ Projects List (Search, Filters, Sort, + New)
│  ├─ Filters: Status (In Progress/Completed/Idea), Workspace, Keywords
│  └─ Sort: Name, Created Date, Updated Date
│
├─ /projects/new → New Project Modal
│  ├─ Name (required)
│  ├─ Strategy URL (optional)
│  └─ Space: Create New / Assign Existing
│
├─ /projects/:id → Project Detail (3 tabs)
│  ├─ Overview Tab (default)
│  │  ├─ Summary (editable textarea, inline)
│  │  ├─ Strategy Link (editable input, inline)
│  │  ├─ Active Workspaces (computed badges from Space → Zones)
│  │  ├─ Key Resources preview (first 3, "See All" link)
│  │  ├─ Artifacts preview (first 6, "See All" link)
│  │  └─ [Open Space] button
│  │
│  ├─ Key Resources Tab
│  │  ├─ Table: Provider, Label, URL, Actions
│  │  └─ + Add Resource Modal
│  │
│  └─ Artifacts Tab ★ UPDATED v3.0 ★
│     ├─ Filters: All / Draft / Approved / Rejected
│     ├─ Artifact Cards (Grid)
│     │  ├─ 📄 File Name
│     │  ├─ Status Badge:
│     │  │  ├─ 🟠 Draft (orange)
│     │  │  ├─ 🟢 Approved (green)
│     │  │  └─ 🔴 Rejected (red)
│     │  ├─ Workspace: Discovery
│     │  ├─ Created: 2 hours ago
│     │  └─ Actions:
│     │     ├─ [Approve] (if Draft, Project Owner only)
│     │     ├─ [Reject] (if Draft, Project Owner only)
│     │     ├─ [Download]
│     │     └─ [View]
│     └─ + Add Artifact button
│
├─ /projects/:id/edit → Edit Project Modal
└─ Delete Project Confirmation Modal

## Spaces
/spaces
├─ Spaces Overview
│  ├─ Recently Used
│  ├─ All Spaces (cards)
│  └─ + New Space Modal
│
├─ /spaces/new → New Space Modal
├─ /spaces/:id/edit → Edit Space Modal
│
├─ /spaces/:id → Canvas View ★ 3-PANEL LAYOUT ★
│  │
│  ├─ Top Bar
│  │  ├─ Space Name (editable inline)
│  │  ├─ Linked Project badge (if linked)
│  │  ├─ Save Indicator (auto-save)
│  │  ├─ Viewport Controls (zoom, fit to screen)
│  │  └─ [Settings] button
│  │
│  ├─ LEFT SIDEBAR (320px) - Components Library
│  │  ├─ Search bar
│  │  └─ Accordion Sections (collapsible):
│  │     ├─ Core (basic nodes)
│  │     ├─ Patterns (draggable)
│  │     ├─ Crews (draggable) ★ with process icons ★
│  │     ├─ Agents (draggable)
│  │     ├─ Templates (draggable)
│  │     ├─ Services (draggable)
│  │     └─ Automations (draggable)
│  │
│  ├─ CANVAS (flex) - Main Workspace
│  │  ├─ Zones (workspace-colored backgrounds)
│  │  ├─ Nodes (Agent, Crew, Pattern, Template, etc.)
│  │  │  └─ Crew Nodes show process type icon: ★ NEW v3.0 ★
│  │  │     ├─ ⚡ Parallel (lightning bolt)
│  │  │     ├─ → Sequential (right arrow)
│  │  │     └─ 👑 Hierarchical (crown)
│  │  ├─ Edges (connections)
│  │  └─ Context Menu (right-click):
│  │     ├─ On Node: Run, Stop, View, Duplicate, Delete
│  │     ├─ On Selection: Save as Pattern, Delete
│  │     └─ On Canvas: Paste
│  │
│  └─ RIGHT PANEL (384px) - Node Inspector ★ UPDATED v3.0 ★
│     └─ Context-Sensitive (6+ states):
│        │
│        ├─ STATE 1: Missing Context
│        │  ├─ Warning message
│        │  ├─ Context form (dynamic based on input_schema)
│        │  └─ [Wygeneruj Plan] button (disabled until valid)
│        │
│        ├─ STATE 2: Briefing ★ NEW for Hierarchical Crew ★
│        │  ├─ 👑 Manager Briefing
│        │  ├─ Proposed Sequence:
│        │  │  └─ List of tasks:
│        │  │     ├─ Task name
│        │  │     ├─ Assigned to: Agent name
│        │  │     └─ Expected output: Description
│        │  ├─ Cost Estimate: $1.20
│        │  ├─ Estimated Time: ~5 minutes
│        │  ├─ [Approve Plan] button (primary, green)
│        │  └─ [Modify Context] button (secondary)
│        │
│        ├─ STATE 3: Working
│        │  ├─ Progress bar (real-time, 0-100%)
│        │  ├─ Live thoughts (streaming text)
│        │  ├─ Metrics:
│        │  │  ├─ Elapsed time: 1m 30s
│        │  │  ├─ Tokens used: 1,200
│        │  │  └─ Time remaining: ~45s
│        │  └─ [Zatrzymaj pracę] button
│        │
│        ├─ STATE 4: Consultation
│        │  ├─ Agent question display
│        │  ├─ Answer input (textarea)
│        │  └─ [Wyślij odpowiedź] button
│        │
│        ├─ STATE 5: Done ★ UPDATED v3.0 ★
│        │  ├─ Success message: "✓ Execution completed"
│        │  ├─ Execution summary:
│        │  │  ├─ Time: 2m 15s
│        │  │  ├─ Tokens: 3,200
│        │  │  └─ Cost: $0.08
│        │  │
│        │  ├─ Results (with citations): ★ NEW v3.0 ★
│        │  │  ├─ Text with inline markers:
│        │  │  │  "According to the 2025 roadmap [1], we plan
│        │  │  │   to launch Q3. The interview guide [2] suggests
│        │  │  │   asking about pain points."
│        │  │  │
│        │  │  └─ Sources (collapsible):
│        │  │     [1] Roadmap_2025.md (Hub: Product Management)
│        │  │     [2] Interview_Guide.pdf (Hub: Discovery)
│        │  │
│        │  ├─ Artifacts:
│        │  │  └─ Interview_Summary.md
│        │  │     ├─ Status: 🟠 Draft ★ NEW v3.0 ★
│        │  │     └─ [Download] [View]
│        │  │
│        │  └─ Actions:
│        │     ├─ [Nowe zadanie]
│        │     └─ [Szczegóły]
│        │
│        └─ STATE 6: Error ★ UPDATED v3.0 ★
│           ├─ ⚠️ Error message: "Execution failed"
│           ├─ Error Details (collapsible):
│           │  ├─ Error Type: "LLM API Error"
│           │  ├─ Status Code: 504
│           │  ├─ Timestamp: "2026-02-15 14:23:45"
│           │  ├─ Fallback Used: ★ NEW v3.0 ★
│           │  │  "Yes - Switched to Gemini 2.0 Pro"
│           │  └─ Full Error: "Gateway Timeout: ..."
│           │
│           ├─ Suggestions:
│           │  └─ • Try again with simpler input
│           │  └─ • Check your LLM provider settings
│           │
│           └─ Actions:
│              ├─ [Retry] (primary)
│              └─ [Edit Context] (secondary)
│
├─ Save as Pattern Modal
│  ├─ Pattern Name
│  ├─ Description
│  ├─ Keywords
│  └─ [Save]
│
├─ Space Settings Modal
└─ Delete Space Confirmation

## Workspaces
/workspaces
└─ Workspaces Overview (5 domain cards)
   ├─ Product Management
   ├─ Discovery
   ├─ Design
   ├─ Delivery
   └─ Growth & Market

/workspaces/:workspace → Workspace Detail (Tabs)
├─ Patterns Tab
├─ Crews Tab
├─ Agents Tab
├─ Templates Tab
├─ Services Tab
└─ Automations Tab

## Agents
/workspaces/:workspace/agents
├─ Agents List
│  ├─ Filters: Workspace (multi), Keywords, Cost Range
│  ├─ Sort: Name, Cost, Created Date
│  └─ Card Grid (click → Side Peek)
│
├─ Agent Detail (Side Peek - 384px from right)
│  ├─ Header: Name, Role
│  ├─ Sections:
│  │  ├─ Identity (Goal, Backstory)
│  │  ├─ Memory & Reasoning (Knowledge Hubs, Guardrails)
│  │  ├─ Engine (LLM Model, Temperature, RAG)
│  │  ├─ Skills (Tools badges)
│  │  ├─ Interface (Input/Output schemas, collapsible)
│  │  ├─ Availability (Workspace badges)
│  │  └─ Cost Estimate
│  └─ Footer Actions: [Edit] [Duplicate] [Delete]
│
├─ New Agent - Modal Step 1: Choose
│  ├─ [Load from Archetype] card
│  └─ [Empty Agent] card
│
├─ Archetype Library Modal
│  ├─ Search bar
│  └─ Grid of archetype cards (click to select)
│
├─ New Agent - Modal Step 2: Select Skills
│  ├─ Search bar
│  ├─ Tools list (checkboxes)
│  └─ [Next] button
│
└─ /agents/:id/edit → Agent Edit (Full Page - 6-Step Wizard)
   ├─ Progress Indicator: [1●]─[2○]─[3○]─[4○]─[5○]─[6○]
   │  └─ Labels: Identity → Memory → Engine → Skills → Interface → Availability
   │
   ├─ Main Form (left 70%)
   │  ├─ Step 1: Identity
   │  │  ├─ Name, Role, Goal, Backstory, Keywords
   │  │
   │  ├─ Step 2: Memory & Reasoning
   │  │  ├─ Knowledge Hubs (multi-select)
   │  │  ├─ Guardrails (Instructions, Constraints)
   │  │  ├─ Few-shot Examples (optional)
   │  │  └─ Reflexion (checkbox)
   │  │
   │  ├─ Step 3: Engine ★ UPDATED v3.0 ★
   │  │  ├─ LLM Model (dropdown with Tier badges):
   │  │  │  ├─ Gemini 3.0 Pro
   │  │  │  │  └─ Badge: "Tier 1 (High Performance, Higher Cost)"
   │  │  │  ├─ Gemini 2.5 Pro
   │  │  │  │  └─ Badge: "Tier 2 (Balanced Performance & Cost)"
   │  │  │  └─ Claude Sonnet 4.5
   │  │  │     └─ Badge: "Tier 2 (Balanced)"
   │  │  ├─ Temperature (slider 0.0 - 2.0)
   │  │  └─ RAG Enforcement (checkbox)
   │  │
   │  ├─ Step 4: Skills
   │  │  └─ Selected tools (multi-select with search)
   │  │
   │  ├─ Step 5: Interface
   │  │  ├─ Input Schema (JSON editor)
   │  │  └─ Output Schema (JSON editor)
   │  │
   │  └─ Step 6: Availability
   │     ├─ Workspace checkboxes (multi-select)
   │     └─ Summary
   │
   ├─ Cost Estimator Sidebar (right 30%, sticky)
   │  ├─ Cost per Action: "Średni ($0.70)"
   │  ├─ Show Details (collapsible)
   │  ├─ Context Usage Bar
   │  ├─ Memory Allocation
   │  └─ AI Suggestions
   │
   └─ Navigation (sticky bottom)
      ├─ [Previous] (disabled step 1)
      └─ [Next] / [Save Agent] (step 6)

## Crews
/workspaces/:workspace/crews
├─ Crews List
├─ Crew Detail (Side Peek)
│  └─ Shows process type badge with icon
│
├─ New Crew - Process Type Selection Modal
│  ├─ ⚡ Parallel card
│  ├─ → Sequential card
│  └─ 👑 Hierarchical card
│
├─ /crews/:id/edit (Parallel) → Full Page
│  ├─ Basic Info (Name, Goal, Keywords)
│  ├─ Team Members (multi-select agents)
│  ├─ Owner Goal (synthesis instructions)
│  ├─ Context/Artifacts schemas
│  └─ Availability
│
├─ /crews/:id/edit (Sequential) → Full Page
│  ├─ Basic Info
│  ├─ Task Definition:
│  │  └─ For each Task:
│  │     ├─ Task Name
│  │     ├─ Specialist (select agent)
│  │     ├─ Description
│  │     └─ Drag handles (reorder)
│  ├─ Context/Artifacts
│  └─ Availability
│
└─ /crews/:id/edit (Hierarchical) → Full Page
   ├─ Basic Info
   ├─ Manager Agent (select one) ★ REQUIRED ★
   ├─ Team Members (multi-select executors)
   ├─ Context/Artifacts
   └─ Availability


## Patterns
/workspaces/:workspace/patterns
├─ Patterns List
│  └─ Note: Created via Canvas → "Save as Pattern"
│
├─ Pattern Detail (Side Peek)
│  ├─ Description
│  ├─ Components Preview (mini graph)
│  ├─ Context (Inputs list)
│  ├─ Artifacts (Outputs list)
│  ├─ Keywords
│  └─ Availability
│
└─ Edit Pattern Modal (metadata only)
   ├─ Name, Description, Keywords
   └─ Availability


## Templates
/workspaces/:workspace/templates
├─ Templates List
│
├─ Template Detail (Side Peek)
│  ├─ Description, Goal
│  ├─ Instructions (markdown preview, collapsible)
│  ├─ Context (required variables)
│  ├─ Artifacts (required outputs)
│  ├─ Checklist Items (preview)
│  ├─ Keywords
│  └─ Availability
│
└─ /templates/:id/edit → Full Page
   ├─ Basic Info (Name, Description, Goal, Keywords)
   ├─ Markdown Content (editor with toolbar)
   │  ├─ Preview toggle
   │  └─ [Autofill] button (AI suggests)
   ├─ Context (define required inputs)
   ├─ Artifacts (define expected outputs)
   ├─ Checklist Items
   │  ├─ Auto-fill from Markdown
   │  └─ + Add Item (manual)
   └─ Availability

   ★ Template Node Inspector Note v3.0: ★
   "Templates are manual checklists - no automatic execution.
    Check off items as you complete them."

## Knowledge Base
/resources/knowledge
├─ Knowledge Hubs List
│  ├─ Search, Filters (Workspace)
│  └─ + Add Hub Modal
│
├─ /resources/knowledge/:hubId → Hub Detail
│  ├─ Header:
│  │  ├─ Hub Name (editable inline)
│  │  ├─ Description, Keywords
│  │  ├─ Workspace badge
│  │  └─ Actions: [Edit] [Delete] [+ Add Source]
│  │
│  ├─ Statistics (3 cards)
│  │  ├─ Total Sources
│  │  ├─ Total Chunks
│  │  └─ Last Indexed
│  │
│  └─ Sources List (table)
│     ├─ Columns: File Name, Format, Size, Status, Chunks, Indexed At
│     ├─ Search bar
│     └─ Status filter
│
├─ Add Source Modal (3 tabs)
│  ├─ Upload File tab
│  │  ├─ File picker (drag-and-drop)
│  │  ├─ Accepted: .pdf, .md, .txt, .docx (max 50 MB)
│  │  └─ Chunking Strategy (dropdown)
│  ├─ Import URL tab
│  │  └─ URL input
│  └─ Notion tab (future)
│
├─ /resources/knowledge/:hubId/:sourceId → Source Detail (2 tabs)
│  ├─ Overview Tab (default)
│  │  ├─ Preview/Download section
│  │  ├─ RAG Settings:
│  │  │  ├─ Chunking Strategy badge
│  │  │  ├─ Status badge
│  │  │  └─ [Re-index] button
│  │  ├─ Metadata (Tags, Auto-tag button)
│  │  └─ Statistics (Chunks, Tokens, Avg Size)
│  │
│  └─ Chunks Tab
│     └─ [Open RAG Debugger] button
│
├─ RAG Debugger Modal (2-panel, full-screen)
│  ├─ Left Panel (1/3): Chunks List
│  │  ├─ Header: "{N} Chunks, Strategy: {name}"
│  │  └─ List:
│  │     ├─ Chunk {index}
│  │     ├─ Token count badge
│  │     └─ Text preview (2 lines)
│  │
│  └─ Right Panel (2/3): Chunk Detail
│     ├─ Chunk {index}
│     ├─ Badges: Index, Tokens, Size
│     ├─ Text Content (pre-formatted)
│     └─ Metadata (JSON, collapsible)
│
├─ Edit Hub Modal
├─ Edit Source Modal
├─ Delete Hub Confirmation
└─ Delete Source Confirmation

## Prompts
/resources/prompts
├─ Archetypes List
│
├─ Archetype Detail (Side Peek)
│  ├─ Identity (Role, Goal, Backstory)
│  ├─ Memory & Reasoning (Suggested Hubs, Guardrails)
│  ├─ Categorization (Keywords, Workspace)
│  ├─ Computed Estimates (Base Cost, Memory Allocation)
│  └─ Footer: [Use in Agent] [Edit] [Duplicate] [Delete]
│
└─ /resources/prompts/:id/edit → Edit Archetype (Full Page)
   ├─ Identity (Role, Goal, Backstory)
   ├─ Memory & Reasoning (Knowledge Hubs, Guardrails)
   └─ Categorization (Keywords, Workspace)

## Automations
/resources/automations
├─ Automations List
│
├─ Automation Detail (Side Peek with Simulator)
│  ├─ Description
│  ├─ Connection Config:
│  │  ├─ Platform badge (n8n, Zapier, Make)
│  │  ├─ Webhook URL (with copy button)
│  │  ├─ HTTP Method badge
│  │  └─ Authorization (masked)
│  ├─ Interface (Input/Output schemas, collapsible)
│  ├─ Validation:
│  │  ├─ Status badge (Valid/Invalid/Untested)
│  │  └─ Last Validated
│  ├─ Simulator (Testing):
│  │  ├─ Test Data (JSON editor)
│  │  ├─ [Execute Test] button
│  │  └─ Results (Status, Response Time, Response Data)
│  ├─ Keywords
│  └─ Availability
│
└─ /resources/automations/:id/edit → Full Page
   ├─ Definition (Name, Description, Platform)
   ├─ Connection Config (Webhook URL, Method, Auth)
   ├─ Interface (Input/Output schemas)
   ├─ Availability (Workspaces)
   └─ Simulator (inline testing)

## External Services
/resources/services
├─ Services List
│
├─ Service Detail (Side Peek)
│  ├─ Identity (Name, Base URL, Category)
│  ├─ Business Context (description)
│  ├─ Capabilities (list of capability cards)
│  ├─ Keywords
│  └─ Availability
│
└─ /resources/services/:id/edit → Full Page (3-Step Wizard)
   ├─ Step 1: Identity (Name, URL, Category)
   ├─ Step 2: Capabilities (+ Add Capability, Name, Description)
   └─ Step 3: Availability (Workspaces)

## Internal Tools
/resources/tools
├─ Internal Tools List (read-only, synced from CLI)
│  └─ Note: "Tools synced from repository"
│
└─ Tool Detail (Side Peek)
   ├─ Display Name
   ├─ Description
   ├─ Category badge
   ├─ Source Path (code location)
   ├─ Interface (Input/Output schemas, collapsible)
   ├─ Keywords
   ├─ Availability
   ├─ Active Status (badge)
   └─ Footer: [Edit] (metadata only), [View Code]


## LLMs
/settings/llms/providers
├─ LLM Providers List
│  ├─ + Add Provider button
│  └─ Table: Name, Type, Status, Actions
│
├─ Provider Type Selection Modal
│  ├─ Cloud (OpenAI, Anthropic, Google)
│  ├─ Meta-Provider (OpenRouter)
│  └─ Local (Ollama, vLLM)
│
├─ /settings/llms/providers/:id → Provider Detail (Sections)
│  ├─ Connection (API Key, Endpoint, Status)
│  ├─ Tokenization Settings
│  ├─ API Adapter Config
│  └─ Actions: [Edit] [Test Connection] [Delete]
│
├─ OpenRouter Marketplace Modal
│  └─ Browse available models on OpenRouter
│
/settings/llms/models
├─ Model Registry List ★ UPDATED v3.0 ★
│  ├─ + Add Model button
│  └─ Table:
│     ├─ Model Name
│     ├─ Provider
│     ├─ Tier ★ NEW COLUMN ★
│     │  ├─ Tier 1 (blue badge)
│     │  └─ Tier 2 (gray badge)
│     ├─ Input Cost
│     ├─ Output Cost
│     └─ Actions
│
├─ Add Model (6-Step Modal)
│  ├─ Step 1: Choose Provider
│  ├─ Step 2: Identify Model (ID/name)
│  ├─ Step 3: Provider-Specific Params
│  ├─ Step 4: Custom Params (passthrough)
│  ├─ Step 5: Global Instructions (system prompt)
│  └─ Step 6: Pricing (Economics) + Tier Selection ★ NEW ★
│     ├─ Input Cost per 1M tokens
│     ├─ Output Cost per 1M tokens
│     └─ Tier dropdown: ★ NEW v3.0 ★
│        ├─ Tier 1 (High Performance - recommended for Manager agents)
│        └─ Tier 2 (Balanced - recommended for Researcher/Builder)
│
├─ /settings/llms/models/:id → Model Detail
│  └─ Shows tier badge prominently
│
/settings/llms/routers
├─ Routers List
│  └─ + Add Router button
│
└─ /settings/llms/routers/:id/edit → Full Page (Split Layout)
   ├─ Left (60%): Form
   │  ├─ Name (Alias)
   │  ├─ Strategy (dropdown): Fallback, Load Balancer, Priority Chain
   │  ├─ Steps Configuration:
   │  │  └─ For each Step:
   │  │     ├─ Model Selection (dropdown)
   │  │     ├─ Override Params (collapsible JSON)
   │  │     ├─ Trigger Condition (None/Error/Timeout/Both)
   │  │     └─ Drag handles (reorder)
   │  └─ Thresholds (Max Tokens, Cost Limit)
   │
   └─ Right (40%, sticky): Testing Panel
      ├─ Prompt Test (textarea)
      ├─ [Send Test] button
      └─ Results (simulation): ★ Q16: Simulation mode ★
         ├─ Selected Model: [which model would be chosen]
         ├─ Reason: "Based on strategy: ..."
         ├─ Estimated Cost: $X.XX
         └─ Would fallback to: [backup model] if error


## Knowledge Engine
/settings/knowledge-engine/embedding
├─ Embedding Models List
│  └─ + Add Model button
│
└─ /settings/knowledge-engine/embedding/:id/edit → Modal or Full Page
   ├─ Provider, Model ID
   ├─ Technical Params (dimensions, max context)
   ├─ Economics (cost per 1M tokens)
   └─ Migration Plan (if changing)

/settings/knowledge-engine/chunking
├─ Chunking Strategies List
│  └─ + Create Strategy button
│
└─ /settings/knowledge-engine/chunking/:id/edit → Full Page with Simulator
   ├─ Main Form:
   │  ├─ Strategy Name
   │  ├─ Chunking Method (dropdown)
   │  ├─ Chunk Size (slider)
   │  ├─ Chunk Overlap (slider)
   │  └─ Chunk Boundaries (list input)
   │
   └─ Simulator Section:
      ├─ Sample Text (textarea)
      ├─ [Preview Chunks] button
      └─ Results:
         ├─ Generated chunks preview
         ├─ Chunk count
         └─ Avg chunk size

/settings/knowledge-engine/vectors
├─ Vector Databases List
│  └─ + Add Database button
│
└─ /settings/knowledge-engine/vectors/:id/edit → Full Page
   ├─ Identity (Name, Type)
   ├─ Connection Config (URL, Connection String)
   ├─ Index Method (HNSW, IVFFLAT)
   ├─ Statistics (Total Vectors, Size)
   ├─ [Test Connection] button
   └─ Actions: [Save] [Delete]
