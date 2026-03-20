import { motion } from "framer-motion";
import { Library, Plus, X } from "lucide-react";
import type React from "react";
import type { StudioEntryProps } from "../../../types/discovery.types";

export const StudioEntry = ({
	emptyLabel,
	emptySublabel,
	libraryLabel,
	librarySublabel,
	onSelectEmpty,
	onShowLibrary,
	onExit,
}: StudioEntryProps) => {
	return (
		<motion.div
			key="choice"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			className="flex w-full h-full"
		>
			{/* EXIT BUTTON */}
			<button
				type="button"
				onClick={onExit}
				className="absolute top-8 left-8 z-50 text-zinc-500 hover:text-white transition-colors outline-none"
				aria-label="Exit Studio"
			>
				<X className="w-8 h-8" />
			</button>

			{/* LEFT: EMPTY BLUEPRINT */}
			<button
				type="button"
				onClick={onSelectEmpty}
				className="group relative flex-1 border-r border-zinc-900 flex flex-col items-center justify-center cursor-pointer hover:bg-zinc-950 transition-all duration-700 outline-none text-left"
			>
				<div className="absolute inset-0 bg-radial-gradient from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

				<div className="relative z-10 space-y-8 text-center">
					<div className="w-24 h-24 rounded-full border-2 border-zinc-800 flex items-center justify-center group-hover:border-primary group-hover:scale-110 transition-all duration-500 mx-auto">
						<Plus className="w-10 h-10 text-zinc-500 group-hover:text-primary transition-colors" />
					</div>
					<div className="space-y-2">
						<h2 className="text-4xl font-black font-display uppercase tracking-tighter text-white">
							{emptyLabel}
						</h2>
						<p className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest">
							{emptySublabel}
						</p>
					</div>
				</div>
			</button>

			{/* RIGHT: ARCHETYPE CATALOG */}
			<button
				type="button"
				onClick={onShowLibrary}
				className="group relative flex-1 flex flex-col items-center justify-center cursor-pointer hover:bg-zinc-950 transition-all duration-700 outline-none text-left"
			>
				<div className="absolute inset-0 bg-radial-gradient from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

				<div className="relative z-10 space-y-8 text-center">
					<div className="w-24 h-24 rounded-full border-2 border-zinc-800 flex items-center justify-center group-hover:border-blue-500 group-hover:scale-110 transition-all duration-500 mx-auto">
						<Library className="w-10 h-10 text-zinc-500 group-hover:text-blue-500 transition-colors" />
					</div>
					<div className="space-y-2">
						<h2 className="text-4xl font-black font-display uppercase tracking-tighter text-white">
							{libraryLabel}
						</h2>
						<p className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest">
							{librarySublabel}
						</p>
					</div>
				</div>
			</button>
		</motion.div>
	);
};
