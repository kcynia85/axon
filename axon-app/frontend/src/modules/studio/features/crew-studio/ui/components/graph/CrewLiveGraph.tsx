import { useFormContext, useWatch } from "react-hook-form";
import { useCrewGraph } from "../../../application/useCrewGraph";
import { GraphNode } from "./GraphNode";
import { GraphEdge } from "./GraphEdge";
import { AnimatePresence, motion } from "framer-motion";
import type { CrewStudioFormData } from "../../../types/crew-schema";
import { Badge } from "@/shared/ui/ui/Badge";
import { useState, useCallback } from "react";

interface CrewLiveGraphProps {
	availableAgents: { id: string; name: string; subtitle?: string; avatarUrl?: string }[];
}

export const CrewLiveGraph = ({ availableAgents }: CrewLiveGraphProps) => {
	const { nodes, edges } = useCrewGraph({ availableAgents });
	const { control } = useFormContext<CrewStudioFormData>();
	const type = useWatch({ control, name: "crew_process_type" });
	const [zoom, setZoom] = useState(1);

	const handleZoomIn = useCallback(() => setZoom(prev => Math.min(prev + 0.1, 2.5)), []);
	const handleZoomOut = useCallback(() => setZoom(prev => Math.max(prev - 0.1, 0.4)), []);

	const handleWheel = (e: React.WheelEvent) => {
		if (e.metaKey || e.ctrlKey) {
			e.preventDefault();
			if (e.deltaY < 0) {
				handleZoomIn();
			} else {
				handleZoomOut();
			}
		}
	};

	return (
		<div 
			className="w-full aspect-[4/5] bg-zinc-950/50 rounded-[40px] border border-zinc-800/50 relative overflow-hidden group shadow-2xl cursor-grab active:cursor-grabbing"
			onWheel={handleWheel}
		>
			{/* Crew Type Badge - Fixed Position */}
			<div className="absolute top-8 left-8 z-30 pointer-events-none">
				<Badge 
					variant="outline" 
					className="text-[10px] font-bold uppercase tracking-widest bg-white border-white px-2.5 py-0.5 rounded-lg text-black shadow-lg"
				>
					{type}
				</Badge>
			</div>

			<motion.div 
				className="w-full h-full relative z-10"
				drag
				dragMomentum={false}
				dragElastic={0.1}
			>
				{/* Grid Background - Drags with content */}
				<div className="absolute inset-[-100%] opacity-10 pointer-events-none" 
					style={{ 
						backgroundImage: `radial-gradient(circle at 1px 1px, var(--primary) 1px, transparent 0)`,
						backgroundSize: '24px 24px' 
					}} 
				/>
				
				<svg 
					viewBox="0 0 500 600" 
					className="w-full h-full relative z-10 p-8 overflow-visible"
					preserveAspectRatio="xMidYMid meet"
				>
					<motion.g
						animate={{ 
							scale: zoom,
							transition: { type: "spring", stiffness: 300, damping: 30 }
						}}
						style={{ originX: "250px", originY: "300px" }}
					>
						<AnimatePresence>
							{/* Render Edges first so they appear behind nodes */}
							{edges.map((edge) => {
								const fromNode = nodes.find(n => n.id === edge.from);
								const toNode = nodes.find(n => n.id === edge.to);
								if (!fromNode || !toNode) return null;

								return (
									<GraphEdge
										key={edge.id}
										fromX={fromNode.x}
										fromY={fromNode.y}
										toX={toNode.x}
										toY={toNode.y}
										type={edge.type}
									/>
								);
							})}

							{/* Render Nodes */}
							{nodes.map((node) => (
								<GraphNode
									key={node.id}
									type={node.type}
									name={node.name}
									avatarUrl={node.avatarUrl}
									x={node.x}
									y={node.y}
									sequenceNumber={node.sequenceNumber}
								/>
							))}
						</AnimatePresence>
					</motion.g>
				</svg>
			</motion.div>
		</div>
	);
};
