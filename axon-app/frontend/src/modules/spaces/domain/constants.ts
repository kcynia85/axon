// frontend/src/modules/spaces/domain/constants.ts

export type WorkspaceColor = "blue" | "purple" | "pink" | "green" | "yellow" | "orange";

export type WorkspaceUnit = {
  readonly identifier: string;
  readonly displayName: string;
  readonly visualColor: WorkspaceColor;
};

export const MAP_OF_WORKSPACE_IDENTIFIERS_TO_COLORS: Record<string, WorkspaceColor> = {
  product: "blue",
  discovery: "purple",
  design: "pink",
  delivery: "green",
  growth: "yellow",
};

export const LIST_OF_AVAILABLE_WORKSPACES: readonly WorkspaceUnit[] = [
  { identifier: "product", displayName: "Product Management", visualColor: "blue" },
  { identifier: "discovery", displayName: "Discovery", visualColor: "purple" },
  { identifier: "design", displayName: "Design", visualColor: "pink" },
  { identifier: "delivery", displayName: "Delivery", visualColor: "green" },
  { identifier: "growth", displayName: "Growth and Product", visualColor: "yellow" },
];

export type SpaceComponentType = "pattern" | "crew" | "agent" | "template" | "service" | "automation";

export type SpaceComponentItem = {
  readonly uniqueIdentifier: string;
  readonly componentName: string;
  readonly componentType: SpaceComponentType;
};

export const MAP_OF_AVAILABLE_COMPONENTS_BY_CATEGORY: Record<string, readonly SpaceComponentItem[]> = {
  patterns: [
    { uniqueIdentifier: "interview", componentName: "Interview Analysis", componentType: "pattern" },
    { uniqueIdentifier: "survey", componentName: "Survey Analysis", componentType: "pattern" },
  ],
  crews: [
    { uniqueIdentifier: "design-crew", componentName: "Design Crew", componentType: "crew" },
    { uniqueIdentifier: "research-crew", componentName: "Research Crew", componentType: "crew" },
  ],
  agents: [
    { uniqueIdentifier: "researcher", componentName: "User Researcher", componentType: "agent" },
    { uniqueIdentifier: "analyst", componentName: "Data Analyst", componentType: "agent" },
    { uniqueIdentifier: "writer", componentName: "Content Writer", componentType: "agent" },
  ],
  templates: [
    { uniqueIdentifier: "prd", componentName: "PRD Template", componentType: "template" },
    { uniqueIdentifier: "tech-spec", componentName: "Technical Spec", componentType: "template" },
  ],
  services: [
    { uniqueIdentifier: "jira", componentName: "Jira Integration", componentType: "service" },
    { uniqueIdentifier: "figma", componentName: "Figma Sync", componentType: "service" },
    { uniqueIdentifier: "elevenlabs", componentName: "ElevenLabs", componentType: "service" },
  ],
  automations: [
    { uniqueIdentifier: "notify", componentName: "Slack Notify", componentType: "automation" },
    { uniqueIdentifier: "ci-cd", componentName: "CI/CD Pipeline", componentType: "automation" },
  ],
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
