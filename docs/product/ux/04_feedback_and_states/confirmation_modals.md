### Destructive Action Confirmations**

### **Delete Project**

`Modal:
├─ Title: "Delete Project?"
├─ Icon: ⚠️ (red)
├─ Warning: "This action cannot be undone."
├─ Dependencies (if any):
│  ├─ "This project contains:"
│  ├─ "• 1 linked Space"
│  ├─ "• 6 Artifacts"
│  └─ "• 3 Key Resources"
│  └─ Note: "All of these will be permanently deleted."
├─ Confirmation Input:
│  └─ "Type the project name to confirm:"
│  └─ Input field (must match exactly, case-sensitive)
├─ Actions:
│  ├─ [Delete Project] button (red, disabled until name typed)
│  └─ [Cancel] button (gray)
└─ Keyboard:
   ├─ Escape → Cancel
   └─ Enter → Delete (only if name typed)`

### **Delete Agent**

`Modal:
├─ Title: "Delete Agent?"
├─ Icon: ⚠️ (red)
├─ Message: "Are you sure you want to delete '{agent_name}'?"
├─ Warning: "This action cannot be undone."
├─ Usage Check (if used):
│  └─ "⚠️ Warning: This agent is currently used in 3 canvas nodes. Deleting it will break those workflows."
├─ Actions:
│  ├─ [Delete Agent] button (red)
│  └─ [Cancel] button (gray, default focus)
└─ No text input required (simple confirmation)`

### **Delete Knowledge Hub**

`Modal:
├─ Title: "Delete Knowledge Hub?"
├─ Icon: ⚠️ (red)
├─ Warning: "This action cannot be undone."
├─ Dependencies:
│  ├─ "This hub contains 12 sources with 1,234 chunks."
│  ├─ "Used by 5 agents:"
│  │  └─ • Customer Interview Agent
│  │  └─ • Market Researcher
│  │  └─ • Product Analyst
│  │  └─ (+ 2 more)
│  └─ Note: "These agents will lose access to this knowledge."
├─ Confirmation Checkbox:
│  └─ ☐ "I understand this will affect 5 agents"
├─ Actions:
│  ├─ [Delete Hub] button (red, disabled until checkbox checked)
│  └─ [Cancel] button (gray)`

### **Delete Multiple Items (Bulk)**

`Modal:
├─ Title: "Delete 5 agents?"
├─ Icon: ⚠️ (red)
├─ Message: "Are you sure you want to delete these 5 agents?"
├─ List (scrollable, max 10 shown):
│  └─ • Customer Interview Agent
│  └─ • Market Researcher
│  └─ • Product Analyst
│  └─ • Web Scraper
│  └─ • Content Writer
├─ Warning: "This action cannot be undone."
├─ Actions:
│  ├─ [Delete 5 Agents] button (red)
│  └─ [Cancel] button (gray)`

---

### Unsaved Changes**

`Trigger: User tries to leave page with unsaved form changes

Modal:
├─ Title: "Unsaved changes"
├─ Icon: ⚠️ (yellow)
├─ Message: "You have unsaved changes. Do you want to save before leaving?"
├─ Actions:
│  ├─ [Save Changes] button (primary, blue)
│  ├─ [Discard Changes] button (secondary, gray)
│  └─ [Cancel] button (tertiary, text only)
└─ Default focus: Save Changes

Keyboard:
├─ Escape → Cancel (stay on page)
├─ Enter → Save Changes`

---

### Overwrite Confirmation**

`Scenario: File with same name already exists

Modal:
├─ Title: "File already exists"
├─ Icon: ⚠️ (yellow)
├─ Message: "A file named 'document.pdf' already exists in this hub."
├─ Question: "Do you want to replace it?"
├─ Warning: "Replacing it will overwrite the existing file and re-index."
├─ Actions:
│  ├─ [Replace] button (primary, yellow)
│  ├─ [Keep Both] button (secondary) → Renames new file to "document (1).pdf"
│  └─ [Cancel] button (tertiary)`

---

### Execution Cancellation**

`Scenario: User clicks "Stop" during node execution

Modal:
├─ Title: "Stop execution?"
├─ Icon: ⏸️
├─ Message: "Are you sure you want to stop this execution?"
├─ Warning: "Progress will be lost and you'll be charged for tokens used so far."
├─ Cost Info: "Tokens used: 3,200 (~$0.08)"
├─ Actions:
│  ├─ [Stop Execution] button (primary, red)
│  └─ [Continue] button (secondary, gray)`

---

###  Irreversible Action (General)**

`Pattern for any high-risk action:

Modal:
├─ Title: "[Action] confirmation"
├─ Icon: ⚠️ (red)
├─ Message: "Are you sure you want to [action]?"
├─ Warning: "This action cannot be undone."
├─ Details: [Context-specific information]
├─ Optional: Checkbox "I understand the consequences"
├─ Actions:
│  ├─ [Confirm Action] button (red, may require checkbox)
│  └─ [Cancel] button (gray, default focus)`