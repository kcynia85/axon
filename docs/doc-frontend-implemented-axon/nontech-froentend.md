# Axon Frontend — User Guide (Non-Technical)

> **Role:** Feature Overview & User Flows

## 📊 Dashboard (Pulpit Projektów)

The Dashboard is the entry point of the application.

### Features
1.  **Project List:**
    *   View all your active and planned projects.
    *   Cards display: Name, Domain (e.g., CODING, DESIGN), Status, and Description.
    *   **Loading State:** Skeleton screens appear while data is fetching.
    *   **Empty State:** Friendly message if no projects exist.

2.  **Domains (Hubs):**
    *   Projects are categorized by their "Hub" (Context), allowing for focused work.

---

## 💬 Agent Chat (Sesja z Agentem)

Allows you to interact with specialized AI Agents (Manager, Researcher, etc.).

### Features
1.  **Real-time Thinking:**
    *   Responses are streamed character-by-character, allowing you to read while the Agent thinks.
    *   Visual indicator ("Agent is thinking...") shows activity.
2.  **Context Aware:**
    *   Agents know which Project you are working on (via `projectId`).
    *   They act according to their Role (e.g., Manager focuses on tasks).

---

## 🚀 Next Steps
*   **Knowledge Browser:** Viewing documents and assets.