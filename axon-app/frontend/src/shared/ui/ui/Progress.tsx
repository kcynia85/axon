import * as React from "react";
import { cn } from "@/shared/lib/utils";

export type ProgressProps = React.HTMLAttributes<HTMLDivElement> & {
	readonly value?: number;
};

/**
 * Generyczny komponent paska postępu (UI Primitive).
 */
export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
	({ className, value = 0, ...props }, ref) => {
		// Zabezpieczenie przed wartościami spoza zakresu 0-100
		const safeValue = Math.min(Math.max(value, 0), 100);

		return (
			<div
				ref={ref}
				className={cn(
					"relative h-2 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800",
					className
				)}
				{...props}
			>
				<div
					className="h-full bg-primary transition-all duration-500 ease-out"
					style={{ width: `${safeValue}%` }}
				/>
			</div>
		);
	}
);

Progress.displayName = "Progress";
