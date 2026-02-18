### Validation Timing**

`Pattern: Progressive Validation

First Interaction:
├─ On Focus: No validation
├─ On Change (while focused): No validation
└─ On Blur: Validate field

After First Validation:
├─ On Change: Real-time validation (immediate feedback)
└─ On Blur: Re-validate

On Submit:
├─ Validate: All fields
├─ If errors: Prevent submit, show error summary, focus first error
└─ If valid: Submit form

Example Flow:
1. User focuses "Email" field
2. User types "john" (no validation yet)
3. User tabs away (blur) → Validation: "Please enter a valid email"
4. User focuses field again, types "john@" → Real-time: Still invalid
5. User types "john@example.com" → Real-time: ✓ Valid`

---

###  Required Field Markers**

`Label Display:
├─ Asterisk: After label text (red color)
├─ Text: "(required)" in label (optional, for screen readers)
└─ Placeholder: Should NOT indicate required (bad UX)

Examples:

Standard:
Name *
[Input field]

With hint:
Name * (required)
[Input field]

Screen Reader:
<label>
  Name <span aria-label="required">*</span>
</label>

NOT this:
Name
[Enter name (required)] ← Bad: Placeholder should show example, not requirement`

---

### Error Message Display**

`Position: Below field (8px margin-top)
Color: Red (#DC2626)
Icon: ⚠️ (before message)
Font Size: 14px (slightly smaller than input text)
Line Height: 1.5

Structure:
┌─────────────────────────────────────────┐
│ Email *                                 │
│ [john@example                       ]   │ ← Red border
│ ⚠️ Please enter a valid email address   │ ← Error message
└─────────────────────────────────────────┘

Multiple Errors (one field):
└─ Show only first error
└─ After fixing, show next error if any

Accessibility:
├─ aria-invalid="true" on input
├─ aria-describedby="error-id" on input
└─ Role: alert (announces to screen reader)`

---

### Field-Specific Validation Rules**

### **Text Fields**

`Name (General):
├─ Required: Yes (if marked *)
├─ Min Length: 2 characters
├─ Max Length: 100 characters
├─ Pattern: Letters, numbers, spaces, hyphens, underscores
├─ Error Messages:
│  ├─ Empty: "Name is required"
│  ├─ Too short: "Name must be at least 2 characters"
│  ├─ Too long: "Name must be less than 100 characters (currently 123)"
│  └─ Invalid chars: "Name can only contain letters, numbers, spaces, hyphens, and underscores"

Project Name:
├─ Required: Yes
├─ Min: 3 characters
├─ Max: 100 characters
├─ Unique: Must be unique within organization
├─ Error:
│  └─ Duplicate: "A project with this name already exists. Please choose a different name."

Agent Role:
├─ Required: Yes
├─ Min: 3 characters
├─ Max: 50 characters
├─ Example: "Customer Interview Specialist"

Goal/Description:
├─ Required: Yes (if marked *)
├─ Min: 10 characters
├─ Max: 500 characters
├─ Counter: Show "0/500 characters" (updates in real-time)
├─ Error:
│  ├─ Too short: "Goal must be at least 10 characters (currently 5)"
│  └─ Too long: "Goal must be less than 500 characters (currently 523)"

Backstory:
├─ Required: No (optional)
├─ Min: 0 (no minimum if optional)
├─ Max: 1000 characters
└─ Counter: "0/1000 characters"`

### **Email**

`Rules:
├─ Required: Yes
├─ Format: Valid email (RFC 5322 compliant)
├─ Pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
└─ Trim: Remove leading/trailing spaces

Error Messages:
├─ Empty: "Email is required"
├─ Invalid: "Please enter a valid email address"
└─ Example: john@example.com

Validation:
└─ Real-time: After blur, validate on each change`

### **URL**

`Rules:
├─ Required: Yes (if marked *)
├─ Format: Valid URL with protocol
├─ Pattern: Must start with http:// or https://
└─ Examples: https://notion.so, https://figma.com/file/...

Error Messages:
├─ Empty: "URL is required"
├─ Invalid: "Please enter a valid URL starting with https://"
├─ No protocol: "URL must start with https:// or http://"

Auto-fix (optional):
└─ If user enters "notion.so" → Auto-prepend "https://"`

### **Number**

`Temperature (Agent):
├─ Required: Yes
├─ Type: Number (decimal allowed)
├─ Min: 0.0
├─ Max: 2.0
├─ Step: 0.1
├─ Default: 0.7
├─ Error:
│  └─ Out of range: "Temperature must be between 0 and 2 (currently 3.5)"

Cost Threshold:
├─ Required: No
├─ Type: Number (decimal)
├─ Min: 0
├─ Max: 1000
├─ Format: Currency ($0.00)
├─ Error:
│  └─ Negative: "Cost must be a positive number"

Port (for local LLM):
├─ Required: Yes
├─ Type: Integer
├─ Min: 1
├─ Max: 65535
├─ Error:
│  └─ Out of range: "Port must be between 1 and 65535"`

### **Textarea**

`Large Text Fields (Goal, Backstory, Instructions):
├─ Required: Varies
├─ Min Length: Varies (usually 10-50)
├─ Max Length: Varies (usually 500-5000)
├─ Counter: Always show character count
├─ Auto-resize: Expand textarea as user types (up to max height)
├─ Scroll: If content exceeds max height

Markdown Fields (Template Content):
├─ Required: Yes
├─ Min: 50 characters
├─ Max: 50,000 characters
├─ Preview: Live preview toggle
├─ Error:
│  └─ Invalid markdown: "Markdown syntax error on line X"`

### **Select/Dropdown**

