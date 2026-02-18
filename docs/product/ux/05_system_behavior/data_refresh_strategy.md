### **Q.1) Real-Time Updates (WebSocket)**

`Use Cases:
├─ Canvas node execution updates
├─ Inbox new items
├─ File upload progress
├─ Collaboration (future): Show when others are editing

WebSocket Connection:
├─ URL: wss://api.axon.ai/ws?userId={userId}
├─ Authentication: Send token in initial message
├─ Reconnect: Automatic with exponential backoff
└─ Heartbeat: Ping every 30s to keep alive

Message Format:
{
  "type": "node_progress" | "node_complete" | "inbox_new" | "upload_progress",
  "data": {
    "nodeId": "...",
    "progress": 45,
    "thought": "Analyzing data...",
    ...
  }
}

Event Handlers:
├─ node_progress: Update Canvas inspector
├─ node_complete: Refresh node, show success
├─ inbox_new: Increment badge, show toast (optional)
├─ upload_progress: Update progress bar
└─ user_joined: Show "John is viewing" (future)

Connection States:
├─ Connecting: Show "Connecting..." in Canvas
├─ Connected: No indicator (or subtle ✓)
├─ Disconnected: Show "Connection lost, reconnecting..."
└─ Failed: Show "Real-time updates unavailable"`

---

### **Q.2) Polling (Fallback)**

`Use: When WebSocket unavailable or for non-critical updates

Frequency:
├─ Inbox: Poll every 60 seconds (check for new items)
├─ Lists: No polling (manual refresh only)
└─ Canvas execution: Poll every 5 seconds IF no WebSocket

Implementation:
├─ setInterval: Run on component mount
├─ Clear: On component unmount
├─ Pause: When tab not visible (document.hidden)
└─ Resume: When tab becomes visible

Example (Inbox polling):
useEffect(() => {
  const interval = setInterval(async () => {
    if (!document.hidden && navigator.onLine) {
      const newCount = await fetchInboxCount()
      if (newCount > currentCount) {
        showToast('You have new inbox items')
      }
    }
  }, 60000) // 60 seconds
  
  return () => clearInterval(interval)
}, [currentCount])`

---

### **Q.3) Manual Refresh**

`Trigger:
├─ User clicks refresh button (optional)
├─ Pull-to-refresh on mobile (v1.1)
└─ Page navigation (automatic)

Refresh Button:
├─ Location: Top right of list views (optional)
├─ Icon: 🔄 Refresh icon
├─ Loading: Spin icon during fetch
└─ Tooltip: "Refresh list"

Behavior:
├─ Click: Fetch fresh data from server
├─ Loading: Show spinner on button (don't disable)
├─ Success: Update list, show timestamp "Just now"
├─ Error: Show toast "Failed to refresh"
└─ Optimistic: Show refreshing state immediately

Pull-to-Refresh (Mobile, v1.1):
├─ Gesture: Pull down from top of list
├─ Indicator: Show loading spinner while pulling
├─ Threshold: Pull >50px to trigger
├─ Release: Fetch data, show loading
└─ Complete: Hide indicator, show updated list

Auto-refresh on Navigation:
├─ Route Change: Fetch fresh data when navigating to page
├─ Background Tab: Refresh when tab becomes active (if stale)
└─ Stale Threshold: 5 minutes`

---

### **Q.4) Stale Data Indicators**

`Timestamp Display:
├─ Location: Top of list or section
├─ Format: "Updated X ago" or "Last updated X"
├─ Relative: Use relative time (e.g., "2 minutes ago")
└─ Update: Every 60 seconds (to keep relative time accurate)

Color Coding:
├─ Green: < 1 minute (fresh)
├─ Gray: 1-5 minutes (recent)
├─ Orange: 5-30 minutes (stale)
└─ Red: > 30 minutes (very stale) + [Refresh] button

Examples:

Fresh:
└─ "Updated just now" (green)

Recent:
└─ "Updated 3 minutes ago" (gray)

Stale:
└─ "Updated 12 minutes ago" (orange)

Very Stale:
┌─────────────────────────────────────────────────────┐
│ ⚠️ Data may be outdated (updated 45 minutes ago)   │
│                                        [Refresh Now]│
└─────────────────────────────────────────────────────┘

Offline:
└─ "Last updated before going offline"`

---

### **Q.5) Optimistic Updates**

`Pattern: Show success immediately, rollback if API fails

Use Cases:
├─ Toggle actions: Like, favorite, activate/deactivate
├─ Simple updates: Change status, update single field
└─ Delete: Remove from list immediately (with undo toast)

Implementation:

Example (Toggle Favorite):
1. User clicks favorite icon
2. Update UI immediately: Gray → Red (filled heart)
3. Send API request in background
4. If success: No additional action (already updated)
5. If failure: 
   a. Revert UI: Red → Gray
   b. Show toast: "Failed to favorite"

Example (Delete with Undo):
1. User clicks delete
2. Remove item from list immediately
3. Show toast: "Agent deleted [Undo]"
4. Send API request in background
5. If success: Clear toast after 5s
6. If failure: 
   a. Re-add item to list
   b. Show toast: "Failed to delete"
7. If user clicks [Undo] (within 5s):
   a. Cancel API request (if not sent)
   b. Re-add item to list
   c. Show toast: "Deletion cancelled"

NOT Optimistic:
├─ Create: Wait for server (need ID)
├─ Complex edits: Wait for validation
└─ Destructive actions: Confirm first`

---

### **Q.6) Background Sync (Future - v1.1)**

`Concept: Sync data in background (even when app closed)

Use Cases:
├─ Upload queued files
├─ Sync queued actions (from offline mode)
└─ Fetch fresh data for cached pages

Implementation:
├─ Service Worker: Register background sync
├─ Trigger: When network restored
├─ Limitation: Only works on mobile (PWA)

Example:
navigator.serviceWorker.ready.then(registration => {
  registration.sync.register('sync-queue')
})

// In service worker:
self.addEventListener('sync', event => {
  if (event.tag === 'sync-queue') {
    event.waitUntil(syncQueuedActions())
  }
})

User Experience:
├─ Queue actions while offline
├─ Close app
├─ Network restored (in background)
├─ Service worker syncs queue
├─ Next time user opens app: Everything is synced`

---

### **Q.7) Cache Strategy**

`Cache Levels:

1. Memory Cache (React State/Zustand):
   ├─ Duration: Until page refresh
   ├─ Scope: Current session
   └─ Use: Active page data

2. HTTP Cache (Browser):
   ├─ Duration: Per Cache-Control headers
   ├─ Scope: All requests
   └─ Use: Static assets, API responses

3. IndexedDB (Persistent):
   ├─ Duration: 24 hours (configurable)
   ├─ Scope: User-specific data
   └─ Use: Offline mode, background sync

Cache Invalidation:
├─ On Create/Update/Delete: Invalidate related queries
├─ On Navigation: Check if data stale, refetch if needed
├─ Manual: User clicks refresh
└─ Time-based: After 5 minutes (for critical data)

React Query (Recommended):
├─ staleTime: 5 minutes (data fresh for 5 min)
├─ cacheTime: 30 minutes (keep in cache even if unused)
├─ refetchOnWindowFocus: true (refresh when tab active)
├─ refetchOnReconnect: true (refresh when online)
└─ retry: 3 attempts with exponential backoff`