import { Check, ChevronDown, Clock, Search, X } from "lucide-react";
import type React from "react";
import { cn } from "@/shared/lib/utils";
import { Badge } from "@/shared/ui/ui/Badge";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/shared/ui/ui/DropdownMenu";
import type { SearchableSelectProps } from "@/shared/types/form/SearchableSelect.types";
import { useSearchableSelect } from "@/shared/hooks/form/useSearchableSelect";

export const SearchableSelect = (props: SearchableSelectProps) => {
	const {
		search,
		setSearch,
		selectedIds,
		selectedOptions,
		filteredOptions,
		recentOptions,
		handleSelect,
		handleOpenChange,
	} = useSearchableSelect(props);

	const {
		multiple = false,
		placeholder = "Select option...",
		searchPlaceholder = "Search...",
		className,
		renderTrigger,
	} = props;

	const defaultTrigger = (
		<div
			className={cn(
				"w-full p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/30 hover:border-zinc-900 dark:hover:border-zinc-600 transition-all flex items-center justify-between group shadow-sm outline-none text-left cursor-pointer",
				className,
			)}
		>
			<div className="flex flex-wrap items-center gap-2">
				{selectedOptions.length > 0 ? (
					multiple ? (
						selectedOptions.map((opt) => (
							<Badge
								key={opt.id}
								variant="secondary"
								className="bg-primary/10 text-primary border-primary/20 flex items-center gap-1 py-1 px-3"
							>
								{opt.name}
								<X
									size={10}
									className="cursor-pointer hover:text-white"
									onClick={(e) => {
										e.stopPropagation();
										handleSelect(opt.id);
									}}
								/>
							</Badge>
						))
					) : (
						<div className="flex items-center gap-6">
							<span className="text-base font-bold text-zinc-900 dark:text-white">
								{selectedOptions[0].name}
							</span>
							{selectedOptions[0].subtitle && (
								<Badge
									variant="outline"
									className="text-[12px] border-zinc-200 dark:border-zinc-700 tracking-tighter text-zinc-500 shrink-0"
								>
									{selectedOptions[0].subtitle}
								</Badge>
							)}
						</div>
					)
				) : (
					<span className="text-zinc-500 font-bold">{placeholder}</span>
				)}
			</div>
			<ChevronDown className="w-5 h-5 text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors shrink-0 ml-4" />
		</div>
	);

	return (
		<DropdownMenu onOpenChange={handleOpenChange}>
			<DropdownMenuTrigger asChild>
				{renderTrigger ? renderTrigger(selectedOptions) : defaultTrigger}
			</DropdownMenuTrigger>
			<DropdownMenuContent
				className="w-[var(--radix-dropdown-menu-trigger-width)] bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 p-2 rounded-2xl shadow-2xl z-[250]"
				align="start"
				sideOffset={8}
			>
				<div className="p-2 relative flex items-center">
					<Search className="absolute left-5 w-4 h-4 text-zinc-500" />
					<input
						placeholder={searchPlaceholder}
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="w-full bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl h-12 pl-12 pr-4 text-sm font-bold text-zinc-900 dark:text-white focus:border-primary outline-none transition-all"
					/>
				</div>

				<div className="max-h-[400px] overflow-y-auto custom-scrollbar p-1">
					{recentOptions.length > 0 && !search && (
						<>
							<DropdownMenuLabel className="px-4 py-3 text-[10px] font-mono uppercase tracking-widest text-zinc-500 flex items-center gap-2">
								<Clock size={12} /> Recently Used
							</DropdownMenuLabel>
							{recentOptions.map((opt) => (
								<DropdownMenuItem
									key={`recent-${opt.id}`}
									onClick={() => handleSelect(opt.id)}
									className="px-4 py-4 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer flex items-center justify-between group transition-colors"
								>
									<div className="flex items-center gap-4">
										<span className="text-sm font-bold text-zinc-900 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-white">
											{opt.name}
										</span>
										{opt.subtitle && (
											<Badge
												variant="outline"
												className="text-[10px] border-zinc-200 dark:border-zinc-700 tracking-tighter text-zinc-500"
											>
												{opt.subtitle}
											</Badge>
										)}
									</div>
									{selectedIds.includes(opt.id) && (
										<Check className="w-4 h-4 text-primary" />
									)}
								</DropdownMenuItem>
							))}
							<DropdownMenuSeparator className="bg-zinc-100 dark:bg-zinc-800 my-2" />
						</>
					)}

					<DropdownMenuLabel className="px-4 py-3 text-[10px] font-mono uppercase tracking-widest text-zinc-500">
						All Options
					</DropdownMenuLabel>
					{filteredOptions.map((opt) => (
						<DropdownMenuItem
							key={opt.id}
							onClick={() => handleSelect(opt.id)}
							className="px-4 py-4 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer flex items-center justify-between group transition-colors"
						>
							<div className="flex items-center gap-4">
								<span className="text-sm font-bold text-zinc-900 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-white">
									{opt.name}
								</span>
								{opt.subtitle && (
									<Badge
										variant="outline"
										className="text-[10px] border-zinc-200 dark:border-zinc-800 text-zinc-500"
									>
										{opt.subtitle}
									</Badge>
								)}
							</div>
							{selectedIds.includes(opt.id) && (
								<Check className="w-4 h-4 text-primary" />
							)}
						</DropdownMenuItem>
					))}
					{filteredOptions.length === 0 && (
						<div className="p-8 text-center text-zinc-500 text-xs font-mono">
							No options found
						</div>
					)}
				</div>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
