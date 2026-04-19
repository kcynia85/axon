export enum HubType {
    PRODUCT = "product",
    DISCOVERY = "discovery",
    DESIGN = "design",
    DELIVERY = "delivery",
    GROWTH = "growth",
    WRITING = "writing"
}

export enum ProjectStatus {
    IDEA = "Idea",
    IN_PROGRESS = "In Progress",
    COMPLETED = "Completed",
    // Keep others as legacy if needed, or remove if not in DB
    REVIEW = "Review",
    DONE = "Completed",
    ARCHIVED = "Archived"
}

export enum ResourceProvider {
    NOTION = "notion",
    FIGMA = "figma",
    GITHUB = "github",
    SLACK = "slack",
    JIRA = "jira",
    MIRO = "miro",
    OTHER = "other"
}

export enum ApprovalStatus {
    DRAFT = "draft",
    IN_REVIEW = "in_review",
    APPROVED = "approved",
    REJECTED = "rejected"
}

export type KeyResource = {
    readonly id: string;
    readonly resource_provider_type: ResourceProvider;
    readonly resource_label: string;
    readonly resource_url: string;
    readonly resource_icon?: string;
    readonly project_id: string;
    readonly created_at: string;
    readonly updated_at: string;
}

export type Artifact = {
    readonly id: string;
    readonly artifact_name: string;
    readonly artifact_source_path: string;
    readonly artifact_deliverable_url: string;
    readonly workspace_domain?: string;
    readonly artifact_approval_status: ApprovalStatus;
    readonly approved_by_user_id?: string;
    readonly artifact_approved_at?: string;
    readonly project_id: string;
    readonly space_id?: string; // Added for direct navigation
    readonly node_id?: string;  // Added for direct navigation
    readonly created_at: string;
    readonly updated_at: string;
    // legacy support (keeping for some UI maybe)
    readonly title?: string; 
    readonly type?: string;
    readonly status?: string;
}

export type Project = {
    readonly id: string;
    readonly project_name: string;
    readonly project_status: ProjectStatus;
    readonly project_summary?: string;
    readonly project_keywords: string[];
    readonly project_strategy_url?: string;
    readonly space_ids: string[];
    readonly owner_id: string;
    readonly created_at: string;
    readonly updated_at: string;
    readonly key_resources: KeyResource[];
    readonly artifacts: Artifact[];
    readonly workspaces: string[];
    readonly aggregated_artifacts_count?: number;
    // legacy support
    readonly name?: string;
    readonly description?: string;
    readonly status?: ProjectStatus;
    readonly domain?: HubType;
}

export type Scenario = {
    readonly id: string;
    readonly project_id?: string;
    readonly title: string;
    readonly description: string;
    readonly category: string;
    readonly prompt_template: string;
    readonly icon?: string;
}
