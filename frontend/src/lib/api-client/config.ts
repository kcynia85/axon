export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const endpoints = {
    projects: {
        list: "/projects",
        detail: (id: string) => `/projects/${id}`,
    },
    agents: {
        chatStream: "/agents/chat/stream",
    }
};
