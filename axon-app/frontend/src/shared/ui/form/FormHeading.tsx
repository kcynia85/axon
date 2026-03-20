import type * as React from "react";
import { cn } from "@/shared/lib/utils";
import type { FormHeadingProps } from "@/shared/types/form/FormPrimitives.types";

/**
 * FormHeading: The standard typography for workspace titles.
 */
export const FormHeading = ({ children, className }: FormHeadingProps) => (
	<h2
		className={cn(
			"text-2xl md:text-3xl font-bold font-display tracking-tighter mb-8",
			className,
		)}
	>
		{children}
	</h2>
);