`Single Select:
├─ Required: Yes (if marked *)
├─ Default: Placeholder "Select..." or first option
├─ Error:
│  └─ Not selected: "Please select a [field name]"

Multi-Select:
├─ Required: No (empty selection allowed)
├─ Min: 0 (or 1 if required)
├─ Max: Unlimited (or specify)
├─ Display: Badges for selected items
├─ Error:
│  └─ Min not met: "Please select at least 1 workspace"`

### **Checkbox**

`Single Checkbox:
├─ Required: Sometimes (e.g., "I agree to terms")
├─ Error:
│  └─ Not checked: "You must accept the terms to continue"

Checkbox Group:
├─ Required: No (unless specified)
├─ Min: 0 (or 1 if at least one required)
├─ Error:
│  └─ "Please select at least one option"`

### **File Upload**

`Rules:
├─ Required: Yes (if marked *)
├─ Formats: Specify allowed (e.g., .pdf, .md, .txt, .docx)
├─ Max Size: Specify (e.g., 50 MB)
├─ Max Files: Specify (e.g., 10 files)

Error Messages:
├─ No file: "Please upload a file"
├─ Wrong format: "File format not supported. Please upload PDF, MD, TXT, or DOCX."
├─ Too large: "File 'document.pdf' exceeds 50 MB limit (file is 67 MB)"
├─ Too many: "Maximum 10 files allowed. You selected 15."

Validation Timing:
└─ On file select (before upload starts)`

### **JSON Editor**

`Rules:
├─ Required: Yes (for schemas)
├─ Format: Valid JSON
├─ Min: {} (empty object allowed)
├─ Max: No limit (but warn if >10 KB)

Error Messages:
├─ Invalid JSON: "Invalid JSON syntax on line 5: Expected ',' or '}'"
├─ Empty: "Schema cannot be empty. Please provide at least {}"

Validation Timing:
├─ On Blur: Parse and validate
├─ Real-time: Syntax highlighting (color invalid syntax red)

Preview:
└─ Show formatted JSON below editor`

---

### Form-Level Validation**

`Submit Validation:
├─ Run: When user clicks submit button
├─ Process:
│  1. Validate all required fields
│  2. Validate all field formats
│  3. Check form-level rules (e.g., unique names)
│  4. If errors:
│     a. Prevent submit
│     b. Show error summary at top
│     c. Focus first field with error
│     d. Scroll to top if needed
│  5. If valid:
│     a. Show loading state on submit button
│     b. Disable form (prevent double-submit)
│     c. Submit to API

Error Summary (top of form):
┌─────────────────────────────────────────┐
│ ⚠️ Please fix the following errors:     │
│ • Name is required                      │
│ • Email format is invalid               │
│ • Temperature must be between 0 and 2   │
│ (Click error to jump to field)         │
└─────────────────────────────────────────┘

Clickable Errors:
└─ Each error is a link that scrolls to and focuses the field`

---

### Success State**

`Valid Field:
├─ Border: Green (optional, can be subtle)
├─ Icon: ✓ (green checkmark, right side of field)
├─ Message: No message (or "Looks good!" if desired)

Example:
┌─────────────────────────────────────────┐
│ Email *                                 │
│ [john@example.com                   ] ✓ │
└─────────────────────────────────────────┘

Form Valid (all fields):
└─ Enable submit button (was disabled if invalid)`

---

### Character Counters**

`Display: Below field, right-aligned
Color: Gray (normal), Red (approaching limit)
Format: "X / Y characters"

States:

Normal:
└─ "45 / 500 characters" (gray)

Approaching Limit (>90%):
└─ "478 / 500 characters" (orange)

At Limit:
└─ "500 / 500 characters" (red)
└─ Input: Prevent typing more (maxlength attribute)

Example:
┌─────────────────────────────────────────┐
│ Goal *                                  │
│ [Conduct customer interviews to...  ]  │
│                        45 / 500 characters │
└─────────────────────────────────────────┘`

---

### Dependent Field Validation**

`Example: Start Date & End Date

Rule: End Date must be after Start Date

Implementation:
├─ Validate End Date when:
│  ├─ End Date changes
│  └─ Start Date changes (re-validate End Date)
├─ Error Message: "End date must be after start date"
└─ Clear error when fixed

Example: Password & Confirm Password

Rule: Both must match

Implementation:
├─ Validate Confirm Password when:
│  ├─ Confirm Password changes
│  └─ Password changes (re-validate Confirm)
├─ Error: "Passwords do not match"
└─ Success: Show ✓ on both when match`

---

### Async Validation (Server-Side)**

`Use Cases:
├─ Check if name is unique (Project, Agent, etc.)
├─ Validate API keys
└─ Check if email exists

Pattern:
├─ Trigger: On blur (after client-side validation passes)
├─ Loading: Show spinner in field (right side)
├─ Debounce: Wait 500ms after blur before calling API
├─ Success: Show ✓ or no indicator
└─ Error: Show error message below field

Example (Project Name uniqueness):
1. User types "My Project"
2. User tabs away (blur)
3. Client validates: Format OK
4. Show spinner: Checking availability...
5. API call: POST /api/projects/check-name
6. Response:
   a. Available: Remove spinner, show ✓
   b. Taken: Remove spinner, show error "A project with this name already exists"

Loading State:
┌─────────────────────────────────────────┐
│ Project Name *                          │
│ [My Project                         ] ○ │ ← Spinner
│ Checking availability...                │
└─────────────────────────────────────────┘

Error State:
┌─────────────────────────────────────────┐
│ Project Name *                          │
│ [My Project                         ]   │
│ ⚠️ A project with this name already     │
│    exists. Please choose a different    │
│    name.                                │
└─────────────────────────────────────────┘`
