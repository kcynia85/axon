### Global Shortcuts (Work Everywhere)**

`Navigation:
├─ Cmd/Ctrl + K: Global search (v1.1)
│  └─ Opens: Command palette / global search modal
├─ Cmd/Ctrl + /: Show keyboard shortcuts help
│  └─ Opens: Modal with all shortcuts
├─ Escape: Close modal / cancel action / deselect
│  └─ Context-aware: Closes whatever is open
└─ Cmd/Ctrl + ,: Open Settings (common pattern)
   └─ Opens: /settings page

Actions:
├─ Cmd/Ctrl + N: New (context-aware)
│  ├─ Projects List → New Project
│  ├─ Agents List → New Agent
│  └─ Knowledge Hubs → New Hub
├─ Cmd/Ctrl + S: Save
│  └─ In forms: Save/submit
└─ Cmd/Ctrl + Enter: Submit form (alternative to Save)
   └─ Works in: Modals, forms, textareas`

---

### List View Shortcuts**

`Navigation:
├─ ↑ / ↓: Navigate between items
│  └─ Highlights item (doesn't select)
├─ Enter: Open highlighted item
│  └─ Opens: Detail page or side peek
├─ Cmd/Ctrl + Click: Open in new tab
└─ /: Focus search input
   └─ Start typing immediately

Selection:
├─ Shift + Click: Select range
│  └─ From last selected to clicked item
├─ Cmd/Ctrl + A: Select all
└─ Escape: Deselect all

Actions (when items selected):
├─ Delete / Backspace: Delete selected (with confirmation)
├─ Cmd/Ctrl + D: Duplicate selected
└─ Cmd/Ctrl + C: Copy selected (for paste elsewhere)`

---

### Canvas Shortcuts**

`Navigation:
├─ Space + Drag: Pan canvas
│  └─ Hold space, drag with mouse to move viewport
├─ Cmd/Ctrl + 0: Fit to screen
│  └─ Zoom and pan to show all nodes
├─ Cmd/Ctrl + +: Zoom in
├─ Cmd/Ctrl + -: Zoom out
└─ Cmd/Ctrl + Scroll: Zoom (mouse wheel)

Selection:
├─ Click: Select node
├─ Shift + Click: Add to selection
├─ Cmd/Ctrl + Click: Add/remove from selection
├─ Cmd/Ctrl + A: Select all nodes
├─ Escape: Deselect all
└─ Click + Drag: Selection box (multiple select)

Node Actions:
├─ Delete / Backspace: Delete selected node(s)
│  └─ With confirmation if multiple
├─ Cmd/Ctrl + D: Duplicate selected node(s)
│  └─ Places copy offset by 20px down-right
├─ Cmd/Ctrl + C: Copy selected node(s)
├─ Cmd/Ctrl + V: Paste copied node(s)
├─ Cmd/Ctrl + X: Cut selected node(s)
└─ Cmd/Ctrl + Z: Undo
   └─ Cmd/Ctrl + Shift + Z: Redo

Node Manipulation:
├─ Arrow Keys: Move selected node(s) by 10px
│  └─ Shift + Arrow: Move by 1px (fine adjustment)
└─ Hold Alt: Duplicate while dragging
   └─ Drag node while holding Alt = creates copy`

---

### Form Shortcuts**

`Navigation:
├─ Tab: Next field
├─ Shift + Tab: Previous field
├─ Enter: Submit form (if focus is on single-line input)
│  └─ Does NOT submit if in textarea (inserts line break)
└─ Escape: Cancel / close modal

Actions:
├─ Cmd/Ctrl + Enter: Submit form (from any field)
│  └─ Works even in textarea
├─ Cmd/Ctrl + S: Save form
└─ Cmd/Ctrl + Z: Undo (in text fields)
   └─ Cmd/Ctrl + Shift + Z: Redo

Text Editing (standard):
├─ Cmd/Ctrl + A: Select all text
├─ Cmd/Ctrl + C: Copy
├─ Cmd/Ctrl + V: Paste
├─ Cmd/Ctrl + X: Cut
└─ Cmd/Ctrl + B/I/U: Bold/Italic/Underline (in rich text)`

---

### Modal Shortcuts**

