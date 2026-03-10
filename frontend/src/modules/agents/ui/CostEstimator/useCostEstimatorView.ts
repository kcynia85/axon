import { useMemo } from "react";
import type { CostEstimatorProps } from "./CostEstimator.types";

/**
 * Logika biznesowa: Przygotowuje dane i wyliczenia dla Pure View estymatora kosztów.
 */
export const useCostEstimatorView = (data: CostEstimatorProps["data"]) => {
	return useMemo(() => {
		const avgCostFormatted = `$${data.averageCostPerAction.toFixed(2)}`;
		
		const contextPercentage = data.contextUsage.total > 0 
			? Math.min((data.contextUsage.current / data.contextUsage.total) * 100, 100) 
			: 0;
			
		const contextLabel = `${data.contextUsage.current.toLocaleString()} / ${data.contextUsage.total.toLocaleString()} tokenów`;

		return {
			avgCostFormatted,
			contextPercentage,
			contextLabel,
		};
	}, [data]);
};
