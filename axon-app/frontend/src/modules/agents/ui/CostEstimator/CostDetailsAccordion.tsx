import { NativeAccordion } from "@/shared/ui/ui/NativeAccordion";
import { PropertyRow } from "@/shared/ui/ui/PropertyRow";
import { PropertyGroup } from "@/shared/ui/complex/PropertyGroup";
import type { CostDetailsAccordionProps } from "./CostEstimator.types";

/**
 * Pure View: Detale estymatora kosztów z wykorzystaniem generycznych UI Primitives
 */
export const CostDetailsAccordion = ({
	staticCosts,
	dynamicCosts,
	memoryAllocation,
}: CostDetailsAccordionProps) => {
	return (
		<NativeAccordion title="Pokaż Szczegóły">
			{/* Koszt Statyczny */}
			{staticCosts && staticCosts.length > 0 && (
				<PropertyGroup title="Koszt Statyczny:">
					{staticCosts.map((item) => (
						<PropertyRow
							key={item.label}
							label={item.label}
							value={`$${item.cost.toFixed(3)}`}
							valueMono
						/>
					))}
				</PropertyGroup>
			)}

			{/* Koszt Dynamiczny */}
			{dynamicCosts && dynamicCosts.length > 0 && (
				<PropertyGroup title="Koszt Dynamiczny:">
					{dynamicCosts.map((item) => (
						<PropertyRow
							key={item.label}
							label={item.label}
							value={
								<div className="flex justify-end gap-4 min-w-[140px]">
									<span className="w-[80px] text-right">{item.tokenCount}</span>
									<span className="w-[60px] text-right">${item.cost.toFixed(3)}</span>
								</div>
							}
							valueMono
						/>
					))}
				</PropertyGroup>
			)}

			{/* Alokacja Pamięci Agenta */}
			{memoryAllocation && memoryAllocation.length > 0 && (
				<PropertyGroup title="Alokacja Pamięci Agenta:">
					{memoryAllocation.map((item) => (
						<PropertyRow
							key={item.label}
							label={item.label}
							value={item.size}
							valueMono
						/>
					))}
				</PropertyGroup>
			)}
		</NativeAccordion>
	);
};
