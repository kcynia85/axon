import { Tool } from "../../../domain";

export const MOCK_TOOLS: Tool[] = [
    {
        id: "search_knowledge",
        name: "Knowledge Search",
        description: "Semantically search the project's vector database for relevant memories and assets.",
        type: "NATIVE",
        status: "ACTIVE"
    },
    {
        id: "google_search",
        name: "Google Web Search",
        description: "Search the live internet for up-to-date information via Google API.",
        type: "FUNCTION",
        status: "ACTIVE"
    },
    {
        id: "github_mcp",
        name: "GitHub MCP",
        description: "Model Context Protocol server for interacting with GitHub repositories.",
        type: "MCP",
        status: "ACTIVE"
    },
    {
        id: "filesystem_mcp",
        name: "Filesystem MCP",
        description: "Safe access to the local filesystem for reading and writing files.",
        type: "MCP",
        status: "ACTIVE"
    }
];

export const getTools = async (): Promise<Tool[]> => {
    // Simulate API call
    return new Promise((resolve) => {
        setTimeout(() => resolve(MOCK_TOOLS), 500);
    });
};
