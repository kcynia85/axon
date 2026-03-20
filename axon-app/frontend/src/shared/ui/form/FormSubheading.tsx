import type * as React from "react";
import { cn } from "@/shared/lib/utils";
import type { FormSubheadingProps } from "@/shared/types/form/FormPrimitives.types";

export const FormSubheading = ({ children, className }: FormSubheadingProps) => (
	<h3 className={cn("text-lg font-mono text-zinc-200", className)}>
		{children}
	</h3>
);
