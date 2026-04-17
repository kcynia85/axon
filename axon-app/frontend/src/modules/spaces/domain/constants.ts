// frontend/src/modules/spaces/domain/constants.ts

export type WorkspaceColor = "blue" | "purple" | "pink" | "green" | "yellow" | "orange";

export type WorkspaceUnit = {
  readonly identifier: string;
  readonly displayName: string;
  readonly visualColor: WorkspaceColor;
};

export const MAP_OF_WORKSPACE_IDENTIFIERS_TO_COLORS: Record<string, WorkspaceColor> = {
  "ws-discovery": "purple",
  "ws-design": "pink",
  "ws-delivery": "green",
  "ws-product": "blue",
  "ws-growth": "yellow",
};

export const LIST_OF_AVAILABLE_WORKSPACES: readonly WorkspaceUnit[] = [
    { identifier: "ws-discovery", displayName: "Discovery", visualColor: "purple" },
    { identifier: "ws-design", displayName: "Design", visualColor: "pink" },
    { identifier: "ws-delivery", displayName: "Delivery", visualColor: "green" },
    { identifier: "ws-product", displayName: "Product Management", visualColor: "blue" },
    { identifier: "ws-growth", displayName: "Growth & Market", visualColor: "yellow" },
];

export const MAP_OF_AVAILABLE_COMPONENTS_BY_CATEGORY = {
    patterns: {
        id: "patterns",
        name: "Standard Patterns",
        items: [] as SpaceComponentItem[],
    },
    crews: {
        id: "crews",
        name: "AI Crews",
        items: [] as SpaceComponentItem[],
    },
    agents: {
        id: "agents",
        name: "Autonomous Agents",
        items: [] as SpaceComponentItem[],
    },
    automations: {
        id: "automations",
        name: "Workflow Automations",
        items: [] as SpaceComponentItem[],
    },
    services: {
        id: "services",
        name: "External Services",
        items: [] as SpaceComponentItem[],
    },
    templates: {
        id: "templates",
        name: "Archetype Templates",
        items: [] as SpaceComponentItem[],
    }
};

export type SpaceComponentType = "pattern" | "crew" | "agent" | "template" | "service" | "automation";

export type SpaceComponentItem = {
  readonly uniqueIdentifier: string;
  readonly componentName: string;
  readonly componentType: SpaceComponentType;
};

// --- Inspector Constants ---

export const LIST_OF_AVAILABLE_AGENT_EXECUTION_STATUSES = [
  { statusKey: "pending", statusDisplayName: "Pending" },
  { statusKey: "in_progress", statusDisplayName: "In Progress" },
  { statusKey: "done", statusDisplayName: "Done" },
  { statusKey: "failed", statusDisplayName: "Failed" },
  { statusKey: "paused", statusDisplayName: "Paused" },
] as const;

export const LIST_OF_AVAILABLE_ARTIFACT_STATUSES = [
  { statusKey: "in_review", statusDisplayName: "In Review" },
  { statusKey: "approved", statusDisplayName: "Approved" },
] as const;

export const LIST_OF_AVAILABLE_CREW_EXECUTION_STATUSES = [
  { statusKey: "missing_context", statusDisplayName: "Missing Context" },
  { statusKey: "pending", statusDisplayName: "Pending" },
  { statusKey: "working", statusDisplayName: "Working" },
  { statusKey: "done", statusDisplayName: "Done" },
  { statusKey: "failed", statusDisplayName: "Failed" },
] as const;

export const LIST_OF_AVAILABLE_SERVICE_ARTIFACT_STATUSES = [
  { statusKey: "pending", statusDisplayName: "Pending" },
  { statusKey: "in_progress", statusDisplayName: "In Progress" },
  { statusKey: "done", statusDisplayName: "Done" },
] as const;
