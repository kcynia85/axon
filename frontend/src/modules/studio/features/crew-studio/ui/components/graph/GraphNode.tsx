import { motion } from "framer-motion";
import { Avatar, AvatarImage, AvatarFallback } from "@/shared/ui/ui/Avatar";
import { cn } from "@/shared/lib/utils";

interface GraphNodeProps {
	name: string;
	avatarUrl?: string;
	type: "manager" | "member" | "task" | "crew";
	x: number;
	y: number;
	sequenceNumber?: number;
}

export const GraphNode = ({ name, avatarUrl, type, x, y, sequenceNumber }: GraphNodeProps) => {
	const isManager = type === "manager";
	const isCrew = type === "crew";
	const isTask = type === "task";

	return (
		<motion.g
			initial={{ scale: 0, opacity: 0 }}
			animate={{ x, y, scale: 1, opacity: 1 }}
			transition={{ type: "spring", stiffness: 200, damping: 20 }}
		>
			{/* Glow for Manager/Crew */}
			{(isManager || isCrew) && (
				<motion.circle
					r={isCrew ? "80" : "60"}
					fill="var(--primary)"
					className="opacity-20 blur-3xl"
					animate={{ scale: [1, 1.2, 1] }}
					transition={{ duration: 4, repeat: Infinity }}
				/>
			)}

			<foreignObject x="-100" y="-110" width="200" height="220">
				<div className="flex flex-col items-center justify-center h-full gap-4 p-2 relative overflow-visible">
					
					{!isCrew ? (
						<>
							<div className={cn(
								"relative flex items-center justify-center transition-all duration-500",
								isManager ? "text-primary" : "text-zinc-500"
							)}>
								{/* Sequence Number Badge - Centered vertically on left edge of avatar */}
								{sequenceNumber && (
									<div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-primary text-black flex items-center justify-center text-xs font-black border-4 border-black z-20 shadow-2xl">
										{sequenceNumber}
									</div>
								)}

								<div className={cn(
									"relative p-1 rounded-full border-2 transition-all duration-500 shadow-xl",
									isManager ? "border-primary bg-primary/10" : "border-zinc-800 bg-zinc-900",
									isTask ? "border-primary/30" : ""
								)}>
									<Avatar className="w-16 h-16 border-2 border-black">
										<AvatarImage src={avatarUrl} alt={name} className="object-cover" />
										<AvatarFallback className="bg-zinc-800 text-sm font-bold text-zinc-500">
											{name.charAt(0)}
										</AvatarFallback>
									</Avatar>
								</div>
							</div>
							
							<div className="flex flex-col items-center text-center w-full px-1">
								<div className={cn(
									"px-4 py-2 rounded-xl border border-white/5 shadow-2xl",
									isManager ? "bg-primary/20 border-primary/20" : "bg-black/80 backdrop-blur-md"
								)}>
									<span className={cn(
										"text-[16px] font-black uppercase tracking-tight leading-tight line-clamp-2 w-full",
										isManager ? "text-primary" : "text-zinc-50"
									)}>
										{name}
									</span>
								</div>
							</div>
						</>
					) : (
						<div className="w-32 h-32 rounded-full border-4 border-primary/30 bg-black backdrop-blur-xl flex items-center justify-center p-4 shadow-[0_0_50px_rgba(var(--primary),0.2)]">
							<span className={cn(
								"text-[14px] font-black uppercase tracking-tighter text-primary text-center leading-tight line-clamp-3"
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
