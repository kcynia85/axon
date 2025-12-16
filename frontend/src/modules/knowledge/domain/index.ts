export type Asset = {
    readonly id: string;
    readonly slug: string;
    readonly title: string;
    readonly type: string;
    readonly content: string;
    readonly domain: string;
    readonly metadata: Record<string, unknown>;
    readonly created_at: string;
    readonly updated_at: string;
}

export type Memory = {
    readonly id: string;
    readonly fact: string;
    readonly created_at: string;
}