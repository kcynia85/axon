###  Keyboard Navigation**

`Requirements:
├─ All interactive elements accessible via keyboard
├─ Logical tab order (left-to-right, top-to-bottom)
├─ Focus visible at all times
├─ No keyboard traps (can always escape)
└─ Skip links (skip to main content)

Tab Order:
1. Skip to content link (hidden, visible on focus)
2. Primary navigation (top bar)
3. Page header
4. Search/filters
5. Main content
6. Sidebars (if any)
7. Footer

Focus Management:
├─ On modal open: Focus first interactive element
├─ On modal close: Return focus to trigger element
├─ On navigation: Focus page heading (h1)
└─ On error: Focus first error field`

---

### Focus Indicators**

`Specification:
├─ Style: 2px solid outline
├─ Color: Blue (#3B82F6) for primary, currentColor for inherit
├─ Offset: 2px from element
├─ Visible: Always (NEVER outline: none without replacement)
├─ Contrast: 3:1 minimum against background

Examples:

Button:
.button:focus-visible {
  outline: 2px solid #3B82F6;
  outline-offset: 2px;
}

Input:
.input:focus {
  border-color: #3B82F6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

Link:
.link:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}

Focus-Visible vs Focus:
├─ Use :focus-visible for mouse-agnostic focus (preferred)
├─ Falls back to :focus on unsupported browsers
└─ Don't show focus ring on mouse click, only keyboard

NEVER:
.button:focus {
  outline: none; /* NEVER DO THIS without replacement */
}`

---

###  ARIA Labels & Roles**

`Landmarks:
<header role="banner">                  → Primary header
<nav role="navigation">                 → Navigation menus
<main role="main">                      → Main content
<aside role="complementary">            → Sidebars
<footer role="contentinfo">             → Footer

Interactive Elements:

Button (icon only):
<button aria-label="Delete project">
  <TrashIcon />
</button>

Link (icon only):
<a href="/inbox" aria-label="Inbox (3 new items)">
  <BellIcon />
  <span class="badge">3</span>
</a>

Search:
<label for="search" class="sr-only">Search projects</label>
<input 
  id="search"
  type="search"
  placeholder="Search..."
  aria-describedby="search-hint"
/>
<span id="search-hint" class="sr-only">
  Type at least 2 characters to search
</span>

Form with Errors:
<label for="email">Email *</label>
<input 
  id="email"
  type="email"
  aria-required="true"
  aria-invalid="true"
  aria-describedby="email-error"
/>
<span id="email-error" role="alert">
  Please enter a valid email address
</span>

Modal:
<div 
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
  aria-describedby="modal-description"
>
  <h2 id="modal-title">Delete Project?</h2>
  <p id="modal-description">This action cannot be undone.</p>
  ...
</div>

Tabs:
<div role="tablist" aria-label="Project sections">
  <button 
    role="tab"
    aria-selected="true"
    aria-controls="overview-panel"
    id="overview-tab"
  >
    Overview
  </button>
  <button 
    role="tab"
    aria-selected="false"
    aria-controls="artifacts-panel"
    id="artifacts-tab"
  >
    Artifacts
  </button>
</div>
<div 
  role="tabpanel"
  id="overview-panel"
  aria-labelledby="overview-tab"
>
  [Overview content]
</div>

Lists:
<ul role="list" aria-label="Projects">
  <li>Project 1</li>
  <li>Project 2</li>
</ul>

Status/Alerts:
<div role="status" aria-live="polite">
  Project created successfully
</div>

<div role="alert" aria-live="assertive">
  Error: Failed to save project
</div>

Loading:
<div role="status" aria-live="polite" aria-busy="true">
  Loading projects...
</div>`

---

###  Screen Reader Announcements**

