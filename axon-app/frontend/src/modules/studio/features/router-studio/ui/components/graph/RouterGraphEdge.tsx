import { motion } from "framer-motion";

interface RouterGraphEdgeProps {
	fromX: number;
	fromY: number;
	toX: number;
	toY: number;
	type?: "solid" | "dashed";
}

export const RouterGraphEdge = ({ fromX, fromY, toX, toY, type = "solid" }: RouterGraphEdgeProps) => {
	const isDashed = type === "dashed";

	return (
		<motion.path
			d={`M ${fromX} ${fromY} L ${toX} ${toY}`}
			stroke="currentColor"
			strokeWidth="2"
			strokeDasharray={isDashed ? "4 4" : "0"}
			initial={{ pathLength: 0, opacity: 0 }}
			animate={{ pathLength: 1, opacity: 0.3 }}
			transition={{ duration: 1, ease: "easeInOut" }}
			className="text-primary/40"
			fill="none"
		/>
	);
};
