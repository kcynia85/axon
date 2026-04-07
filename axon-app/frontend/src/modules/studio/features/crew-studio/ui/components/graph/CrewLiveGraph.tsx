import { useFormContext, useWatch } from "react-hook-form";
import { useCrewGraph } from "../../../application/useCrewGraph";
import { GraphNode } from "./GraphNode";
import { GraphEdge } from "./GraphEdge";
import { AnimatePresence, motion } from "framer-motion";
import type { CrewStudioFormData } from "../../../types/crew-schema";
import { Badge } from "@/shared/ui/ui/Badge";
import { useState } from "react";

interface CrewLiveGraphProps {
        availableAgents: { id: string; name: string; subtitle?: string; avatarUrl?: string }[];
}

/**
 * CrewLiveGraph: Interactive visualization of the crew structure.
 * Standard: Pure View pattern, Zero manual memoization.
 */
export const CrewLiveGraph = ({ availableAgents }: CrewLiveGraphProps) => {
        const { nodes, edges } = useCrewGraph({ availableAgents });
        const { control } = useFormContext<CrewStudioFormData>();
        const crewProcessType = useWatch({ control, name: "crew_process_type" });
        const [zoomLevel, setZoomLevel] = useState(1);

        const handleZoomIn = () => setZoomLevel(previousZoom => Math.min(previousZoom + 0.1, 2.5));
        const handleZoomOut = () => setZoomLevel(previousZoom => Math.max(previousZoom - 0.1, 0.4));

        const handleWheel = (wheelEvent: React.WheelEvent) => {
                if (wheelEvent.metaKey || wheelEvent.ctrlKey) {
                        wheelEvent.preventDefault();
                        if (wheelEvent.deltaY < 0) {
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
                                        {crewProcessType}
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
                                                        scale: zoomLevel,
                                                        transition: { type: "spring", stiffness: 300, damping: 30 }
                                                }}
                                                style={{ originX: "250px", originY: "300px" }}
                                        >
                                                <AnimatePresence>
                                                        {/* Render Edges first so they appear behind nodes */}
                                                        {edges.map((graphEdge) => {
                                                                const fromNode = nodes.find(nodeItem => nodeItem.id === graphEdge.from);
                                                                const toNode = nodes.find(nodeItem => nodeItem.id === graphEdge.to);
                                                                if (!fromNode || !toNode) return null;

                                                                return (
                                                                        <GraphEdge
                                                                                key={graphEdge.id}
                                                                                fromX={fromNode.x}
                                                                                fromY={fromNode.y}
                                                                                toX={toNode.x}
                                                                                toY={toNode.y}
                                                                                type={graphEdge.type}
                                                                        />
                                                                );
                                                        })}

                                                        {/* Render Nodes */}
                                                        {nodes.map((graphNode) => (
                                                                <GraphNode
                                                                        key={graphNode.id}
                                                                        type={graphNode.type}
                                                                        name={graphNode.name}
                                                                        avatarUrl={graphNode.avatarUrl}
                                                                        x={graphNode.x}
                                                                        y={graphNode.y}
                                                                        sequenceNumber={graphNode.sequenceNumber}
                                                                />
                                                        ))}
                                                </AnimatePresence>
                                        </motion.g>
                                </svg>
                        </motion.div>
                </div>
        );
};