`Live Regions:
├─ aria-live="polite": Announces when convenient (success messages)
├─ aria-live="assertive": Announces immediately (errors)
└─ role="status": Equivalent to aria-live="polite"
   role="alert": Equivalent to aria-live="assertive"

Announce on Actions:

Create Success:
<div role="status">Project created successfully</div>

Delete Success:
<div role="status">Project deleted</div>

Error:
<div role="alert">Failed to save project. Please try again.</div>

Loading:
<div role="status" aria-busy="true">
  Loading projects...
</div>
→ Then: <div role="status">Loaded 15 projects</div>

Filter Applied:
<div role="status">
  Filtered to 8 projects matching "customer"
</div>

Search Results:
<div role="status">
  Showing 12 results for "interview"
</div>

Node Execution:
<div role="status">Starting execution...</div>
→ <div role="status">Execution completed successfully</div>

Navigation:
<div role="status">Navigated to Projects page</div>

Visually Hidden Helper Text:
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

Example Usage:
<button>
  <TrashIcon />
  <span class="sr-only">Delete project</span>
</button>`

---

### **O.5) Color Contrast**

`WCAG 2.1 AA Requirements:

Text:
├─ Normal text (< 18px): 4.5:1 minimum
├─ Large text (≥ 18px or ≥ 14px bold): 3:1 minimum
└─ Incidental text (logos, disabled): No requirement

UI Components:
├─ Interactive elements: 3:1 minimum
│  └─ Buttons, inputs, focus indicators
└─ Graphics: 3:1 minimum
   └─ Icons, charts, infographics

Axon Colors (check these):

Primary Text:
├─ Black (#000000) on White (#FFFFFF): 21:1 ✓
├─ Dark Gray (#1F2937) on White: 15.7:1 ✓
└─ Medium Gray (#6B7280) on White: 4.6:1 ✓

Links:
├─ Blue (#3B82F6) on White: 4.5:1 ✓
└─ Hover: Darker Blue (#2563EB): 7.1:1 ✓

Success:
├─ Green (#10B981) on White: 2.9:1 ✗ (use darker)
└─ Dark Green (#059669): 4.5:1 ✓

Error:
├─ Red (#EF4444) on White: 3.9:1 ✗ (use darker)
└─ Dark Red (#DC2626): 5.4:1 ✓

Warning:
├─ Orange (#F59E0B) on White: 2.1:1 ✗ (needs dark background)
└─ Orange on Dark (#78350F): 4.5:1 ✓

Disabled:
├─ Light Gray (#D1D5DB) on White: 1.6:1
└─ OK (disabled states have no contrast requirement)

Check All:
├─ Tool: Use contrast checker (WebAIM, Stark)
├─ Test: In design before implementation
└─ Fix: Darken colors or add background if needed`

---

### **O.6) Alternative Text (Images)**

`Requirements:
├─ All images must have alt attribute
├─ Decorative images: alt="" (empty, not absent)
├─ Informative images: Describe content
└─ Complex images: Brief alt + long description

Examples:

User Avatar:
<img src="avatar.jpg" alt="John Doe's avatar" />

Icon (decorative, with text):
<button>
  <TrashIcon alt="" />
  Delete
</button>

Icon (functional, no text):
<button>
  <TrashIcon alt="Delete project" />
</button>

Logo:
<img src="logo.svg" alt="Axon Platform" />

Status Icon:
<img src="check.svg" alt="Success" />
<img src="error.svg" alt="Error" />

Chart (complex):
<img 
  src="chart.png" 
  alt="Bar chart showing project completion rates"
  aria-describedby="chart-description"
/>
<div id="chart-description" class="sr-only">
  Detailed description: Projects completed in Q1: 45%, Q2: 67%, Q3: 82%, Q4: 91%
</div>

Canvas Node (if rendered as image):
<div role="img" aria-label="Agent node: Customer Interview Agent, status: Done">
  [Visual node representation]
</div>`

---

### **O.7) Form Accessibility**

