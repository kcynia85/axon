



## Details Navigation

### Workspaces

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

#### Prompts (Archetypes)
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

#### Automations
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


#### External Services
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

### Settings

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