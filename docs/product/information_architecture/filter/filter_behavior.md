### **H.1) Filter Specifications**

`Application Timing: Instant
└─ No "Apply" button
└─ Filters activate immediately on selection

Persistence:
├─ URL: Yes (?workspace=discovery&status=in_progress)
├─ Session: Yes (stays active when navigating back)
└─ Local Storage: No (MVP)

Filter Logic:
├─ Between Different Types: AND
│  └─ workspace=discovery AND status=in_progress
└─ Within Same Type: OR
   └─ workspace=discovery OR workspace=design

URL Format:
├─ Single value: ?workspace=discovery
├─ Multiple values: ?workspace=discovery,design
└─ Multiple types: ?workspace=discovery&status=in_progress&search=customer`

---

### **H.2) Filter UI Components**

### **Multi-Select Dropdown**

`Workspaces Filter:
┌─────────────────────────────────────────┐
│ Workspace: All ▾                        │
└─────────────────────────────────────────┘

Expanded:
┌─────────────────────────────────────────┐
│ Workspace: Discovery, Design ▾          │
├─────────────────────────────────────────┤
│ ☑ Discovery                             │
│ ☑ Design                                │
│ ☐ Product Management                    │
│ ☐ Delivery                              │
│ ☐ Growth & Market                       │
├─────────────────────────────────────────┤
│ [Clear Selection]                       │
└─────────────────────────────────────────┘

Selected State:
└─ Shows: "Discovery, Design" (comma-separated)
└─ If >2 selected: "3 workspaces" (count)`

### **Checkbox Group**

`Status Filter:
┌─────────────────────────────────────────┐
│ Status:                                 │
│ ☑ In Progress                           │
│ ☑ Completed                             │
│ ☐ Idea                                  │
└─────────────────────────────────────────┘

Behavior:
└─ Check/uncheck applies filter instantly`

### **Range Slider**

`Cost Filter:
┌─────────────────────────────────────────┐
│ Cost per Action:                        │
│ [●────────────●]                        │
│ $0.00         $5.00                     │
│ Current: $0.50 - $2.00                  │
└─────────────────────────────────────────┘

Behavior:
└─ Drag handles to adjust range
└─ Applies filter on mouseup (not during drag)`

### **Tag Search**

`Keywords Filter:
┌─────────────────────────────────────────┐
│ Keywords: [Search tags...]              │
│                                         │
│ Suggestions:                            │
│ • research                              │
│ • finance                               │
│ • b2b                                   │
└─────────────────────────────────────────┘

Selected:
┌─────────────────────────────────────────┐
│ Keywords:                               │
│ [× research] [× finance]                │
└─────────────────────────────────────────┘

Behavior:
└─ Type to filter tags
└─ Click tag to add
└─ Click × to remove`

---

### **H.3) Active Filters Display**

`Location: Above list, below search

Display:
┌─────────────────────────────────────────┐
│ Active Filters:                         │
│ [× Discovery] [× In Progress] [Clear All]│
└─────────────────────────────────────────┘

Badges:
├─ Style: Filled, blue background
├─ Icon: × (click to remove this filter)
└─ Text: Filter name

Clear All:
├─ Position: Right side
├─ Style: Text button (not badge)
└─ Action: Removes ALL filters at once

Empty State:
└─ If no filters: Don't show "Active Filters:" section`

---

### **H.4) Filter Combinations**

`Examples:

Single Filter:
URL: ?workspace=discovery
Display: [× Discovery] [Clear All]
Results: All items in Discovery workspace

Multiple Same-Type (OR logic):
URL: ?workspace=discovery,design
Display: [× Discovery] [× Design] [Clear All]
Results: Items in Discovery OR Design

Multiple Different-Type (AND logic):
URL: ?workspace=discovery&status=in_progress
Display: [× Discovery] [× In Progress] [Clear All]
Results: Items in Discovery AND status is In Progress

Complex:
URL: ?workspace=discovery,design&status=in_progress&cost=0.5,2.0
Display: [× Discovery] [× Design] [× In Progress] [× Cost: $0.50-$2.00] [Clear All]
Results: (Discovery OR Design) AND In Progress AND (cost between 0.5 and 2.0)`

---

### **H.5) Filter Panel Layout**

`Collapsed (default):
┌─────────────────────────────────────────┐
│ 🔍 Search...     [Filters ▾] [Sort ▾]  │
└─────────────────────────────────────────┘

Expanded:
┌─────────────────────────────────────────┐
│ 🔍 Search...     [Filters ▴] [Sort ▾]  │
├─────────────────────────────────────────┤
│ ┌─────────────────────────────────────┐ │
│ │ Workspace: All ▾                    │ │
│ ├─────────────────────────────────────┤ │
│ │ Status:                             │ │
│ │ ☐ In Progress                       │ │
│ │ ☐ Completed                         │ │
│ │ ☐ Idea                              │ │
│ ├─────────────────────────────────────┤ │
│ │ Keywords: [Search tags...]          │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘

Mobile:
└─ Filters open as bottom sheet (full-screen overlay)`
