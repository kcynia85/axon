import { useAgentPosterState } from "../application/hooks/useAgentFormState";
import { LivePoster } from "./LivePoster";
import { CostEstimator } from "@/modules/agents/ui/CostEstimator";
import type { CostEstimatorData } from "@/modules/agents/ui/CostEstimator";

const MOCK_ESTIMATOR_DATA: CostEstimatorData = {
	averageCostPerAction: 0.7,
	contextUsage: {
		current: 4256,
		total: 128000,
	},
	suggestions: ["Zmień model na GPT-4o-mini", "Wyłącz RAG"],
	staticCosts: [
		{ label: "Inicjalizacja Agenta (Setup)", cost: 0.005 },
		{ label: "Koszt użycia RAG (1 Hub)", cost: 0.008 },
		{ label: "Koszt wywołania Narzędzi (2)", cost: 0.002 },
	],
	dynamicCosts: [
		{ label: "Tokeny Wejściowe (Prompt)", tokenCount: "~15k", cost: 0.025 },
		{ label: "Tokeny Wyjściowe (Odpowiedź)", tokenCount: "~2k", cost: 0.008 },
	],
	memoryAllocation: [
		{ label: "System", size: "1.2k" },
		{ label: "Guardrails", size: "2.5k" },
	],
};

export const ConnectedLivePoster = () => {
	const data = useAgentPosterState();
	return (
		<div className="mt-16 space-y-6 w-full max-w-sm flex flex-col items-center pb-8">
			<CostEstimator data={MOCK_ESTIMATOR_DATA} className="w-full" />
			<LivePoster data={data} />
		</div>
	);
};
