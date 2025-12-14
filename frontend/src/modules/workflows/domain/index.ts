export interface Workflow {
    id: string;
    name: string;
    steps: any[];
    status: "IDLE" | "RUNNING" | "COMPLETED";
}
