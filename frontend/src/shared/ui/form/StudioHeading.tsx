import type * as React from "react";
import { cn } from "@/shared/lib/utils";
import type { StudioHeadingProps } from "@/shared/types/form/StudioPrimitives.types";

/**
 * StudioHeading: The standard typography for workspace titles.
 */
export const StudioHeading = ({ children, className }: StudioHeadingProps) => (
	<h2
		className={cn(
			"text-2xl md:text-3xl font-bold font-display tracking-tighter mb-8",
			className,
		)}
	>
		{children}
	</h2>
);
