import { X } from "lucide-react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/shared/lib/utils";
import { SearchInput } from "@/shared/ui/complex/SearchInput";
import { FilterBigMenu } from "@/shared/ui/complex/FilterBigMenu";
import { Button } from "@/shared/ui/ui/Button";
import { Badge } from "@/shared/ui/ui/Badge";
import { ScrollArea } from "@/shared/ui/ui/ScrollArea";
import type { FilterGroup } from "@/shared/domain/filters";
import type { SkillViewItem } from "../../application/hooks/sections/useInternalSkillsModal";

interface InternalSkillsModalProps {
	readonly isOpen: boolean;
	readonly onOpenChange: (open: boolean) => void;
	readonly onAddFunction: (functionId: string) => void;
	readonly searchQuery: string;
	readonly onSearchChange: (query: string) => void;
	readonly filterGroups: FilterGroup[];
	readonly onApplyFilters: (selectedIds: string[]) => void;
	readonly onClearFilters: () => void;
	readonly skills: readonly SkillViewItem[];
}

export const InternalSkillsModal = ({
	isOpen,
	onOpenChange,
	onAddFunction,
	searchQuery,
	onSearchChange,
	filterGroups,
	onApplyFilters,
	onClearFilters,
	skills,
}: InternalSkillsModalProps) => {
	return (
		<DialogPrimitive.Root open={isOpen} onOpenChange={onOpenChange}>
			<DialogPrimitive.Portal>
				<DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />

				<DialogPrimitive.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-2xl translate-x-[-50%] translate-y-[-50%] duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
					<div className="bg-white dark:bg-[#16161a] border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
						{/* Header */}
						<div className="px-6 py-4 border-b border-zinc-200 dark:border-white/5 flex items-center justify-between shrink-0">
							<DialogPrimitive.Title className="text-lg font-bold font-display tracking-tight text-zinc-900 dark:text-white">
								Select Skill (Internal Skills)
							</DialogPrimitive.Title>
							<DialogPrimitive.Close className="rounded-full p-1.5 text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/10 transition-all outline-none">
								<X size={18} />
							</DialogPrimitive.Close>
						</div>

						{/* Filters & Search */}
						<div className="p-4 border-b border-zinc-200 dark:border-white/5 bg-zinc-50/50 dark:bg-black/20 flex flex-col gap-3 shrink-0">
							<SearchInput
								value={searchQuery}
								onChange={onSearchChange}
								placeholder="Search functions..."
								className="h-10"
							/>
							<div className="flex items-center gap-2">
								<FilterBigMenu
									groups={filterGroups}
									onApply={onApplyFilters}
									onClearAll={onClearFilters}
									resultsCount={skills.length}
								/>
							</div>
						</div>

						{/* List */}
						<ScrollArea className="flex-1 p-4 bg-zinc-50 dark:bg-[#16161a]">
							<div className="space-y-3">
								{skills.length === 0 ? (
									<div className="py-12 text-center text-zinc-500 font-mono text-sm">
										No results found
									</div>
								) : (
									skills.map((fn) => {
										return (
											<div
												key={fn.id}
												className="flex items-start justify-between gap-4 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/30 shadow-sm transition-all hover:border-zinc-300 dark:hover:border-zinc-700"
											>
												<div className="space-y-1">
													<div className="flex items-center gap-2">
														<span className="font-bold text-zinc-900 dark:text-white text-base">
															{fn.name}
														</span>
														{fn.category && (
															<Badge
																variant="outline"
																className="text-[10px] uppercase tracking-wider text-zinc-500 border-zinc-200 dark:border-zinc-800"
															>
																{fn.category}
															</Badge>
														)}
													</div>
													<p className="text-sm text-zinc-500 dark:text-zinc-400">
														{fn.desc}
													</p>
												</div>

												<div className="shrink-0 pt-1">
													<Button
														type="button"
														variant={fn.isAdded ? "secondary" : "default"}
														size="sm"
														disabled={fn.isAdded}
														onClick={(e) => {
															e.preventDefault();
															e.stopPropagation();
															if (!fn.isAdded) {
																onAddFunction(fn.id);
															}
														}}
														className={cn(
															"h-8 px-3 text-xs font-bold transition-all",
															fn.isAdded
																? "bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500 cursor-not-allowed opacity-70"
																: "bg-black text-white dark:bg-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200"
														)}
													>
														{fn.isAdded ? "Added" : "+ Add Functions"}
													</Button>
												</div>
											</div>
										);
									})
								)}
							</div>
						</ScrollArea>
					</div>
				</DialogPrimitive.Content>
			</DialogPrimitive.Portal>
		</DialogPrimitive.Root>
	);
};
