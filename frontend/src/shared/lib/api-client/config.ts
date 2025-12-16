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

class ApiClient {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    async get(path: string, options?: RequestInit) {
        const res = await fetch(`${this.baseUrl}${path}`, {
            ...options,
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                ...options?.headers,
            },
        });
        
        if (!res.ok) {
            throw new Error(`API Error: ${res.statusText}`);
        }
        
        return res;
    }

    async post(path: string, body: unknown, options?: RequestInit) {
        const res = await fetch(`${this.baseUrl}${path}`, {
            ...options,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...options?.headers,
            },
            body: JSON.stringify(body),
        });

        if (!res.ok) {
            throw new Error(`API Error: ${res.statusText}`);
        }

        return res;
    }

    async put(path: string, body: unknown, options?: RequestInit) {
        const res = await fetch(`${this.baseUrl}${path}`, {
            ...options,
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                ...options?.headers,
            },
            body: JSON.stringify(body),
        });

        if (!res.ok) {
            throw new Error(`API Error: ${res.statusText}`);
        }

        return res;
    }

    async delete(path: string, options?: RequestInit) {
        const res = await fetch(`${this.baseUrl}${path}`, {
            ...options,
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                ...options?.headers,
            },
        });

        if (!res.ok) {
            throw new Error(`API Error: ${res.statusText}`);
        }

        return res;
    }
}

export const apiClient = new ApiClient(API_BASE_URL);