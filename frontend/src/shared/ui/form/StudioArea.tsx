import * as React from "react";
import { cn } from "@/shared/lib/utils";
import type { StudioAreaProps } from "@/shared/types/form/StudioPrimitives.types";

/**
 * StudioArea: Large-scale parameter definition field.
 */
export const StudioArea = React.forwardRef<
	HTMLTextAreaElement,
	StudioAreaProps
>(({ className, ...props }, ref) => (
	<textarea
		ref={ref}
		className={cn(
			"w-full bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 focus:border-zinc-900 dark:focus:border-zinc-200 focus:ring-0 text-base leading-relaxed px-6 py-4 rounded-xl placeholder:text-zinc-400 dark:placeholder:text-zinc-700 resize-none transition-all text-zinc-900 dark:text-white shadow-inner",
			className,
		)}
		{...props}
	/>
));
StudioArea.displayName = "StudioArea";
