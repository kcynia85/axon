## Journey 1: Create Project → Build Canvas → Execute Agent
Goal: User wants to start a new discovery project and run research.

Steps | Screen | Action | Duration
──────────────────────────────────────────────────────
1  | Dashboard              | Land on home page              | 0:00
2  | Dashboard              | Click "Projects" (nav)         | 0:05
3  | Projects List          | Click "+ New Project"          | 0:08
4  | New Project Modal      | Fill: Name, Strategy URL       | 0:30
5  | New Project Modal      | Select: Create new Space       | 0:35
6  | New Project Modal      | Fill: Space Name               | 0:45
7  | New Project Modal      | Click "Create Project"         | 0:50
8  | Project Detail         | Page loads (Overview tab)      | 0:52
9  | Project Detail         | Click "Open Space"             | 0:55
10 | Canvas View            | Canvas loads                   | 0:58
11 | Canvas View            | Expand "Agents" in left sidebar| 1:00
12 | Canvas View            | Search "Customer Interview"    | 1:05
13 | Canvas View            | Drag agent to canvas           | 1:10
14 | Canvas View            | Node appears (Missing Context) | 1:12
15 | Canvas - Right Panel   | Auto-opens Node Inspector      | 1:12
16 | Canvas - Right Panel   | Fill required context fields   | 1:45
17 | Canvas - Right Panel   | Status → Briefing              | 1:47
18 | Canvas - Right Panel   | Review plan, cost estimate     | 1:55
19 | Canvas - Right Panel   | Click "Tak, Zaczynaj"          | 2:00
20 | Canvas - Right Panel   | Status → Working               | 2:02
21 | Canvas - Right Panel   | Watch progress bar, thoughts   | 2:02-4:00
22 | Canvas - Right Panel   | Status → Done                  | 4:00
23 | Canvas - Right Panel   | View results, artifact ready   | 4:05
24 | Canvas - Right Panel   | Click artifact link            | 4:10
25 | External (Google Doc)  | Review interview summary       | 4:15
26 | Return to Canvas       | Satisfied, ready for next step | 5:00

Total Duration: ~5 minutes
Screens: 5 (Dashboard, Projects List, Modal, Project Detail, Canvas)
Key Success: Smooth flow from project creation to execution

## Journey 2: Respond to Inbox Notification → Approve Artifact
Goal: User receives notification to approve a deliverable.

Steps | Screen | Action | Duration
──────────────────────────────────────────────────────
1  | Dashboard              | Land on home page              | 0:00
2  | Dashboard              | Notice Inbox badge: (1)        | 0:02
3  | Dashboard              | Click Inbox icon               | 0:05
4  | Inbox List             | See: "Review Artifact: Market Analysis" | 0:08
5  | Inbox List             | Read: Priority High, Pending   | 0:10
6  | Inbox List             | Click item card                | 0:12
7  | Project Detail         | Redirects to Project           | 0:15
8  | Project Detail         | Auto-opens Artifacts tab       | 0:15
9  | Project Detail         | Artifact highlighted (scroll)  | 0:16
10 | Project Detail         | Click deliverable URL          | 0:18
11 | External (Google Doc)  | Opens in new tab               | 0:20
12 | External (Google Doc)  | Review document                | 0:20-2:00
13 | Return to Axon         | Switch back to tab             | 2:00
14 | Project Detail         | Still on Artifacts tab         | 2:00
15 | Project Detail         | Click "Approve" button         | 2:05
16 | Confirmation Modal     | "Are you sure?" appears        | 2:06
17 | Confirmation Modal     | Click "Confirm"                | 2:08
18 | Project Detail         | Artifact status → Approved     | 2:10
19 | Success Toast          | "Artifact approved ✓"          | 2:10
20 | Inbox (background)     | Item auto-resolves             | 2:10
21 | Top Nav                | Inbox badge updates: (0)       | 2:10

Total Duration: ~2 minutes (excluding document review)
Screens: 4 (Dashboard, Inbox, Project Detail, External)
Key Success: Inbox intelligently routes to source context

## Journey 3: Create Agent from Archetype → Use in Canvas
Goal: User wants to create a specialized agent using a template.

