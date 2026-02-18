### **P.1) Offline Detection**

`Detection Method:
├─ Browser API: navigator.onLine
├─ Polling: Ping server every 30 seconds (when online)
├─ Event Listeners: 
│  ├─ window.addEventListener('online', handleOnline)
│  └─ window.addEventListener('offline', handleOffline)
└─ Fallback: Monitor failed API requests

State Management:
├─ Global state: isOnline (boolean)
├─ Last known online: timestamp
└─ Connection quality: good/slow/offline (based on response times)`

---

### **P.2) Offline UI Indicators**

`Global Banner (Top of Page):
┌─────────────────────────────────────────────────────┐
│ 📡 You're offline. Some features are unavailable.   │
│                                    [Retry Connection]│
└─────────────────────────────────────────────────────┘

Styling:
├─ Background: Yellow/Orange (#FFF3CD)
├─ Text: Dark (#78350F)
├─ Icon: 📡 or ⚠️
├─ Position: Fixed top, below primary nav
├─ Z-index: High (above content)
└─ Auto-dismiss: When connection restored

Status in Nav Bar (Alternative):
└─ Small indicator next to profile
   ├─ Online: Green dot (hidden or subtle)
   └─ Offline: Red dot + "Offline" text

Toast on Disconnect:
┌─────────────────────────────────────────────────────┐
│ ⚠️ Connection lost                              [×] │
│   You're now offline. Changes will be queued.      │
└─────────────────────────────────────────────────────┘
Duration: 5 seconds or persistent

Toast on Reconnect:
┌─────────────────────────────────────────────────────┐
│ ✓ Connection restored                           [×] │
│   You're back online. Syncing changes...           │
└─────────────────────────────────────────────────────┘
Duration: 3 seconds`

---

### **P.3) Offline Behavior by Feature**

`READ Operations (Allowed Offline):
├─ View Lists: Show cached data with indicator
│  └─ "Last updated 5 minutes ago (offline)"
├─ View Details: Show cached data
├─ Search/Filter: Work on cached data only
├─ Canvas View: Show last saved state (read-only)
└─ Settings View: Show cached settings

WRITE Operations (Disabled Offline):
├─ Create: Disable "+ New" buttons
│  └─ Tooltip: "Internet connection required"
├─ Edit: Disable "Edit" buttons OR allow with queue
├─ Delete: Disable "Delete" buttons
├─ Execute: Disable "Run" buttons (Canvas nodes)
└─ Upload: Disable file upload

Visual Indicators:
├─ Disabled buttons: Gray out, add tooltip
├─ Forms: Show warning banner at top
├─ Canvas: "Offline mode - viewing only"
└─ Lists: Timestamp of last refresh`

---

### **P.4) Cached Data Display**

`Data Staleness Indicator:

Recent (< 5 min):
└─ No indicator (data is fresh enough)

Stale (5-30 min):
└─ Subtle timestamp: "Updated 12 minutes ago"
└─ Position: Top right of list or section

Very Stale (> 30 min):
┌─────────────────────────────────────────────────────┐
│ ⚠️ Data may be outdated (last updated 45 min ago)  │
│                                        [Refresh Now]│
└─────────────────────────────────────────────────────┘

Offline (unknown age):
└─ "Last updated before going offline"

Cache Strategy:
├─ Store: Last fetched data in IndexedDB or localStorage
├─ Expire: After 24 hours (clear cache)
├─ Scope: Per list/page
└─ Size: Limit to 50 MB total`

---

### **P.5) Network Error Handling**

`API Request Failures:

Connection Refused (ECONNREFUSED):
├─ Display: "Unable to connect to server"
├─ Suggestion: "Check your internet connection"
└─ Action: [Retry] button

Timeout (ETIMEDOUT):
├─ Display: "Request timed out"
├─ Suggestion: "Your connection may be slow. Please try again."
└─ Action: [Retry] button

DNS Resolution Failed (ENOTFOUND):
├─ Display: "Cannot reach server"
├─ Suggestion: "Check your internet connection or try again later"
└─ Action: [Retry] button

Slow Connection (>5s response):
├─ Display: Warning toast "Your connection is slow"
├─ Behavior: Continue showing loading spinner
└─ Timeout: After 30 seconds, show error

SSL/Certificate Error:
├─ Display: "Secure connection failed"
├─ Suggestion: "This may be a security issue. Contact support if problem persists."
└─ Action: [Retry] button (don't allow bypass)`

