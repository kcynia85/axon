import { motion } from "framer-motion";
import { Search, X } from "lucide-react";
import type React from "react";
import { cn } from "@/shared/lib/utils";
import { Input } from "@/shared/ui/ui/Input";
import type { DiscoveryLibraryProps } from "../../../types/discovery.types";
import { ArchetypeCard } from "./ArchetypeCard";

export const DiscoveryLibrary = ({
	title,
	searchQuery,
	setSearchQuery,
	activeCategory,
	setActiveCategory,
	allCategories,
	displayedArchetypes,
	onBack,
	onSelectArchetype,
	renderIcon,
}: DiscoveryLibraryProps) => {
	return (
		<motion.div
			key="library"
			initial={{ x: "100%" }}
			animate={{ x: 0 }}
			exit={{ x: "100%" }}
			transition={{ type: "spring", damping: 30, stiffness: 200 }}
			className="absolute inset-0 bg-black flex flex-col"
		>
			{/* HEADER */}
			<header className="h-24 border-b border-zinc-900 flex items-center justify-between px-12 shrink-0">
				<div className="flex items-center gap-8">
					<button
						type="button"
						onClick={onBack}
						className="text-zinc-500 hover:text-white flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest group outline-none"
					>
						<X className="w-4 h-4 group-hover:rotate-90 transition-transform" />{" "}
						Back
					</button>
					<h3 className="text-2xl font-black font-display uppercase italic tracking-tighter text-white">
						{title}
					</h3>
				</div>

				<div className="flex items-center gap-4 w-96 relative">
					<Search className="absolute left-4 w-4 h-4 text-zinc-600" />
					<Input
						placeholder="Search..."
						className="bg-zinc-900/50 border-zinc-800 h-12 pl-12 rounded-full focus:border-blue-500 transition-all"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
				</div>
			</header>

			{/* CONTENT */}
			<main className="flex-1 flex overflow-hidden">
				{/* SIDEBAR CATEGORIES */}
				<aside className="w-64 border-r border-zinc-900 p-8 space-y-8">
					<div className="space-y-4">
						<p className="text-[10px] font-mono uppercase tracking-widest text-zinc-600">
							Category
						</p>
						<nav className="space-y-2">
							{allCategories.map((cat) => (
								<button
									type="button"
									key={cat}
									onClick={() => setActiveCategory(cat)}
									className={cn(
										"block w-full text-left px-4 py-2 rounded-lg text-sm transition-all outline-none",
										activeCategory === cat
											? "bg-white text-black font-bold"
											: "text-zinc-500 hover:text-white hover:bg-zinc-900",
									)}
								>
									{cat}
								</button>
							))}
						</nav>
					</div>
				</aside>

				{/* GRID */}
				<div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
						{displayedArchetypes.map((archetype) => (
							<ArchetypeCard
								key={archetype.id}
								archetype={archetype}
								onSelect={onSelectArchetype}
								renderIcon={renderIcon}
							/>
						))}
					</div>

					{displayedArchetypes.length === 0 && (
						<div className="h-full flex flex-col items-center justify-center text-zinc-500 space-y-4">
							<Search className="w-12 h-12 opacity-20" />
							<p className="font-mono text-[10px] uppercase tracking-widest">
								No results found matching your criteria
							</p>
						</div>
					)}
				</div>
			</main>
		</motion.div>
	);
};
