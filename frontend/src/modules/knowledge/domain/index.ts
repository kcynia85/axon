export interface Asset {
    id: string;
    slug: string;
    title: string;
    type: string;
    content: string;
    domain: string;
    metadata: Record<string, any>;
    created_at: string;
    updated_at: string;
}

export interface Memory {
    id: string;
    fact: string;
    created_at: string;
}
