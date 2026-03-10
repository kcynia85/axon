import type * as React from "react";
import { cn } from "@/shared/lib/utils";
import type { ProgressTrackProps } from "../../../types/primitives.types";

export const ProgressTrack = ({
	current,
	total,
	isActive,
	className,
}: ProgressTrackProps) => {
	const percentage = total > 0 ? (current / total) * 100 : 0;

	return (
		<div
			className={cn(
				"h-[2px] w-full bg-zinc-900 overflow-hidden rounded-full",
				className,
			)}
		>
			<div
				className={cn(
					"h-full transition-all duration-700 ease-out",
					isActive ? "bg-primary" : "bg-zinc-700",
				)}
				style={{ width: `${percentage}%` }}
			/>
		</div>
	);
};
