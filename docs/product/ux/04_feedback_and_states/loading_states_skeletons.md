### Skeleton Screens (Preferred for Lists)**

`Pattern:
├─ Show skeleton immediately (no spinner)
├─ Skeleton matches actual layout
├─ Animated shimmer effect (left to right)
├─ Duration: Until data loads (no timeout)

Projects List Skeleton:
┌─────────────────────────────────────────┐
│ ░░░░░░░░░░░░░░  [+ New Project]         │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ ░░░░░░░░░░░  ░░░░                   │ │
│ │ ░░░░░░░░░░░░░░░░░░░░░░              │ │
│ │ ░░░  ░░░  ░░░░                      │ │
│ └─────────────────────────────────────┘ │
│ ┌─────────────────────────────────────┐ │
│ │ ░░░░░░░░░░░  ░░░░                   │ │
│ │ ░░░░░░░░░░░░░░░░░░░░░░              │ │
│ │ ░░░  ░░░  ░░░░                      │ │
│ └─────────────────────────────────────┘ │
│ ┌─────────────────────────────────────┐ │
│ │ ░░░░░░░░░░░  ░░░░                   │ │
│ │ ░░░░░░░░░░░░░░░░░░░░░░              │ │
│ │ ░░░  ░░░  ░░░░                      │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘

Elements:
- Show 3-5 skeleton cards
- Match card dimensions exactly
- Shimmer: Gradient animation (1.5s duration, infinite)
- Background: #F3F4F6
- Shimmer: Linear gradient (lighter gray moving)`

---

### Spinner (for Quick Actions)**

`Use When:
- Button actions (submit, save, delete)
- Inline updates (like, favorite, toggle)
- Small data fetches (<1 second expected)

Button Loading:
├─ Replace button text with spinner
├─ Disable button (pointer-events: none)
├─ Spinner: 16px, white (if button is colored)
└─ Keep button width (don't collapse)

Example:
[Save Agent] → [○ Saving...] (spinner + text)

Inline Spinner:
├─ Size: 20px
├─ Position: Replace content temporarily
└─ Color: Match context (blue for primary, gray for secondary)

Example:
Fetching more results... ○`

---

### Progress Bars (for Known Duration)**

`File Upload:
┌─────────────────────────────────────────┐
│ Uploading "document.pdf"                │
│ [▓▓▓▓▓▓▓▓░░░░░░░░] 45%                  │
│ 2.3 MB / 5.1 MB · 3s remaining          │
└─────────────────────────────────────────┘

Multiple Files:
┌─────────────────────────────────────────┐
│ Uploading 3 files...                    │
│ ✓ document1.pdf                         │
│ [▓▓▓▓▓▓▓▓░░░░░░░░] document2.pdf (45%)  │
│ ⏳ document3.pdf (pending)              │
└─────────────────────────────────────────┘

Node Execution (Canvas):
[▓▓▓▓▓▓▓▓▓▓░░░░░░] 65%
⚙️ Analyzing data...
- Elapsed: 1m 30s
- Remaining: ~45s

Bulk Delete:
Deleting 5 agents...
[▓▓▓▓▓▓▓▓░░░░░░░░] 3/5 complete`

---

### Progressive Loading (Canvas)**

`Strategy:
1. Load zones first (instant, from cache)
2. Load nodes (batch, 20 at a time)
3. Load edges (after nodes)
4. Fade in nodes as they load

Visual:
├─ Zones: Appear immediately (background colors)
├─ Nodes: Fade in (opacity 0 → 1, 200ms)
├─ Edges: Draw after both nodes visible
└─ Total time: < 2 seconds for 100 nodes

Large Canvas (>100 nodes):
├─ Show loading overlay: "Loading workspace..."
├─ Progress: "Loading 150 nodes... 45/150"
└─ Viewport culling: Only render visible nodes`

---

### Optimistic UI Updates**

`Pattern:
├─ Show success immediately (before API confirms)
├─ Rollback if API fails
├─ Show toast on both success and failure

Examples:

Like/Favorite:
├─ Click: Icon changes immediately (gray → red)
├─ API call: Happens in background
├─ Success: No additional feedback (already updated)
└─ Failure: Revert icon, show toast "Failed to favorite"

Create Item (optimistic):
├─ Click "Create": Add item to list immediately (with "Saving..." badge)
├─ API call: Happens in background
├─ Success: Remove "Saving..." badge, show toast
└─ Failure: Remove item from list, show toast "Failed to create"

Delete Item (NOT optimistic):
├─ Click "Delete": Show confirmation modal
├─ Confirm: Show loading spinner
├─ API call: Wait for response
├─ Success: Remove from list, show toast
└─ Failure: Keep in list, show toast`