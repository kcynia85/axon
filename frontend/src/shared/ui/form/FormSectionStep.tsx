import type * as React from "react";
import { cn } from "@/shared/lib/utils";
import type { FormSectionStepProps } from "@/shared/types/form/FormPrimitives.types";

/**
 * FormSectionStep: Monospaced step indicator for the creation process.
 */
export const FormSectionStep = ({ number, className }: FormSectionStepProps) => (
	<div
		className={cn("font-mono text-sm font-bold text-zinc-200 mb-2", className)}
	>
		[{String(number).padStart(2, "0")}]
	</div>
);
