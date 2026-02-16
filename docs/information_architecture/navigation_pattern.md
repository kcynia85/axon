## Pattern 1: List → Detail → Edit/New (CRUD)
1. Agents List
   └─ Cards with preview info
2. Click Card → Side Peek (read-only)
   └─ Full details, Actions menu
3. Click "Edit" → Full Page Edit
   └─ 6-step wizard
4. Click "+ New Agent" → Multi-step Modal
   └─ Step 1 → Step 2 → Full Page

Used in:
- All Workspace components (Agents, Crews, Patterns, Templates)
- All Resources (Knowledge, Prompts, Automations, Services, Tools)
- Settings (Providers, Models, Routers, Embedding, Chunking, Databases)

## Pattern 2: Canvas → Context Menu → Action
1. Canvas View (Space)
2. Right-click Node → Context Menu
   ├─ Run (if Idle)
   ├─ Stop (if Working)
   ├─ View Details → Opens Right Panel
   ├─ Duplicate → Creates copy on canvas
   ├─ Cut → Clipboard
   ├─ Copy → Clipboard
   └─ Delete → Immediate removal
3. Right-click Selection (multiple nodes) → Context Menu
   ├─ Cut
   ├─ Copy
   ├─ Delete
   └─ Save Selection as Pattern → Modal
      └─ Pattern configuration

Used in:
- Canvas operations (Nodes, Edges, Selections)
- Table rows (Projects, Spaces with right-click actions)

## Pattern 3: Inbox → Source Context Routing
1. Inbox List
2. Click "Review Artifact: JTBD Analysis Report"
3. System reads:
   └─ item_source_type = "Artifact"
   └─ item_source_id = [artifact UUID]
4. System routes to:
   └─ Project Detail (via artifact.project_id)
   └─ Artifacts Tab (auto-selected)
   └─ Scroll to artifact + Highlight
5. User actions:
   └─ View deliverable (external link)
   └─ Approve/Reject buttons
6. On action → Inbox item auto-resolves

Source Type Routing Logic:

Source Type         → Destination
──────────────────────────────────────────
Artifact            → Project > Artifacts Tab > Highlight item
CanvasNode          → Space Canvas > Select node > Open Inspector
ChatSession         → Space Canvas > Select node > Chat interface

## Pattern 4: Dropdowns (Hover/Click)
Top Nav: "Apps" (hover or click)
└─ Dropdown appears:
   ├─ Notion → Opens in new tab
   ├─ Figma → Opens in new tab
   ├─ n8n → Opens in new tab
   └─ Google Drive → Opens in new tab


## Pattern 5: Multi-Step Wizards/Modals

### New Agent (2 modals + full page)
1. Click "+ New Agent"
2. Modal Step 1: Choose starting point
   └─ Option A: Load Archetype
   └─ Option B: Empty Agent
3. If Archetype → Archetype Library Modal
   └─ Search, select → Pre-fills data
4. Modal Step 2: Select Skills
   └─ Search tools, multi-select
5. Full Page: 6-Step Wizard
   └─ Identity → Memory → Engine → Skills → Interface → Availability
6. Save → Returns to Agents List

### New Project (single modal)
1. Click "+ New Project"
2. Modal: New Project
   └─ Single form with all fields
   └─ Conditional: Space selection (New/Existing)
3. Create → Redirects to Project Detail

### Add Model (6-step modal)
1. Click "+ Add Model"
2. Modal Step 1: Choose Provider
3. Modal Step 2: Identify Model (search or manual)
4. Modal Step 3: Provider-specific params
5. Modal Step 4: Custom params (passthrough)
6. Modal Step 5: Global instructions
7. Modal Step 6: Pricing
8. Save → Returns to Model Registry


## Pattern 6: Side Peek (Quick View + Actions)
1. List View (any resource)
2. Click item card
3. → Side panel slides in from right (overlay)
   └─ Shows read-only details
   └─ Shows action buttons
4. Actions available:
   ├─ Edit → Opens full page edit
   ├─ Duplicate → Creates copy
   ├─ Delete → Confirmation modal
   └─ Use/Open (context-specific)
5. Click outside or Close (×) → Side peek closes

Used in:
- Agents, Crews, Patterns, Templates
- Knowledge Hubs, Sources, Prompts
- Automations, Services, Tools
- Settings (Providers, Models, etc.)

## Pattern 7: Inline Editing
1. Project Detail → Header
2. Hover over Project Name → Edit icon appears
3. Click name or icon → Text becomes editable
4. Type new name
5. Press Enter or click outside → Auto-saves
6. Success indicator (checkmark) → Fades out

Used in:
- Project Name, Space Name
- Hub Name, Description fields
- Any field marked "(inline editable)" in sitemap

## Pattern 8: Confirmation Modals (Destructive Actions)
1. Project Detail → Actions Menu → Delete
2. → Confirmation Modal appears
   ├─ Title: "Delete Project?"
   ├─ Warning: "This action cannot be undone."
   ├─ Dependencies: "This project contains:"
   │  ├─ 1 linked Space
   │  ├─ 6 Artifacts
   │  └─ 3 Key Resources
   ├─ Input: "Type project name to confirm"
   └─ Actions:
      ├─ Delete (disabled until name typed, red button)
      └─ Cancel (gray button)
3. Type name → Delete button enables
4. Click Delete → Project deleted
5. → Redirects to Projects List
6. → Success toast: "Project deleted"

Used for:
- Delete Project, Space, Agent, Crew, etc.
- Delete Hub (warns about connected agents)
- Delete Model (warns about router/agent usage)
- Reset Vector Database

## Pattern 9: Breadcrumbs (Deep Navigation)
Resources → Knowledge Base → Product Management Hub → Roadmap_2025.md

Clickable breadcrumbs:
[Resources] > [Knowledge Base] > [Product Management Hub] > Roadmap_2025.md
     ↓              ↓                      ↓                        ↓
  (no action)   Hubs List            Hub Detail              Source Detail (current)

Behavior:
- All items except last are clickable
- Last item (current page) is not clickable, styled differently
- Hover shows hand cursor on clickable items
- Click navigates to that level

Used in:
- Settings pages (deep hierarchy)
- Resource detail pages
- Workspace component pages

## Pattern 10: Tabs (Section Navigation within Page)
┌─────────────────────────────────────┐
│ Project: Product Redesign           │
│ ──────────────────────────────────  │
│ [Overview] [Key Resources] [Artifacts] │  ← Tabs
│ ═════════                             │
│                                       │
│ [Content of selected tab]             │
│                                       │
└─────────────────────────────────────┘

Behavior:
- Horizontal tab bar below header
- Active tab: Bold + underline indicator
- Click tab → Content area changes
- URL updates with tab parameter (e.g., ?tab=artifacts)
- Deep link support (can open directly to specific tab)

Used in:
- Project Detail (Overview, Key Resources, Artifacts)
- Workspace Detail (Patterns, Crews, Agents, Templates, Services, Automations)
- Settings (LLMs, Knowledge Engine sections)