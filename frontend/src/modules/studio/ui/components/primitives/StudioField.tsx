import * as React from "react";
import { cn } from "@/shared/lib/utils";

/**
 * StudioField: High-impact parameter definition field.
 */
export const StudioField = React.forwardRef<
	HTMLInputElement,
	React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
	<input
		ref={ref}
		className={cn(
			"w-full bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 focus:border-zinc-900 dark:focus:border-zinc-200 focus:ring-0 text-base font-bold p-6 rounded-xl placeholder:text-zinc-400 dark:placeholder:text-zinc-700 transition-all text-zinc-900 dark:text-white shadow-inner",
			className,
		)}
		{...props}
	/>
));
StudioField.displayName = "StudioField";
