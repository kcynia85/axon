import { useAgentPosterState } from "../application/hooks/useAgentFormState";
import { LivePoster } from "./LivePoster";
import { CostEstimator } from "@/modules/agents/ui/CostEstimator";
import { useAgentCostEstimation } from "../application/hooks/useAgentCostEstimation";

export const ConnectedLivePoster = () => {
	const data = useAgentPosterState();
	const estimation = useAgentCostEstimation(data);

	return (
		<div className="mt-16 space-y-6 w-full max-w-sm flex flex-col items-center pb-8">
			<CostEstimator data={estimation} className="w-full" />
			<LivePoster data={data} />
		</div>
	);
};
