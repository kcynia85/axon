import type * as React from "react";
import { cn } from "@/shared/lib/utils";
import type { StudioCanvasProps } from "../../../types/layout.types";

export const StudioCanvas = ({
	children,
	canvasRef,
	className,
}: StudioCanvasProps) => {
	return (
		<div
			ref={canvasRef}
			className={cn(
				"h-full overflow-y-auto custom-scrollbar scroll-smooth bg-zinc-950/10",
				className,
			)}
		>
			{children}
		</div>
	);
};
