### **J.1) Pagination Specifications**

`Strategy: Infinite Scroll (MVP)
└─ Reason: Modern UX, less clicks, works well mobile
└─ Alternative: Numbered pages (v1.1 if users request)

Page Size:
├─ Default: 20 items per page
├─ Canvas Components Sidebar: 50 items per section
└─ Reason: Balance between performance and scroll distance

Trigger:
└─ When user scrolls to 80% of current list
└─ Load next 20 items automatically

Loading Indicator:
└─ Position: Bottom of list
└─ Display: Spinner + "Loading more..."
└─ Duration: Until items loaded

End of List:
└─ Message: "You've reached the end"
└─ Style: Gray text, centered, 32px padding`

---

### **J.2) Total Count Display**

`Location: Above list, next to search/filters

Display:
┌─────────────────────────────────────────┐
│ 🔍 Search...  [Filters] [Sort]          │
│                                         │
│ Showing 20 of 156 agents                │
└─────────────────────────────────────────┘

Variants:

All items loaded (less than page size):
└─ "15 agents"

Some items loaded (infinite scroll):
└─ "Showing 20 of 156 agents"

After filter/search:
└─ "Showing 3 of 156 agents"

Loading more:
└─ "Showing 20 of 156 agents" (doesn't change until loaded)`

---

### **J.3) Scroll Position Behavior**

`On Filter Change:
├─ Reset to top: Yes
├─ Reason: User expects new results at top
└─ Animation: Smooth scroll to top (200ms)

On Search:
├─ Reset to top: Yes
└─ Same reason as filter

On Sort Change:
├─ Reset to top: No
├─ Reason: User is rearranging existing results
└─ Maintain: Current scroll position

On Navigation Back:
├─ Restore: Previous scroll position
├─ Reason: User expects to return to where they were
└─ Implementation: Session storage saves scroll position`

---

### **J.4) Performance Optimization**

`Virtual Scrolling:
├─ When: Lists >100 items
├─ Implementation: Only render visible items + buffer
├─ Buffer: 10 items above/below viewport
└─ Libraries: react-window or react-virtual

Skeleton Loading:
├─ First load: Show 5 skeleton cards
├─ Subsequent loads: Show spinner at bottom
└─ Reason: Less jarring than empty space

Debounced Scroll:
├─ Check scroll position every 100ms (not every pixel)
└─ Reason: Reduce performance impact`

---

### **J.5) Infinite Scroll Alternative (v1.1)**

`Numbered Pagination (if users request):

Display:
┌─────────────────────────────────────────┐
│                                         │
│ [Content...]                            │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ [← Previous] 1 2 3 ... 8 [Next →]  │ │
│ │ Page 2 of 8 (156 total items)      │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘

Behavior:
├─ Click number → Load that page
├─ Click Next/Previous → Load adjacent page
├─ Scroll to top on page change
└─ URL: ?page=2

Benefits:
├─ User can jump to specific page
├─ Easier to find specific item ("it was on page 3")
└─ Better for very large lists (>500 items)

Drawbacks:
├─ More clicks to browse
├─ Less mobile-friendly
└─ Harder to implement with filters (page numbers change)`