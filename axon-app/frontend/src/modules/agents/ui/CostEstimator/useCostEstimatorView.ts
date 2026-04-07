import type { CostEstimatorProps } from "./CostEstimator.types";

/**
 * Logika biznesowa: Przygotowuje dane i wyliczenia dla Pure View estymatora kosztów.
 * Standard: Application hook, Zero manual memoization.
 */
export const useCostEstimatorView = (estimatorData: CostEstimatorProps["data"]) => {
	const averageCostFormatted = `$${estimatorData.averageCostPerAction.toFixed(2)}`;

	const contextPercentage = estimatorData.contextUsage.total > 0 
		? Math.min((estimatorData.contextUsage.current / estimatorData.contextUsage.total) * 100, 100) 
		: 0;

	const contextLabel = `${estimatorData.contextUsage.current.toLocaleString()} / ${estimatorData.contextUsage.total.toLocaleString()} tokenów`;

	return {
		averageCostFormatted,
		contextPercentage,
		contextLabel,
	};
};
