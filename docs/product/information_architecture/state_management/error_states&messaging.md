# Global Error Pages

## 404 - Not Found
Layout:
├─ Center-aligned content
├─ Icon: 🔍 (large, 80px)
├─ Heading: "Page not found" (h1)
├─ Message: "The page you're looking for doesn't exist or has been moved."
├─ Suggestions:
│  └─ "Here are some helpful links:"
│     ├─ → Home
│     ├─ → Projects
│     └─ → Workspaces
└─ Action: [Go to Home] button (primary)

URL Examples:
- /projects/invalid-uuid → 404
- /agents/deleted-id → 404
- /random-path → 404

## 403 - Forbidden
Layout:
├─ Icon: 🔒
├─ Heading: "Access denied"
├─ Message: "You don't have permission to view this page."
├─ Explanation: "Contact your administrator if you need access."
└─ Action: [Go Back] button

Triggers:
- Accessing Settings as non-admin
- Viewing deleted Project
- Opening private Workspace

## 500 - Server Error
Layout:
├─ Icon: ⚠️
├─ Heading: "Something went wrong"
├─ Message: "We're experiencing technical difficulties. Please try again."
├─ Error ID: "Error ID: #abc123" (for support)
├─ Actions:
│  ├─ [Retry] button (primary)
│  └─ [Report Issue] link (opens support)
└─ Auto-retry: After 5 seconds if no user action

## Network Error (Offline)
Banner (top of page, persistent):
├─ Background: Yellow/orange (#FFF3CD)
├─ Icon: 📡
├─ Message: "You're offline. Some features are unavailable."
├─ Actions:
│  └─ [Retry Connection] button
└─ Auto-dismiss: When connection restored

Behavior:
- Disable: All Create/Edit/Delete buttons
- Show: Cached data with timestamp "Last updated 5 min ago"
- Queue: Actions for retry when back online (optional, v1.1)

