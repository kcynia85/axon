import { MetricBlock } from "@/shared/ui/complex/MetricBlock";
import { StyledList } from "@/shared/ui/complex/StyledList";
import type { AiSuggestionsProps } from "./CostEstimator.types";

/**
 * Pure View: Komponent wyświetlający listę rekomendacji optymalizacyjnych
 */
export const AiSuggestions = ({ suggestions }: AiSuggestionsProps) => {
	if (!suggestions || suggestions.length === 0) return null;

	return (
		<MetricBlock 
			label="AI Suggestions" 
			value={<StyledList items={suggestions} />} 
		/>
	);
};
