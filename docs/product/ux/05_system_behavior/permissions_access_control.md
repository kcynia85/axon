### Role Definitions**

`Roles:
├─ Admin (Organization Owner)
│  └─ Full access to everything
├─ Worker (Standard User)
│  └─ Can create/edit/delete own content
└─ Viewer (Read-only)
   └─ Can only view, no modifications

Organization:
├─ Each org has 1+ Admins
├─ Users are assigned roles per organization
└─ Billing: Admin-only access`

---

### Permissions Matrix**

`╔════════════════════════╦═══════╦════════╦════════╗
║ Action                 ║ Admin ║ Worker ║ Viewer ║
╠════════════════════════╬═══════╬════════╬════════╣
║ PROJECTS               ║       ║        ║        ║
║ View all projects      ║   ✓   ║   ✓    ║   ✓    ║
║ Create project         ║   ✓   ║   ✓    ║   ✗    ║
║ Edit any project       ║   ✓   ║ Owner* ║   ✗    ║
║ Delete any project     ║   ✓   ║ Owner* ║   ✗    ║
╠════════════════════════╬═══════╬════════╬════════╣
║ SPACES                 ║       ║        ║        ║
║ View all spaces        ║   ✓   ║   ✓    ║   ✓    ║
║ Create space           ║   ✓   ║   ✓    ║   ✗    ║
║ Edit any space         ║   ✓   ║   ✓    ║   ✗    ║
║ Delete space           ║   ✓   ║ Owner* ║   ✗    ║
║ Execute nodes          ║   ✓   ║   ✓    ║   ✗    ║
╠════════════════════════╬═══════╬════════╬════════╣
║ WORKSPACES             ║       ║        ║        ║
║ View components        ║   ✓   ║   ✓    ║   ✓    ║
║ Create agent/crew/etc  ║   ✓   ║   ✓    ║   ✗    ║
║ Edit any component     ║   ✓   ║ Owner* ║   ✗    ║
║ Delete component       ║   ✓   ║ Owner* ║   ✗    ║
║ Duplicate component    ║   ✓   ║   ✓    ║   ✗    ║
╠════════════════════════╬═══════╬════════╬════════╣
║ RESOURCES              ║       ║        ║        ║
║ View knowledge base    ║   ✓   ║   ✓    ║   ✓    ║
║ Create hub             ║   ✓   ║   ✓    ║   ✗    ║
║ Upload sources         ║   ✓   ║   ✓    ║   ✗    ║
║ Delete hub/source      ║   ✓   ║ Owner* ║   ✗    ║
║ View prompts           ║   ✓   ║   ✓    ║   ✓    ║
║ Create/edit prompt     ║   ✓   ║   ✓    ║   ✗    ║
╠════════════════════════╬═══════╬════════╬════════╣
║ SETTINGS               ║       ║        ║        ║
║ View settings          ║   ✓   ║   ✓    ║   ✓    ║
║ Edit LLM providers     ║   ✓   ║   ✗    ║   ✗    ║
║ Edit models            ║   ✓   ║   ✗    ║   ✗    ║
║ Edit routers           ║   ✓   ║   ✗    ║   ✗    ║
║ Edit knowledge engine  ║   ✓   ║   ✗    ║   ✗    ║
╠════════════════════════╬═══════╬════════╬════════╣
║ ORGANIZATION           ║       ║        ║        ║
║ View members           ║   ✓   ║   ✓    ║   ✓    ║
║ Invite members         ║   ✓   ║   ✗    ║   ✗    ║
║ Change roles           ║   ✓   ║   ✗    ║   ✗    ║
║ View billing           ║   ✓   ║   ✗    ║   ✗    ║
║ Manage subscription    ║   ✓   ║   ✗    ║   ✗    ║
╚════════════════════════╩═══════╩════════╩════════╝

* Owner = User who created the item`

---

### UI Behavior per Role**

`Pattern 1: Hide (Preferred)
- If user has no permission → Hide button/menu item completely
- Cleanest UX, no frustration

Example (Viewer role):
Settings page → LLM Providers list
✓ Shows: List of providers (read-only)
✗ Hides: "+ Add Provider" button
✗ Hides: Edit/Delete actions in rows

Pattern 2: Disable + Tooltip (When context is important)
- Show button but disabled with explanatory tooltip
- Use when user needs to know feature exists

Example (Worker, not owner):
Project Detail → Actions menu
✓ Shows: Edit button (enabled - user is owner)
✓ Shows: Delete button (disabled - user is not owner)
✗ Tooltip: "Only the project owner can delete this project"

Pattern 3: Show but Block (When action is complex)
- Let user start action, then show permission error
- Use rarely (frustrating UX)

Example (Worker → Settings):
User clicks Settings → LLM Providers
→ Can view list
→ Clicks "+ Add Provider"
→ Modal shows: "You don't have permission to add providers. Contact your administrator."`

---

### Permission Error Messages**

`Generic:
"You don't have permission to perform this action."

Specific:

Delete (not owner):
"You don't have permission to delete this project. Only the project owner ([owner_name]) or administrators can delete projects."

Edit Settings (not admin):
"Only administrators can modify LLM settings. Contact [admin_name] if you need to make changes."

Invite Members (not admin):
"Only administrators can invite new members to the organization."

View Billing (not admin):
"Only administrators can view billing information."

Execute Node (viewer):
"You don't have permission to execute workflows. Contact your administrator to upgrade your role."

Upload File (viewer):
"You don't have permission to upload files. Contact your administrator."`