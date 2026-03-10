"use client";

import { Shield, Zap } from "lucide-react";
import { WorkspaceCard } from "@/shared/ui/complex/WorkspaceCard";
import type { LivePosterProps } from "../../types/components.types";
import { useLivePoster } from "../application/hooks/useLivePoster";

export const LivePoster = (props: LivePosterProps) => {
	const { modelName, inferenceCost, data } = useLivePoster(props);

	return (
		<div className="sticky top-24 w-full max-w-[240px] animate-in fade-in slide-in-from-right-8 duration-700">
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

				<div className="mt-6 space-y-3 px-2">
					<div className="flex justify-between items-center text-[9px] font-mono uppercase tracking-widest opacity-40">
						<span>Model Engine</span>
						<span className="text-primary font-bold">{modelName}</span>
					</div>

					<div className="flex gap-2">
						{data.reflexion && (
							<div className="flex items-center gap-1 px-2 py-1 bg-primary/10 rounded-md border border-primary/20 animate-pulse">
								<Zap className="w-2.5 h-2.5 text-primary" />
								<span className="text-[7px] font-mono uppercase font-bold text-primary">
									Reflexion
								</span>
							</div>
						)}
						{data.grounded_mode && (
							<div className="flex items-center gap-1 px-2 py-1 bg-blue-500/10 rounded-md border border-blue-500/20">
								<Shield className="w-2.5 h-2.5 text-blue-500" />
								<span className="text-[7px] font-mono uppercase font-bold text-blue-500">
									Grounded
								</span>
							</div>
						)}
					</div>

					<div className="h-[1px] w-full bg-zinc-800" />
					<div className="flex justify-between items-center text-[9px] font-mono uppercase tracking-widest opacity-40">
						<span>Inference Cost</span>
						<span className="text-white font-bold text-[8px]">
							{inferenceCost} / 1k tkn
						</span>
					</div>
				</div>
			</div>
		</div>
	);
};