`Actions:
├─ Escape: Close modal
│  └─ With unsaved changes: Show confirmation
├─ Cmd/Ctrl + Enter: Submit (primary action)
│  └─ Example: "Save Agent", "Create Project"
└─ Tab: Navigate between buttons in footer
   └─ Enter: Activate focused button

Multi-Step Modals:
├─ Right Arrow: Next step (if enabled)
├─ Left Arrow: Previous step
└─ Cmd/Ctrl + Enter: Submit (on last step)`

---

### Table Shortcuts**

`Navigation:
├─ ↑ / ↓: Navigate rows
├─ Enter: Open row (detail page)
├─ Space: Select/deselect row (if checkboxes)
└─ Shift + ↑/↓: Extend selection

Sorting:
├─ Click Header: Sort by column
└─ Shift + Click Header: Secondary sort

Actions:
├─ Cmd/Ctrl + A: Select all rows
└─ Delete: Delete selected rows (with confirmation)`

---

### Context-Specific Shortcuts**

### **Projects List**

`├─ Cmd/Ctrl + N: New Project
└─ /: Focus search`

### **Agents List**

`├─ Cmd/Ctrl + N: New Agent
└─ /: Focus search`

### **Knowledge Hub Detail**

`├─ Cmd/Ctrl + U: Upload source
└─ /: Focus source search`

### **Side Peek (Agent/Crew/etc. Detail)**

`├─ Escape: Close side peek
├─ Cmd/Ctrl + E: Edit (opens edit page)
├─ Cmd/Ctrl + D: Duplicate
└─ Delete: Delete item (with confirmation)`

---

### Keyboard Shortcuts Help Modal**

`Trigger: Cmd/Ctrl + / or ? key

Modal Content:
┌─────────────────────────────────────────────────────┐
│ Keyboard Shortcuts                              [×] │
├─────────────────────────────────────────────────────┤
│ Global                                              │
│ ├─ Cmd + K          Global search                   │
│ ├─ Cmd + N          New (context-aware)             │
│ ├─ Cmd + S          Save                            │
│ ├─ Escape           Close / Cancel                  │
│ └─ Cmd + /          Show this help                  │
│                                                     │
│ Canvas                                              │
│ ├─ Space + Drag     Pan canvas                      │
│ ├─ Cmd + 0          Fit to screen                   │
│ ├─ Delete           Delete selected                 │
│ ├─ Cmd + D          Duplicate                       │
│ └─ Cmd + Z          Undo                            │
│                                                     │
│ Lists                                               │
│ ├─ ↑ ↓             Navigate items                   │
│ ├─ Enter           Open item                        │
│ └─ /               Focus search                      │
│                                                     │
│ [Show All Shortcuts →]                             │
└─────────────────────────────────────────────────────┘

Sections:
├─ Global
├─ Canvas
├─ Lists
├─ Forms
├─ Modals
└─ Context-specific (expands based on current page)

Design:
├─ Two columns: Shortcut | Description
├─ Grouped by context
├─ Searchable (type to filter)
└─ Platform-aware: Shows "Cmd" on Mac, "Ctrl" on Windows`

---

### Implementation Notes**

`Detection:
├─ Library: Use hotkeys-js or similar
├─ Platform: Detect Mac vs Windows/Linux
│  └─ Mac: Use "Cmd" (⌘)
│  └─ Windows/Linux: Use "Ctrl"
└─ Prevent Default: Prevent browser shortcuts where needed

Conflicts:
├─ Avoid: Browser reserved shortcuts
│  ├─ Cmd/Ctrl + T (new tab)
│  ├─ Cmd/Ctrl + W (close tab)
│  └─ Cmd/Ctrl + R (refresh)
└─ Context-aware: Shortcuts work only when appropriate
   └─ Example: Canvas shortcuts only active in Canvas

Accessibility:
├─ Focus Visible: Always show focus indicators
├─ Announce: Screen reader announces shortcut actions
└─ Disable: Allow users to disable shortcuts (v1.1)

Visual Hints:
├─ Tooltips: Show keyboard shortcut in tooltip
│  └─ Example: "New Project (Cmd+N)"
└─ Button Labels: Show hint next to button (optional)
   └─ Example: [Save] Cmd+Enter`

---