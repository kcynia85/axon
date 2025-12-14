export interface Asset {
    id: string;
    slug: string;
    title: string;
    type: string;
    content?: string;
}

export interface Memory {
    id: string;
    fact: string;
}