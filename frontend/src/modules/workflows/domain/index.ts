export interface Workflow {
    id: string;
    title: string;
    description: string;
    status: 'ACTIVE' | 'DRAFT' | 'ARCHIVED';
    stepsCount: number;
    lastRun?: string;
}