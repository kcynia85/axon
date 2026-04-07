export type Prompt = {
    readonly id: string;
    readonly title: string;
    readonly content: string;
    readonly slug: string;
    readonly type?: string;
    readonly domain?: string;
    readonly metadata?: Record<string, any>;
    readonly created_at: string;
    readonly updated_at: string;
};
