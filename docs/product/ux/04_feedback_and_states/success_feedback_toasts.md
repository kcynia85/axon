### Toast Specifications**

`Position: Top-right corner (16px from top, 16px from right)
Max Width: 400px
Animation: Slide in from right (200ms ease-out)
Duration:
├─ Success: 3 seconds (auto-dismiss)
├─ Error: 5 seconds (auto-dismiss) OR persistent with dismiss button
├─ Warning: 5 seconds (auto-dismiss) OR persistent
└─ Info: 4 seconds (auto-dismiss)

Multiple Toasts:
├─ Stack vertically (8px gap)
├─ Max visible: 3 toasts
├─ Queue: Additional toasts wait, show when space available
└─ Dismiss order: Oldest first (FIFO)

Structure:
┌─────────────────────────────────────────┐
│ [Icon] Title                        [×] │
│        Description (optional)           │
│        [Action Button] (optional)       │
└─────────────────────────────────────────┘`

---

### Toast Types**

### **Success Toasts**

`Icon: ✓ (white checkmark, green circle background)
Background: Green (#10B981)
Text: White

Examples:

Simple:
┌─────────────────────────────────────────┐
│ ✓ Project created successfully      [×] │
└─────────────────────────────────────────┘

With Description:
┌─────────────────────────────────────────┐
│ ✓ Agent saved                       [×] │
│   Your agent "Customer Interview" is    │
│   now available in the Discovery        │
│   workspace.                            │
└─────────────────────────────────────────┘

With Action:
┌─────────────────────────────────────────┐
│ ✓ Artifact ready                    [×] │
│   Interview summary has been generated. │
│   [View Artifact]                       │
└─────────────────────────────────────────┘`

### **Error Toasts**

`Icon: ⚠️ (white exclamation, red circle background)
Background: Red (#DC2626)
Text: White

Examples:

Simple:
┌─────────────────────────────────────────┐
│ ⚠️ Failed to delete project         [×] │
└─────────────────────────────────────────┘

With Retry:
┌─────────────────────────────────────────┐
│ ⚠️ Connection timeout               [×] │
│   Request timed out. Please try again.  │
│   [Retry]                               │
└─────────────────────────────────────────┘

With Details:
┌─────────────────────────────────────────┐
│ ⚠️ Upload failed                    [×] │
│   File "document.pdf" exceeds 50 MB     │
│   limit. Please upload a smaller file.  │
└─────────────────────────────────────────┘

Persistent (no auto-dismiss):
┌─────────────────────────────────────────┐
│ ⚠️ Critical error                   [×] │
│   Unable to connect to server. Check    │
│   your internet connection.             │
│   [Retry] [Report Issue]                │
└─────────────────────────────────────────┘
(Must be manually dismissed)`

### **Warning Toasts**

`Icon: ⚠️ (dark icon, yellow background)
Background: Yellow (#F59E0B)
Text: Dark (#1F2937)

Examples:

┌─────────────────────────────────────────┐
│ ⚠️ Unsaved changes                  [×] │
│   You have unsaved changes. Save before │
│   leaving this page.                    │
│   [Save Now] [Discard]                  │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ ⚠️ Storage almost full              [×] │
│   You're using 95% of your storage.     │
│   [Upgrade Plan]                        │
└─────────────────────────────────────────┘`

### **Info Toasts**

`Icon: ℹ️ (white icon, blue circle background)
Background: Blue (#3B82F6)
Text: White

Examples:

┌─────────────────────────────────────────┐
│ ℹ️ Indexing in progress...          [×] │
│   Your documents are being indexed.     │
│   This may take a few minutes.          │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ ℹ️ New version available            [×] │
│   A new version of Axon is available.   │
│   [Refresh to Update]                   │
└─────────────────────────────────────────┘`

---

### Toast Messages Catalog**

`CRUD Operations:

Create Success:
- "Project created successfully"
- "Agent created successfully"
- "Knowledge Hub created successfully"
- "Pattern saved to library"

Create Error:
- "Failed to create project: [reason]"
- "Failed to create agent: [reason]"

Update Success:
- "Project updated"
- "Agent saved"
- "Settings updated"

Update Error:
- "Failed to update project: [reason]"
- "Conflict: This item was modified by someone else. Refresh to see latest version."

Delete Success:
- "Project deleted"
- "Agent deleted"
- "1 item deleted" / "5 items deleted"

Delete Error:
- "Failed to delete project: [reason]"
- "Cannot delete: This item is in use"

File Operations:

Upload Success:
- "File uploaded successfully"
- "3 files uploaded successfully"
- "Document indexed and ready"

Upload Error:
- "Upload failed: File too large"
- "Upload failed: Invalid format"
- "Upload failed: [reason]"

Upload Progress (persistent, auto-dismiss on completion):
- "Uploading document.pdf... 45%"

Execution:

Execution Start:
- "Starting execution..."

Execution Success:
- "Execution completed"
- "Artifact generated successfully"

Execution Error:
- "Execution failed: [reason]"
- "Execution timed out. Try with simpler input."

Network:

Connection Lost:
- "Connection lost. Reconnecting..."

Connection Restored:
- "Connection restored"

Offline:
- "You're offline. Some features are unavailable."

System:

Auto-save:
- "All changes saved" (subtle, 2s)

Session Expiring:
- "Your session will expire in 5 minutes. Save your work."

Maintenance:
- "Scheduled maintenance in 30 minutes. Please save your work."`

---