`Labels:
├─ All inputs must have <label>
├─ Associate: for attribute matches input id
├─ Visible: Labels should be visible (not just placeholder)
└─ Required: Indicate with * and/or "required" text

<label for="project-name">Project Name *</label>
<input 
  id="project-name"
  type="text"
  required
  aria-required="true"
/>

Hints:
<label for="email">Email</label>
<input 
  id="email"
  type="email"
  aria-describedby="email-hint"
/>
<span id="email-hint" class="text-sm text-gray-600">
  We'll never share your email
</span>

Errors:
<label for="email">Email</label>
<input 
  id="email"
  type="email"
  aria-invalid="true"
  aria-describedby="email-error"
/>
<span id="email-error" role="alert" class="text-red-600">
  Please enter a valid email address
</span>

Fieldsets (groups):
<fieldset>
  <legend>Select workspaces</legend>
  <label>
    <input type="checkbox" value="discovery" />
    Discovery
  </label>
  <label>
    <input type="checkbox" value="design" />
    Design
  </label>
</fieldset>

Required Indicator:
<label>
  Email 
  <span aria-label="required" class="text-red-600">*</span>
</label>`

---

### **O.8) Table Accessibility**

`Structure:
├─ Use semantic <table>, <thead>, <tbody>, <th>, <td>
├─ Header cells: <th scope="col"> or <th scope="row">
├─ Caption: <caption> for table title
└─ Summary: aria-describedby for complex tables

Example:
<table>
  <caption>Projects List</caption>
  <thead>
    <tr>
      <th scope="col">Name</th>
      <th scope="col">Status</th>
      <th scope="col">Updated</th>
      <th scope="col">Actions</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">Product Redesign</th>
      <td>In Progress</td>
      <td>2 hours ago</td>
      <td>
        <button aria-label="Edit Product Redesign">Edit</button>
        <button aria-label="Delete Product Redesign">Delete</button>
      </td>
    </tr>
  </tbody>
</table>

Sortable Headers:
<th scope="col">
  <button 
    aria-label="Sort by name" 
    aria-sort="ascending"
  >
    Name ↑
  </button>
</th>

Screen Reader: "Name column header, sorted ascending, button"`

---

### **O.9) Skip Links**

`Purpose: Allow keyboard users to skip navigation

Implementation:
<a href="#main-content" class="skip-link">
  Skip to main content
</a>

<!-- Page content -->
<main id="main-content" tabindex="-1">
  ...
</main>

CSS:
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: #000;
  color: #fff;
  padding: 8px;
  text-decoration: none;
  z-index: 100;
}

.skip-link:focus {
  top: 0;
}

Behavior:
├─ Hidden by default (off-screen)
├─ Visible on focus (Tab key)
├─ Clicking: Moves focus to main content
└─ tabindex="-1" on target: Makes non-interactive element focusable`

---

### Accessibility Testing Checklist**

`Manual Tests:
├─ ☐ Navigate entire app with keyboard only (no mouse)
├─ ☐ Check all focus indicators are visible
├─ ☐ Use screen reader (NVDA, JAWS, VoiceOver) on key flows
├─ ☐ Test with browser zoom at 200%
├─ ☐ Test with high contrast mode (Windows)
├─ ☐ Check color contrast with tool (WebAIM, Stark)
└─ ☐ Verify skip links work

Automated Tools:
├─ axe DevTools (browser extension)
├─ Lighthouse (Chrome DevTools)
├─ WAVE (browser extension)
└─ Pa11y (CI integration)

Key Flows to Test:
├─ Sign in
├─ Create project
├─ Build canvas workflow
├─ Upload knowledge source
├─ Execute node
├─ Review artifacts
└─ Navigate with keyboard only

Screen Reader Test Script:
1. Open project list with screen reader
2. Navigate list with arrow keys
3. Hear: "Project name, status, updated date"
4. Press Enter to open project
5. Hear: "Project detail page, heading Project Name"
6. Navigate tabs with arrow keys
7. Hear: "Overview tab, selected" etc.
8. Test forms: Hear labels, hints, errors
9. Test modals: Hear title, description, buttons
10. Test notifications: Hear announcements

Pass Criteria:
├─ All interactive elements reachable via keyboard
├─ All actions announced by screen reader
├─ All images have alt text
├─ All forms have labels
├─ All errors announced
├─ Color contrast passes WCAG AA
└─ No WCAG A/AA violations in automated tools`