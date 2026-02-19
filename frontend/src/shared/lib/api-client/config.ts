export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const endpoints = {
    projects: {
        list: "/projects/",
        detail: (id: string) => `/projects/${id}`,
    },
    agents: {
        chatStream: "/agents/chat/stream",
    }
};

const createApiClient = (baseUrl: string) => {
    const get = async (path: string, options?: RequestInit) => {
        const res = await fetch(`${baseUrl}${path}`, {
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
    };

    const post = async (path: string, body: unknown, options?: RequestInit) => {
        const res = await fetch(`${baseUrl}${path}`, {
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
    };

    const put = async (path: string, body: unknown, options?: RequestInit) => {
        const res = await fetch(`${baseUrl}${path}`, {
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
    };

    const patch = async (path: string, body?: unknown, options?: RequestInit) => {
        const res = await fetch(`${baseUrl}${path}`, {
            ...options,
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                ...options?.headers,
            },
            body: body ? JSON.stringify(body) : undefined,
        });

        if (!res.ok) {
            throw new Error(`API Error: ${res.statusText}`);
        }

        return res;
    };
    const del = async (path: string, options?: RequestInit) => {
        const res = await fetch(`${baseUrl}${path}`, {
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
    };

    return {
        get,
        post,
        put,
        patch,
        delete: del,
    };
};

export const apiClient = createApiClient(API_BASE_URL);
