import type * as React from "react";
import { cn } from "@/shared/lib/utils";
import type { StudioSidebarProps } from "../../../types/layout.types";

export const StudioSidebar = ({
	children,
	position,
	className,
}: StudioSidebarProps) => {
	const positionClasses =
		position === "left"
			? "border-r border-zinc-900 bg-black"
			: "border-l border-zinc-900 bg-zinc-950/20";

	return (
		<aside
			className={cn(
				"h-full overflow-y-auto custom-scrollbar scroll-smooth p-8 flex flex-col",
				positionClasses,
				className,
			)}
		>
			{children}
		</aside>
	);
};
