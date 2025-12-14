export interface Workflow {
    id: string;
    name: string;
    description: string;
    steps: number;
    lastRun: string;
    status: "IDLE" | "RUNNING" | "COMPLETED" | "FAILED";
}
