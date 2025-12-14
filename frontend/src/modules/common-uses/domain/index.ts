export interface Scenario {
    id: string;
    title: string;
    description: string;
    category: string;
    promptTemplate: string;
    icon?: string; // Optional icon name
}