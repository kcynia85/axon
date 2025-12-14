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

export interface Project {
    id: string;
    name: string;
    description?: string;
    domain: HubType;
    status: ProjectStatus;
    owner_id: string;
    created_at: string;
    updated_at: string;
}
