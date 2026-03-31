import * as React from "react";
import { cn } from "@/shared/lib/utils";
import type { FormTextFieldProps } from "@/shared/types/form/FormPrimitives.types";

/**
 * FormTextField: High-impact parameter definition field.
 */
export const FormTextField = React.forwardRef<HTMLInputElement, FormTextFieldProps>(
	({ className, ...props }, ref) => (
		<input
			ref={ref}
			className={cn(
				"w-full bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-white/15 focus:border-zinc-900 dark:focus:border-primary/70 focus:ring-0 text-base font-bold p-4 rounded-xl placeholder:text-zinc-400 dark:placeholder:text-zinc-500 transition-all text-zinc-900 dark:text-white shadow-inner",
				className,
			)}
			{...props}
		/>
	),
);
FormTextField.displayName = "FormTextField";
