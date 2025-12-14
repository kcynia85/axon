export interface Tool {
    id: string;
    name: string;
    description: string;
    type: "NATIVE" | "MCP" | "FUNCTION";
    status: "ACTIVE" | "INACTIVE";
}