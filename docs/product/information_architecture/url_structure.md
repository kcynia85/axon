###  URL Conventions**

`Format: kebab-case for paths
├─ Good: /knowledge-base, /external-services
└─ Bad: /knowledgeBase, /Knowledge_Base

IDs: UUIDs (not sequential numbers)
├─ Good: /projects/a1b2c3d4-e5f6-7890-abcd-ef1234567890
└─ Bad: /projects/123 (security risk, leaks count)

Segments:
├─ Plural for collections: /projects, /agents
├─ Singular for single item: /project/:id is wrong, use /projects/:id
└─ Nested resources: /projects/:id/artifacts`

---

### Route Structure**

`Root:
/                                   → Home (Dashboard)

Projects:
/projects                           → Projects List
/projects/new                       → New Project (if separate page, else modal on list)
/projects/:id                       → Project Detail (Overview tab default)
/projects/:id?tab=artifacts         → Project Detail (Artifacts tab)
/projects/:id?tab=resources         → Project Detail (Key Resources tab)
/projects/:id/edit                  → Edit Project (if separate page)

Spaces:
/spaces                             → Spaces Overview
/spaces/new                         → New Space (modal, but route for deep link)
/spaces/:id                         → Canvas View
/spaces/:id?node=:nodeId            → Canvas with node selected
/spaces/:id#node-:nodeId            → Canvas scrolled to node (hash navigation)
/spaces/:id#zone-:workspace         → Canvas scrolled to a Workspace Zone (e.g., #zone-design)

Workspaces:
/workspaces                         → Workspaces Overview (5 cards)
/workspaces/:workspace              → Workspace Detail (e.g., /workspaces/discovery)
/workspaces/:workspace?tab=agents   → Workspace Agents tab

Agents:
/workspaces/:workspace/agents       → Agents List (scoped to workspace)
/workspaces/:workspace/agents/new   → New Agent (modal or full page)
/workspaces/:workspace/agents/:id   → Agent Detail (side peek or full page)
/workspaces/:workspace/agents/:id/edit → Edit Agent (full page)


Similar structure for:
/workspaces/:workspace/crews
/workspaces/:workspace/patterns
/workspaces/:workspace/templates
/workspaces/:workspace/services
/workspaces/:workspace/automations

Resources:
/resources                          → Redirects to /resources/knowledge (default)
/resources/knowledge                → Knowledge Hubs List
/resources/knowledge/:hubId         → Hub Detail
/resources/knowledge/:hubId/:sourceId → Source Detail
/resources/knowledge/:hubId/:sourceId/debugger → RAG Debugger (optional route, otherwise modal)
/resources/prompts                  → Prompts (Archetypes) List
/resources/prompts/:id              → Archetype Detail (side peek)
/resources/prompts/:id/edit         → Edit Archetype
/resources/automations              → Automations List
/resources/automations/:id          → Automation Detail
/resources/automations/:id/edit     → Edit Automation
/resources/services                 → External Services List
/resources/services/:id             → Service Detail
/resources/services/:id/edit        → Edit Service
/resources/tools                    → Internal Tools List
/resources/tools/:id                → Tool Detail (side peek)
/resources/tools/:id/edit           → Edit Tool (modal or page)

Inbox:
/inbox                              → Inbox List
/inbox?item=:id                     → Opens with specific item highlighted
Note: Clicking inbox item navigates to source, not separate inbox item page

Settings:
/settings                           → Redirects to /settings/llms/providers (default)
/settings/llms/providers            → LLM Providers List
/settings/llms/providers/:id        → Provider Detail
/settings/llms/providers/:id/edit   → Edit Provider
/settings/llms/models               → Model Registry List
/settings/llms/models/new           → Add Model (modal, but route for state)
/settings/llms/models/:id           → Model Detail
/settings/llms/models/:id/edit      → Edit Model
/settings/llms/routers              → Routers List
/settings/llms/routers/:id          → Router Detail
/settings/llms/routers/:id/edit     → Edit Router
/settings/knowledge-engine/embedding → Embedding Models List
/settings/knowledge-engine/embedding/:id/edit → Edit Embedding Model
/settings/knowledge-engine/chunking → Chunking Strategies List
/settings/knowledge-engine/chunking/:id/edit → Edit Strategy
/settings/knowledge-engine/vectors  → Vector Databases List
/settings/knowledge-engine/vectors/:id/edit → Edit Database

Auth:
/signin                             → Sign In page
/signup                             → Sign Up page (if self-serve)
/forgot-password                    → Forgot Password
/reset-password?token=:token        → Reset Password with token

Account:
/account/settings                   → User account settings
/account/security                   → Security settings
/organization/settings              → Organization settings (admin only)
/organization/members               → Team members (admin only)
/organization/billing               → Billing (admin only)

Error Pages:
/404                                → Not Found (catch-all)
/403                                → Forbidden (no permission)
/500                                → Server Error`

