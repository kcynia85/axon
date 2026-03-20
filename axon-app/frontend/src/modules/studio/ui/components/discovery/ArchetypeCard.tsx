import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type React from "react";
import type { ArchetypeCardProps } from "../../../types/discovery.types";

export const ArchetypeCard = ({
	archetype,
	onSelect,
	renderIcon,
}: ArchetypeCardProps) => {
	return (
		<motion.button
			type="button"
			layoutId={archetype.id}
			onClick={() => onSelect(archetype)}
			className="group bg-zinc-900/20 border border-zinc-900 p-8 rounded-[2rem] hover:border-blue-500/50 hover:bg-zinc-900/40 transition-all cursor-pointer flex flex-col justify-between h-[300px] relative overflow-hidden text-left outline-none"
		>
			{/* ICON BG DECOR */}
			<div className="absolute -top-4 -right-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
				{renderIcon(archetype.icon, 160)}
			</div>

			<div className="space-y-4 relative z-10">
				<div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:border-blue-500 group-hover:scale-110 transition-all">
					{renderIcon(archetype.icon, 24, "text-blue-500")}
				</div>
				<div className="space-y-1">
					<h4 className="text-xl font-bold font-display uppercase tracking-tight text-white">
						{archetype.name}
					</h4>
					<p className="text-xs text-zinc-500 leading-relaxed line-clamp-3 group-hover:text-zinc-300 transition-colors">
						{archetype.description}
					</p>
				</div>
			</div>

			<div className="flex items-center justify-between relative z-10">
				<span className="text-[10px] font-mono uppercase tracking-widest text-blue-500/50">
					{archetype.category}
				</span>
				<div className="w-10 h-10 rounded-full bg-blue-500 text-black flex items-center justify-center opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all">
					<ArrowRight size={20} />
				</div>
			</div>
		</motion.button>
	);
};
