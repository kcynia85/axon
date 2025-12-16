export type Workflow = {
    readonly id: string;
    readonly title: string;
    readonly description: string;
    readonly status: 'ACTIVE' | 'DRAFT' | 'ARCHIVED';
    readonly stepsCount: number;
    readonly lastRun?: string;
}
