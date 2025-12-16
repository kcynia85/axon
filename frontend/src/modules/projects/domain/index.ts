export enum ProjectStatus {
    IDEA = "IDEA",
    PLANNING = "PLANNING",
    ACTIVE = "ACTIVE",
    COMPLETED = "COMPLETED",
    ARCHIVED = "ARCHIVED"
}

export enum HubType {
    PRODUCT = "PRODUCT",
    DISCOVERY = "DISCOVERY",
    DESIGN = "DESIGN",
    CODING = "CODING",
    MARKETING = "MARKETING"
}

export type Project = {
    readonly id: string;
    readonly name: string;
    readonly description?: string;
    readonly domain: HubType;
    readonly status: ProjectStatus;
    readonly owner_id: string;
    readonly created_at: string;
    readonly updated_at: string;
}