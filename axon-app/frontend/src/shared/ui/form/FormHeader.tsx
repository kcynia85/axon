import type * as React from "react";
import { cn } from "@/shared/lib/utils";
import type { FormHeaderProps } from "@/shared/types/form/FormPrimitives.types";

/**
 * FormHeader: A unified header component for form sections in Studio.
 * Includes an optional eyebrow, a main title, and a hint paragraph.
 */
export const FormHeader = ({
	eyebrow,
	title,
	description,
	actions,
	className,
}: FormHeaderProps) => (
	<div className={cn("mb-12 flex items-start justify-between gap-4", className)}>
		<div>
			{eyebrow && (
				<span className="text-[10px] font-mono tracking-[0.2em] text-zinc-500 uppercase mb-4 block">
					{eyebrow}
				</span>
			)}
			<h2 className="text-2xl md:text-3xl font-bold font-display tracking-tighter text-zinc-100 mb-3">
				{title}
			</h2>
			{description && (
				<p className="text-base font-mono text-zinc-500">
					{description}
				</p>
			)}
		</div>
		{actions && (
			<div className="flex items-center gap-3 pt-4">
				{actions}
			</div>
		)}
	</div>
);
