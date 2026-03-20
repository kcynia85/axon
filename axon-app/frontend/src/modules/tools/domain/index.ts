export type Tool = {
    readonly id: string;
    readonly name: string;
    readonly description: string;
    readonly type: "NATIVE" | "MCP" | "FUNCTION";
    readonly status: "ACTIVE" | "INACTIVE";
}