Steps | Screen | Action | Duration
──────────────────────────────────────────────────────
1  | Dashboard              | Click "Workspaces" (nav)       | 0:05
2  | Workspaces Dropdown    | Select "Product Management"    | 0:08
3  | Workspace Detail (PM)  | Section: Agents                | 0:10
4  | Workspace Detail       | Click "All → Agents Page"      | 0:12
5  | Agents List (PM)       | Click "+ New Agent"            | 0:15
6  | Modal Step 1           | Choose: "Load from Archetype"  | 0:18
7  | Archetype Library      | Modal opens                    | 0:20
8  | Archetype Library      | Search: "Product Guardian"     | 0:25
9  | Archetype Library      | See card, click "Wybierz"      | 0:28
10 | Modal Step 2           | Select Skills modal opens      | 0:30
11 | Modal Step 2           | Search: "lead_scoring"         | 0:35
12 | Modal Step 2           | Click "+ Dodaj" (add tool)     | 0:38
13 | Modal Step 2           | Add "validate_nip_pl"          | 0:42
14 | Modal Step 2           | Click "Next"                   | 0:45
15 | Full Page (6 steps)    | Opens with pre-filled data     | 0:48
16 | Step 1: Identity       | Review/edit name               | 0:50
17 | Step 2: Memory         | Review hubs, edit guardrails   | 1:10
18 | Step 3: Engine         | Select LLM: "GPT-4o"           | 1:30
19 | Step 4: Skills         | Review selected tools          | 1:40
20 | Step 5: Interface      | Define Input/Output schema     | 2:20
21 | Step 6: Availability   | Select: PM, Discovery          | 2:40
22 | Cost Estimator         | Review: ~$0.70 per action      | 2:45
23 | Full Page              | Click "Save Agent"             | 2:50
24 | Success Toast          | "Agent created ✓"              | 2:52
25 | Agents List            | Returns to list                | 2:54
26 | Agents List            | New agent appears in grid      | 2:54

Total Duration: ~3 minutes
Screens: 8 (Dashboard, Workspace, List, 2 Modals, Full Page, List)
Key Success: Archetype pre-fills 70% of configuration, major time saver

## Journey 4: Upload Knowledge Source → Verify RAG Chunks
Goal: User uploads a PDF to enhance agent's knowledge base.

Steps | Screen | Action | Duration
──────────────────────────────────────────────────────
1  | Dashboard              | Click "Resources" dropdown     | 0:05
2  | Resources Dropdown     | Select "Knowledge Base"        | 0:08
3  | Knowledge Hubs List    | See hubs, click "PM Hub"       | 0:12
4  | Hub Detail             | Page loads with sources        | 0:15
5  | Hub Detail             | Click "+ Add Source"           | 0:18
6  | Add Source Modal       | Tab: Upload File               | 0:20
7  | Add Source Modal       | Click "Choose File"            | 0:22
8  | File Picker            | Select "Strategy_2025.pdf"     | 0:30
9  | Add Source Modal       | File preview shows (2.3 MB)    | 0:32
10 | Add Source Modal       | Strategy: "General Text" (auto)| 0:32
11 | Add Source Modal       | Hub: PM Hub (auto-selected)    | 0:32
12 | Add Source Modal       | Click "+ Auto-Tag (AI)"        | 0:35
13 | Add Source Modal       | AI suggests tags               | 0:40
14 | Add Source Modal       | Click "Save & Index"           | 0:45
15 | Hub Detail             | Modal closes, returns to list  | 0:47
16 | Hub Detail             | New source: "Indexing" status  | 0:48
17 | Hub Detail             | [Wait for indexing...]         | 0:48-0:58
18 | Hub Detail             | Status → "Ready" (green)       | 0:58
19 | Hub Detail             | Click source card              | 1:00
20 | Source Detail          | Full page opens                | 1:02
21 | Source Detail          | See: Ready, 45 chunks          | 1:02
22 | Source Detail          | Click "Inspektor Chunków"      | 1:05
23 | RAG Debugger Modal     | Modal opens                    | 1:07
24 | RAG Debugger           | See: 45 chunks, pagination     | 1:07
25 | RAG Debugger           | Click "Chunk 2"                | 1:10
26 | RAG Debugger           | Right panel shows chunk detail | 1:10
27 | RAG Debugger           | Review: Text, Metadata         | 1:15
28 | RAG Debugger           | Chunks look good ✓             | 1:20
29 | RAG Debugger           | Click "Close"                  | 1:22
30 | Source Detail          | Returns to source page         | 1:22

Total Duration: ~1.5 minutes (including indexing wait)
Screens: 5 (Dashboard, Hubs List, Hub Detail, Modal, Source Detail, RAG Debugger)
Key Success: Easy upload + verification tool ensures quality

## Journey 5: Configure LLM Router for Cost Optimization
Goal: Admin sets up fallback routing to reduce API costs.

