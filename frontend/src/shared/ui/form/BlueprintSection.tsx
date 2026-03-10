import type * as React from "react";
import { cn } from "@/shared/lib/utils";
import type { BlueprintSectionProps } from "@/shared/types/form/StudioPrimitives.types";
import { SectionStep } from "./SectionStep";
import { StudioHeading } from "./StudioHeading";

/**
 * BlueprintSection: A functional architectural segment of the agent blueprint.
 */
export const BlueprintSection = ({
	id,
	number,
	title,
	children,
	className,
}: BlueprintSectionProps) => (
	<section
		id={id}
		className={cn(
			"min-h-[60vh] py-24 border-b border-zinc-800 last:border-0 scroll-mt-24",
			className,
		)}
	>
		<SectionStep number={number} />
		<StudioHeading className="text-white">{title}</StudioHeading>
		<div className="max-w-4xl">{children}</div>
	</section>
);
