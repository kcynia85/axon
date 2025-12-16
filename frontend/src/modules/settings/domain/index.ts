export type LLMProvider = "google" | "openai" | "anthropic" | "ollama";

export type LLMConfig = {
    readonly id: string;
    readonly provider: LLMProvider;
    readonly model: string;
    readonly apiKey?: string; // Masked
    readonly isDefault?: boolean;
    readonly status: "ACTIVE" | "INACTIVE";
};
