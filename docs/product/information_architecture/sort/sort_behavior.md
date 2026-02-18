### **I.1) Sort Specifications**

`Default Sorts (per list):

Projects:
└─ Default: Updated Date (Newest first)
└─ Why: Users want to see recently modified projects

Agents:
└─ Default: Name (A→Z)
└─ Why: Alphabetical for easy finding

Knowledge Hubs:
└─ Default: Name (A→Z)

Knowledge Sources:
└─ Default: Indexed At (Newest first)
└─ Why: Recent uploads are most relevant

Inbox:
└─ Default: Priority (High→Low), then Created Date (Newest)
└─ Why: High priority items need attention first

Canvas Nodes (sidebar):
└─ Default: Recently Used (if tracked), else Name (A→Z)`

---

### **I.2) Sort Options**

`Common Sort Options (most lists):

Name (A→Z)
Name (Z→A)
Created Date (Newest)
Created Date (Oldest)
Updated Date (Newest)
Updated Date (Oldest)

Additional Options (where applicable):

Cost (Low→High) - for Agents
Cost (High→Low) - for Agents

Status (alphabetical) - for Projects
└─ Order: Completed, Idea, In Progress

Priority (High→Low) - for Inbox
Priority (Low→High) - for Inbox

File Size (Smallest→Largest) - for Knowledge Sources
File Size (Largest→Smallest) - for Knowledge Sources`

---

### **I.3) Sort UI**

`Dropdown Component:
┌─────────────────────────────────────────┐
│ Sort by: Updated Date (Newest) ▾        │
└─────────────────────────────────────────┘

Expanded:
┌─────────────────────────────────────────┐
│ Sort by: Updated Date (Newest) ▾        │
├─────────────────────────────────────────┤
│ ○ Name (A→Z)                            │
│ ○ Name (Z→A)                            │
│ ○ Created Date (Newest)                 │
│ ○ Created Date (Oldest)                 │
│ ● Updated Date (Newest)                 │
│ ○ Updated Date (Oldest)                 │
└─────────────────────────────────────────┘

Radio Button:
└─ Current sort has filled circle (●)
└─ Others have empty circle (○)

Arrow Indicator (optional, in table headers):
Name ↑ (ascending)
Name ↓ (descending)`

---

### **I.4) Sort Persistence**

`Session: Yes
└─ Stays active when navigating back to list

URL: No (MVP)
└─ Reason: Avoids URL clutter
└─ Future: Add ?sort=name_asc if needed

Local Storage: No (MVP)
└─ Future: Remember user's preferred sort per list`

---

### **I.5) Sort + Filter + Search Interaction**

`Application Order:
1. Filter (narrow down results)
2. Search (further narrow)
3. Sort (order remaining results)

Example:
URL: ?workspace=discovery&search=customer&sort=name_asc
Process:
1. Filter to Discovery workspace (50 items → 15 items)
2. Search for "customer" (15 items → 3 items)
3. Sort by name A→Z (3 items in alphabetical order)

Behavior:
├─ Changing filter → Maintains current sort
├─ Changing search → Maintains current sort
├─ Changing sort → Maintains current filter + search
└─ Scroll position: Maintains when changing sort (doesn't reset to top)`