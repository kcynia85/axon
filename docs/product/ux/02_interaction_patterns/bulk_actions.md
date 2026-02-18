### **S.1) Selection Mechanism**

`Checkbox Selection:
├─ Location: Left of each row/card
├─ Header Checkbox: Select/deselect all (in table)
├─ Individual: Select single item
└─ Visual: Highlight selected rows/cards

Keyboard Selection:
├─ Shift + Click: Select range (from last selected to clicked)
├─ Cmd/Ctrl + Click: Add/remove from selection
├─ Cmd/Ctrl + A: Select all
└─ Escape: Deselect all

Touch Selection (Mobile):
├─ Long Press: Enter selection mode, select item
├─ Tap: Add to selection (while in selection mode)
└─ Exit: Button to exit selection mode`

---

###  Selection UI**

`Table with Checkboxes:
┌─────────────────────────────────────────────────────┐
│ ☑ Name             Status      Updated          ⋮   │
├─────────────────────────────────────────────────────┤
│ ☑ Project Alpha    In Progress  2 hours ago     ⋮   │
│ ☐ Project Beta     Completed    1 day ago       ⋮   │
│ ☑ Project Gamma    In Progress  3 days ago      ⋮   │
└─────────────────────────────────────────────────────┘
Header checkbox: ☑ (checked) = all selected
                 ☐ (empty) = none selected
                 ⊟ (indeterminate) = some selected

Card Grid with Selection:
Selected cards: Blue border + subtle background

Selection Count Banner:
┌─────────────────────────────────────────────────────┐
│ 3 items selected                              [×]   │
│ [Delete] [Move to Workspace] [Export]               │
└─────────────────────────────────────────────────────┘

Position: Sticky at top of list (below filters)
Appears: Only when items selected
Dismiss: Click [×] or Escape key`

---

###  Available Bulk Actions**

`By Content Type:

Projects:
├─ Delete (with confirmation)
├─ Archive (future)
└─ Export to JSON

Agents:
├─ Delete (with confirmation)
├─ Move to Workspace (change availability)
├─ Duplicate (creates copies)
└─ Export to JSON

Crews:
├─ Delete (with confirmation)
├─ Move to Workspace
└─ Export

Knowledge Sources:
├─ Delete (with confirmation)
├─ Re-index (trigger indexing)
├─ Move to Hub (different hub)
└─ Change Strategy (chunking strategy)

Inbox Items:
├─ Mark as Resolved
├─ Dismiss
└─ Delete

Artifacts:
├─ Delete (with confirmation)
├─ Change Status (Draft → Review → Approved)
└─ Export`

---

### Bulk Action Confirmations**

`Delete Multiple:
┌─────────────────────────────────────────────────────┐
│ Delete 5 agents?                                [×] │
├─────────────────────────────────────────────────────┤
│ Are you sure you want to delete these 5 agents?     │
│                                                     │
│ • Customer Interview Agent                          │
│ • Market Researcher                                 │
│ • Product Analyst                                   │
│ • Web Scraper                                       │
│ • Content Writer                                    │
│                                                     │
│ ⚠️ This action cannot be undone.                    │
│                                                     │
│ ☐ I understand this will permanently delete 5 items│
│                                                     │
│ [Delete 5 Agents]                [Cancel]           │
└─────────────────────────────────────────────────────┘

Delete button: Red, disabled until checkbox checked

Move to Workspace:
┌─────────────────────────────────────────────────────┐
│ Move 3 agents to workspace                      [×] │
├─────────────────────────────────────────────────────┤
│ Select workspace:                                   │
│ ○ Product Management                                │
│ ○ Discovery                                         │
│ ● Design                                            │
│ ○ Delivery                                          │
│ ○ Growth & Market                                   │
│                                                     │
│ This will add Design to the availability of:       │
│ • Agent 1                                           │
│ • Agent 2                                           │
│ • Agent 3                                           │
│                                                     │
│ [Move]                           [Cancel]           │
└─────────────────────────────────────────────────────┘

Export:
└─ No confirmation needed, just download JSON file`

---

### Bulk Action Progress**

`Delete Progress:
┌─────────────────────────────────────────────────────┐
│ Deleting 5 agents...                                │
│ [▓▓▓▓▓▓░░░░░░░░░░] 3/5 complete                     │
│                                                     │
│ ✓ Customer Interview Agent                          │
│ ✓ Market Researcher                                 │
│ ✓ Product Analyst                                   │
│ ⏳ Web Scraper (deleting...)                        │
│ ⏳ Content Writer (pending)                         │
│                                                     │
│ [Cancel Remaining]                                  │
└─────────────────────────────────────────────────────┘

Complete:
┌─────────────────────────────────────────────────────┐
│ ✓ Deleted 5 agents successfully                [×] │
└─────────────────────────────────────────────────────┘
Toast (3 seconds auto-dismiss)

Partial Success:
┌─────────────────────────────────────────────────────┐
│ ⚠️ Deleted 3 of 5 agents                       [×] │
│   2 agents failed to delete                         │
│   [View Failed Items]                               │
└─────────────────────────────────────────────────────┘
Toast (5 seconds or persistent)

Failed Items Modal:
┌─────────────────────────────────────────────────────┐
│ Failed to Delete (2 items)                      [×] │
├─────────────────────────────────────────────────────┤
│ ⚠️ Web Scraper                                      │
│    Error: Agent is currently in use in 3 canvases  │
│    [Retry] [Skip]                                   │
│                                                     │
│ ⚠️ Content Writer                                   │
│    Error: Permission denied                         │
│    [Retry] [Skip]                                   │
│                                                     │
│ [Retry All] [Close]                                 │
└─────────────────────────────────────────────────────┘`

---

### Error Handling**

`Validation Errors (before action):

Mixed Selection (can't bulk act):
└─ "Cannot delete agents and crews together. Please select only one type."
└─ Disable action buttons

Permission Error:
└─ "You don't have permission to delete 2 of the selected items."
└─ Option: "Delete 3 allowed items?" or "Cancel"

Dependency Error:
└─ "2 selected agents are in use in canvas nodes. Delete anyway?"
└─ Show warning, require confirmation

Partial Errors (during action):

Some Failed:
└─ Show progress: "Deleted 3 of 5. 2 failed."
└─ List failures with reasons
└─ Option: [Retry Failed] [Ignore]

Network Error:
└─ "Connection lost during bulk delete"
└─ Show: "Deleted 2 of 5 before connection lost"
└─ Option: [Retry Remaining] [Cancel]

Server Error:
└─ "Server error during bulk action"
└─ Show: Progress before error
└─ Option: [Retry] [Cancel]`

---

### Undo Bulk Actions**

`Pattern: Show undo toast for reversible actions

Delete with Undo:
┌─────────────────────────────────────────────────────┐
│ ✓ Deleted 5 agents                              [×] │
│                                         [Undo]      │
└─────────────────────────────────────────────────────┘

Duration: 5 seconds (auto-dismiss)
Action: Click [Undo] → Restore deleted items, cancel API if not completed

Move with Undo:
┌─────────────────────────────────────────────────────┐
│ ✓ Moved 3 agents to Design workspace            [×] │
│                                         [Undo]      │
└─────────────────────────────────────────────────────┘

NOT Undo-able:
└─ Export (no server changes)
└─ Re-index (processing already started)`