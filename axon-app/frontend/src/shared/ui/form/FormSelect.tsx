import { Check, ChevronDown, Search, X } from "lucide-react";
import type React from "react";
import Image from "next/image";
import { cn } from "@/shared/lib/utils";
import { Badge } from "@/shared/ui/ui/Badge";
import { StatusBadge } from "@/shared/ui/complex/StatusBadge";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@/shared/ui/ui/DropdownMenu";
import type { FormSelectProps } from "@/shared/types/form/FormSelect.types";
import { useFormSelect } from "@/shared/hooks/form/useFormSelect";

export const FormSelect = (props: FormSelectProps) => {
	const {
		search,
		setSearch,
		selectedIds,
		selectedOptions,
		filteredOptions,
		handleSelect,
		handleOpenChange,
	} = useFormSelect(props);

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
				"w-full p-6 rounded-2xl border border-zinc-200 dark:border-white/20 bg-zinc-50 dark:bg-zinc-800/40 hover:border-zinc-900 dark:hover:border-primary/50 hover:bg-[#141416] transition-all flex items-center justify-between group shadow-sm outline-none text-left cursor-pointer",
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
								className="bg-primary/10 text-primary border-primary/20 flex items-center gap-3 py-2.5 px-3 pr-2 rounded-2xl h-auto"
							>
								{opt.avatarUrl && (
									<div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-primary/20 shrink-0 bg-black shadow-lg">
										<Image 
											src={opt.avatarUrl} 
											alt={opt.name} 
											fill 
											className="object-cover object-top scale-110" 
										/>
									</div>
								)}
								<div className="flex flex-col">
									<span className="text-[14px] font-bold tracking-tight leading-tight">{opt.name}</span>
									{opt.subtitle && (
										<span className="text-[10px] opacity-70 font-mono leading-tight mt-0.5">{opt.subtitle}</span>
									)}
								</div>
								<X
									size={14}
									className="cursor-pointer hover:text-white ml-1 opacity-50 hover:opacity-100 transition-opacity"
									onClick={(e) => {
										e.stopPropagation();
										handleSelect(opt.id);
									}}
								/>
							</Badge>
						))
					) : (
						<div className="flex items-center gap-4">
							{selectedOptions[0]?.avatarUrl && (
								<div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-primary/10 shrink-0 bg-black">
									<Image 
										src={selectedOptions[0].avatarUrl} 
										alt={selectedOptions[0].name} 
										fill 
										className="object-cover object-top scale-110" 
									/>
								</div>
							)}
							{selectedOptions[0]?.icon && (
								<div className="p-2 rounded-lg bg-zinc-800 text-zinc-400 shrink-0">
									{selectedOptions[0].icon}
								</div>
							)}
							<div className="flex flex-col">
								{selectedOptions[0]?.variant ? (
									<StatusBadge 
										status={selectedOptions[0].name} 
										variant={selectedOptions[0].variant as any} 
									/>
								) : (
									<span className="text-base font-bold text-zinc-900 dark:text-white leading-none">
										{selectedOptions[0]?.name || placeholder}
									</span>
								)}
								{selectedOptions[0]?.subtitle && (
									<span className="text-[10px] text-zinc-400 font-mono mt-1">
										{selectedOptions[0].subtitle}
									</span>
								)}
							</div>
						</div>
					)
				) : (
					<span className="text-zinc-400 font-bold">{placeholder}</span>
				)}
			</div>
			<ChevronDown className="w-5 h-5 text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors shrink-0 ml-4" />
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
					<Search className="absolute left-4 w-4 h-4 text-zinc-400" />
					<input
						placeholder={searchPlaceholder}
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="w-full bg-zinc-100 dark:bg-zinc-900/60 border border-zinc-200 dark:border-white/10 rounded-xl h-12 pl-12 pr-4 text-sm font-bold text-zinc-900 dark:text-white focus:border-primary outline-none transition-all"
					/>
				</div>

				<div className="max-h-[400px] overflow-y-auto custom-scrollbar p-1">
					<DropdownMenuLabel className="px-4 py-3 text-[10px] font-mono uppercase tracking-widest text-zinc-400">
						All Options
					</DropdownMenuLabel>
					{filteredOptions.map((opt) => (
						<DropdownMenuItem
							key={opt.id}
							disabled={opt.disabled}
							onClick={() => !opt.disabled && handleSelect(opt.id)}
							className={cn(
								"px-4 py-4 rounded-xl flex items-center justify-between group transition-colors",
								opt.disabled 
									? "opacity-40 grayscale cursor-not-allowed pointer-events-none" 
									: "hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
							)}
						>
							<div className="flex items-center gap-4">
								{opt.avatarUrl && (
									<div className={cn(
										"relative w-10 h-10 rounded-full overflow-hidden border-2 shrink-0 bg-black",
										opt.disabled ? "border-zinc-800" : "border-primary/10"
									)}>
										<Image 
											src={opt.avatarUrl} 
											alt={opt.name} 
											fill 
											className="object-cover object-top scale-110" 
										/>
									</div>
								)}
								{opt.icon && (
									<div className={cn(
										"p-1.5 rounded-md text-zinc-400 shrink-0",
										opt.disabled ? "bg-zinc-900/50" : "bg-white/5 group-hover:bg-white/10 group-hover:text-zinc-200 transition-colors"
									)}>
										{opt.icon}
									</div>
								)}
								<div className="flex flex-col">
									{opt.variant ? (
										<StatusBadge status={opt.name} variant={opt.variant as any} />
									) : (
										<span className={cn(
											"text-[16px] font-bold transition-colors",
											opt.disabled 
												? "text-zinc-600" 
												: "text-zinc-900 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-white"
										)}>
											{opt.name}
										</span>
									)}
									{opt.subtitle && (
										<span className={cn(
											"text-[14px] font-mono",
											opt.disabled ? "text-zinc-700" : "text-zinc-400"
										)}>
											{opt.subtitle}
										</span>
									)}
								</div>
							</div>
							<div className="flex items-center gap-3">
								{opt.badgeLabel && (
									<Badge 
										variant="outline" 
										className={cn(
											"text-[10px] font-black uppercase px-2 py-0.5 rounded-lg tracking-wider",
											opt.disabled 
												? "border-zinc-800 text-zinc-700" 
												: "border-blue-500/30 bg-blue-500/10 text-blue-400"
										)}
									>
										{opt.badgeLabel}
									</Badge>
								)}
								{selectedIds.includes(opt.id) && !opt.disabled && (
									<Check className="w-4 h-4 text-primary" />
								)}
							</div>
						</DropdownMenuItem>
					))}
					{filteredOptions.length === 0 && (
						<div className="p-8 text-center text-zinc-400 text-xs font-mono">
							No options found
						</div>
					)}
				</div>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
