export type TokenUsage = {
	readonly current: number;
	readonly total: number;
};

export type StaticCostEntry = {
	readonly label: string;
	readonly cost: number;
};

export type DynamicCostEntry = {
	readonly label: string;
	readonly tokenCount: string;
	readonly cost: number;
};

export type MemoryAllocationEntry = {
	readonly label: string;
	readonly size: string;
};

export type CostEstimatorData = {
	readonly averageCostPerAction: number;
	readonly contextUsage: TokenUsage;
	readonly suggestions: readonly string[];
	readonly staticCosts: readonly StaticCostEntry[];
	readonly dynamicCosts: readonly DynamicCostEntry[];
	readonly memoryAllocation: readonly MemoryAllocationEntry[];
};

export type CostEstimatorProps = {
	readonly data: CostEstimatorData;
	readonly className?: string;
};

// UI-only types kept specific for Pure Views
export type AiSuggestionsProps = {
	readonly suggestions?: readonly string[];
};

export type CostDetailsAccordionProps = {
	readonly staticCosts: readonly StaticCostEntry[];
	readonly dynamicCosts: readonly DynamicCostEntry[];
	readonly memoryAllocation: readonly MemoryAllocationEntry[];
};
