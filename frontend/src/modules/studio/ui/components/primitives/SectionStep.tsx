import type * as React from "react";
import { cn } from "@/shared/lib/utils";
import type { SectionStepProps } from "../../../types/primitives.types";

/**
 * SectionStep: Monospaced step indicator for the creation process.
 */
export const SectionStep = ({ number, className }: SectionStepProps) => (
	<div
		className={cn("font-mono text-sm font-bold text-zinc-500 mb-2", className)}
	>
		[{String(number).padStart(2, "0")}]
	</div>
);
