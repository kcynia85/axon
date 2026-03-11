import type * as React from "react";
import { cn } from "@/shared/lib/utils";
import type { FormSectionProps } from "@/shared/types/form/FormPrimitives.types";
import { FormSectionStep } from "./FormSectionStep";
import { FormHeading } from "./FormHeading";

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
		<FormSectionStep number={number} />
		<FormHeading className="text-zinc-200 mb-3">{title}</FormHeading>
		{description ? (
			<p className="text-sm font-mono text-zinc-500 mb-12">*Hint: {description}</p>
		) : (
			<div className="mb-12" />
		)}
		<div className="max-w-4xl">{children}</div>
	</section>
);
