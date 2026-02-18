### **Field-Level Errors**

`Error Display Pattern:
├─ Timing: On blur (first time), then on change (real-time)
├─ Visual:
│  ├─ Border: Red (2px solid #DC2626)
│  ├─ Text: Red (#DC2626)
│  ├─ Icon: ⚠️ before message
│  └─ Position: Below field, 8px margin
└─ Accessibility: aria-invalid="true", aria-describedby="error-id"

Examples:

Required Field (empty):
└─ "Name is required"

Email (invalid format):
└─ "Please enter a valid email address"

URL (invalid format):
└─ "Please enter a valid URL starting with https://"

Min Length:
└─ "Description must be at least 10 characters (currently 5)"

Max Length:
└─ "Goal must be less than 500 characters (currently 523)"

Number (out of range):
└─ "Temperature must be between 0 and 2 (currently 3.5)"

File Upload (invalid):
├─ Wrong format: "File format not supported. Please upload PDF, MD, TXT, or DOCX."
├─ Too large: "File exceeds 50 MB limit. Please upload a smaller file."
└─ Upload failed: "Upload failed. Please try again."

JSON (invalid):
└─ "Invalid JSON format. Please check syntax."`

### **Form-Level Errors (Submit)**

`Error Summary (top of form):
├─ Background: Red/pink (#FEE2E2)
├─ Border: Red (1px solid #DC2626)
├─ Icon: ⚠️
├─ Heading: "Please fix the following errors:"
├─ List: Clickable links to fields with errors
│  └─ "• Name is required"
│  └─ "• Email format is invalid"
└─ Auto-scroll: To first error field

Example:
┌─────────────────────────────────────────────┐
│ ⚠️ Please fix the following errors:         │
│ • Name is required                          │
│ • Email format is invalid                   │
│ • Temperature must be between 0 and 2       │
└─────────────────────────────────────────────┘`

---