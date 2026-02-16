## Role-Based Access

User Roles:
- Admin: Full access (all CRUD operations)
- Worker: Limited access (can't delete projects, can't access org settings)

Workspace-Based Visibility:
- Components (Agents, Crews, etc.) filtered by availability_workspaces
- User sees only components available in their workspace context

## Content Model Permissions
// Project
- View: All organization members
- Edit: Project owner + Admins
- Delete: Project owner + Admins

// Space (Canvas)
- View: All organization members
- Edit: All organization members
- Delete: Space creator + Admins

// Agents/Crews/etc.
- View: Anyone with workspace access
- Edit: Creator + Admins
- Delete: Creator + Admins

// Settings (LLM, Knowledge Engine)
- View: All organization members
- Edit: Admins only
- Delete: Admins only