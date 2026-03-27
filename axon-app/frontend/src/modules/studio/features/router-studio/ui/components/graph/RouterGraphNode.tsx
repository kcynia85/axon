import { motion } from "framer-motion";
import { Network, Cpu } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface RouterGraphNodeProps {
	name: string;
	type: "router" | "model";
	x: number;
	y: number;
	sequenceNumber?: number;
}

export const RouterGraphNode = ({ name, type, x, y, sequenceNumber }: RouterGraphNodeProps) => {
	const isRouter = type === "router";

	return (
		<motion.g
			initial={{ scale: 0, opacity: 0 }}
			animate={{ x, y, scale: 1, opacity: 1 }}
			transition={{ type: "spring", stiffness: 200, damping: 20 }}
		>
			{/* Glow for Router */}
			{isRouter && (
				<motion.circle
					r="60"
					fill="var(--primary)"
					className="opacity-20 blur-3xl"
					animate={{ scale: [1, 1.2, 1] }}
					transition={{ duration: 4, repeat: Infinity }}
				/>
			)}

			<foreignObject x="-100" y="-110" width="200" height="220">
				<div className="flex flex-col items-center justify-center h-full gap-4 p-2 relative overflow-visible">
					
					{!isRouter ? (
						<>
							<div className="relative flex items-center justify-center transition-all duration-500 text-zinc-500">
								{/* Sequence Number Badge - Centered vertically on left edge of icon */}
								{sequenceNumber && (
									<div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-primary text-black flex items-center justify-center text-xs font-black border-4 border-black z-20 shadow-2xl">
										{sequenceNumber}
									</div>
								)}

								<div className={cn(
									"relative p-4 rounded-full border-2 transition-all duration-500 shadow-xl",
									"border-zinc-800 bg-zinc-900 border-primary/30"
								)}>
									<Cpu className="w-8 h-8 text-primary" />
								</div>
							</div>
							
							<div className="flex flex-col items-center text-center w-full px-1">
								<div className="px-4 py-2 rounded-xl border border-white/5 shadow-2xl bg-black/80 backdrop-blur-md">
									<span className="text-[16px] font-black uppercase tracking-tight leading-tight line-clamp-2 w-full text-zinc-50">
										{name}
									</span>
								</div>
							</div>
						</>
					) : (
						<div className="w-32 h-32 rounded-full border-4 border-primary/30 bg-black backdrop-blur-xl flex flex-col items-center justify-center p-4 shadow-[0_0_50px_rgba(var(--primary),0.2)] gap-2">
                            <Network className="w-8 h-8 text-primary" />
							<span className={cn(
								"text-[14px] font-black uppercase tracking-tighter text-primary text-center leading-tight line-clamp-2"
							)}>
								{name}
							</span>
						</div>
					)}
				</div>
			</foreignObject>
		</motion.g>
	);
};
