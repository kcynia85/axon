export type Scenario = {
    readonly id: string;
    readonly title: string;
    readonly description: string;
    readonly category: string;
    readonly promptTemplate: string;
    readonly icon?: string; // Optional icon name
}
