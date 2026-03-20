import type * as React from "react";
import { cn } from "@/shared/lib/utils";
import type { StudioActionBarProps } from "../../../types/layout.types";

export const StudioActionBar = ({
	children,
	className,
}: StudioActionBarProps) => {
	return (
		<footer
			className={cn(
				"fixed bottom-0 inset-x-0 h-20 border-t border-zinc-900 bg-black/95 backdrop-blur-xl z-[100] flex items-center justify-end px-8 shrink-0",
				className,
			)}
		>
			{children}
		</footer>
	);
};
