import { Progress } from "@/shared/ui/ui/Progress";
import { cn } from "@/shared/lib/utils";
import * as React from "react";

export type MetricProgressBarProps = {
	readonly label: React.ReactNode;
	readonly percentage: number;
	readonly valueLabel?: React.ReactNode;
	readonly className?: string;
};

/**
 * Komponent wyższego rzędu scalający etykietę, natywny Progress Bar oraz formatowanie metryki.
 * Zgodnie z Pure View, nie wykonuje obliczeń - przyjmuje jedynie gotowe wartości.
 */
export const MetricProgressBar = ({
	label,
	percentage,
	valueLabel,
	className,
}: MetricProgressBarProps) => {
	return (
		<div className={cn("space-y-2 w-full", className)}>
			<div className="font-bold text-base text-zinc-900 dark:text-white">
				{label}
			</div>
			
			<Progress value={percentage} />
			
			{valueLabel && (
				<div className="text-sm font-mono text-zinc-500">
					{valueLabel}
				</div>
			)}
		</div>
	);
};
