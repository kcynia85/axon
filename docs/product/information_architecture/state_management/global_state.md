// User
user: { id, name, email, role }

// Notifications
notifications: [
  { id, type, message, timestamp }
]

// Inbox count
inboxCount: 3

// Active filters (per list)
filters: {
  "agents-list": { workspace: ["discovery"], keywords: ["research"] },
  "projects-list": { status: ["in_progress"] }
}