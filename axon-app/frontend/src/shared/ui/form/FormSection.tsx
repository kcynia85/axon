import type * as React from "react";
import { cn } from "@/shared/lib/utils";
import type { FormSectionProps } from "@/shared/types/form/FormPrimitives.types";
import { FormHeader } from "./FormHeader";

/**
 * FormSection: A functional architectural segment of the agent blueprint.
 */
export const FormSection = ({
	id,
	number,
	title,
	description,
	children,
	className,
	variant = "default",
}: FormSectionProps) => {
	const isIsland = variant === "island";

	const header = (
		<FormHeader
			eyebrow={`[${String(number).padStart(2, "0")}]`}
			title={title}
			description={description}
		/>
	);

	if (isIsland) {
		return (
			<div id={id} className="space-y-8 scroll-mt-24">
				{header}
				<section
					className={cn(
						"bg-[#0a0a0c] p-8 md:p-10 rounded-3xl border border-white/[0.02] shadow-2xl hover:bg-[#0d0d0f] transition-all duration-300 w-full",
						className,
					)}
				>
					<div className="w-full">
						{children}
					</div>
				</section>
			</div>
		);
	}

	return (
		<section
			id={id}
			className={cn(
				"min-h-[60vh] py-24 border-b border-zinc-800 last:border-0 scroll-mt-24",
				className,
			)}
		>
			{header}
			<div className="max-w-4xl">
				{children}
			</div>
		</section>
	);
};
