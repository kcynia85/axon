// Infrastructure wrapper for Prompts (delegates to Knowledge API for now)
import { Prompt } from "../../../domain";

/**
 * Mock API for Prompts since the original Knowledge module was removed.
 * TODO: Implement real API when backend is ready.
 */

export const getPrompts = async (): Promise<Prompt[]> => {
    // Return empty list or mock data
    return [
        {
            id: "mock-prompt-1",
            title: "Mock Prompt 1",
            content: "This is a mock prompt content",
            slug: "mock-prompt-1",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        }
    ];
};

export const createPrompt = async (data: Omit<Prompt, 'id' | 'created_at' | 'updated_at' | 'type' | 'domain' | 'metadata'>): Promise<Prompt> => {
    return {
        ...data,
        id: Math.random().toString(36).substring(7),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    } as Prompt;
};

export const updatePrompt = async (id: string, data: Partial<Prompt>): Promise<Prompt> => {
    return {
        id,
        title: data.title || "Updated Title",
        content: data.content || "Updated Content",
        slug: data.slug || "updated-slug",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    } as Prompt;
};

export const deletePrompt = async (id: string): Promise<void> => {
    console.log("Delete prompt", id);
};
