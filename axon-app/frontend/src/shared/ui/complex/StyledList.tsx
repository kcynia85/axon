import * as React from "react";
import { cn } from "@/shared/lib/utils";

export type StyledListProps = {
	readonly items: readonly React.ReactNode[];
	readonly className?: string;
};

/**
 * Generyczna lista (ul/li) ze stylowanymi elementami list.
 */
export const StyledList = ({ items, className }: StyledListProps) => {
	if (!items || items.length === 0) return null;

	return (
		<ul className={cn("space-y-1", className)}>
			{items.map((item, index) => (
				<li key={index} className="text-sm text-zinc-500 font-medium">
					{item}
				</li>
			))}
		</ul>
	);
};
