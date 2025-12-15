export type LLMProvider = "google" | "openai" | "anthropic" | "ollama";

export interface LLMConfig {
    id: string;
    provider: LLMProvider;
    model: string;
    apiKey?: string; // Masked
    isDefault?: boolean;
    status: "ACTIVE" | "INACTIVE";
}