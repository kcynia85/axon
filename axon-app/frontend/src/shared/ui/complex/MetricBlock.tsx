import * as React from "react";
import { cn } from "@/shared/lib/utils";

export type MetricBlockProps = {
	readonly label: React.ReactNode;
	readonly value: React.ReactNode;
	readonly className?: string;
};

/**
 * Generyczny blok prezentujący pionowo zestawienie Etykieta - Wartość.
 */
export const MetricBlock = ({ label, value, className }: MetricBlockProps) => {
	return (
		<div className={cn("space-y-2", className)}>
			<h3 className="font-bold text-base text-zinc-900 dark:text-white">
				{label}
			</h3>
			<div className="text-sm text-zinc-500 font-medium">{value}</div>
		</div>
	);
};
