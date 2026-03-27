import React, { useState, useCallback } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { useRouterGraph } from "../../../application/useRouterGraph";
import { RouterGraphNode } from "./RouterGraphNode";
import { RouterGraphEdge } from "./RouterGraphEdge";
import { AnimatePresence, motion } from "framer-motion";
import type { RouterFormData } from "../../../types/router-schema";
import { Badge } from "@/shared/ui/ui/Badge";

export const RouterLiveGraph = () => {
	const { nodes, edges } = useRouterGraph();
	const { control } = useFormContext<RouterFormData>();
	const strategy = useWatch({ control, name: "strategy" }) || "fallback";
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
			<div className="absolute top-8 left-8 z-30 pointer-events-none">
				<Badge 
					variant="outline" 
					className="text-[10px] font-bold uppercase tracking-widest bg-white border-white px-2.5 py-0.5 rounded-lg text-black shadow-lg"
				>
					{strategy === "fallback" ? "Fallback" : "Load Balancer"}
				</Badge>
			</div>

			<motion.div 
				className="w-full h-full relative z-10"
				drag
				dragMomentum={false}
				dragElastic={0.1}
			>
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
							{edges.map((edge) => {
								const fromNode = nodes.find(n => n.id === edge.from);
								const toNode = nodes.find(n => n.id === edge.to);
								if (!fromNode || !toNode) return null;

								return (
									<RouterGraphEdge
										key={edge.id}
										fromX={fromNode.x}
										fromY={fromNode.y}
										toX={toNode.x}
										toY={toNode.y}
										type={edge.type}
									/>
								);
							})}

							{nodes.map((node) => (
								<RouterGraphNode
									key={node.id}
									type={node.type}
									name={node.name}
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
