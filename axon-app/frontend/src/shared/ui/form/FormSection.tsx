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
}: FormSectionProps) => (
	<section
		id={id}
		className={cn(
			"min-h-[60vh] py-24 border-b border-zinc-800 last:border-0 scroll-mt-24",
			className,
		)}
	>
		<FormHeader
			eyebrow={`[${String(number).padStart(2, "0")}]`}
			title={title}
			description={description}
		/>
		<div className="max-w-4xl">{children}</div>
	</section>
);
