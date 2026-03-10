import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/shared/lib/utils";

export type NativeAccordionProps = React.DetailsHTMLAttributes<HTMLDetailsElement> & {
	readonly title: React.ReactNode;
	readonly children: React.ReactNode;
};

/**
 * Lekki, w pełni natywny akordeon (Zero-JS) oparty o elementy <details> i <summary>.
 */
export const NativeAccordion = React.forwardRef<
	HTMLDetailsElement,
	NativeAccordionProps
>(({ className, title, children, ...props }, ref) => {
	return (
		<details
			ref={ref}
			className={cn("group [&_summary::-webkit-details-marker]:hidden", className)}
			{...props}
		>
			<summary className="flex items-center gap-2 cursor-pointer list-none font-bold text-base text-zinc-900 dark:text-white mb-4 outline-none">
				{title}
				<ChevronDown className="w-4 h-4 text-zinc-500 transition-transform group-open:rotate-180" />
			</summary>

			<div className="space-y-4 pt-2 pb-2 text-sm text-zinc-500">
				{children}
			</div>
		</details>
	);
});

NativeAccordion.displayName = "NativeAccordion";
