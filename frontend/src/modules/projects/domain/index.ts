export enum HubType {
    PRODUCT = "product",
    DISCOVERY = "discovery",
    DESIGN = "design",
    DELIVERY = "delivery",
    GROWTH = "growth",
    WRITING = "writing"
}

export enum ProjectStatus {
    IDEA = "idea",
    IN_PROGRESS = "in_progress",
    REVIEW = "review",
    DONE = "done",
    ARCHIVED = "archived"
}

export type Project = {
    readonly id: string;
    readonly name: string;
    readonly description?: string;
    readonly domain: HubType;
    readonly status: ProjectStatus;
    readonly owner_id?: string;
    readonly created_at?: string;
    readonly updated_at?: string;
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

export type Artifact = {
    readonly id: string;
    readonly project_id: string;
    readonly title: string;
    readonly type: string;
    readonly content: string;
    readonly status: string;
    readonly created_at?: string;
    readonly updated_at?: string;
}