---

### **P.6) Retry Strategy**

`Automatic Retry:
├─ Attempts: 3 retries
├─ Backoff: Exponential (1s, 2s, 4s)
├─ Trigger: Failed API requests (except 4xx errors)
└─ Silent: Don't show error until all retries exhausted

Example:
Request fails → Wait 1s → Retry #1 fails → Wait 2s → Retry #2 fails → Wait 4s → Retry #3 fails → Show error

Manual Retry:
├─ Show: [Retry] button in error state
├─ Action: Re-attempt same request
├─ Loading: Show spinner during retry
└─ Feedback: Toast if retry succeeds or fails again

Bulk Retry:
└─ If multiple requests failed: [Retry All] button`

---

### **P.7) Queued Actions (Future - v1.1)**

`Concept: Queue write operations when offline, sync when back online

Supported Actions:
├─ Create: New project, agent, etc.
├─ Edit: Update existing items
├─ Delete: Mark for deletion
└─ Upload: Queue file uploads

Queue Storage:
├─ Location: IndexedDB (persistent)
├─ Structure:
│  └─ {
│      id: uuid,
│      action: 'create' | 'update' | 'delete',
│      resource: 'project' | 'agent' | etc,
│      data: {...},
│      timestamp: Date,
│      status: 'pending' | 'syncing' | 'failed'
│    }
└─ Ordering: FIFO (first in, first out)

UI Indicator:
┌─────────────────────────────────────────────────────┐
│ 📤 3 actions queued                                 │
│   Will sync when you're back online                │
│                                           [View Queue]│
└─────────────────────────────────────────────────────┘

Queue Modal:
┌─────────────────────────────────────────────────────┐
│ Queued Actions                                  [×] │
├─────────────────────────────────────────────────────┤
│ ⏳ Create Project "New Research"                    │
│ ⏳ Update Agent "Interview Bot"                     │
│ ⏳ Delete Pattern "Old Flow"                        │
├─────────────────────────────────────────────────────┤
│ These will sync automatically when you're online.   │
│ [Clear Queue]                                       │
└─────────────────────────────────────────────────────┘

Sync Process (on reconnect):
1. Detect online
2. Show: "Syncing 3 queued actions..."
3. Process queue in order:
   a. Send request
   b. If success: Remove from queue, show ✓
   c. If fail: Keep in queue, show ⚠️
4. Show: "2/3 actions synced. 1 failed."
5. Allow: User to retry failed actions

Conflicts:
├─ Optimistic: Assume no conflicts (most cases)
├─ If conflict detected: Show modal
│  └─ "This item was modified by someone else"
│  └─ Options: [Use Server Version] [Keep My Changes] [Merge]
└─ Default: Use server version (safer)`

---

### **P.8) Connection Quality Monitoring**

`Track:
├─ Response times: Log API request durations
├─ Success rate: % of successful requests
└─ Classify:
   ├─ Good: <1s avg response, >95% success
   ├─ Slow: 1-5s avg response, 80-95% success
   └─ Poor: >5s avg response, <80% success

UI Feedback (Slow Connection):
┌─────────────────────────────────────────────────────┐
│ ⚠️ Your connection is slow                          │
│   Some actions may take longer than usual           │
└─────────────────────────────────────────────────────┘
Auto-dismiss: When connection improves

Adjust Behavior:
├─ Slow connection detected:
│  ├─ Reduce: Polling frequency (60s instead of 30s)
│  ├─ Disable: Auto-refresh features
│  └─ Show: Progress bars instead of spinners
└─ Good connection:
   └─ Resume: Normal polling, auto-refresh`