Steps | Screen | Action | Duration
──────────────────────────────────────────────────────
1  | Dashboard              | Click Settings icon            | 0:05
2  | Settings Home          | Click "LLMs" section           | 0:08
3  | LLM Providers List     | Default view (Providers)       | 0:10
4  | LLM Providers List     | Click "Routers" tab            | 0:12
5  | Routers List           | Click "+ Add Router"           | 0:15
6  | New Router (full page) | Page loads                     | 0:17
7  | New Router             | Name: "Cost Optimized"         | 0:25
8  | New Router             | Strategy: "Fallback Cascade"   | 0:30
9  | New Router             | Click "+ Add Step"             | 0:33
10 | New Router             | Step 1: Select "OpenAI GPT-4o" | 0:38
11 | New Router             | Condition: None (primary)      | 0:40
12 | New Router             | Click "+ Add Step"             | 0:42
13 | New Router             | Step 2: "OpenRouter GPT-4o"    | 0:50
14 | New Router             | Condition: "On Error/Timeout"  | 0:55
15 | New Router             | Click "+ Add Step"             | 0:57
16 | New Router             | Step 3: "Claude 3.5 Sonnet"    | 1:05
17 | New Router             | Condition: "On Error"          | 1:08
18 | New Router             | Thresholds: Max tokens 50k     | 1:15
19 | New Router             | Cost limit: $0.50              | 1:20
20 | New Router             | Testing: Enter test prompt     | 1:30
21 | New Router             | Click "Send Test"              | 1:40
22 | New Router             | Results appear                 | 1:45
23 | New Router             | Review: 4.5s, $0.02, Connected | 1:50
24 | New Router             | Looks good ✓                   | 1:55
25 | New Router             | Click "Save Router"            | 2:00
26 | Success Toast          | "Router saved ✓"               | 2:02
27 | Routers List           | Redirects to list              | 2:04
28 | Routers List           | New router appears             | 2:04

Total Duration: ~2 minutes
Screens: 4 (Dashboard, Settings, Routers List, New Router)
Key Success: Technical config made accessible with testing

## Journey 6: Build Multi-Agent Crew → Execute Sequential Workflow
Goal: User creates a content pipeline with sequential task execution.

Steps | Screen | Action | Duration
──────────────────────────────────────────────────────
1  | Dashboard              | Navigate to Workspaces         | 0:05
2  | Workspace Detail       | Discovery workspace            | 0:08
3  | Workspace Detail       | Click "All → Crews"            | 0:12
4  | Crews List             | Click "+ New Crew"             | 0:15
5  | Process Type Modal     | Select "Sequential"            | 0:18
6  | New Crew (Sequential)  | Page loads                     | 0:20
7  | New Crew               | Name: "Content Pipeline"       | 0:30
8  | New Crew               | Goal: "Research & Write"       | 0:45
9  | New Crew               | Keywords: content, research    | 0:55
10 | New Crew               | Click "+ Add Task"             | 1:00
11 | New Crew               | Task 1: Name "Research Trends" | 1:10
12 | New Crew               | Specialist: Select "Web Researcher" | 1:20
13 | New Crew               | Description: "Find latest..."  | 1:35
14 | New Crew               | Click "+ Add Task"             | 1:40
15 | New Crew               | Task 2: Name "Write Article"   | 1:50
16 | New Crew               | Specialist: "Content Writer"   | 2:00
17 | New Crew               | Description: "Create article..." | 2:15
18 | New Crew               | Add Context: topic (Text)      | 2:30
19 | New Crew               | Add Artifact: article_draft.md | 2:45
20 | New Crew               | Availability: Discovery, PM    | 2:55
21 | New Crew               | Click "Save Team"              | 3:00
22 | Success Toast          | "Crew created ✓"               | 3:02
23 | Crews List             | Returns to list                | 3:04
24 | Dashboard              | Navigate to Spaces             | 3:10
25 | Spaces Overview        | Select existing space          | 3:15
26 | Canvas View            | Opens canvas                   | 3:18
27 | Canvas View            | Expand "Crews" in sidebar      | 3:20
28 | Canvas View            | Drag "Content Pipeline" to canvas | 3:25
29 | Canvas - Right Panel   | Node: Missing Context          | 3:27
30 | Canvas - Right Panel   | Fill: topic = "AI in Education"| 3:40
31 | Canvas - Right Panel   | Status → Briefing              | 3:42
32 | Canvas - Right Panel   | Review sequence plan           | 3:50
33 | Canvas - Right Panel   | Click "Zatwierdź kolejkę"      | 3:55
34 | Canvas - Right Panel   | Status → Working               | 3:57
35 | Canvas - Right Panel   | Task 1 (Web Researcher): Working | 3:57
36 | Canvas - Right Panel   | Task 1: Done ✓                 | 5:30
37 | Canvas - Right Panel   | Task 2 (Content Writer): Working | 5:30
38 | Canvas - Right Panel   | Task 2: Done ✓                 | 8:00
39 | Canvas - Right Panel   | Overall Status: Done           | 8:00
40 | Canvas - Right Panel   | Review article draft           | 8:05
41 | Canvas - Right Panel   | Download artifact              | 8:10

Total Duration: ~8 minutes (including agent execution)
Screens: 7 (Dashboard, Workspace, Crews List, New Crew, Spaces, Canvas)
Key Success: Sequential workflow executes in correct order