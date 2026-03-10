import * as React from "react";
import { cn } from "@/shared/lib/utils";

export type PropertyGroupProps = {
	readonly title?: React.ReactNode;
	readonly children: React.ReactNode;
	readonly className?: string;
};

/**
 * Generyczna grupa grupująca wiersze właściwości (np. PropertyRow), opcjonalnie z nagłówkiem.
 */
export const PropertyGroup = ({ title, children, className }: PropertyGroupProps) => {
	return (
		<div className={cn("space-y-1 mb-6 last:mb-0", className)}>
			{title && (
				<h4 className="font-medium text-zinc-600 dark:text-zinc-400 mb-2">
					{title}
				</h4>
			)}
			{children}
		</div>
	);
};
