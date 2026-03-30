import { useMemo } from "react";
import { CreateAgentFormData } from "@/modules/agents/domain/agent.schema";
import { useLLMModel, useLLMProviders } from "@/modules/settings/application/useSettings";
import { countTokens, estimateCost, TokenizationStrategy } from "@/shared/lib/tokenization";
import { CostEstimatorData } from "@/modules/agents/ui/CostEstimator";

export const useAgentCostEstimation = (formData: Partial<CreateAgentFormData>): CostEstimatorData => {
	const { data: model } = useLLMModel(formData.llm_model_id || undefined);
	const { data: providers } = useLLMProviders();

	const provider = useMemo(() => {
		if (!model || !providers) return null;
		return providers.find(p => p.id === model.llm_provider_id);
	}, [model, providers]);

	const estimation = useMemo(() => {
		// Default mock-like fallback if no model selected
		if (!formData.llm_model_id || !model) {
			return {
				averageCostPerAction: 0,
				contextUsage: { current: 0, total: 4096 },
				suggestions: ["Select a model to see cost estimation"],
				staticCosts: [],
				dynamicCosts: [],
				memoryAllocation: []
			};
		}

		// 1. Determine Tokenization Strategy
		// For now, we take it from provider custom config or default to cl100k_base
		const strategy: TokenizationStrategy = (provider?.provider_custom_config?.tokenization_strategy as TokenizationStrategy) || "cl100k_base";

		// 2. Calculate Prompt Tokens
		const roleText = formData.agent_role_text || "";
		const goalText = formData.agent_goal || "";
		const backstoryText = formData.agent_backstory || "";
		const instructions = formData.guardrails?.instructions?.join("\n") || "";
		const constraints = formData.guardrails?.constraints?.join("\n") || "";

		const fullPrompt = `${roleText}\n${goalText}\n${backstoryText}\n${instructions}\n${constraints}`;
		const inputTokens = countTokens(fullPrompt, strategy);

		// 3. Calculate Costs
		const inputPrice1M = model.model_pricing_config?.input || 0;
		const outputPrice1M = model.model_pricing_config?.output || 0;

		const inputCost = estimateCost(inputTokens, inputPrice1M);
		
		// For "Average Cost Per Action", we assume some average output (e.g. 500 tokens)
		const avgOutputTokens = 500;
		const outputCost = estimateCost(avgOutputTokens, outputPrice1M);
		
		const avgTotalCost = inputCost + outputCost;

		// 4. Build Static Costs (Mocked for now as placeholders)
		const staticCosts = [
			{ label: "Agent Setup", cost: 0.001 },
		];

		if (formData.knowledge_hub_ids && formData.knowledge_hub_ids.length > 0) {
			staticCosts.push({ label: `RAG Usage (${formData.knowledge_hub_ids.length} Hubs)`, cost: 0.005 });
		}

		return {
			averageCostPerAction: avgTotalCost + staticCosts.reduce((acc, curr) => acc + curr.cost, 0),
			contextUsage: {
				current: inputTokens,
				total: model.model_context_window || 4096,
			},
			suggestions: inputTokens > 2000 ? ["Consider a shorter prompt", "Use a cheaper model"] : [],
			staticCosts,
			dynamicCosts: [
				{ label: "Input Tokens (Prompt)", tokenCount: `~${inputTokens}`, cost: inputCost },
				{ label: "Estimated Output (Avg)", tokenCount: `~${avgOutputTokens}`, cost: outputCost },
			],
			memoryAllocation: [
				{ label: "System Prompt", size: `${(inputTokens / 1000).toFixed(1)}k` },
			],
		};
	}, [formData, model, provider]);

	return estimation;
};
