### **G.1) Search Specifications**

`Global Pattern (applies to all list searches):

Trigger:
├─ Type in search field
├─ Wait 300ms after last keystroke
└─ Fire search query

Minimum Characters:
├─ Minimum: 2 characters
└─ If <2 chars: Clear search, show all results

Search Scope (per content type):

Projects:
└─ Fields: name, summary, keywords

Agents:
└─ Fields: name, role, goal, backstory, keywords

Knowledge Hubs:
└─ Fields: name, description, keywords

Knowledge Sources:
└─ Fields: file_name, metadata.tags

Prompts (Archetypes):
└─ Fields: name, role, goal, backstory, keywords

Automations:
└─ Fields: name, description, keywords

Services:
└─ Fields: name, description, keywords

Tools:
└─ Fields: function_name, display_name, description, category

Case Sensitivity: Insensitive (search is case-insensitive)`

---

### **G.2) Search UI Behavior**

`Search Input Component:
┌─────────────────────────────────────────┐
│ 🔍 Search...                        [×] │
└─────────────────────────────────────────┘

States:

Empty:
└─ Placeholder: "Search [items]..."
└─ Icon: 🔍 (left, gray)
└─ No clear button

Active (has text):
└─ Icon: 🔍 (left, blue - indicates active search)
└─ Clear button: [×] (right, click to clear)

Loading:
└─ Icon: ○ Spinner (replaces search icon)
└─ Disabled: Yes (no typing while loading)

Results:
└─ Highlight: Matched text in bold
└─ Count: "Showing 12 results for 'customer'"

No Results:
└─ Message: "No results found for 'xyz'"
└─ Clear button visible`

---

### **G.3) Search Highlighting**

`Pattern:
- Matched text appears in bold
- Case-insensitive matching
- Partial word matching

Example:
Search: "inter"
Result: "Customer Interview Agent"
Display: "Customer Interview Agent"
           (bold: ^^^^^^)

Implementation:
<span>Customer <strong>Inter</strong>view Agent</span>`

---

### **G.4) Search + Filter Interaction**

`Behavior:
├─ Search and Filters are AND logic
├─ Example: search="customer" AND workspace="discovery"
├─ Both must match for result to appear

Active State Display:
┌─────────────────────────────────────────┐
│ 🔍 customer                         [×] │
│                                         │
│ Active: [× Discovery] [× In Progress]  │
│ [Clear All Filters]                     │
│                                         │
│ Showing 3 results                       │
└─────────────────────────────────────────┘

Clearing:
├─ Clear search → Keeps filters active
├─ Clear filters → Keeps search active
└─ Clear All → Clears both search and filters`

---

### **G.5) Search Persistence**

`URL Persistence: Yes
└─ Format: ?search=customer
└─ Benefit: Shareable links with search

Session Persistence: Yes
└─ Stays active when navigating back to list
└─ Clears when leaving section

Local Storage: No (MVP)
└─ Future: Save recent searches per user`

---

### **G.6) Global Search (v1.1 - Future)**

`Trigger: Cmd/Ctrl + K

Modal:
┌─────────────────────────────────────────┐
│ 🔍 Search everywhere...                 │
├─────────────────────────────────────────┤
│ Recent:                                 │
│ • Customer Interview Agent              │
│ • Product Redesign Project             │
│                                         │
│ Suggestions:                            │
│ • Projects (23)                         │
│ • Agents (15)                           │
│ • Knowledge Hubs (8)                    │
└─────────────────────────────────────────┘

Type "customer":
┌─────────────────────────────────────────┐
│ 🔍 customer                             │
├─────────────────────────────────────────┤
│ Agents (2)                              │
│ 🤖 Customer Interview Agent             │
│ 🤖 Customer Support Bot                 │
│                                         │
│ Projects (1)                            │
│ 📂 Customer Research 2026               │
│                                         │
│ Templates (1)                           │
│ 📝 Customer Interview Template          │
└─────────────────────────────────────────┘

Keyboard Navigation:
├─ ↑↓ Navigate results
├─ Enter: Open selected result
├─ Escape: Close modal
└─ Tab: Cycle through categories`