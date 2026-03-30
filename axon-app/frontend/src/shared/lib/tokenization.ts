import { getEncoding, encodingForModel, TiktokenModel } from "js-tiktoken";

export type TokenizationStrategy = "o200k_base" | "cl100k_base" | "llama" | "legacy" | "heuristic";

/**
 * countTokens: Counts tokens for a given text based on the selected strategy.
 */
export const countTokens = (text: string, strategy: TokenizationStrategy = "cl100k_base"): number => {
    if (!text) return 0;

    try {
        switch (strategy) {
            case "o200k_base":
                // o200k_base is used by GPT-4o
                const o200k = getEncoding("o200k_base");
                return o200k.encode(text).length;
            case "cl100k_base":
                const cl100k = getEncoding("cl100k_base");
                return cl100k.encode(text).length;
            case "heuristic":
                // Simple heuristic: 1 token ~= 4 characters
                return Math.ceil(text.length / 4);
            case "llama":
            case "legacy":
                // For now, use cl100k_base as a fallback for these until we have specific encoders
                const fallback = getEncoding("cl100k_base");
                return fallback.encode(text).length;
            default:
                return Math.ceil(text.length / 4);
        }
    } catch (error) {
        console.error("Tokenization failed, falling back to heuristic:", error);
        return Math.ceil(text.length / 4);
    }
};

/**
 * estimateCost: Estimates cost in USD based on token count and pricing per 1M tokens.
 */
export const estimateCost = (tokens: number, pricePer1MTokens: number): number => {
    return (tokens / 1_000_000) * pricePer1MTokens;
};
