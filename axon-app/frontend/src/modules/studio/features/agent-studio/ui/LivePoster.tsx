"use client";

import { WorkspaceCard } from "@/shared/ui/complex/WorkspaceCard";
import type { LivePosterProps } from "../../types/components.types";
import { useLivePoster } from "../application/hooks/useLivePoster";

export const LivePoster = (props: LivePosterProps) => {
	const { data } = useLivePoster(props);

	return (
		<div className="w-full animate-in fade-in slide-in-from-right-8 duration-700">
			<div className="relative group">
				<div className="absolute -inset-4 bg-primary/20 rounded-[2.5rem] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

				<WorkspaceCard
					title={data.agent_name || "New Agent"}
					badgeLabel={data.agent_role_text || "Define Role"}
					description={data.agent_goal}
					href="#"
					variant="agent"
					layout="grid"
					tags={data.agent_keywords}
					visualArea={
						data.agent_visual_url ? (
							// biome-ignore lint/performance/noImgElement: dynamic external poster
							<img
								src={data.agent_visual_url}
								alt="Agent Visual"
								className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
							/>
						) : (
							<div className="w-full h-full bg-zinc-900 flex items-center justify-center min-h-[160px]">
								<span className="text-zinc-800 font-display text-6xl font-black select-none">
									{data.agent_name?.charAt(0) || "?"}
								</span>
							</div>
						)
					}
				/>
			</div>
		</div>
	);
};
