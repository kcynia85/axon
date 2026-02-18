###  Breakpoints**

`Breakpoints (Tailwind defaults):
├─ Mobile (sm): < 640px
├─ Tablet (md): 640px - 1023px
├─ Desktop (lg): 1024px - 1279px
└─ Large Desktop (xl): ≥ 1280px

Axon Breakpoints:
├─ Mobile: < 768px
├─ Tablet: 768px - 1279px
└─ Desktop: ≥ 1280px

Design Priority:
├─ Primary: Desktop (≥ 1280px)
├─ Secondary: Tablet (768-1279px)
└─ Future (v1.1): Mobile (< 768px)`

---

###  Desktop (≥ 1280px) - Full Layout**

`Layout:
├─ Primary Nav: Full horizontal bar (all items visible)
├─ Sidebars: Full width (256px, 320px, 384px depending on context)
├─ Content: Flex, fills remaining space
├─ Tables: Full width, all columns visible
├─ Modals: Centered, max-width 600-800px
└─ Canvas: 3-panel layout (Left 320px + Center flex + Right 384px)

No compromises - this is the designed experience.`

---

### Tablet (768px - 1279px)**

`Layout Adjustments:

Primary Navigation:
├─ Logo: Visible
├─ Main Links: Visible (Home, Projects, Spaces, Workspaces, Resources)
├─ Right Section: Compressed
│  ├─ Apps: Icon only (no text)
│  ├─ Docs: Icon only
│  ├─ Inbox: Icon only (with badge)
│  ├─ Settings: Icon only
│  └─ Profile: Avatar only
└─ If still too cramped: Collapse to hamburger menu

Sidebars (Resources, Settings):
├─ Width: Reduce to 200px (from 256px)
├─ Text: Truncate long labels with ellipsis
└─ Icons: Keep visible

Canvas Layout:
├─ Left Sidebar: Collapsible (toggle button)
│  └─ Default: Closed (only icon bar visible)
├─ Canvas: Flex (takes available space)
├─ Right Inspector: Reduce to 320px (from 384px)
└─ Option: Collapse Left to give more canvas space

Tables:
├─ Hide: Non-essential columns (e.g., "Created Date" if "Updated Date" shown)
├─ Responsive: Horizontal scroll if too wide
└─ Alternative: Switch to card view (optional)

Modals:
├─ Max Width: 90vw (was fixed 600-800px)
└─ Padding: Reduce to 16px (was 24px)

Forms:
├─ Two-column layouts: Stack to single column
└─ Example: Agent Edit wizard - Cost Estimator below form (not sidebar)`

---

### Mobile (< 768px) - MVP Strategy**

`Strategy: Limited Support in MVP

Supported:
├─ View-only: Lists, Detail pages, Side Peeks
├─ Navigation: Bottom tab bar
└─ Forms: Basic forms work (stacked layout)

Not Supported (show message):
├─ Canvas: "Canvas editing requires desktop. Please use a larger screen."
├─ Complex Forms: Agent/Crew edit (redirect to desktop)
└─ Settings: LLM configuration (redirect to desktop)

Future (v1.1): Full mobile support`

---

### Mobile Layout (< 768px) - Future**

`When implemented in v1.1:

Primary Navigation:
├─ Top Bar: Minimized
│  ├─ Logo: Small or hidden
│  ├─ Hamburger Menu: Left
│  └─ Profile: Right
└─ Bottom Tab Bar:
   ├─ Home
   ├─ Projects
   ├─ Spaces
   ├─ Inbox
   └─ More (opens menu)

Hamburger Menu:
├─ Overlay: Full-screen drawer from left
├─ Content:
│  ├─ Workspaces section (expandable)
│  ├─ Resources section (expandable)
│  ├─ Settings
│  └─ Apps
└─ Close: Tap outside or X button

Lists:
├─ View: Single column cards (no grid)
├─ Cards: Full width, stacked
└─ Infinite scroll: Same as desktop

Detail Pages:
├─ Tabs: Horizontal scrollable
├─ Content: Single column
└─ Actions: Sticky bottom bar

Side Peeks:
├─ Display: Full-screen modal (not side panel)
├─ Header: Sticky with back button
└─ Content: Scrollable

Forms:
├─ Layout: Single column (all fields stacked)
├─ Inputs: Full width
├─ Buttons: Full width (easier to tap)
└─ Wizard: Linear steps (can't see all at once)

Modals:
├─ Display: Full-screen on mobile (not centered overlay)
└─ Close: Back button or swipe down

Tables:
├─ Switch: To card view automatically
└─ Each row becomes a card

Canvas (v1.1):
├─ Left Sidebar: Bottom sheet (swipe up to open)
├─ Canvas: Touch gestures
│  ├─ Pan: One finger drag
│  ├─ Zoom: Pinch
│  └─ Select: Tap node
├─ Right Inspector: Bottom sheet (swipe up)
└─ Actions: Floating action button (bottom-right)

Filters:
├─ Display: Bottom sheet (swipe up)
└─ Apply: Button at bottom (not instant)

Search:
├─ Expand: Full-screen overlay when focused
└─ Suggestions: Below input`

---

### Touch Interactions (Mobile)**

`Tap Targets:
├─ Minimum: 44x44px (Apple guideline)
├─ Preferred: 48x48px (Material Design)
├─ Spacing: 8px between targets

Gestures:
├─ Tap: Select/open
├─ Long Press: Context menu (instead of right-click)
├─ Swipe Right: Go back (in modals/details)
├─ Swipe Left: No action (or delete in lists, future)
├─ Pull to Refresh: Reload list (future)
└─ Pinch: Zoom (canvas only)

Feedback:
├─ Tap: Subtle scale animation (95%)
├─ Long Press: Haptic feedback (if supported)
└─ Swipe: Follow finger with animation`

---

### Typography Scaling**

`Desktop (≥ 1280px):
├─ Body: 16px
├─ Headings: 24px, 20px, 18px
└─ Small: 14px

Tablet (768-1279px):
├─ Body: 15px (slightly smaller)
├─ Headings: 22px, 18px, 16px
└─ Small: 13px

Mobile (< 768px):
├─ Body: 16px (readable on small screen)
├─ Headings: 20px, 18px, 16px
└─ Small: 14px

Line Height:
├─ Body: 1.5
└─ Headings: 1.2`

---

### Component Responsive Behavior**

`Buttons:
Desktop: Inline (side-by-side)
Tablet: Inline (if space), otherwise stack
Mobile: Full width, stacked

Cards:
Desktop: Grid (3-4 columns)
Tablet: Grid (2 columns)
Mobile: Single column

Forms:
Desktop: 2 columns (where applicable)
Tablet: 1 column
Mobile: 1 column (always)

Sidebars:
Desktop: Always visible, 256px
Tablet: Collapsible, 200px
Mobile: Drawer overlay (full-screen)

Tables:
Desktop: Full table
Tablet: Horizontal scroll or hide columns
Mobile: Card view (no table)

Images:
Desktop: Original size (up to max-width)
Tablet: Scale to fit container
Mobile: Full width (responsive)`