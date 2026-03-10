"use client";

import type * as React from "react";
import { cn } from "@/shared/lib/utils";
import type { StudioLayoutProps } from "../../types/layout.types";
import { StudioSidebar } from "./components/StudioSidebar";
import { StudioCanvas } from "./components/StudioCanvas";
import { StudioActionBar } from "./components/StudioActionBar";

/**
 * StudioLayout: The foundational 3-column architecture for all Studio editors.
 */
export const StudioLayout = ({
	navigator,
	canvas,
	poster,
	footer,
	exitButton,
	canvasRef,
	className,
}: StudioLayoutProps) => {
	return (
		<div
			className={cn(
				"h-screen w-screen bg-black text-white selection:bg-primary selection:text-black overflow-hidden flex flex-col font-sans relative",
				className,
			)}
		>
			<main className="flex-1 overflow-hidden grid grid-cols-[280px_1fr_400px] gap-0">
				<StudioSidebar position="left">
					<div className="space-y-12">
						<div className="mb-12">{exitButton}</div>
						{navigator}
					</div>
				</StudioSidebar>

				<StudioCanvas canvasRef={canvasRef}>{canvas}</StudioCanvas>

				<StudioSidebar position="right">
					<div className="w-full flex justify-center">{poster}</div>
				</StudioSidebar>
			</main>

			<StudioActionBar>{footer}</StudioActionBar>
		</div>
	);
};
