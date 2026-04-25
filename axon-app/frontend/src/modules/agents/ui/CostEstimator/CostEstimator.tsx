import { cn } from "@/shared/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/ui/ui/Card";
import { MetricProgressBar } from "@/shared/ui/complex/MetricProgressBar";
import { MetricBlock } from "@/shared/ui/complex/MetricBlock";
import type { CostEstimatorProps } from "./CostEstimator.types";
import { AiSuggestions } from "./AiSuggestions";
import { CostDetailsAccordion } from "./CostDetailsAccordion";
import { useCostEstimatorView } from "./useCostEstimatorView";

/**
 * CostEstimator: Czysty widok (Pure View) kompozycyjny wykorzystujący generyczne klocki UI.
 * Cała logika formatowania znajduje się w hooku (oddzielenie logiki biznesowej od widoku).
 */
export const CostEstimator = ({ data, className }: CostEstimatorProps) => {
	const viewData = useCostEstimatorView(data);

	return (
		<Card className={cn("w-full bg-white dark:bg-zinc-950", className)}>
			<CardHeader className="pt-8 pb-6">
				<CardTitle className="text-xl font-bold text-zinc-900 dark:text-white">
					Estymator Kosztów
				</CardTitle>
			</CardHeader>
			
			<CardContent className="space-y-8">
				<AiSuggestions suggestions={data.suggestions} />

				<MetricBlock
					label="Koszt per działanie"
					value={`Średni (${viewData.avgCostFormatted})`}
				/>

				<MetricProgressBar
					label="Zużycie kontekstu (System Prompt)"
					percentage={viewData.contextPercentage}
					valueLabel={viewData.contextLabel}
				/>

				<CostDetailsAccordion
					staticCosts={data.staticCosts}
					dynamicCosts={data.dynamicCosts}
					memoryAllocation={data.memoryAllocation}
				/>
			</CardContent>
		</Card>
	);
};
