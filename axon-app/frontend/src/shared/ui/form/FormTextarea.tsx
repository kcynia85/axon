import * as React from "react";
import { cn } from "@/shared/lib/utils";
import type { FormTextareaProps } from "@/shared/types/form/FormPrimitives.types";

/**
 * FormTextarea: Large-scale parameter definition field.
 */
export const FormTextarea = React.forwardRef<
	HTMLTextAreaElement,
	FormTextareaProps
>(({ className, ...props }, ref) => (
	<textarea
		ref={ref}
		className={cn(
			"w-full bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-white/15 focus:border-zinc-900 dark:focus:border-primary/70 focus:ring-0 text-base leading-relaxed px-6 py-4 rounded-xl placeholder:text-zinc-400 dark:placeholder:text-zinc-500 resize-none transition-all text-zinc-900 dark:text-white shadow-inner",
			className,
		)}
		{...props}
	/>
));
FormTextarea.displayName = "FormTextarea";