---

### Query Parameters**

`Filters:
?workspace=discovery                → Single filter
?workspace=discovery,design         → Multiple values (OR logic)
?status=in_progress                 → Single value
?cost=0.5,2.0                       → Range (min,max)

Search:
?search=customer                    → Search term

Sort:
?sort=name_asc                      → Sort ascending
?sort=updated_desc                  → Sort descending

Pagination (if numbered):
?page=2                             → Page number (if not infinite scroll)
?per_page=50                        → Items per page (if customizable)

Tabs:
?tab=artifacts                      → Active tab
?tab=resources                      → Another tab

Modals/Overlays:
?modal=new                          → Opens modal on page load
?modal=edit&id=:id                  → Opens edit modal for specific item
?peek=:id                           → Opens side peek for item
Examples:
- /workspaces/:workspace/agents/new?modal=archetype → Open Archetype Library on step 1
- /spaces/:id?modal=save-pattern → Open Save as Pattern modal
- /resources/knowledge/:hubId/:sourceId?modal=debugger → Open RAG Debugger modal

Selection:
?node=:nodeId                       → Selected node in Canvas
?item=:itemId                       → Selected item in list

Combinations:
/agents?workspace=discovery&status=in_progress&search=customer&sort=name_asc`

---

### Hash Navigation (Within Page)**

`Use: Scroll to specific section on page

Format:
/:path#section-id

Examples:
/projects/:id#key-resources         → Scrolls to Key Resources section
/spaces/:id#node-:nodeId            → Scrolls to node in Canvas
/spaces/:id#zone-:workspace         → Scrolls to Workspace Zone (e.g., #zone-design)
/settings/llms/providers#openai     → Scrolls to OpenAI provider in list

Behavior:
├─ On page load: Scroll to element with id="section-id"
├─ Smooth scroll: Yes (scroll-behavior: smooth)
└─ Focus: Optional - focus element for keyboard nav`

---

###  Deep Linking**

`Goal: Allow users to share exact state of page

Examples:

Share filtered list:
/agents?workspace=discovery&search=customer
→ Opens Agents list filtered to Discovery with "customer" search

Share canvas with node selected:
/spaces/:id?node=:nodeId
→ Opens Canvas with node selected and inspector open

Share project artifact:
/projects/:id?tab=artifacts&highlight=:artifactId
→ Opens Project Artifacts tab with specific artifact highlighted

Share inbox item (routes to source):
/inbox?item=:id
→ Opens inbox with item expanded, then routes to source

Implementation:
├─ Parse query params on route load
├─ Apply filters/search/sort
├─ Select/highlight specified items
└─ Open appropriate tab/modal`

---

###  URL Validation & 404 Handling**

`Invalid ID (not found):
/projects/invalid-uuid
→ Response: 404 Not Found page
→ Message: "Project not found. It may have been deleted."
→ Action: [Go to Projects List] button

Deleted Resource:
/projects/:id (where project was deleted)
→ Response: 404 Not Found page
→ Message: "This project no longer exists."
→ Action: [Go to Projects List] button

Invalid Route:
/invalid-path
→ Response: 404 Not Found page
→ Message: "Page not found."
→ Suggestions: Links to Home, Projects, Workspaces

Permission Denied:
/settings/llms/providers (as non-admin)
→ Response: 403 Forbidden page
→ Message: "You don't have permission to view this page."
→ Action: [Go Back] button

Malformed Query Params:
/agents?workspace=invalid&cost=abc
→ Behavior: Ignore invalid params, use defaults
→ Optional: Show toast "Some filters were invalid and have been reset"`

---

###  URL Encoding**

`Special Characters:
├─ Spaces: Convert to %20 or +
│  └─ Example: search=customer interview → search=customer%20interview
├─ Commas: Allowed (used for multi-value params)
│  └─ Example: workspace=discovery,design
├─ Ampersands: Separate params
└─ Other: Encode as needed per URL spec

Names in URLs (avoid):
├─ Don't use names in URLs (use IDs)
├─ Names can have special chars, spaces, etc.
└─ If must use: Slugify and encode
   └─ Example: "Customer & Product Research" → customer-product-research`

---

### URL Best Practices**

`Guidelines:
├─ Keep short: Avoid deeply nested routes (max 5 segments)
├─ Descriptive: URL should hint at content
├─ Consistent: Use same patterns throughout
├─ Bookmarkable: URLs should be stable (don't change without reason)
├─ Shareable: Query params for filters/state
└─ SEO-friendly: Use meaningful words (even for app, good practice)

Good:
/workspaces/discovery/agents
/projects/:id?tab=artifacts
/resources/knowledge/:hubId

Bad:
/w/d/a (too short, cryptic)
/projects/:id/artifacts-tab (redundant, use query param)
/resources/knowledge-hubs/:hubId (inconsistent with "knowledge" elsewhere)`
